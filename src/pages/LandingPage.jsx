import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChartColumn, Code2, Video } from "lucide-react";

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
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [warning, setWarning] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (jdText.trim().length < 200) {
      setWarning("This JD is too short to analyze deeply. Paste full JD for better output.");
      return;
    }

    setWarning("");
    localStorage.setItem(
      "prp_home_draft",
      JSON.stringify({ company: company.trim(), role: role.trim(), jdText })
    );
    navigate("/app/practice");
  }

  return (
    <div className="landing-page">
      <main className="landing-main">
        <section className="hero">
          <h1>Ace Your Placement</h1>
          <p>Practice, assess, and prepare for your dream job</p>

          <form className="home-analyze-form" onSubmit={handleSubmit}>
            <div className="home-form-grid">
              <input
                type="text"
                placeholder="Company (optional)"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
              />
              <input
                type="text"
                placeholder="Role (optional)"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              />
            </div>
            <textarea
              required
              rows="7"
              placeholder="Paste complete Job Description here (required)"
              value={jdText}
              onChange={(event) => setJdText(event.target.value)}
            />
            <p className="home-form-note">Minimum 200 characters for meaningful analysis.</p>
            {warning ? <p className="home-warning">{warning}</p> : null}
            <button type="submit" className="btn btn-primary">
              Get Started
            </button>
          </form>
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
