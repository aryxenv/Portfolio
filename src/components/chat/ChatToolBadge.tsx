import React, { useState } from "react";
import type { MessageBlock } from "../../lib/chat-api";

interface ChatToolBadgeProps {
  tool: Extract<MessageBlock, { type: "tool_call" }>;
}

export const ChatToolBadge: React.FC<ChatToolBadgeProps> = ({ tool }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { name, args, status } = tool;

  // Format concise, technical description for the badge
  let paramSummary = "";
  let tag: string | null = null;
  let parsedRecord: Record<string, unknown> | null = null;

  if (args && typeof args === "object") {
    parsedRecord = args as Record<string, unknown>;
  } else if (typeof args === "string" && args.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(args.trim());
      if (typeof parsed === "object" && parsed !== null) {
        parsedRecord = parsed as Record<string, unknown>;
      }
    } catch {
      // ignore parse failure
    }
  }

  if (parsedRecord) {
    if (parsedRecord.query) {
      paramSummary = `"${String(parsedRecord.query)}"`;
    } else if (parsedRecord.field) {
      paramSummary = `field: "${String(parsedRecord.field)}"`;
    }
    if (parsedRecord.doc_type) {
      tag = String(parsedRecord.doc_type);
    } else if (parsedRecord.company) {
      tag = String(parsedRecord.company);
    }
  } else if (typeof args === "string" && args.trim()) {
    paramSummary = args.trim();
  }

  // Choose icon based on tool
  let iconClass = "bx bx-terminal";
  let toolLabel = name;

  if (name.includes("vector_search") || name.includes("search")) {
    iconClass = "bx bx-search-alt-2";
    toolLabel = "vector_search";
  } else if (name.includes("metadata") || name.includes("inspect")) {
    iconClass = "bx bx-filter-alt";
    toolLabel = "inspect_metadata";
  }

  const hasDetails = args && (typeof args === "object" ? Object.keys(args).length > 0 : Boolean(args));

  return (
    <div className="chat-tool-wrapper">
      <button
        type="button"
        className={`chat-tool-badge ${status === "running" ? "is-running" : "is-completed"}`}
        onClick={() => hasDetails && setIsExpanded((prev) => !prev)}
        title={hasDetails ? "Click to toggle tool parameters" : undefined}
        aria-expanded={hasDetails ? isExpanded : undefined}
      >
        <span className="chat-tool-icon">
          <i className={iconClass} />
        </span>

        <span className="chat-tool-name">{toolLabel}</span>

        {paramSummary && <span className="chat-tool-param">{paramSummary}</span>}

        {tag && <span className="chat-tool-tag">{tag}</span>}

        <span className="chat-tool-status">
          {status === "running" ? (
            <span className="chat-tool-pulse" aria-label="Executing..." />
          ) : (
            <i className="bx bx-check chat-tool-check" aria-label="Completed" />
          )}
        </span>

        {hasDetails && (
          <i
            className={`bx bx-chevron-right chat-tool-chevron ${isExpanded ? "is-expanded" : ""}`}
            aria-hidden="true"
          />
        )}
      </button>

      {isExpanded && hasDetails && (
        <pre className="chat-tool-drawer">
          <code>
            {parsedRecord
              ? JSON.stringify(parsedRecord, null, 2)
              : typeof args === "object"
                ? JSON.stringify(args, null, 2)
                : args}
          </code>
        </pre>
      )}
    </div>
  );
};
