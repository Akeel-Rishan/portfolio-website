import { defineField, defineType } from "sanity";

export default defineType({
  name: "certification",
  title: "Certifications",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Certification Name",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({ name: "issuer", title: "Issuing Organization", type: "string" }),
    defineField({ name: "issueDate", title: "Issue Date", type: "date" }),
    defineField({ name: "credentialId", title: "Credential ID", type: "string" }),
    defineField({ name: "verifyUrl", title: "Verify URL", type: "url" }),
    defineField({
      name: "accentColor",
      title: "Accent Color (hex)",
      type: "string",
      initialValue: "#7C3AED"
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0
    })
  ],
  preview: {
    select: { title: "name", subtitle: "issuer" }
  }
});
