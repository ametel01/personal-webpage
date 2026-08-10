import type { WritingArticle } from "@/content/writing-shared";

export const recordAndVerifyAgentActivity = {
  slug: "how-to-record-and-verify-ai-coding-agent-activity",
  title: "How to record and verify AI coding-agent activity",
  description:
    "A concrete, local-first workflow for capturing agent actions, binding them to repository state, signing the result, and verifying the final patch independently.",
  topic: "AI agent systems",
  topicDescription: "Agent activity, provenance, replay, verification, and review boundaries.",
  publishedAt: "2026-08-10",
  updatedAt: "2026-08-10",
  readingMinutes: 11,
  searchQuestions: [
    "How do you record what an AI coding agent changed?",
    "What belongs in a verifiable coding-agent receipt?",
    "How can a reviewer verify an agent session without trusting the agent?"
  ],
  keyPoints: [
    "Capture the repository baseline before the agent starts, not after the work is complete.",
    "Treat commands, filesystem observations, provider events, and quality gates as typed evidence with different confidence levels.",
    "Bind the receipt to the final patch and sign the canonical manifest rather than a rendered report.",
    "Run verification in a separate process that needs neither the original model nor its in-memory state."
  ],
  sections: [
    {
      id: "define-the-evidence-boundary",
      title: "Define the evidence boundary before recording",
      paragraphs: [
        "A useful recording starts with a precise claim: this agent session began from a known repository state, observed a bounded set of actions, and ended with a particular patch and set of checks. It does not claim that every model thought was captured or that the agent caused every byte written while the recorder was running.",
        "Take the baseline before launching the agent. Record the repository root, current commit, worktree status, active instruction files, tool versions, and recorder policy. Existing dirty files must be named explicitly so a later verifier can distinguish prior user work from session activity."
      ],
      listTitle: "Minimum start record",
      items: [
        "Repository identity, merge base, HEAD commit, branch, and initial git status.",
        "Hashes and paths for AGENTS.md, CLAUDE.md, installed skills, and relevant tool configuration.",
        "Recorder version, schema version, clock source, platform, and capture policy.",
        "A session identifier generated outside the model transcript.",
        "Explicit exclusions such as raw prompts, secret-bearing output, or unrelated filesystem roots."
      ]
    },
    {
      id: "capture-typed-events",
      title: "Capture typed events, not one giant transcript",
      paragraphs: [
        "A transcript is presentation. Evidence needs stable event types and relationships. Commands, tool calls, file observations, git transitions, approvals, and quality checks should each have their own payload and source. A provider event can explain intent, while git and filesystem observations establish what changed; neither should silently stand in for the other.",
        "Append events and chain their hashes so removal or reordering becomes detectable. Canonicalize the payload before hashing, keep timestamps as supporting context rather than the ordering authority, and assign a monotonic sequence within the session. The recorder should survive missing provider logs by degrading confidence instead of refusing to finalize."
      ],
      listTitle: "Useful event distinctions",
      items: [
        "Proposed tool arguments versus the normalized arguments actually sent.",
        "Command start, command exit, and the captured stdout or artifact reference.",
        "Filesystem observation versus a git diff that proves the final tracked change.",
        "Automated policy decision versus explicit human approval.",
        "A check that ran and failed versus a check that never ran."
      ]
    },
    {
      id: "finalize-a-receipt",
      title: "Finalize a receipt around the artifact graph",
      paragraphs: [
        "At stop time, derive the final patch against the declared baseline, inventory untracked files, capture the terminal git state, and attach quality-gate results. Large or sensitive artifacts should live beside the receipt under content-addressed names; the manifest stores their hashes, media types, sizes, and redaction status.",
        "Sign the canonical manifest after every reference is fixed. Signing a human-readable HTML or Markdown report is brittle because formatting changes alter the bytes without changing the evidence. A stable JSON encoding or another versioned canonical form gives independent implementations something deterministic to verify."
      ],
      listTitle: "Receipt contents worth keeping separate",
      items: [
        "Session manifest and hash-chain head.",
        "Patch, untracked-file inventory, and start/end repository snapshots.",
        "Instruction manifest and provider-capture confidence.",
        "Quality-gate commands, exit codes, and bounded output references.",
        "Signature, public-key identifier, and canonicalization version."
      ]
    },
    {
      id: "verify-independently",
      title: "Verify the receipt from a clean process",
      paragraphs: [
        "Verification should work without invoking the model. Recompute every artifact hash, walk the event chain, verify the signature, and compare the recorded final patch with the current worktree or a checked-out commit. The verifier must report which layer failed: schema, integrity, signature, baseline, patch, or quality evidence.",
        "A green receipt means the evidence is internally consistent and matches the inspected repository state. It does not mean the code is correct, the agent followed every instruction, or the tests were sufficient. Those remain review questions; the receipt makes them answerable from a stable record."
      ],
      listTitle: "Verification should fail closed when",
      items: [
        "An artifact is missing, has a different digest, or resolves outside the receipt root.",
        "The event sequence has a duplicate, gap, or incorrect previous-event hash.",
        "The signing key is unknown, revoked for the claimed time, or the signature is invalid.",
        "The current patch differs from the patch bound into the receipt.",
        "A required gate is absent even if all recorded gates passed."
      ]
    }
  ],
  diagram: {
    title: "Capture and verification boundary",
    description:
      "The recorder observes the session and creates immutable evidence; the verifier consumes only the receipt and repository state.",
    steps: [
      { label: "Baseline", detail: "Git state + instructions" },
      { label: "Observe", detail: "Commands + files + provider events" },
      { label: "Finalize", detail: "Patch + gates + artifact hashes" },
      { label: "Sign", detail: "Canonical receipt manifest" },
      { label: "Verify", detail: "Independent integrity and diff checks" }
    ]
  },
  codeExamples: [
    {
      label: "Capture one session and verify its final patch",
      language: "shell",
      code: "agentreceipt start --watch\n# work with the coding agent in the same repository\nagentreceipt stop\n\nagentreceipt replay --session <id> --json > replay.json\nagentreceipt verify diff --session <id> --against merge-base --json"
    },
    {
      label: "A minimal hash-linked event envelope",
      language: "json",
      code: '{\n  "session_id": "01J...",\n  "sequence": 42,\n  "type": "command.finished",\n  "source": "shell-observer",\n  "payload_sha256": "a842...",\n  "previous_event_sha256": "7d11...",\n  "captured_at": "2026-08-10T09:42:17Z"\n}'
    }
  ],
  decisions: [
    {
      decision: "Run as a sidecar",
      rationale:
        "The recorder can observe different coding agents without becoming their launcher or proxy.",
      tradeoff:
        "Provider-specific intent capture is best-effort and may be less complete than filesystem evidence."
    },
    {
      decision: "Keep raw prompts out of exports by default",
      rationale:
        "Most verification questions can be answered from hashes, actions, patches, and gates without retaining sensitive conversation data.",
      tradeoff:
        "A reviewer may know which instruction artifact was active without seeing every natural-language exchange."
    },
    {
      decision: "Sign the manifest, not the report",
      rationale:
        "Canonical machine data is stable across renderers and can be verified by a small standalone tool.",
      tradeoff:
        "Human reports must preserve links back to signed fields instead of being treated as the evidence itself."
    }
  ],
  failureCases: [
    {
      failure: "The repository was already dirty",
      signal: "Start status contains modified or untracked paths.",
      response:
        "Record them as baseline state and exclude them from causal claims unless the session later changes them."
    },
    {
      failure: "Provider logs cannot be matched",
      signal: "No provider session has sufficient repository or time correlation.",
      response:
        "Finalize from git and filesystem evidence, mark provider coverage unavailable, and lower confidence explicitly."
    },
    {
      failure: "The patch changes after stop",
      signal: "Current diff digest differs from the receipt's final patch digest.",
      response:
        "Fail diff verification and report the added, removed, or modified paths rather than rewriting the receipt."
    }
  ],
  repositoryLinks: [
    {
      label: "AgentReceipt repository",
      href: "https://github.com/ametel01/agentreceipt",
      description: "The Go CLI, receipt format, capture pipeline, and verifier implementation."
    },
    {
      label: "Replay contract specification",
      href: "https://github.com/ametel01/agentreceipt/blob/main/docs/REPLAY_SPECS.md",
      description: "Machine-readable replay, focus, and reviewability contracts."
    },
    {
      label: "AgentReceipt v0.10.1",
      href: "https://github.com/ametel01/agentreceipt/releases/tag/v0.10.1",
      description: "Tagged release and platform artifacts used by the documented workflow."
    }
  ],
  relatedProject: {
    title: "AgentReceipt",
    href: "/work/agentreceipt",
    description: "Inspect the implementation decisions behind the local evidence sidecar."
  }
} as const satisfies WritingArticle;
