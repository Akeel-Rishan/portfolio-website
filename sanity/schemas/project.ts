import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Projects",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().max(300)
    }),
    defineField({
      name: "problem",
      title: "Problem",
      description: "What problem does this solve?",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "solution",
      title: "Solution",
      description: "How did you solve it?",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "impact",
      title: "Impact",
      description: "What was the measurable outcome?",
      type: "text",
      rows: 2
    }),
    defineField({
      name: "techStack",
      title: "Tech Stack",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" }
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url"
    }),
    defineField({
      name: "demoUrl",
      title: "Live Demo URL",
      type: "url"
    }),
    defineField({
      name: "metrics",
      title: "Key Metrics",
      description: "e.g. 94% accuracy, <2s latency, 10k docs indexed",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "value", title: "Value", type: "string" }
          ],
          preview: {
            select: { title: "label", subtitle: "value" }
          }
        }
      ]
    }),
    defineField({
      name: "architectureFlow",
      title: "Architecture Flow",
      description: "Ordered steps shown as pill nodes e.g. Next.js -> FastAPI -> Pinecone",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" }
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Project",
      description: "Show as the large featured card (only one at a time)",
      type: "boolean",
      initialValue: false
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      type: "boolean",
      initialValue: true
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
      title: "title",
      subtitle: "description",
      isFeatured: "isFeatured"
    },
    prepare({ title, subtitle, isFeatured }) {
      return {
        title: isFeatured ? `Featured: ${title}` : title,
        subtitle
      };
    }
  }
});
