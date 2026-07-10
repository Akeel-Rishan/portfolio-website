import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "ai-portfolio",
  title: "AI Portfolio CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "missing-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Portfolio Content")
          .items([
            S.documentTypeListItem("siteConfig").title("Site Config"),
            S.divider(),
            S.documentTypeListItem("article").title("Articles"),
            S.documentTypeListItem("project").title("Projects"),
            S.documentTypeListItem("experience").title("Experience"),
            S.documentTypeListItem("skill").title("Skills"),
            S.documentTypeListItem("certification").title("Certifications")
          ])
    }),
    visionTool()
  ],
  schema: { types: schemaTypes }
});
