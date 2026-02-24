import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAnalysisHistoryState, setSelectedAnalysisId } from "../lib/analysisStorage";

function formatDate(isoString) {
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}

function ResourcesPage() {
  const navigate = useNavigate();
  const historyState = useMemo(() => getAnalysisHistoryState(), []);
  const history = historyState.entries;

  function openResult(id) {
    setSelectedAnalysisId(id);
    navigate("/results");
  }

  return (
    <section className="page-panel">
      <h2>Resources</h2>
      <p>Analysis history is persisted locally. Click any entry to open its detailed results.</p>

      {historyState.hadCorrupted ? (
        <div className="empty-state">One saved entry couldn't be loaded. Create a new analysis.</div>
      ) : null}

      {history.length === 0 ? (
        <div className="empty-state">No history yet. Run an analysis from Practice.</div>
      ) : (
        <div className="history-list">
          {history.map((entry) => (
            <button key={entry.id} type="button" className="history-item" onClick={() => openResult(entry.id)}>
              <div className="history-meta">{formatDate(entry.createdAt)}</div>
              <div className="history-title">{entry.company || "Unknown Company"}</div>
              <div className="history-role">{entry.role || "Unspecified Role"}</div>
              <div className="history-score">Score: {entry.finalScore}/100</div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default ResourcesPage;
