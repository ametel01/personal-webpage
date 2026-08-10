import { site } from "@/lib/site";

export const profile = {
  updatedAt: "2026-08-08",
  name: site.name,
  role: site.role,
  email: site.email,
  links: {
    github: site.githubUrl,
    linkedin: site.linkedinUrl,
    resume: site.resumePath,
    resumePdf: "/resume.pdf"
  },
  hero: {
    eyebrow: site.name,
    role: site.role,
    headline: "I build backend systems and developer tools for AI-assisted engineering.",
    body: "My work spans local-first AI tooling, developer infrastructure, and blockchain systems where provenance, observability, and correctness matter."
  },
  summary:
    "Previously at Nethermind, now focused on AI-assisted software development tooling, agent workflows, Starknet tooling, verification workflows, and developer infrastructure.",
  facts: [
    {
      label: "Focus",
      value: "Backend · Dev Tools · Blockchain · AI Workflows"
    },
    {
      label: "Tech",
      value: "TypeScript · Rust · Python · Solidity · Cairo"
    },
    {
      label: "Strengths",
      value: "System Design · APIs · Smart Contracts · DX · Automation"
    },
    {
      label: "Availability",
      value: "Remote · Async · Timezone flexible"
    }
  ],
  contact:
    "I am open to remote software engineering roles in backend systems, developer infrastructure, AI tooling, and blockchain infrastructure, plus selected consulting projects with clear technical scope.",
  about: {
    image: "/images/professional-photo.png",
    imageAlt: "Professional portrait of Alex Metelli",
    narrative:
      "I am a software engineer focused on backend systems, developer infrastructure, AI tooling, and blockchain infrastructure. My work is strongest where correctness, clear developer workflows, and practical delivery all matter.",
    work: "I work across APIs, local-first CLI tools, agent workflow automation, contract tooling, infrastructure automation, Starknet systems, and cross-chain experiments.",
    style:
      "I work well in remote, async teams and can adapt my schedule across time zones when collaboration needs it.",
    lookingFor:
      "I am open to remote software engineering roles and selected consulting work with concrete technical scope.",
    capabilityChips: [
      {
        label: "5+ years",
        icon: "calendar"
      },
      {
        label: "Backend systems",
        icon: "server"
      },
      {
        label: "Developer tooling",
        icon: "code"
      },
      {
        label: "Blockchain infra",
        icon: "cube"
      },
      {
        label: "Remote-friendly",
        icon: "globe"
      }
    ],
    focusCards: [
      {
        title: "What I work on",
        body: "I work across APIs, local-first CLI tools, agent workflow automation, contract tooling, infrastructure automation, Starknet systems, and cross-chain experiments.",
        icon: "code"
      },
      {
        title: "How I work",
        body: "I work well in remote, async teams and can adapt my schedule across time zones when collaboration needs it.",
        icon: "team"
      },
      {
        title: "What I am looking for",
        sidebarTitle: "What I'm looking for",
        body: "I am open to remote software engineering roles and selected consulting work with concrete technical scope.",
        sidebarBody:
          "Open to remote software engineering roles and selected consulting work with concrete technical scope.",
        icon: "target"
      }
    ],
    values: [
      {
        title: "Correctness",
        body: "Build systems that are reliable, predictable, and easy to reason about.",
        icon: "shield"
      },
      {
        title: "Clarity",
        body: "Write code and docs that reduce complexity and help teams move faster.",
        icon: "list"
      },
      {
        title: "Delivery",
        body: "Ship practical solutions with focus, pace, and attention to long-term impact.",
        icon: "rocket"
      }
    ]
  }
} as const;

export const technicalFocusGroups = [
  {
    title: "Backend & infrastructure",
    items: ["TypeScript", "Node.js", "Python", "Rust", "PostgreSQL", "Redis", "Docker", "Linux"]
  },
  {
    title: "Developer tooling",
    items: [
      "CLI tools",
      "Engineering automation",
      "AI tooling",
      "Agent workflows",
      "AI-assisted engineering workflows"
    ]
  },
  {
    title: "Blockchain systems",
    items: [
      "Starknet",
      "Cairo",
      "Solidity",
      "EVM",
      "LayerZero",
      "AggLayer",
      "Cross-chain infrastructure",
      "Aztec experiments"
    ]
  },
  {
    title: "Product engineering",
    items: ["Next.js", "React", "APIs", "Deployment", "Observability"]
  }
] as const;

export const experienceSnapshot = [
  {
    title: "Nethermind",
    body: "Starknet tooling, contract verification workflows, cross-chain infrastructure, developer experience automation."
  },
  {
    title: "Independent / Open Source",
    body: "AI workflow tools, signed agent evidence, protocol experiments, full-stack product prototypes, CLI tooling, and engineering automation."
  }
] as const;

export const proofBarItems = [
  {
    label: "Professional Experience",
    value: "Nethermind"
  },
  {
    label: "Core Work",
    value: "Backend · AI Tools · Infra"
  },
  {
    label: "Open Source",
    value: "DataFusion · Starknet · Dev Tools"
  },
  {
    label: "Availability",
    value: "Remote · Async · Timezone flexible"
  }
] as const;
