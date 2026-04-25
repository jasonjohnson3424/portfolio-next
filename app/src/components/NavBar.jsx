"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Recommendations", href: "#recommendations" },
  { label: "Contact", href: "#contact" },
];

const NavBar = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ["hero", ...NAV_LINKS.map((l) => l.href.slice(1))];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    // If no sections exist on this page (e.g. project detail), clear active state
    if (sections.length === 0) {
      const t = setTimeout(() => setActiveSection(""), 0);
      return () => clearTimeout(t);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id === "hero" ? "" : id);
          }
        });
      },
      { rootMargin: "-45% 0px -54% 0px", threshold: 0 },
    );

    sections.forEach((el) => obs.observe(el));

    return () => obs.disconnect();
  }, [pathname]);

  const scrollTo = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    if (window.location.pathname !== "/") {
      window.location.href = "/" + href;
      return;
    }
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark fixed-top${scrolled ? " scrolled" : ""}${menuOpen ? " nav-menu-open" : ""}`}
    >
      <div className="container">
        {isHome ? (
          <a
            className="nav-logo"
            href="#top"
            onClick={(e) => scrollTo(e, "#top")}
          >
            <Image
              src={scrolled ? "/logo.svg" : "/logo-white.svg"}
              alt="Jason L. Johnson logo"
              height={20}
              width={20}
              style={{ height: "3rem", width: "3rem" }}
            />
          </a>
        ) : (
          <Link className="nav-logo" href="/">
            <Image
              src={scrolled ? "/logo.svg" : "/logo-white.svg"}
              alt="Jason L. Johnson logo"
              height={20}
              width={20}
              style={{ height: "3rem", width: "3rem" }}
            />
          </Link>
        )}
        <span className="nav-logo-name" aria-hidden="true">Jason L. Johnson</span>
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            {NAV_LINKS.map(({ label, href }) => (
              <li className="nav-item" key={href}>
                <a
                  className={`nav-link${activeSection === href.slice(1) ? " active" : ""}`}
                  href={`/${href}`}
                  onClick={(e) => scrollTo(e, href)}
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="nav-item ms-lg-2">
              <Link
                className="nav-link nav-hire-btn"
                href="/#contact"
                onClick={(e) => scrollTo(e, "#contact")}
              >
                Hire Me
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
