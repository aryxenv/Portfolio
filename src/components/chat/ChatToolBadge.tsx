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
  let parsedRecord: Record<string, unknown> | null = null;

  if (args && typeof args === "object") {
    parsedRecord = args as Record<string, unknown>;
  } else if (typeof args === "string") {
    const trimmed = args.trim();
    if (trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === "object" && parsed !== null) {
          parsedRecord = parsed as Record<string, unknown>;
        }
      } catch {
        try {
          const jsonCompatible = trimmed.replace(/'/g, '"');
          const parsed = JSON.parse(jsonCompatible);
          if (typeof parsed === "object" && parsed !== null) {
            parsedRecord = parsed as Record<string, unknown>;
          }
        } catch {
          // ignore parse failure
        }
      }
    }
  }

  if (parsedRecord) {
    if (parsedRecord.query) {
      paramSummary = `"${String(parsedRecord.query)}"`;
    } else if (parsedRecord.field) {
      paramSummary = `field: "${String(parsedRecord.field)}"`;
    }
  } else if (typeof args === "string" && args.trim()) {
    paramSummary = args.trim();
  }

  // Choose icon based on tool
  let iconClass = "bx bx-terminal";
  let toolLabel = name;

  const isVectorSearch = name.includes("vector_search") || name.includes("search");
  const isInspectMetadata = name.includes("metadata") || name.includes("inspect");

  if (isVectorSearch) {
    iconClass = "bx bx-search-alt-2";
    toolLabel = "vector_search";
  } else if (isInspectMetadata) {
    iconClass = "bx bx-filter-alt";
    toolLabel = "inspect_metadata";
  }

  // Determine if vector search is filtering on metadata
  let hasMetadataFilter = false;
  let metadataFilterDescription = "";

  if (isVectorSearch && parsedRecord) {
    const filterEntries: string[] = [];
    for (const [key, value] of Object.entries(parsedRecord)) {
      if (key === "query" || value === null || value === undefined || value === "") {
        continue;
      }
      if (key === "filters" && typeof value === "object" && value !== null) {
        for (const [subKey, subVal] of Object.entries(value as Record<string, unknown>)) {
          if (subVal !== null && subVal !== undefined && subVal !== "") {
            filterEntries.push(`${subKey}: ${String(subVal)}`);
          }
        }
      } else {
        filterEntries.push(`${key}: ${String(value)}`);
      }
    }

    if (filterEntries.length > 0) {
      hasMetadataFilter = true;
      metadataFilterDescription = filterEntries.join(", ");
    }
  }

  const hasDetails = args && (typeof args === "object" ? Object.keys(args).length > 0 : Boolean(args));

  return (
    <div className="chat-tool-wrapper">
      <button
        type="button"
        className={`chat-tool-badge ${status === "running" ? "is-running" : status === "error" ? "is-error" : "is-completed"} ${isExpanded ? "is-expanded" : ""}`}
        onClick={() => hasDetails && setIsExpanded((prev) => !prev)}
        title={hasDetails ? "Click to toggle tool parameters" : undefined}
        aria-expanded={hasDetails ? isExpanded : undefined}
      >
        <span className="chat-tool-icon">
          <i className={iconClass} />
        </span>

        <span className="chat-tool-name">{toolLabel}</span>

        {paramSummary && (
          <span className="chat-tool-param" title={paramSummary}>
            {paramSummary}
          </span>
        )}

        <div className="chat-tool-trailing">
          {hasMetadataFilter && (
            <span
              className="chat-tool-filter-icon"
              title={
                metadataFilterDescription
                  ? `Metadata filter applied: ${metadataFilterDescription}`
                  : "Metadata filter applied"
              }
              aria-label={
                metadataFilterDescription
                  ? `Metadata filter applied: ${metadataFilterDescription}`
                  : "Metadata filter applied"
              }
            >
              <i className="bx bx-filter-alt" aria-hidden="true" />
            </span>
          )}

          <span className="chat-tool-status">
            {status === "running" ? (
              <span className="chat-tool-pulse" aria-label="Executing..." />
            ) : status === "error" ? (
              <i className="bx bx-x chat-tool-error-icon" aria-label="Failed" />
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
        </div>
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
