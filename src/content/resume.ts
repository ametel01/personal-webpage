import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

export const resume = {
  heading: {
    name: profile.name,
    role: "Software Engineer | Backend, Developer Infrastructure, AI Tooling",
    summary:
      "Software engineer with 5 years of experience building backend systems, developer tooling, blockchain infrastructure, and AI-assisted engineering workflows. Comfortable owning projects from architecture and implementation through deployment, debugging, and production support."
  },
  links: [
    {
      label: "GitHub",
      href: profile.links.github
    },
    {
      label: "LinkedIn",
      href: profile.links.linkedin
    },
    {
      label: "Email",
      href: `mailto:${profile.email}`
    },
    {
      label: "Download PDF",
      href: profile.links.resumePdf
    }
  ],
  experience: [
    {
      company: "Nethermind",
      role: "Software Engineer",
      dates: "Apr 2024 - Jun 2026",
      summary:
        "Worked on blockchain infrastructure, backend services, developer tooling, smart contracts, and AI-assisted engineering workflows.",
      bullets: [
        "Built backend systems and developer tooling using Rust, TypeScript, Python, Cairo, and Solidity.",
        "Developed AggSandbox workflows for local multichain infrastructure, transaction execution, and bridge debugging.",
        "Maintained Voyager Verifier, improving contract verification workflows, compiler compatibility, metadata validation, and developer diagnostics.",
        "Contributed contract verification functionality to Starknet Foundry.",
        "Built integrations across Starknet, LayerZero, Hyperlane, AggLayer, and EVM ecosystems.",
        "Developed components for ZK infrastructure, including Groth16 verification and Ethereum-to-Starknet data proving systems.",
        "Built internal AI-assisted engineering workflows focused on automation, validation, and developer productivity."
      ]
    },
    {
      company: "NoGame",
      role: "Lead Developer",
      dates: "Jan 2022 - Present",
      summary: "Founder and lead engineer of a fully on-chain MMO prototype.",
      bullets: [
        "Designed and implemented backend services, frontend applications, APIs, smart contracts, game systems, and infrastructure.",
        "Built React and TypeScript user interfaces, analytics systems, and blockchain integrations.",
        "Owned architecture, product design, implementation, deployment, and operation."
      ]
    }
  ],
  selectedProjects: projects.map((project) => ({
    title: project.title,
    description: project.shortDescription,
    stack: project.metadata.stack
  })),
  skills: [
    {
      group: "Backend & infrastructure",
      items: [
        "Node.js",
        "REST APIs",
        "PostgreSQL",
        "Redis",
        "Event-driven systems",
        "Docker",
        "Linux"
      ]
    },
    {
      group: "Developer tooling",
      items: [
        "CLI tools",
        "Engineering automation",
        "AI-assisted workflows",
        "Human-in-the-loop systems"
      ]
    },
    {
      group: "Blockchain systems",
      items: [
        "Starknet",
        "Ethereum",
        "Aztec",
        "LayerZero",
        "Hyperlane",
        "AggLayer",
        "Smart contracts",
        "ZK systems"
      ]
    },
    {
      group: "Product engineering",
      items: [
        "React",
        "TypeScript",
        "APIs",
        "Deployment",
        "Observability",
        "AWS Console",
        "CloudWatch"
      ]
    }
  ],
  education: [
    {
      credential: "BSc Data Science and Computing",
      institution: "Birkbeck, University of London"
    }
  ]
} as const;
