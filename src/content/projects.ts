export type EvidenceLink = {
  label: string;
  href: string;
};

export type ImplementationExample = {
  label: string;
  code: string;
};

export type ProjectIconAsset = {
  alt: string;
  src: string;
};

export type CaseStudySectionTitles = {
  definition: string;
  problem: string;
  role: string;
  architecture: string;
  decisions: string;
  hardProblems: string;
  tradeoffs: string;
  currentState: string;
  evidence: string;
  relatedWriting: string;
  lastUpdated: string;
  relatedWork: string;
  relatedArticles: string;
  adjacentProjects: string;
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
    | "ask-siargao"
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
    sectionTitles: CaseStudySectionTitles;
    definition: string;
    problem: string;
    role: string;
    architecture: readonly string[];
    implementationExample?: ImplementationExample;
    decisions: readonly string[];
    hardProblems: readonly string[];
    tradeoffs: readonly string[];
    currentState: string;
    evidence: readonly EvidenceLink[];
    relatedWriting: readonly EvidenceLink[];
    lastUpdated: string;
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
      currentState: "Public Go CLI; latest tagged release is v0.10.1."
    },
    caseStudy: {
      sectionTitles: {
        definition: "What AgentReceipt records",
        problem: "Why AI-assisted work needs durable evidence",
        role: "Building the evidence pipeline end to end",
        architecture: "Sidecar capture architecture",
        decisions: "Why provider logs are treated as optional evidence",
        hardProblems: "Matching sessions, patches, and replay state",
        tradeoffs: "Separating observation from enforcement",
        currentState: "Current Codex and Claude limitations",
        evidence: "Inspect the source, receipts, and release",
        relatedWriting: "Replay contracts and review workflow",
        lastUpdated: "When this AgentReceipt evidence was reviewed",
        relatedWork: "Continue through agent evidence and tooling",
        relatedArticles: "Deeper guides to replayable agent evidence",
        adjacentProjects: "Other local-first agent tools"
      },
      definition:
        "AgentReceipt is a local evidence sidecar that records AI-assisted coding sessions and exposes signed, machine-readable replay and review artifacts.",
      problem:
        "AI-assisted software work is hard to review when git state, filesystem changes, instruction context, provider logs, commands, quality checks, and final patch evidence are scattered across local tools.",
      role: "I designed and implemented the Go CLI, evidence model, git and filesystem capture, Ed25519 signing, replay/focus JSON contracts, installer, and reviewer-facing outputs. The broader project provides the complete sidecar workflow; my work spans its command surface and internal evidence pipeline.",
      architecture: [
        "A Cobra-based Go CLI coordinates explicit start/stop sessions, a git monitor, a filesystem watcher, and best-effort Codex JSONL or Claude hook ingestion.",
        "Observed events are hash-chained and finalized into local receipts, signatures, patch artifacts, replay reports, and compact focus queues for coding-agent loops.",
        "The machine-facing commands are sessions, focus, replay, schema, and verify diff; human review and export commands remain separate renderers over the same captured evidence."
      ],
      implementationExample: {
        label: "Capture a session, inspect the next-step queue, and verify the final patch",
        code: "agentreceipt start --watch\n# run the AI-assisted coding session\nagentreceipt stop\nagentreceipt focus --session <id>\nagentreceipt verify diff --session <id> --against merge-base --json"
      },
      decisions: [
        "The CLI runs as a sidecar instead of launching or proxying the coding agent, so teams can keep their existing terminal workflow.",
        "Git and filesystem observations are high-confidence sources; provider logs enrich the receipt but never block finalization when their format changes or data is missing.",
        "Raw prompts, raw tool output, and provider logs stay out of exports by default, while JSON Schema defines stable contracts for machine consumers."
      ],
      hardProblems: [
        "Matching a live Codex session log to the current repository without depending on an official provider API required best-effort parsing and explicit confidence degradation.",
        "Patch verification has to distinguish captured session activity from later workspace changes while preserving enough evidence to explain mismatches.",
        "Replay and focus outputs have to remain deterministic and compact enough for automation while still pointing back to the underlying event evidence."
      ],
      tradeoffs: [
        "Codex live watching is the primary provider path; Claude support is currently hook-based and does not provide equivalent transcript coverage.",
        "Risk classification is heuristic, and AgentReceipt observes rather than sandboxing, approving, denying, or enforcing team policy.",
        "Keeping evidence local protects prompt data but leaves hosted policy distribution, GitHub App enforcement, and organization-wide controls outside the current release."
      ],
      currentState:
        "The public repository's latest tagged release is v0.10.1, published June 21, 2026, with Linux and macOS release artifacts. The current workflow is local-only and Codex-first.",
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
          label: "v0.10.1 release",
          href: "https://github.com/ametel01/agentreceipt/releases/tag/v0.10.1"
        }
      ],
      relatedWriting: [
        {
          label: "Replay and focus contract specifications",
          href: "https://github.com/ametel01/agentreceipt/blob/main/docs/REPLAY_SPECS.md"
        },
        {
          label: "GitHub pull-request workflow design",
          href: "https://github.com/ametel01/agentreceipt/blob/main/docs/GITHUB_PR_WORKFLOW_DESIGN.md"
        }
      ],
      lastUpdated: "2026-08-09"
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
      currentState: "Public TypeScript CLI; latest tagged release is v0.6.2."
    },
    caseStudy: {
      sectionTitles: {
        definition: "What Skills Doctor audits",
        problem: "Why agent skills silently drift",
        role: "Building the scanner and rule engine",
        architecture: "How the audit pipeline is assembled",
        decisions: "Why repair remains explicit and consent-gated",
        hardProblems: "Detecting risky capability combinations",
        tradeoffs: "Where static analysis stops",
        currentState: "Skills Doctor at v0.6.2",
        evidence: "Source, releases, and authored changes",
        relatedWriting: "Rules, API, and security specifications",
        lastUpdated: "When this Skills Doctor evidence was reviewed",
        relatedWork: "Continue through local agent tooling",
        relatedArticles: "Guides to skill design and local tooling",
        adjacentProjects: "Other agent workflow case studies"
      },
      definition:
        "Skills Doctor is a local-first TypeScript CLI that audits Claude and Codex Agent Skills and produces human-readable or machine-readable findings.",
      problem:
        "Agent Skills can silently drift when frontmatter, trigger descriptions, workflow instructions, references, scripts, evals, security boundaries, or local and global copies stop agreeing.",
      role: "I designed and implemented the scanner, deterministic rule catalog, score model, security incident grouping, JSON API, local usage analysis, and consent-gated agent handoff. I authored 27 merged pull requests in the public repository.",
      architecture: [
        "Root discovery finds project and user-level .claude/skills and .agents/skills directories, then the package scanner classifies SKILL.md, scripts, references, assets, configuration, symlinks, and executable files.",
        "A deterministic rule engine emits quality diagnostics and security capabilities; reporters turn the same scan into terminal summaries, schema-versioned JSON, repair artifacts, or the programmatic TypeScript API.",
        "The interactive layer can add local Codex usage evidence, select a finding subset, write a bounded handoff prompt, launch claude or codex only after confirmation, and re-scan after the agent exits."
      ],
      implementationExample: {
        label: "Run a non-interactive CI audit with machine-readable output",
        code: "npx skills-doctor@latest --yes --json --fail-on warning --fail-on-security P1 --min-score 95"
      },
      decisions: [
        "Rule logic and output shape live in the CLI; the packaged Agent Skill is a thin discovery and invocation wrapper rather than a second implementation.",
        "Security signals stay deterministic and rule-by-rule in JSON, while human output groups correlated signals into incidents for review.",
        "Non-interactive discovery fails on ambiguous roots instead of guessing, and agent repair remains a separate, explicitly confirmed action."
      ],
      hardProblems: [
        "Security checks have to connect prompt override, secret access, egress, remote execution, persistence, and approval bypass signals without presenting heuristics as proof of malicious intent.",
        "Root discovery must handle local/global shadowing, cross-ecosystem duplicates, symlinks, hidden files, and disabled skills without silently scanning the wrong scope.",
        "Usage analysis has to extract useful counts and context-pressure evidence from changing Codex trace formats without copying raw prompts or transcripts into reports."
      ],
      tradeoffs: [
        "Static rules can flag suspicious capabilities and weak workflow structure, but they cannot establish author intent or replace a manual security review.",
        "The score deducts once per distinct rule rather than per repeated finding, which keeps noisy packages from dominating but intentionally compresses frequency information.",
        "Local usage analysis is best-effort and its coverage depends on which Codex history and pressure sources are present."
      ],
      currentState:
        "The latest tagged release is v0.6.2, published July 5, 2026. The public repository contains 27 merged pull requests authored by me and additional changes on main after the release.",
      evidence: [
        {
          label: "GitHub repository",
          href: "https://github.com/ametel01/skills-doctor"
        },
        {
          label: "27 merged pull requests",
          href: "https://github.com/ametel01/skills-doctor/pulls?q=is%3Apr+is%3Amerged+author%3Aametel01"
        },
        {
          label: "v0.6.2 release",
          href: "https://github.com/ametel01/skills-doctor/releases/tag/v0.6.2"
        }
      ],
      relatedWriting: [
        {
          label: "Rule catalog and rationale",
          href: "https://github.com/ametel01/skills-doctor/blob/main/docs/RULES.md"
        },
        {
          label: "Programmatic API reference",
          href: "https://github.com/ametel01/skills-doctor/blob/main/docs/API.md"
        },
        {
          label: "Security scanning specification",
          href: "https://github.com/ametel01/skills-doctor/blob/main/docs/SECURITY_SPEC.md"
        }
      ],
      lastUpdated: "2026-08-09"
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
      currentState: "Published TypeScript CLI; latest tagged release is v0.3.2."
    },
    caseStudy: {
      sectionTitles: {
        definition: "What RitualAI turns into a skill",
        problem: "Why repeated workflows stay hidden",
        role: "Building the history-to-skill workflow",
        architecture: "Local history discovery and guarded installation",
        decisions: "Why agent discovery requires opt-in",
        hardProblems: "Ranking repetition without overfitting",
        tradeoffs: "Privacy, scan caps, and human judgment",
        currentState: "RitualAI at v0.3.2",
        evidence: "Source, package, and release evidence",
        relatedWriting: "Discovery and cache design notes",
        lastUpdated: "When this RitualAI evidence was reviewed",
        relatedWork: "Continue through reusable agent workflows",
        relatedArticles: "Guides to local-first agent automation",
        adjacentProjects: "Other local-first tooling case studies"
      },
      definition:
        "RitualAI is an interactive TypeScript CLI that finds repeated workflows in local Claude and Codex history and guides an approved candidate into a reusable SKILL.md.",
      problem:
        "Developers often repeat useful agent prompts and workflows without noticing which patterns are stable enough to turn into reusable automation.",
      role: "I designed and implemented history-source discovery, bounded JSON/JSONL parsing, local repeated-workflow ranking, the same-window Claude/Codex discovery handoff, duplicate-skill suppression, and guarded installation paths.",
      architecture: [
        "Source discovery reads supported Claude history and transcript locations plus Codex history, active sessions, and archived sessions; malformed records become diagnostics rather than stopping the scan.",
        "The preferred path passes only discovered history paths and scoped instructions to a user-selected local claude or codex executable; a deterministic local ranker is the fallback when agent discovery is declined or unavailable.",
        "The selected workflow continues in the same agent window, asks whether installation should be project-local or global, and writes the resulting SKILL.md only after the user confirms the target."
      ],
      implementationExample: {
        label: "Start interactive discovery or inspect the latest 25 prompts",
        code: "npx ritualai@latest\nnpx ritualai@latest prompts --limit 25"
      },
      decisions: [
        "History discovery, extraction, and fallback ranking remain local; the CLI never uploads history itself.",
        "Agent discovery is opt-in because the local claude or codex executable may call an external service according to the user's configuration.",
        "Existing project and global skills suppress already-covered candidates, and existing skill files are never overwritten without interactive confirmation."
      ],
      hardProblems: [
        "Claude and Codex store multiple evolving JSONL shapes across history, transcript, active-session, and archived-session paths, so parsing needs bounded compatibility and clear truncation diagnostics.",
        "Repeated text is not automatically a reusable workflow; candidate ranking must reduce generic duplicates and avoid suppressing broad workflows because of short, loosely related skills.",
        "The agent handoff must expose enough local context for semantic discovery while constraining repository inspection and file writes during the discovery phase."
      ],
      tradeoffs: [
        "The local fallback is more private and deterministic but less capable of semantic grouping than an agent review.",
        "Bounded scan caps prevent unbounded history processing but can skip older or oversized sources; the CLI reports those gaps.",
        "Generated skills still require human judgment because repetition alone does not prove that a workflow is stable, safe, or worth maintaining."
      ],
      currentState:
        "RitualAI is published through npm and GitHub. The latest tagged release is v0.3.2, published June 20, 2026.",
      evidence: [
        {
          label: "GitHub repository",
          href: "https://github.com/ametel01/ritualai"
        },
        {
          label: "v0.3.2 release",
          href: "https://github.com/ametel01/ritualai/releases/tag/v0.3.2"
        },
        {
          label: "npm package",
          href: "https://www.npmjs.com/package/ritualai"
        }
      ],
      relatedWriting: [
        {
          label: "Technical specification",
          href: "https://github.com/ametel01/ritualai/blob/main/docs/TECH_SPEC.md"
        },
        {
          label: "History index and cache design spike",
          href: "https://github.com/ametel01/ritualai/blob/main/docs/history-index-cache-spike.md"
        }
      ],
      lastUpdated: "2026-08-09"
    }
  },
  {
    slug: "ask-siargao",
    title: "Ask Siargao",
    schemaType: "SoftwareApplication",
    applicationCategory: "TravelApplication",
    shortDescription:
      "AI travel decision desk that turns Siargao plans into evidence-backed keep, change, avoid, or confirm-locally calls.",
    valueStatement:
      "AI travel decision desk that turns Siargao plans into evidence-backed keep, change, avoid, or confirm-locally calls.",
    proof:
      "Live product and public source with governed tool use, server-validated Reality Checks, privacy-scoped trip memory, and repeatable verification gates.",
    icon: {
      alt: "Ask Siargao",
      src: "/icons/ask-siargao.svg"
    },
    tags: ["TypeScript", "Next.js", "AI Agents", "PostgreSQL", "Redis", "Travel Tech"],
    metadata: {
      role: "Independent AI product and backend engineer",
      stack: ["TypeScript", "Next.js", "OpenAI", "PostgreSQL", "Redis", "Vercel"],
      currentState: "Live public product with an active public repository and deployed chat."
    },
    caseStudy: {
      sectionTitles: {
        definition: "What Ask Siargao decides",
        problem: "Why island plans need current, bounded evidence",
        role: "Building the decision system end to end",
        architecture: "Agent judgment inside deterministic evidence boundaries",
        decisions: "Why the model chooses tools but not source truth",
        hardProblems: "Freshness, failure, and privacy across one chat turn",
        tradeoffs: "What an on-demand decision desk does not promise",
        currentState: "Ask Siargao's live state",
        evidence: "Live product, source, and product contract",
        relatedWriting: "Runtime, source-governance, and Reality Check references",
        lastUpdated: "When this Ask Siargao evidence was reviewed",
        relatedWork: "Continue through evidence-bounded AI systems",
        relatedArticles: "Writing on agent evidence and recommendation boundaries",
        adjacentProjects: "Other agent and infrastructure case studies"
      },
      definition:
        "Ask Siargao is a chat-first travel decision system for accommodation, itinerary, immediate-plan, surf-session, and disruption questions. It turns request-time evidence into a bounded keep, change, avoid, or needs-confirmation recommendation.",
      problem:
        "Siargao travel advice changes with weather, tides, surf conditions, place status, transport, and a traveler's real constraints. A generic answer can sound decisive while relying on stale evidence, hiding missing checks, or overstating what the product can verify.",
      role: "I designed and implemented the product, Next.js application, agent runtime, governed evidence tools, Reality Check contract, provider and cache boundaries, traveler privacy model, Trip Pass lifecycle, deployment path, and verification harness.",
      architecture: [
        "A Next.js App Router API accepts an explicit chat submission and delegates it to a Responses-compatible agent runtime. The model chooses typed tools and writes the answer; deterministic code validates request shape, access, source labels, evidence references, and public artifact selection.",
        "Governed tools combine Open-Meteo weather, marine, and tide data; Google Places identity and place evidence; public-web research; and repository-backed local knowledge. PostgreSQL stores durable facts and traveler-owned artifacts, while Redis supports shared operational controls such as rate limiting.",
        "A structured final payload identifies the tool calls and artifacts used. The server validates source sufficiency, creates the public decision summary and source list, and persists only sanitized traveler-visible history without raw provider payloads or exact browser coordinates."
      ],
      implementationExample: {
        label: "Run the fast checks, then the complete local Foundation Gates",
        code: "bun run verify\nbun run verify:foundation"
      },
      decisions: [
        "The model owns tool choice, synthesis, and final wording; the backend owns provider access, source governance, privacy, and evidence validation.",
        "Reality Checks run only after explicit message submission and finish inside that request, keeping the evidence timestamp, cost, result, and failure state observable together.",
        "The model references completed evidence calls, but the server derives public sources and decision IDs so a generated answer cannot declare its own evidence trustworthy."
      ],
      hardProblems: [
        "Different questions require different evidence contracts: surf decisions need current marine or tide data and a condition judgment, while named stays need successful place-identity evidence.",
        "Provider success is partial and time-sensitive, so the runtime must preserve useful checked evidence, expose meaningful gaps, and prevent failed or stale sources from supporting a decisive claim.",
        "Anonymous chat, signed-in history, saved plans, sharing, browser location, payments, and account closure need distinct ownership and retention boundaries without leaking private tool arguments into public artifacts."
      ],
      tradeoffs: [
        "The synchronous, on-demand workflow gives one evidence-backed answer at a time; it does not monitor conditions, contact operators, book activities, or guarantee future availability.",
        "Typed tool contracts, source policies, caches, and artifact allowlists add backend complexity, but make answer provenance and degraded states reviewable.",
        "When required evidence is unavailable, needs confirmation is deliberately less satisfying than a confident recommendation but more accurate than inventing a checked result."
      ],
      currentState:
        "The public repository is actively maintained and the Vercel deployment returned HTTP 200 on August 14, 2026. The live product exposes the landing page, chat workspace, Reality Checks, traveler settings, saved-trip sharing, and a free-to-paid Trip Pass allowance; no tagged release is published.",
      evidence: [
        {
          label: "Live Ask Siargao product",
          href: "https://www.asksiargao.com/"
        },
        {
          label: "Public GitHub repository",
          href: "https://github.com/ametel01/ask-siargao"
        },
        {
          label: "Product and local-run overview",
          href: "https://github.com/ametel01/ask-siargao/blob/main/README.md"
        }
      ],
      relatedWriting: [
        {
          label: "Reality Check contract reference",
          href: "https://github.com/ametel01/ask-siargao/blob/main/documentation/developer/reference/reality-check-contract.md"
        },
        {
          label: "Chat routing and source-governance explanation",
          href: "https://github.com/ametel01/ask-siargao/blob/main/documentation/developer/explanation/chat-agent-routing-and-source-governance.md"
        },
        {
          label: "On-demand Reality Check lifecycle",
          href: "https://github.com/ametel01/ask-siargao/blob/main/documentation/developer/explanation/on-demand-reality-check-lifecycle.md"
        }
      ],
      lastUpdated: "2026-08-14"
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
      currentState: "Public Rust sandbox; latest tagged release is v0.3.0."
    },
    caseStudy: {
      sectionTitles: {
        definition: "What AggSandbox runs locally",
        problem: "Why cross-chain testing needs an inspectable stack",
        role: "Building the CLI and network environment",
        architecture: "Local, forked, and multi-L2 topology",
        decisions: "Why bridge state stays explicit",
        hardProblems: "Coordinating chains, services, and claims",
        tradeoffs: "Where local simulation diverges from public networks",
        currentState: "AggSandbox at v0.3.0 and beyond",
        evidence: "Repository, release, and authored changes",
        relatedWriting: "Architecture, bridge, and CLI guides",
        lastUpdated: "When this AggSandbox evidence was reviewed",
        relatedWork: "Continue through blockchain infrastructure",
        relatedArticles: "Guides to cross-chain development workflows",
        adjacentProjects: "Other infrastructure case studies"
      },
      definition:
        "AggSandbox is a Rust CLI and Docker-based development environment for running local, forked, and multi-L2 Polygon zkEVM bridge workflows.",
      problem:
        "Cross-chain systems are difficult to test because local environments need multiple networks, bridge contracts, services, transaction scripts, and clear inspection points.",
      role: "At Nethermind, I authored 49 merged pull requests across the Rust CLI, Docker and Anvil environments, contract deployment, AggKit integration, bridge and claim commands, multi-L2 mode, tests, and documentation. The broader project provides the Polygon zkEVM bridge contracts and services that the CLI orchestrates.",
      architecture: [
        "The Rust CLI starts and inspects Docker Compose environments containing an Anvil L1, one or more Anvil L2 chains, AggKit services, and deployed bridge contracts.",
        "Local mode simulates the full stack, fork mode starts from real network state, and multi-L2 mode exercises bridging between multiple destination chains.",
        "Bridge commands submit asset or message operations; status, events, bridges, and claims commands expose the intermediate state needed to diagnose the asynchronous lifecycle."
      ],
      implementationExample: {
        label: "Start the sandbox, bridge an asset, and inspect the destination claim",
        code: "aggsandbox start --detach\naggsandbox bridge asset --network-id 0 --destination-network-id 1 --amount 0.1 --token-address 0x0000000000000000000000000000000000000000\naggsandbox show claims --network-id 1"
      },
      decisions: [
        "Docker Compose pins a repeatable service topology while the CLI provides one command surface for local, forked, and multi-L2 variants.",
        "Operational inspection remains explicit through status, events, bridges, and claims instead of hiding bridge state behind a single success message.",
        "The repository includes unit, integration, benchmark, and bridge-flow work so CLI behavior and infrastructure changes can be exercised together."
      ],
      hardProblems: [
        "Multi-chain startup has to coordinate ports, network IDs, contract addresses, service health, and deployment ordering across several containers.",
        "A bridge operation spans source submission, AggKit processing, proof or claim availability, and destination execution, so failures need to preserve enough identifiers for follow-up commands.",
        "Fork and multi-L2 modes change the surrounding network assumptions while the CLI still needs stable command semantics and deterministic tests."
      ],
      tradeoffs: [
        "The Docker stack improves reproducibility but requires Docker, Rust, Make, multiple ports, and enough local resources for several chains and services.",
        "Local simulations help reproduce bridge workflows but do not reproduce every timing, availability, or finality condition of public networks.",
        "The CLI reduces setup steps without removing the need to understand network IDs, token addresses, transaction hashes, and claim state."
      ],
      currentState:
        "The public Nethermind repository's latest tagged release is v0.3.0, published July 6, 2025. I authored 49 merged pull requests; main includes changes after that release.",
      evidence: [
        {
          label: "GitHub repository",
          href: "https://github.com/NethermindEth/aggsandbox"
        },
        {
          label: "49 merged pull requests",
          href: "https://github.com/NethermindEth/aggsandbox/pulls?q=is%3Apr+is%3Amerged+author%3Aametel01"
        },
        {
          label: "v0.3.0 release",
          href: "https://github.com/NethermindEth/aggsandbox/releases/tag/v0.3.0"
        }
      ],
      relatedWriting: [
        {
          label: "Architecture overview",
          href: "https://github.com/NethermindEth/aggsandbox/blob/main/docs/overview.md"
        },
        {
          label: "Bridge operations guide",
          href: "https://github.com/NethermindEth/aggsandbox/blob/main/docs/bridge-operations.md"
        },
        {
          label: "CLI reference",
          href: "https://github.com/NethermindEth/aggsandbox/blob/main/docs/cli-reference.md"
        }
      ],
      lastUpdated: "2026-08-09"
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
      currentState: "Public Rust verifier; latest tagged release is v2.3.1."
    },
    caseStudy: {
      sectionTitles: {
        definition: "What Voyager Verifier submits",
        problem: "Why contract verification fails on small mismatches",
        role: "Building the verifier and public Rust library",
        architecture: "From Scarb metadata to Voyager submission",
        decisions: "Why the CLI and library share one pipeline",
        hardProblems: "Matching Cairo sources to deployed classes",
        tradeoffs: "Explorer dependencies and strict input checks",
        currentState: "Voyager Verifier at v2.3.1",
        evidence: "Source, release, docs, and merged work",
        relatedWriting: "File collection and integration guides",
        lastUpdated: "When this verifier evidence was reviewed",
        relatedWork: "Continue through verification tooling",
        relatedArticles: "Guides to source verification workflows",
        adjacentProjects: "Other developer infrastructure case studies"
      },
      definition:
        "Voyager Verifier is a Rust CLI and reusable library for submitting Starknet contract classes to the Voyager block explorer for source verification.",
      problem:
        "Contract verification workflows are sensitive to compiler versions, package metadata, network selection, and explorer API behavior. Small mismatches can create confusing failures for developers.",
      role: "At Nethermind, I authored 27 merged pull requests covering file and source resolution, Scarb.lock support, network selection, API payload migration, config and history, batch verification, status reporting, Dojo support, releases, documentation, and extraction of the public voyager-verifier library.",
      architecture: [
        "A Rust workspace separates the standalone voyager CLI from the reusable voyager-verifier crate; the CLI is distributed through asdf and GitHub release artifacts.",
        "The verification pipeline resolves Scarb workspace metadata and source files, selects the Starknet network and endpoint, builds the Voyager API payload, submits the job, and exposes status and history commands.",
        "Users can run an interactive wizard, pass flags directly, or define multiple contracts in .voyager.toml for batch verification."
      ],
      implementationExample: {
        label: "Submit one contract class from the command line",
        code: "voyager verify --network mainnet \\\n  --class-hash <YOUR_CLASS_HASH> \\\n  --contract-name <CONTRACT_NAME>"
      },
      decisions: [
        "The first-run wizard and direct CLI flags share one verification pipeline, while .voyager.toml supports repeatable batch and workspace flows.",
        "The verifier logic is available as a public Rust library so Starknet Foundry and other tools can integrate without shelling out to the CLI.",
        "Proc-macro source handling was removed for security, and source collection stays explicit enough to explain which files enter a verification request."
      ],
      hardProblems: [
        "Cairo and Scarb releases change compiler output, metadata, lockfile expectations, and workspace layout; verification must match the deployed class without silently accepting the wrong build context.",
        "Source collection has to include the contract and required dependencies while handling workspaces, test files, lock files, Dojo layouts, and path-related errors with actionable diagnostics.",
        "Moving the Voyager API client from multipart form data to JSON and extracting a public library required compatibility across the CLI, external integrations, releases, and production service behavior."
      ],
      tradeoffs: [
        "Strict compiler, metadata, and source checks reject mismatched projects earlier but require users to reproduce the original build inputs closely.",
        "The CLI targets Voyager's verification API; other explorers need their own adapters even though the source-resolution library is reusable.",
        "Verification status depends on an external explorer service, so the CLI can improve diagnostics and history but cannot eliminate remote availability or processing delays."
      ],
      currentState:
        "The public Nethermind repository's latest tagged release is v2.3.1, published June 30, 2026. The repository contains 27 merged pull requests authored by me, official mdBook documentation, a standalone CLI, and a crates.io library.",
      evidence: [
        {
          label: "GitHub repository",
          href: "https://github.com/NethermindEth/voyager-verifier"
        },
        {
          label: "27 merged pull requests",
          href: "https://github.com/NethermindEth/voyager-verifier/pulls?q=is%3Apr+is%3Amerged+author%3Aametel01"
        },
        {
          label: "v2.3.1 release",
          href: "https://github.com/NethermindEth/voyager-verifier/releases/tag/v2.3.1"
        },
        {
          label: "Official documentation",
          href: "https://nethermindeth.github.io/voyager-verifier/"
        }
      ],
      relatedWriting: [
        {
          label: "File collection reference",
          href: "https://nethermindeth.github.io/voyager-verifier/reference/file-collection/"
        },
        {
          label: "Batch verification guide",
          href: "https://nethermindeth.github.io/voyager-verifier/advanced/batch-verification.html"
        },
        {
          label: "Starknet Foundry integration notes",
          href: "https://github.com/NethermindEth/voyager-verifier/blob/main/FOUNDRY_INTEGRATION.md"
        }
      ],
      lastUpdated: "2026-08-09"
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
      "Source-available protocol with a v1.0.0 release, documented Starknet mainnet addresses, and reproducible contract build instructions.",
    icon: {
      alt: "SplitYield",
      src: "/icons/horizon-protocol.png"
    },
    tags: ["Cairo", "Starknet", "TypeScript", "Next.js", "Apibara", "PostgreSQL", "DeFi"],
    metadata: {
      role: "Independent protocol engineer",
      stack: ["Cairo", "Starknet", "TypeScript", "Next.js", "Apibara", "PostgreSQL"],
      currentState: "Alpha mainnet deployment; latest tagged release is v1.0.0."
    },
    caseStudy: {
      sectionTitles: {
        definition: "What Horizon Protocol tokenizes",
        problem: "Why yield splitting spans multiple runtimes",
        role: "Building contracts, indexer, and frontend together",
        architecture: "Contracts, router, indexer, and query layer",
        decisions: "Why slippage and events stay explicit",
        hardProblems: "Pricing principal tokens toward expiry",
        tradeoffs: "Unaudited alpha and upgrade risk",
        currentState: "Horizon Protocol after its first market",
        evidence: "Source, release, and deployment evidence",
        relatedWriting: "Protocol, AMM, and indexer specifications",
        lastUpdated: "When this protocol evidence was reviewed",
        relatedWork: "Continue through protocol engineering",
        relatedArticles: "Guides to protocol and indexing architecture",
        adjacentProjects: "Other blockchain systems"
      },
      definition:
        "Horizon Protocol is a source-available Starknet protocol that splits yield-bearing assets into standardized yield, principal, and yield tokens with PT/SY markets.",
      problem:
        "Yield tokenization requires contract accounting, time-dependent market pricing, router slippage checks, frontend transactions, oracle health, and indexed events to agree across several runtimes.",
      role: "I designed and implemented work across the Cairo contracts, deployment scripts, Next.js frontend, Apibara/PostgreSQL indexer, integration documentation, and operational hardening. I authored 46 merged pull requests in the public repository; external libraries provide Starknet, OpenZeppelin, Pragma, Apibara, and frontend primitives.",
      architecture: [
        "Cairo contracts implement standardized-yield wrappers, PT and YT token accounting, factories, PT/SY markets, a router with minimum-output parameters, upgrade roles, and Pragma oracle integration.",
        "The Next.js and React frontend builds transaction flows from the shared contract interfaces, while a Bun-based Apibara DNA indexer writes Starknet events into PostgreSQL.",
        "The documented indexer schema contains 54 event tables and 23 views, including nine materialized views for market statistics, positions, and yield history."
      ],
      implementationExample: {
        label: "Router entry point for swapping standardized yield into principal tokens",
        code: "fn buy_pt_from_sy(\n  market: ContractAddress,\n  receiver: ContractAddress,\n  sy_in: u256,\n  min_pt_out: u256\n)"
      },
      decisions: [
        "The Router is the recommended integration entry point and requires minimum-output values so slippage constraints travel with each operation.",
        "Protocol state changes emit explicit events that the indexer projects into query-oriented tables and views instead of making the frontend reconstruct history from RPC calls.",
        "Token amounts use 18-decimal WAD fixed-point arithmetic, and core contracts are owner-upgradeable to support fixes during the alpha stage."
      ],
      hardProblems: [
        "PT pricing converges toward the underlying asset at expiry, so AMM math, implied rates, rounding, and low-liquidity behavior change materially as time remaining approaches zero.",
        "Contract ABI and event changes have to propagate through deployment artifacts, the indexer, database views, frontend transaction builders, and tests without leaving a cross-layer mismatch.",
        "Frontend actions depend on chain head, RPC, oracle, indexer, and database health; unknown or stale state needs to disable or degrade operations rather than appear current."
      ],
      tradeoffs: [
        "The contracts are not audited, there is no active bug bounty, and the documented alpha does not include a pause function or upgrade timelock.",
        "Owner upgradeability creates a path to fix alpha software but also concentrates authority and introduces upgrade risk.",
        "WAD arithmetic can lose precision at extreme values; public-network, oracle, bridge, liquidity, and underlying-asset risks remain outside the protocol's direct control."
      ],
      currentState:
        "The latest tagged release is v1.0.0. The repository documents an unaudited Starknet mainnet alpha deployed December 23, 2025; its listed market expired January 17, 2026. The former splityield.org frontend returned HTTP 404 on August 9, 2026, so this page does not present it as a current deployment.",
      evidence: [
        {
          label: "GitHub repository",
          href: "https://github.com/ametel01/horizon-starknet"
        },
        {
          label: "46 merged pull requests",
          href: "https://github.com/ametel01/horizon-starknet/pulls?q=is%3Apr+is%3Amerged+author%3Aametel01"
        },
        {
          label: "v1.0.0 release",
          href: "https://github.com/ametel01/horizon-starknet/releases/tag/v1.0.0"
        },
        {
          label: "Documented mainnet addresses",
          href: "https://github.com/ametel01/horizon-starknet/blob/main/README.md#mainnet-deployment-starknet-mainnet"
        }
      ],
      relatedWriting: [
        {
          label: "Compressed protocol specification",
          href: "https://github.com/ametel01/horizon-starknet/blob/main/docs/HORIZON-SPEC-COMPRESSED.md"
        },
        {
          label: "AMM curve notes",
          href: "https://github.com/ametel01/horizon-starknet/blob/main/docs/PENDLE_AMM_CURVE.md"
        },
        {
          label: "Indexer architecture",
          href: "https://github.com/ametel01/horizon-starknet/blob/main/docs/APIBARA.md"
        }
      ],
      lastUpdated: "2026-08-09"
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
