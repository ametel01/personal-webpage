import type { WritingArticle } from "@/content/writing-shared";

export const localCrossChainTesting = {
  slug: "how-to-test-cross-chain-bridge-workflows-locally",
  title: "How to test cross-chain bridge workflows locally",
  description:
    "A repeatable method for testing deposits, message propagation, proof readiness, claims, restarts, and duplicate operations across a pinned local bridge topology.",
  topic: "Developer infrastructure",
  topicDescription:
    "Local environments, integration testing, observability, and failure injection.",
  publishedAt: "2026-08-05",
  updatedAt: "2026-08-10",
  readingMinutes: 12,
  searchQuestions: [
    "How do you test a cross-chain bridge locally?",
    "Which states should a bridge integration test assert?",
    "How do you debug a bridge transaction that never becomes claimable?"
  ],
  keyPoints: [
    "Model a bridge as an asynchronous state machine rather than one source-chain transaction.",
    "Pin chains, contracts, services, funded accounts, and timing under one topology manifest.",
    "Assert each transition at the component that owns it and print identifiers for the next diagnostic step.",
    "Replace fixed sleeps with bounded state polling and attach a state report to every timeout."
  ],
  sections: [
    {
      id: "model-the-lifecycle",
      title: "Write the complete lifecycle before the test",
      paragraphs: [
        {
          text: "A successful source-chain receipt proves only that the bridge contract accepted an operation. The useful test boundary continues through event observation, service indexing, message or exit-root propagation, proof or claim readiness, destination execution, and the final balance or application state.",
          citations: [
            {
              label: "Aggkit bridge service flow",
              href: "https://agglayer.github.io/aggkit/bridge_service.html"
            },
            {
              label: "Agglayer Unified Bridge asset flow",
              href: "https://docs.polygon.technology/interoperability/agglayer/core-concepts/unified-bridge/asset-bridging"
            }
          ]
        },
        "Name these states in the CLI and test suite. Protocols differ, but a transition model stops the environment from collapsing every pending condition into waiting. It also tells failure injection where to act: before indexing, after proof creation, during a restart, or immediately before a duplicate claim."
      ],
      listTitle: "Minimum lifecycle",
      items: [
        "Source transaction accepted and expected bridge event emitted.",
        "Deposit or message indexed with stable origin and destination identifiers.",
        "Proof, exit root, or claim material becomes available.",
        "Destination claim accepted exactly once.",
        "Recipient balance or application state matches the asset and message semantics."
      ]
    },
    {
      id: "pin-the-topology",
      title: "Pin the whole topology, not only contract bytecode",
      paragraphs: [
        {
          text: "Reproducibility requires chain IDs, genesis state, RPC endpoints, service images, bridge addresses, deployment order, funded accounts, and block timing. Pinning contracts while letting the indexer, relayer, or proof service float still creates failures that another developer cannot reproduce.",
          citations: [
            {
              label: "Agglayer integration-test topology",
              href: "https://github.com/agglayer/agglayer#running-integration-tests"
            }
          ]
        },
        {
          text: "Use one command to start the environment, but keep every component inspectable. Health, chain height, deployed addresses, recent bridge events, pending operations, and claims should be available from the normal CLI surface. A convenient wrapper that hides protocol state makes the first demo easier and every failure harder.",
          citations: [
            {
              label: "Docker Compose startup and health checks",
              href: "https://docs.docker.com/compose/how-tos/startup-order/"
            }
          ]
        }
      ],
      listTitle: "Topology manifest",
      items: [
        "Network IDs, RPC URLs, ports, block timing, and deterministic accounts.",
        "Contract artifacts, constructor inputs, deployment transactions, and addresses.",
        "Service images, configuration digests, dependency order, and health checks.",
        "Token mappings and native-versus-wrapped asset semantics.",
        "A reset command that returns every component to the same initial state."
      ]
    },
    {
      id: "assert-owned-boundaries",
      title: "Assert each boundary at its source of truth",
      paragraphs: [
        {
          text: "A final balance can be correct while the test exercised the wrong token mapping, reused a previous claim, or skipped an intermediate service. Read the source receipt and event from the source chain, indexing status from the bridge service, proof readiness from its producer, and destination execution from the destination chain.",
          citations: [
            {
              label: "Unified Bridge component reference",
              href: "https://docs.polygon.technology/interoperability/agglayer/core-concepts/unified-bridge/bridge-components"
            }
          ]
        },
        "Carry one correlation record through the test: source transaction hash, deposit or message identifier, origin and destination network IDs, token and recipient, proof identifier, and claim transaction hash. Each assertion should print the subset needed for the next command when it fails."
      ],
      listTitle: "High-value cases",
      items: [
        "Assets and arbitrary messages in every supported direction.",
        "Native assets, mapped tokens, and wrapped-token accounting.",
        "Duplicate claim attempts and idempotent status queries.",
        "Unsupported network, invalid recipient, and insufficient balance failures.",
        "Two concurrent deposits with the same asset and recipient."
      ]
    },
    {
      id: "make-failures-observable",
      title: "Turn timeouts and restarts into evidence",
      paragraphs: [
        {
          text: "A timeout that reports only elapsed seconds throws away the useful state. Poll a named transition with a deadline, store the last observation, and on failure collect source receipt, matching events, service health, indexed message status, destination height, proof readiness, and claim state in one bounded report.",
          citations: [
            {
              label: "Aggkit claim-readiness polling protocol",
              href: "https://agglayer.github.io/aggkit/bridge_service.html"
            }
          ]
        },
        "Restart services at deliberate points and verify recovery from durable state. Stop the indexer after source acceptance, restart the claim service after proof readiness, and repeat the status command throughout. Local testing is most valuable when it exercises the recovery paths that are expensive and slow to reproduce on public networks."
      ],
      listTitle: "Before trusting the suite",
      items: [
        "Run from clean state and after an intentional mid-flow restart.",
        "Break one dependency and confirm the expected transition reports the failure.",
        "Repeat the suite without inheriting nonces, addresses, or claims from the previous run.",
        "Keep one end-to-end path fast enough for ordinary development.",
        "Archive the topology manifest and timeout report in CI artifacts."
      ]
    }
  ],
  diagram: {
    title: "Bridge lifecycle under test",
    description:
      "Every arrow is asynchronous and should have its own condition, deadline, and diagnostic source.",
    steps: [
      { label: "Submit", detail: "Source transaction + bridge event" },
      { label: "Index", detail: "Deposit/message correlation" },
      { label: "Propagate", detail: "Exit root, proof, or readiness" },
      { label: "Claim", detail: "Destination transaction exactly once" },
      { label: "Assert", detail: "Final asset or application state" }
    ]
  },
  codeExamples: [
    {
      label: "Start a sandbox, bridge an asset, and inspect the claim",
      language: "shell",
      code: "aggsandbox start --detach\naggsandbox bridge asset \\\n  --network-id 0 \\\n  --destination-network-id 1 \\\n  --amount 0.1 \\\n  --token-address 0x0000000000000000000000000000000000000000\n\naggsandbox show claims --network-id 1"
    },
    {
      label: "Poll a state instead of sleeping",
      language: "typescript",
      code: 'await waitFor({\n  deadlineMs: 60_000,\n  describe: "deposit becomes claimable",\n  read: () => bridge.getDeposit(depositId),\n  accept: (deposit) => deposit.status === "claimable",\n  onTimeout: (last) => writeStateReport({ depositId, last })\n});'
    }
  ],
  decisions: [
    {
      decision: "Use one CLI over a visible Docker topology",
      rationale:
        "Developers get repeatable startup without losing access to individual chain and service state.",
      tradeoff:
        "The local environment requires Docker resources and careful port and network-ID management."
    },
    {
      decision: "Expose intermediate bridge states",
      rationale:
        "A bridge is asynchronous; debugging needs more than source success and final balance.",
      tradeoff: "The CLI surface must track protocol terminology and service-specific identifiers."
    },
    {
      decision: "Use condition-based waits",
      rationale:
        "The same tests adapt to fast laptops and slower CI while failing on the missing transition.",
      tradeoff: "Every polled state needs a bounded API and an actionable timeout report."
    }
  ],
  failureCases: [
    {
      failure: "Source transaction succeeds but no claim appears",
      signal: "The bridge event exists, while the indexing or propagation state never advances.",
      response:
        "Trace the source event identifier through service logs and status APIs before inspecting the destination chain."
    },
    {
      failure: "A fixed sleep flakes in CI",
      signal:
        "The same test alternates between passing and missing readiness with no state change in its output.",
      response:
        "Poll the named readiness condition with a deadline and include the last observed state on failure."
    },
    {
      failure: "The test passes from stale state",
      signal: "A claim or balance from the prior run satisfies the final assertion.",
      response:
        "Use deterministic reset plus per-run identifiers and assert the exact source-to-claim correlation."
    }
  ],
  repositoryLinks: [
    {
      label: "AggSandbox repository",
      href: "https://github.com/NethermindEth/aggsandbox",
      description: "Rust CLI and Docker topology for local, forked, and multi-L2 bridge workflows."
    },
    {
      label: "Architecture overview",
      href: "https://github.com/NethermindEth/aggsandbox/blob/main/docs/overview.md",
      description: "Components, modes, deployment flow, and local network topology."
    },
    {
      label: "Bridge operations guide",
      href: "https://github.com/NethermindEth/aggsandbox/blob/main/docs/bridge-operations.md",
      description: "Asset, message, claim, and diagnostic command workflows."
    }
  ],
  relatedProject: {
    title: "AggSandbox",
    href: "/work/aggsandbox",
    description: "Inspect the Rust CLI, Docker topology, and multi-L2 integration work."
  }
} as const satisfies WritingArticle;
