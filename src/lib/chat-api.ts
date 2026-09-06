/**
 * Client API for Portfolio AI Assistant (FastAPI + Microsoft Agent Framework).
 * Handles streaming responses, session persistence, history retrieval,
 * session deletion, and natural-language error translation.
 */

export type MessageBlock =
  | {
      type: "text";
      content: string;
    }
  | {
      type: "tool_call";
      id: string;
      name: string;
      args?: Record<string, unknown> | string;
      status: "running" | "completed" | "error";
    };

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  blocks?: MessageBlock[];
  isStreaming?: boolean;
  isError?: boolean;
}

export type StreamEvent =
  | { type: "text"; delta: string }
  | { type: "tool_call"; id?: string; call_id?: string; name: string; args?: Record<string, unknown> | string; status?: "running" | "completed" | "error" }
  | { type: "tool_result"; call_id?: string; name?: string }
  | { type: "error"; message: string }
  | { type: "done" };

export interface StreamChatParams {
  query: string;
  sessionId?: string | null;
  onSessionId?: (sessionId: string) => void;
  onChunk: (chunk: string) => void;
  onEvent?: (event: StreamEvent) => void;
  onDone: () => void;
  onError: (errorMsg: string) => void;
  signal?: AbortSignal;
}

const STORAGE_KEY = "portfolio_chat_session_id";

// Safe API base resolution for Astro client islands
export const getApiBaseUrl = (): string => {
  if (typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_API_URL) {
    return import.meta.env.PUBLIC_API_URL.replace(/\/+$/, "");
  }
  return "http://localhost:8000";
};

export const getStoredSessionId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setStoredSessionId = (sessionId: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, sessionId);
  } catch {
    // ignore storage quota / private mode errors
  }
};

export const clearStoredSessionId = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

/**
 * Fetch conversation history for a saved session.
 */
export async function fetchChatHistory(
  sessionId: string
): Promise<Array<{ role: "user" | "assistant"; content: string; blocks?: MessageBlock[] }>> {
  try {
    const url = `${getApiBaseUrl()}/agent/history?session_id=${encodeURIComponent(sessionId)}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      if (res.status === 404) {
        clearStoredSessionId();
      }
      return [];
    }

    const data = await res.json();
    if (Array.isArray(data.messages)) {
      return data.messages;
    }
    return [];
  } catch (err) {
    console.warn("Could not retrieve session history:", err);
    return [];
  }
}

/**
 * Deletes a session from server cache and local storage.
 */
export async function deleteChatSession(sessionId: string): Promise<boolean> {
  clearStoredSessionId();
  try {
    const url = `${getApiBaseUrl()}/agent/history?session_id=${encodeURIComponent(sessionId)}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    return res.ok;
  } catch (err) {
    console.warn("Could not clear session on server:", err);
    return false;
  }
}

/**
 * Friendly natural-language fallback messages.
 * Prevents raw Python stack traces, 500 status codes, or JSON detail dumps
 * from ever being shown to visitors.
 */
export function getCleanErrorMessage(err: unknown, status?: number): string {
  if (status === 429) {
    return "Aryan's assistant is currently experiencing a high volume of requests. Please wait a short moment and try again.";
  }

  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes("failed to fetch") || msg.includes("networkerror") || msg.includes("connection refused")) {
      return "Unable to connect to the assistant service right now. Please verify your connection or feel free to reach out to Aryan directly via [LinkedIn](https://www.linkedin.com/in/aryxenv/) or [email](mailto:aryanshah0514@gmail.com).";
    }
  }

  return "I encountered an unexpected issue while processing that request. Please try again in a moment, or reach out to Aryan directly.";
}

/**
 * Streams chat responses from the POST /agent endpoint.
 * Supports Server-Sent Events (SSE) with structured tool calls and text blocks.
 */
export async function streamChatMessage({
  query,
  sessionId,
  onSessionId,
  onChunk,
  onEvent,
  onDone,
  onError,
  signal,
}: StreamChatParams): Promise<void> {
  const url = `${getApiBaseUrl()}/agent`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream, text/plain",
      },
      body: JSON.stringify({
        query: query.trim(),
        session_id: sessionId || null,
      }),
      signal,
    });

    // Capture assigned session id from header
    const serverSessionId = response.headers.get("X-Session-ID");
    if (serverSessionId) {
      setStoredSessionId(serverSessionId);
      onSessionId?.(serverSessionId);
    }

    if (!response.ok) {
      const cleanErr = getCleanErrorMessage(null, response.status);
      onError(cleanErr);
      return;
    }

    if (!response.body) {
      onError("No response stream received from the assistant. Please try again.");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        buffer += decoder.decode(value, { stream: true });

        // Split on SSE event boundaries (\n\n)
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const trimmed = part.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith("data:")) {
            const jsonStr = trimmed.replace(/^data:\s*/, "");
            try {
              const event: StreamEvent = JSON.parse(jsonStr);
              if (event.type === "text" && event.delta) {
                onChunk(event.delta);
              } else if (event.type === "error" && event.message) {
                onError(event.message);
                return;
              }
              onEvent?.(event);
            } catch {
              // Raw text fallback
              onChunk(jsonStr);
              onEvent?.({ type: "text", delta: jsonStr });
            }
          } else {
            // Raw text fallback
            onChunk(trimmed);
            onEvent?.({ type: "text", delta: trimmed });
          }
        }
      }
    }

    // Flush any remaining buffer text
    if (buffer.trim()) {
      const trimmed = buffer.trim();
      if (trimmed.startsWith("data:")) {
        try {
          const event: StreamEvent = JSON.parse(trimmed.replace(/^data:\s*/, ""));
          if (event.type === "text" && event.delta) onChunk(event.delta);
          onEvent?.(event);
        } catch {
          onChunk(trimmed);
        }
      }
    }

    onDone();
  } catch (err: unknown) {
    if (signal?.aborted) {
      onDone();
      return;
    }
    const cleanMsg = getCleanErrorMessage(err);
    onError(cleanMsg);
  }
}
