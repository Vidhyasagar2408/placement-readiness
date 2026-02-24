import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  TEST_ITEMS,
  getChecklistPassedCount,
  isChecklistComplete,
  loadTestChecklist,
  resetTestChecklist,
  saveTestChecklist,
} from "../lib/testChecklist";

function TestChecklistPage() {
  const [checklist, setChecklist] = useState(() => loadTestChecklist());

  const passedCount = useMemo(() => getChecklistPassedCount(checklist), [checklist]);
  const allPassed = useMemo(() => isChecklistComplete(checklist), [checklist]);

  function onToggle(testId, value) {
    const next = { ...checklist, [testId]: value };
    setChecklist(next);
    saveTestChecklist(next);
  }

  function onReset() {
    setChecklist(resetTestChecklist());
  }

  return (
    <main className="results-shell">
      <section className="page-panel">
        <h2>Test Checklist</h2>
        <div className="results-score">Tests Passed: {passedCount} / {TEST_ITEMS.length}</div>
        {!allPassed ? <p className="home-warning">Fix issues before shipping.</p> : null}
      </section>

      <section className="page-panel">
        <div className="test-list">
          {TEST_ITEMS.map((item) => (
            <label key={item.id} className="test-item">
              <input
                type="checkbox"
                checked={checklist[item.id] === true}
                onChange={(event) => onToggle(item.id, event.target.checked)}
              />
              <div className="test-item-content">
                <span>{item.label}</span>
                <span className="muted-text">How to test: {item.hint}</span>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className="results-actions">
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          Reset checklist
        </button>
        <Link to="/prp/08-ship" className="btn btn-primary">
          Go to Ship
        </Link>
      </section>
    </main>
  );
}

export default TestChecklistPage;

