import Hero from "../components/Hero";
import About from "../pages/About";
import Projects from "../pages/Projects";
import Services from "../pages/Services";
import Recommendations from "../pages/Recommendations";
import Contact from "../pages/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Services />
      <Recommendations />
      <Contact />
    </>
  );
}
