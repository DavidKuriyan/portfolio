import { ModelShowcaseSection } from "@/components/ModelShowcaseSection";
import { showcaseModels } from "@/lib/showcase";

export const metadata = {
  title: "Global Network Sphere — 3D Showcase | David Kuriyan E",
  description:
    "A transparent 3D globe of interconnected cyan network nodes with a protective shield at its core — global cybersecurity, visualized in real time.",
};

export default function NetworkSpherePage() {
  const model = showcaseModels[0];
  return (
    <ModelShowcaseSection
      model={model}
      next={{ slug: showcaseModels[1].slug, title: showcaseModels[1].title }}
    />
  );
}
