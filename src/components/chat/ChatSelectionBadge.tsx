import React, { useState, useEffect, useRef, useCallback } from "react";

interface ChatSelectionBadgeProps {
  onSendMessage: (queryText: string) => void;
  isStreaming: boolean;
}

interface BadgeCoords {
  top: number;
  left: number;
}

const MIN_SELECTION_LENGTH = 2;
const MAX_PREVIEW_LENGTH = 24;
const VERTICAL_OFFSET = 8;
const VIEWPORT_PADDING = 12;

export const ChatSelectionBadge: React.FC<ChatSelectionBadgeProps> = ({
  onSendMessage,
  isStreaming,
}) => {
  const [selectedText, setSelectedText] = useState("");
  const [coords, setCoords] = useState<BadgeCoords | null>(null);
  const [contextInfo, setContextInfo] = useState("");
  const [isDismissed, setIsDismissed] = useState(false);
  const badgeRef = useRef<HTMLButtonElement>(null);
  const isInteractingRef = useRef(false);

  // Helper to check whether selection originates from an excluded element
  const isExcludedNode = (node: Node | null): boolean => {
    if (!node) return false;
    const el = node instanceof Element ? node : node.parentElement;
    if (!el) return false;
    return Boolean(
      el.closest(
        "input, textarea, [contenteditable], .chat-sidebar, .chat-overlay-bar, .chat-selection-badge"
      )
    );
  };

  // Helper to determine where on the portfolio the text selection occurred
  const resolveSelectionContext = (node: Node | null): string => {
    if (typeof window === "undefined" || !node) return "";

    const el = node instanceof Element ? node : node.parentElement;
    if (!el) return "";

    // 1. Individual blog post page (/blog/<slug>) or .blog-post container
    const blogPost = el.closest(".blog-post");
    if (blogPost || window.location.pathname.startsWith("/blog/")) {
      const postTitle =
        document.querySelector(".blog-post-header h1")?.textContent?.trim() ||
        document.title.replace(/\s*\|\s*Aryan Shah.*$/i, "").trim();
      return postTitle ? `Blog post "${postTitle}"` : "Blog post";
    }

    // 2. Blog listing page (/blog)
    if (
      el.closest(".blog, #blog") ||
      window.location.pathname === "/blog" ||
      window.location.pathname === "/blog/"
    ) {
      const cardTitle = el.closest(".post-card")?.querySelector("h3, h2, a")?.textContent?.trim();
      return cardTitle ? `Blog listing (near post: "${cardTitle}")` : "Blog section";
    }

    // 3. Projects section (#projects)
    const projectsSection = el.closest("#projects, .projects");
    if (projectsSection) {
      const projectCard = el.closest(".project-card");
      const projectTitle = projectCard
        ?.querySelector(".project-card-link, h3, h4")
        ?.textContent?.trim();
      return projectTitle
        ? `Projects section (Project: "${projectTitle}")`
        : "Projects section";
    }

    // 4. Experience section (#experience)
    const experienceSection = el.closest("#experience, .experience");
    if (experienceSection) {
      const expItem = el.closest(".experience-item");
      const company = expItem?.querySelector(".experience-company-name, h3")?.textContent?.trim();
      const role = expItem?.querySelector(".experience-role-title, h4")?.textContent?.trim();
      if (company && role) {
        return `Experience section (${company} - ${role})`;
      } else if (company) {
        return `Experience section (${company})`;
      }
      return "Experience section";
    }

    // 5. About section (#about)
    const aboutSection = el.closest("#about, .about");
    if (aboutSection) {
      return "About section";
    }

    // 6. Contact section (#contact)
    const contactSection = el.closest("#contact, .contact");
    if (contactSection) {
      return "Contact section";
    }

    // 7. Home / Intro section (#home)
    const homeSection = el.closest("#home, .home");
    if (homeSection) {
      const projectCard = el.closest(".project-card");
      const projectTitle = projectCard
        ?.querySelector(".project-card-link, h3, h4")
        ?.textContent?.trim();
      return projectTitle
        ? `Home section (Featured Project: "${projectTitle}")`
        : "Home / Introduction section";
    }

    // 8. Anime waiting room project page
    if (
      window.location.pathname.includes("anime-waiting-room") ||
      el.closest(".anime-waiting-room")
    ) {
      return 'Project demo ("Anime Waiting Room")';
    }

    // Fallback to cleaned page title
    const cleanTitle = document.title.replace(/\s*\|\s*Aryan Shah.*$/i, "").trim();
    return cleanTitle ? `${cleanTitle} section` : "portfolio";
  };

  // Compute position at bottom-right of the selected text area
  const computePosition = useCallback((): {
    text: string;
    coords: BadgeCoords | null;
    context: string;
  } => {
    if (typeof window === "undefined") return { text: "", coords: null, context: "" };

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      return { text: "", coords: null, context: "" };
    }

    if (isExcludedNode(selection.anchorNode) || isExcludedNode(selection.focusNode)) {
      return { text: "", coords: null, context: "" };
    }

    const rawText = selection.toString();
    const cleanText = rawText.trim();
    if (cleanText.length < MIN_SELECTION_LENGTH) {
      return { text: "", coords: null, context: "" };
    }

    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();
    const boundingRect = range.getBoundingClientRect();

    if (!rects || rects.length === 0 || boundingRect.width === 0 || boundingRect.height === 0) {
      return { text: "", coords: null, context: "" };
    }

    // Resolve context from the selection's enclosing element
    const targetNode = range.commonAncestorContainer || selection.anchorNode;
    const context = resolveSelectionContext(targetNode);

    // Check if selection is scrolled out of current viewport
    if (boundingRect.bottom < 0 || boundingRect.top > window.innerHeight) {
      return { text: cleanText, coords: null, context };
    }

    // Find the last visible rect in the selection
    let lastRect = rects[rects.length - 1];
    for (let i = rects.length - 1; i >= 0; i--) {
      if (rects[i].width > 0 && rects[i].height > 0) {
        lastRect = rects[i];
        break;
      }
    }

    // Anchor at the bottom-right of the selected text area
    const anchorX = Math.max(lastRect.right, Math.min(boundingRect.right, lastRect.right + 16));
    const anchorY = boundingRect.bottom;

    const badgeWidth = badgeRef.current?.offsetWidth || 220;
    const badgeHeight = badgeRef.current?.offsetHeight || 36;

    // Horizontally align right edge with anchorX, with viewport safety clamping
    let left = anchorX - badgeWidth + 12;
    left = Math.max(
      VIEWPORT_PADDING,
      Math.min(left, window.innerWidth - badgeWidth - VIEWPORT_PADDING)
    );

    // Vertically position below bottom edge, flipping above if near viewport bottom
    let top = anchorY + VERTICAL_OFFSET;
    if (top + badgeHeight > window.innerHeight - VIEWPORT_PADDING) {
      top = Math.max(VIEWPORT_PADDING, boundingRect.top - badgeHeight - VERTICAL_OFFSET);
    }

    return {
      text: cleanText,
      coords: { top, left },
      context,
    };
  }, []);

  const updateSelectionState = useCallback(() => {
    if (isInteractingRef.current) return;

    const { text, coords: newCoords, context } = computePosition();

    if (!text || !newCoords) {
      setCoords(null);
      if (!text) {
        setSelectedText("");
        setContextInfo("");
        setIsDismissed(false);
      }
      return;
    }

    // If new text is selected, un-dismiss
    setSelectedText((prevText) => {
      if (prevText !== text) {
        setIsDismissed(false);
      }
      return text;
    });

    setCoords(newCoords);
    setContextInfo(context || "");
  }, [computePosition]);

  // Listen to selection changes across document
  useEffect(() => {
    let timer: number | null = null;
    const handleSelectionChange = () => {
      if (timer) cancelAnimationFrame(timer);
      timer = requestAnimationFrame(() => {
        updateSelectionState();
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("mouseup", handleSelectionChange);
    document.addEventListener("touchend", handleSelectionChange);
    document.addEventListener("keyup", handleSelectionChange);

    return () => {
      if (timer) cancelAnimationFrame(timer);
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mouseup", handleSelectionChange);
      document.removeEventListener("touchend", handleSelectionChange);
      document.removeEventListener("keyup", handleSelectionChange);
    };
  }, [updateSelectionState]);

  // Reposition on scroll and resize while visible
  useEffect(() => {
    if (!coords) return;

    let frame: number | null = null;
    const handleScrollOrResize = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const { coords: nextCoords } = computePosition();
        setCoords(nextCoords);
      });
    };

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [coords, computePosition]);

  // Dismiss on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedText && !isDismissed) {
        setIsDismissed(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedText, isDismissed]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedText.trim() || isStreaming) return;

    const trimmedText = selectedText.trim();
    const contextDesc = contextInfo.trim();
    const articlePrefix =
      contextDesc.startsWith("Blog post") || contextDesc.startsWith("Project demo")
        ? ""
        : "the ";

    const message = contextDesc
      ? `Tell me more about: ${trimmedText}\n\nContext: Selected from ${articlePrefix}${contextDesc} on Aryan's portfolio.`
      : `Tell me more about: ${trimmedText}`;

    onSendMessage(message);

    // Hide the badge so it does not obstruct reading
    setIsDismissed(true);

    // Crucial: Per user specification, DO NOT clear the window selection!
    // The user's highlighted text remains intact on the page.
    setTimeout(() => {
      isInteractingRef.current = false;
    }, 100);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent the default mousedown action from collapsing the browser's text selection
    isInteractingRef.current = true;
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isInteractingRef.current = true;
    e.stopPropagation();
  };

  if (!selectedText || !coords || isDismissed) {
    return null;
  }

  const previewSnippet =
    selectedText.length > MAX_PREVIEW_LENGTH
      ? `${selectedText.slice(0, MAX_PREVIEW_LENGTH).trim()}…`
      : selectedText;

  return (
    <button
      ref={badgeRef}
      type="button"
      className="chat-selection-badge"
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      disabled={isStreaming}
      aria-label={`Ask Aryan AI about: "${selectedText}"`}
      title={`Ask Aryan AI about: "${selectedText}"`}
    >
      <span className="chat-selection-badge-title">Ask Aryan AI</span>
      <span className="chat-selection-badge-preview" aria-hidden="true">
        “{previewSnippet}”
      </span>
      <i
        className="bx bx-right-arrow-alt chat-selection-badge-arrow"
        aria-hidden="true"
      />
    </button>
  );
};
