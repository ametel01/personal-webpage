import { site } from "@/lib/site";

export const profile = {
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
    headline: "Backend systems. Developer tooling. Blockchain infrastructure.",
    body: "I build backend systems, developer tools, and blockchain infrastructure for teams working on correctness-sensitive software."
  },
  summary:
    "Previously at Nethermind, working on Starknet tooling, verification workflows, cross-chain infrastructure, and developer experience automation.",
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
    "Open to remote software engineering roles focused on backend systems, developer tooling, and blockchain infrastructure. Also open to selected consulting work where the scope is technical and concrete.",
  about: {
    image: "/images/professional-photo.png",
    imageAlt: "Professional portrait of Alex Metelli",
    narrative:
      "I am a software engineer focused on backend systems, developer tooling, and blockchain infrastructure. My work is strongest where correctness, clear developer workflows, and practical delivery all matter.",
    work: "I work across APIs, contract tooling, infrastructure automation, Starknet systems, cross-chain experiments, and AI-assisted engineering workflows.",
    style:
      "I work well in remote, async teams and can adapt my schedule across time zones when collaboration needs it.",
    lookingFor:
      "I am open to remote software engineering roles and selected consulting work with concrete technical scope."
  }
} as const;

export const technicalFocusGroups = [
  {
    title: "Backend & infrastructure",
    items: ["TypeScript", "Node.js", "Python", "Rust", "PostgreSQL", "Redis", "Docker", "Linux"]
  },
  {
    title: "Developer tooling",
    items: ["CLI tools", "Engineering automation", "AI-assisted engineering workflows"]
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
    body: "Protocol experiments, full-stack product prototypes, CLI tooling, engineering automation, and AI-assisted engineering workflows."
  }
] as const;

export const proofBarItems = [
  {
    label: "Professional Experience",
    value: "Nethermind"
  },
  {
    label: "Core Work",
    value: "Backend · Infra · Tooling"
  },
  {
    label: "Open Source",
    value: "Starknet · Cairo · Dev Tools"
  },
  {
    label: "Availability",
    value: "Remote · Async · Timezone flexible"
  }
] as const;
