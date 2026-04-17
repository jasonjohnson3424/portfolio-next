"use client";
import { useState } from "react";
import Image from "next/image";
import { recommendations } from "../data/recommendations";

const Recommendations = () => {
  const visible = recommendations.filter((r) => r.featured);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const prev = () => {
    setActive((a) => (a - 1 + visible.length) % visible.length);
    setExpanded(false);
  };
  const next = () => {
    setActive((a) => (a + 1) % visible.length);
    setExpanded(false);
  };

  const current = visible[active];

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

              <div className={`rec-body-wrapper${expanded ? " rec-body-wrapper--expanded" : ""}`}>
                <p className="rec-body">{current.body}</p>
              </div>
              <button
                className="rec-expand-btn"
                onClick={() => setExpanded((e) => !e)}
              >
                {expanded ? "Show less" : "Read more"}
              </button>

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
