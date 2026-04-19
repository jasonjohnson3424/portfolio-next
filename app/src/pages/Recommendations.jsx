"use client";
import { useState, useLayoutEffect, useRef } from "react";
import Image from "next/image";

const Avatar = ({ rec }) => {
  const [imgError, setImgError] = useState(false);
  const inner = rec.avatarUrl && !imgError ? (
    <Image
      src={rec.avatarUrl}
      alt={rec.authorName}
      width={96}
      height={96}
      unoptimized
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      onError={() => setImgError(true)}
    />
  ) : (
    <span className="rec-avatar-initials">{rec.avatarInitials}</span>
  );
  return rec.linkedInUrl ? (
    <a href={rec.linkedInUrl} target="_blank" rel="noopener noreferrer">{inner}</a>
  ) : inner;
};
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
  const wrapperRef = useRef(null);
  const [clampLines, setClampLines] = useState(6);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const paras = Array.from(wrapper.querySelectorAll("p"));
    if (paras.length < 2) { setClampLines(6); return; }
    const lineHeight = parseFloat(getComputedStyle(paras[0]).lineHeight);
    const zoneMin = lineHeight * 5;
    const zoneMax = lineHeight * 8;
    const hasBreakInZone = paras.slice(1).some((p) => p.offsetTop >= zoneMin && p.offsetTop <= zoneMax);
    setClampLines(hasBreakInZone ? 5 : 6);
  }, [current]);

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

              <div
                ref={wrapperRef}
                className={`rec-body-wrapper${expanded ? " rec-body-wrapper--expanded" : ""}`}
                onClick={expanded ? () => setExpanded(false) : undefined}
                style={expanded
                  ? { cursor: "pointer" }
                  : clampLines === 5
                    ? { maxHeight: `calc(1.8em * 5 + 0.75rem)` }
                    : undefined}
              >
                {current.body.split("\n\n").map((para, i) => (
                  <p key={i} className="rec-body">{para}</p>
                ))}
              </div>
              <button
                className="rec-expand-btn"
                onClick={() => setExpanded((e) => !e)}
              >
                {expanded ? "Show less" : "Read more"}
              </button>

              <div className="rec-author rec-author--bottom">
                <div className="rec-avatar">
                  <Avatar rec={current} />
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
                  <p className="rec-author-meta">{current.authorTitle}</p>
                  <p className="rec-author-meta">{current.authorCompany}</p>
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
