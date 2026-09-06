import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessageData } from "../../lib/chat-api";
import { ChatToolBadge } from "./ChatToolBadge";

interface ChatMessageProps {
  message: ChatMessageData;
}

const markdownComponents = {
  table: ({ ...props }: React.ComponentPropsWithoutRef<"table">) => (
    <div className="chat-table-wrapper">
      <table {...props} />
    </div>
  ),
  a: ({ href, children, ...props }: React.ComponentPropsWithoutRef<"a">) => (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
};

export const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  const isUser = message.role === "user";
  const hasBlocks = message.blocks && message.blocks.length > 0;

  return (
    <div
      className={`chat-message-row ${isUser ? "is-user" : "is-assistant"}`}
      role="article"
      aria-label={`${isUser ? "User" : "Assistant"} message`}
    >
      <span className="chat-message-sender">
        {isUser ? "You" : "Aryan AI"}
      </span>

      <div className={`chat-bubble ${message.isError ? "is-error" : ""}`}>
        {isUser ? (
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{message.content}</p>
        ) : (
          <div className="chat-markdown">
            {hasBlocks ? (
              message.blocks!.map((block, idx) => {
                if (block.type === "tool_call") {
                  return <ChatToolBadge key={block.id || `tool-${idx}`} tool={block} />;
                }

                const isLastBlock = idx === message.blocks!.length - 1;
                return (
                  <div key={`text-${idx}`} className="chat-step-block">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {block.content}
                    </ReactMarkdown>
                    {message.isStreaming && isLastBlock && (
                      <span className="chat-streaming-cursor" aria-hidden="true" />
                    )}
                  </div>
                );
              })
            ) : (
              <>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {message.content}
                </ReactMarkdown>
                {message.isStreaming && (
                  <span className="chat-streaming-cursor" aria-hidden="true" />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";
