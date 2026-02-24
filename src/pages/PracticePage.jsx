import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeJobDescription, calculateLiveReadinessScore } from "../lib/analysisEngine";
import { saveAnalysisEntry } from "../lib/analysisStorage";

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildDefaultSkillConfidenceMap(extractedSkills) {
  const map = {};
  extractedSkills.forEach((group) => {
    group.skills.forEach((skill) => {
      map[skill] = "practice";
    });
  });
  return map;
}

function PracticePage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");

  const jdLength = jdText.length;

  const helperText = useMemo(() => {
    if (jdLength > 800) {
      return "JD length bonus unlocked (+10 readiness).";
    }

    return "Paste a detailed JD (800+ chars recommended for better readiness scoring).";
  }, [jdLength]);

  function handleAnalyze(event) {
    event.preventDefault();

    const analysis = analyzeJobDescription({ company, role, jdText });
    const skillConfidenceMap = buildDefaultSkillConfidenceMap(analysis.extractedSkills);
    const liveReadinessScore = calculateLiveReadinessScore(analysis.readinessScore, skillConfidenceMap);

    const entry = {
      id: makeId(),
      createdAt: new Date().toISOString(),
      company: company.trim(),
      role: role.trim(),
      jdText,
      extractedSkills: analysis.extractedSkills,
      plan: analysis.plan,
      checklist: analysis.checklist,
      questions: analysis.questions,
      baseReadinessScore: analysis.readinessScore,
      readinessScore: liveReadinessScore,
      skillConfidenceMap,
    };

    saveAnalysisEntry(entry);
    navigate("/results");
  }

  return (
    <section className="page-panel">
      <h2>Practice Analyzer</h2>
      <p>Paste company details and JD to run offline skill extraction and preparation analysis.</p>

      <form className="analyzer-form" onSubmit={handleAnalyze}>
        <div className="input-group">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            placeholder="e.g., Zoho"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="role">Role</label>
          <input
            id="role"
            type="text"
            placeholder="e.g., Software Engineer Intern"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="jd">Job Description</label>
          <textarea
            id="jd"
            rows="12"
            placeholder="Paste full JD text here"
            value={jdText}
            onChange={(event) => setJdText(event.target.value)}
          />
          <div className="muted-text">{helperText}</div>
        </div>

        <button className="btn btn-primary" type="submit">
          Analyze
        </button>
      </form>
    </section>
  );
}

export default PracticePage;
