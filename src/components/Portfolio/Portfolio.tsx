import { useInView } from "framer-motion";
import { lazy, Suspense, useEffect, useRef } from "react";
import Home from "../Home/Home.tsx";
import {
  importAbout,
  importContact,
  importExperience,
  importProjects,
} from "./sections.ts";

const About = lazy(importAbout);
const Experience = lazy(importExperience);
const Projects = lazy(importProjects);
const Contact = lazy(importContact);

const sectionFallback = <section className="component" aria-hidden="true" />;

/**
 * The one-page portfolio at `/`. Owns the scroll-spy that tells the navbar
 * which section is in view.
 */
function Portfolio({
  onActiveSectionChange,
}: {
  onActiveSectionChange: (section: string | null) => void;
}) {
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
    if (isHomeInView) onActiveSectionChange("home");
    else if (isAboutInView) onActiveSectionChange("about");
    else if (isExperienceInView) onActiveSectionChange("experience");
    else if (isProjectsInView) onActiveSectionChange("projects");
    else if (isContactInView) onActiveSectionChange("contact");
  }, [
    isHomeInView,
    isAboutInView,
    isExperienceInView,
    isProjectsInView,
    isContactInView,
    onActiveSectionChange,
  ]);

  // leaving the one-pager clears the navbar's section highlight
  useEffect(() => {
    return () => onActiveSectionChange(null);
  }, [onActiveSectionChange]);

  return (
    <>
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
    </>
  );
}

export default Portfolio;
