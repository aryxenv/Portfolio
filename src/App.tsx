import { useState, useEffect, useRef } from 'react'
import { useInView } from "framer-motion";
import Navbar from './components/Navbar/Navbar.tsx'
import Home from './components/Home/Home.tsx'
import About from './components/About/About.tsx'
import Projects from './components/Projects/Projects.tsx'
import Contact from './components/Contact/Contact.tsx'
import MouseMoveEffect from './utils/MouseMoveEffect/MouseMoveEffect.tsx';
import './App.css'
import Lenis from 'lenis'

function App() {
  // smooth scrolling
  useEffect(() => {
    const lenis = new Lenis();

    function raf (time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, [])  

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const isHomeInView = useInView(homeRef, { margin: "-50% 0px -50% 0px" });
  const isAboutInView = useInView(aboutRef, { margin: "-50% 0px -50% 0px" });
  const isProjectsInView = useInView(projectsRef, { margin: "-50% 0px -50% 0px" });
  const isContactInView = useInView(contactRef, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (isHomeInView) setActiveSection("home");
    else if (isAboutInView) setActiveSection("about");
    else if (isProjectsInView) setActiveSection("projects");
    else if (isContactInView) setActiveSection("contact");
  }, [isHomeInView,isAboutInView, isProjectsInView, isContactInView]);

  return (
    <>
      <MouseMoveEffect/>
      <Navbar activeSection={activeSection}/>
      <div className='app'>
        <div className='iwant' ref={homeRef}><Home /></div>
        <div className='aporsche' ref={aboutRef}><About /></div>
        <div className='_918' ref={projectsRef}><Projects /></div>
        <div className='spyder' ref={contactRef}><Contact /></div>
      </div>
    </>
  )
}

export default App