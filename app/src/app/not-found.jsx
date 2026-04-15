import Link from "next/link";

export const metadata = {
  title: "Page Not Found — Jason L. Johnson",
};

export default function NotFound() {
  return (
    <section
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "4rem 1.5rem",
      }}
    >
      <div>
        <p
          style={{
            fontSize: "5rem",
            fontWeight: 700,
            lineHeight: 1,
            color: "var(--color-accent)",
            margin: "0 0 0.5rem",
          }}
        >
          404
        </p>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 600,
            color: "var(--color-text)",
            margin: "0 0 1rem",
          }}
        >
          Page Not Found
        </h1>
        <p style={{ color: "var(--color-muted)", marginBottom: "2rem" }}>
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "var(--color-accent)",
            color: "#fff",
            textDecoration: "none",
            padding: "0.6rem 1.5rem",
            borderRadius: "4px",
            fontWeight: 600,
          }}
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
