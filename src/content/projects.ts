export type EvidenceLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: "voyager-verifier" | "aggsandbox" | "nogame";
  title: string;
  shortDescription: string;
  valueStatement: string;
  proof: string;
  icon: "ShieldCheck" | "Network" | "Gamepad2";
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
    slug: "nogame",
    title: "NoGame",
    shortDescription: "Starknet MMO prototype with contracts, frontend systems, and game logic.",
    valueStatement: "Starknet MMO prototype with contracts, frontend systems, and game logic.",
    proof: "Playable Starknet MMO prototype with contracts and frontend systems.",
    icon: "Gamepad2",
    tags: ["Cairo", "Starknet", "React", "TypeScript", "Smart contracts"],
    metadata: {
      role: "Founder and lead developer",
      stack: ["Cairo", "Starknet", "React", "TypeScript", "Smart contracts"],
      currentState: "Public prototype repository with contracts, scripts, and application code."
    },
    caseStudy: {
      overview:
        "NoGame is a space-themed Starknet MMO prototype. It combines smart contracts, frontend systems, game logic, scripts, and operational tooling around a fully on-chain game direction.",
      problem:
        "A blockchain game has to coordinate product design, contract state, frontend interaction, transaction flows, and game mechanics while keeping the system understandable to players and contributors.",
      role: "I designed and built the project as a solo engineer, owning architecture, contracts, frontend systems, deployment workflows, and ongoing iteration.",
      technicalDetails: [
        "Implemented Cairo contracts and supporting scripts for Starknet game systems.",
        "Built TypeScript and React interfaces for player-facing flows and chain interactions.",
        "Designed game mechanics and infrastructure around a long-running on-chain world."
      ],
      tradeoffs: [
        "Game mechanics had to balance on-chain transparency with usable player workflows.",
        "Prototype velocity had to be weighed against contract and data model choices that would be expensive to change later."
      ],
      currentState:
        "The repository is public and contains contracts, scripts, tests, and project documentation.",
      evidence: [
        {
          label: "GitHub repository",
          href: "https://github.com/ametel01/nogame-starknet"
        }
      ]
    }
  }
] as const;

export function getProject(slug: Project["slug"]) {
  return projects.find((project) => project.slug === slug);
}
