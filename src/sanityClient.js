import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: "i3vkr3bg",
  dataset: "production",
  useCdn: true, // Sett til false hvis du vil ha ferske data (bruker mer kapasitet)
  apiVersion: "2024-02-25",
});

export default sanityClient;
