"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { services } from "../data/services";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

function loadRecaptcha() {
  if (document.getElementById("recaptcha-script")) return;
  const script = document.createElement("script");
  script.id = "recaptcha-script";
  script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
  script.async = true;
  document.head.appendChild(script);
}

function getRecaptchaToken(action) {
  return new Promise((resolve, reject) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action })
        .then(resolve)
        .catch(reject);
    });
  });
}

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(20, "Message must be at least 20 characters"),
  honeypot: z.string().max(0),
});

const SUBJECTS = [
  ...services
    .filter((s) => s.active)
    .sort((a, b) => a.order - b.order)
    .map((s) => s.title),
  "Other",
];

// Assembled at runtime — never a plain string in source
const getEmail = () => {
  const p = ["me", "jasonljohnson", "com"];
  return p[0] + "@" + p[1] + "." + p[2];
};

const CopyEmailButton = () => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(getEmail()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button className="copy-email-btn" onClick={handleCopy} type="button">
      <i className={`fas ${copied ? "fa-check" : "fa-copy"} me-1`}></i>
      {copied ? "Copied!" : "Copy Email"}
    </button>
  );
};

const CONTACT_INFO = [
  {
    icon: "fas fa-envelope",
    label: "Email",
    custom: <CopyEmailButton />,
  },
  {
    icon: "fab fa-linkedin-in",
    label: "LinkedIn",
    value: "linkedin.com/in/jason-johnson-264835146",
    href: "https://www.linkedin.com/in/jason-johnson-264835146/",
  },
  {
    icon: "fas fa-map-marker-alt",
    label: "Location",
    value: "Remote · Willing to Travel · US-Based (EST)",
    href: null,
  },
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => { loadRecaptcha(); }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { honeypot: "" },
  });

  const onSubmit = async (data) => {
    setSubmitError(false);
    try {
      const recaptchaToken = await getRecaptchaToken("contact_submit");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    }
  };

  return (
    <section id="contact">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-eyebrow">Get In Touch</span>
          <h2 className="section-title">Let&apos;s Work Together</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            Have a project in mind? I&apos;d love to hear about it. Send a
            message and I&apos;ll get back to you shortly–often same-day.
          </p>
        </div>

        <div className="row g-5">
          {/* Contact Info */}
          <div className="col-xl-4" data-aos="fade-right">
            {CONTACT_INFO.map(({ icon, label, value, href, custom }) => (
              <div className="contact-info-item" key={label}>
                <div className="contact-info-icon">
                  <i className={icon}></i>
                </div>
                <div>
                  <p className="contact-info-value">
                    {custom ? (
                      custom
                    ) : href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="col-xl-8" data-aos="fade-left" data-aos-delay="100">
            <div className="contact-form">
              {submitted ? (
                <div className="contact-success">
                  <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3
                    className="h4 mb-2"
                    style={{ color: "var(--color-text)" }}
                  >
                    Message Received!
                  </h3>
                  <p style={{ color: "var(--color-muted)" }}>
                    Thanks for reaching out. I&apos;ll get back to you within
                    one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  {/* Honeypot */}
                  <div className="honeypot-field" aria-hidden="true">
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register("honeypot")}
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label" htmlFor="name">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        className={`form-control${errors.name ? " is-invalid" : ""}`}
                        placeholder="Jane Smith"
                        {...register("name")}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">
                          {errors.name.message}
                        </div>
                      )}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={`form-control${errors.email ? " is-invalid" : ""}`}
                        placeholder="jane@company.com"
                        {...register("email")}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">
                          {errors.email.message}
                        </div>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label" htmlFor="subject">
                        Subject
                      </label>
                      <select
                        id="subject"
                        className={`form-select${errors.subject ? " is-invalid" : ""}`}
                        {...register("subject")}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select a subject…
                        </option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {errors.subject && (
                        <div className="invalid-feedback">
                          {errors.subject.message}
                        </div>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label" htmlFor="message">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        className={`form-control${errors.message ? " is-invalid" : ""}`}
                        placeholder="Tell me about your project…"
                        {...register("message")}
                      />
                      {errors.message && (
                        <div className="invalid-feedback">
                          {errors.message.message}
                        </div>
                      )}
                    </div>

                    {submitError && (
                      <div className="col-12">
                        <p className="text-danger mb-0" role="alert">
                          Something went wrong. Please try again or email me directly.
                        </p>
                      </div>
                    )}

                    <div className="col-12 mt-4 d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn-send"
                        disabled={isSubmitting}
                        aria-label={isSubmitting ? "Sending message" : "Send message"}
                      >
                        {isSubmitting
                          ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          : <i className="fas fa-paper-plane" aria-hidden="true"></i>
                        }
                      </button>
                    </div>
                    <div className="col-12 mt-2">
                      <p className="recaptcha-disclosure mb-0">
                        This site is protected by reCAPTCHA and the Google{" "}
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>{" "}
                        and{" "}
                        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>{" "}
                        apply.
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
