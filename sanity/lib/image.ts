import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "placeholder",
  dataset: dataset || "production",
});

type SanityImageSource = Parameters<ReturnType<typeof createImageUrlBuilder>["image"]>[0];

export const urlForImage = (source: SanityImageSource | null | undefined) => {
  if (!source || (typeof source === "object" && !("asset" in source) && !("_ref" in source))) {
    return undefined;
  }
  return imageBuilder?.image(source).auto("format").fit("max");
};
