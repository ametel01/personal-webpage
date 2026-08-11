import type { SimpleIcon } from "simple-icons";
import {
  siAstro,
  siBun,
  siCloudflareworkers,
  siDocker,
  siLinux,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siRedis,
  siRust,
  siSolidity,
  siTypescript
} from "simple-icons";

type LogoVisual = {
  kind: "logo";
  icon: SimpleIcon;
};

type MonogramVisual = {
  kind: "monogram";
  color: string;
  letters: string;
};

type AssetVisual = {
  kind: "asset";
  src: string;
  width?: number;
  height?: number;
  displayWidth?: string;
  displayHeight?: string;
};

type TechVisual = AssetVisual | LogoVisual | MonogramVisual;

const logoVisuals = {
  Astro: siAstro,
  Bun: siBun,
  "Cloudflare Workers": siCloudflareworkers,
  Docker: siDocker,
  Linux: siLinux,
  "Next.js": siNextdotjs,
  "Node.js": siNodedotjs,
  PostgreSQL: siPostgresql,
  Python: siPython,
  React: siReact,
  Redis: siRedis,
  Rust: siRust,
  Solidity: siSolidity,
  TypeScript: siTypescript
} satisfies Record<string, SimpleIcon>;

const assetVisuals = {
  AggLayer: {
    src: "/icons/agglayer.svg"
  },
  Apibara: {
    src: "/icons/apibara.jpg"
  },
  Aztec: {
    src: "/icons/aztec.svg"
  },
  "Aztec experiments": {
    src: "/icons/aztec.svg"
  },
  "AWS Console": {
    src: "/icons/aws.png"
  },
  Cairo: {
    src: "/icons/cairo.png"
  },
  CloudWatch: {
    src: "/icons/cloudwatch.png"
  },
  Ethereum: {
    src: "/icons/ethereum-evm.png"
  },
  EVM: {
    src: "/icons/ethereum-evm.png"
  },
  Go: {
    src: "/icons/go.png",
    width: 96,
    height: 40,
    displayWidth: "28px",
    displayHeight: "12px"
  },
  LayerZero: {
    src: "/icons/layerzero.png"
  },
  Scarb: {
    src: "/icons/scarb.svg"
  },
  Starknet: {
    src: "/icons/starknet.svg"
  }
} satisfies Record<string, Omit<AssetVisual, "kind">>;

const monogramVisuals = {
  "Agent Skills": { letters: "SK", color: "#0f766e" },
  "Agent workflows": { letters: "AW", color: "#0ea5e9" },
  "AI tooling": { letters: "AI", color: "#0ea5e9" },
  "AI Tooling": { letters: "AI", color: "#0ea5e9" },
  "AI Workflows": { letters: "AW", color: "#0369a1" },
  "AI-assisted engineering workflows": { letters: "AI", color: "#0ea5e9" },
  "AI-assisted workflows": { letters: "AI", color: "#0ea5e9" },
  APIs: { letters: "API", color: "#2563eb" },
  "CLI tools": { letters: "CLI", color: "#334155" },
  CLI: { letters: "CLI", color: "#334155" },
  "Cross-chain infrastructure": { letters: "XC", color: "#0284c7" },
  DeFi: { letters: "DF", color: "#059669" },
  Deployment: { letters: "DEP", color: "#475569" },
  "Developer Infrastructure": { letters: "DI", color: "#1d4ed8" },
  "Developer Productivity": { letters: "DX", color: "#0f766e" },
  Ed25519: { letters: "ED", color: "#4338ca" },
  "Engineering automation": { letters: "EA", color: "#64748b" },
  "Event-driven systems": { letters: "EV", color: "#0891b2" },
  "Human-in-the-loop systems": { letters: "HI", color: "#7c2d12" },
  Hyperlane: { letters: "HL", color: "#f97316" },
  "Local-first": { letters: "LF", color: "#475569" },
  Observability: { letters: "OBS", color: "#9333ea" },
  "Product workflows": { letters: "PW", color: "#0f766e" },
  Provenance: { letters: "PV", color: "#4338ca" },
  "REST APIs": { letters: "API", color: "#2563eb" },
  Replay: { letters: "RP", color: "#0369a1" },
  "Smart contracts": { letters: "SM", color: "#5b21b6" },
  "Static Analysis": { letters: "SA", color: "#475569" },
  Validation: { letters: "VAL", color: "#16a34a" },
  "ZK systems": { letters: "ZK", color: "#0f172a" }
} satisfies Record<string, Omit<MonogramVisual, "kind">>;

export function getTechVisual(name: string): TechVisual | undefined {
  const asset = assetVisuals[name as keyof typeof assetVisuals];

  if (asset) {
    return {
      kind: "asset",
      ...asset
    };
  }

  const logo = logoVisuals[name as keyof typeof logoVisuals];

  if (logo) {
    return {
      kind: "logo",
      icon: logo
    };
  }

  const monogram = monogramVisuals[name as keyof typeof monogramVisuals];

  if (monogram) {
    return {
      kind: "monogram",
      ...monogram
    };
  }

  return undefined;
}
