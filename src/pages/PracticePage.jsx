import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeJobDescription, calculateLiveReadinessScore } from "../lib/analysisEngine";
import { saveAnalysisEntry } from "../lib/analysisStorage";
import { normalizeExtractedSkills, flattenExtractedSkills } from "../lib/analysisSchema";
import { buildCompanyIntel, buildRoundMapping } from "../lib/companyIntel";

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildDefaultSkillConfidenceMap(extractedSkills) {
  const map = {};
  flattenExtractedSkills(extractedSkills).forEach((skill) => {
    map[skill] = "practice";
  });
  return map;
}

function toChecklistSchema(checklist) {
  return (checklist || []).map((round) => ({
    roundTitle: round.round || "",
    items: Array.isArray(round.items) ? round.items : [],
  }));
}

function toPlan7DaysSchema(plan) {
  return (plan || []).map((item) => ({
    day: item.day || "",
    focus: item.focus || "",
    tasks: typeof item.tasks === "string" ? [item.tasks] : Array.isArray(item.tasks) ? item.tasks : [],
  }));
}

function PracticePage() {
  const navigate = useNavigate();
  const [draft] = useState(() => {
    try {
      const raw = localStorage.getItem("prp_home_draft");
      if (!raw) {
        return { company: "", role: "", jdText: "" };
      }
      const parsed = JSON.parse(raw);
      return {
        company: typeof parsed.company === "string" ? parsed.company : "",
        role: typeof parsed.role === "string" ? parsed.role : "",
        jdText: typeof parsed.jdText === "string" ? parsed.jdText : "",
      };
    } catch {
      return { company: "", role: "", jdText: "" };
    }
  });
  const [company, setCompany] = useState(draft.company);
  const [role, setRole] = useState(draft.role);
  const [jdText, setJdText] = useState(draft.jdText);

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
    const extractedSkills = normalizeExtractedSkills(analysis.extractedSkills);
    const detectedSkills = flattenExtractedSkills(extractedSkills);
    const companyTrimmed = company.trim();
    const companyIntel = companyTrimmed ? buildCompanyIntel(companyTrimmed) : null;
    const roundMapping = companyIntel ? buildRoundMapping(companyIntel, detectedSkills) : [];

    const skillConfidenceMap = buildDefaultSkillConfidenceMap(extractedSkills);
    const baseScore = analysis.readinessScore;
    const finalScore = calculateLiveReadinessScore(baseScore, skillConfidenceMap);
    const now = new Date().toISOString();

    const entry = {
      id: makeId(),
      createdAt: now,
      company: companyTrimmed,
      role: role.trim(),
      jdText,
      extractedSkills,
      roundMapping,
      checklist: toChecklistSchema(analysis.checklist),
      plan7Days: toPlan7DaysSchema(analysis.plan),
      questions: analysis.questions,
      baseScore,
      skillConfidenceMap,
      finalScore,
      updatedAt: now,
      companyIntel,
    };

    saveAnalysisEntry(entry);
    localStorage.removeItem("prp_home_draft");
    navigate("/results");
  }

  return (
    <section className="page-panel">
      <h2>Practice Analyzer</h2>
      <p>Paste company details and JD to run offline skill extraction and preparation analysis.</p>

      <form className="analyzer-form" onSubmit={handleAnalyze}>
        <div className="analyzer-form-grid">
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
