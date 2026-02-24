import { Link } from "react-router-dom";
import {
  TEST_ITEMS,
  getChecklistPassedCount,
  isChecklistComplete,
  loadTestChecklist,
} from "../lib/testChecklist";

function ShipPage() {
  const checklist = loadTestChecklist();
  const passedCount = getChecklistPassedCount(checklist);
  const allPassed = isChecklistComplete(checklist);

  if (!allPassed) {
    return (
      <main className="results-shell">
        <section className="page-panel">
          <h2>Ship Locked</h2>
          <p>Shipping is locked until all checklist tests pass.</p>
          <div className="results-score">Tests Passed: {passedCount} / {TEST_ITEMS.length}</div>
          <p className="home-warning">Fix issues before shipping.</p>
        </section>
        <section className="results-actions">
          <Link to="/prp/07-test" className="btn btn-primary">
            Open Test Checklist
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="results-shell">
      <section className="page-panel">
        <h2>Ship Ready</h2>
        <p>All test checks are complete. Shipping is now unlocked.</p>
        <div className="results-score">Tests Passed: {passedCount} / {TEST_ITEMS.length}</div>
      </section>
      <section className="results-actions">
        <Link to="/prp/07-test" className="btn btn-secondary">
          Review Checklist
        </Link>
      </section>
    </main>
  );
}

export default ShipPage;

