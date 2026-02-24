import { ChartColumn, Code2, Video } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Practice Problems",
    description: "Sharpen coding, aptitude, and core CS foundations with targeted drills.",
    icon: Code2,
  },
  {
    title: "Mock Interviews",
    description: "Simulate real interview rounds to improve confidence and communication.",
    icon: Video,
  },
  {
    title: "Track Progress",
    description: "Monitor strengths, identify gaps, and follow a clear preparation path.",
    icon: ChartColumn,
  },
];

function LandingPage() {
  return (
    <div className="landing-page">
      <main className="landing-main">
        <section className="hero">
          <h1>Ace Your Placement</h1>
          <p>Practice, assess, and prepare for your dream job</p>
          <Link to="/app" className="btn btn-primary" style={{ marginTop: "24px" }}>
            Get Started
          </Link>
        </section>

        <section className="features-grid">
          {features.map(({ title, description, icon: Icon }) => (
            <article key={title} className="feature-card">
              <div className="feature-icon">
                <Icon size={20} />
              </div>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </section>
      </main>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
