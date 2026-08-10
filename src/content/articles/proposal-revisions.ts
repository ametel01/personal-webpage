import type { WritingArticle } from "@/content/writing-shared";

export const proposalRevisions = {
  slug: "modeling-proposal-revisions-and-change-orders",
  title: "Modeling proposal revisions and change orders",
  description:
    "A concrete domain model for keeping scope, pricing, approvals, revisions, and post-acceptance change orders traceable without rewriting commercial history.",
  directAnswer: {
    text: "Model a proposal as a long-lived conversation containing immutable issued versions, and bind every approval or rejection to the exact version and content digest reviewed. After acceptance, represent scope changes as separately approved deltas rather than editing the accepted baseline. This preserves an auditable explanation of current scope, price, and decision history.",
    citations: [
      {
        label: "ScopePilot revisions and change orders",
        href: "https://scopepilot.launchingfoundry.xyz/docs/how-to-guides/handle-approvals-revisions-and-change-orders"
      },
      {
        label: "PostgreSQL transaction isolation",
        href: "https://www.postgresql.org/docs/18/transaction-iso.html"
      }
    ]
  },
  topic: "Product systems",
  topicDescription:
    "Versioned documents, approval states, pricing integrity, and operational workflows.",
  publishedAt: "2026-08-03",
  updatedAt: "2026-08-11",
  reviewedAt: "2026-08-11",
  testedWith: [
    {
      name: "PostgreSQL",
      version: "18",
      href: "https://www.postgresql.org/docs/18/index.html"
    }
  ],
  validationScope:
    "DDL, transaction boundaries, and exact-numeric guidance were checked against PostgreSQL 18 documentation; no production dataset or load benchmark is claimed.",
  readingMinutes: 11,
  searchQuestions: [
    "How should proposal revisions be versioned?",
    "What is the difference between a revision and a change order?",
    "How do you preserve approval history when scope or pricing changes?"
  ],
  keyPoints: [
    "Separate the long-lived proposal, mutable draft, immutable issued version, and decision records.",
    "Bind every approval to an exact content and pricing snapshot.",
    "Represent a change order as a delta to an accepted baseline instead of editing that baseline.",
    "Store money inputs and rounding rules, then derive totals consistently."
  ],
  applicability: {
    useWhen: [
      "A proposal, quote, or statement of work can be revised before acceptance and changed again during delivery.",
      "You need to prove which scope, price, and terms a specific actor reviewed or accepted."
    ],
    avoidWhen: [
      "The document is disposable internal drafting with no approval, pricing, or audit requirement.",
      "Your workflow cannot define who may issue, decide, expire, or supersede a version."
    ]
  },
  sections: [
    {
      id: "separate-identities",
      title: "Give the proposal, version, and decision separate identities",
      paragraphs: [
        "A proposal is the long-lived commercial conversation. A draft is editable working state. An issued version is an immutable package of scope, pricing, terms, and attachments. A decision is an actor's response to exactly one issued version. Combining these identities makes later edits change what a client appears to have reviewed.",
        {
          text: "Issue a version by snapshotting normalized content and pricing references in one transaction. The client-facing URL may resolve to the current issued version for convenience, but an approval record must retain the immutable version identifier and content digest it accepted.",
          citations: [
            {
              label: "PostgreSQL transaction isolation",
              href: "https://www.postgresql.org/docs/current/transaction-iso.html"
            },
            {
              label: "RFC 8785 JSON Canonicalization Scheme",
              href: "https://datatracker.ietf.org/doc/html/rfc8785"
            }
          ]
        }
      ],
      listTitle: "Core records",
      items: [
        "Proposal: owner, client, lifecycle state, and current draft reference.",
        "Draft: mutable scope and pricing inputs with an edit revision.",
        "Proposal version: immutable issued snapshot and content digest.",
        "Decision: accepted, declined, expired, or revision requested against one version.",
        "Event: actor, action, timestamp, and record references for the audit timeline."
      ]
    },
    {
      id: "enforce-transitions",
      title: "Make revisions explicit state transitions",
      paragraphs: [
        {
          text: "A revision request does not reopen an issued version. It creates a new draft derived from that version and records the requested change. Issuing that draft creates a new immutable version with its own decision surface; previous approvals still resolve to the content they covered.",
          citations: [
            {
              label: "W3C PROV derivation model",
              href: "https://www.w3.org/TR/prov-dm/#Derivation-Relation"
            }
          ]
        },
        "Enforce transitions in the domain layer, not only the interface. An unissued draft cannot be approved, an accepted version cannot be edited, and a superseded version cannot receive a new active approval. API routes and background jobs must go through the same transition rules."
      ],
      listTitle: "Useful transitions",
      items: [
        "Draft to issued when a stable version snapshot is created.",
        "Issued to accepted, declined, expired, or revision requested.",
        "Revision requested to a new draft derived from the referenced version.",
        "Accepted to active delivery without mutating the accepted version.",
        "Active delivery to a separately approved change order when scope changes."
      ]
    },
    {
      id: "snapshot-pricing",
      title: "Snapshot pricing inputs and derive totals",
      paragraphs: [
        "Catalog prices and tax rules can change after issue. Copy the relevant unit price, quantity, cost basis, discount rule, tax treatment, currency, and rounding policy into the version. Calculate subtotal, margin, tax, and total from that snapshot instead of storing unrelated display totals.",
        {
          text: "Use integer minor units or a decimal type and choose whether rounding happens per line or per document. The rule belongs in the versioned pricing model because two services can otherwise produce totals that differ by a cent while both appear mathematically reasonable.",
          citations: [
            {
              label: "PostgreSQL exact numeric and rounding behavior",
              href: "https://www.postgresql.org/docs/current/datatype-numeric.html"
            },
            {
              label: "PostgreSQL guidance for monetary values",
              href: "https://www.postgresql.org/docs/current/datatype-money.html"
            }
          ]
        }
      ],
      listTitle: "Version comparison should show",
      items: [
        "Added, removed, and changed scope items.",
        "Quantity, rate, discount, tax, and term changes separately.",
        "The net change and new total under the same currency rules.",
        "The actor and reason attached to the revision.",
        "Whether the earlier decision is still active or superseded."
      ]
    },
    {
      id: "model-change-orders",
      title: "Treat change orders as deltas to an accepted baseline",
      paragraphs: [
        {
          text: "Once delivery begins, editing the accepted proposal destroys the distinction between original scope and later work. A change order references the accepted version and describes additions, removals, schedule effects, and price changes. Its approval creates a new fact without altering the baseline.",
          citations: [
            {
              label: "Federal Acquisition Regulation Part 43",
              href: "https://www.acquisition.gov/far/part-43"
            },
            {
              label: "FAR 43.103 contract modification types",
              href: "https://www.acquisition.gov/far/43.103"
            }
          ]
        },
        "The operational view can project current committed scope from the accepted baseline plus accepted change orders. Keep that projection derivable. When a stakeholder asks how the current total was reached, the immutable versions, deltas, and decisions remain the evidence."
      ],
      listTitle: "Edge cases to test",
      items: [
        "Two revisions created from the same issued version.",
        "An approval arriving after a newer version was issued.",
        "A price-list update while an issued proposal awaits a decision.",
        "Multiple change orders that touch the same scope item.",
        "Withdrawal, expiry, and reissue without losing the original timeline."
      ]
    }
  ],
  diagram: {
    title: "Versioned proposal lifecycle",
    description:
      "Mutable authoring state becomes immutable when issued; later scope changes branch into a new version or change order.",
    source: {
      label: "ScopePilot workflow documentation",
      href: "https://scopepilot.launchingfoundry.xyz/docs/how-to-guides/handle-approvals-revisions-and-change-orders"
    },
    steps: [
      { label: "Draft", detail: "Mutable scope + pricing" },
      { label: "Issue", detail: "Immutable version snapshot" },
      { label: "Decision", detail: "Accept, decline, revise, expire" },
      { label: "Baseline", detail: "Accepted delivery scope" },
      { label: "Change order", detail: "Separately approved delta" }
    ]
  },
  artifacts: [
    {
      id: "proposal-state-machine",
      kind: "state-machine",
      title: "Proposal and change-order state machine",
      description:
        "This state machine separates editability from commercial effect. An issued version never becomes mutable again; revision creates a new draft, while delivery changes enter through an independently approved delta.",
      source: {
        label: "ScopePilot workflow documentation",
        href: "https://scopepilot.launchingfoundry.xyz/docs/how-to-guides/handle-approvals-revisions-and-change-orders"
      },
      states: [
        {
          name: "Draft",
          mode: "mutable",
          description: "Scope, pricing, terms, and attachments may change.",
          transitions: ["issue → Issued"]
        },
        {
          name: "Issued",
          mode: "immutable",
          description: "A digest fixes the exact decision surface.",
          transitions: [
            "accept → Accepted",
            "decline → Declined",
            "expire → Expired",
            "request revision → new Draft"
          ]
        },
        {
          name: "Accepted",
          mode: "immutable",
          description: "Becomes the baseline for delivery and later deltas.",
          transitions: ["start delivery → Active", "propose delta → Change order"]
        },
        {
          name: "Active",
          mode: "derived",
          description: "Current commitment projects the baseline plus accepted change orders.",
          transitions: ["propose delta → Change order"]
        },
        {
          name: "Change order",
          mode: "mutable",
          description: "A draft delta with its own pricing and approval surface.",
          transitions: ["issue → immutable delta", "accept → Active projection"]
        },
        {
          name: "Declined / Expired",
          mode: "terminal",
          description: "The historical decision remains attached to the issued version.",
          transitions: ["derive → new Draft"]
        }
      ]
    }
  ],
  codeExamples: [
    {
      label: "Enforce immutable issued versions in PostgreSQL",
      language: "sql",
      code: "CREATE TABLE proposal_versions (\n  id uuid PRIMARY KEY,\n  proposal_id uuid NOT NULL REFERENCES proposals(id),\n  version_number integer NOT NULL,\n  content jsonb NOT NULL,\n  content_sha256 text NOT NULL,\n  issued_at timestamptz NOT NULL,\n  UNIQUE (proposal_id, version_number)\n);\n\nCREATE TABLE proposal_decisions (\n  id uuid PRIMARY KEY,\n  version_id uuid NOT NULL REFERENCES proposal_versions(id),\n  outcome text NOT NULL CHECK (outcome IN ('accepted', 'declined', 'revision_requested')),\n  decided_at timestamptz NOT NULL\n);"
    },
    {
      label: "Guard one domain transition",
      language: "typescript",
      code: 'function requestRevision(version: IssuedVersion, reason: string): Draft {\n  if (version.status !== "issued") {\n    throw new DomainError("Only an issued version can be revised");\n  }\n  return Draft.fromVersion(version, { reason });\n}'
    }
  ],
  decisions: [
    {
      decision: "Snapshot on issue",
      rationale: "Every decision resolves to stable scope, pricing, terms, and attachments.",
      tradeoff:
        "Storage grows with each version and corrections require a new issue rather than an edit."
    },
    {
      decision: "Derive totals from versioned inputs",
      rationale: "Pricing remains internally consistent and changes can be explained line by line.",
      tradeoff:
        "Money and rounding rules must be shared by every service that renders the proposal."
    },
    {
      decision: "Keep change orders separate",
      rationale: "Original scope and later additions remain independently reviewable.",
      tradeoff:
        "Operational views must project the current commitment across several accepted records."
    }
  ],
  failureCases: [
    {
      failure: "A late approval targets an old version",
      signal: "The decision arrives after a newer version has been issued.",
      response:
        "Reject it as superseded or require explicit confirmation against the exact historical version."
    },
    {
      failure: "Catalog pricing changes during review",
      signal: "Current catalog values differ from the issued snapshot.",
      response:
        "Keep the issued total unchanged and create a new version if the new pricing should apply."
    },
    {
      failure: "Two change orders edit the same item",
      signal: "Both deltas derive from the same baseline and overlap in scope.",
      response:
        "Detect the conflict during projection and require an ordered superseding change order."
    }
  ],
  repositoryLinks: [
    {
      label: "ScopePilot live product",
      href: "https://scopepilot.launchingfoundry.xyz/",
      description: "The deployed proposal, approval, revision, and change-order product surface."
    },
    {
      label: "Workflow documentation",
      href: "https://scopepilot.launchingfoundry.xyz/docs/how-to-guides/handle-approvals-revisions-and-change-orders",
      description: "Public guide to the implemented approval, revision, and change-order workflow."
    },
    {
      label: "Proposal margin explanation",
      href: "https://scopepilot.launchingfoundry.xyz/docs/explanation/how-scopepilot-protects-proposal-margin",
      description:
        "The pricing and margin model behind the proposal workflow; the source repository is private."
    }
  ],
  relatedProject: {
    title: "ScopePilot",
    href: "/work/scopepilot",
    description: "Inspect the deployed workflow, architecture, and public product evidence."
  }
} as const satisfies WritingArticle;
