import "boxicons/css/boxicons.min.css";
import { useEffect, useState } from "react";
import "./Navbar.css";
import colorModeDark from "./icons8-dark-mode-100.png";
import colorModeLight from "./icons8-light-mode-100.png";
import logoGray from "./l145logo-nobg-gray.png";

function Navbar({ activeSection }: { activeSection: string | null }) {
  // Initialize theme from localStorage or system preference
  const getInitialTheme = (): "light" | "dark" => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (storedTheme) {
      return storedTheme;
    }
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return prefersDarkMode ? "dark" : "light";
  };

  // State of theme
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
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

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // apply theme on change
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      document.getElementById("colorMode")?.setAttribute("src", colorModeLight);
    } else {
      root.setAttribute("data-theme", "light");
      document.getElementById("colorMode")?.setAttribute("src", colorModeDark);
    }
  }, [theme]);

  // toggle theme
  const toggleTheme = () => {
    const body = document.body;

    if (theme === "dark") {
      setTheme("light");
      body.classList.add("themeAnimation");
      localStorage.setItem("theme", "light");
    } else {
      setTheme("dark");
      body.classList.add("themeAnimation");
      localStorage.setItem("theme", "dark");
    }
  };

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
      <nav className="navbar scrolled">
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
              About
            </a>
          </li>
          <li>
            <a
              href="#experience"
              onClick={(e) => e.currentTarget.classList.add("active")}
              className={activeSection === "experience" ? "active" : ""}
            >
              Experience
            </a>
          </li>
          <li>
            <a
              href="#projects"
              onClick={(e) => e.currentTarget.classList.add("active")}
              className={activeSection === "projects" ? "active" : ""}
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#contact"
              onClick={(e) => e.currentTarget.classList.add("active")}
              className={activeSection === "contact" ? "active" : ""}
            >
              Contact
            </a>
          </li>
        </ul>
        <div className="colorModeWrapper">
          <img
            id="colorMode"
            src={colorModeDark}
            alt="colorMode"
            onClick={toggleTheme}
          />
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
