import { defineArrayMember, defineField, defineType } from "sanity";

export const storyType = defineType({
  name: "story",
  title: "Story",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured Story",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          {
            title: "Working across distance",
            value: "Working across distance",
          },
          { title: "Materials and sampling", value: "Materials and sampling" },
          {
            title: "Manufacturing and people",
            value: "Manufacturing and people",
          },
          { title: "Company progress", value: "Company progress" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "leadImage",
      title: "Lead image (optional)",
      description:
        "Upload a photograph to replace the editorial placeholder on /stories and the Story detail page.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "leadSlot",
      title: "Lead media placeholder details",
      type: "object",
      fields: [
        defineField({
          name: "kind",
          title: "Kind",
          type: "string",
          initialValue: "Photo",
          options: {
            list: ["Photo", "Video", "Photo or video"],
          },
        }),
        defineField({
          name: "ratio",
          title: "Aspect ratio label",
          type: "string",
          initialValue: "16:10 horizontal",
        }),
        defineField({
          name: "title",
          title: "Placeholder title",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "Placeholder description",
          type: "text",
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: "pairImages",
      title: "Detail pair images (up to 2, optional)",
      type: "array",
      validation: (rule) => rule.max(2),
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "pairSlots",
      title: "Detail pair placeholder details",
      type: "array",
      validation: (rule) => rule.max(2),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "paragraphs",
              title: "Paragraphs",
              type: "array",
              of: [defineArrayMember({ type: "text", rows: 4 })],
              validation: (rule) => rule.min(1),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "takeaway",
      title: "Key takeaway",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "leadImage",
    },
  },
});
