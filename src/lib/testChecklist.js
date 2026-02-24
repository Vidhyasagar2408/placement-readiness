const TEST_CHECKLIST_KEY = "prp_test_checklist_v1";

export const TEST_ITEMS = [
  {
    id: "jd_required",
    label: "JD required validation works",
    hint: "Go to Home and submit without JD text. Submission should be blocked.",
  },
  {
    id: "short_jd_warning",
    label: "Short JD warning shows for <200 chars",
    hint: "Enter 100-150 chars in JD and verify warning appears.",
  },
  {
    id: "skills_groups",
    label: "Skills extraction groups correctly",
    hint: "Use a JD with React, SQL, AWS and check grouped skills on Results.",
  },
  {
    id: "round_mapping",
    label: "Round mapping changes based on company + skills",
    hint: "Compare Amazon + DSA vs unknown startup + React/Node.",
  },
  {
    id: "score_deterministic",
    label: "Score calculation is deterministic",
    hint: "Analyze same JD twice; base score should match.",
  },
  {
    id: "toggle_live_score",
    label: "Skill toggles update score live",
    hint: "Toggle multiple skills on Results and watch score change instantly.",
  },
  {
    id: "persist_refresh",
    label: "Changes persist after refresh",
    hint: "Refresh Results page and ensure skill selections and score stay intact.",
  },
  {
    id: "history_load_save",
    label: "History saves and loads correctly",
    hint: "Create entries from Practice and reopen from Resources.",
  },
  {
    id: "export_content",
    label: "Export buttons copy the correct content",
    hint: "Use copy buttons and TXT export, then verify sections are complete.",
  },
  {
    id: "no_console_errors",
    label: "No console errors on core pages",
    hint: "Open browser devtools console and visit /, /app/practice, /results.",
  },
];

function defaultChecklistState() {
  const state = {};
  TEST_ITEMS.forEach((item) => {
    state[item.id] = false;
  });
  return state;
}

export function loadTestChecklist() {
  const fallback = defaultChecklistState();

  try {
    const raw = localStorage.getItem(TEST_CHECKLIST_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return fallback;
    }

    const next = { ...fallback };
    TEST_ITEMS.forEach((item) => {
      next[item.id] = parsed[item.id] === true;
    });
    return next;
  } catch {
    return fallback;
  }
}

export function saveTestChecklist(state) {
  localStorage.setItem(TEST_CHECKLIST_KEY, JSON.stringify(state));
}

export function resetTestChecklist() {
  const next = defaultChecklistState();
  saveTestChecklist(next);
  return next;
}

export function getChecklistPassedCount(state) {
  return TEST_ITEMS.filter((item) => state[item.id]).length;
}

export function isChecklistComplete(state) {
  return getChecklistPassedCount(state) === TEST_ITEMS.length;
}

