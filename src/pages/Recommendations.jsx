"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { recommendations } from "../data/recommendations";

const getTruncateLimit = () => {
  if (typeof window === "undefined") return 1003;
  if (window.innerWidth < 576) return 300;
  if (window.innerWidth < 992) return 500;
  return 1003;
};

const Recommendations = () => {
  const visible = recommendations.filter((r) => r.featured);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [truncateAt, setTruncateAt] = useState(1003);

  useEffect(() => {
    const update = () => setTruncateAt(getTruncateLimit());
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const prev = () => {
    setActive((a) => (a - 1 + visible.length) % visible.length);
    setExpanded(false);
  };
  const next = () => {
    setActive((a) => (a + 1) % visible.length);
    setExpanded(false);
  };

  const current = visible[active];
  const needsTruncation = current.body.length > truncateAt;
  const displayBody =
    needsTruncation && !expanded
      ? current.body.slice(0, truncateAt).trimEnd()
      : current.body;

  return (
    <section id="recommendations">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-eyebrow">Social Proof</span>
          <h2 className="section-title">What Others Are Saying</h2>
          <div className="section-divider"></div>
        </div>

        <div
          className="row justify-content-center"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="col-lg-8">
            <div className="rec-carousel">
              <div className="rec-quote-icon">
                <i className="fas fa-quote-left"></i>
              </div>

              <p className="rec-body">
                {displayBody}
                {needsTruncation && !expanded && (
                  <>
                    {"\u2026 "}
                    <button
                      className="rec-expand-btn"
                      onClick={() => setExpanded(true)}
                    >
                      Read more
                    </button>
                  </>
                )}
                {needsTruncation && expanded && (
                  <>
                    {" "}
                    <button
                      className="rec-expand-btn"
                      onClick={() => setExpanded(false)}
                    >
                      Show less
                    </button>
                  </>
                )}
              </p>

              <div className="rec-author">
                <div className="rec-avatar">
                  {current.linkedInUrl ? (
                    <a
                      href={current.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {current.avatarUrl ? (
                        <Image
                          src={current.avatarUrl}
                          alt={current.authorName}
                          width={96}
                          height={96}
                        />
                      ) : (
                        current.avatarInitials
                      )}
                    </a>
                  ) : current.avatarUrl ? (
                    <Image
                      src={current.avatarUrl}
                      alt={current.authorName}
                      width={96}
                      height={96}
                    />
                  ) : (
                    current.avatarInitials
                  )}
                </div>
                <div>
                  <p className="rec-author-name">
                    {current.linkedInUrl ? (
                      <a
                        href={current.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {current.authorName}
                      </a>
                    ) : (
                      current.authorName
                    )}
                  </p>
                  <p className="rec-author-meta">
                    {current.authorTitle} · {current.authorCompany}
                  </p>
                </div>
              </div>
            </div>

            {visible.length > 1 && (
              <div className="rec-controls">
                <button
                  className="rec-nav-btn"
                  onClick={prev}
                  aria-label="Previous recommendation"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className="rec-dots">
                  {visible.map((_, i) => (
                    <button
                      key={i}
                      className={`rec-dot${i === active ? " active" : ""}`}
                      onClick={() => {
                        setActive(i);
                        setExpanded(false);
                      }}
                      aria-label={`Go to recommendation ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  className="rec-nav-btn"
                  onClick={next}
                  aria-label="Next recommendation"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
