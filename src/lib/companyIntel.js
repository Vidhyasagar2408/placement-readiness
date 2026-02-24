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
        title: "Round 1: Online Test (DSA + Aptitude)",
        why: "Enterprise screening prioritizes speed, accuracy, and foundational reasoning at scale.",
      },
      {
        title: "Round 2: Technical (DSA + Core CS)",
        why: "This validates depth in algorithmic thinking and engineering fundamentals.",
      },
      {
        title: "Round 3: Tech + Projects",
        why: "Interviewers assess implementation ownership, trade-offs, and project impact.",
      },
      {
        title: "Round 4: HR",
        why: "Final fit evaluation checks communication, expectations, and long-term alignment.",
      },
    ];
  }

  if (!enterprise && hasWebStack) {
    return [
      {
        title: "Round 1: Practical Coding",
        why: "Startup teams prioritize hands-on delivery and immediate coding effectiveness.",
      },
      {
        title: "Round 2: System Discussion",
        why: "You need to justify architecture decisions for real product constraints.",
      },
      {
        title: "Round 3: Culture Fit",
        why: "Lean teams strongly evaluate ownership mindset and collaboration behavior.",
      },
    ];
  }

  if (enterprise) {
    return [
      {
        title: "Round 1: Online Assessment",
        why: "Standardized screening ensures consistent benchmark across candidates.",
      },
      {
        title: "Round 2: Technical Fundamentals",
        why: "Core CS and coding quality are evaluated for long-term engineering potential.",
      },
      {
        title: "Round 3: Project Deep Dive",
        why: "Interviewers test clarity, depth, and end-to-end thinking.",
      },
      {
        title: "Round 4: HR / Managerial",
        why: "Final decision checks communication and team alignment.",
      },
    ];
  }

  return [
    {
      title: "Round 1: Practical Screening",
      why: "Initial evaluation focuses on execution speed and usable problem solving.",
    },
    {
      title: "Round 2: Technical + Stack Depth",
      why: "Panel checks whether your primary stack understanding can support production work.",
    },
    {
      title: "Round 3: Founder / Team Fit",
      why: "Small teams value ownership, adaptability, and communication quality.",
    },
  ];
}

