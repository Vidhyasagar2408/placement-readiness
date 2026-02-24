import { calculateLiveReadinessScore } from "./analysisEngine.js";

export const DEFAULT_OTHER_SKILLS = [
  "Communication",
  "Problem solving",
  "Basic coding",
  "Projects",
];

const CATEGORY_KEYS = [
  "coreCS",
  "languages",
  "web",
  "data",
  "cloud",
  "testing",
  "other",
];

const LEGACY_CATEGORY_MAP = {
  "Core CS": "coreCS",
  Languages: "languages",
  Web: "web",
  Data: "data",
  "Cloud/DevOps": "cloud",
  Testing: "testing",
  General: "other",
};

export function createEmptyExtractedSkills() {
  return {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: [],
  };
}

function uniqStrings(values) {
  const next = [];
  (values || []).forEach((value) => {
    if (typeof value === "string" && value.trim().length > 0 && !next.includes(value.trim())) {
      next.push(value.trim());
    }
  });
  return next;
}

export function normalizeExtractedSkills(input) {
  const normalized = createEmptyExtractedSkills();

  if (Array.isArray(input)) {
    input.forEach((group) => {
      const key = LEGACY_CATEGORY_MAP[group?.category] || "other";
      normalized[key] = uniqStrings([...(normalized[key] || []), ...(group?.skills || [])]);
    });
  } else if (input && typeof input === "object") {
    CATEGORY_KEYS.forEach((key) => {
      normalized[key] = uniqStrings(input[key] || []);
    });
  }

  const totalSkills = CATEGORY_KEYS.reduce((sum, key) => sum + normalized[key].length, 0);
  if (totalSkills === 0) {
    normalized.other = [...DEFAULT_OTHER_SKILLS];
  }

  return normalized;
}

export function flattenExtractedSkills(extractedSkills) {
  const model = normalizeExtractedSkills(extractedSkills);
  const out = [];
  CATEGORY_KEYS.forEach((key) => {
    model[key].forEach((skill) => {
      if (!out.includes(skill)) {
        out.push(skill);
      }
    });
  });
  return out;
}

export function extractedSkillsToGroups(extractedSkills) {
  const model = normalizeExtractedSkills(extractedSkills);
  const labels = {
    coreCS: "Core CS",
    languages: "Languages",
    web: "Web",
    data: "Data",
    cloud: "Cloud/DevOps",
    testing: "Testing",
    other: "Other",
  };

  return CATEGORY_KEYS.filter((key) => model[key].length > 0).map((key) => ({
    category: labels[key],
    skills: model[key],
  }));
}

function normalizeChecklist(checklist) {
  if (!Array.isArray(checklist)) {
    return [];
  }

  return checklist
    .map((round) => ({
      roundTitle: round?.roundTitle || round?.round || "",
      items: uniqStrings(round?.items || []),
    }))
    .filter((round) => round.roundTitle.length > 0)
    .slice(0, 8);
}

function normalizePlan7Days(plan) {
  if (!Array.isArray(plan)) {
    return [];
  }

  return plan
    .map((day) => {
      const tasks = Array.isArray(day?.tasks)
        ? uniqStrings(day.tasks)
        : typeof day?.tasks === "string" && day.tasks.trim().length > 0
          ? [day.tasks.trim()]
          : [];

      return {
        day: typeof day?.day === "string" ? day.day : "",
        focus: typeof day?.focus === "string" ? day.focus : "",
        tasks,
      };
    })
    .filter((day) => day.day.length > 0)
    .slice(0, 7);
}

function normalizeRoundMapping(rounds) {
  if (!Array.isArray(rounds)) {
    return [];
  }

  return rounds
    .map((round) => {
      const focusAreas = Array.isArray(round?.focusAreas)
        ? uniqStrings(round.focusAreas)
        : [];

      return {
        roundTitle: round?.roundTitle || round?.title || "",
        focusAreas,
        whyItMatters: round?.whyItMatters || round?.why || "",
      };
    })
    .filter((round) => round.roundTitle.length > 0);
}

function normalizeQuestions(questions) {
  if (!Array.isArray(questions)) {
    return [];
  }
  return uniqStrings(questions).slice(0, 20);
}

function normalizeSkillConfidenceMap(map, extractedSkills) {
  const out = {};
  const valid = map && typeof map === "object" ? map : {};
  const allSkills = flattenExtractedSkills(extractedSkills);

  allSkills.forEach((skill) => {
    out[skill] = valid[skill] === "know" ? "know" : "practice";
  });

  return out;
}

export function normalizeAnalysisEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const id = typeof entry.id === "string" && entry.id.trim().length > 0 ? entry.id : "";
  if (!id) {
    return null;
  }

  const createdAt =
    typeof entry.createdAt === "string" && entry.createdAt.trim().length > 0
      ? entry.createdAt
      : new Date().toISOString();

  const extractedSkills = normalizeExtractedSkills(entry.extractedSkills);
  const skillConfidenceMap = normalizeSkillConfidenceMap(entry.skillConfidenceMap, extractedSkills);

  const baseScoreRaw =
    typeof entry.baseScore === "number"
      ? entry.baseScore
      : typeof entry.baseReadinessScore === "number"
        ? entry.baseReadinessScore
        : typeof entry.readinessScore === "number"
          ? entry.readinessScore
          : 0;

  const baseScore = Math.max(0, Math.min(100, Math.round(baseScoreRaw)));
  const finalScore = calculateLiveReadinessScore(baseScore, skillConfidenceMap);

  return {
    id,
    createdAt,
    company: typeof entry.company === "string" ? entry.company : "",
    role: typeof entry.role === "string" ? entry.role : "",
    jdText: typeof entry.jdText === "string" ? entry.jdText : "",
    extractedSkills,
    roundMapping: normalizeRoundMapping(entry.roundMapping),
    checklist: normalizeChecklist(entry.checklist),
    plan7Days: normalizePlan7Days(entry.plan7Days || entry.plan),
    questions: normalizeQuestions(entry.questions),
    baseScore,
    skillConfidenceMap,
    finalScore,
    updatedAt:
      typeof entry.updatedAt === "string" && entry.updatedAt.trim().length > 0
        ? entry.updatedAt
        : createdAt,
    companyIntel: entry.companyIntel || null,
  };
}
