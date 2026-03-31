export type PlaceholderAsset = {
  id: string;
  title: string;
  description: string;
  type: "panel" | "video" | "logo-strip" | "chart";
  sourceUrl?: string;
};

export const placeholderAssets: Record<string, PlaceholderAsset> = {
  heroFlow: {
    id: "hero-flow",
    title: "Hero Flow Visual Placeholder",
    description:
      "Replace with a calm system-flow animation that shows raw prompt, detection, sanitization, model request, output guard, and federated learning feedback.",
    type: "panel",
  },
  productArchitecture: {
    id: "product-architecture",
    title: "Architecture Placeholder",
    description:
      "Reserved for a layered architecture visual with gateway, policy engine, sanitization, LLM connectors, audit traces, and federated pattern learning.",
    type: "panel",
  },
  liveFlowReplay: {
    id: "live-flow-replay",
    title: "Live Flow Replay Placeholder",
    description:
      "Reserved for a future product capture or embedded walkthrough showing the gateway process request stages in real time.",
    type: "video",
  },
  benchmarkStrip: {
    id: "benchmark-strip",
    title: "Benchmark Strip Placeholder",
    description:
      "Reserved for a restrained proof panel with latency, detection quality, and promoted pattern lift metrics.",
    type: "chart",
  },
  customerLogos: {
    id: "customer-logos",
    title: "Enterprise Logo Strip Placeholder",
    description:
      "Replace with approved customer, pilot, partner, or ecosystem logos once available.",
    type: "logo-strip",
  },
};
