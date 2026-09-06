"""IP-based sliding-window rate limiter for FastAPI routes

Extracts client IP across direct connections, Cloudflare and reverse proxies,
enforcing rolling window request limits with HTTP 429 and Retry-After headers.
"""
from __future__ import annotations

import os
import time
from collections import defaultdict, deque
from fastapi import HTTPException, Request, status


def extract_client_ip(request: Request) -> str:
    """Extract real client IP supporting Cloudflare and reverse proxy headers."""
    # 1. Cloudflare header
    cf_ip = request.headers.get("cf-connecting-ip")
    if cf_ip:
        return cf_ip.strip()

    # 2. X-Forwarded-For (first entry is original client)
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
        if client_ip:
            return client_ip

    # 3. X-Real-IP header
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()

    # 4. Fallback to direct client socket
    if request.client and request.client.host:
        return request.client.host

    return "127.0.0.1"


class SlidingWindowRateLimiter:
    """In-memory sliding window rate limiter per client IP."""

    def __init__(
        self,
        max_requests: int = 5,
        window_seconds: int = 60,
    ) -> None:
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.request_history: dict[str, deque[float]] = defaultdict(deque)

    def _prune_stale_records(self, now: float) -> None:
        """Evict stale client records if cache exceeds threshold."""
        if len(self.request_history) > 2000:
            stale_ips = [
                ip
                for ip, timestamps in self.request_history.items()
                if not timestamps or now - timestamps[-1] > self.window_seconds
            ]
            for ip in stale_ips:
                del self.request_history[ip]

    async def __call__(self, request: Request) -> None:
        now = time.monotonic()
        client_ip = extract_client_ip(request)
        timestamps = self.request_history[client_ip]

        # Evict timestamps outside current sliding window
        window_boundary = now - self.window_seconds
        while timestamps and timestamps[0] <= window_boundary:
            timestamps.popleft()

        # Check threshold
        if len(timestamps) >= self.max_requests:
            retry_after = int(self.window_seconds - (now - timestamps[0])) + 1
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    f"Rate limit exceeded. Maximum {self.max_requests} requests "
                    f"per {self.window_seconds} seconds. Please wait before retrying."
                ),
                headers={"Retry-After": str(max(1, retry_after))},
            )

        # Record this request
        timestamps.append(now)
        self._prune_stale_records(now)


# Default agent rate limiter: 5 requests per 60 seconds (configurable via env)
DEFAULT_MAX_REQUESTS = int(os.getenv("AGENT_RATE_LIMIT_REQUESTS", "5"))
DEFAULT_WINDOW_SECONDS = int(os.getenv("AGENT_RATE_LIMIT_WINDOW_SECONDS", "60"))

agent_rate_limiter = SlidingWindowRateLimiter(
    max_requests=DEFAULT_MAX_REQUESTS,
    window_seconds=DEFAULT_WINDOW_SECONDS,
)
