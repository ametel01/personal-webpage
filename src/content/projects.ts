export type EvidenceLink = {
  label: string;
  href: string;
};

export type ProjectIconAsset = {
  alt: string;
  src: string;
};

type ProjectStructuredData =
  | {
      schemaType: "SoftwareSourceCode" | "CreativeWork";
      applicationCategory?: never;
    }
  | {
      schemaType: "SoftwareApplication";
      applicationCategory: string;
    };

export type Project = ProjectStructuredData & {
  slug:
    | "agentreceipt"
    | "skills-doctor"
    | "ritualai"
    | "scopepilot"
    | "aggsandbox"
    | "voyager-verifier"
    | "horizon-starknet";
  title: string;
  shortDescription: string;
  valueStatement: string;
  proof: string;
  icon: ProjectIconAsset;
  tags: readonly string[];
  metadata: {
    role: string;
    stack: readonly string[];
    currentState: string;
  };
  caseStudy: {
    overview: string;
    problem: string;
    role: string;
    technicalDetails: readonly string[];
    tradeoffs: readonly string[];
    currentState: string;
    evidence: readonly EvidenceLink[];
  };
};

export type OpenSourceContribution = {
  project: string;
  summary: string;
  href: string;
  status?: string;
};

export const projects: readonly Project[] = [
  {
    slug: "agentreceipt",
    title: "AgentReceipt",
    schemaType: "SoftwareSourceCode",
    shortDescription:
      "Local-first Go CLI for recording AI coding sessions and producing verifier-ready replay evidence.",
    valueStatement:
      "Local-first Go CLI for recording AI coding sessions and producing verifier-ready replay evidence.",
    proof:
      "Captures git, filesystem, instruction, and provider evidence; signs receipts; emits replay/focus JSON with reviewability metadata, quality gates, policy checks, and ranked agent-review tasks.",
    icon: {
      alt: "AgentReceipt",
      src: "/icons/agentreceipt.svg"
    },
    tags: ["Go", "CLI", "AI Tooling", "Developer Infrastructure", "Replay", "Provenance"],
    metadata: {
      role: "Independent developer infrastructure engineer",
      stack: ["Go", "CLI", "Ed25519", "Developer Infrastructure", "Observability", "Replay"],
      currentState: "Public repository with a v0.9.0 release."
    },
    caseStudy: {
      overview:
        "AgentReceipt is a local-first CLI for AI coding sessions. It records developer-agent activity, signs receipts, and produces replay/focus reports that downstream reviewers or coding-agent loops can consume.",
      problem:
        "AI-assisted software work is hard to review when git state, filesystem changes, instruction context, provider logs, commands, quality checks, and final patch evidence are scattered across local tools.",
      role: "I designed and built the CLI, evidence model, local capture workflow, receipt signing, replay/focus contracts, and verifier-facing review outputs.",
      technicalDetails: [
        "Captures git snapshots and diffs, filesystem watcher events, instruction-file metadata, and best-effort Codex or Claude provider evidence.",
        "Exports signed receipts, portable replay bundles, PR-ready review artifacts, and machine-readable replay/focus JSON for verifier workflows.",
        "Reports quality gates, failed commands, patch summaries, policy checks, privacy metadata, claims, outcomes, and ranked focus tasks for agent-friendly review loops."
      ],
      tradeoffs: [
        "The CLI needs enough evidence for independent review while staying local-only and avoiding prompt upload by default.",
        "Replay and focus outputs need stable contracts for automation without turning the tool into an agent scorer, policy engine, or orchestrator."
      ],
      currentState: "The project is public on GitHub with a tagged v0.9.0 release.",
      evidence: [
        {
          label: "GitHub repository",
          href: "https://github.com/ametel01/agentreceipt"
        },
        {
          label: "README",
          href: "https://github.com/ametel01/agentreceipt/blob/main/README.md"
        },
        {
          label: "v0.9.0 release",
          href: "https://github.com/ametel01/agentreceipt/releases/tag/v0.9.0"
        }
      ]
    }
  },
  {
    slug: "skills-doctor",
    title: "Skills Doctor",
    schemaType: "SoftwareSourceCode",
    shortDescription:
      "TypeScript CLI for auditing Claude/Codex Agent Skills for quality, structure, scoring, and repair readiness.",
    valueStatement:
      "TypeScript CLI for auditing Claude/Codex Agent Skills for quality, structure, scoring, and repair readiness.",
    proof:
      "Scans local skill roots, validates frontmatter and workflow quality, checks referenced files, reports JSON/human-readable findings, and prepares agent repair handoff after confirmation.",
    icon: {
      alt: "Skills Doctor",
      src: "/icons/skills-doctor.svg"
    },
    tags: ["TypeScript", "CLI", "AI Tooling", "Static Analysis", "Agent Skills", "Validation"],
    metadata: {
      role: "Independent developer tools engineer",
      stack: ["TypeScript", "Bun", "CLI", "Static Analysis", "Agent Skills"],
      currentState: "Public repository for local Agent Skill quality audits."
    },
    caseStudy: {
      overview:
        "Skills Doctor audits local Claude and Codex Agent Skills for structure, quality, references, scoring, and repair readiness.",
      problem:
        "Agent Skills can quietly degrade when frontmatter, workflow instructions, referenced files, or repair guidance drift out of shape.",
      role: "I built the TypeScript CLI, scan model, validation checks, reporting paths, and repair handoff workflow.",
      technicalDetails: [
        "Scans local skill roots and validates frontmatter, workflow structure, referenced files, and quality signals.",
        "Reports findings in both human-readable and JSON formats for interactive use and automation.",
        "Prepares agent repair handoff only after confirmation, keeping automated remediation under explicit user control."
      ],
      tradeoffs: [
        "The checker has to be opinionated enough to find real workflow problems without flattening every skill into one template.",
        "Repair readiness is separated from repair execution so users can review findings before an agent edits their skill files."
      ],
      currentState: "The project is public on GitHub.",
      evidence: [
        {
          label: "GitHub repository",
          href: "https://github.com/ametel01/skills-doctor"
        }
      ]
    }
  },
  {
    slug: "ritualai",
    title: "RitualAI",
    schemaType: "SoftwareSourceCode",
    shortDescription:
      "TypeScript CLI that scans local Claude/Codex prompt history and turns repeated workflows into reusable skills.",
    valueStatement:
      "TypeScript CLI that scans local Claude/Codex prompt history and turns repeated workflows into reusable skills.",
    proof:
      "Clusters recurring prompt patterns locally, lets the user approve a candidate, and guides it into a reusable SKILL.md workflow.",
    icon: {
      alt: "RitualAI",
      src: "/icons/ritualai.svg"
    },
    tags: ["TypeScript", "CLI", "AI Workflows", "Local-first", "Developer Productivity"],
    metadata: {
      role: "Independent AI workflow tools engineer",
      stack: ["TypeScript", "Bun", "CLI", "AI Workflows", "Local-first"],
      currentState: "Public repository for prompt-history workflow discovery."
    },
    caseStudy: {
      overview:
        "RitualAI mines local Claude and Codex prompt history for repeated workflows, then helps convert approved candidates into reusable Agent Skills.",
      problem:
        "Developers often repeat useful agent prompts and workflows without noticing which patterns are stable enough to turn into reusable automation.",
      role: "I built the local scan workflow, clustering-oriented candidate flow, approval step, and SKILL.md generation path.",
      technicalDetails: [
        "Scans local prompt history to find recurring work patterns without requiring hosted ingestion.",
        "Groups candidate workflows for user review before generating reusable skill instructions.",
        "Guides approved candidates into SKILL.md workflows that can be refined and reused across future agent sessions."
      ],
      tradeoffs: [
        "Local prompt analysis needs to surface useful patterns without exposing sensitive development history to a remote service.",
        "The workflow keeps user approval in the loop because not every repeated prompt deserves to become a persistent skill."
      ],
      currentState: "The project is public on GitHub.",
      evidence: [
        {
          label: "GitHub repository",
          href: "https://github.com/ametel01/ritualai"
        }
      ]
    }
  },
  {
    slug: "scopepilot",
    title: "ScopePilot",
    schemaType: "SoftwareApplication",
    applicationCategory: "BusinessApplication",
    shortDescription:
      "Agency proposal configurator for scope, pricing, approvals, revisions, and client delivery.",
    valueStatement:
      "Agency proposal configurator for scope, pricing, approvals, revisions, and client delivery.",
    proof: "Live product with public user documentation for proposal and change-order workflows.",
    icon: {
      alt: "ScopePilot",
      src: "/icons/scopepilot.svg"
    },
    tags: ["TypeScript", "Astro", "Cloudflare Workers", "Bun", "PostgreSQL", "Product workflows"],
    metadata: {
      role: "Independent product engineer",
      stack: ["TypeScript", "Astro", "Cloudflare Workers", "Bun", "PostgreSQL"],
      currentState: "Live product with public documentation and deployed proposal workflows."
    },
    caseStudy: {
      overview:
        "ScopePilot is an agency proposal scope and pricing configurator. It supports service catalogs, pricing inputs, approvals, revisions, change orders, workspace branding, team access, reports, and private client proposal pages.",
      problem:
        "Agency proposals often move across spreadsheets, documents, review threads, and client emails. That makes scope changes, pricing assumptions, approvals, and client-facing delivery difficult to keep consistent.",
      role: "I designed and built the product workflows, application structure, documentation surface, and deployment path as an independent product engineer.",
      technicalDetails: [
        "Built an Astro and TypeScript web app with Bun-based development and Biome quality gates.",
        "Implemented proposal workflows around services, pricing, clients, approvals, revisions, and change orders.",
        "Designed Cloudflare Pages and Workers deployment paths with PostgreSQL-backed local development."
      ],
      tradeoffs: [
        "The product has to expose enough pricing structure for operational control without turning proposal creation into a dense back-office tool.",
        "Client-facing proposal pages need to stay simple while still reflecting internal revisions, approvals, and scope changes accurately."
      ],
      currentState:
        "The product is deployed publicly, and its documentation describes proposal setup, client delivery, workspace, billing, and reporting workflows.",
      evidence: [
        {
          label: "Live product",
          href: "https://scopepilot.launchingfoundry.xyz/"
        },
        {
          label: "User documentation",
          href: "https://scopepilot.launchingfoundry.xyz/docs"
        }
      ]
    }
  },
  {
    slug: "aggsandbox",
    title: "AggSandbox",
    schemaType: "SoftwareSourceCode",
    shortDescription:
      "Cross-chain infrastructure experiments using LayerZero, AggLayer concepts, and executable contract scripts.",
    valueStatement:
      "Cross-chain infrastructure experiments using LayerZero, AggLayer concepts, and executable contract scripts.",
    proof: "Cross-chain protocol experiments with executable contracts and scripts.",
    icon: {
      alt: "AggLayer",
      src: "/icons/agglayer.svg"
    },
    tags: ["Rust", "Docker", "Solidity", "AggLayer", "LayerZero", "EVM"],
    metadata: {
      role: "Software Engineer at Nethermind",
      stack: ["Rust", "Docker", "Solidity", "AggLayer", "LayerZero", "EVM"],
      currentState: "Public sandbox for local cross-chain bridge and infrastructure workflows."
    },
    caseStudy: {
      overview:
        "AggSandbox is a local development sandbox for cross-chain infrastructure and bridge workflows. It gives developers a repeatable environment for running chains, contracts, transactions, and bridge operations.",
      problem:
        "Cross-chain systems are difficult to test because local environments need multiple networks, bridge contracts, services, transaction scripts, and clear inspection points.",
      role: "I developed CLI and workflow pieces for local multichain infrastructure, bridge testing, transaction execution, and debugging.",
      technicalDetails: [
        "Built Rust CLI workflows for starting, inspecting, and operating a local cross-chain sandbox.",
        "Worked with executable contract scripts and bridge command flows for repeatable testing.",
        "Connected local infrastructure concepts across EVM chains, AggLayer-oriented workflows, and cross-chain messaging experiments."
      ],
      tradeoffs: [
        "The sandbox needed to hide setup complexity without hiding the details developers need when bridge operations fail.",
        "Local reproducibility mattered more than presenting a polished product abstraction."
      ],
      currentState:
        "The project is public under Nethermind with repository documentation and external AggLayer documentation.",
      evidence: [
        {
          label: "GitHub repository",
          href: "https://github.com/NethermindEth/aggsandbox"
        },
        {
          label: "AggLayer documentation",
          href: "https://docs.agglayer.dev/agglayer/developer-tools/aggsandbox/installation/"
        }
      ]
    }
  },
  {
    slug: "voyager-verifier",
    title: "Voyager Verifier",
    schemaType: "SoftwareSourceCode",
    shortDescription:
      "Starknet contract verification tooling with compiler integration and status tracking.",
    valueStatement:
      "Starknet contract verification tooling with compiler integration and status tracking.",
    proof: "Built for Starknet verification workflows at Nethermind.",
    icon: {
      alt: "Nethermind",
      src: "/icons/nethermind.svg"
    },
    tags: ["Rust", "Starknet", "Cairo", "Scarb", "AWS Console", "CloudWatch"],
    metadata: {
      role: "Software Engineer at Nethermind",
      stack: ["Rust", "Starknet", "Cairo", "Scarb", "AWS Console", "CloudWatch"],
      currentState: "Open-source verifier tooling maintained under Nethermind."
    },
    caseStudy: {
      overview:
        "Voyager Verifier is contract verification tooling for the Voyager Starknet block explorer. It helps developers submit verification data, track status, and diagnose compiler or metadata issues.",
      problem:
        "Contract verification workflows are sensitive to compiler versions, package metadata, network selection, and explorer API behavior. Small mismatches can create confusing failures for developers.",
      role: "I maintained and improved verification workflows, compiler compatibility, metadata validation, status handling, and developer diagnostics.",
      technicalDetails: [
        "Integrated compiler and package metadata handling for Starknet verification flows.",
        "Improved status tracking and error reporting around verifier API responses.",
        "Used cloud logs and operational tooling to debug production verification failures."
      ],
      tradeoffs: [
        "The tooling needed to stay strict enough for correctness while still giving developers actionable diagnostics.",
        "Compatibility work had to account for evolving Starknet, Cairo, and Scarb versions without masking real verification errors."
      ],
      currentState:
        "The project is public under Nethermind and has release artifacts and documentation.",
      evidence: [
        {
          label: "GitHub repository",
          href: "https://github.com/NethermindEth/voyager-verifier"
        },
        {
          label: "Release notes",
          href: "https://github.com/NethermindEth/voyager-verifier/releases"
        }
      ]
    }
  },
  {
    slug: "horizon-starknet",
    title: "Horizon Protocol",
    schemaType: "SoftwareApplication",
    applicationCategory: "FinanceApplication",
    shortDescription:
      "Starknet yield tokenization protocol with SY/PT/YT assets, AMM markets, router flows, frontend, and indexer.",
    valueStatement:
      "Starknet yield tokenization protocol with SY/PT/YT assets, AMM markets, router flows, frontend, and indexer.",
    proof:
      "Alpha mainnet deployment with live SplitYield product and documented Starknet contract addresses.",
    icon: {
      alt: "SplitYield",
      src: "/icons/horizon-protocol.png"
    },
    tags: ["Cairo", "Starknet", "TypeScript", "Next.js", "Apibara", "PostgreSQL", "DeFi"],
    metadata: {
      role: "Independent protocol engineer",
      stack: ["Cairo", "Starknet", "TypeScript", "Next.js", "Apibara", "PostgreSQL"],
      currentState: "Alpha mainnet deployment on Starknet with a live SplitYield interface."
    },
    caseStudy: {
      overview:
        "Horizon Protocol is a Pendle-style yield tokenization protocol for Starknet. It separates yield-bearing assets into standardized yield, principal, and yield tokens, with AMM markets, factories, router operations, oracle integration, contracts, frontend, and indexer pieces.",
      problem:
        "Yield tokenization needs protocol contracts, market creation, routing, oracle-aware pricing, frontend flows, and indexed data to stay aligned. Each layer has to expose enough detail for advanced DeFi users without creating unsafe or confusing product paths.",
      role: "I built across the protocol, frontend, and indexing surfaces, connecting Cairo contracts, TypeScript product flows, and data infrastructure into a live alpha.",
      technicalDetails: [
        "Implemented Starknet protocol pieces for standardized yield, principal, and yield token flows.",
        "Built product and router flows around markets, factories, AMM interactions, and documented deployed addresses.",
        "Connected a Next.js frontend and Bun-based Apibara indexer with PostgreSQL-backed data workflows."
      ],
      tradeoffs: [
        "Alpha DeFi infrastructure needs clear current-state language because live contracts are useful evidence but do not imply a completed risk or audit posture.",
        "The protocol surface has to balance composable contract primitives with a frontend that makes tokenized yield operations legible."
      ],
      currentState:
        "The repository documents an alpha mainnet deployment on Starknet Mainnet, and the SplitYield product is publicly reachable.",
      evidence: [
        {
          label: "Live SplitYield product",
          href: "https://splityield.org/"
        },
        {
          label: "GitHub repository",
          href: "https://github.com/ametel01/horizon-starknet"
        }
      ]
    }
  }
] as const;

export const openSourceContributions: readonly OpenSourceContribution[] = [
  {
    project: "Apache DataFusion",
    summary:
      "Contributed SQL planner diagnostics to Apache DataFusion, adding non-fatal warnings for likely mistaken NULL equality predicates across WHERE, JOIN ON, and HAVING paths with regression coverage.",
    href: "https://github.com/apache/datafusion/pull/22948",
    status: "Merged PR"
  },
  {
    project: "Starknet Foundry",
    summary:
      "Authored 7 merged PRs to Starknet Foundry, including sncast verify Voyager verification support, verifier file-gathering UX, network-selection fixes, payload compatibility, e2e coverage, and migration to the Voyager verifier library.",
    href: "https://github.com/foundry-rs/starknet-foundry",
    status: "7 merged PRs"
  },
  {
    project: "Dojo Engine",
    summary:
      "Authored 10 merged PRs to Dojo Engine across Cairo ERC20/ERC721 modules, GDA/VRGDA auction primitives, constant-product market logic, test coverage, and Sozo Voyager contract-verification tooling.",
    href: "https://github.com/dojoengine/dojo",
    status: "10 merged PRs"
  },
  {
    project: "Apibara DNA",
    summary:
      "Authored 3 merged PRs to Apibara DNA around Starknet devnet integration, connector/configuration updates, and PostgreSQL sink unique-column handling.",
    href: "https://github.com/apibara/dna",
    status: "3 merged PRs"
  },
  {
    project: "Voyager Verifier",
    summary:
      "Authored 27 merged PRs evolving a Rust Starknet contract-verification CLI/library across API client design, file/source resolution, config/history/status/batch workflows, Dojo support, release automation, documentation, and public library extraction.",
    href: "https://github.com/NethermindEth/voyager-verifier",
    status: "27 merged PRs"
  }
] as const;

export const projectSlugs = projects.map((project) => project.slug);

export function isProjectSlug(slug: string): slug is Project["slug"] {
  return projectSlugs.includes(slug as Project["slug"]);
}

export function getProject(slug: Project["slug"]) {
  return projects.find((project) => project.slug === slug);
}
