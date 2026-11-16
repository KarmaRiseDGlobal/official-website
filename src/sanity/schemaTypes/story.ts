import { defineArrayMember, defineField, defineType } from "sanity";

export const storyType = defineType({
  name: "story",
  title: "Story",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial Content", default: true },
    { name: "media", title: "Photography & Media" },
    { name: "localization", title: "Translations (EN / ES)" },
    { name: "distribution", title: "Newsletter & SEO" },
  ],
  fieldsets: [
    {
      name: "placeholders",
      title:
        "Fallback placeholder options (only used when no photo is uploaded)",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Main headline of the Story.",
      type: "string",
      group: "editorial",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL path)",
      description: "Click Generate to create the URL slug from the title.",
      type: "slug",
      group: "editorial",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Editorial pillar (Category)",
      type: "string",
      group: "editorial",
      initialValue: "KarmaRise Journal",
      options: {
        list: [
          { title: "01. Heritage & Culture", value: "Heritage & Culture" },
          { title: "02. Sustainable Fashion", value: "Sustainable Fashion" },
          {
            title: "03. People & Craftsmanship",
            value: "People & Craftsmanship",
          },
          { title: "04. Art & Design", value: "Art & Design" },
          { title: "05. India Meets Europe", value: "India Meets Europe" },
          { title: "06. KarmaRise Journal", value: "KarmaRise Journal" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Excerpt / introduction",
      description:
        "Short conversational summary shown on the Stories cards, article header, and newsletter previews.",
      type: "text",
      rows: 3,
      group: "editorial",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "leadImage",
      title: "Cover / lead photograph",
      description:
        "Main photograph displayed on the /stories journal grid and at the top of the Story.",
      type: "image",
      group: ["editorial", "media"],
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
        defineField({
          name: "caption",
          title: "Editorial caption",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Story body (Rich text article editor)",
      description:
        "Write your Story naturally here. Use H2 for main section headings (they appear automatically in the sidebar table of contents), Blockquote for pull quotes, and insert inline photographs anywhere.",
      type: "array",
      group: "editorial",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal paragraph", value: "normal" },
            { title: "Section heading (H2)", value: "h2" },
            { title: "Subheading (H3)", value: "h3" },
            { title: "Pull quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet list", value: "bullet" },
            { title: "Numbered list", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong (Bold)", value: "strong" },
              { title: "Emphasis (Italic)", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL or path (e.g. /product-brief or https://...)",
                    type: "string",
                    validation: (rule) => rule.required(),
                  }),
                  defineField({
                    name: "blank",
                    title: "Open in new tab",
                    type: "boolean",
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          title: "Inline photograph",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Figure caption",
              type: "string",
            }),
            defineField({
              name: "aspectRatio",
              title: "Display frame aspect ratio",
              type: "string",
              initialValue: "16:9",
              options: {
                list: [
                  { title: "16:9 wide horizontal", value: "16:9" },
                  { title: "4:3 classic horizontal", value: "4:3" },
                  { title: "4:5 editorial portrait", value: "4:5" },
                ],
              },
            }),
          ],
        }),
        defineArrayMember({
          name: "pullQuoteBlock",
          title: "Attributed pull quote",
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Quote text",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "attribution",
              title: "Attribution (e.g. Alma & Shirish · Studio notes)",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "pullQuote",
      title: "Highlighted pull quote (optional)",
      description:
        "Featured quote highlighted after the opening section when writing with structured sections.",
      type: "object",
      group: "editorial",
      fields: [
        defineField({
          name: "text",
          title: "Quote text",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "attribution",
          title: "Attribution",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "pairImages",
      title: "Paired documentary photographs (up to 2)",
      description:
        "Two side-by-side 4:5 portrait photographs displayed near the end of the Story.",
      type: "array",
      group: ["editorial", "media"],
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
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "takeaway",
      title: "Key takeaway",
      description:
        "Closing reflection box at the end of the Story (1 to 2 sentences).",
      type: "text",
      rows: 3,
      group: "editorial",
    }),
    defineField({
      name: "location",
      title: "Story dateline / location",
      description: "Example: Madrid and Ulhasnagar, or Maharashtra, India",
      type: "string",
      group: "editorial",
      initialValue: "Spain & Maharashtra",
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
      group: "editorial",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "readingTimeMinutes",
      title: "Estimated reading time (minutes)",
      type: "number",
      group: "editorial",
      initialValue: 5,
      validation: (rule) => rule.min(1).max(30),
    }),
    defineField({
      name: "issueNumber",
      title: "Journal edition label",
      type: "string",
      group: "editorial",
      initialValue: "Edition 01",
    }),
    defineField({
      name: "featured",
      title: "Featured Cover Story",
      description:
        "Highlight this Story as the main Cover Story at the top of /stories.",
      type: "boolean",
      group: ["editorial", "distribution"],
      initialValue: false,
    }),
    defineField({
      name: "authorRef",
      title: "Author reference",
      type: "reference",
      to: [{ type: "author" }],
      group: "editorial",
    }),
    defineField({
      name: "author",
      title: "Author byline override (optional)",
      type: "object",
      group: "editorial",
      fields: [
        defineField({
          name: "name",
          title: "Name",
          type: "string",
          initialValue: "Alma & Shirish",
        }),
        defineField({
          name: "role",
          title: "Role",
          type: "string",
          initialValue: "Co-founders, KarmaRise D Global",
        }),
        defineField({
          name: "location",
          title: "Location",
          type: "string",
          initialValue: "Spain & Maharashtra",
        }),
      ],
    }),
    defineField({
      name: "categoryRef",
      title: "Category document reference (optional)",
      type: "reference",
      to: [{ type: "category" }],
      group: "editorial",
    }),
    defineField({
      name: "tags",
      title: "Topics & keywords",
      type: "array",
      group: ["editorial", "distribution"],
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "language",
      title: "Document language",
      type: "string",
      group: "localization",
      initialValue: "en",
      options: {
        list: [
          { title: "English (EN)", value: "en" },
          { title: "Spanish (ES)", value: "es" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "spanishTitle",
      title: "Spanish headline (transcreated for ES readers & newsletters)",
      description:
        "Write in natural, warm Spanish (see LANGUAGE.md) rather than literal word-for-word translation.",
      type: "string",
      group: "localization",
    }),
    defineField({
      name: "spanishSummary",
      title: "Spanish summary / excerpt (for ES newsletters)",
      type: "text",
      rows: 3,
      group: "localization",
    }),
    defineField({
      name: "translationOf",
      title: "Linked translation document (optional)",
      description:
        "Link a full Spanish Story document to its English counterpart.",
      type: "reference",
      to: [{ type: "story" }],
      group: "localization",
    }),
    defineField({
      name: "newsletterEligible",
      title: "Newsletter eligible",
      description:
        "Allow this Story to be selected when curating a Newsletter Issue.",
      type: "boolean",
      group: "distribution",
      initialValue: true,
    }),
    defineField({
      name: "seo",
      title: "Search engine metadata (SEO)",
      type: "object",
      group: "distribution",
      fields: [
        defineField({
          name: "title",
          title: "SEO title",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "SEO description",
          type: "text",
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Structured sections (optional alternative to Story body)",
      description:
        "If Story body is filled in above, Story body takes priority. You can also organize content as numbered heading + paragraph sections here.",
      type: "array",
      group: "editorial",
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
      name: "leadSlot",
      title: "Lead media placeholder details",
      type: "object",
      group: "media",
      fieldset: "placeholders",
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
      name: "pairSlots",
      title: "Detail pair placeholder details",
      type: "array",
      group: "media",
      fieldset: "placeholders",
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
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      language: "language",
      featured: "featured",
      media: "leadImage",
    },
    prepare({ title, category, language, featured, media }) {
      const langTag = (language || "en").toUpperCase();
      const star = featured ? "★ Cover · " : "";
      return {
        title: title ?? "Untitled Story",
        subtitle: `${star}[${langTag}] ${category ?? "KarmaRise Journal"}`,
        media,
      };
    },
  },
});
