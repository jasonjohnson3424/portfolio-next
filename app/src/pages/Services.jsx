"use client";
import { services } from "../data/services";
const Services = () => {
  const scrollToContact = (e, serviceTitle) => {
    e.preventDefault();
    if (serviceTitle) {
      window.dispatchEvent(new CustomEvent("contactServiceSelected", { detail: serviceTitle }));
    }
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-eyebrow">What I Do</span>
          <h2 className="section-title">Services</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            Anything from a whole L&D Department, a global training program rollout, to an individual learning course or web development project — I can help you design and build it.
          </p>
        </div>

        <div className="row g-4">
          {services
            .filter((s) => s.active)
            .sort((a, b) => a.order - b.order)
            .map((service, i) => (
              <div className="col-md-6 col-lg-4" key={service.id} data-aos="fade-up" data-aos-delay={i * 60}>
                <div className="service-card">
                  <div className="service-card-header">
                    <div className="service-icon">
                      <i className={service.icon}></i>
                    </div>
                    <h3 className="service-title">{service.title}</h3>
                  </div>
                  <p className="service-description">{service.description}</p>
                  <a href="#contact" className="service-cta" onClick={(e) => scrollToContact(e, service.title)}>
                    Inquire <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
