import "boxicons/css/boxicons.min.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ProjectCard from "../../utils/ProjectCard/ProjectCard.tsx";
import { ProjectCardData } from "../../utils/ProjectCard/ProjectCardData.ts";
import TechStackSliderCard from "../../utils/TechStackSliderCard/techStackSliderCard.tsx";
import "./Home.css";
import { techStackDataSliderBottom } from "./TechStackDataSliderBottom.ts";
import { techStackDataSliderTop } from "./TechStackDataSliderTop.ts";

function Home() {
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsSmallScreen(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // prevent memory leak
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <section className="component home" id="home">
      <div className="home-container" ref={ref}>
        <motion.div
          className="introduction"
          initial={{ opacity: 0, transform: "translateY(-50px)" }}
          animate={
            inView
              ? { opacity: 1, transform: "translateY(0px)" }
              : { opacity: 0, transform: "translateY(-50px)" }
          }
          transition={{ duration: 1 }}
        >
          <div className="introduction-title">
            <div className="introduction-name">
              <h1>
                Hi! I'm <span className="gradient-animation">Aryan Shah</span>
              </h1>
            </div>

            <div className="introduction-role">
              <h2>Software Developer (Full-stack + AI/ML)</h2>
            </div>
          </div>

          <div className="sep-line"></div>

          <div className="introduction-text">
            <p>
              <span className="gradient-animation">
                Data Science, Protection, and Security student
              </span>{" "}
              at Thomas More University of Applied Sciences. Based in
              <span className="gradient-animation"> Antwerp, Belgium</span> with
              hands-on experience in software/web development, AI/ML, data
              analytics, and database management. Skilled in JavaScript,
              TypeScript, React, Python, SQL, and C#, PowerBI and more.
              <a href="#about"> Click here to learn more about me!</a>
            </p>
          </div>

          <div className="introduction-stack-container">
            <div className="introduction-stacks">
              <div className="introduction-stack introduction-top">
                <div className="introduction-stack-list">
                  <div className="marquee-wrapper">
                    {/* added 4 dupes because 2 dupes isnt enough to cover the whole width on higher width viewports */}
                    {[...Array(4)]
                      .flatMap(() => techStackDataSliderTop)
                      .map((key, index) => (
                        <TechStackSliderCard
                          keyIndex={index}
                          imageUrl={key.src}
                          text={key.name}
                          alt={key.alt}
                          id={key.id}
                        />
                      ))}
                  </div>
                </div>
              </div>

              <div className="introduction-stack introduction-bottom">
                <div className="introduction-stack-list">
                  <div className="marquee-wrapper-reverse">
                    {/* added 4 dupes because 2 dupes isnt enough to cover the whole width on higher width viewports */}
                    {[...Array(4)]
                      .flatMap(() => techStackDataSliderBottom)
                      .map((key, index) => (
                        <TechStackSliderCard
                          keyIndex={index}
                          imageUrl={key.src}
                          text={key.name}
                          alt={key.alt}
                          id={key.id}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="viewMoreVertical viewMoreVertical-smaller"
              onClick={() => (window.location.href = "#contact")}
            >
              <div className="opacityLayer opacityLayer-smaller">
                <div className="viewMore-title">
                  <span className="rotate90deg rotate90deg-smaller">
                    Contact me!
                  </span>
                </div>

                <div className="viewMore-arrow-smaller">
                  <i className="bx bx-chevron-down"></i>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="recents">
          <motion.div
            className="recentAndProject1"
            initial={{ opacity: 0, transform: "translateX(-50px)" }}
            animate={
              inView
                ? { opacity: 1, transform: "translateX(0px)" }
                : { opacity: 0, transform: "translateX(-50px)" }
            }
            transition={{ duration: 1 }}
          >
            <div className="recent">
              <h3>Recents</h3>
            </div>

            <ProjectCard
              id={ProjectCardData[0].id}
              title={ProjectCardData[0].title}
              description={ProjectCardData[0].description}
              websiteLink={ProjectCardData[0].websiteLink}
              githubLink={ProjectCardData[0].githubLink}
              status={ProjectCardData[0].status}
            />
          </motion.div>

          {isSmallScreen ? (
            <>
              <motion.div
                className="project2AndViewProjects"
                initial={{ opacity: 0, transform: "translateX(-50px)" }}
                animate={
                  inView
                    ? { opacity: 1, transform: "translateX(0px)" }
                    : { opacity: 0, transform: "translateX(-50px)" }
                }
                transition={{ duration: 1 }}
              >
                <ProjectCard
                  id={ProjectCardData[1].id}
                  title={ProjectCardData[1].title}
                  description={ProjectCardData[1].description}
                  websiteLink={ProjectCardData[1].websiteLink}
                  githubLink={ProjectCardData[1].githubLink}
                  status={ProjectCardData[1].status}
                />

                <div
                  className="viewMoreVertical"
                  onClick={() => (window.location.href = "#projects")}
                >
                  <div className="opacityLayer">
                    <div className="viewMore-title">
                      <span className="rotate90deg">View more projects</span>
                    </div>

                    <div className="viewMore-arrow">
                      <i className="bx bx-chevron-down"></i>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, transform: "translateY(50px)" }}
                animate={
                  inView
                    ? { opacity: 1, transform: "translateY(0px)" }
                    : { opacity: 0, transform: "translateY(50px)" }
                }
                transition={{ duration: 1 }}
              >
                <ProjectCard
                  id={ProjectCardData[1].id}
                  title={ProjectCardData[1].title}
                  description={ProjectCardData[1].description}
                  websiteLink={ProjectCardData[1].websiteLink}
                  githubLink={ProjectCardData[1].githubLink}
                  status={ProjectCardData[1].status}
                />
              </motion.div>

              <motion.div
                className="viewMoreVertical"
                onClick={() => (window.location.href = "#projects")}
                initial={{ opacity: 0, transform: "translateX(50px)" }}
                animate={
                  inView
                    ? { opacity: 1, transform: "translateX(0px)" }
                    : { opacity: 0, transform: "translateX(50px)" }
                }
                transition={{ duration: 1 }}
              >
                <div className="opacityLayer">
                  <div className="viewMore-title">
                    <span className="rotate90deg">View more projects</span>
                  </div>

                  <div className="viewMore-arrow">
                    <i className="bx bx-chevron-down"></i>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Home;
