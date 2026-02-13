import "./ProjectCard.css";
import "boxicons/css/boxicons.min.css";
import { useState, useRef, useEffect, useCallback } from "react";

const debounce = (func: Function, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  websiteLink: string;
  githubLink: string;
  status: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  websiteLink,
  githubLink,
  status,
}) => {
  const [isHover, setIsHover] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const projectCardLinksRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState(0);
  const [isHoverTooltip, setIsHoverTooltip] = useState(false);

  const updateMinHeight = useCallback(() => {
    let totalHeight = 0;

    if (titleRef.current) totalHeight += titleRef.current.scrollHeight;
    if (descriptionRef.current)
      totalHeight += descriptionRef.current.scrollHeight;
    if (projectCardLinksRef.current)
      totalHeight += projectCardLinksRef.current.scrollHeight;

    totalHeight += 16 * 3; // padding height

    totalHeight += 30; // safety margin

    setMinHeight(totalHeight);
  }, []);

  const handleResize = debounce(() => {
    updateMinHeight();
  }, 200); // Delay of 200ms

  useEffect(() => {
    updateMinHeight();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize, updateMinHeight]);

  const [isSmallScreen, setIsSmallScreen] = useState(
    window.matchMedia("(max-width: 1180px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1180px)");

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsSmallScreen(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // prevent memory leak
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <div
      className={`project-card ${"project" + id}`}
      onClick={() =>
        websiteLink !== ""
          ? window.open(websiteLink, "_blank")
          : window.open(githubLink, "_blank")
      }
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{ minHeight: minHeight }}
      key={id}
    >
      <div className="blurLayer">
        <h3 ref={titleRef}>{title}</h3>

        {description.trim() !== "" &&
          (isSmallScreen ? (
            <p ref={descriptionRef}>{description}</p>
          ) : (
            <p
              ref={descriptionRef}
              className={`project-description ${isHover ? "" : "hidden"}`}
            >
              {description}
            </p>
          ))}

        <div ref={projectCardLinksRef} className="project-card-links">
          {websiteLink.trim() !== "" && (
            <div
              className="link-to-website"
              onClick={(e) => {
                e.stopPropagation();
                window.open(websiteLink, "_blank");
              }}
            >
              <i className="bx bx-world"></i>
            </div>
          )}

          {githubLink.trim() !== "" && (
            <div
              className="link-to-github"
              onClick={(e) => {
                e.stopPropagation();
                window.open(githubLink, "_blank");
              }}
            >
              <i className="bx bxl-github"></i>
            </div>
          )}
        </div>
      </div>

      <div className="project-card-status-container">
        {/* add status logic -> Online, Developing, Discontinued */}
        <div
          className={`project-card-status ${status !== "none" ? `project-card-status-${status}` : ""}`}
          onMouseEnter={() => setIsHoverTooltip(true)}
          onMouseLeave={() => setIsHoverTooltip(false)}
        ></div>

        {isHoverTooltip && status !== "none" && (
          <div className="tooltipDesc">
            {/* Set the status */}
            {status === "green" ? (
              <span>Online</span>
            ) : status === "yellow" ? (
              <span>In Development</span>
            ) : (
              <span>Offline</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
