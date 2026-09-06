import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChatOverlayBar } from "./ChatOverlayBar";
import { ChatSidebar } from "./ChatSidebar";
import {
  type ChatMessageData,
  getStoredSessionId,
  fetchChatHistory,
  deleteChatSession,
  streamChatMessage,
} from "../../lib/chat-api";
import "./chat.css";

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Restore session and pull conversation history on initial mount
  useEffect(() => {
    const savedSid = getStoredSessionId();
    if (savedSid) {
      setSessionId(savedSid);
      fetchChatHistory(savedSid).then((history) => {
        if (history && history.length > 0) {
          const formatted: ChatMessageData[] = history.map((msg, idx) => ({
            id: `hist-${idx}-${Date.now()}`,
            role: msg.role,
            content: msg.content,
            blocks: msg.blocks,
          }));
          setMessages(formatted);
        }
      });
    }
  }, []);

  // Synchronize body class for desktop screen push effect and mobile scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("chat-sidebar-open");
    } else {
      document.body.classList.remove("chat-sidebar-open");
    }

    return () => {
      document.body.classList.remove("chat-sidebar-open");
    };
  }, [isOpen]);

  // Handle ESC key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = useCallback(
    async (queryText: string) => {
      if (!queryText.trim() || isStreaming) return;

      // Automatically open side panel if not already open
      setIsOpen(true);
      setIsStreaming(true);

      const userMsgId = `user-${Date.now()}`;
      const assistantMsgId = `assistant-${Date.now()}`;

      const userMsg: ChatMessageData = {
        id: userMsgId,
        role: "user",
        content: queryText.trim(),
      };

      const assistantMsg: ChatMessageData = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        blocks: [],
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);

      // Abort any ongoing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      await streamChatMessage({
        query: queryText,
        sessionId,
        signal: controller.signal,
        onSessionId: (newSid) => {
          setSessionId(newSid);
        },
        onChunk: (chunk) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        },
        onEvent: (event) => {
          if (event.type === "text") {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id !== assistantMsgId) return msg;
                const blocks = [...(msg.blocks || [])];
                const lastBlock = blocks[blocks.length - 1];
                if (lastBlock && lastBlock.type === "text") {
                  blocks[blocks.length - 1] = {
                    ...lastBlock,
                    content: lastBlock.content + event.delta,
                  };
                } else {
                  blocks.push({ type: "text", content: event.delta });
                }
                return {
                  ...msg,
                  blocks,
                };
              })
            );
          } else if (event.type === "tool_call") {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id !== assistantMsgId) return msg;
                const blocks = [...(msg.blocks || [])];
                blocks.push({
                  type: "tool_call",
                  id: event.call_id || event.id || String(Date.now()),
                  name: event.name,
                  args: event.args,
                  status: "running",
                });
                return { ...msg, blocks };
              })
            );
          } else if (event.type === "tool_result") {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id !== assistantMsgId) return msg;
                const blocks = (msg.blocks || []).map((b) =>
                  b.type === "tool_call" && (b.id === event.call_id || !event.call_id)
                    ? { ...b, status: "completed" as const }
                    : b
                );
                return { ...msg, blocks };
              })
            );
          }
        },
        onDone: () => {
          setIsStreaming(false);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
            )
          );
        },
        onError: (cleanError) => {
          setIsStreaming(false);
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id !== assistantMsgId) return msg;
              const blocks = (msg.blocks || []).map((b) =>
                b.type === "tool_call" && b.status === "running"
                  ? { ...b, status: "error" as const }
                  : b
              );
              const hasTextBlock = blocks.some((b) => b.type === "text");
              if (!hasTextBlock) {
                blocks.push({ type: "text", content: cleanError });
              }
              return {
                ...msg,
                content: cleanError,
                blocks,
                isStreaming: false,
                isError: true,
              };
            })
          );
        },
      });
    },
    [sessionId, isStreaming]
  );

  const handleStopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setMessages((prev) =>
      prev
        .map((msg) => {
          if (!msg.isStreaming) return msg;
          const hasContent = msg.content && msg.content.trim().length > 0;
          const hasBlocks = msg.blocks && msg.blocks.length > 0;
          if (!hasContent && !hasBlocks) {
            return null;
          }
          return { ...msg, isStreaming: false };
        })
        .filter(Boolean) as ChatMessageData[]
    );
  }, []);

  const handleClearChat = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
    if (sessionId) {
      deleteChatSession(sessionId);
    }
    setSessionId(null);
    setMessages([]);
  }, [sessionId]);

  return (
    <>
      <ChatOverlayBar
        isOpen={isOpen}
        isStreaming={isStreaming}
        onOpen={() => setIsOpen(true)}
        onSendMessage={handleSendMessage}
        onStopStreaming={handleStopStreaming}
      />
      <ChatSidebar
        isOpen={isOpen}
        messages={messages}
        isStreaming={isStreaming}
        onClose={() => setIsOpen(false)}
        onClear={handleClearChat}
        onSendMessage={handleSendMessage}
        onStopStreaming={handleStopStreaming}
      />
    </>
  );
};
