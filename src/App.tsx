import { useInView } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import About from "./components/About/About.tsx";
import Contact from "./components/Contact/Contact.tsx";
import Experience from "./components/Experience/Experience.tsx";
import Home from "./components/Home/Home.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import Projects from "./components/Projects/Projects.tsx";
import ShaderBackground from "./utils/ShaderBackground/ShaderBackground.tsx";

function App() {
  // smooth scrolling
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  const [activeSection, setActiveSection] = useState<string | null>(null);

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
    <>
      <ShaderBackground />
      <Navbar activeSection={activeSection} />
      <div className="app">
        <div className="aryan" ref={homeRef}>
          <Home />
        </div>
        <div className="wants" ref={aboutRef}>
          <About />
        </div>
        <div className="aporsche" ref={experienceRef}>
          <Experience />
        </div>
        <div className="_918" ref={projectsRef}>
          <Projects />
        </div>
        <div className="spyder" ref={contactRef}>
          <Contact />
        </div>
      </div>
    </>
  );
}

export default App;
