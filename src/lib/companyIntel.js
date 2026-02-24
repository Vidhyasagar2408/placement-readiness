const ENTERPRISE_COMPANIES = [
  "amazon",
  "infosys",
  "tcs",
  "wipro",
  "accenture",
  "cognizant",
  "hcl",
  "microsoft",
  "google",
  "meta",
  "ibm",
  "oracle",
];

function hasSkill(skills, targets) {
  return targets.some((target) => skills.includes(target));
}

function inferIndustry(companyName) {
  const name = (companyName || "").toLowerCase();

  if (name.includes("bank") || name.includes("finance") || name.includes("capital")) {
    return "Financial Services";
  }

  if (name.includes("health") || name.includes("pharma") || name.includes("med")) {
    return "Healthcare Technology";
  }

  if (name.includes("retail") || name.includes("commerce")) {
    return "E-commerce";
  }

  return "Technology Services";
}

export function buildCompanyIntel(companyName) {
  const normalized = (companyName || "").trim();
  const lowered = normalized.toLowerCase();
  const isEnterprise = ENTERPRISE_COMPANIES.includes(lowered);
  const sizeCategory = isEnterprise ? "Enterprise (2000+)" : "Startup (<200)";

  const hiringFocus = isEnterprise
    ? "Structured DSA + core fundamentals with consistent evaluation rounds."
    : "Practical problem solving + stack depth with high emphasis on implementation clarity.";

  return {
    companyName: normalized || "Unknown Company",
    industry: inferIndustry(normalized),
    sizeCategory,
    hiringFocus,
    isEnterprise,
  };
}

export function buildRoundMapping(companyIntel, detectedSkills) {
  const skills = detectedSkills || [];
  const enterprise = companyIntel?.isEnterprise === true;
  const hasDSA = hasSkill(skills, ["DSA"]);
  const hasWebStack = hasSkill(skills, ["React", "Node.js"]);
  const hasCore = hasSkill(skills, ["OOP", "DBMS", "OS", "Networks"]);

  if (enterprise && hasDSA) {
    return [
      {
        roundTitle: "Round 1: Online Test (DSA + Aptitude)",
        focusAreas: ["DSA", "Aptitude", "Problem Solving Speed"],
        whyItMatters: "Enterprise screening prioritizes speed, accuracy, and foundational reasoning at scale.",
      },
      {
        roundTitle: "Round 2: Technical (DSA + Core CS)",
        focusAreas: ["DSA", "Core CS", "Complexity Analysis"],
        whyItMatters: "This validates depth in algorithmic thinking and engineering fundamentals.",
      },
      {
        roundTitle: "Round 3: Tech + Projects",
        focusAreas: ["Projects", "Stack Depth", "Trade-offs"],
        whyItMatters: "Interviewers assess implementation ownership, trade-offs, and project impact.",
      },
      {
        roundTitle: "Round 4: HR",
        focusAreas: ["Communication", "Behavioral Fit", "Motivation"],
        whyItMatters: "Final fit evaluation checks communication, expectations, and long-term alignment.",
      },
    ];
  }

  if (!enterprise && hasWebStack) {
    return [
      {
        roundTitle: "Round 1: Practical Coding",
        focusAreas: ["Practical Coding", "Debugging", "Feature Delivery"],
        whyItMatters: "Startup teams prioritize hands-on delivery and immediate coding effectiveness.",
      },
      {
        roundTitle: "Round 2: System Discussion",
        focusAreas: ["System Design", "API Thinking", "Scalability Basics"],
        whyItMatters: "You need to justify architecture decisions for real product constraints.",
      },
      {
        roundTitle: "Round 3: Culture Fit",
        focusAreas: ["Ownership", "Communication", "Adaptability"],
        whyItMatters: "Lean teams strongly evaluate ownership mindset and collaboration behavior.",
      },
    ];
  }

  if (enterprise) {
    return [
      {
        roundTitle: "Round 1: Online Assessment",
        focusAreas: ["Aptitude", "Coding Basics", "Reasoning"],
        whyItMatters: "Standardized screening ensures consistent benchmark across candidates.",
      },
      {
        roundTitle: "Round 2: Technical Fundamentals",
        focusAreas: ["Core CS", "Coding Quality", "Problem Solving"],
        whyItMatters: "Core CS and coding quality are evaluated for long-term engineering potential.",
      },
      {
        roundTitle: "Round 3: Project Deep Dive",
        focusAreas: ["Project Architecture", "Decision Quality", "Impact"],
        whyItMatters: "Interviewers test clarity, depth, and end-to-end thinking.",
      },
      {
        roundTitle: "Round 4: HR / Managerial",
        focusAreas: ["Behavioral Fit", "Communication", "Role Alignment"],
        whyItMatters: "Final decision checks communication and team alignment.",
      },
    ];
  }

  return [
    {
      roundTitle: "Round 1: Practical Screening",
      focusAreas: ["Problem Solving", "Coding Basics", "Execution"],
      whyItMatters: "Initial evaluation focuses on execution speed and usable problem solving.",
    },
    {
      roundTitle: "Round 2: Technical + Stack Depth",
      focusAreas: ["Stack Depth", "Implementation", "Trade-offs"],
      whyItMatters: "Panel checks whether your primary stack understanding can support production work.",
    },
    {
      roundTitle: "Round 3: Founder / Team Fit",
      focusAreas: ["Ownership", "Collaboration", "Communication"],
      whyItMatters: "Small teams value ownership, adaptability, and communication quality.",
    },
  ];
}
