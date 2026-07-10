import { defineField, defineType } from "sanity";

export default defineType({
  name: "skill",
  title: "Skills",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Category Name",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "iconName",
      title: "Lucide Icon Name",
      description: "e.g. Brain, Code2, Cpu, Database, Zap",
      type: "string"
    }),
    defineField({
      name: "items",
      title: "Skills in this category",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" }
    }),
    defineField({
      name: "proficiency",
      title: "Proficiency %",
      type: "number",
      initialValue: 80,
      validation: (Rule) => Rule.min(0).max(100)
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0
    })
  ],
  preview: {
    select: {
      title: "category",
      subtitle: "proficiency"
    },
    prepare({ title, subtitle }) {
      return { title, subtitle: `${subtitle}% proficiency` };
    }
  }
});
