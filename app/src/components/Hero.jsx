"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ROLES = [
  "Learning & Development Manager",
  "Instructional Designer",
  "Web Developer",
];

const useTypewriter = (words, speed = 80, pause = 1800) => {
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else {
      timeout = setTimeout(() => {
        setDeleting(false);
        setWordIdx((w) => (w + 1) % words.length);
      }, 0);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return words[wordIdx].slice(0, charIdx);
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
});

const Hero = () => {
  const role = useTypewriter(ROLES);

  const scrollTo = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="hero">
      {/* Desktop layout: left-aligned column */}
      <div className="container hero-desktop">
        <div className="row justify-content-start">
          <div className="col-lg-5">
            <motion.h1 className="hero-name" {...fadeUp(0.25)}>
              Jason L. Johnson
            </motion.h1>

            <motion.p className="hero-name hero-typewriter" {...fadeUp(0.4)}>
              <span className="typed-text">{role}</span>
              <span className="cursor" aria-hidden="true"></span>
            </motion.p>

            <motion.p className="hero-tagline" {...fadeUp(0.55)}>
              Over 20 years crafting high-impact learning experiences and
              digital solutions.
            </motion.p>

            <motion.div className="hero-actions" {...fadeUp(0.7)}>
              <a
                href="#projects"
                className="btn btn-accent btn-lg"
                onClick={(e) => scrollTo(e, "#projects")}
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="btn btn-accent btn-lg"
                onClick={(e) => scrollTo(e, "#contact")}
              >
                Get In Touch
              </a>
            </motion.div>

            <motion.div className="hero-social" {...fadeUp(0.85)}>
              <a
                href="https://www.linkedin.com/in/jasonlancejohnson/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://github.com/jasonjohnson3424"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
              {/* FUTURE: Add Instagram, Facebook, X/Twitter, YouTube social icons */}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile/tablet layout: bottom bar */}
      <div className="hero-mobile-bar">
        <motion.div className="hero-mobile-text" {...fadeUp(0.25)}>
          <h1 className="hero-name">{`Jason L. Johnson`}</h1>
          <p className="hero-name hero-typewriter">
            <span className="typed-text">{role}</span>
            <span className="cursor" aria-hidden="true"></span>
          </p>
          <p className="hero-tagline">
            Over 20 years crafting high-impact learning experiences and digital
            solutions.
          </p>
        </motion.div>
        <motion.div className="hero-mobile-actions" {...fadeUp(0.45)}>
          <a
            href="#projects"
            className="btn btn-accent"
            onClick={(e) => scrollTo(e, "#projects")}
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="btn btn-accent"
            onClick={(e) => scrollTo(e, "#contact")}
          >
            Get In Touch
          </a>
          <a
            href="https://www.linkedin.com/in/jasonlancejohnson/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hero-mobile-social"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a
            href="https://github.com/jasonjohnson3424"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hero-mobile-social"
          >
            <i className="fab fa-github"></i>
          </a>
        </motion.div>
      </div>

      <a
        href="#about"
        className="hero-scroll-indicator"
        onClick={(e) => scrollTo(e, "#about")}
        aria-label="Scroll down"
      >
        <i className="fas fa-chevron-down"></i>
      </a>
    </section>
  );
};

export default Hero;
