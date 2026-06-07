import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { highlightText } from "../../utils/highlight.tsx";
import "./About.css";
import { techStackData } from "./TechStackData.ts";

const panelViewport = {
  once: true,
  amount: 0.3,
} as const;

const cardViewport = {
  once: true,
  amount: 0.25,
} as const;

const panelTransition = {
  type: "spring",
  stiffness: 120,
  damping: 22,
} as const;

const technologyCardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 32,
    scale: 0.96,
  },

  animate: (index: number) => {
    return {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 24,
        delay: 0.04 * index,
      },
    };
  },
};

function About() {
  // show the field with this index
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWhoAmIVisible, setIsWhoAmIVisible] = useState(false);
  const [isTechMenuOpen, setIsTechMenuOpen] = useState(false);
  const techMenuRef = useRef<HTMLDivElement>(null);

  const textWhoAmI = `\n\nI like turning customer problems into **Azure AI app demos**, **technical validations**, and practical solution paths. In my free time, I build **full-stack apps**, experiment with **agentic AI**, and keep up with **finance** on the side.\n\nI'm always looking to expand my skills and build cool things. Oh, and the ultimate life goal? Owning my favorite car, a **Porsche 918 Spyder**.`;

  useEffect(() => {
    if (!isTechMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Node && techMenuRef.current?.contains(target)) {
        return;
      }

      setIsTechMenuOpen(false);
    };

    const closeTechMenu = () => setIsTechMenuOpen(false);

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("scroll", closeTechMenu, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", closeTechMenu, true);
    };
  }, [isTechMenuOpen]);

  const selectTechIndex = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
    setIsTechMenuOpen(false);
  };

  // move to the next field
  // if we are at the end, go to the first field
  const next = () => {
    selectTechIndex((currentIndex + 1) % techStackData.length);
  };

  // move to the previous field
  // if we are at the beginning, go to the last field
  const prev = () => {
    selectTechIndex(
      (currentIndex - 1 + techStackData.length) % techStackData.length,
    );
  };

  return (
    <section className="component about" id="about">
      <div className="about-container">
        <motion.div
          className="about-me-container"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={panelViewport}
          transition={panelTransition}
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
                  <strong className="highlight">Antwerp, Belgium</strong>.{" "}
                  I'm a{" "}
                  <strong className="highlight">Data Science</strong>{" "}
                  graduate from Thomas More University of Applied Sciences and
                  currently working as a{" "}
                  <strong className="highlight">
                    Solutions Engineer Intern (Applications + AI/ML)
                  </strong>{" "}
                  at <strong className="highlight">Microsoft</strong>.
                  <a
                    className="see-more"
                    onClick={() => setIsWhoAmIVisible(!isWhoAmIVisible)}
                  >
                    {" "}
                    {isWhoAmIVisible ? "" : "See more..."}
                  </a>
                  {isWhoAmIVisible ? (
                    <span className="">{highlightText(textWhoAmI)}</span>
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
                    <tr>
                      <th>Field</th>

                      <th>Goal(s)</th>

                      <th>Deadline</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Life</td>

                      <td>Buy Porsche 918 Spyder</td>

                      <td>September 2035</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="skills-container">
          <motion.div
            className="technologies"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={panelViewport}
            transition={panelTransition}
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
                  <div
                    className="technologies-list-title"
                    ref={
                      techStackData[currentIndex].id === data.id
                        ? techMenuRef
                        : undefined
                    }
                  >
                    <button
                      type="button"
                      className="technologies-list-toggle"
                      aria-expanded={isTechMenuOpen}
                      aria-label="Choose technology category"
                      onClick={() => setIsTechMenuOpen(!isTechMenuOpen)}
                    >
                      <span className="technologies-list-label">
                        {data.title}
                      </span>
                      <motion.i
                        className="bx bx-chevron-down"
                        animate={{ rotate: isTechMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      ></motion.i>
                    </button>

                    <AnimatePresence>
                      {isTechMenuOpen ? (
                        <motion.div
                          className="technologies-category-menu"
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                        >
                          {techStackData.map((category, index) => (
                            <button
                              type="button"
                              key={category.id}
                              className={
                                index === currentIndex
                                  ? "technologies-category-option active"
                                  : "technologies-category-option"
                              }
                              onClick={() => selectTechIndex(index)}
                            >
                              {category.title}
                            </button>
                          ))}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>

                  <div className="technologies-list">
                    {Object.values(data.items).map((item, index) => {
                      return (
                        <motion.div
                          className="technologyCard"
                          key={index}
                          variants={technologyCardVariants}
                          initial="initial"
                          whileInView="animate"
                          viewport={cardViewport}
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
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={panelViewport}
            transition={panelTransition}
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
