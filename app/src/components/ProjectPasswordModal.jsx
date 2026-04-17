"use client";
import { useState, useEffect, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const ProjectPasswordModal = ({ onSuccess, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    setTimeout(() => inputRef.current?.focus(), 50);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${API_URL}/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("portfolioUnlocked", "true");
        onSuccess();
      } else {
        setError(true);
        setPassword("");
        inputRef.current?.focus();
      }
    } catch {
      setError(true);
      setPassword("");
      inputRef.current?.focus();
    } finally {
      setLoading(false);
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
          This project is password-protected. Enter the password to continue.
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
              disabled={loading}
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
              disabled={loading}
            >
              {loading
                ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                : <i className="fas fa-arrow-right"></i>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectPasswordModal;
