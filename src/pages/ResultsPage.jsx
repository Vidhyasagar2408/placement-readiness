import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { calculateLiveReadinessScore } from "../lib/analysisEngine";
import { buildCompanyIntel, buildRoundMapping } from "../lib/companyIntel";
import { extractedSkillsToGroups, flattenExtractedSkills } from "../lib/analysisSchema";
import {
  getAnalysisById,
  getLatestAnalysis,
  getSelectedAnalysisId,
  updateAnalysisEntry,
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

function ensureSkillConfidenceMap(skills, existingMap) {
  const next = { ...(existingMap || {}) };
  skills.forEach((skill) => {
    if (next[skill] !== "know" && next[skill] !== "practice") {
      next[skill] = "practice";
    }
  });
  return next;
}

function buildChecklistText(checklist) {
  return checklist
    .map((round) => `${round.roundTitle}\n${(round.items || []).map((item) => `- ${item}`).join("\n")}`)
    .join("\n\n");
}

function buildPlanText(plan7Days) {
  return plan7Days
    .map((day) => `${day.day} - ${day.focus}\n${(day.tasks || []).join("\n")}`)
    .join("\n\n");
}

function buildQuestionsText(questions) {
  return questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
}

function ResultsPage() {
  const [analysis] = useState(() => resolveAnalysis());
  const [copyState, setCopyState] = useState("");

  const allSkills = useMemo(() => flattenExtractedSkills(analysis?.extractedSkills || {}), [analysis]);
  const skillGroups = useMemo(() => extractedSkillsToGroups(analysis?.extractedSkills || {}), [analysis]);

  const [skillConfidenceMap, setSkillConfidenceMap] = useState(() =>
    ensureSkillConfidenceMap(allSkills, analysis?.skillConfidenceMap)
  );

  const baseScore = analysis?.baseScore ?? 0;

  const finalScore = useMemo(
    () => calculateLiveReadinessScore(baseScore, skillConfidenceMap),
    [baseScore, skillConfidenceMap]
  );

  const companyProvided = (analysis?.company || "").trim().length > 0;

  const companyIntel = useMemo(() => {
    if (!analysis) {
      return null;
    }

    if (analysis.companyIntel) {
      return analysis.companyIntel;
    }

    if (!companyProvided) {
      return null;
    }

    return buildCompanyIntel(analysis.company);
  }, [analysis, companyProvided]);

  const roundMapping = useMemo(() => {
    if (!analysis) {
      return [];
    }

    if (analysis.roundMapping && analysis.roundMapping.length > 0) {
      return analysis.roundMapping;
    }

    if (!companyIntel) {
      return [];
    }

    return buildRoundMapping(companyIntel, allSkills);
  }, [analysis, companyIntel, allSkills]);

  useEffect(() => {
    if (!analysis?.id) {
      return;
    }

    updateAnalysisEntry(analysis.id, {
      finalScore,
      skillConfidenceMap,
      updatedAt: new Date().toISOString(),
      companyIntel,
      roundMapping,
    });
  }, [analysis, finalScore, skillConfidenceMap, companyIntel, roundMapping]);

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

  const weakSkills = allSkills.filter((skill) => skillConfidenceMap[skill] === "practice");
  const topWeakSkills = weakSkills.slice(0, 3);

  function setSkillConfidence(skill, confidence) {
    setSkillConfidenceMap((prev) => ({ ...prev, [skill]: confidence }));
  }

  async function copyText(label, text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(`${label} copied.`);
      window.setTimeout(() => setCopyState(""), 1800);
    } catch {
      setCopyState("Copy failed. Please copy manually.");
      window.setTimeout(() => setCopyState(""), 1800);
    }
  }

  function downloadTxt() {
    const content = [
      "Placement Readiness Analysis",
      `Company: ${analysis.company || "Unknown Company"}`,
      `Role: ${analysis.role || "Unspecified Role"}`,
      `Created At: ${formatDate(analysis.createdAt)}`,
      `Updated At: ${formatDate(analysis.updatedAt)}`,
      `Readiness Score: ${finalScore}/100`,
      "",
      "Company Intel",
      companyIntel
        ? `Name: ${companyIntel.companyName}\nIndustry: ${companyIntel.industry}\nSize: ${companyIntel.sizeCategory}\nTypical Hiring Focus: ${companyIntel.hiringFocus}`
        : "Not available (company name missing).",
      "",
      "Round Mapping",
      roundMapping.length > 0
        ? roundMapping
            .map((round) => `${round.roundTitle}\nFocus: ${(round.focusAreas || []).join(", ")}\nWhy: ${round.whyItMatters}`)
            .join("\n\n")
        : "Not available (company name missing).",
      "",
      "Key Skills Extracted",
      ...skillGroups.map((group) => `${group.category}: ${group.skills.join(", ") || "-"}`),
      "",
      "Round-wise Preparation Checklist",
      buildChecklistText(analysis.checklist || []),
      "",
      "7-day Plan",
      buildPlanText(analysis.plan7Days || []),
      "",
      "10 Likely Interview Questions",
      buildQuestionsText(analysis.questions || []),
      "",
      "Action Next",
      `Weak Skills: ${topWeakSkills.length > 0 ? topWeakSkills.join(", ") : "None"}`,
      "Start Day 1 plan now.",
      "",
      "Demo Mode: Company intel generated heuristically.",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `placement-analysis-${analysis.id}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="results-shell">
      <section className="page-panel">
        <h2>Analysis Results</h2>
        <p>
          {analysis.company || "Unknown Company"} | {analysis.role || "Unspecified Role"} | {formatDate(analysis.createdAt)}
        </p>
        <div className="results-score">Readiness Score: {finalScore}/100</div>
      </section>

      {companyProvided ? (
        <section className="page-panel company-intel-panel">
          <h3>Company Intel</h3>
          <div className="intel-grid">
            <div><strong>Company:</strong> {companyIntel.companyName}</div>
            <div><strong>Industry:</strong> {companyIntel.industry}</div>
            <div><strong>Estimated Size:</strong> {companyIntel.sizeCategory}</div>
          </div>
          <div className="intel-focus">
            <strong>Typical Hiring Focus</strong>
            <p>{companyIntel.hiringFocus}</p>
          </div>
          <p className="muted-text">Demo Mode: Company intel generated heuristically.</p>
        </section>
      ) : null}

      {companyProvided ? (
        <section className="page-panel">
          <h3>Round Mapping</h3>
          <div className="timeline">
            {roundMapping.map((round) => (
              <article key={round.roundTitle} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <h4>{round.roundTitle}</h4>
                  {(round.focusAreas || []).length > 0 ? (
                    <p><strong>Focus Areas:</strong> {round.focusAreas.join(", ")}</p>
                  ) : null}
                  <p><strong>Why this round matters:</strong> {round.whyItMatters}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="page-panel">
        <h3>Key Skills Extracted</h3>
        <div className="skills-groups">
          {skillGroups.map((group) => (
            <article key={group.category} className="skill-group">
              <h4>{group.category}</h4>
              <div className="tag-row">
                {group.skills.map((skill) => {
                  const confidence = skillConfidenceMap[skill] || "practice";
                  return (
                    <div key={`${group.category}-${skill}`} className="skill-tag skill-tag--interactive">
                      <span>{skill}</span>
                      <div className="confidence-toggle">
                        <button
                          type="button"
                          className={`confidence-btn${confidence === "know" ? " active" : ""}`}
                          onClick={() => setSkillConfidence(skill, "know")}
                        >
                          I know this
                        </button>
                        <button
                          type="button"
                          className={`confidence-btn${confidence === "practice" ? " active" : ""}`}
                          onClick={() => setSkillConfidence(skill, "practice")}
                        >
                          Need practice
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-panel">
        <h3>Round-wise Preparation Checklist</h3>
        <div className="round-list">
          {(analysis.checklist || []).map((round) => (
            <article key={round.roundTitle} className="round-item">
              <h4>{round.roundTitle}</h4>
              <ul>
                {(round.items || []).map((item) => (
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
          {(analysis.plan7Days || []).map((dayPlan) => (
            <article key={dayPlan.day} className="plan-item">
              <h4>{dayPlan.day}: {dayPlan.focus}</h4>
              <ul>
                {(dayPlan.tasks || []).map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="page-panel">
        <h3>10 Likely Interview Questions</h3>
        <ol className="question-list">
          {(analysis.questions || []).map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </section>

      <section className="page-panel">
        <h3>Export Tools</h3>
        <div className="results-actions">
          <button type="button" className="btn btn-secondary" onClick={() => copyText("7-day plan", buildPlanText(analysis.plan7Days || []))}>
            Copy 7-day plan
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => copyText("Round checklist", buildChecklistText(analysis.checklist || []))}>
            Copy round checklist
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => copyText("10 questions", buildQuestionsText(analysis.questions || []))}>
            Copy 10 questions
          </button>
          <button type="button" className="btn btn-primary" onClick={downloadTxt}>
            Download as TXT
          </button>
        </div>
        {copyState ? <p className="muted-text">{copyState}</p> : null}
      </section>

      <section className="page-panel action-next-box">
        <h3>Action Next</h3>
        <p>
          Top weak skills: {topWeakSkills.length > 0 ? topWeakSkills.join(", ") : "No weak skills marked."}
        </p>
        <p>Start Day 1 plan now.</p>
      </section>

      <section className="results-actions">
        <Link to="/app/practice" className="btn btn-secondary">Analyze Another JD</Link>
        <Link to="/app/resources" className="btn btn-primary">Open History</Link>
      </section>
    </main>
  );
}

export default ResultsPage;
