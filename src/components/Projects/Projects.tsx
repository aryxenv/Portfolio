import "./Projects.css";
import "boxicons/css/boxicons.min.css";
import { ProjectCardData } from "../../utils/ProjectCard/ProjectCardData.ts";
import ProjectCard from "../../utils/ProjectCard/ProjectCard.tsx";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const projectVariants = {
  hidden: { opacity: 0, transform: "translateY(50px)" },
  visible: (i: number) => ({
    transform: "translateY(0px)",
    opacity: 1,
    transition: { delay: i * 0.3, duration: 0.6, ease: "easeOut" },
  }),

  contactMe: {
    hidden: { opacity: 0, transform: "translateX(50px)" },
    visible: {
      opacity: 1,
      transform: "translateX(0px)",
      transition: { delay: 6 * 0.3, duration: 0.6, ease: "easeOut" },
    },
  },
};

function Projects() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section className="component projects" id="projects">
      <div className="projects-container" ref={ref}>
        <motion.div
          className="projects-title"
          initial={{ opacity: 0, transform: "translateY(-50px)" }}
          animate={
            inView
              ? { opacity: 1, transform: "translateY(0px)" }
              : { opacity: 0, transform: "translateY(-50px)" }
          }
          transition={{ duration: 1 }}
        >
          <h2>Projects</h2>
        </motion.div>

        <div className="projects-list-container">
          {ProjectCardData.slice(0, 5).map((project, index) => (
            <motion.div
              key={project.id}
              variants={projectVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={index}
            >
              <ProjectCard
                id={project.id}
                title={project.title}
                description={project.description}
                websiteLink={project.websiteLink}
                githubLink={project.githubLink}
                status={project.status}
              />
            </motion.div>
          ))}

          <div className="extra-options-container">
            <motion.div
              variants={projectVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={ProjectCardData.length - 1}
            >
              <ProjectCard
                id={ProjectCardData[5].id}
                title={ProjectCardData[5].title}
                description={ProjectCardData[5].description}
                websiteLink={ProjectCardData[5].websiteLink}
                githubLink={ProjectCardData[5].githubLink}
                status={ProjectCardData[5].status}
              />
            </motion.div>

            <motion.div
              className="contact-me-container-vertical"
              // whileHover={{ opacity: 1 }}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={ProjectCardData.length + 1}
              variants={projectVariants.contactMe}
              onClick={() => (window.location.href = "#contact")}
            >
              <div className="contact-me-opacityLayer">
                <div className="contact-me-title">
                  <span className="rotate90deg">Or... Contact me!</span>
                </div>
                <div className="contact-me-arrow">
                  <i className="bx bx-chevron-down"></i>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
