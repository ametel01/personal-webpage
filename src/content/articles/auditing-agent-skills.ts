import type { WritingArticle } from "@/content/writing-shared";

export const auditingAgentSkills = {
  slug: "auditing-agent-skills-and-instruction-files",
  title: "Auditing agent skills and instruction files",
  description:
    "A repeatable way to inspect SKILL.md, AGENTS.md, referenced scripts, and local overrides for structural drift, unsafe capability combinations, and instructions an agent cannot actually execute.",
  directAnswer: {
    text: "Audit an agent skill by first resolving the instruction files that apply to a concrete target, then validating the package graph and reviewing risky capability combinations separately from writing quality. Keep scanning read-only, preserve the exact evidence behind each finding, and make repair a distinct consented action.",
    citations: [
      {
        label: "Skills Doctor rule catalog",
        href: "https://github.com/ametel01/skills-doctor/blob/main/docs/RULES.md"
      },
      {
        label: "Agent Skills specification",
        href: "https://agentskills.io/specification"
      }
    ]
  },
  topic: "AI agent systems",
  topicDescription: "Agent activity, provenance, replay, verification, and review boundaries.",
  publishedAt: "2026-08-07",
  updatedAt: "2026-08-11",
  reviewedAt: "2026-08-11",
  testedWith: [
    {
      name: "Skills Doctor",
      version: "0.6.2",
      href: "https://github.com/ametel01/skills-doctor/blob/main/package.json"
    }
  ],
  validationScope:
    "Non-interactive flags, JSON finding fields, package traversal, and consent boundaries were checked against the linked package version; no automated repair was executed.",
  readingMinutes: 12,
  searchQuestions: [
    "How do you audit an Agent Skill or SKILL.md file?",
    "What security problems can hide in coding-agent instruction files?",
    "How do you detect conflicting AGENTS.md and global skill instructions?"
  ],
  keyPoints: [
    "Audit the complete package and its resolution order, not SKILL.md in isolation.",
    "Separate deterministic structural findings from capability-based security review and from subjective writing quality.",
    "Follow every referenced file and executable edge while keeping the scan inside the intended root.",
    "Never let an audit tool silently hand execution to another agent; repair is a distinct, consented action."
  ],
  applicability: {
    useWhen: [
      "You need a repeatable pre-publish or CI review of SKILL.md, AGENTS.md, scripts, and referenced assets.",
      "You need to distinguish deterministic package defects from capability risks and editorial quality."
    ],
    avoidWhen: [
      "You only need to review ordinary application code; use the repository's code and security gates instead.",
      "You expect a score alone to prove a skill is safe or effective without reviewing its evidence and behavior."
    ]
  },
  sections: [
    {
      id: "resolve-effective-instructions",
      title: "Resolve the instructions the agent will actually see",
      paragraphs: [
        {
          text: "Repositories can contain root and nested AGENTS.md files, project skills, user-level skills, ecosystem-specific copies, and generated or cached packages. An audit that scans one familiar directory can miss the file that wins at runtime. Begin by discovering candidate roots and computing the effective instruction chain for a concrete target path.",
          citations: [
            {
              label: "Codex AGENTS.md documentation",
              href: "https://github.com/openai/codex/blob/main/docs/agents_md.md"
            },
            {
              label: "Agent Skills specification",
              href: "https://agentskills.io/specification"
            }
          ]
        },
        "Preserve provenance for every resolved instruction: absolute or workspace-relative path, scope, content digest, source ecosystem, and precedence. When two skills share a name or one local file shadows a global copy, report the relationship. Ambiguity should be visible rather than resolved with an undocumented guess."
      ],
      listTitle: "Resolution checks",
      items: [
        "Root and nested instruction files are found without crossing the requested workspace boundary.",
        "Project-local, user-level, cached, and disabled skill roots are classified separately.",
        "Duplicate names include content digests and the precedence rule that selects one copy.",
        "Symlinks are resolved and checked for escapes before content is read.",
        "The audit records which concrete file or route the effective chain applies to."
      ]
    },
    {
      id: "validate-the-package",
      title: "Validate structure and references deterministically",
      paragraphs: [
        {
          text: "Parse frontmatter instead of searching it with regular expressions. Validate required fields, trigger descriptions, supported metadata, and package naming. Then walk references from SKILL.md into scripts, templates, assets, and additional guidance, checking that every target exists and stays inside the package unless an external dependency is explicitly allowed.",
          citations: [
            {
              label: "Agent Skills package and frontmatter rules",
              href: "https://agentskills.io/specification"
            }
          ]
        },
        "A good rule emits a stable identifier, severity, exact location, evidence, explanation, and recovery. Keep repeated occurrences available, but do not let twenty copies of the same weak phrase distort the package score twenty times. Scoring and finding frequency answer different questions."
      ],
      listTitle: "High-value deterministic rules",
      items: [
        "Missing, malformed, or unsupported frontmatter fields.",
        "Broken relative references and case-sensitive path mismatches.",
        "Instruction steps that name a tool or script the package does not provide.",
        "Executable files with no invocation path or referenced scripts without execute intent.",
        "Contradictory trigger, prerequisite, output, or verification requirements."
      ]
    },
    {
      id: "model-capabilities",
      title: "Model capability combinations before judging intent",
      paragraphs: [
        {
          text: "Instruction text is executable influence. A skill that can read secrets, call the network, execute downloaded content, persist changes, or suppress approval has a larger security surface even if each sentence looks ordinary. Detect these capabilities separately, then group combinations into review incidents with the exact evidence that triggered them.",
          citations: [
            {
              label: "MITRE CWE-73: External Control of File Name or Path",
              href: "https://cwe.mitre.org/data/definitions/73.html"
            },
            {
              label: "MITRE CWE-59: Improper Link Resolution",
              href: "https://cwe.mitre.org/data/definitions/59.html"
            }
          ]
        },
        "Static analysis cannot prove malicious intent. Phrase findings as observable capability and missing control: reads credential files and sends HTTP requests without a domain allowlist, for example. That gives a reviewer something testable and avoids presenting a heuristic as a vulnerability verdict."
      ],
      listTitle: "Capabilities worth correlating",
      items: [
        "Secret or credential access with outbound network transfer.",
        "Remote download followed by shell or interpreter execution.",
        "Writes to global instruction roots or persistence locations.",
        "Approval bypass language combined with destructive or external-state actions.",
        "Prompt override language that tells the agent to ignore higher-priority instructions."
      ]
    },
    {
      id: "separate-scan-and-repair",
      title: "Separate audit, triage, and repair",
      paragraphs: [
        {
          text: "The scan should be non-destructive and deterministic enough for CI. Triage can group signals, add local usage evidence, or choose a bounded subset for repair. Repair may invoke another coding agent, but only after the user sees the target files, findings, prompt, and command that will run.",
          citations: [
            {
              label: "JSON Schema structural validation specification",
              href: "https://json-schema.org/draft/2020-12/json-schema-validation"
            }
          ]
        },
        "After repair, rerun the same scanner and compare finding identifiers. Do not accept a higher aggregate score as proof that the important issue disappeared. A repair can improve formatting while leaving the dangerous capability combination intact, or delete enough context that the skill no longer works."
      ],
      listTitle: "CI contract",
      items: [
        "Machine-readable output has a schema version and deterministic ordering.",
        "Threshold flags distinguish quality severity from security priority.",
        "Ambiguous roots fail with candidate paths instead of choosing silently.",
        "The scanner performs no network calls or agent launches unless explicitly requested.",
        "A post-repair scan proves the selected finding identifiers are resolved."
      ]
    }
  ],
  diagram: {
    title: "Instruction audit pipeline",
    description:
      "Discovery establishes effective scope before structural rules and security correlations feed a separate repair handoff.",
    source: {
      label: "Skills Doctor security specification",
      href: "https://github.com/ametel01/skills-doctor/blob/main/docs/SECURITY_SPEC.md"
    },
    steps: [
      { label: "Discover", detail: "Roots, nesting, duplicates, shadowing" },
      { label: "Resolve", detail: "Effective instruction chain" },
      { label: "Validate", detail: "Frontmatter, files, references" },
      { label: "Correlate", detail: "Capabilities and security incidents" },
      { label: "Repair", detail: "Consent-gated handoff + re-scan" }
    ]
  },
  artifacts: [
    {
      id: "failure-taxonomy",
      kind: "failure-taxonomy",
      title: "A failure taxonomy for skill audits",
      description:
        "The categories below come from implementing Skills Doctor’s deterministic scanner. They keep authoring defects, capability risks, packaging errors, and unsafe repair behavior from collapsing into one unhelpful score.",
      source: {
        label: "Skills Doctor rule catalog",
        href: "https://github.com/ametel01/skills-doctor/blob/main/docs/RULES.md"
      },
      cases: [
        {
          class: "Contract",
          trigger: "Invalid frontmatter, vague triggers, or no executable workflow",
          boundary: "SKILL.md",
          disposition: "Block distribution until the package contract is valid."
        },
        {
          class: "Reference integrity",
          trigger: "Missing file, path escape, hidden executable, or broken progressive disclosure",
          boundary: "Package tree",
          disposition: "Resolve paths inside the package and inventory every referenced asset."
        },
        {
          class: "Capability risk",
          trigger:
            "Secret access, network egress, remote execution, persistence, or approval bypass",
          boundary: "Instruction + scripts",
          disposition: "Keep raw findings; group related signals only in the human incident view."
        },
        {
          class: "Evaluation gap",
          trigger: "No realistic prompts, assertions, expected outputs, or baseline",
          boundary: "evals",
          disposition: "Warn or block according to skill complexity and declared behavior."
        },
        {
          class: "Repair regression",
          trigger: "The score improves while referenced workflows or scripts break",
          boundary: "consent-gated handoff",
          disposition: "Re-scan the same roots and run the package’s native verification gate."
        }
      ]
    }
  ],
  codeExamples: [
    {
      label: "Run a non-interactive audit suitable for CI",
      language: "shell",
      code: "npx skills-doctor@latest \\\n  --yes \\\n  --json \\\n  --fail-on warning \\\n  --fail-on-security P1 \\\n  --min-score 95 > skills-audit.json"
    },
    {
      label: "The shape of an actionable finding",
      language: "json",
      code: '{\n  "rule_id": "references/missing-file",\n  "severity": "error",\n  "file": "skills/deploy/SKILL.md",\n  "line": 38,\n  "evidence": "scripts/release.sh",\n  "message": "Referenced script does not exist",\n  "recovery": "Add the script or remove the invocation step"\n}'
    }
  ],
  decisions: [
    {
      decision: "Keep rule logic in the CLI",
      rationale:
        "The packaged Agent Skill remains a thin discovery layer and does not duplicate scanner behavior in prose.",
      tradeoff:
        "The CLI becomes the versioned dependency that every integration must install or invoke."
    },
    {
      decision: "Group security signals without hiding raw findings",
      rationale:
        "Reviewers see the meaningful capability chain and can still inspect each deterministic trigger.",
      tradeoff:
        "Incident correlation needs careful identifiers so grouping changes do not break CI baselines."
    },
    {
      decision: "Require confirmation before agent repair",
      rationale:
        "Scanning files does not imply permission to edit them or launch another process with their contents.",
      tradeoff: "Fully automated repair pipelines must add their own explicit approval policy."
    }
  ],
  failureCases: [
    {
      failure: "The scanner audits the wrong copy",
      signal:
        "A local skill shadows a global skill with the same name, or multiple roots match in CI.",
      response:
        "Report every candidate, its digest and precedence; require an explicit root when resolution remains ambiguous."
    },
    {
      failure: "A referenced script escapes the package",
      signal: "The normalized path or resolved symlink lands outside the approved skill root.",
      response:
        "Reject the reference unless the policy explicitly permits that external dependency."
    },
    {
      failure: "Repair improves the score but breaks the workflow",
      signal:
        "Selected findings disappear while required steps, tools, or output guarantees are also removed.",
      response:
        "Re-run structural tests and task-level evals; compare behavior, not only the aggregate score."
    }
  ],
  repositoryLinks: [
    {
      label: "Skills Doctor repository",
      href: "https://github.com/ametel01/skills-doctor",
      description: "TypeScript CLI for deterministic skill structure, quality, and security audits."
    },
    {
      label: "Rule catalog",
      href: "https://github.com/ametel01/skills-doctor/blob/main/docs/RULES.md",
      description: "Rule identifiers, rationale, severities, and repair guidance."
    },
    {
      label: "Security scanning specification",
      href: "https://github.com/ametel01/skills-doctor/blob/main/docs/SECURITY_SPEC.md",
      description: "Capability signals, incident correlation, and trust boundaries."
    },
    {
      label: "Agent Skills specification",
      href: "https://agentskills.io/specification",
      description:
        "The public package format and SKILL.md conventions the structural audit builds on."
    }
  ],
  relatedProject: {
    title: "Skills Doctor",
    href: "/work/skills-doctor",
    description:
      "Inspect the rule engine, security model, and repair handoff in the project case study."
  }
} as const satisfies WritingArticle;
