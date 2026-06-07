import { MotionConfig, useInView } from "framer-motion";
import Lenis from "lenis";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import "./App.css";
import Home from "./components/Home/Home.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";

const ShaderBackground = lazy(
  () => import("./utils/ShaderBackground/ShaderBackground.tsx"),
);
const About = lazy(() => import("./components/About/About.tsx"));
const Experience = lazy(() => import("./components/Experience/Experience.tsx"));
const Projects = lazy(() => import("./components/Projects/Projects.tsx"));
const Contact = lazy(() => import("./components/Contact/Contact.tsx"));

const sectionFallback = <section className="component" aria-hidden="true" />;

function App() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

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

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, [lowPerfMode]);

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const isHomeInView = useInView(homeRef, { margin: "-50% 0px -50% 0px" });
  const isAboutInView = useInView(aboutRef, { margin: "-50% 0px -50% 0px" });
  const isExperienceInView = useInView(experienceRef, {
    margin: "-50% 0px -50% 0px",
  });
  const isProjectsInView = useInView(projectsRef, {
    margin: "-50% 0px -50% 0px",
  });
  const isContactInView = useInView(contactRef, {
    margin: "-50% 0px -50% 0px",
  });

  useEffect(() => {
    if (isHomeInView) setActiveSection("home");
    else if (isAboutInView) setActiveSection("about");
    else if (isExperienceInView) setActiveSection("experience");
    else if (isProjectsInView) setActiveSection("projects");
    else if (isContactInView) setActiveSection("contact");
  }, [
    isHomeInView,
    isAboutInView,
    isExperienceInView,
    isProjectsInView,
    isContactInView,
  ]);

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
        <div className="aryan" ref={homeRef}>
          <Home />
        </div>
        <div className="wants" ref={aboutRef}>
          <Suspense fallback={sectionFallback}>
            <About />
          </Suspense>
        </div>
        <div className="aporsche" ref={experienceRef}>
          <Suspense fallback={sectionFallback}>
            <Experience />
          </Suspense>
        </div>
        <div className="_918" ref={projectsRef}>
          <Suspense fallback={sectionFallback}>
            <Projects />
          </Suspense>
        </div>
        <div className="spyder" ref={contactRef}>
          <Suspense fallback={sectionFallback}>
            <Contact />
          </Suspense>
        </div>
      </div>
    </MotionConfig>
  );
}

export default App;
