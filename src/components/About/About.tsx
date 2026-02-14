import "boxicons/css/boxicons.min.css";
import { motion } from "framer-motion";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import "./About.css";
import { techStackData } from "./TechStackData.ts";

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 50,
  },

  animate: (index: number) => {
    return {
      opacity: 1,
      transform: "translateY(0px)",
      transition: {
        delay: 0.05 * index,
      },
    };
  },
};

function About() {
  // show the field with this index
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWhoAmIVisible, setIsWhoAmIVisible] = useState(false);

  const textWhoAmI = `\n\nIn my free time, I build full-stack apps and integrate AI/ML to solve actual problems. Outside of tech, I also keep up with finance on the side.\n\nI'm always looking to expand my skills and build cool things. Oh, and the ultimate life goal? Owning my favorite car, a Porsche 918 Spyder.`;

  // move to the next field
  // if we are at the end, go to the first field
  const next = () => {
    setCurrentIndex((currentIndex + 1) % techStackData.length);
  };

  // move to the previous field
  // if we are at the beginning, go to the last field
  const prev = () => {
    setCurrentIndex(
      (currentIndex - 1 + techStackData.length) % techStackData.length,
    );
  };

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section className="component about" id="about">
      <div className="about-container">
        <motion.div
          className="about-me-container"
          ref={ref}
          initial={{ opacity: 0, transform: "translateX(-50px)" }}
          animate={
            inView
              ? { opacity: 1, transform: "translateX(0px)" }
              : { opacity: 0, transform: "translateX(-50px)" }
          }
          transition={{ duration: 1 }}
        >
          <div className="about-me-title">
            <h2>About Me</h2>
          </div>

          <div className="about-me-text">
            <div className="about-me-text-1">
              <div className="about-me-text-1-title">
                <h3>Who am I</h3>
              </div>

              <div className="about-me-text-1-content">
                <p>
                  I'm Aryan Shah, based in{" "}
                  <span className="gradient-animation">Antwerp, Belgium</span>.{" "}
                  I'm currently in my final year at Thomas More Mechelen
                  studying{" "}
                  <span className="gradient-animation">Data Science</span> (&
                  Cybersecurity) and working as a{" "}
                  <span className="gradient-animation">
                    Solutions Engineer Intern (AI Apps + Data)
                  </span>{" "}
                  at <span className="gradient-animation">Microsoft</span>.
                  <a
                    className="see-more"
                    onClick={() => setIsWhoAmIVisible(!isWhoAmIVisible)}
                  >
                    {" "}
                    {isWhoAmIVisible ? "" : "See more..."}
                  </a>
                  {isWhoAmIVisible ? (
                    <span className="">{textWhoAmI}</span>
                  ) : (
                    <></>
                  )}
                  <a
                    className="see-more"
                    onClick={() => setIsWhoAmIVisible(!isWhoAmIVisible)}
                  >
                    {" "}
                    {isWhoAmIVisible ? "See less..." : ""}
                  </a>
                </p>
              </div>
            </div>

            <div className="about-me-text-2">
              <div className="about-me-text-2-title">
                <h3>Goals</h3>
              </div>

              <div className="about-me-text-2-content">
                <table>
                  <thead>
                    <th>Field</th>

                    <th>Goal(s)</th>

                    <th>Deadline</th>
                  </thead>

                  <tr>
                    <td>AI/ML + Web</td>

                    <td>Deployed RAG Portfolio</td>

                    <td>December 2026</td>
                  </tr>

                  <tr>
                    <td>Software</td>

                    <td>Completed NeetCode 150</td>

                    <td>December 2026</td>
                  </tr>

                  <tr>
                    <td>Life</td>

                    <td>Buy Porsche 918 Spyder</td>

                    <td>September 2035</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="skills-container">
          <motion.div
            className="technologies"
            initial={{ opacity: 0, transform: "translateX(50px)" }}
            animate={
              inView
                ? { opacity: 1, transform: "translateX(0px)" }
                : { opacity: 0, transform: "translateX(50px)" }
            }
            transition={{ duration: 1 }}
          >
            <div className="technologies-title">
              <h3>Technologies</h3>
            </div>

            <div className="technologies-list-container">
              {techStackData.map((data) => (
                <div
                  key={data.id}
                  // if the data is the current data, show it
                  className={
                    techStackData[currentIndex].id === data.id ? "" : "slide"
                  }
                >
                  <div className="technologies-list-title">
                    <h4>{data.title}</h4>
                  </div>

                  <div className="technologies-list">
                    {Object.values(data.items).map((item, index) => {
                      return (
                        <motion.div
                          className="technologyCard"
                          key={index}
                          variants={fadeInAnimationVariants}
                          initial="initial"
                          whileInView="animate"
                          custom={index}
                        >
                          <div className="technology-opacityLayer">
                            <div
                              className="technology-bg"
                              style={{ backgroundColor: item.hex }}
                            >
                              <img
                                width={24}
                                height={24}
                                src={item.src}
                                alt={item.alt}
                              />
                            </div>

                            <div className="technology-txt">{item.name}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Previous button */}
              <div onClick={prev} className="prev">
                <i className="bx bx-chevron-left"></i>
              </div>

              {/* Next button */}
              <div onClick={next} className="next">
                <i className="bx bx-chevron-right"></i>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="viewProjects"
            onClick={() => (window.location.href = "#projects")}
            initial={{ opacity: 0, transform: "translateY(50px)" }}
            animate={
              inView
                ? { opacity: 1, transform: "translateY(0px)" }
                : { opacity: 0, transform: "translateY(50px)" }
            }
            transition={{ duration: 1 }}
          >
            <div className="viewProjects-opacityLayer">
              <div className="viewProjects-title">
                <p>Enough chatting, let's see some projects!</p>
              </div>

              <div className="viewProjects-arrow">
                <i className="bx bx-chevron-right"></i>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
