import { Link } from "react-router-dom";
import {
  getAnalysisById,
  getLatestAnalysis,
  getSelectedAnalysisId,
} from "../lib/analysisStorage";

function formatDate(isoString) {
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}

function resolveAnalysis() {
  const selectedId = getSelectedAnalysisId();
  const selected = getAnalysisById(selectedId);

  if (selected) {
    return selected;
  }

  return getLatestAnalysis();
}

function ResultsPage() {
  const analysis = resolveAnalysis();

  if (!analysis) {
    return (
      <main className="results-shell">
        <section className="page-panel">
          <h2>Results</h2>
          <p>No analysis available yet. Run your first analysis from Practice.</p>
          <Link to="/app/practice" className="btn btn-primary">Go to Practice</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="results-shell">
      <section className="page-panel">
        <h2>Analysis Results</h2>
        <p>
          {analysis.company || "Unknown Company"} | {analysis.role || "Unspecified Role"} | {formatDate(analysis.createdAt)}
        </p>
        <div className="results-score">Readiness Score: {analysis.readinessScore}/100</div>
      </section>

      <section className="page-panel">
        <h3>Key Skills Extracted</h3>
        <div className="skills-groups">
          {analysis.extractedSkills.map((group) => (
            <article key={group.category} className="skill-group">
              <h4>{group.category}</h4>
              <div className="tag-row">
                {group.skills.map((skill) => (
                  <span key={`${group.category}-${skill}`} className="skill-tag">{skill}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-panel">
        <h3>Round-wise Preparation Checklist</h3>
        <div className="round-list">
          {analysis.checklist.map((round) => (
            <article key={round.round} className="round-item">
              <h4>{round.round}</h4>
              <ul>
                {round.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="page-panel">
        <h3>7-day Plan</h3>
        <div className="plan-list">
          {analysis.plan.map((dayPlan) => (
            <article key={dayPlan.day} className="plan-item">
              <h4>{dayPlan.day}: {dayPlan.focus}</h4>
              <p>{dayPlan.tasks}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-panel">
        <h3>10 Likely Interview Questions</h3>
        <ol className="question-list">
          {analysis.questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </section>

      <section className="results-actions">
        <Link to="/app/practice" className="btn btn-secondary">Analyze Another JD</Link>
        <Link to="/app/resources" className="btn btn-primary">Open History</Link>
      </section>
    </main>
  );
}

export default ResultsPage;
