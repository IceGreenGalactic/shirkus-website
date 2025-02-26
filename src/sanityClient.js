import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: true,
  apiVersion: process.env.SANITY_API_VERSION,
});

export default sanityClient;
