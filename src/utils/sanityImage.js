import imageUrlBuilder from "@sanity/image-url";
import sanityClient from "../sanityClient";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(image, overrideImage) {
  const img = overrideImage || image;
  if (!img) {
    return null;
  }

  return builder.image(img).fit("crop").auto("format").url();
}

export function videoUrlFor(video) {
  if (!video) return null;

  if (typeof video === "string") return video;

  if (Array.isArray(video)) {
    const first = video[0];
    return first?.url || first?.asset?.url || null;
  }

  return video?.url || video?.asset?.url || null;
}
