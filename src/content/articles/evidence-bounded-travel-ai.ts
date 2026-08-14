import type { WritingArticle } from "@/content/writing-shared";

const repositoryRoot = "https://github.com/ametel01/ask-siargao";
const realityCheckReference = `${repositoryRoot}/blob/main/documentation/developer/reference/reality-check-contract.md`;
const lifecycleReference = `${repositoryRoot}/blob/main/documentation/developer/explanation/on-demand-reality-check-lifecycle.md`;
const sourceGovernanceReference = `${repositoryRoot}/blob/main/documentation/developer/explanation/chat-agent-routing-and-source-governance.md`;

export const evidenceBoundedTravelAi = {
  slug: "designing-evidence-bounded-ai-travel-recommendations",
  title: "Designing evidence-bounded recommendations for an AI travel agent",
  description:
    "How to let an AI travel agent choose tools and make useful judgments while deterministic code owns evidence sufficiency, source labels, privacy, and degraded states.",
  directAnswer: {
    text: "Let the model choose tools, synthesize evidence, and write the recommendation, but require it to return a structured proposal that references completed tool calls. Deterministic code should validate the decision kind, required evidence, source freshness, claim boundaries, and public artifacts before anything reaches the traveler. When a required check fails, return a bounded needs-confirmation state instead of upgrading uncertainty into a confident answer.",
    citations: [
      {
        label: "Ask Siargao Reality Check contract",
        href: realityCheckReference
      },
      {
        label: "OpenAI function-calling guide",
        href: "https://developers.openai.com/api/docs/guides/function-calling"
      }
    ]
  },
  topic: "AI agent systems",
  topicDescription:
    "Tool-using agents, evidence contracts, source governance, and deterministic safety boundaries.",
  publishedAt: "2026-08-14",
  updatedAt: "2026-08-14",
  reviewedAt: "2026-08-14",
  testedWith: [
    {
      name: "Next.js",
      version: "16.3.0",
      href: "https://nextjs.org/docs/app"
    },
    {
      name: "OpenAI JavaScript SDK",
      version: "7.4.0",
      href: "https://github.com/openai/openai-node"
    }
  ],
  validationScope:
    "The article is checked against Ask Siargao's public runtime, contract tests, developer references, and deployed surface; it does not claim that external providers are always available or that recommendations guarantee safety or availability.",
  readingMinutes: 10,
  searchQuestions: [
    "How should an AI agent prove which tools support a recommendation?",
    "How do you stop a travel chatbot from inventing live or checked facts?",
    "What should happen when an AI recommendation is missing required evidence?"
  ],
  keyPoints: [
    "Separate model-owned judgment from server-owned evidence and artifact identity.",
    "Define evidence requirements by decision kind instead of treating every tool result as equivalent.",
    "Preserve partial success while preventing failed providers from supporting checked claims.",
    "Persist sanitized traveler-visible artifacts, not raw provider payloads or private tool arguments."
  ],
  applicability: {
    useWhen: [
      "An agent recommends actions from current, external, or location-sensitive evidence.",
      "You need model flexibility without allowing generated source labels or unsupported confidence."
    ],
    avoidWhen: [
      "The task is deterministic and a normal rules engine can produce the complete result.",
      "You cannot define what evidence is required, stale, unavailable, or safe to expose."
    ]
  },
  sections: [
    {
      id: "separate-judgment-from-proof",
      title: "Separate model judgment from server-owned proof",
      paragraphs: [
        {
          text: "A tool-using model should decide which evidence it needs and explain the final recommendation in natural language. It should not create public source objects or declare its own tool calls trustworthy; its structured proposal should reference completed call IDs that the server can independently verify.",
          citations: [
            {
              label: "Ask Siargao agent routing and source governance",
              href: sourceGovernanceReference
            },
            {
              label: "OpenAI function-calling guide",
              href: "https://developers.openai.com/api/docs/guides/function-calling"
            }
          ]
        },
        "The server can then derive source labels, decision IDs, and displayable artifacts from the audited tool transcript. This preserves the model's ability to synthesize a useful answer while giving deterministic code the final say over which evidence can appear publicly."
      ],
      listTitle: "Ownership boundary",
      items: [
        "Model: understand the request and choose typed tools.",
        "Model: synthesize checked evidence and write the recommendation.",
        "Server: validate tool completion, source sufficiency, and claim boundaries.",
        "Server: derive public sources, IDs, and allowlisted artifacts."
      ]
    },
    {
      id: "encode-evidence-by-decision-kind",
      title: "Encode evidence requirements by decision kind",
      paragraphs: [
        {
          text: "A named accommodation, a surf session, and a disrupted itinerary do not need the same evidence. Ask Siargao requires place-identity evidence for named properties, current condition evidence for immediate plans, and both marine or tide evidence and a condition judgment for surf recommendations.",
          citations: [
            {
              label: "Ask Siargao Reality Check contract",
              href: realityCheckReference
            },
            {
              label: "Google Places API policies",
              href: "https://developers.google.com/maps/documentation/places/web-service/policies"
            }
          ]
        },
        "The validator should know whether a source can support a decisive result, whether it is current enough for the request, and whether a dependent check ran after its prerequisite. Merely counting tool calls makes a busy transcript look like proof even when the required fact is missing."
      ],
      listTitle: "Evidence contract checks",
      items: [
        "The proposed decision kind matches the server-recognized request kind.",
        "Every referenced tool call completed and was used by the final answer.",
        "At least one verifying source supports a decisive keep, change, or avoid result.",
        "Decision-specific current evidence and semantic ordering requirements are satisfied."
      ]
    },
    {
      id: "degrade-without-inventing",
      title: "Degrade without turning a provider failure into confidence",
      paragraphs: [
        {
          text: "External evidence is partial by nature. Weather may succeed while a place lookup fails, or current marine evidence may exist without enough detail for a surf-safety claim. Preserve successful evidence, mark the result partial when it still supports the action, and use needs confirmation when the missing check blocks a decisive call.",
          citations: [
            {
              label: "Ask Siargao on-demand Reality Check lifecycle",
              href: lifecycleReference
            },
            {
              label: "Open-Meteo weather API documentation",
              href: "https://open-meteo.com/en/docs"
            }
          ]
        },
        "A failure source can explain a limitation but cannot verify a positive claim. The response should give the traveler one practical next step—call ahead, confirm locally, or keep the plan flexible—without promising background monitoring or a later intervention."
      ],
      listTitle: "Useful degraded states",
      items: [
        "Checked: sufficient verifying evidence and no terminal required gap.",
        "Partial: usable verifying evidence plus a relevant failed or unavailable check.",
        "Unavailable: no verifying evidence supports the requested decision.",
        "Needs confirmation: the product names the missing fact and a bounded next action."
      ]
    },
    {
      id: "persist-public-artifacts-not-transcripts",
      title: "Persist public artifacts instead of private tool transcripts",
      paragraphs: [
        {
          text: "The durable product record should contain traveler-visible messages, sanitized source summaries, and explicitly selected cards, itineraries, or decision summaries. Exact browser coordinates, raw provider payloads, private tool arguments, and internal caveats should stay outside authenticated history and public share surfaces.",
          citations: [
            {
              label: "Ask Siargao routes and surfaces reference",
              href: `${repositoryRoot}/blob/main/documentation/developer/reference/routes-and-surfaces.md`
            }
          ]
        },
        "Artifact selection needs the same evidence boundary as prose. An unrelated recommendation card or an artifact produced by a failed provider should not become public merely because the model knows its identifier. Build an allowlist from successful, used tool results before persisting or sharing anything."
      ],
      listTitle: "Persistence boundary",
      items: [
        "Store traveler-visible message content and sanitized public sources.",
        "Store only artifacts selected from successful, used evidence calls.",
        "Derive ownership from the authenticated session rather than request-body user IDs.",
        "Exclude exact coordinates, raw tool arguments, and provider response bodies."
      ]
    }
  ],
  diagram: {
    title: "Evidence-bounded recommendation lifecycle",
    description:
      "The model proposes a judgment from governed tools, then server validation converts only supported evidence and artifacts into a public answer.",
    source: {
      label: "Ask Siargao on-demand Reality Check lifecycle",
      href: lifecycleReference
    },
    steps: [
      { label: "Request", detail: "Recognize the decision kind and missing context" },
      { label: "Evidence", detail: "Model selects governed tools" },
      { label: "Proposal", detail: "Structured judgment references completed calls" },
      { label: "Validation", detail: "Server checks sources, claims, and artifacts" },
      { label: "Answer", detail: "Return a checked, partial, or bounded result" }
    ]
  },
  artifacts: [
    {
      id: "reality-check-state-machine",
      kind: "state-machine",
      title: "Reality Check evidence state machine",
      description:
        "This state machine keeps an explicit traveler request separate from evidence collection, server validation, public completion, and bounded degradation when a required source is unavailable.",
      source: {
        label: "Ask Siargao Reality Check contract",
        href: realityCheckReference
      },
      states: [
        {
          name: "Requested",
          mode: "mutable",
          description: "The decision kind and essential traveler context are being resolved.",
          transitions: ["complete context → Collecting", "missing context → Requested"]
        },
        {
          name: "Collecting",
          mode: "mutable",
          description: "The agent selects governed tools and records completed evidence calls.",
          transitions: ["propose result → Validating", "provider gap → Validating"]
        },
        {
          name: "Validating",
          mode: "derived",
          description: "The server checks kind, source sufficiency, claim limits, and artifacts.",
          transitions: [
            "sufficient → Checked",
            "mixed evidence → Partial",
            "required gap → Needs confirmation"
          ]
        },
        {
          name: "Checked",
          mode: "immutable",
          description: "A decisive result is backed by the required verifying evidence.",
          transitions: ["return public summary → Completed"]
        },
        {
          name: "Partial / Needs confirmation",
          mode: "derived",
          description: "The answer preserves usable evidence and exposes the blocking limitation.",
          transitions: ["return bounded summary → Completed"]
        },
        {
          name: "Completed",
          mode: "terminal",
          description: "The sanitized answer and selected public artifacts have been returned.",
          transitions: []
        }
      ]
    }
  ],
  codeExamples: [
    {
      label: "Validate a model-proposed Reality Check before publishing it",
      language: "typescript",
      code: "const proposal = parseRealityCheck(modelOutput);\nconst evidence = resolveCompletedCalls(proposal.evidenceToolCallIds);\n\nconst result = validateRealityCheckProposal({ proposal, evidence, recognizedKind });\nif (!result.valid) {\n  return buildNeedsConfirmationSummary(result.reason, evidence);\n}\n\nreturn buildPublicDecisionSummary(result.value, evidence);"
    }
  ],
  decisions: [
    {
      decision: "Let the model choose tools",
      rationale:
        "Natural-language requests do not map cleanly to one fixed provider or evidence path.",
      tradeoff: "The runtime needs strict typed tools, bounded turns, and audited call references."
    },
    {
      decision: "Derive public sources on the server",
      rationale:
        "Source identity and success state must come from executed provider results, not generated prose.",
      tradeoff: "Every new provider or source label requires validation and persistence updates."
    },
    {
      decision: "Keep Reality Checks synchronous and on demand",
      rationale:
        "One request contains the trigger, evidence time, cost, result, and failure state.",
      tradeoff:
        "The product does not promise monitoring, proactive alerts, booking, or operator intervention."
    }
  ],
  failureCases: [
    {
      failure: "The model references a tool call that did not complete",
      signal: "The proposed evidence ID has no matching successful call and result pair.",
      response:
        "Reject the proposal and return a bounded result from the evidence that actually completed."
    },
    {
      failure: "A current surf recommendation lacks marine or tide evidence",
      signal: "The answer proposes a decisive surf verdict from place or memory context alone.",
      response: "Fail the evidence contract and state which current condition must be confirmed."
    },
    {
      failure: "A failed provider artifact is selected for display",
      signal:
        "The final payload names a card or itinerary produced by an unsuccessful or unused call.",
      response: "Drop or reject the artifact through the server-built allowlist before persistence."
    }
  ],
  repositoryLinks: [
    {
      label: "Ask Siargao source repository",
      href: repositoryRoot,
      description:
        "The public Next.js application, agent runtime, data layer, tests, and operational documentation."
    },
    {
      label: "Reality Check contract",
      href: realityCheckReference,
      description:
        "The decision kinds, verdicts, structured payload, validation reasons, and public source states."
    },
    {
      label: "Agent routing and source governance",
      href: sourceGovernanceReference,
      description:
        "The ownership boundary between model tool choice and deterministic privacy and source controls."
    }
  ],
  relatedProject: {
    title: "Ask Siargao",
    href: "/work/ask-siargao",
    description:
      "Inspect the live product, runtime architecture, evidence boundaries, and public source."
  }
} as const satisfies WritingArticle;
