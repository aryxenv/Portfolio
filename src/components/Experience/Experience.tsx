import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { experienceData } from "./Experience";
import "./Experience.css";

const experienceVariants = {
  hidden: { opacity: 0, transform: "translateY(50px)" },
  visible: (i: number) => ({
    transform: "translateY(0px)",
    opacity: 1,
    transition: { delay: i * 0.3, duration: 0.6, ease: "easeOut" },
  }),
};

const Experience = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="component experience" id="experience">
      <div className="experience-container" ref={ref}>
        <motion.div
          className="experience-title"
          initial={{ opacity: 0, transform: "translateY(-50px)" }}
          animate={
            inView
              ? { opacity: 1, transform: "translateY(0px)" }
              : { opacity: 0, transform: "translateY(-50px)" }
          }
          transition={{ duration: 1 }}
        >
          <h2>Experience</h2>
        </motion.div>

        <div className="experience-list-container">
          {experienceData.map((experience, index) => (
            <motion.div
              className="experience-item"
              key={index}
              variants={experienceVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={index}
            >
              <div className="experience-item-opacity">
                <div className="experience-left">
                  <div className="experience-header">
                    <h3 className="experience-company">{experience.company}</h3>
                    {experience.status == "green" && (
                      <div className={`experience-status`} />
                    )}
                  </div>
                  <p className="experience-summary">{experience.summary}</p>
                  <p className="experience-date">{experience.date}</p>
                </div>

                <div className="experience-middle">
                  <div className="experience-field">
                    <span className="experience-label">Position</span>
                    <span className="experience-value">
                      {experience.position}
                    </span>
                  </div>
                  <div className="experience-field">
                    <span className="experience-label">Location</span>
                    <span className="experience-value">
                      {experience.location}
                    </span>
                  </div>
                  <div className="experience-field">
                    <span className="experience-label">Industry</span>
                    <span className="experience-value">
                      {experience.industry}
                    </span>
                  </div>
                  <div className="experience-field">
                    <span className="experience-label">Website</span>
                    <a
                      className="experience-value"
                      href={experience.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {experience.website}
                    </a>
                  </div>
                </div>

                <div className="experience-right">
                  {experience.description.map((desc, i) => (
                    <p key={i} className="experience-desc-paragraph">
                      {desc}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
