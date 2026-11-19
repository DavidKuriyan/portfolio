import { ModelShowcaseSection } from "@/components/ModelShowcaseSection";
import { showcaseModels } from "@/lib/showcase";

export const metadata = {
  title: "AI Security Core — 3D Showcase | David Kuriyan E",
  description:
    "A crystalline sphere enclosing an illuminated neural processing structure — AI-driven security automation, visualized in 3D.",
};

export default function AISecurityCorePage() {
  const model = showcaseModels[2];
  return (
    <ModelShowcaseSection
      model={model}
      prev={{ slug: showcaseModels[1].slug, title: showcaseModels[1].title }}
    />
  );
}
