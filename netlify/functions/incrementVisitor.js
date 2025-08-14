const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2023-01-01',
});

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Only POST method allowed',
    };
  }

  try {
    const stat = await client.fetch(`*[_type == "siteStats"][0]{_id, visitors}`);

    if (!stat) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'siteStats not found' }),
      };
    }

    await client.patch(stat._id).inc({ visitors: 1 }).commit();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Visitor counted' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    };
  }
};
