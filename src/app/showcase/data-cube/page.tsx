import { ModelShowcaseSection } from "@/components/ModelShowcaseSection";
import { showcaseModels } from "@/lib/showcase";

export const metadata = {
  title: "Encrypted Data Cube — 3D Showcase | David Kuriyan E",
  description:
    "A floating crystal-glass cube with independent internal layers and a cyan energy core — defence-in-depth and encrypted data, visualized.",
};

export default function DataCubePage() {
  const model = showcaseModels[1];
  return (
    <ModelShowcaseSection
      model={model}
      prev={{ slug: showcaseModels[0].slug, title: showcaseModels[0].title }}
      next={{ slug: showcaseModels[2].slug, title: showcaseModels[2].title }}
    />
  );
}
