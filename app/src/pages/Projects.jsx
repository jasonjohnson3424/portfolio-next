"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../data/projects";
import LazyImage from "../components/LazyImage";
import ProjectPasswordModal from "../components/ProjectPasswordModal";

const TAXONOMY = {
  modality: [
    { label: "eLearning", value: "elearning" },
    { label: "ILT/vILT", value: "ilt-vilt" },
    { label: "Microlearning", value: "microlearning" },
    { label: "Simulation", value: "simulation" },
    { label: "Train-the-Trainer", value: "train-the-trainer" },
    { label: "Web", value: "web" },
  ],
  domain: [
    { label: "Compliance", value: "compliance" },
    { label: "Leadership", value: "leadership" },
    { label: "Marketing", value: "marketing" },
    { label: "Onboarding", value: "onboarding" },
    { label: "Product", value: "product" },
    { label: "Professional Skills", value: "professional-skills" },
    { label: "Sales", value: "sales" },
    { label: "Technical", value: "technical" },
    { label: "CPE", value: "cpe" },
  ],
  role: [
    { label: "Developer", value: "developer" },
    { label: "Instructional Design", value: "instructional-design" },
    { label: "Program Management", value: "program-management" },
    { label: "Project Management", value: "project-management" },
  ],
  technology: [
    { label: "Captivate", value: "captivate" },
    { label: "HTML/CSS", value: "html-css" },
    { label: "JavaScript", value: "javascript" },
    { label: "LMS", value: "lms" },
    { label: "Node.js", value: "nodejs" },
    { label: "React", value: "react" },
    { label: "Rise", value: "rise" },
    { label: "SCORM", value: "scorm" },
    { label: "Storyline", value: "storyline" },
    { label: "xAPI", value: "xapi" },
  ],
};

const CATEGORY_LABELS = {
  modality: "Modality",
  domain: "Domain",
  role: "Role",
  technology: "Technology",
};

const EMPTY_FILTERS = { modality: [], domain: [], role: [], technology: [] };

const Projects = () => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [pendingProject, setPendingProject] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem("portfolioUnlocked") === "true") {
      setUnlocked(true);
    }
  }, []);

  const isFiltered = Object.values(filters).some((arr) => arr.length > 0);

  const filtered = isFiltered
    ? projects.filter((project) =>
        Object.entries(filters).every(([cat, activeTags]) => {
          if (activeTags.length === 0) return true;
          return activeTags.some((tag) => project.taxonomy[cat]?.includes(tag));
        }),
      )
    : projects;

  const toggleTag = (category, value) => {
    setFilters((prev) => {
      const current = prev[category];
      const next = current.includes(value)
        ? current.filter((t) => t !== value)
        : [...current, value];
      return { ...prev, [category]: next };
    });
  };

  const clearAll = () => setFilters(EMPTY_FILTERS);

  return (
    <section id="projects">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-eyebrow">Portfolio</span>
          <h2 className="section-title">Featured Projects</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            A sample of work spanning multiple modalities, domains, roles, and
            technologies. You choose where to go from here!
          </p>
        </div>

        <div className="project-filters" data-aos="fade-up" data-aos-delay="50">
          <div className="filter-toolbar">
            <span className="filter-result-count">
              <span className="filter-result-label">Filter by category:</span>
              {filtered.length} {filtered.length === 1 ? "project" : "projects"}
            </span>
            {isFiltered && (
              <button className="filter-clear-btn" onClick={clearAll}>
                Clear all
              </button>
            )}
          </div>

          {Object.entries(TAXONOMY).map(([category, tags]) => (
            <div className="filter-group" key={category}>
              <span className="filter-group-label">
                {CATEGORY_LABELS[category]}
              </span>
              <div className="filter-tag-row">
                {tags.map(({ label, value }) => (
                  <button
                    key={value}
                    className={`filter-btn${filters[category].includes(value) ? " active" : ""}`}
                    onClick={() => toggleTag(category, value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <motion.div className="row g-4" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                className="col-md-6 col-lg-4"
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.88, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.84, y: -20 }}
                transition={{
                  layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.35, ease: "easeInOut" },
                  scale: { duration: 0.35, ease: "easeInOut" },
                  y: { duration: 0.35, ease: "easeInOut" },
                }}
              >
                <div
                  className="project-card h-100"
                  onClick={() =>
                    project.protected && !unlocked
                      ? setPendingProject(project)
                      : router.push(`/projects/${project.slug}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className="project-thumbnail">
                    {project.thumbnailUrl ? (
                      <LazyImage
                        src={project.thumbnailUrl}
                        alt={project.thumbnailAlt || project.title}
                      />
                    ) : (
                      <div className="project-thumbnail-placeholder">
                        <i className="fas fa-folder-open"></i>
                      </div>
                    )}
                    <div className="project-thumbnail-overlay">
                      <span className="btn btn-sm btn-accent">
                        {project.protected && !unlocked ? (
                          <><i className="fas fa-lock me-1"></i> Enter Password</>
                        ) : (
                          <><i className="fas fa-eye me-1"></i> View Details</>
                        )}
                      </span>
                    </div>
                    {project.protected && (
                      <div className="project-lock-badge">
                        <i className="fas fa-lock"></i> NDA
                      </div>
                    )}
                  </div>

                  <div className="project-body">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">
                      {project.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {pendingProject && (
        <ProjectPasswordModal
          onClose={() => setPendingProject(null)}
          onSuccess={() => {
            setUnlocked(true);
            setPendingProject(null);
            router.push(`/projects/${pendingProject.slug}`);
          }}
        />
      )}
    </section>
  );
};

export default Projects;
