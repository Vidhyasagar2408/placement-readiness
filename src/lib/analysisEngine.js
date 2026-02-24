const SKILL_TAXONOMY = [
  {
    category: "Core CS",
    skills: [
      { name: "DSA", patterns: [/\bdsa\b/i, /data structures?/i, /algorithms?/i] },
      { name: "OOP", patterns: [/\boop\b/i, /object[ -]oriented/i] },
      { name: "DBMS", patterns: [/\bdbms\b/i, /database management/i] },
      { name: "OS", patterns: [/\bos\b/i, /operating systems?/i] },
      { name: "Networks", patterns: [/\bnetworks?\b/i, /computer networks?/i] },
    ],
  },
  {
    category: "Languages",
    skills: [
      { name: "Java", patterns: [/\bjava\b/i] },
      { name: "Python", patterns: [/\bpython\b/i] },
      { name: "JavaScript", patterns: [/\bjavascript\b/i, /\bjs\b/i] },
      { name: "TypeScript", patterns: [/\btypescript\b/i, /\bts\b/i] },
      { name: "C", patterns: [/\bc\b/i] },
      { name: "C++", patterns: [/\bc\+\+\b/i] },
      { name: "C#", patterns: [/\bc#\b/i, /\bcsharp\b/i] },
      { name: "Go", patterns: [/\bgo\b/i, /\bgolang\b/i] },
    ],
  },
  {
    category: "Web",
    skills: [
      { name: "React", patterns: [/\breact\b/i] },
      { name: "Next.js", patterns: [/\bnext\.js\b/i, /\bnextjs\b/i] },
      { name: "Node.js", patterns: [/\bnode\.js\b/i, /\bnodejs\b/i] },
      { name: "Express", patterns: [/\bexpress\b/i] },
      { name: "REST", patterns: [/\brest\b/i, /\brestful\b/i] },
      { name: "GraphQL", patterns: [/\bgraphql\b/i] },
    ],
  },
  {
    category: "Data",
    skills: [
      { name: "SQL", patterns: [/\bsql\b/i] },
      { name: "MongoDB", patterns: [/\bmongodb\b/i] },
      { name: "PostgreSQL", patterns: [/\bpostgresql\b/i, /\bpostgres\b/i] },
      { name: "MySQL", patterns: [/\bmysql\b/i] },
      { name: "Redis", patterns: [/\bredis\b/i] },
    ],
  },
  {
    category: "Cloud/DevOps",
    skills: [
      { name: "AWS", patterns: [/\baws\b/i, /amazon web services/i] },
      { name: "Azure", patterns: [/\bazure\b/i] },
      { name: "GCP", patterns: [/\bgcp\b/i, /google cloud/i] },
      { name: "Docker", patterns: [/\bdocker\b/i] },
      { name: "Kubernetes", patterns: [/\bkubernetes\b/i, /\bk8s\b/i] },
      { name: "CI/CD", patterns: [/\bci\/cd\b/i, /\bcicd\b/i, /continuous integration/i] },
      { name: "Linux", patterns: [/\blinux\b/i] },
    ],
  },
  {
    category: "Testing",
    skills: [
      { name: "Selenium", patterns: [/\bselenium\b/i] },
      { name: "Cypress", patterns: [/\bcypress\b/i] },
      { name: "Playwright", patterns: [/\bplaywright\b/i] },
      { name: "JUnit", patterns: [/\bjunit\b/i] },
      { name: "PyTest", patterns: [/\bpytest\b/i] },
    ],
  },
];

const SKILL_QUESTION_MAP = {
  DSA: "How would you optimize search in sorted data and what is the time complexity?",
  OOP: "How do abstraction and polymorphism improve maintainability in large codebases?",
  DBMS: "How would you normalize a schema for an order management system and why?",
  OS: "What happens during a context switch and why is it costly?",
  Networks: "How do TCP and UDP differ for real-time applications?",
  Java: "How does JVM memory management impact performance tuning?",
  Python: "When would you use generators over lists in Python and why?",
  JavaScript: "How does the event loop handle async tasks and microtasks in JavaScript?",
  TypeScript: "How do union and generic types reduce runtime bugs in TypeScript?",
  C: "How do pointers influence memory safety in C programs?",
  "C++": "How does RAII help prevent resource leaks in C++?",
  "C#": "What are practical differences between `Task` and `Thread` in C#?",
  Go: "How would you design concurrent worker pools in Go?",
  React: "Explain state management options in React and when to choose each.",
  "Next.js": "How would you choose between SSR, SSG, and CSR in Next.js?",
  "Node.js": "How do you prevent blocking operations in a Node.js API?",
  Express: "How would you structure middleware for auth, logging, and error handling in Express?",
  REST: "How do you design idempotent REST endpoints for updates and retries?",
  GraphQL: "What are common strategies to avoid the N+1 query problem in GraphQL?",
  SQL: "Explain indexing and when it helps.",
  MongoDB: "When would you embed documents versus using references in MongoDB?",
  PostgreSQL: "What PostgreSQL features would you use for reliability and query performance?",
  MySQL: "How would you debug a slow MySQL query in production?",
  Redis: "How would you use Redis for caching without serving stale critical data?",
  AWS: "Which AWS services would you pick for a scalable interview-prep platform and why?",
  Azure: "How would you design secure CI/CD deployment on Azure?",
  GCP: "How would you manage observability and cost controls on GCP?",
  Docker: "How do you optimize Docker image size and build time?",
  Kubernetes: "How do readiness and liveness probes improve Kubernetes reliability?",
  "CI/CD": "What pipeline checks are mandatory before production deployment?",
  Linux: "Which Linux commands do you use first to diagnose high CPU or memory usage?",
  Selenium: "When is Selenium preferable over API-level tests?",
  Cypress: "How do you make Cypress tests reliable in flaky UI environments?",
  Playwright: "How does Playwright handle cross-browser testing efficiently?",
  JUnit: "How do you structure JUnit tests to keep feedback fast and maintainable?",
  PyTest: "How would you use fixtures and parametrization effectively in PyTest?",
};

function hasPatternMatch(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

export function extractSkillsFromJD(jdText) {
  const text = jdText || "";

  const grouped = SKILL_TAXONOMY.map(({ category, skills }) => {
    const matchedSkills = skills
      .filter((skill) => hasPatternMatch(text, skill.patterns))
      .map((skill) => skill.name);

    return { category, skills: matchedSkills };
  }).filter((group) => group.skills.length > 0);

  if (grouped.length === 0) {
    return {
      groupedSkills: [{ category: "General", skills: ["General fresher stack"] }],
      matchedCategoryCount: 0,
      matchedSkillsFlat: [],
    };
  }

  const flat = grouped.flatMap((group) => group.skills);

  return {
    groupedSkills: grouped,
    matchedCategoryCount: grouped.length,
    matchedSkillsFlat: flat,
  };
}

function takeFiveToEight(items, fallbackItems) {
  const merged = [...items, ...fallbackItems];
  const unique = [];

  merged.forEach((item) => {
    if (!unique.includes(item)) {
      unique.push(item);
    }
  });

  if (unique.length < 5) {
    unique.push("Run a timed recap session and capture gaps.");
  }

  return unique.slice(0, 8);
}

function includesSkill(skills, target) {
  return skills.includes(target);
}

export function buildRoundChecklist(groupedSkills, flatSkills) {
  const hasCore = groupedSkills.some((group) => group.category === "Core CS");
  const hasWeb = groupedSkills.some((group) => group.category === "Web");
  const hasData = groupedSkills.some((group) => group.category === "Data");
  const hasCloud = groupedSkills.some((group) => group.category === "Cloud/DevOps");
  const hasTesting = groupedSkills.some((group) => group.category === "Testing");

  const round1 = takeFiveToEight(
    [
      "Solve two aptitude sets (quant + logical reasoning).",
      hasCore ? "Revise OOP, DBMS, OS, and Networks one-page notes." : "Revise core CS interview basics for freshers.",
      "Practice 20 communication-focused sentence correction or comprehension questions.",
      flatSkills.length > 0 ? `Refresh ${flatSkills[0]} syntax, common mistakes, and best practices.` : "Refresh one primary programming language basics.",
      "Attempt a 30-minute mixed MCQ drill under timer.",
    ],
    [
      "Create a short formula and concept revision sheet.",
      "Review previous mistakes and mark weak patterns.",
    ]
  );

  const round2 = takeFiveToEight(
    [
      includesSkill(flatSkills, "DSA") ? "Practice arrays, strings, and binary search with complexity analysis." : "Practice foundational DSA patterns: arrays, hashing, two pointers.",
      "Solve 3 medium coding problems and explain trade-offs out loud.",
      hasCore ? "Prepare 15 quick-fire Core CS questions with crisp answers." : "Prepare 10 fundamental CS concept answers.",
      "Revise time and space complexity patterns for common approaches.",
      "Run one timed coding round simulation (45-60 minutes).",
    ],
    [
      "Document reusable problem-solving templates.",
      "Re-attempt one previously unsolved problem.",
    ]
  );

  const round3 = takeFiveToEight(
    [
      "Prepare project architecture explanation using problem -> approach -> outcome format.",
      hasWeb
        ? "Map frontend/backend stack decisions (React/Node/REST/GraphQL) to project requirements."
        : "Prepare technical depth for your strongest implementation project.",
      hasData ? "Explain schema choices, indexing, and query optimization decisions." : "Explain data model choices and trade-offs in your project.",
      hasCloud ? "Discuss deployment flow, environment strategy, and rollback plan." : "Prepare deployment and release process explanation.",
      hasTesting ? "Explain testing scope: unit, integration, and E2E responsibilities." : "Outline quality checks and validation coverage for your project.",
    ],
    [
      "Prepare two system trade-off discussions from your project.",
      "Rehearse whiteboard-friendly design communication.",
    ]
  );

  const round4 = takeFiveToEight(
    [
      "Draft concise self-introduction aligned to role and company.",
      "Prepare STAR stories for ownership, conflict resolution, and learning speed.",
      "List role-specific motivation points and long-term growth intent.",
      "Prepare salary/location/work model preference responses professionally.",
      "Prepare 3 thoughtful questions to ask interviewer/manager.",
    ],
    [
      "Practice HR round with strict 20-minute mock session.",
      "Refine communication for clarity and confidence.",
    ]
  );

  return [
    { round: "Round 1: Aptitude / Basics", items: round1 },
    { round: "Round 2: DSA + Core CS", items: round2 },
    { round: "Round 3: Tech interview (projects + stack)", items: round3 },
    { round: "Round 4: Managerial / HR", items: round4 },
  ];
}

export function buildSevenDayPlan(groupedSkills, flatSkills) {
  const hasReact = includesSkill(flatSkills, "React");
  const hasBackend = includesSkill(flatSkills, "Node.js") || includesSkill(flatSkills, "Express");
  const hasData = groupedSkills.some((group) => group.category === "Data");
  const hasCloud = groupedSkills.some((group) => group.category === "Cloud/DevOps");

  return [
    {
      day: "Day 1",
      focus: "Basics + Core CS",
      tasks: hasData
        ? "Revise OOP/DBMS/OS, then practice SQL fundamentals and schema basics."
        : "Revise OOP/DBMS/OS/Networks notes and do one objective basics quiz.",
    },
    {
      day: "Day 2",
      focus: "Basics + Core CS",
      tasks: hasCloud
        ? "Revise Linux + deployment fundamentals and connect them with project setup."
        : "Revise core CS weak areas and create one-page revision snapshots.",
    },
    {
      day: "Day 3",
      focus: "DSA + coding practice",
      tasks: "Solve 4 DSA problems (easy to medium) and explain complexity for each solution.",
    },
    {
      day: "Day 4",
      focus: "DSA + coding practice",
      tasks: "Run one timed coding round and revisit failed approaches with corrected logic.",
    },
    {
      day: "Day 5",
      focus: "Project + resume alignment",
      tasks:
        hasReact || hasBackend
          ? `Align resume bullets with impact and prepare ${hasReact ? "frontend" : "backend"} project walkthrough.`
          : "Align resume bullets with measurable impact and prepare one detailed project walkthrough.",
    },
    {
      day: "Day 6",
      focus: "Mock interview questions",
      tasks: "Attempt one technical mock and one HR mock; note clarity and depth gaps.",
    },
    {
      day: "Day 7",
      focus: "Revision + weak areas",
      tasks:
        hasReact
          ? "Revise weak areas with dedicated frontend revision (state, rendering, data flow) and final recap."
          : "Revise weak areas, reattempt missed questions, and finalize quick revision notes.",
    },
  ];
}

export function buildLikelyQuestions(groupedSkills, flatSkills) {
  const questions = [];

  flatSkills.forEach((skill) => {
    const question = SKILL_QUESTION_MAP[skill];
    if (question && !questions.includes(question)) {
      questions.push(question);
    }
  });

  const categoryFallbacks = {
    "Core CS": "How would you explain CAP theorem trade-offs to a junior developer?",
    Languages: "What coding standards do you follow to keep codebase maintainable in team settings?",
    Web: "How do you design API contracts so frontend and backend can evolve safely?",
    Data: "How would you troubleshoot a query that degrades as data size grows?",
    "Cloud/DevOps": "How do you design safe deployments with minimal downtime and fast rollback?",
    Testing: "How do you decide what must be tested first when release time is short?",
  };

  groupedSkills.forEach((group) => {
    const fallback = categoryFallbacks[group.category];
    if (fallback && !questions.includes(fallback)) {
      questions.push(fallback);
    }
  });

  const genericFallback = [
    "Walk through a project decision where you traded speed for long-term maintainability.",
    "How do you prioritize bugs versus feature work under tight deadlines?",
    "What metrics would you track to prove your feature improved user outcomes?",
    "Describe a time you handled ambiguous requirements and still delivered.",
    "How do you prepare before writing production code for a new module?",
    "What would you improve first in your latest project if given one sprint?",
    "How do you validate correctness before submitting a coding solution?",
    "How do you break down a large technical problem into executable tasks?",
    "How do you communicate technical risk to non-technical stakeholders?",
    "Which weak area are you actively improving and what is your plan?",
  ];

  genericFallback.forEach((item) => {
    if (questions.length < 10 && !questions.includes(item)) {
      questions.push(item);
    }
  });

  return questions.slice(0, 10);
}

export function calculateReadinessScore({ matchedCategoryCount, company, role, jdText }) {
  let score = 35;
  score += Math.min(matchedCategoryCount, 6) * 5;

  if ((company || "").trim().length > 0) {
    score += 10;
  }

  if ((role || "").trim().length > 0) {
    score += 10;
  }

  if ((jdText || "").length > 800) {
    score += 10;
  }

  return Math.min(score, 100);
}

export function calculateLiveReadinessScore(baseReadinessScore, skillConfidenceMap = {}) {
  const safeBase = Number.isFinite(baseReadinessScore) ? baseReadinessScore : 0;
  const adjustment = Object.values(skillConfidenceMap).reduce((sum, state) => {
    if (state === "know") {
      return sum + 2;
    }

    if (state === "practice") {
      return sum - 2;
    }

    return sum;
  }, 0);

  return Math.max(0, Math.min(100, safeBase + adjustment));
}

export function analyzeJobDescription({ company, role, jdText }) {
  const extraction = extractSkillsFromJD(jdText);
  const checklist = buildRoundChecklist(extraction.groupedSkills, extraction.matchedSkillsFlat);
  const plan = buildSevenDayPlan(extraction.groupedSkills, extraction.matchedSkillsFlat);
  const questions = buildLikelyQuestions(extraction.groupedSkills, extraction.matchedSkillsFlat);
  const readinessScore = calculateReadinessScore({
    matchedCategoryCount: extraction.matchedCategoryCount,
    company,
    role,
    jdText,
  });

  return {
    extractedSkills: extraction.groupedSkills,
    checklist,
    plan,
    questions,
    readinessScore,
  };
}
