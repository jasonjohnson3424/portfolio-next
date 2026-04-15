import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/main.scss";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import AOSInit from "../components/AOSInit";

export const metadata = {
  title: "Jason L. Johnson — Instructional Designer & Developer",
  description:
    "Portfolio of Jason L. Johnson — Instructional Designer, eLearning Developer, and Web Developer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AOSInit />
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
