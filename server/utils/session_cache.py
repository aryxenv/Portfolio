"""In-memory bounded session cache with Least Recently Used (LRU) and TTL eviction.

Stores native Microsoft Agent Framework AgentSession instances in memory with
fixed capacity and idle timeout to prevent memory leaks on resource-constrained hosts.
"""
from __future__ import annotations

import os
import time
from collections import OrderedDict
from typing import Callable
from agent_framework import AgentSession


class BoundedSessionCache:
    """Bounded LRU session cache with expiration timestamps."""

    def __init__(
        self,
        max_size: int = 50,
        ttl_seconds: int = 1800,
    ) -> None:
        self.max_size = max_size
        self.ttl_seconds = ttl_seconds
        self._cache: OrderedDict[str, tuple[float, AgentSession]] = OrderedDict()

    def get(self, session_id: str) -> AgentSession | None:
        """Retrieve active session, evicting if expired or refreshing LRU position."""
        if session_id not in self._cache:
            return None

        last_active, session = self._cache[session_id]
        now = time.monotonic()

        # Evict if idle time exceeds TTL
        if now - last_active > self.ttl_seconds:
            del self._cache[session_id]
            return None

        # Move to end to mark as most recently used and refresh timestamp
        self._cache.move_to_end(session_id)
        self._cache[session_id] = (now, session)
        return session

    def set(self, session_id: str, session: AgentSession) -> None:
        """Store or update session, evicting oldest entry if at max capacity."""
        now = time.monotonic()

        if session_id in self._cache:
            self._cache.move_to_end(session_id)
        elif len(self._cache) >= self.max_size:
            # Evict least recently used (oldest) session
            self._cache.popitem(last=False)

        self._cache[session_id] = (now, session)

    def get_or_create(
        self,
        session_id: str,
        factory: Callable[[str], AgentSession],
    ) -> tuple[AgentSession, bool]:
        """Fetch existing session or create and register a new one.

        Returns a tuple of (session, is_new).
        """
        existing = self.get(session_id)
        if existing is not None:
            return existing, False

        new_session = factory(session_id)
        self.set(session_id, new_session)
        return new_session, True

    def delete(self, session_id: str) -> bool:
        """Remove a session from cache. Returns True if removed."""
        if session_id in self._cache:
            del self._cache[session_id]
            return True
        return False

    def __len__(self) -> int:
        return len(self._cache)


# Default cache configuration: 50 sessions maximum, 30-minute idle TTL
DEFAULT_MAX_SESSIONS = int(os.getenv("SESSION_CACHE_MAX_SIZE", "50"))
DEFAULT_SESSION_TTL = int(os.getenv("SESSION_CACHE_TTL_SECONDS", "1800"))

session_cache = BoundedSessionCache(
    max_size=DEFAULT_MAX_SESSIONS,
    ttl_seconds=DEFAULT_SESSION_TTL,
)
