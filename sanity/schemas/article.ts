import { defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  title: "Articles",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Article Title",
      type: "string",
      validation: (Rule) => Rule.required().min(10).max(200)
    }),
    defineField({
      name: "excerpt",
      title: "Short Excerpt",
      description: "One or two sentences shown on the card (max 200 chars)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(200)
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      description: "Upload the article cover image from Medium",
      type: "image",
      options: {
        hotspot: true,
        accept: "image/*"
      }
    }),
    defineField({
      name: "mediumUrl",
      title: "Medium Article URL",
      description: "Full URL to the original article on Medium",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] })
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "date"
    }),
    defineField({
      name: "readingTimeMinutes",
      title: "Reading Time (minutes)",
      type: "number",
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(60)
    }),
    defineField({
      name: "tags",
      title: "Tags",
      description: "e.g. LLMs, RAG, AI Agents, Python",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags"
      }
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      description: "Toggle off to hide from portfolio",
      type: "boolean",
      initialValue: true
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      description: "Lower number = shown first",
      type: "number",
      initialValue: 0
    })
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
      subtitle: "mediumUrl"
    }
  },
  orderings: [
    {
      title: "Display Order",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }]
    },
    {
      title: "Published Date, Newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }]
    }
  ]
});
