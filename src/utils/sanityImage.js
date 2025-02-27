import imageUrlBuilder from "@sanity/image-url";
import sanityClient from "../sanityClient";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(image) {
    if (!image) {
        console.log("Ingen bilde-asset funnet:", image);
        return null;
    }

    // Hvis bildet har en asset, returner URL-en direkte fra asset
    if (image.asset && image.asset.url) {
        return image.asset.url;
    }

    // Bruk builder for å generere URL hvis ingen asset URL er tilgjengelig
    return builder.image(image).url();
}
