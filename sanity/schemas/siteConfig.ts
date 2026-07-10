import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteConfig",
  title: "Site Config",
  type: "document",
  groups: [
    { name: "hero", title: "Hero Section" },
    { name: "about", title: "About Section" },
    { name: "contact", title: "Contact & Site" }
  ],
  fields: [
    defineField({ name: "heroName", title: "Your Full Name", type: "string", group: "hero" }),
    defineField({ name: "heroTitle", title: "Job Title", type: "string", group: "hero" }),
    defineField({ name: "heroTagline", title: "Tagline / Positioning Statement", type: "text", rows: 2, group: "hero" }),
    defineField({ name: "heroGithub", title: "GitHub URL", type: "url", group: "hero" }),
    defineField({ name: "heroLinkedin", title: "LinkedIn URL", type: "url", group: "hero" }),
    defineField({ name: "heroTwitter", title: "Twitter / X URL", type: "url", group: "hero" }),
    defineField({
      name: "heroCvUrl",
      title: "CV Download URL",
      description: "Path to PDF e.g. /cv.pdf or external link",
      type: "string",
      group: "hero"
    }),
    defineField({
      name: "heroAvailableForWork",
      title: "Available for Work",
      description: "Shows green pulsing dot on Hero section",
      type: "boolean",
      initialValue: true,
      group: "hero"
    }),
    defineField({ name: "aboutParagraph1", title: "About Paragraph 1", type: "text", rows: 4, group: "about" }),
    defineField({ name: "aboutParagraph2", title: "About Paragraph 2", type: "text", rows: 4, group: "about" }),
    defineField({ name: "aboutParagraph3", title: "About Paragraph 3", type: "text", rows: 4, group: "about" }),
    defineField({ name: "aboutYearsExp", title: "Years of Experience", type: "string", group: "about" }),
    defineField({ name: "aboutProjectsBuilt", title: "Projects Built", type: "string", group: "about" }),
    defineField({ name: "aboutModelsDeployed", title: "Models Deployed", type: "string", group: "about" }),
    defineField({ name: "contactEmail", title: "Contact Email", type: "string", group: "contact" }),
    defineField({ name: "siteUrl", title: "Site URL", type: "url", group: "contact" })
  ]
});
