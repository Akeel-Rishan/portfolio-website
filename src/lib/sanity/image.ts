import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

type SanityImageSource = Parameters<typeof builder.image>[0];

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Usage examples:
// urlFor(image).width(800).height(450).format("webp").url()
// urlFor(image).width(400).format("webp").quality(85).url()
