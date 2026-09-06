import React, { useState, useRef, useCallback } from "react";

interface ChatOverlayBarProps {
  isOpen: boolean;
  isStreaming: boolean;
  onOpen: () => void;
  onSendMessage: (text: string) => void;
  onStopStreaming?: () => void;
}

export const ChatOverlayBar: React.FC<ChatOverlayBarProps> = ({
  isOpen,
  isStreaming,
  onOpen,
  onSendMessage,
  onStopStreaming,
}) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    setValue("");
    onSendMessage(trimmed);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isStreaming, onSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Graceful auto-grow fallback for browsers without native field-sizing: content support
    const target = e.target;
    if (!("fieldSizing" in document.documentElement.style)) {
      target.style.height = "auto";
      target.style.height = `${Math.min(target.scrollHeight, 140)}px`;
    }
  };

  return (
    <div
      className={`chat-overlay-bar ${isOpen ? "is-hidden" : ""}`}
      aria-hidden={isOpen}
    >
      <div className="chat-overlay-input-wrap">
        <textarea
          ref={textareaRef}
          className="chat-overlay-textarea"
          rows={1}
          placeholder="Ask anything about Aryan's work or background..."
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          aria-label="Ask Aryan's AI assistant"
          disabled={isOpen}
        />
        <button
          type="button"
          className={`chat-overlay-send-btn ${isStreaming ? "is-stop" : ""}`}
          onClick={isStreaming ? onStopStreaming : handleSend}
          disabled={isOpen || (isStreaming ? false : !value.trim())}
          aria-label={isStreaming ? "Stop generating" : "Send message"}
          title={isStreaming ? "Stop generating" : "Send message"}
        >
          <i className={isStreaming ? "bx bx-stop-circle" : "bx bx-send"} />
        </button>
      </div>

      <button
        type="button"
        className="chat-overlay-toggle-btn"
        onClick={onOpen}
        aria-label="Open chat panel"
        title="Open chat panel"
      >
        <i className="bx bx-sidebar" />
      </button>
    </div>
  );
};
