import { defineArrayMember, defineField, defineType } from "sanity";

function buildSectionMember(isSpanish: boolean) {
  return defineArrayMember({
    type: "object",
    fields: [
      defineField({
        name: "heading",
        title: isSpanish ? "Heading (Spanish)" : "Heading",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "paragraphs",
        title: isSpanish ? "Paragraphs (Spanish)" : "Paragraphs",
        type: "array",
        of: [defineArrayMember({ type: "text", rows: 4 })],
        validation: (rule) => rule.min(1),
      }),
      defineField({
        name: "images",
        title: isSpanish
          ? "Section photographs (Spanish, optional)"
          : "Section photographs (optional)",
        description:
          "Optional documentary photographs displayed below this section.",
        type: "array",
        of: [
          defineArrayMember({
            type: "image",
            options: { hotspot: true },
            fields: [
              defineField({
                name: "alt",
                title: isSpanish ? "Alt text (Spanish)" : "Alt text",
                type: "string",
              }),
              defineField({
                name: "caption",
                title: isSpanish ? "Caption (Spanish)" : "Caption",
                description:
                  "Deprecated: KarmaRise never renders visible explanatory captions beneath images.",
                type: "string",
                hidden: true,
              }),
              defineField({
                name: "aspectRatio",
                title: "Display frame aspect ratio",
                type: "string",
                initialValue: "4:5",
                options: {
                  list: [
                    { title: "4:5 editorial portrait", value: "4:5" },
                    { title: "4:3 classic horizontal", value: "4:3" },
                    { title: "16:9 wide horizontal", value: "16:9" },
                  ],
                },
              }),
              defineField({
                name: "objectPosition",
                title: "CSS focal crop override (optional)",
                type: "string",
                hidden: true,
              }),
            ],
          }),
        ],
      }),
    ],
    preview: {
      select: {
        title: "heading",
        paragraphs: "paragraphs",
      },
      prepare({ title, paragraphs }) {
        const count = Array.isArray(paragraphs) ? paragraphs.length : 0;
        return {
          title: title || "Untitled section",
          subtitle: `${count} paragraph${count === 1 ? "" : "s"}`,
        };
      },
    },
  });
}

function buildPortableBodyMembers() {
  return [
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
          title: "Figure caption (deprecated)",
          description:
            "Deprecated: KarmaRise never renders visible explanatory captions beneath images.",
          type: "string",
          hidden: true,
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
        defineField({
          name: "objectPosition",
          title: "CSS focal crop override (optional)",
          type: "string",
          hidden: true,
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
  ];
}

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
      initialValue: "Inside KarmaRise",
      options: {
        list: [
          { title: "Heritage & Culture", value: "Heritage & Culture" },
          { title: "Sustainable Fashion", value: "Sustainable Fashion" },
          {
            title: "People & Craftsmanship",
            value: "People & Craftsmanship",
          },
          { title: "Art & Design", value: "Art & Design" },
          { title: "India Meets Europe", value: "India Meets Europe" },
          { title: "Inside KarmaRise", value: "Inside KarmaRise" },
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
        "Main photograph displayed on the /stories grid and at the top of the Story.",
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
          name: "spanishAlt",
          title: "Alt text (Spanish)",
          type: "string",
        }),
        defineField({
          name: "caption",
          title: "Editorial caption (deprecated)",
          description:
            "Deprecated: KarmaRise never renders visible explanatory captions beneath images.",
          type: "string",
          hidden: true,
        }),
        defineField({
          name: "spanishCaption",
          title: "Editorial caption (Spanish, deprecated)",
          description:
            "Deprecated: KarmaRise never renders visible explanatory captions beneath images.",
          type: "string",
          hidden: true,
        }),
        defineField({
          name: "objectPosition",
          title: "CSS focal crop override (optional)",
          type: "string",
          hidden: true,
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Story body (Rich text article editor)",
      description:
        "Write your Story naturally here. Use H2 for main section headings (they appear as sticky chapter headings in the left column), Blockquote for pull quotes, and insert inline photographs anywhere.",
      type: "array",
      group: "editorial",
      of: buildPortableBodyMembers(),
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
              name: "spanishAlt",
              title: "Alt text (Spanish)",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption (deprecated)",
              description:
                "Deprecated: KarmaRise never renders visible explanatory captions beneath images.",
              type: "string",
              hidden: true,
            }),
            defineField({
              name: "spanishCaption",
              title: "Caption (Spanish, deprecated)",
              description:
                "Deprecated: KarmaRise never renders visible explanatory captions beneath images.",
              type: "string",
              hidden: true,
            }),
            defineField({
              name: "objectPosition",
              title: "CSS focal crop override (optional)",
              type: "string",
              hidden: true,
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "takeaway",
      title: "Key takeaway (optional)",
      description:
        "Optional closing reflection at the end of the Story (1 to 2 sentences). Leave empty if the closing paragraph already lands.",
      type: "text",
      rows: 3,
      group: "editorial",
    }),
    defineField({
      name: "location",
      title: "Story dateline / location",
      description: "Example: India & Spain, or Across India",
      type: "string",
      group: "editorial",
      initialValue: "India & Spain",
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
      title: "Stories edition label",
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
          name: "spanishRole",
          title: "Role (Spanish)",
          type: "string",
        }),
        defineField({
          name: "location",
          title: "Location",
          type: "string",
          initialValue: "India & Spain",
        }),
        defineField({
          name: "spanishLocation",
          title: "Location (Spanish)",
          type: "string",
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
      name: "spanishLocation",
      title: "Spanish dateline / location",
      description: "Example: India y España, or España e India",
      type: "string",
      group: "localization",
    }),
    defineField({
      name: "spanishTags",
      title: "Spanish topics & keywords",
      type: "array",
      group: "localization",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "spanishPullQuote",
      title: "Spanish highlighted pull quote (optional)",
      description: "Spanish pull quote highlighted after the opening section.",
      type: "object",
      group: "localization",
      fields: [
        defineField({
          name: "text",
          title: "Quote text (Spanish)",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "attribution",
          title: "Attribution (Spanish)",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "spanishBody",
      title: "Spanish Story body (Rich text article editor)",
      description:
        "Rich text Spanish article body with H2/H3 headings, links, lists, pull quotes, and inline photographs in Peninsular Spanish (see LANGUAGE.md).",
      type: "array",
      group: "localization",
      of: buildPortableBodyMembers(),
    }),
    defineField({
      name: "spanishSections",
      title: "Spanish structured sections",
      description:
        "Spanish sections rendered on the website when ES is selected. Write in natural Peninsular Spanish (see LANGUAGE.md).",
      type: "array",
      group: "localization",
      of: [buildSectionMember(true)],
    }),
    defineField({
      name: "spanishTakeaway",
      title: "Spanish key takeaway (optional)",
      description:
        "Closing reflection box in Spanish (1 to 2 sentences). Leave empty if the closing paragraph already lands.",
      type: "text",
      rows: 3,
      group: "localization",
    }),
    defineField({
      name: "newsletterEligible",
      title: "Newsletter eligible",
      description:
        "Allow this Story to be selected when assembling a Newsletter Issue.",
      type: "boolean",
      group: "distribution",
      initialValue: true,
    }),
    defineField({
      name: "seo",
      title: "Search engine metadata (SEO)",
      type: "object",
      group: ["distribution", "localization"],
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
        defineField({
          name: "spanishTitle",
          title: "SEO title (Spanish)",
          type: "string",
        }),
        defineField({
          name: "spanishDescription",
          title: "SEO description (Spanish)",
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
      of: [buildSectionMember(false)],
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
        subtitle: `${star}[${langTag}] ${category ?? "Inside KarmaRise"}`,
        media,
      };
    },
  },
});
