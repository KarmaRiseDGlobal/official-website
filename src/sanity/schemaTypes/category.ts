import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title (English)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "spanishTitle",
      title: "Title (Spanish)",
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
      name: "description",
      title: "Description (English)",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "spanishDescription",
      title: "Description (Spanish)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
        defineField({
          name: "spanishAlt",
          title: "Alt text (Spanish)",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      spanishTitle: "spanishTitle",
      media: "coverImage",
    },
    prepare({ title, spanishTitle, media }) {
      return {
        title: title ?? "Category",
        subtitle: spanishTitle,
        media,
      };
    },
  },
});
