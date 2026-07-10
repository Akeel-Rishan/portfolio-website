import { defineField, defineType } from "sanity";

export default defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "startDate", title: "Start Date", type: "date" }),
    defineField({ name: "endDate", title: "End Date", type: "date" }),
    defineField({
      name: "isCurrent",
      title: "Currently Working Here",
      type: "boolean",
      initialValue: false
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "bulletPoints",
      title: "Impact Bullet Points",
      description: "Start each with an action verb and include metrics",
      type: "array",
      of: [{ type: "string" }]
    }),
    defineField({
      name: "techUsed",
      title: "Tech Used",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" }
    }),
    defineField({
      name: "companyInitials",
      title: "Company Initials",
      description: "2 letters shown in avatar circle e.g. DL",
      type: "string",
      validation: (Rule) => Rule.max(2)
    }),
    defineField({
      name: "accentColor",
      title: "Accent Color",
      description: "Hex color for the company avatar",
      type: "string",
      initialValue: "#7C3AED"
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      description: "Lower = shown first",
      type: "number",
      initialValue: 0
    })
  ],
  preview: {
    select: {
      title: "role",
      subtitle: "company"
    }
  },
  orderings: [
    {
      title: "Display Order",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }]
    }
  ]
});
