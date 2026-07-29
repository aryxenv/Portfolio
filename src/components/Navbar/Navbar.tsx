import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AddressBook } from "@phosphor-icons/react/AddressBook";
import { Notebook } from "@phosphor-icons/react/Notebook";
import { Package } from "@phosphor-icons/react/Package";
import { SuitcaseSimple } from "@phosphor-icons/react/SuitcaseSimple";
import { User } from "@phosphor-icons/react/User";
import "./Navbar.css";
import logoGray from "./l145logo-nobg-gray.png";
import { scrollToTop } from "../../utils/scroll.ts";

/**
 * Rendered left to right. A `section` item scrolls the one-pager; a `route`
 * item is its own page. Reordering the nav means reordering this array.
 */
const NAV_ITEMS = [
  { kind: "section", id: "about", label: "About", icon: <User size={20} /> },
  {
    kind: "section",
    id: "experience",
    label: "Experience",
    icon: <SuitcaseSimple size={20} />,
  },
  {
    kind: "section",
    id: "projects",
    label: "Projects",
    icon: <Package size={20} />,
  },
  { kind: "route", id: "blog", label: "Blog", icon: <Notebook size={20} /> },
  {
    kind: "section",
    id: "contact",
    label: "Contact",
    icon: <AddressBook size={20} />,
  },
] as const;

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
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isBlog = location.pathname.startsWith("/blog");

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
        <Link
          to="/"
          className="navbar-logo"
          aria-label="Aryan Shah — back to top"
          onClick={(e) => {
            if (isHome) {
              // already home: drop any section hash and go back to the top
              e.preventDefault();
              navigate("/", { replace: true });
              scrollToTop();
            }

            setTimeout(() => {
              removeActive();
            }, 400);
          }}
        >
          <img src={logoGray} alt="" id="logo" aria-hidden="true" />
        </Link>
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              {item.kind === "route" ? (
                <Link
                  to={`/${item.id}`}
                  className={isBlog ? "active" : ""}
                  aria-current={isBlog ? "page" : undefined}
                >
                  {isMobile ? item.icon : item.label}
                </Link>
              ) : isHome ? (
                <a
                  href={`#${item.id}`}
                  onClick={(e) => e.currentTarget.classList.add("active")}
                  className={activeSection === item.id ? "active" : ""}
                  aria-current={activeSection === item.id ? "true" : undefined}
                >
                  {isMobile ? item.icon : item.label}
                </a>
              ) : (
                // off the one-pager, the section links have to route home first
                <Link to={`/#${item.id}`}>
                  {isMobile ? item.icon : item.label}
                </Link>
              )}
            </li>
          ))}
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

      <button
        type="button"
        className={`back-to-top ${scrolled ? "" : "hidden"}`}
        aria-label="Back to top"
        onClick={() => scrollToTop()}
      >
        <i className="bx bx-chevron-up"></i>
      </button>
    </>
  );
}

export default Navbar;
