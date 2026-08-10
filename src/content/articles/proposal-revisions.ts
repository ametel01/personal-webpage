import type { WritingArticle } from "@/content/writing-shared";

export const proposalRevisions = {
  slug: "modeling-proposal-revisions-and-change-orders",
  title: "Modeling proposal revisions and change orders",
  description:
    "A concrete domain model for keeping scope, pricing, approvals, revisions, and post-acceptance change orders traceable without rewriting commercial history.",
  topic: "Product systems",
  topicDescription:
    "Versioned documents, approval states, pricing integrity, and operational workflows.",
  publishedAt: "2026-08-03",
  updatedAt: "2026-08-10",
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
  sections: [
    {
      id: "separate-identities",
      title: "Give the proposal, version, and decision separate identities",
      paragraphs: [
        "A proposal is the long-lived commercial conversation. A draft is editable working state. An issued version is an immutable package of scope, pricing, terms, and attachments. A decision is an actor's response to exactly one issued version. Combining these identities makes later edits change what a client appears to have reviewed.",
        "Issue a version by snapshotting normalized content and pricing references in one transaction. The client-facing URL may resolve to the current issued version for convenience, but an approval record must retain the immutable version identifier and content digest it accepted."
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
        "A revision request does not reopen an issued version. It creates a new draft derived from that version and records the requested change. Issuing that draft creates a new immutable version with its own decision surface; previous approvals still resolve to the content they covered.",
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
        "Use integer minor units or a decimal type and choose whether rounding happens per line or per document. The rule belongs in the versioned pricing model because two services can otherwise produce totals that differ by a cent while both appear mathematically reasonable."
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
        "Once delivery begins, editing the accepted proposal destroys the distinction between original scope and later work. A change order references the accepted version and describes additions, removals, schedule effects, and price changes. Its approval creates a new fact without altering the baseline.",
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
    steps: [
      { label: "Draft", detail: "Mutable scope + pricing" },
      { label: "Issue", detail: "Immutable version snapshot" },
      { label: "Decision", detail: "Accept, decline, revise, expire" },
      { label: "Baseline", detail: "Accepted delivery scope" },
      { label: "Change order", detail: "Separately approved delta" }
    ]
  },
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
      label: "Article source and schema examples",
      href: "https://github.com/ametel01/personal-webpage/blob/main/src/content/articles/proposal-revisions.ts",
      description:
        "The public article source, PostgreSQL schema, transition example, decisions, and failure cases."
    },
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
