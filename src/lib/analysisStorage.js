import { normalizeAnalysisEntry } from "./analysisSchema";

const HISTORY_KEY = "prp_analysis_history";
const SELECTED_ID_KEY = "prp_selected_analysis_id";
const LATEST_ID_KEY = "prp_latest_analysis_id";

function loadHistoryState() {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) {
    return { entries: [], hadCorrupted: false };
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { entries: [], hadCorrupted: true };
    }

    const entries = [];
    let hadCorrupted = false;

    parsed.forEach((item) => {
      const normalized = normalizeAnalysisEntry(item);
      if (normalized) {
        entries.push(normalized);
      } else {
        hadCorrupted = true;
      }
    });

    return { entries, hadCorrupted };
  } catch {
    return { entries: [], hadCorrupted: true };
  }
}

function persistHistory(entries) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export function getAnalysisHistoryState() {
  return loadHistoryState();
}

export function getAnalysisHistory() {
  return loadHistoryState().entries;
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
  const normalized = normalizeAnalysisEntry(entry);
  if (!normalized) {
    return;
  }

  const history = getAnalysisHistory();
  const nextHistory = [normalized, ...history.filter((item) => item.id !== normalized.id)].slice(0, 100);
  persistHistory(nextHistory);
  localStorage.setItem(LATEST_ID_KEY, normalized.id);
  localStorage.setItem(SELECTED_ID_KEY, normalized.id);
}

export function updateAnalysisEntry(entryId, patch) {
  const history = getAnalysisHistory();
  const nextHistory = history.map((entry) => {
    if (entry.id !== entryId) {
      return entry;
    }

    const normalized = normalizeAnalysisEntry({ ...entry, ...patch });
    return normalized || entry;
  });

  persistHistory(nextHistory);
}
