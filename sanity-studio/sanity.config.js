import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'Shirkus CMS',

  projectId: process.env.VITE_SANITY_PROJECT_ID, 
  dataset: process.env.VITE_SANITY_DATASET, 

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
