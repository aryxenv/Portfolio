import { motion } from "framer-motion";
import { useState } from "react";
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
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>(
    {},
  );
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const toggleRole = (roleId: string) => {
    setExpandedRoles((currentExpandedRoles) => ({
      ...currentExpandedRoles,
      [roleId]: !currentExpandedRoles[roleId],
    }));
  };

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
              key={experience.id}
              variants={experienceVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={index}
            >
              <div className="experience-timeline-marker">
                <div
                  className={`experience-timeline-dot ${
                    experience.status === "green"
                      ? "experience-timeline-dot-active"
                      : ""
                  }`}
                />
              </div>

              <div className="experience-item-opacity">
                <div className="experience-left">
                  <div className="experience-header">
                    <h3 className="experience-company">{experience.company}</h3>
                  </div>
                  <p className="experience-date">{experience.dateRange}</p>
                  <div className="experience-field">
                    <span className="experience-label">Base</span>
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

                <div className="experience-roles">
                  {experience.roles.map((role) => {
                    const isExpanded = expandedRoles[role.id];
                    const visibleDescriptions = isExpanded
                      ? role.description
                      : role.description.slice(0, 1);

                    return (
                      <div className="experience-role" key={role.id}>
                        <div className="experience-role-header">
                          <div>
                            <h4 className="experience-role-title">
                              {role.position}
                            </h4>
                            <p className="experience-date">{role.date}</p>
                          </div>
                          <p className="experience-role-location">
                            {role.location}
                          </p>
                        </div>

                        <div className="experience-right">
                          {visibleDescriptions.map((desc, i) => (
                            <p key={i} className="experience-desc-paragraph">
                              {desc}
                            </p>
                          ))}

                          {role.description.length > 1 && (
                            <button
                              className="experience-see-more"
                              type="button"
                              onClick={() => toggleRole(role.id)}
                            >
                              {isExpanded ? "See less..." : "See more..."}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
