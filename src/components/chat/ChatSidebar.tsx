import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";
import type { ChatMessageData } from "../../lib/chat-api";

interface ChatSidebarProps {
  isOpen: boolean;
  messages: ChatMessageData[];
  isStreaming: boolean;
  onClose: () => void;
  onClear: () => void;
  onSendMessage: (text: string) => void;
}

const STARTER_PROMPTS = [
  "What was Aryan's focus and role at Microsoft?",
  "How does this agent work?",
  "Tell me more about Aryan's GraphRAG Demo Project",
];

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  messages,
  isStreaming,
  onClose,
  onClear,
  onSendMessage,
}) => {
  const [inputValue, setInputValue] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll strictly within the chat messages container without touching window/body
  const scrollToBottom = useCallback((smooth = true) => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(false);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      scrollToBottom(true);
    }
  }, [messages, isOpen, scrollToBottom]);

  // Isolate scroll gestures inside the sidebar:
  // 1. Prevent scroll chaining from reaching the underlying window/body
  // 2. Redirect wheel events anywhere in the sidebar (header, footer, margins) to the messages container
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleWheel = (e: WheelEvent) => {
      const container = messagesContainerRef.current;
      if (!container) return;

      // Stop wheel event from propagating to window/body
      e.stopPropagation();

      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScrollTop = scrollHeight - clientHeight;

      // If container cannot scroll (e.g. content fits within container), absorb the event
      if (maxScrollTop <= 0) {
        e.preventDefault();
        return;
      }

      // Check boundary limits
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop >= maxScrollTop - 1;

      // If user scrolls up at top or down at bottom, absorb to prevent page scroll-through
      if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
        e.preventDefault();
        return;
      }

      // If cursor is on header, footer, or margins, forward scroll to messages container
      if (!container.contains(e.target as Node)) {
        container.scrollTop += e.deltaY;
        e.preventDefault();
      }
    };

    sidebar.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      sidebar.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Focus textarea when panel opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isStreaming) return;
    setInputValue("");
    onSendMessage(trimmed);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const target = e.target;
    if (!("fieldSizing" in document.documentElement.style)) {
      target.style.height = "auto";
      target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
    }
  };

  return (
    <aside
      ref={sidebarRef}
      className={`chat-sidebar ${isOpen ? "is-open" : ""}`}
      aria-label="Aryan AI Chat Panel"
      aria-hidden={!isOpen}
    >
      {/* Header */}
      <header className="chat-sidebar-header">
        <div className="chat-header-title-group">
          <span className="chat-header-dot" aria-hidden="true" />
          <h2 className="chat-header-title">Aryan AI</h2>
          <span className="chat-header-badge">
            <img
              src="/assets/foundry.png"
              alt=""
              className="chat-badge-logo"
              aria-hidden="true"
            />
            <img
              src="/assets/deepseek.png"
              alt=""
              className="chat-badge-logo"
              aria-hidden="true"
            />
            <span className="chat-badge-text">DeepSeek-V4-Flash</span>
          </span>
        </div>

        <div className="chat-header-actions">
          {messages.length > 0 && (
            <button
              type="button"
              className="chat-header-btn icon-only"
              onClick={onClear}
              title="Clear conversation and reset session"
              aria-label="Clear chat history"
              disabled={isStreaming}
            >
              <i className="bx bx-trash" />
            </button>
          )}

          <button
            type="button"
            className="chat-header-btn icon-only"
            onClick={onClose}
            title="Close panel"
            aria-label="Close chat panel"
          >
            <i className="bx bx-x" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="chat-messages-container"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <p className="chat-empty-intro">
              Powered by Microsoft Agent Framework and DeepSeek-V4-Flash, this agent
              executes hybrid retrieval across Azure AI Search and Cosmos DB, offering
              deeper technical insights beyond what&apos;s shown on this portfolio.
            </p>
            <span className="chat-empty-prompts-title">Suggested Inquiries</span>
            <div className="chat-prompts-list">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="chat-prompt-pill"
                  onClick={() => onSendMessage(prompt)}
                  disabled={isStreaming}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
      </div>

      {/* Footer Input */}
      <footer className="chat-sidebar-footer">
        <div className="chat-sidebar-input-box">
          <textarea
            ref={textareaRef}
            className="chat-sidebar-textarea"
            rows={1}
            placeholder="Type your question..."
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            aria-label="Type inquiry to Aryan AI"
            disabled={isStreaming}
          />
          <button
            type="button"
            className="chat-overlay-send-btn"
            onClick={handleSend}
            disabled={!inputValue.trim() || isStreaming}
            aria-label="Send message"
            title="Send message"
          >
            <i className="bx bx-send" />
          </button>
        </div>
      </footer>
    </aside>
  );
};
