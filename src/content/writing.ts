export type WritingTopic =
  | "AI systems"
  | "Developer infrastructure"
  | "Blockchain systems"
  | "Product systems";

export type WritingSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  listTitle?: string;
  items?: readonly string[];
};

export type WritingArticle = {
  slug: string;
  title: string;
  description: string;
  topic: WritingTopic;
  topicDescription: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  searchQuestions: readonly string[];
  keyPoints: readonly string[];
  sections: readonly WritingSection[];
  relatedProject: {
    title: string;
    href: string;
    description: string;
  };
};

export const writingArticles = [
  {
    slug: "designing-audit-trails-for-ai-agent-workflows",
    title: "Designing audit trails for AI agent workflows",
    description:
      "A practical model for recording inputs, tool calls, outputs, and verification so an AI agent run can be inspected and reproduced.",
    topic: "AI systems",
    topicDescription: "Agent workflows, provenance, evaluation, and operational safeguards.",
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    readingMinutes: 9,
    searchQuestions: [
      "What should an AI agent audit log contain?",
      "How do you make an agent run reproducible?",
      "How should sensitive tool inputs be recorded?"
    ],
    keyPoints: [
      "Model the run as linked events instead of one oversized transcript.",
      "Record what was authorized separately from what was attempted and observed.",
      "Make integrity, redaction, and retention decisions part of the record format.",
      "Verify the receipt independently from the process that produced it."
    ],
    sections: [
      {
        id: "audit-trail-not-log",
        title: "An audit trail is more than a log",
        paragraphs: [
          "Application logs help operators diagnose a running service. An audit trail answers a different set of questions: who or what initiated an action, which inputs and policies shaped it, what the agent attempted, what an external system returned, and how the final result was accepted. Those questions require structure and durable relationships between events.",
          "Treating a complete agent run as a single transcript makes later inspection difficult. Tool calls, approvals, retries, model responses, and validation results have different actors and retention needs. A better starting point is an append-only sequence of typed events joined by stable identifiers. The human-readable narrative can then be derived from the event record rather than serving as the record itself."
        ],
        listTitle: "A useful event envelope records",
        items: [
          "A run identifier, event identifier, event type, and timestamp.",
          "The actor that initiated the event: user, agent, policy engine, tool, or reviewer.",
          "A reference to the parent event and the artifact being created or changed.",
          "The declared intent, observed outcome, and status as separate fields.",
          "Integrity information for the event payload and any referenced artifact."
        ]
      },
      {
        id: "capture-boundaries",
        title: "Capture the boundaries around every tool call",
        paragraphs: [
          "A tool call is where an agent stops predicting text and starts affecting another system. Record the tool name and version, normalized arguments, policy decision, start and end state, returned result, and any side-effect identifier supplied by the tool. If the call changes external state, an idempotency key or operation identifier is often more useful than a prose success message.",
          "Keep authorization distinct from execution. A policy check can allow an action that later fails, while a tool can report success for an action the policy should never have allowed. Recording both decisions lets reviewers locate the broken boundary instead of inferring it from a final status."
        ],
        listTitle: "Do not silently collapse",
        items: [
          "The arguments proposed by the model and the arguments actually sent.",
          "A tool's transport-level response and the business outcome it represents.",
          "Automatic validation and explicit human approval.",
          "A retry attempt and the event that caused the retry."
        ]
      },
      {
        id: "integrity-and-secrets",
        title: "Design integrity and redaction together",
        paragraphs: [
          "Hashing every payload is not enough if sensitive values are copied into an unrestricted log. Decide which fields are stored directly, encrypted, replaced with a stable reference, or omitted. A receipt can include the hash of a secret-bearing artifact and a pointer to an access-controlled store without publishing the artifact itself.",
          "The integrity chain should make missing or reordered events detectable. That can be as simple as each event containing the previous event hash, provided canonical serialization is fixed and versioned. Signatures add actor authentication when the threat model requires it, but they do not make an unsafe payload safe to retain."
        ],
        listTitle: "Retention policy should specify",
        items: [
          "Which fields may contain personal data, credentials, or proprietary content.",
          "Who can resolve redacted references and under what authorization.",
          "How long raw artifacts, derived receipts, and integrity metadata are kept.",
          "How deletion requests interact with chained hashes and derived indexes."
        ]
      },
      {
        id: "verification",
        title: "Verify receipts outside the agent process",
        paragraphs: [
          "A receipt is weak evidence if only the producing agent can interpret it. Publish a small, deterministic verifier that checks schema versions, identifiers, hashes, ordering, and signatures without invoking the model or contacting every original tool. Separate verification turns the format into an interface rather than an internal implementation detail.",
          "Reproduction does not always mean rerunning the model and expecting identical prose. It means recovering the inputs, configuration, tool observations, and decision path required to explain the result. Where deterministic replay is possible, record the exact artifact versions and environment. Where it is not, label the boundary instead of overstating reproducibility."
        ],
        listTitle: "A rollout checklist",
        items: [
          "Define event types and ownership before adding a storage backend.",
          "Version the canonical encoding and reject ambiguous serialization.",
          "Test interrupted runs, retries, duplicate events, and partial tool responses.",
          "Run verification with no access to the agent's in-memory state.",
          "Review sample receipts for usefulness, not only schema validity."
        ]
      }
    ],
    relatedProject: {
      title: "AgentReceipt",
      href: "/work/agentreceipt",
      description:
        "See the related case study for a local-first receipt format and verification workflow."
    }
  },
  {
    slug: "how-to-test-cross-chain-bridge-workflows-locally",
    title: "How to test cross-chain bridge workflows locally",
    description:
      "A repeatable approach to testing deposits, message propagation, claims, and failure recovery across local bridge environments.",
    topic: "Developer infrastructure",
    topicDescription:
      "Local environments, integration testing, observability, and developer experience.",
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    readingMinutes: 10,
    searchQuestions: [
      "How do you test a cross-chain bridge locally?",
      "Which bridge states should integration tests assert?",
      "How do you debug a bridge transaction that never becomes claimable?"
    ],
    keyPoints: [
      "Model the bridge as an asynchronous lifecycle, not a single transaction.",
      "Pin the full network topology and expose intermediate state for inspection.",
      "Assert balances, messages, proofs, and claims at the boundaries that own them.",
      "Make failure injection a normal part of the local environment."
    ],
    sections: [
      {
        id: "define-lifecycle",
        title: "Start with the complete bridge lifecycle",
        paragraphs: [
          "A source-chain transaction is only the first step of a bridge workflow. The useful test boundary includes initiation, event observation, message or exit-root propagation, proof availability, destination-chain claim, and final balance or state change. A test that stops after the source transaction succeeds can miss the failures users actually encounter.",
          "Write the lifecycle as explicit states before choosing tooling. Names vary by protocol, but the transitions should make waiting and failure visible. This state model becomes the shared vocabulary for CLI output, integration assertions, and debugging documentation."
        ],
        listTitle: "Minimum observable states",
        items: [
          "The source transaction is accepted and the expected bridge event is emitted.",
          "The message or deposit is indexed with the correct source and destination identifiers.",
          "The destination-side proof or claim becomes available.",
          "The claim transaction is accepted exactly once.",
          "The final recipient state matches the amount and asset semantics of the bridge."
        ]
      },
      {
        id: "pin-topology",
        title: "Pin the topology, not only the contracts",
        paragraphs: [
          "A reproducible environment needs chain identifiers, genesis state, deployed addresses, service versions, RPC endpoints, block timing, and funded test accounts under one configuration. Pinning contract bytecode while allowing indexers or proof services to float still produces hard-to-explain failures.",
          "Use a single command to start the topology, but do not hide its components. Developers should be able to inspect service health, chain height, deployed addresses, bridge events, pending messages, and claims without opening container internals. Convenience and observability reinforce each other when the command surface exposes real protocol states."
        ],
        listTitle: "A deterministic fixture should control",
        items: [
          "Network and rollup identifiers used in messages and proofs.",
          "Contract deployment order, constructor arguments, and addresses.",
          "Account keys and balances reserved for local testing only.",
          "Service images, configuration files, and startup dependencies.",
          "A reset path that returns every component to the same initial state."
        ]
      },
      {
        id: "assert-boundaries",
        title: "Assert each boundary at its source of truth",
        paragraphs: [
          "Balance changes alone do not explain where a workflow failed. Assert the source receipt and event on the source chain, indexing state in the bridge service, proof readiness in the component that produces it, and the claim receipt on the destination chain. Each assertion should print the identifiers needed for the next diagnostic step.",
          "Be precise about native assets, wrapped assets, messages, and token mappings. Their terminal states can look similar while their setup and accounting differ. Parameterized tests help reuse the lifecycle without erasing those protocol-specific semantics."
        ],
        listTitle: "High-value test cases",
        items: [
          "Asset transfer and arbitrary message flows in both supported directions.",
          "Duplicate claim attempts and idempotent status queries.",
          "Insufficient balance, invalid destination, and unsupported asset failures.",
          "Service restart while a message is pending.",
          "Multiple destination chains sharing one source environment."
        ]
      },
      {
        id: "debug-timeouts",
        title: "Turn timeouts into state reports",
        paragraphs: [
          "An integration test that ends with ‘timed out after 60 seconds’ discards the evidence needed to fix it. On timeout, collect the source receipt, relevant events, service health, indexed message status, destination height, and claim state. Keep the final report bounded and structured so CI logs remain usable.",
          "Prefer condition-based waits over fixed sleeps. Poll a named state with a deadline, record the last observed value, and fail with the transition that did not occur. This makes the same test useful on a fast local machine and a slower CI runner without disguising a stalled system as a performance problem."
        ],
        listTitle: "Before trusting the suite",
        items: [
          "Run it from a clean state and after a deliberate mid-flow restart.",
          "Verify that a broken indexer or relayer fails at the expected boundary.",
          "Confirm repeated runs do not depend on addresses or nonces from earlier runs.",
          "Keep one end-to-end happy path small enough to run during normal development."
        ]
      }
    ],
    relatedProject: {
      title: "AggSandbox",
      href: "/work/aggsandbox",
      description:
        "See how a Rust CLI and Docker topology expose local, forked, and multi-L2 bridge workflows."
    }
  },
  {
    slug: "designing-contract-verification-pipelines",
    title: "Designing contract verification pipelines",
    description:
      "How to build a contract verification pipeline that preserves compiler inputs, explains mismatches, and publishes trustworthy results.",
    topic: "Blockchain systems",
    topicDescription: "Smart contracts, verification workflows, provenance, and failure analysis.",
    publishedAt: "2026-08-05",
    updatedAt: "2026-08-05",
    readingMinutes: 9,
    searchQuestions: [
      "How does smart contract source-code verification work?",
      "Why does deployed bytecode not match locally compiled bytecode?",
      "What should a contract verification service store?"
    ],
    keyPoints: [
      "Verification is a reproducible build comparison, not a source upload form.",
      "Compiler version and settings are part of the artifact identity.",
      "Normalize only fields the platform can explain and preserve the raw evidence.",
      "Return mismatch diagnostics that tell a developer what to change next."
    ],
    sections: [
      {
        id: "reproducible-build",
        title: "Treat verification as a reproducible build",
        paragraphs: [
          "A verifier answers whether supplied source and build configuration can produce the code associated with a deployed contract. The source files are only one input. Compiler version, optimization settings, target platform, linked libraries, constructor arguments, and metadata behavior can all affect the final artifact.",
          "The pipeline should therefore create an immutable verification request before compilation begins. Preserve original filenames and content hashes, normalize paths deliberately, and record the exact compiler image or binary used. If an input is inferred, label it as inferred so the result does not imply stronger provenance than the service has."
        ],
        listTitle: "Request identity should include",
        items: [
          "Chain identifier, contract address, and deployment transaction when available.",
          "All source units with stable paths and content hashes.",
          "Compiler family, exact version, target, and optimization settings.",
          "Library addresses, constructor arguments, and other link-time inputs.",
          "Verifier schema and normalization-rule versions."
        ]
      },
      {
        id: "staged-pipeline",
        title: "Separate retrieval, compilation, comparison, and publication",
        paragraphs: [
          "Keeping the stages explicit makes retries safe and diagnostics specific. Retrieval reads deployed artifacts from a pinned chain context. Compilation runs in an isolated environment with bounded resources. Comparison applies documented normalization rules. Publication stores the evidence and exposes the result through a stable status model.",
          "A queue is useful when compilation cost varies, but asynchronous processing should not make states vague. A request can be queued, compiling, comparing, verified, mismatched, invalid, or failed. Invalid input is not the same as a compiler crash, and neither is the same as a valid build that produces different bytecode."
        ],
        listTitle: "Stage outputs worth retaining",
        items: [
          "The raw deployed artifact and chain block used for retrieval.",
          "Compiler stdout, stderr, exit status, and produced artifacts.",
          "The exact comparison inputs before and after documented normalization.",
          "A machine-readable reason code and a human-readable next step.",
          "Publication identifiers for source files and verified metadata."
        ]
      },
      {
        id: "explain-mismatches",
        title: "Explain mismatches without hiding them",
        paragraphs: [
          "Bytecode can differ because of compiler settings, embedded metadata, unresolved libraries, source path changes, constructor data, or an incorrect contract target. A verifier should identify the earliest meaningful divergence and connect it to likely input causes. Returning only ‘verification failed’ pushes the entire pipeline back onto the developer.",
          "Normalization must be conservative. Strip or transform only a region whose semantics are understood for that compiler and artifact type. Preserve both raw values so a rule can be audited later. A match achieved through undocumented mutation is less trustworthy than a clear mismatch."
        ],
        listTitle: "Useful diagnostic categories",
        items: [
          "Compiler or target incompatibility before compilation starts.",
          "Missing or conflicting source units and import paths.",
          "Unresolved library placeholders or incorrect link addresses.",
          "Runtime code match with creation-code or constructor-data mismatch.",
          "Metadata-only difference under a named, versioned comparison rule."
        ]
      },
      {
        id: "operate-safely",
        title: "Operate the compiler as untrusted work",
        paragraphs: [
          "Verification services process user-supplied source and invoke complex compiler toolchains. Run compilation with CPU, memory, disk, process, and time limits; isolate it from credentials and internal networks; and validate archive paths before extraction. Cache only by complete, canonical input identity so one request cannot borrow another request's result incorrectly.",
          "Monitor the pipeline by stage and reason code rather than one success rate. Queue age, compiler failure rate by version, mismatch categories, RPC freshness, and publication latency reveal different problems. The operational model should make it possible to re-run comparison rules against preserved evidence without recompiling or changing the original result silently."
        ],
        listTitle: "Trustworthy publication requires",
        items: [
          "A permanent link between the published source and its verification request.",
          "Clear exact-match and partial-match semantics.",
          "A visible timestamp, chain context, and verifier version.",
          "An append-only correction path when verification logic changes."
        ]
      }
    ],
    relatedProject: {
      title: "Voyager Verifier",
      href: "/work/voyager-verifier",
      description: "Review the related Starknet contract-verification workflow and public evidence."
    }
  },
  {
    slug: "modeling-proposal-revisions-and-change-orders",
    title: "Modeling proposal revisions and change orders",
    description:
      "A data model for keeping scope, pricing, approvals, revisions, and post-acceptance change orders traceable.",
    topic: "Product systems",
    topicDescription:
      "Versioned documents, approval states, pricing integrity, and operational workflows.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    readingMinutes: 8,
    searchQuestions: [
      "How should proposal revisions be versioned?",
      "What is the difference between a revision and a change order?",
      "How do you preserve approval history when scope changes?"
    ],
    keyPoints: [
      "Separate the editable proposal draft from immutable issued versions.",
      "Make approvals refer to an exact version and pricing snapshot.",
      "Use change orders to extend accepted scope instead of rewriting history.",
      "Derive totals from line items and versioned rules, never copied display values."
    ],
    sections: [
      {
        id: "three-identities",
        title: "Give the proposal, version, and decision separate identities",
        paragraphs: [
          "A proposal is the long-lived commercial conversation. A proposal version is an immutable package of scope, pricing, terms, and presentation issued at one point in time. An approval is a decision about exactly one version. Keeping those identities separate prevents a later edit from changing what a client previously reviewed.",
          "The working draft may remain mutable, but issuing it creates a snapshot. Store references to versioned service descriptions, quantities, rates, discounts, taxes, assumptions, and attachments. The client-facing URL can resolve to the current issued version while the decision record retains the exact version identifier."
        ],
        listTitle: "Core records",
        items: [
          "Proposal: owner, client, lifecycle state, and current draft reference.",
          "Proposal version: immutable scope and pricing snapshot with issue metadata.",
          "Decision: approved, rejected, or revision requested against one version.",
          "Change order: post-acceptance scope delta linked to the accepted baseline.",
          "Event: actor, action, timestamp, and references for the audit timeline."
        ]
      },
      {
        id: "state-transitions",
        title: "Make revisions explicit state transitions",
        paragraphs: [
          "A request for revision should not reopen an issued version. It creates a new draft derived from that version and records the reason for change. When the new draft is issued, it receives its own version number and decision surface. Previous links may redirect for convenience, but previous decisions must still resolve to their original content.",
          "State rules should prevent contradictory operations: an unissued draft cannot be approved, an accepted version cannot be edited, and a superseded version cannot receive a new active approval. Enforce these rules in the domain layer as well as the interface so API and background operations cannot bypass them."
        ],
        listTitle: "Useful lifecycle transitions",
        items: [
          "Draft to issued when content is complete and a stable snapshot is created.",
          "Issued to accepted, declined, expired, or revision requested.",
          "Revision requested to a new draft derived from the referenced version.",
          "Accepted to active delivery while preserving the accepted baseline.",
          "Active delivery to a separately approved change order when scope changes."
        ]
      },
      {
        id: "pricing-snapshots",
        title: "Snapshot pricing inputs, then derive every total",
        paragraphs: [
          "Catalog prices can change after a proposal is issued. Copy the relevant price, quantity, unit, cost basis, discount rule, and tax treatment into the version snapshot, then calculate subtotal, margin, tax, and total from those inputs. Avoid storing a display total that can drift away from its line items.",
          "Use a decimal or minor-unit money representation and define rounding at each boundary. A total that is mathematically correct in one service can differ by a cent in another if line-level and document-level rounding are mixed. The rule belongs in the versioned pricing model, not only in presentation code."
        ],
        listTitle: "When comparing versions, show",
        items: [
          "Added, removed, and changed scope items.",
          "Quantity, rate, discount, and term changes separately.",
          "The net change and the new total using the same currency rules.",
          "Who made the change and the reason supplied for it.",
          "Whether a previous approval remains relevant or is superseded."
        ]
      },
      {
        id: "change-orders",
        title: "Treat a change order as a delta to an accepted baseline",
        paragraphs: [
          "Once delivery begins, rewriting the accepted proposal destroys the distinction between original scope and later work. A change order should reference the accepted proposal version and describe only the additions, removals, schedule effects, and price changes being requested. Approval of the change order creates a new contractual fact without altering the baseline.",
          "The operational view can calculate a current committed scope from the accepted baseline plus accepted change orders. That projection is useful for delivery and reporting, but it should remain derivable. The underlying versions and decisions are the evidence when a stakeholder asks how the current total was reached."
        ],
        listTitle: "Edge cases to test",
        items: [
          "Two revisions created from the same issued version.",
          "An approval arriving after a newer version has been issued.",
          "A price-list update while an issued proposal is awaiting a decision.",
          "Multiple change orders with overlapping scope items.",
          "Withdrawal, expiry, and re-issue without losing the original timeline."
        ]
      }
    ],
    relatedProject: {
      title: "ScopePilot",
      href: "/work/scopepilot",
      description:
        "See the related proposal, approval, revision, and change-order product case study."
    }
  }
] as const satisfies readonly WritingArticle[];

export type WritingSlug = (typeof writingArticles)[number]["slug"];

export const writingSlugs = writingArticles.map(
  (article) => article.slug
) as readonly WritingSlug[];

export function isWritingSlug(value: string): value is WritingSlug {
  return writingSlugs.some((slug) => slug === value);
}

export function getWritingArticle(slug: string) {
  return writingArticles.find((article) => article.slug === slug);
}

export function getRelatedWriting(article: WritingArticle) {
  return writingArticles.filter((candidate) => candidate.slug !== article.slug).slice(0, 3);
}
