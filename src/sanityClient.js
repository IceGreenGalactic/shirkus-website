import { createClient } from "@sanity/client";


const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: import.meta.env.SANITY_DATASET,
  useCdn: true,
  apiVersion: import.meta.env.SANITY_API_VERSION,
});

export default sanityClient;
