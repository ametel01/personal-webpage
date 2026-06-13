export type EvidenceLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: "voyager-verifier" | "aggsandbox" | "scopepilot" | "horizon-starknet";
  title: string;
  shortDescription: string;
  valueStatement: string;
  proof: string;
  icon: "ShieldCheck" | "Network" | "ClipboardList" | "Coins";
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

export const projects: readonly Project[] = [
  {
    slug: "voyager-verifier",
    title: "Voyager Verifier",
    shortDescription:
      "Starknet contract verification tooling with compiler integration and status tracking.",
    valueStatement:
      "Starknet contract verification tooling with compiler integration and status tracking.",
    proof: "Built for Starknet verification workflows at Nethermind.",
    icon: "ShieldCheck",
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
    slug: "aggsandbox",
    title: "AggSandbox",
    shortDescription:
      "Cross-chain infrastructure experiments using LayerZero, AggLayer concepts, and executable contract scripts.",
    valueStatement:
      "Cross-chain infrastructure experiments using LayerZero, AggLayer concepts, and executable contract scripts.",
    proof: "Cross-chain protocol experiments with executable contracts and scripts.",
    icon: "Network",
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
    slug: "scopepilot",
    title: "ScopePilot",
    shortDescription:
      "Agency proposal configurator for scope, pricing, approvals, revisions, and client delivery.",
    valueStatement:
      "Agency proposal configurator for scope, pricing, approvals, revisions, and client delivery.",
    proof: "Live product with public user documentation for proposal and change-order workflows.",
    icon: "ClipboardList",
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
    slug: "horizon-starknet",
    title: "Horizon Protocol",
    shortDescription:
      "Starknet yield tokenization protocol with SY/PT/YT assets, AMM markets, router flows, frontend, and indexer.",
    valueStatement:
      "Starknet yield tokenization protocol with SY/PT/YT assets, AMM markets, router flows, frontend, and indexer.",
    proof:
      "Alpha mainnet deployment with live SplitYield product and documented Starknet contract addresses.",
    icon: "Coins",
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

export const projectSlugs = projects.map((project) => project.slug);

export function isProjectSlug(slug: string): slug is Project["slug"] {
  return projectSlugs.includes(slug as Project["slug"]);
}

export function getProject(slug: Project["slug"]) {
  return projects.find((project) => project.slug === slug);
}
