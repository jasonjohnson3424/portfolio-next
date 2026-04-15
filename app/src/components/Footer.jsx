"use client";
import Image from "next/image";

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollTo = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <a
              className="footer-logo d-inline-flex justify-content-center mb-2"
              href="#hero"
              onClick={(e) => scrollTo(e, "#hero")}
            >
              <Image
                src="/1x1-chartreuse.svg"
                alt="Jason L. Johnson logo"
                height={40}
                width={40}
                style={{ height: "3rem", width: "3rem" }}
              />
              &nbsp;&nbsp;Jason L. Johnson
            </a>
            <p className="footer-tagline">
              Learning &amp; Development Manager · Instructional Designer · Web
              Developer
            </p>
            <hr className="footer-divider" />
            <nav
              className="footer-nav footer-nav--centered mb-3"
              aria-label="Footer navigation"
            >
              {[
                { label: "About", href: "#about" },
                { label: "Projects", href: "#projects" },
                { label: "Services", href: "#services" },
                { label: "Recommendations", href: "#recommendations" },
                { label: "Contact", href: "#contact" },
              ].map(({ label, href }) => (
                <a key={href} href={href} onClick={(e) => scrollTo(e, href)}>
                  {label}
                </a>
              ))}
            </nav>
            <div className="footer-social justify-content-center">
              <a
                href="https://www.linkedin.com/in/jason-johnson-264835146/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              {/* TODO: Activate GitHub link when profile is ready. href="https://github.com/jasonljohnson" */}
              {/* FUTURE: Add social icons for Instagram, Facebook, X/Twitter, YouTube, etc. */}
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <p className="footer-copyright text-center mb-0">
          &copy; {year} Jason L. Johnson. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
