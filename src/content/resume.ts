import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

export const resume = {
  updatedAt: "2026-08-10",
  pdfUpdatedAt: "2026-07-07",
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
      resumeLabel: "Download Resume (PDF)",
      href: profile.links.resumePdf
    }
  ],
  heroFacts: [
    {
      label: "5 Years of Experience",
      detail: "Backend systems · Dev tools · Blockchain · AI tooling",
      icon: "Calendar"
    },
    {
      label: "Core Stack",
      detail: "Rust, TypeScript, Python, Solidity, Cairo, Docker, AWS",
      icon: "MonitorCog",
      stack: ["Rust", "TypeScript", "Python", "Solidity", "Docker", "AWS Console"]
    },
    {
      label: "Domains",
      detail: "Blockchain infrastructure, Developer Tooling, AI-assisted Engineering",
      icon: "Box"
    },
    {
      label: "Location",
      detail: "Remote-friendly",
      icon: "Globe"
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
    }
  ],
  selectedProjects: projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    description: project.shortDescription,
    stack: project.metadata.stack,
    icon: project.icon
  })),
  skills: [
    {
      group: "Backend & infrastructure",
      icon: "ServerCog",
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
      icon: "SquareTerminal",
      items: [
        "CLI tools",
        "Engineering automation",
        "AI-assisted workflows",
        "Human-in-the-loop systems"
      ]
    },
    {
      group: "Blockchain systems",
      icon: "Blocks",
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
      icon: "Workflow",
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
      institution: "Birkbeck, University of London",
      logo: "/images/birkbeck-logo-cropped.jpg",
      logoAlt: "Birkbeck, University of London logo"
    }
  ]
} as const;
