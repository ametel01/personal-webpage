import type { WritingArticle } from "@/content/writing-shared";

export const starknetContractVerification = {
  slug: "how-starknet-contract-source-verification-works",
  title: "How Starknet contract source verification works",
  description:
    "A practical explanation of how a verifier reconstructs a Cairo build, compares the resulting Starknet class, and publishes source without confusing source verification with proof verification.",
  directAnswer: {
    text: "Starknet source verification rebuilds a submitted Cairo workspace with the pinned Scarb and compiler context, locates the intended contract artifact, and compares its Sierra class hash—and, where applicable, compiled class hash—with the declared class. A match shows that the submitted source reproduces the onchain class identity. It does not verify the STARK proof that secures Starknet state transitions.",
    citations: [
      {
        label: "Starknet state and class hashes",
        href: "https://docs.starknet.io/learn/protocol/state"
      },
      {
        label: "Scarb Starknet contract artifacts",
        href: "https://docs.swmansion.com/scarb/docs/extensions/starknet/contract-target.html"
      }
    ]
  },
  topic: "Blockchain systems",
  topicDescription:
    "Starknet contracts, reproducible builds, explorer verification, and diagnostics.",
  publishedAt: "2026-08-08",
  updatedAt: "2026-08-11",
  reviewedAt: "2026-08-11",
  testedWith: [
    {
      name: "Voyager Verifier",
      version: "2.3.0",
      href: "https://github.com/NethermindEth/voyager-verifier/releases/tag/v2.3.0"
    }
  ],
  validationScope:
    "CLI flags, workspace resolution, artifact comparison, and failure stages were checked against the tagged verifier release and official Scarb/Starknet documentation.",
  readingMinutes: 13,
  searchQuestions: [
    "How does Starknet contract source verification work?",
    "Why does a Cairo contract fail verification even when the source looks correct?",
    "What are Sierra, CASM, class hash, and compiled class hash in a verifier?"
  ],
  keyPoints: [
    "Source verification is a reproducible-build comparison; it is not the STARK proof verification that secures Starknet blocks.",
    "A verifier needs the exact Scarb/Cairo context, package graph, profile, target, and source paths that produced the declared class.",
    "Modern Cairo contracts produce Sierra class artifacts, while execution uses compiled CASM committed by a compiled class hash.",
    "Good verification tools report the failed build stage or mismatch class instead of returning one generic error."
  ],
  applicability: {
    useWhen: [
      "You are building, operating, or debugging a Cairo contract source-verification workflow.",
      "A class-hash mismatch needs to be traced to workspace resolution, compiler inputs, artifacts, or comparison logic."
    ],
    avoidWhen: [
      "You are trying to validate Starknet block proofs, contract behavior, or application security.",
      "You do not have the exact manifest, lockfile, source tree, target, profile, and compiler context used for declaration."
    ]
  },
  sections: [
    {
      id: "separate-two-kinds-of-verification",
      title: "Separate source verification from proof verification",
      paragraphs: [
        "Starknet uses validity proofs to prove correct state transitions, but block-explorer source verification answers a narrower question: can the submitted Cairo workspace and build configuration reproduce the class declared on Starknet? A verified source helps humans inspect code; it does not create or validate the network's STARK proof.",
        {
          text: "The onchain identity starts with a class hash. A deployed contract address resolves to a class hash, and a class can be declared without being deployed. For Cairo 1 and later contracts, the declared Sierra class also has a compiled class hash that commits to the CASM form used for execution. The verifier must select the correct identity before it compiles anything.",
          citations: [
            {
              label: "Starknet state and compiled class hashes",
              href: "https://docs.starknet.io/learn/protocol/state"
            },
            {
              label: "Starknet JSON-RPC specification",
              href: "https://github.com/starkware-libs/starknet-specs"
            }
          ]
        }
      ],
      listTitle: "Request identity",
      items: [
        "Network and either a contract address or class hash.",
        "Contract module name and package when a workspace contains multiple candidates.",
        "Scarb manifest, lockfile, source tree, and target configuration.",
        "Cairo/Scarb versions and build profile.",
        "Verifier schema, endpoint, and comparison-rule version."
      ]
    },
    {
      id: "reconstruct-the-build",
      title: "Reconstruct the original Scarb compilation unit",
      paragraphs: [
        {
          text: "Scarb compiles a target from a main package, its dependencies, the selected profile, compiler configuration, and conditional attributes. The visible contract file is therefore not a sufficient build input. Dependency versions, lockfile state, feature flags, source paths, and settings such as Sierra ID replacement can alter the emitted artifact.",
          citations: [
            {
              label: "Scarb compilation model",
              href: "https://docs.swmansion.com/scarb/docs/reference/compilation-model.html"
            },
            {
              label: "Scarb.lock reference",
              href: "https://docs.swmansion.com/scarb/docs/reference/lockfile.html"
            }
          ]
        },
        "A verification client should resolve the workspace locally and submit an explicit file set with build metadata. A verification service should compile in an isolated, resource-bounded environment using a pinned toolchain. Inferred values must be labeled because inference makes the result easier to obtain but weaker as provenance."
      ],
      listTitle: "Inputs commonly missed",
      items: [
        "Scarb.lock or another exact dependency-resolution record.",
        "The package name when multiple workspace members define contracts.",
        "The full module path when contract module names collide.",
        "Profile-specific Cairo settings and target options.",
        "Generated or external contract sources included by the original build."
      ]
    },
    {
      id: "compare-the-artifacts",
      title: "Compare the right artifact at the right boundary",
      paragraphs: [
        {
          text: "After compilation, locate the target contract through Scarb's Starknet artifact index rather than guessing a filename. Compute the Sierra class hash from the reproduced contract class and compare it with the declared class. Where the workflow validates compilation to CASM, compute and compare the compiled class hash as a separate result.",
          citations: [
            {
              label: "Scarb Sierra and CASM target documentation",
              href: "https://docs.swmansion.com/scarb/docs/reference/targets.html"
            },
            {
              label: "Starknet class-trie specification",
              href: "https://docs.starknet.io/learn/protocol/state#the_class_trie"
            }
          ]
        },
        "Keep raw artifacts and computed hashes in the job record. If normalization is necessary for a legacy format, name and version the rule and preserve the pre-normalized bytes. A verifier that silently edits artifacts until they match produces a publication result that cannot be audited later."
      ],
      listTitle: "Useful mismatch categories",
      items: [
        "Wrong network, address, or class hash before build starts.",
        "Workspace resolution or source-collection failure.",
        "Compiler version, allowed-libfunc, or target incompatibility.",
        "Sierra class-hash mismatch after a successful build.",
        "Compiled class-hash mismatch between the reproduced CASM and declaration."
      ]
    },
    {
      id: "publish-and-operate",
      title: "Publish a result that survives operational reality",
      paragraphs: [
        {
          text: "Compilation can be slow and explorer APIs can be unavailable, so verification is naturally asynchronous. Expose queued, resolving, compiling, comparing, verified, mismatched, invalid, and failed as distinct states. A retry after a transport failure should reuse the immutable request; changing inputs creates a new request identity.",
          citations: [
            {
              label: "Voyager verifier implementation",
              href: "https://github.com/NethermindEth/voyager-verifier"
            },
            {
              label: "Voyager verifier v2.3.0 release",
              href: "https://github.com/NethermindEth/voyager-verifier/releases/tag/v2.3.0"
            }
          ]
        },
        "When a match succeeds, publish the exact source set, manifest and lockfile metadata, compiler versions, class identity, comparison result, and timestamp. Do not overwrite a historical result when the verifier changes. Append a new evaluation or correction so the explorer can explain which logic produced each status."
      ],
      listTitle: "Operational safeguards",
      items: [
        "Extract archives with path confinement and reject symlink escapes.",
        "Run compilers without credentials or unrestricted network access.",
        "Bound CPU, memory, disk, process count, and wall time.",
        "Cache only by the complete canonical request identity.",
        "Report queue age, compiler failures by version, and mismatch categories separately."
      ]
    }
  ],
  diagram: {
    title: "Starknet source-verification pipeline",
    description:
      "The service reconstructs a build and compares class identities before an explorer publishes the submitted source.",
    source: {
      label: "Voyager Verifier repository",
      href: "https://github.com/NethermindEth/voyager-verifier"
    },
    steps: [
      { label: "Resolve", detail: "Address → class hash on one network" },
      { label: "Collect", detail: "Workspace + manifest + lockfile" },
      { label: "Compile", detail: "Pinned Scarb/Cairo profile" },
      { label: "Compare", detail: "Sierra and compiled class hashes" },
      { label: "Publish", detail: "Source + build evidence + status" }
    ]
  },
  artifacts: [
    {
      id: "verification-pipeline",
      kind: "pipeline",
      title: "The verification pipeline, with a failure owner at every stage",
      description:
        "This is the operational pipeline I use to explain Voyager Verifier. Each stage produces a named artifact and fails before submission when its own invariant cannot be established.",
      source: {
        label: "Voyager Verifier repository",
        href: "https://github.com/NethermindEth/voyager-verifier"
      },
      stages: [
        {
          stage: "Resolve",
          input: "workspace root + contract name",
          assertion: "one package and one contract target",
          output: "resolved package manifest",
          failure: "ambiguous or missing target"
        },
        {
          stage: "Compile",
          input: "Scarb profile + source tree",
          assertion: "Sierra and CASM artifacts exist",
          output: "compiler artifacts + metadata",
          failure: "profile or compiler mismatch"
        },
        {
          stage: "Normalize",
          input: "local artifacts",
          assertion: "comparison ignores no semantic field",
          output: "normalized Sierra/CASM pair",
          failure: "unsupported artifact schema"
        },
        {
          stage: "Compare",
          input: "normalized local + on-chain class",
          assertion: "program and entry points match",
          output: "class-hash comparison report",
          failure: "compiled class hash differs"
        },
        {
          stage: "Submit",
          input: "source bundle + exact class hash",
          assertion: "request is idempotently identified",
          output: "Voyager verification result",
          failure: "network or explorer rejection"
        }
      ]
    }
  ],
  codeExamples: [
    {
      label: "Verify a workspace contract through Voyager",
      language: "shell",
      code: "voyager verify --network mainnet \\\n  --class-hash <CLASS_HASH> \\\n  --contract-name <CONTRACT_MODULE>\n\n# Starknet Foundry can use Voyager as its verification provider.\nsncast verify --network mainnet \\\n  --class-hash <CLASS_HASH> \\\n  --contract-name <CONTRACT_MODULE> \\\n  --verifier voyager"
    },
    {
      label: "Make Scarb emit both Sierra and CASM artifacts",
      language: "toml",
      code: "[[target.starknet-contract]]\nsierra = true\ncasm = true"
    }
  ],
  decisions: [
    {
      decision: "Resolve workspaces before submission",
      rationale:
        "The client can identify package, target, lockfile, and source-path errors close to the developer.",
      tradeoff:
        "The client must track Scarb metadata changes and still cannot prove the submitted workspace is the original one."
    },
    {
      decision: "Expose the verifier as a Rust library and a CLI",
      rationale:
        "Foundry and other tools can reuse source collection and payload logic without parsing terminal output.",
      tradeoff: "Library compatibility becomes a public contract alongside CLI behavior."
    },
    {
      decision: "Keep comparison stages explicit",
      rationale:
        "A successful compilation with the wrong class hash is a different developer problem from an invalid workspace.",
      tradeoff: "The status model and job storage are more detailed than a single verified boolean."
    }
  ],
  failureCases: [
    {
      failure: "The source compiles locally but the class hash differs",
      signal:
        "Compilation succeeds and emits the selected contract, but the reproduced Sierra class hash does not match.",
      response:
        "Compare Scarb/Cairo versions, lockfile, build profile, target settings, source paths, and contract module selection."
    },
    {
      failure: "The wrong contract is selected",
      signal: "Multiple packages or modules expose the same short contract name.",
      response:
        "Require the package and full module path, then resolve it through the Starknet artifact index."
    },
    {
      failure: "A retry publishes a different request",
      signal:
        "The service recollects mutable files or floats toolchain versions after a transport failure.",
      response:
        "Retry from the immutable request bundle; create a new request when any build input changes."
    }
  ],
  repositoryLinks: [
    {
      label: "Voyager Verifier repository",
      href: "https://github.com/NethermindEth/voyager-verifier",
      description: "Rust CLI and reusable library for Voyager Starknet class verification."
    },
    {
      label: "Voyager Verifier documentation",
      href: "https://nethermindeth.github.io/voyager-verifier/",
      description: "Current configuration, batch, status, history, and troubleshooting guides."
    },
    {
      label: "Starknet Foundry verify command",
      href: "https://foundry-rs.github.io/starknet-foundry/appendix/sncast/verify.html",
      description: "Official sncast reference for submitting verification to Voyager or Walnut."
    },
    {
      label: "Scarb Starknet contract artifacts",
      href: "https://docs.swmansion.com/scarb/docs/extensions/starknet/contract-target.html",
      description: "Official description of Sierra, CASM, and the generated artifact index."
    }
  ],
  relatedProject: {
    title: "Voyager Verifier",
    href: "/work/voyager-verifier",
    description: "Review the implementation and production integration behind this workflow."
  }
} as const satisfies WritingArticle;
