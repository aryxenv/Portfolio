import { useEffect, useRef, useState } from "react";
import './MouseMoveEffect.css'

export default function MouseMoveEffect() {
  const effectRef = useRef<HTMLDivElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia('(max-width: 1180px)').matches);

  useEffect(() => {
      const mediaQuery = window.matchMedia('(max-width: 1180px)');

      const handleMediaQueryChange = (event: MediaQueryListEvent) => {
          setIsSmallScreen(event.matches);
      };

      mediaQuery.addEventListener('change', handleMediaQueryChange);

      // prevent memory leak
      return () => {
          mediaQuery.removeEventListener('change', handleMediaQueryChange);
      };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (effectRef.current) {
        effectRef.current.style.background = `radial-gradient(700px at ${event.clientX}px ${event.clientY}px, rgba(29, 4, 219, 0.15), transparent 80%)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    isSmallScreen ? (
      null
    ) : (
      <div className="mouseMoveEffect"
        ref={effectRef}
        // style={{
        //   position: "fixed",
        //   top: 0,
        //   left: 0,
        //   width: "100vw",
        //   height: "100vh",
        //   pointerEvents: "none",
        //   zIndex: -1,
        //   background: "transparent",
        // }}
      />
    )
  );
}
