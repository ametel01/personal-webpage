import type { WritingArticle } from "@/content/writing-shared";

export const replayableAgentEvidence = {
  slug: "designing-replayable-evidence-for-coding-agents",
  title: "Designing replayable evidence for coding agents",
  description:
    "How to turn an agent session into a deterministic evidence graph that another reviewer or agent can navigate without replaying every token or trusting a transcript.",
  topic: "AI agent systems",
  topicDescription: "Agent activity, provenance, replay, verification, and review boundaries.",
  publishedAt: "2026-08-09",
  updatedAt: "2026-08-10",
  readingMinutes: 12,
  searchQuestions: [
    "What does replay mean for a nondeterministic coding agent?",
    "How should agent evidence be packaged for another reviewer?",
    "How do you make an AI coding session resumable without copying the full transcript?"
  ],
  keyPoints: [
    "Replay should reconstruct the decision path and artifact state, not promise identical model prose.",
    "Use content-addressed artifacts and stable event references so the replay contract stays compact.",
    "Separate the complete evidence graph from a ranked focus queue for the next reviewer.",
    "Label nondeterministic and unavailable boundaries instead of filling them with invented certainty."
  ],
  sections: [
    {
      id: "define-replay",
      title: "Define replay as evidence reconstruction",
      paragraphs: [
        {
          text: "Coding agents are nondeterministic and their surrounding tools change. Asking a model to emit the same tokens twice is rarely the useful goal. A replay should instead recover the starting repository state, the instructions in force, the material actions, the observations returned by tools, the resulting patch, and the validation that followed.",
          citations: [
            {
              label: "OpenAI Codex agent loop",
              href: "https://openai.com/index/unrolling-the-codex-agent-loop/"
            },
            {
              label: "AgentReceipt replay contract",
              href: "https://github.com/ametel01/agentreceipt/blob/main/docs/REPLAY_SPECS.md"
            }
          ]
        },
        "That definition gives replay a testable boundary. A consumer can answer why a file changed, which command produced an artifact, whether a retry replaced an earlier attempt, and which checks covered the final patch. When an input cannot be recovered, the replay says unavailable rather than silently omitting it."
      ],
      listTitle: "Replayable does not mean",
      items: [
        "The model will generate identical text from the same prompt.",
        "Every shell command can safely be executed again.",
        "External APIs still expose the same state.",
        "A passing historical check proves the current checkout passes.",
        "A complete record is automatically a concise review surface."
      ]
    },
    {
      id: "build-an-artifact-graph",
      title: "Build an artifact graph, not a transcript archive",
      paragraphs: [
        {
          text: "Store events as small typed nodes and place large outputs, patches, snapshots, and reports in a content-addressed artifact store. Events refer to artifacts by digest and media type. This keeps the event stream inspectable while making deduplication, redaction, and integrity verification straightforward.",
          citations: [
            {
              label: "OCI Content Descriptor specification",
              href: "https://github.com/opencontainers/image-spec/blob/main/descriptor.md"
            },
            {
              label: "in-toto Statement v1",
              href: "https://in-toto.io/Statement/v1"
            }
          ]
        },
        "Relationships matter more than timestamps. A command event should point to the instruction or task it served, its output artifact, the files observed afterward, and any validation event that consumed the result. Timestamps help humans orient themselves, but parent and dependency edges explain causality without relying on clock precision."
      ],
      listTitle: "Graph invariants",
      items: [
        "Every referenced artifact exists and matches its recorded digest.",
        "Every event belongs to exactly one session and has a stable sequence number.",
        "Parent references never point forward or across unrelated sessions.",
        "Redacted artifacts retain a digest, reason, and access classification.",
        "Schema migrations preserve the meaning of older evidence instead of rewriting it in place."
      ]
    },
    {
      id: "derive-review-surfaces",
      title: "Derive replay and focus views from the same evidence",
      paragraphs: [
        "A complete replay can contain hundreds of events. A coding agent taking over the work needs a smaller answer: what changed, what remains risky, which checks failed or did not run, and which files deserve inspection first. Derive that focus queue from the evidence graph rather than asking a model to summarize its own performance from memory.",
        {
          text: "Keep derivation deterministic. Rank tasks from explicit signals such as changed-file risk, failed gates, missing instruction coverage, patch-verification mismatches, and unresolved user decisions. Each task should link back to the events and artifacts that justified it so a reviewer can challenge the ranking.",
          citations: [
            {
              label: "AgentReceipt replay and focus specification",
              href: "https://github.com/ametel01/agentreceipt/blob/main/docs/REPLAY_SPECS.md"
            }
          ]
        }
      ],
      listTitle: "A useful focus item contains",
      items: [
        "A stable identifier and machine-readable reason code.",
        "The affected files or repository region.",
        "Priority derived from named evidence, not a free-form confidence score.",
        "References to the patch, check, instruction, or event that created the task.",
        "A completion condition another agent can verify."
      ]
    },
    {
      id: "test-the-contract",
      title: "Test the replay contract under partial evidence",
      paragraphs: [
        "Happy-path snapshots prove very little. Test interrupted sessions, duplicate events, missing artifacts, truncated provider logs, clock skew, post-session workspace changes, and schema versions the current reader no longer emits. A replay reader should remain useful when optional evidence disappears and uncompromising when integrity evidence fails.",
        {
          text: "Use golden fixtures for canonical JSON and property tests for ordering, hash linking, and path confinement. Then test the consumer with no access to the recorder process. If replay needs hidden in-memory state or the original provider account, it is an internal debug feature rather than a portable evidence contract.",
          citations: [
            {
              label: "JSON Schema Draft 2020-12",
              href: "https://json-schema.org/draft/2020-12"
            },
            {
              label: "fast-check property-testing framework",
              href: "https://github.com/dubzzz/fast-check"
            }
          ]
        }
      ],
      listTitle: "Acceptance tests",
      items: [
        "The same receipt produces byte-identical replay JSON across repeated reads.",
        "Removing one artifact yields a precise missing-artifact error.",
        "Reordering two events fails chain verification.",
        "A redacted provider payload still leaves git and gate evidence navigable.",
        "An older schema either migrates deterministically or fails with a supported-version message."
      ]
    }
  ],
  diagram: {
    title: "One evidence graph, two review surfaces",
    description:
      "The immutable receipt remains complete; replay and focus are deterministic projections for different consumers.",
    steps: [
      { label: "Events", detail: "Typed, hash-linked observations" },
      { label: "Artifacts", detail: "Patches, logs, snapshots, gates" },
      { label: "Receipt", detail: "Signed graph manifest" },
      { label: "Replay", detail: "Chronology + evidence references" },
      { label: "Focus", detail: "Ranked, verifiable next actions" }
    ]
  },
  artifacts: [
    {
      id: "replay-fixture",
      kind: "download",
      title: "Download a deliberately incomplete replay fixture",
      description:
        "This synthetic fixture stays valid while declaring one evidence gap. It is small enough for a parser test and realistic enough to exercise ordering, artifact references, risk normalization, and verifier-task generation.",
      source: {
        label: "AgentReceipt replay JSON specification",
        href: "https://github.com/ametel01/agentreceipt/blob/main/docs/REPLAY_SPECS.md"
      },
      href: "/fixtures/agentreceipt-replay-v1.json",
      filename: "agentreceipt-replay-v1.json",
      mediaType: "application/json · 4.2 KB",
      preview: `{
  "schema_version": 1,
  "kind": "agentreceipt.session_replay",
  "verification": { "valid": true },
  "summary": { "changed_file_count": 1, "final_risk": "medium" },
  "gaps": [{ "code": "provider_trace_unavailable" }],
  "verifier_tasks": [{ "code": "confirm_tests_for_code_changes" }]
}`,
      checks: [
        "Parse and reject unknown schema versions before consuming nested fields.",
        "Preserve timeline sequence and stable evidence references during transformation.",
        "Treat gaps as data: this fixture is usable even without a provider trace.",
        "Resolve artifact paths relative to a receipt root, never the current process directory."
      ]
    }
  ],
  codeExamples: [
    {
      label: "A compact replay contract",
      language: "json",
      code: '{\n  "schema_version": "replay/v1",\n  "session_id": "01J...",\n  "baseline": { "commit": "8b7f...", "dirty": true },\n  "events": [{ "sequence": 1, "ref": "events/0001.json" }],\n  "artifacts": [{ "sha256": "c14a...", "media_type": "text/x-diff" }],\n  "coverage": { "git": "complete", "provider": "partial" },\n  "unavailable": ["provider.raw_prompt"]\n}'
    },
    {
      label: "Ask for the next review tasks without loading the full session",
      language: "shell",
      code: "agentreceipt focus --session <id> --json | jq '.tasks[] | {priority, reason, files}'\nagentreceipt replay --session <id> --event 42 --json"
    }
  ],
  decisions: [
    {
      decision: "Define replay as reconstruction, not re-execution",
      rationale:
        "It remains meaningful across nondeterministic models and changing external services.",
      tradeoff:
        "The word replay needs explicit documentation because some users expect commands to run again."
    },
    {
      decision: "Keep evidence complete and views derived",
      rationale:
        "Different consumers can obtain a timeline, a focus queue, or a report without creating competing sources of truth.",
      tradeoff: "Readers must understand schema versions for both the receipt and each projection."
    },
    {
      decision: "Make missing evidence first-class",
      rationale:
        "Availability and capture confidence are facts that downstream automation needs to reason about.",
      tradeoff:
        "Consumers cannot treat every field as present and must implement explicit degraded paths."
    }
  ],
  failureCases: [
    {
      failure: "Replay becomes a transcript dump",
      signal: "Reviewers must read thousands of tokens before finding the patch or failed gate.",
      response:
        "Keep the complete graph but derive an indexed chronology and evidence-backed focus queue."
    },
    {
      failure: "Artifact references escape the receipt",
      signal:
        "A relative path resolves through a symlink or parent segment to an arbitrary local file.",
      response:
        "Resolve inside a fixed receipt root, reject traversal and symlink escapes, then verify the digest."
    },
    {
      failure: "A schema upgrade rewrites history",
      signal: "Opening an old receipt mutates its signed bytes or replaces unknown fields.",
      response:
        "Leave the receipt immutable and emit a separately versioned derived view or migration artifact."
    }
  ],
  repositoryLinks: [
    {
      label: "AgentReceipt replay specification",
      href: "https://github.com/ametel01/agentreceipt/blob/main/docs/REPLAY_SPECS.md",
      description: "The replay, focus, reviewability, and unavailable-evidence contracts."
    },
    {
      label: "AgentReceipt source",
      href: "https://github.com/ametel01/agentreceipt",
      description: "Go implementation of session capture and deterministic replay surfaces."
    },
    {
      label: "GitHub PR workflow design",
      href: "https://github.com/ametel01/agentreceipt/blob/main/docs/GITHUB_PR_WORKFLOW_DESIGN.md",
      description:
        "How local receipts can connect to pull-request review without becoming the policy authority."
    }
  ],
  relatedProject: {
    title: "AgentReceipt",
    href: "/work/agentreceipt",
    description: "See how replay and focus outputs sit on top of a local signed receipt."
  }
} as const satisfies WritingArticle;
