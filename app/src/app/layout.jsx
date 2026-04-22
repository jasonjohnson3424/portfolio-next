import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/main.scss";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import AOSInit from "../components/AOSInit";

export const metadata = {
  metadataBase: new URL("https://jasonljohnson.com"),
  title: {
    default: "Jason L. Johnson — L&D Manager | Instructional Designer | Full-Stack Developer",
    template: "%s | Jason L. Johnson",
  },
  description:
    "Jason L. Johnson is an L&D Manager, Instructional Designer, and Full-Stack Developer with over 20 years experience building enterprise learning programs, digital learning solutions, and modern web applications. Available for L&D leadership roles and web development projects.",
  alternates: {
    canonical: "https://jasonljohnson.com",
  },
  openGraph: {
    title: "Jason L. Johnson — L&D Manager | Instructional Designer | Full-Stack Developer",
    description:
      "Jason L. Johnson is an L&D Manager, Instructional Designer, and Full-Stack Developer with over 20 years experience building enterprise learning programs, digital learning solutions, and modern web applications.",
    url: "https://jasonljohnson.com",
    siteName: "Jason L. Johnson",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jason L. Johnson — L&D Manager | Instructional Designer | Full-Stack Developer",
    description:
      "L&D Manager, Instructional Designer, and Full-Stack Developer with 20+ years experience. Available for L&D leadership roles and web development projects.",
  },
  icons: {
    icon: [
      { url: "/icon1.png", type: "image/png" },
      { url: "/icon0.svg", type: "image/svg+xml" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jason L. Johnson",
  "url": "https://jasonljohnson.com",
  "jobTitle": "L&D Manager | Instructional Designer | Full-Stack Developer",
  "description": "L&D Manager, Instructional Designer, and Full-Stack Developer with over 20 years experience building enterprise learning programs, digital learning solutions, and modern web applications.",
  "availableFor": "L&D leadership roles and web development projects",
  "workLocation": "Remote · US-Based (EST)",
  "sameAs": [
    "https://www.linkedin.com/in/jasonlancejohnson/",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AOSInit />
        <NavBar />
        <div className="site-wrapper">
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
