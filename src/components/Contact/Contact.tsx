import "boxicons/css/boxicons.min.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import "./Contact.css";
import { socialsData } from "./Socials.ts";
import aryan_cv_pdf from "./aryan_shah_cv.pdf";
import aryan_cv_img from "./aryan_shah_cv.png";

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    transform: "translateY(50px)",
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

// cv data
const photos = [
  {
    id: "cv1",
    title: "General",
    cv_name: "aryan_cv_img",
    url: aryan_cv_img,
    pdf: aryan_cv_pdf,
  },
];

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, transform: "translateX(-10px)" },
  visible: {
    opacity: 1,
    transform: "translateX(0px)",
    transition: { duration: 0.5 },
  },
};

function Contact() {
  // show the photo with this index
  const [currentIndex, setCurrentIndex] = useState(0);
  const letsTalkText = "Let's talk!";

  // move to the next photo
  // if we are at the end, go to the first photo
  const next = () => {
    setCurrentIndex((currentIndex + 1) % photos.length);
  };

  // move to the previous photo
  // if we are at the beginning, go to the last photo
  const prev = () => {
    setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);
  };

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
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section className="component contact" id="contact">
      <div className="contact-container" ref={ref}>
        <div className="main-contact-container">
          <motion.h3
            initial={{ opacity: 0, transform: "translateY(-50px)" }}
            animate={
              inView
                ? { opacity: 1, transform: "translateY(0px)" }
                : { opacity: 0, transform: "translateY(-50px)" }
            }
            transition={{ duration: 1 }}
          >
            Like what you see?
          </motion.h3>

          <motion.h2
            variants={staggerVariants}
            initial="hidden"
            animate={inView ? "visible" : ""}
          >
            {letsTalkText.split("").map((letter, index) => (
              <motion.span key={index} variants={letterVariants}>
                {letter}
              </motion.span>
            ))}
          </motion.h2>

          <motion.div
            className="sepLineContact"
            initial={{ width: "0%" }}
            animate={inView ? { width: "20%" } : { width: "0%" }}
            transition={{ duration: 1 }}
          ></motion.div>

          <div className="socials">
            {socialsData.map((social: any, index: number) => (
              <motion.div
                className={`socialCard ${social.name.toLowerCase()}`}
                key={index}
                onClick={() => window.open(social.url, "_blank")}
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                custom={index}
              >
                <div className="social-opacityLayer">
                  <div className={`socialbg ${social.bgClass}`}>
                    <i className={social.icon}></i>
                  </div>

                  <div
                    className={`socialtxt ${social.name.toLowerCase()}-text`}
                  >
                    {social.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {isSmallScreen ? (
            <></>
          ) : (
            <motion.p
              initial={{ opacity: 0, transform: "translateY(50px)" }}
              animate={
                inView
                  ? { opacity: 1, transform: "translateY(0px)" }
                  : { opacity: 0, transform: "translateY(50px)" }
              }
              transition={{ duration: 1 }}
            >
              Designed & Developed by Aryan Shah &nbsp;|&nbsp; ©{" "}
              {new Date().getFullYear()} All rights reserved.
            </motion.p>
          )}
        </div>

        <motion.div
          className="cv-section-container"
          initial={{ opacity: 0, transform: "translateX(50px)" }}
          animate={
            inView
              ? { opacity: 1, transform: "translateX(0px)" }
              : { opacity: 0, transform: "translateX(50px)" }
          }
          transition={{ duration: 1 }}
        >
          <h4>Want more details?</h4>
          <div className="cv-container">
            {photos.map((photo) => (
              <div
                onClick={() => window.open(photo.pdf, "_blank")}
                key={photo.id}
                // if the photo is the current photo, show it
                className={
                  photos[currentIndex].id === photo.id
                    ? "imgWrapper"
                    : "imgWrapper slide"
                }
              >
                <img src={photo.url} alt={photo.title} className="photo" />

                <div className="caption-wrapper">
                  <div className="caption">{photo.title}</div>
                </div>

                <div
                  className="openPDF"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(photo.pdf, "_blank");
                  }}
                >
                  <i className="bx bx-link-external"></i>
                </div>

                <div
                  className="downloadPDF"
                  onClick={(e) => {
                    e.stopPropagation();
                    const linkEl = document.createElement(
                      "a"
                    ) as HTMLAnchorElement;
                    linkEl.href = photo.pdf;
                    linkEl.download = photo.cv_name;
                    document.body.appendChild(linkEl);
                    linkEl.click();
                    document.body.removeChild(linkEl);
                  }}
                >
                  <i className="bx bx-download"></i>
                </div>
              </div>
            ))}

            {/* Previous button */}
            {photos.length > 1 && (
              <>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="prev"
                >
                  <i className="bx bx-chevron-left"></i>
                </div>

                {/* Next button */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="next"
                >
                  <i className="bx bx-chevron-right"></i>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {isSmallScreen ? (
          <>
            <p className="text-align-left">
              Designed & Developed by Aryan Shah &nbsp;|&nbsp; ©{" "}
              {new Date().getFullYear()} All rights reserved.
            </p>
          </>
        ) : (
          <></>
        )}
      </div>
    </section>
  );
}

export default Contact;
