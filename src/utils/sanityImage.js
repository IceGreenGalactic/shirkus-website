import imageUrlBuilder from "@sanity/image-url";
import sanityClient from "../sanityClient";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(image) {
  if (!image) {
    return null;
  }

  return builder.image(image).fit("crop").auto("format").url();
}
