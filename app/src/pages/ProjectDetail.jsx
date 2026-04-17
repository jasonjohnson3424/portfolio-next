"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { projects } from "../data/projects";
import { recommendations } from "../data/recommendations";
import LazyImage from "../components/LazyImage";

const MediaCarousel = ({ items }) => {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState(0);
  const current = sorted[active];

  const prev = () => setActive((i) => (i - 1 + sorted.length) % sorted.length);
  const next = () => setActive((i) => (i + 1) % sorted.length);

  return (
    <div className="media-carousel">
      <div className="media-carousel-stage">
        <LazyImage
          key={current.url + active}
          src={current.url}
          alt={current.alt || `Media ${active + 1}`}
        />
        {sorted.length > 1 && (
          <>
            <button className="media-carousel-btn media-carousel-btn--prev" onClick={prev} aria-label="Previous image">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="media-carousel-btn media-carousel-btn--next" onClick={next} aria-label="Next image">
              <i className="fas fa-chevron-right"></i>
            </button>
          </>
        )}
      </div>

      {current.caption && (
        <p className="media-carousel-caption">{current.caption}</p>
      )}

      {sorted.length > 1 && (
        <div className="media-carousel-dots">
          {sorted.map((_, i) => (
            <button
              key={i}
              className={`rec-dot${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectDetail = ({ slug }) => {
  const router = useRouter();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="container py-5 text-center">
        <h2 className="project-detail-title">Project not found.</h2>
        <button className="btn btn-outline-accent mt-3" onClick={() => router.push("/")}>
          ← Back to Portfolio
        </button>
      </div>
    );
  }

  if (project.protected) {
    return (
      <div className="container py-5 text-center">
        <i className="fas fa-lock fa-3x mb-4" style={{ color: "#8b949e" }}></i>
        <h2 className="h3 mb-2" style={{ color: "#e6edf3" }}>NDA-Protected Project</h2>
        <p style={{ color: "#8b949e", maxWidth: 480, margin: "0 auto 1.5rem" }}>
          This project is covered by a non-disclosure agreement and cannot be shared publicly.
          Please reach out directly to discuss this work.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <button className="btn btn-outline-accent" onClick={() => router.push("/")}>
            ← Back to Portfolio
          </button>
          <Link href="/#contact" className="btn btn-accent">Contact Me</Link>
        </div>
      </div>
    );
  }

  const hasCaseStudy = project.challenge || project.approach || project.outcomes?.length > 0;
  const projectRecs = recommendations.filter((r) => r.projectSlugs?.includes(project.slug));

  return (
    <div className="project-detail">
      <div className="container">
        <button
          className="btn btn-sm project-detail-back-btn mb-4"
          onClick={() => router.push("/")}
        >
          <i className="fas fa-arrow-left me-2"></i>Back to Portfolio
        </button>

        <div className="row g-5">
          {/* Main column */}
          <div className="col-lg-8">
            <div className="project-detail-thumbnail">
              {project.thumbnailUrl
                ? <LazyImage src={project.thumbnailUrl} alt={project.thumbnailAlt || project.title} />
                : <i className="fas fa-folder-open"></i>
              }
            </div>

            <h1 className="project-detail-title">{project.title}</h1>
            <p className="project-detail-description">{project.description}</p>

            {!hasCaseStudy && (
              <div className="project-stub-notice">
                <i className="fas fa-info-circle"></i>
                Full case study coming soon. Contact me to discuss this project in detail.
              </div>
            )}

            {hasCaseStudy && (
              <div className="project-case-study">
                {project.challenge && (
                  <div className="case-study-section">
                    <p className="case-study-label">The Challenge</p>
                    <p className="case-study-text">{project.challenge}</p>
                  </div>
                )}

                {project.approach && (
                  <div className="case-study-section">
                    <p className="case-study-label">My Approach</p>
                    <p className="case-study-text">{project.approach}</p>
                  </div>
                )}

                {project.outcomes?.length > 0 && (
                  <div className="case-study-section">
                    <p className="case-study-label">Outcomes</p>
                    <ul className="case-study-outcomes">
                      {project.outcomes.map((outcome, i) => (
                        <li key={i}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {project.mediaItems?.length > 0 && (
              <MediaCarousel items={project.mediaItems} />
            )}

            {projectRecs.length > 0 && (
              <div className="project-recommendations">
                <p className="project-recommendations-label">What Colleagues Say</p>
                {projectRecs.map((rec) => (
                  <div key={rec.id} className="project-rec-card">
                    <p className="project-rec-body">{rec.body}</p>
                    <div className="project-rec-author">
                      <div className="rec-avatar">
                        {rec.avatarUrl
                          ? <Image src={rec.avatarUrl} alt={rec.authorName} width={96} height={96} />
                          : rec.avatarInitials
                        }
                      </div>
                      <div>
                        <p className="project-rec-name">{rec.authorName}</p>
                        <p className="project-rec-meta">
                          {rec.authorTitle} · {rec.authorCompany}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <aside className="project-detail-sidebar">
              <p className="sidebar-section-label">Project Details</p>

              <div className="sidebar-meta-grid">
                {project.year && (
                  <div className="sidebar-meta-item">
                    <p className="meta-label">Year</p>
                    <p className="meta-value">{project.year}</p>
                  </div>
                )}
                {project.duration && (
                  <div className="sidebar-meta-item">
                    <p className="meta-label">Duration</p>
                    <p className="meta-value">{project.duration}</p>
                  </div>
                )}
                {project.client && (
                  <div className="sidebar-meta-item">
                    <p className="meta-label">Client</p>
                    <p className="meta-value">{project.client}</p>
                  </div>
                )}
                {project.clientIndustry && (
                  <div className="sidebar-meta-item">
                    <p className="meta-label">Industry</p>
                    <p className="meta-value">{project.clientIndustry}</p>
                  </div>
                )}
                {project.audienceSize && (
                  <div className="sidebar-meta-item">
                    <p className="meta-label">Audience</p>
                    <p className="meta-value">{project.audienceSize}</p>
                  </div>
                )}
              </div>

              {project.tags?.length > 0 && (
                <>
                  <hr className="sidebar-divider" />
                  <p className="sidebar-section-label">Technologies &amp; Tools</p>
                  <div className="sidebar-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="sidebar-tag">{tag}</span>
                    ))}
                  </div>
                </>
              )}

              {project.liveUrl && (
                <>
                  <hr className="sidebar-divider" />
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-accent w-100"
                  >
                    <i className="fas fa-external-link-alt me-2"></i>View Live Site
                  </a>
                </>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
