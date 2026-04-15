"use client";
import { useState, useEffect, useRef } from "react";

const ProjectPasswordModal = ({ project, onSuccess, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    setTimeout(() => inputRef.current?.focus(), 50);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (project.password && password === project.password) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setPassword("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="project-modal-backdrop" onClick={onClose}>
      <div
        className="project-modal-card contact-form"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Project password"
      >
        <button
          className="project-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <i className="fas fa-times"></i>
        </button>

        <h3 className="project-modal-title">
          <i className="fas fa-lock me-2"></i>
          Password Required
        </h3>
        <p className="project-modal-subtitle">
          {project.title} is password-protected. Enter the password to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="project-password">
              Password
            </label>
            <input
              id="project-password"
              ref={inputRef}
              type="password"
              className={`form-control${error ? " is-invalid" : ""}`}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter password"
              autoComplete="off"
            />
            {error && (
              <div className="invalid-feedback">
                Incorrect password. Please try again.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn-send"
              aria-label="Submit password"
            >
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectPasswordModal;
