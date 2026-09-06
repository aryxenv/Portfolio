"""Dynamic Deployment Manager for Azure AI Foundry models.

Provides sliding-window RPM tracking, least-loaded dispatch, and transparent
cross-deployment failover for deployments sharing the same Responses API project.
"""
from __future__ import annotations

import logging
import threading
import time
from collections import deque
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger("server.deployment_manager")


@dataclass
class Deployment:
    name: str
    agent: Any
    max_rpm: int = 20
    request_timestamps: deque[float] = field(default_factory=deque)
    rate_limited_until: float = 0.0

    def active_rpm(self, current_time: float, window_seconds: float = 60.0) -> int:
        """Prune timestamps older than window_seconds and return current RPM count."""
        while self.request_timestamps and current_time - self.request_timestamps[0] >= window_seconds:
            self.request_timestamps.popleft()
        return len(self.request_timestamps)

    def is_available(self, current_time: float) -> bool:
        """Check if deployment is clear of active rate-limit backoff."""
        return current_time >= self.rate_limited_until


class DeploymentManager:
    """Thread-safe manager for round-robin and least-loaded model dispatch."""

    def __init__(self, deployments: list[Deployment], window_seconds: float = 60.0):
        if not deployments:
            raise ValueError("DeploymentManager requires at least one deployment.")
        self.deployments = deployments
        self.window_seconds = window_seconds
        self.lock = threading.Lock()

    def get_preferred_deployment(self) -> Deployment:
        """Select the available deployment currently furthest below its RPM ceiling.

        If all deployments are temporarily marked rate limited, selects the one
        whose rate limit backoff expires earliest.
        """
        with self.lock:
            now = time.time()
            available = [d for d in self.deployments if d.is_available(now)]

            if available:
                # Pick deployment with lowest active RPM count in sliding window
                return min(available, key=lambda d: d.active_rpm(now, self.window_seconds))

            # All deployments marked rate-limited; pick the one expiring soonest
            return min(self.deployments, key=lambda d: d.rate_limited_until)

    def get_fallback_deployment(self, failed_deployment_name: str) -> Deployment | None:
        """Retrieve an alternative deployment for failover when the primary encounters 429."""
        with self.lock:
            now = time.time()
            alternatives = [
                d for d in self.deployments
                if d.name != failed_deployment_name and d.is_available(now)
            ]
            if alternatives:
                return min(alternatives, key=lambda d: d.active_rpm(now, self.window_seconds))

            # If no alternative is unflagged, return any other deployment
            other = [d for d in self.deployments if d.name != failed_deployment_name]
            return other[0] if other else None

    def get_deployment(self, name: str) -> Deployment | None:
        """Find a deployment by name."""
        with self.lock:
            for d in self.deployments:
                if d.name == name:
                    return d
            return None

    def is_available(self, name: str) -> bool:
        """Check if deployment with given name exists and is clear of rate limiting."""
        with self.lock:
            now = time.time()
            for d in self.deployments:
                if d.name == name:
                    return d.is_available(now)
            return False

    def record_request(self, deployment_name: str) -> None:
        """Log request timestamp against the specified deployment."""
        with self.lock:
            now = time.time()
            for d in self.deployments:
                if d.name == deployment_name:
                    d.request_timestamps.append(now)
                    break

    def mark_rate_limited(self, deployment_name: str, backoff_seconds: float = 45.0) -> None:
        """Flag deployment as rate limited for backoff_seconds."""
        with self.lock:
            now = time.time()
            for d in self.deployments:
                if d.name == deployment_name:
                    d.rate_limited_until = now + backoff_seconds
                    logger.warning(
                        f"Deployment '{deployment_name}' marked rate limited until {d.rate_limited_until:.1f} "
                        f"({backoff_seconds}s cooldown)"
                    )
                    break

    def get_status(self) -> list[dict[str, Any]]:
        """Return diagnostic snapshot of deployment RPM states."""
        with self.lock:
            now = time.time()
            status: list[dict[str, Any]] = []
            for d in self.deployments:
                status.append({
                    "name": d.name,
                    "active_rpm": d.active_rpm(now, self.window_seconds),
                    "max_rpm": d.max_rpm,
                    "is_available": d.is_available(now),
                    "rate_limited_until": max(0.0, d.rate_limited_until - now),
                })
            return status
