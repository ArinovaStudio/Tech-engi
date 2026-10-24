import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  name: "tech_engi_studio",
  title: "Tech Engi Studio",
  projectId: projectId || "placeholder",
  dataset: dataset || "production",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
