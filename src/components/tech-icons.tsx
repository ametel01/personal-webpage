import Image from "next/image";
import type { CSSProperties } from "react";
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
  "AI-assisted engineering workflows": { letters: "AI", color: "#0ea5e9" },
  "AI-assisted workflows": { letters: "AI", color: "#0ea5e9" },
  APIs: { letters: "API", color: "#2563eb" },
  "CLI tools": { letters: "CLI", color: "#334155" },
  "Cross-chain infrastructure": { letters: "XC", color: "#0284c7" },
  DeFi: { letters: "DF", color: "#059669" },
  Deployment: { letters: "DEP", color: "#475569" },
  "Engineering automation": { letters: "EA", color: "#64748b" },
  "Event-driven systems": { letters: "EV", color: "#0891b2" },
  "Human-in-the-loop systems": { letters: "HI", color: "#7c2d12" },
  Hyperlane: { letters: "HL", color: "#f97316" },
  Observability: { letters: "OBS", color: "#9333ea" },
  "Product workflows": { letters: "PW", color: "#0f766e" },
  "REST APIs": { letters: "API", color: "#2563eb" },
  "Smart contracts": { letters: "SM", color: "#5b21b6" },
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

export function TechIcon({ name }: { name: string }) {
  const visual = getTechVisual(name);

  if (!visual) {
    return null;
  }

  if (visual.kind === "logo") {
    return (
      <span
        aria-hidden="true"
        className="tech-icon"
        style={{ "--tech-color": `#${visual.icon.hex}` } as CSSProperties}
      >
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
          <path d={visual.icon.path} fill="currentColor" />
        </svg>
      </span>
    );
  }

  if (visual.kind === "asset") {
    return (
      <span aria-hidden="true" className="tech-icon tech-icon-asset">
        <Image alt="" height={24} src={visual.src} unoptimized width={24} />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="tech-icon tech-icon-monogram"
      style={{ "--tech-color": visual.color } as CSSProperties}
    >
      {visual.letters}
    </span>
  );
}
