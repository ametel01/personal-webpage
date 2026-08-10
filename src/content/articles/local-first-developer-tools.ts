import type { WritingArticle } from "@/content/writing-shared";

export const localFirstDeveloperTools = {
  slug: "local-first-architecture-for-developer-tools",
  title: "Local-first architecture for developer tools",
  description:
    "A systems design for CLIs that keep source, prompts, credentials, and evidence on the developer's machine while still supporting reproducible automation and optional remote coordination.",
  directAnswer: {
    text: "A local-first developer tool creates its primary artifact on the user's machine in a documented, portable format and keeps core inspection usable without a hosted account. Separate immutable artifacts, rebuildable indexes, and disposable caches, then make CI or cloud synchronization an adapter rather than the authority. This boundary limits what a network outage, service shutdown, or corrupted index can take away.",
    citations: [
      {
        label: "Local-first software research",
        href: "https://www.inkandswitch.com/essay/local-first/"
      },
      {
        label: "AgentReceipt repository",
        href: "https://github.com/ametel01/agentreceipt"
      }
    ]
  },
  topic: "Local-first systems",
  topicDescription:
    "Developer tools that own local state, degrade safely, and expose portable artifacts.",
  publishedAt: "2026-08-06",
  updatedAt: "2026-08-11",
  reviewedAt: "2026-08-11",
  testedWith: [
    {
      name: "AgentReceipt",
      version: "0.10.1",
      href: "https://github.com/ametel01/agentreceipt/releases/tag/v0.10.1"
    },
    {
      name: "Skills Doctor",
      version: "0.6.2",
      href: "https://github.com/ametel01/skills-doctor/blob/main/package.json"
    },
    {
      name: "RitualAI",
      version: "0.3.2",
      href: "https://github.com/ametel01/ritualai/blob/main/package.json"
    }
  ],
  validationScope:
    "Storage boundaries and command behavior were checked against the linked project versions; the Go atomic-write example is illustrative and excludes platform-specific durability guarantees.",
  readingMinutes: 12,
  searchQuestions: [
    "What does local-first mean for a developer tool?",
    "How should a CLI store durable local state safely?",
    "How can a local-first tool integrate with CI or hosted services without becoming cloud-dependent?"
  ],
  keyPoints: [
    "Local-first is an ownership model: the useful artifact exists locally and remains usable without a service account.",
    "Separate immutable evidence, mutable indexes, and disposable caches so corruption and cleanup have bounded effects.",
    "Make remote synchronization an adapter over portable artifacts, never the only path to inspect or export them.",
    "Design locking, crash recovery, migrations, and path security before polishing the command surface."
  ],
  applicability: {
    useWhen: [
      "The tool handles source, prompts, credentials, build evidence, or other data that should remain locally owned.",
      "Core capture, inspection, verification, or export must survive offline use and hosted-service failure."
    ],
    avoidWhen: [
      "A central service is the legitimate authority for shared state, access control, or real-time collaboration.",
      "The product cannot define conflict resolution, migration, backup, and deletion semantics for local data."
    ]
  },
  sections: [
    {
      id: "define-the-local-authority",
      title: "Decide what the local machine is authoritative for",
      paragraphs: [
        {
          text: "A tool is not local-first merely because it has a CLI. If every useful command uploads source, requires a hosted account, or stores the only readable history remotely, the terminal is a thin client. A local-first developer tool creates its primary artifact on the user's machine in a documented format and keeps core inspection available offline.",
          citations: [
            {
              label: "Ink & Switch local-first software research",
              href: "https://www.inkandswitch.com/essay/local-first/"
            }
          ]
        },
        "Write down the authority split. The local machine can own session evidence, configuration, indexes, and private keys; a remote service can own organization policy, team discovery, or publication. When the two disagree, the product should have an explicit reconciliation rule instead of whichever response arrived last winning silently."
      ],
      listTitle: "A practical local-first promise",
      items: [
        "Core capture, inspection, verification, and export work without network access.",
        "Artifacts live in a documented path and portable, versioned format.",
        "Uninstalling the binary does not make existing artifacts unreadable.",
        "Remote publication is optional and visibly names what will leave the machine.",
        "The user can delete local data without an online control plane."
      ]
    },
    {
      id: "separate-state-classes",
      title: "Separate immutable artifacts, mutable indexes, and caches",
      paragraphs: [
        {
          text: "Durable evidence and rebuildable convenience data should not share the same failure mode. Store completed receipts, reports, or scan results as immutable artifacts. Keep lookup indexes and last-used pointers in a small transactional database or atomic metadata files. Put downloaded toolchains and derived renderings in a cache that can be deleted at any time.",
          citations: [
            {
              label: "SQLite transactional guarantees",
              href: "https://www.sqlite.org/transactional.html"
            },
            {
              label: "XDG Base Directory Specification",
              href: "https://specifications.freedesktop.org/basedir/"
            }
          ]
        },
        {
          text: "Content-addressed artifact names reduce accidental duplication and make integrity checks cheap. They do not replace lifecycle metadata: keep schema version, media type, size, creation context, and retention class beside each digest. For mutable state, write to a temporary file, fsync when durability matters, and rename atomically.",
          citations: [
            {
              label: "OCI Content Descriptor specification",
              href: "https://github.com/opencontainers/image-spec/blob/main/descriptor.md"
            }
          ]
        }
      ],
      listTitle: "State layout",
      items: [
        "Artifacts: immutable receipts, patches, reports, exports, and signatures.",
        "Index: session lookup, labels, current schema, and artifact references.",
        "Config: explicit user preferences with source and precedence.",
        "Secrets: operating-system keychain or restricted files, never general config JSON.",
        "Cache: downloads and derived data that a repair command can recreate."
      ]
    },
    {
      id: "design-for-concurrency-and-crashes",
      title: "Design for two terminals and a killed process",
      paragraphs: [
        "Developer tools are invoked by humans, editors, hooks, and agents at the same time. Use a per-repository or per-session lock with owner metadata and a bounded stale-lock recovery rule. Avoid a single global lock that turns unrelated repositories into one failure domain.",
        {
          text: "Assume the process can stop between every pair of writes. Build multi-step operations around a staging directory or journal, then publish one final pointer atomically. On startup, distinguish incomplete staging data from complete artifacts; offer a repair or discard action instead of treating partial files as valid history.",
          citations: [
            {
              label: "SQLite atomic commit and crash recovery",
              href: "https://www.sqlite.org/atomiccommit.html"
            }
          ]
        }
      ],
      listTitle: "Crash tests",
      items: [
        "Kill the process after artifact write but before index update.",
        "Run two sessions in the same repository and in two different repositories.",
        "Fill the disk during finalization and confirm the previous index still opens.",
        "Interrupt a schema migration and rerun it.",
        "Leave a lock behind, then test stale-owner detection without deleting a live lock."
      ]
    },
    {
      id: "add-remote-adapters",
      title: "Add remote adapters after the local contract is stable",
      paragraphs: [
        "CI, pull requests, team dashboards, and hosted policy are valuable, but each should consume the same export that a local verifier can read. The adapter uploads an explicit bundle, records the remote object identifier locally, and never mutates the signed artifact to add synchronization metadata.",
        {
          text: "Queue outbound work when offline and use idempotency keys derived from the artifact identity. Authentication failure should block publication, not local capture or inspection. This keeps service outages from turning a development tool into an availability dependency while still supporting organizational workflows.",
          citations: [
            {
              label: "Stripe idempotent request documentation",
              href: "https://docs.stripe.com/api/idempotent_requests"
            }
          ]
        }
      ],
      listTitle: "Remote boundary checks",
      items: [
        "Preview the files, fields, and redactions that will be uploaded.",
        "Use separate scopes for read, publish, and policy administration.",
        "Persist idempotency keys and remote identifiers outside signed artifacts.",
        "Retry transport failures without recollecting mutable local inputs.",
        "Keep local verification available when the remote API is down."
      ]
    }
  ],
  diagram: {
    title: "Local authority with optional remote coordination",
    description:
      "Core commands read and write local portable artifacts; adapters publish copies or policy results without owning the original record.",
    source: {
      label: "AgentReceipt repository",
      href: "https://github.com/ametel01/agentreceipt"
    },
    steps: [
      { label: "Workspace", detail: "Source + instructions + tool state" },
      { label: "Local core", detail: "Capture, scan, verify, migrate" },
      { label: "Artifacts", detail: "Immutable portable bundles" },
      { label: "Index", detail: "Mutable, rebuildable lookup" },
      { label: "Adapters", detail: "CI, PR, dashboard, policy sync" }
    ]
  },
  artifacts: [
    {
      id: "local-first-architecture",
      kind: "architecture",
      title: "A local-first artifact architecture",
      description:
        "This diagram separates authoritative bytes from rebuildable views and optional coordination. The boundary is drawn from the storage patterns shared by AgentReceipt, Skills Doctor, and RitualAI.",
      source: {
        label: "AgentReceipt repository",
        href: "https://github.com/ametel01/agentreceipt"
      },
      lanes: [
        {
          label: "Authoritative",
          responsibility: "Survives restart and remains inspectable without a service",
          nodes: ["Atomic artifact files", "Canonical manifests", "Signatures + digests"]
        },
        {
          label: "Derived",
          responsibility: "Can be deleted and rebuilt from authoritative artifacts",
          nodes: ["SQLite indexes", "Search projections", "Rendered reports"]
        },
        {
          label: "Coordination",
          responsibility: "Improves sharing without becoming the local write authority",
          nodes: ["Sync cursor", "Remote object store", "Publication API"]
        }
      ],
      flows: [
        "Write temp file → fsync → atomic rename → publish manifest reference",
        "Read artifact → validate digest → update rebuildable index",
        "Queue remote sync after local commit; retain the local result when sync fails"
      ]
    },
    {
      id: "storage-boundary-comparison",
      kind: "comparison",
      title: "Choosing the authority boundary",
      description:
        "This comparison records the tradeoffs I encountered building file-backed developer tools. The choice is not file versus database in the abstract; it is which representation a user can recover and inspect when every helper process is gone.",
      source: {
        label: "RitualAI repository",
        href: "https://github.com/ametel01/ritualai"
      },
      columns: ["Artifact files", "Embedded database", "Remote service"],
      rows: [
        {
          criterion: "Offline write path",
          values: ["Complete", "Complete", "Unavailable without a queue"]
        },
        {
          criterion: "Human inspection",
          values: ["Direct with ordinary tools", "Requires query tooling", "Requires API access"]
        },
        {
          criterion: "Query flexibility",
          values: ["Low until indexed", "High locally", "High but network-bound"]
        },
        {
          criterion: "Recovery model",
          values: [
            "Copy and verify bytes",
            "Restore or repair database",
            "Provider-specific export"
          ]
        },
        {
          criterion: "Role in this architecture",
          values: ["Authority", "Rebuildable projection", "Optional coordination"]
        }
      ]
    }
  ],
  codeExamples: [
    {
      label: "Publish a file atomically in Go",
      language: "go",
      code: 'func atomicWrite(path string, data []byte, mode fs.FileMode) error {\n\tdir := filepath.Dir(path)\n\ttmp, err := os.CreateTemp(dir, ".pending-*")\n\tif err != nil { return err }\n\tdefer os.Remove(tmp.Name())\n\tif err := tmp.Chmod(mode); err != nil { return err }\n\tif _, err := tmp.Write(data); err != nil { return err }\n\tif err := tmp.Sync(); err != nil { return err }\n\tif err := tmp.Close(); err != nil { return err }\n\treturn os.Rename(tmp.Name(), path)\n}'
    },
    {
      label: "Keep durable data and disposable cache visibly separate",
      language: "text",
      code: ".tool/\n├── artifacts/sha256/     # immutable, portable\n├── index.sqlite          # mutable, rebuildable\n├── config.json           # user-owned preferences\n├── staging/              # incomplete operations\n└── cache/                # safe to delete"
    }
  ],
  decisions: [
    {
      decision: "Make artifacts the integration boundary",
      rationale:
        "Local commands, CI, and hosted adapters can share a stable format without sharing process internals.",
      tradeoff:
        "The artifact schema becomes a public API that needs versioning and compatibility tests."
    },
    {
      decision: "Treat indexes as rebuildable",
      rationale:
        "A corrupted lookup database should not destroy the evidence or source material it points to.",
      tradeoff:
        "Rebuild commands need enough metadata in each artifact and may take longer on large histories."
    },
    {
      decision: "Keep synchronization metadata outside signed bundles",
      rationale:
        "Publishing to a second destination does not change the identity or integrity of the original artifact.",
      tradeoff:
        "Users must back up both artifacts and optional local labels or remote mappings if they need the full convenience state."
    }
  ],
  failureCases: [
    {
      failure: "A crash exposes a half-written artifact",
      signal: "The index points to a file whose digest or footer is incomplete.",
      response:
        "Write in staging, verify the digest, atomically rename, and update the index only after publication succeeds."
    },
    {
      failure: "Two processes finalize the same session",
      signal: "Competing writers produce different manifests or overwrite the current pointer.",
      response:
        "Use a session-scoped lock and immutable result names; reject the second finalization unless it is byte-identical."
    },
    {
      failure: "Remote auth failure blocks local work",
      signal:
        "Capture or inspection exits because a token is expired or the service is unavailable.",
      response:
        "Queue publication separately and keep local commands independent of remote authentication."
    }
  ],
  repositoryLinks: [
    {
      label: "AgentReceipt repository",
      href: "https://github.com/ametel01/agentreceipt",
      description: "A Go CLI that keeps session evidence and verification local by default."
    },
    {
      label: "Skills Doctor repository",
      href: "https://github.com/ametel01/skills-doctor",
      description:
        "A TypeScript CLI that discovers and audits local instruction packages before optional repair."
    },
    {
      label: "RitualAI repository",
      href: "https://github.com/ametel01/ritualai",
      description:
        "A local-first agent workflow with explicit history and document storage decisions."
    }
  ],
  relatedProject: {
    title: "AgentReceipt",
    href: "/work/agentreceipt",
    description:
      "See a local evidence sidecar that applies these storage and integration boundaries."
  }
} as const satisfies WritingArticle;
