import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./src/sanity/schemaTypes";
import { editorialStructure } from "./src/sanity/structure";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  "";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  "production";

export default defineConfig({
  name: "default",
  title: "KarmaRise Editorial & Newsletter Desk",
  projectId,
  dataset,
  plugins: [structureTool({ structure: editorialStructure })],
  schema: {
    types: schemaTypes,
  },
});
