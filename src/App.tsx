import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.tsx";
import Portfolio from "./components/Portfolio/Portfolio.tsx";
import { preloadPortfolioSections } from "./components/Portfolio/sections.ts";
import { registerLenis, scrollToElement, scrollToTop } from "./utils/scroll.ts";

const ShaderBackground = lazy(
  () => import("./utils/ShaderBackground/ShaderBackground.tsx"),
);
const Blog = lazy(() => import("./components/Blog/Blog.tsx"));
const BlogPost = lazy(() => import("./components/Blog/BlogPost.tsx"));
const NotFound = lazy(() => import("./components/NotFound/NotFound.tsx"));

const routeFallback = <section className="component" aria-hidden="true" />;

function App() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const location = useLocation();

  // performance mode: "high" renders the animated shader background and all
  // animations; "low" shows a plain black background and disables the heavy
  // always-on animations (smooth scroll, marquees, gradient shimmer, blur).
  const [lowPerfMode, setLowPerfMode] = useState<boolean>(
    () => localStorage.getItem("perfMode") === "low",
  );

  const togglePerfMode = () => {
    setLowPerfMode((prev) => {
      const next = !prev;
      localStorage.setItem("perfMode", next ? "low" : "high");
      return next;
    });
  };

  // expose perf mode to CSS via a root attribute
  useEffect(() => {
    document.documentElement.dataset.perf = lowPerfMode ? "low" : "high";
  }, [lowPerfMode]);

  // smooth scrolling (disabled in low-perf mode to drop the constant RAF loop)
  useEffect(() => {
    if (lowPerfMode) return;

    const lenis = new Lenis();
    let animationFrameId = 0;

    registerLenis(lenis);

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      registerLenis(null);
      lenis.destroy();
    };
  }, [lowPerfMode]);

  // scroll handling across routes: a new page starts at the top, and a link
  // into a section of the one-pager waits for that lazy section to mount.
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    const isFirstRender = previousPathname.current === null;
    const pathnameChanged = previousPathname.current !== location.pathname;
    previousPathname.current = location.pathname;

    // a plain in-page anchor on the current route: leave it to the browser
    if (!pathnameChanged) return;

    const targetId = location.hash.slice(1);

    if (!targetId) {
      if (!isFirstRender) scrollToTop(true);
      return;
    }

    let frameId = 0;
    let cancelled = false;

    const scrollWhenSettled = () => {
      let attempts = 0;
      let lastOffset: number | null = null;
      let stableFrames = 0;

      const tick = () => {
        if (cancelled) return;

        const target = document.getElementById(targetId);

        if (target) {
          const offset = Math.round(
            target.getBoundingClientRect().top + window.scrollY,
          );

          stableFrames = offset === lastOffset ? stableFrames + 1 : 0;
          lastOffset = offset;

          // sections mounting above the target keep moving it, so wait for
          // its position to hold still before scrolling
          if (stableFrames >= 5 || attempts >= 180) {
            scrollToElement(target);
            return;
          }
        }

        if (attempts++ < 180) frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);
    };

    // the target section is lazily loaded, so warm its chunk first
    preloadPortfolioSections()
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) scrollWhenSettled();
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, [location.pathname, location.hash]);

  return (
    <MotionConfig reducedMotion={lowPerfMode ? "always" : "never"}>
      {!lowPerfMode && (
        <Suspense fallback={null}>
          <ShaderBackground />
        </Suspense>
      )}
      <Navbar
        activeSection={activeSection}
        lowPerfMode={lowPerfMode}
        onTogglePerfMode={togglePerfMode}
      />
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={<Portfolio onActiveSectionChange={setActiveSection} />}
          />
          <Route
            path="/blog"
            element={
              <Suspense fallback={routeFallback}>
                <Blog />
              </Suspense>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <Suspense fallback={routeFallback}>
                <BlogPost />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={routeFallback}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </MotionConfig>
  );
}

export default App;
