"use client";
import { useState } from "react";

const SKILLS = [
  {
    category: "Learning & Development Leadership",
    tags: [
      "Executive Steering Committee Consultation",
      "LMS Transition & Implementation",
      "Leadership Development Program Delivery",
      "Team Development & Leadership",
      "Workforce Readiness & Training Rollout Strategy",
      "Vendor Management",
      "Orientation/Onboarding Delivery",
      "Performance Support Strategy",
      "Sales Enablement",
      "ROI Measurement & Reporting",
      "Executive Dashboard Generation",
      "Agile Project Management (Scrum/Kanban)",
      "Sprint Planning",
    ],
  },
  {
    category: "Instructional Design & Training",
    tags: [
      "Presenter / Public Speaker",
      "Train-the-Trainer (T3)",
      "Technical Writing/Editing/Training",
      "Storyboarding",
      "eLearning",
      "ILT/vILT",
      "Simulation",
      "Microlearning",
      "JIT Training",
      "ADDIE/SAM/Bloom's Taxonomy",
      "Evaluation Design",
      "Performance Support & Documentation",
    ],
  },
  {
    category: "Software / Tools",
    tags: [
      "Storyline 360",
      "Rise 360",
      "Photoshop",
      "Illustrator",
      "Premiere",
      "After Effects",
      "Acrobat",
      "Audition",
      "Audacity",
      "Canva",
      "vYond",
      "Captivate",
      "Camtasia",
      "Figma",
      "Lectora",
      "MS Office",
      "Google Workspace",
      "VS Code",
      "SharePoint",
      "MS Project",
      "JIRA & Confluence",
    ],
  },
  {
    category: "Web Development & Learning Technologies",
    tags: [
      "React/Next.js",
      "JavaScript (ES6+)",
      "Node.js",
      "HTML5/CSS3",
      "Bootstrap",
      "Python/Django",
      "Actionscript",
      "SQL",
      "XML",
      "JSON",
      "SCORM/xAPI",
    ],
  },
  {
    category: "Cloud & Deployment Architecture",
    tags: [
      "AWS (S3, CloudFront, Route 53, Amplify, Lambda, DynamoDB)",
      "Git",
      "GitHub Actions",
    ],
  },
  {
    category: "Enterprise Learning Systems (LMS/LXP)",
    tags: ["Oracle HCM", "Cornerstone", "SAP SuccessFactors"],
  },
  {
    category: "AI / Agentic Workflow Automation",
    tags: ["Claude Code", "ChatGPT"],
  },
];

const TIMELINE = [
  {
    date: "2025 – Present",
    role: "Training Program Manager",
    company: "Ford Motor Company",
  },
  {
    date: "2022 – 2025",
    role: "AI Learning Consultant",
    company: "DataAnnotation",
  },
  {
    date: "2017 – 2022",
    role: "Senior Learning Manager",
    company: "JPMorgan Chase",
  },
  {
    date: "2015 – 2017",
    role: "Senior Learning Developer",
    company: "JPMorgan Chase",
  },
  {
    date: "2014 – 2015",
    role: "eLearning Developer",
    company: "JPMorgan Chase",
  },
  {
    date: "2013 – 2014",
    role: "Learning Team Manager",
    company: "NSF International",
  },
  {
    date: "2011 – 2013",
    role: "Project Manager & eLearning Developer",
    company: "TEKsystems",
  },
  {
    date: "2010 – 2011",
    role: "Web Developer, Contractor",
    company: "ES3 & Doner Advertising",
  },
  {
    date: "2009 – 2010",
    role: "Lead eLearning Developer",
    company: "Ford Motor Company",
  },
  {
    date: "2008 – 2009",
    role: "eLearning Developer",
    company: "Deloitte",
  },
  {
    date: "2007 – 2008",
    role: "Web Developer, Contractor",
    company: "SPX & WAY Creative Media",
  },
  {
    date: "2005 – 2007",
    role: "Solution Architect",
    company: "General Dynamics Land Systems",
  },
];

const EDUCATION = [
  {
    date: "2017 – 2020",
    program: "MBA, Information Systems",
    school: "Wayne State University",
  },
  {
    date: "2000 – 2005",
    program: "Computer Science",
    school: "Wayne State University",
  },
];

const About = () => {
  const [timelineOpen, setTimelineOpen] = useState(false);

  return (
    <section id="about">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-eyebrow">About Me</span>
          <h2 className="section-title">20+ Years of Experience</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            I bridge gaps between complexity &amp; meaningful delivery—with a
            complementary blend of leadership &amp; technical capabilities to
            deliver the right solution.
          </p>
        </div>

        <div className="row g-4 g-lg-5 align-items-start">
          {/* Bio + Avatar */}
          <div className="col-lg-5" data-aos="fade-right">
            <div className="d-flex justify-content-center mb-4">
              <div className="about-avatar"></div>
            </div>
            <div className="about-bio">
              <p>
                With 20+ years in Learning & Development, I lead enterprise
                training initiatives that align workforce capability with
                business outcomes. My experience includes workforce readiness,
                training rollout strategy, LMS implementation, and executive
                stakeholder engagement, with a focus on scalable,
                performance-driven solutions. I have led cross-functional
                efforts across HR, operations, and technical teams to deliver
                learning ecosystems supporting onboarding, leadership
                development, and technical skill growth.
              </p>
              <p>
                I bring strong expertise in instructional design and delivery
                across eLearning, ILT/vILT, simulation, microlearning, and
                performance support. My approach emphasizes real-world
                application, evaluation strategy, and measurable impact—bridging
                learning design with operational performance.
              </p>
              <p>
                Additionally, I have a technical foundation that complements my
                L&D leadership, including experience with modern web development
                frameworks and AWS-based deployment. This enables me to build
                scalable, integrated learning solutions while leveraging AI
                tools to accelerate development and content creation.
              </p>
            </div>
          </div>

          {/* Skills + Timeline */}
          <div className="col-lg-7">
            <div data-aos="fade-left" data-aos-delay="100">
              <h3 className="h5 mb-4" style={{ color: "var(--color-text)" }}>
                Professional Skills
              </h3>
              <div className="skills-grid mb-5">
                {SKILLS.map(({ category, tags }) => (
                  <div className="skill-category" key={category}>
                    <h6>{category}</h6>
                    <div className="skill-tags">
                      {tags.map((t) => (
                        <span className="skill-tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <button
              className="timeline-toggle-btn"
              onClick={() => setTimelineOpen((o) => !o)}
              aria-expanded={timelineOpen}
            >
              <span className="timeline-toggle-line"></span>
              <span className="timeline-toggle-label">
                <i
                  className={`fas fa-chevron-${timelineOpen ? "up" : "down"}`}
                ></i>
                {timelineOpen ? "Hide " : "Show "}Work History &amp; Education
              </span>
              <span className="timeline-toggle-line"></span>
            </button>
          </div>
        </div>

        <div
          className={`timeline-collapsible${timelineOpen ? " timeline-collapsible--open" : ""}`}
        >
          <div className="row g-4 pt-4 justify-content-center">
            <div className="col-md-5" data-aos="fade-left" data-aos-delay="200">
              <h3 className="h5 mb-4" style={{ color: "var(--color-text)" }}>
                Work History
              </h3>
              <div className="timeline">
                {TIMELINE.map(({ date, role, company }) => (
                  <div className="timeline-item" key={date}>
                    <p className="timeline-date">{date}</p>
                    <p className="timeline-role">{role}</p>
                    <p className="timeline-company">{company}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-3" data-aos="fade-left" data-aos-delay="300">
              <h3 className="h5 mb-4" style={{ color: "var(--color-text)" }}>
                Education
              </h3>
              <div className="timeline">
                {EDUCATION.map(({ date, program, school }) => (
                  <div className="timeline-item" key={date}>
                    <p className="timeline-date">{date}</p>
                    <p className="timeline-role">{program}</p>
                    <p className="timeline-company">{school}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
