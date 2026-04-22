"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { projects } from "../data/projects";
import { recommendations } from "../data/recommendations";
import LazyImage from "../components/LazyImage";

// Renders a field that may be a string or array of strings
const StarField = ({ value, className }) => {
  if (!value) return null;
  const paras = Array.isArray(value) ? value : [value];
  return paras.map((p, i) => (
    <p key={i} className={className}>
      {p}
    </p>
  ));
};

const MediaCarousel = ({ items }) => {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState(0);
  const current = sorted[active];

  const prev = () => setActive((i) => (i - 1 + sorted.length) % sorted.length);
  const next = () => setActive((i) => (i + 1) % sorted.length);

  const renderMedia = (item) => {
    if (item.type === "video") {
      return (
        <video
          key={item.url + active}
          src={item.url}
          controls
          preload="metadata"
          poster={item.poster}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      );
    }
    if (item.type === "embed") {
      return (
        <iframe
          key={item.url + active}
          src={item.url}
          title={item.alt || `Media ${active + 1}`}
          allowFullScreen
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      );
    }
    return (
      <LazyImage
        key={item.url + active}
        src={item.url}
        alt={item.alt || `Media ${active + 1}`}
      />
    );
  };

  return (
    <div className="media-carousel">
      <div className="media-carousel-stage">
        {renderMedia(current)}
        {sorted.length > 1 && (
          <>
            <button
              className="media-carousel-btn media-carousel-btn--prev"
              onClick={prev}
              aria-label="Previous"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="media-carousel-btn media-carousel-btn--next"
              onClick={next}
              aria-label="Next"
            >
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

const ArticleImage = ({ item, onClick }) => {
  const placement = item.placement ?? "center";
  const flow = item.flow ?? (placement === "center" ? "clear" : "wrap");
  const cls = `article-inline-img article-inline-img--${placement} article-inline-img--${flow}`;
  return (
    <figure className={cls}>
      <button
        className="article-inline-img-btn"
        onClick={onClick}
        aria-label="Enlarge image"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.url} alt={item.alt || ""} loading="lazy" />
        <span className="article-inline-img-zoom">
          <i className="fas fa-expand-alt"></i>
        </span>
      </button>
      {item.caption && (
        <figcaption className="article-inline-img-caption">
          {item.caption}
        </figcaption>
      )}
    </figure>
  );
};

const StarSection = ({ label, value, inlineImages, onImageClick }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="case-study-section">
      <p className="case-study-label">{label}</p>
      <StarField value={value} className="case-study-text" />
      {inlineImages?.map((img, i) => (
        <ArticleImage key={i} item={img} onClick={() => onImageClick?.(img)} />
      ))}
      {inlineImages?.some((img) => img.flow === "wrap") && (
        <div className="article-inline-img-clearfix" />
      )}
    </div>
  );
};

const ResultsList = ({ results, inlineImages, onImageClick }) => {
  if (!results?.length) return null;
  return (
    <div className="case-study-section">
      <p className="case-study-label">Results &amp; Impact</p>
      <ul className="case-study-outcomes">
        {results.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      {inlineImages?.map((img, i) => (
        <ArticleImage key={i} item={img} onClick={() => onImageClick?.(img)} />
      ))}
      {inlineImages?.some((img) => img.flow === "wrap") && (
        <div className="article-inline-img-clearfix" />
      )}
    </div>
  );
};

const ProjectRecs = ({ recs }) => {
  if (!recs.length) return null;
  return (
    <div className="project-recommendations">
      <p className="project-recommendations-label">What Colleagues Say</p>
      {recs.map((rec) => (
        <div key={rec.id} className="rec-carousel project-rec-card">
          <div className="rec-quote-icon"><i className="fas fa-quote-left"></i></div>
          <p className="rec-body">
            {rec.body.split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
          <div className="rec-author rec-author--bottom">
            {rec.linkedInUrl ? (
              <a href={rec.linkedInUrl} target="_blank" rel="noopener noreferrer" className="rec-avatar">
                {rec.avatarUrl ? (
                  <Image src={rec.avatarUrl} alt={rec.authorName} width={96} height={96} />
                ) : (
                  rec.avatarInitials
                )}
              </a>
            ) : (
              <div className="rec-avatar">
                {rec.avatarUrl ? (
                  <Image src={rec.avatarUrl} alt={rec.authorName} width={96} height={96} />
                ) : (
                  rec.avatarInitials
                )}
              </div>
            )}
            <div>
              <p className="rec-author-name">
                {rec.linkedInUrl ? (
                  <a href={rec.linkedInUrl} target="_blank" rel="noopener noreferrer">
                    {rec.authorName}
                  </a>
                ) : rec.authorName}
              </p>
              <p className="rec-author-meta">{rec.authorTitle}</p>
              <p className="rec-author-meta">{rec.authorCompany}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Sidebar = ({ project }) => (
  <aside className="project-detail-sidebar">
    <p className="sidebar-section-label">Project Details</p>
    <div className="sidebar-meta-grid">
      {/* Year hidden until more recent projects are visible — see backlog C17 */}
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
            <span key={tag} className="sidebar-tag">
              {tag}
            </span>
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
);

const hasStarContent = (p) =>
  p.situation || p.task || p.action || p.results?.length > 0;

// carousel layout: media carousel at top, STAR below, sidebar right
const CarouselLayout = ({ project, projectRecs }) => (
  <div className="row g-5 align-items-start">
    <div className="col-lg-9">
      {project.mediaItems?.length > 0 && (
        <MediaCarousel items={project.mediaItems} />
      )}

      <h1 className="project-detail-title">{project.title}</h1>
      <p className="project-detail-description">{project.description}</p>

      {!hasStarContent(project) && (
        <div className="project-stub-notice">
          <i className="fas fa-info-circle"></i>
          Full case study coming soon. Contact me to discuss this project in
          detail.
        </div>
      )}

      {hasStarContent(project) && (
        <div className="project-case-study">
          <StarSection label="Background" value={project.situation} />
          <StarSection label="The Challenge" value={project.task} />
          <StarSection label="My Role" value={project.action} />
          <ResultsList results={project.results} />
        </div>
      )}

      <ProjectRecs recs={projectRecs} />
    </div>

    <div className="col-lg-3">
      <Sidebar project={project} />
    </div>
  </div>
);

// article layout: full-width narrative, sidebar below on mobile / right on lg
const ArticleLayout = ({ project, projectRecs }) => {
  const allMedia = project.mediaItems ?? [];
  const inlineMedia = allMedia.filter((m) => m.starSection);
  const carouselMedia = allMedia.filter((m) => !m.starSection);

  const sectionImages = (key) =>
    inlineMedia.filter((m) => m.starSection === key);

  const lightboxSlides = inlineMedia.map((m) => ({ src: m.url, alt: m.alt }));
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (img) => {
    const idx = inlineMedia.findIndex((m) => m.url === img.url);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  return (
    <div className="row g-5">
      <div className="col-lg-9">
        {project.thumbnailUrl && (
          <div className="project-detail-thumbnail">
            <LazyImage
              src={project.thumbnailUrl}
              alt={project.thumbnailAlt || project.title}
            />
          </div>
        )}

        <h1 className="project-detail-title">{project.title}</h1>
        <p className="project-detail-description">{project.description}</p>

        {!hasStarContent(project) && (
          <div className="project-stub-notice">
            <i className="fas fa-info-circle"></i>
            Full case study coming soon. Contact me to discuss this project in
            detail.
          </div>
        )}

        {hasStarContent(project) && (
          <div className="project-case-study project-case-study--article">
            <StarSection
              label="Background"
              value={project.situation}
              inlineImages={sectionImages("situation")}
              onImageClick={openLightbox}
            />
            <StarSection
              label="The Challenge"
              value={project.task}
              inlineImages={sectionImages("task")}
              onImageClick={openLightbox}
            />
            <StarSection
              label="My Role"
              value={project.action}
              inlineImages={sectionImages("action")}
              onImageClick={openLightbox}
            />
            <ResultsList
              results={project.results}
              inlineImages={sectionImages("results")}
              onImageClick={openLightbox}
            />
          </div>
        )}

        {carouselMedia.length > 0 && (
          <MediaCarousel items={carouselMedia} />
        )}

        <ProjectRecs recs={projectRecs} />
      </div>

      <div className="col-lg-3">
        <Sidebar project={project} />
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
      />
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
        <button
          className="btn btn-outline-accent mt-3"
          onClick={() => router.back()}
        >
          ← Home
        </button>
      </div>
    );
  }

  const isDev = process.env.NODE_ENV === "development";

  if (project.protected && !isDev) {
    return (
      <div className="container py-5 text-center">
        <i className="fas fa-lock fa-3x mb-4" style={{ color: "#8b949e" }}></i>
        <h2 className="h3 mb-2" style={{ color: "#e6edf3" }}>
          NDA-Protected Project
        </h2>
        <p style={{ color: "#8b949e", maxWidth: 480, margin: "0 auto 1.5rem" }}>
          This project is covered by a non-disclosure agreement and cannot be
          shared publicly. Please reach out directly to discuss this work.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <button
            className="btn btn-outline-accent"
            onClick={() => router.back()}
          >
            ← Home
          </button>
          <Link href="/#contact" className="btn btn-accent">
            Contact Me
          </Link>
        </div>
      </div>
    );
  }

  const projectRecs = recommendations.filter((r) =>
    r.projectSlugs?.includes(project.slug),
  );
  const layout = project.layoutType ?? "carousel";

  return (
    <div className="project-detail">
      <div className="container">
        <button
          className="project-detail-back-btn mb-4"
          onClick={() => router.back()}
        >
          <i className="fas fa-arrow-left me-2"></i>Home
        </button>

        {layout === "article" ? (
          <ArticleLayout project={project} projectRecs={projectRecs} />
        ) : (
          <CarouselLayout project={project} projectRecs={projectRecs} />
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
