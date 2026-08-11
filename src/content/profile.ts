import { site } from "@/lib/site";

export const profile = {
  updatedAt: "2026-08-10",
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
    body: site.professionalDescription
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
    narrative: site.professionalDescription,
    work: "I work across APIs, local-first CLI tools, agent workflow automation, contract tooling, infrastructure automation, Starknet systems, and cross-chain experiments.",
    style:
      "I work well in remote, async teams and can adapt my schedule across time zones when collaboration needs it.",
    lookingFor:
      "I am open to remote software engineering roles and selected consulting work with concrete technical scope.",
    capabilityChips: [
      {
        label: "5 years' experience",
        icon: "calendar"
      },
      {
        label: "Backend engineering",
        icon: "server"
      },
      {
        label: "Developer infrastructure",
        icon: "code"
      },
      {
        label: "AI-assisted tools",
        icon: "cube"
      },
      {
        label: "Blockchain infrastructure",
        icon: "globe"
      }
    ],
    focusCards: [
      {
        title: "Who is Alex Metelli?",
        body: "I am a software engineer with five years of experience, including professional work at Nethermind and independent work on public developer tools, product systems, and protocol experiments.",
        icon: "code"
      },
      {
        title: "What does he specialize in?",
        body: "I specialize in backend systems, developer infrastructure, AI-assisted engineering tools, verification workflows, and blockchain infrastructure. My work often combines APIs, local-first CLIs, automation, observability, and correctness-sensitive systems.",
        icon: "team"
      },
      {
        title: "What has he built?",
        body: "I have built AgentReceipt, Skills Doctor, RitualAI, ScopePilot, AggSandbox, Voyager Verifier, and Horizon Protocol. Together, they cover signed agent evidence, skill auditing, AI workflow tooling, proposal systems, contract verification, local multichain infrastructure, and deployed blockchain protocols.",
        icon: "target"
      },
      {
        title: "What evidence supports those claims?",
        body: "The work is documented through technical case studies and, where available, public repositories, tagged releases, source documentation, live products, and deployed protocol records. My professional evidence includes Nethermind work on Starknet tooling, contract verification, cross-chain infrastructure, and developer-experience automation.",
        icon: "shield"
      },
      {
        title: "What kind of engineering work does he take on?",
        sidebarTitle: "Work I take on",
        body: "I take on remote software engineering roles and selected consulting projects involving backend services and APIs, developer infrastructure, AI-assisted workflows, verification tooling, or blockchain systems. I am most useful when I can own a concrete technical scope from architecture and implementation through validation, deployment, and support.",
        sidebarBody:
          "Open to remote engineering roles and selected consulting projects with concrete technical scope.",
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
