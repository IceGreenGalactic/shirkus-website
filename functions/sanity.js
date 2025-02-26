// functions/sanity.js

import { createClient } from 'sanity';

const sanityClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  useCdn: true, 
});

export async function handler(event) {
  try {
    const data = await sanityClient.fetch('*[_type == "dog"]'); // Juster spørringen etter behov
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch data' }),
    };
  }
}
