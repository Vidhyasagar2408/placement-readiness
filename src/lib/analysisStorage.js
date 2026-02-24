const HISTORY_KEY = "prp_analysis_history";
const SELECTED_ID_KEY = "prp_selected_analysis_id";
const LATEST_ID_KEY = "prp_latest_analysis_id";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function getAnalysisHistory() {
  const history = readJson(HISTORY_KEY, []);
  return Array.isArray(history) ? history : [];
}

export function getAnalysisById(id) {
  if (!id) {
    return null;
  }

  return getAnalysisHistory().find((entry) => entry.id === id) || null;
}

export function getSelectedAnalysisId() {
  return localStorage.getItem(SELECTED_ID_KEY);
}

export function setSelectedAnalysisId(id) {
  localStorage.setItem(SELECTED_ID_KEY, id);
}

export function getLatestAnalysisId() {
  return localStorage.getItem(LATEST_ID_KEY);
}

export function getLatestAnalysis() {
  const latestId = getLatestAnalysisId();
  if (latestId) {
    const latest = getAnalysisById(latestId);
    if (latest) {
      return latest;
    }
  }

  return getAnalysisHistory()[0] || null;
}

export function saveAnalysisEntry(entry) {
  const history = getAnalysisHistory();
  const nextHistory = [entry, ...history.filter((item) => item.id !== entry.id)].slice(0, 100);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  localStorage.setItem(LATEST_ID_KEY, entry.id);
  localStorage.setItem(SELECTED_ID_KEY, entry.id);
}
