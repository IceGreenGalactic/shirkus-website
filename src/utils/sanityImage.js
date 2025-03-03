import imageUrlBuilder from "@sanity/image-url";
import sanityClient from "../sanityClient";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(image) {
    if (!image) {
        console.log("Ingen bilde-asset funnet:", image);
        return null;
    }

    if (image.asset && image.asset.url) {
        return image.asset.url;
    }

 
    return builder.image(image).url();
}
