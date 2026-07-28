import { useEffect, useState } from "react";
import { AddressBook } from "@phosphor-icons/react/AddressBook";
import { Package } from "@phosphor-icons/react/Package";
import { SuitcaseSimple } from "@phosphor-icons/react/SuitcaseSimple";
import { User } from "@phosphor-icons/react/User";
import "./Navbar.css";
import logoGray from "./l145logo-nobg-gray.png";

function Navbar({
  activeSection,
  lowPerfMode,
  onTogglePerfMode,
}: {
  activeSection: string | null;
  lowPerfMode: boolean;
  onTogglePerfMode: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position and toggle scrolled state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // remove all "active" from a tags
  const removeActive = () => {
    const navbar = document.querySelector(".navbar");
    const aTags = navbar?.querySelectorAll("a");

    aTags?.forEach((e) => {
      if (e.classList.contains("active")) {
        e.classList.remove("active");
      }
    });
  };

  // main nav structure
  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <img
          src={logoGray}
          alt="logo"
          id="logo"
          onClick={() => {
            window.location.href = "#home";
            setTimeout(() => {
              removeActive();
            }, 400);
          }}
        />
        <ul>
          <li>
            <a
              href="#about"
              onClick={(e) => e.currentTarget.classList.add("active")}
              className={activeSection === "about" ? "active" : ""}
            >
              {isMobile ? <User size={20} /> : "About"}
            </a>
          </li>
          <li>
            <a
              href="#experience"
              onClick={(e) => e.currentTarget.classList.add("active")}
              className={activeSection === "experience" ? "active" : ""}
            >
              {isMobile ? <SuitcaseSimple size={20} /> : "Experience"}
            </a>
          </li>
          <li>
            <a
              href="#projects"
              onClick={(e) => e.currentTarget.classList.add("active")}
              className={activeSection === "projects" ? "active" : ""}
            >
              {isMobile ? <Package size={20} /> : "Projects"}
            </a>
          </li>
          <li>
            <a
              href="#contact"
              onClick={(e) => e.currentTarget.classList.add("active")}
              className={activeSection === "contact" ? "active" : ""}
            >
              {isMobile ? <AddressBook size={20} /> : "Contact"}
            </a>
          </li>
        </ul>
        <div className="colorModeWrapper">
          <button
            type="button"
            id="perfMode"
            className="perfModeToggle"
            onClick={onTogglePerfMode}
            aria-pressed={!lowPerfMode}
            aria-label={
              lowPerfMode
                ? "Performance mode: low. Click to turn the animated background on."
                : "Performance mode: high. Click to turn the animated background off."
            }
            title={
              lowPerfMode
                ? "Low performance mode (animated background off)"
                : "High performance mode (animated background on)"
            }
          >
            <i
              className={`bx ${lowPerfMode ? "bx-bolt-circle" : "bxs-bolt-circle"}`}
            ></i>
          </button>
        </div>
      </nav>

      <div
        className={`back-to-top ${scrolled ? "" : "hidden"}`}
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = "#home";
        }}
      >
        <i className="bx bx-chevron-up"></i>
      </div>
    </>
  );
}

export default Navbar;
