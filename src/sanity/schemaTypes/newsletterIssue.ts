import { defineArrayMember, defineField, defineType } from "sanity";

export const newsletterIssueType = defineType({
  name: "newsletterIssue",
  title: "Newsletter Issue",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial & Curation", default: true },
    { name: "english", title: "English Edition (EN)" },
    { name: "spanish", title: "Spanish Edition (ES)" },
    { name: "delivery", title: "Brevo Delivery & Analytics" },
  ],
  fields: [
    defineField({
      name: "internalName",
      title: "Internal campaign name",
      description: "Example: Issue #01 · Three states for one leather bag",
      type: "string",
      group: "editorial",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "issueNumber",
      title: "Issue number",
      description: "Example: Issue #01",
      type: "string",
      group: "editorial",
      initialValue: "Issue #01",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "track",
      title: "Recipient list scope",
      description:
        "Default sends to the unified KarmaRise Stories (EN) and Historias de KarmaRise (ES) lists. Optional topic lists remain available for future targeted sends.",
      type: "string",
      group: ["editorial", "delivery"],
      initialValue: "all",
      options: {
        list: [
          {
            title: "Unified KarmaRise Stories (EN / ES)",
            value: "all",
          },
          {
            title: "Manufacturing only (optional future split)",
            value: "manufacturing",
          },
          {
            title: "AlmaRise D Brand & Culture only (optional future split)",
            value: "almarise",
          },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "format",
      title: "Email layout format",
      description:
        "Use Personal letter for the single-narrator human format, or Story digest for multi-card recaps.",
      type: "string",
      group: "editorial",
      initialValue: "letter",
      options: {
        list: [
          { title: "Personal letter (1 narrator, 1 photo)", value: "letter" },
          { title: "Story digest (multiple Story cards)", value: "digest" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "narrator",
      title: "Narrator / sender voice",
      description:
        "One founder narrates each personal letter in first person, including the signature.",
      type: "string",
      group: ["editorial", "delivery"],
      initialValue: "alma",
      options: {
        list: [
          { title: "Alma", value: "alma" },
          { title: "Shirish", value: "shirish" },
          { title: "Alma & Shirish (joint)", value: "both" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "status",
      title: "Editorial & campaign status",
      description:
        "Changing status to Approved allows the Sanity webhook to create or update campaign drafts in Brevo.",
      type: "string",
      group: ["editorial", "delivery"],
      initialValue: "draft",
      options: {
        list: [
          { title: "Draft (in progress)", value: "draft" },
          { title: "Ready for review", value: "review" },
          { title: "Approved (sync drafts to Brevo)", value: "approved" },
          {
            title: "Synced to Brevo (drafts created)",
            value: "synced_to_brevo",
          },
          { title: "Scheduled in Brevo", value: "scheduled" },
          { title: "Sent", value: "sent" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "campaignDate",
      title: "Target campaign date",
      type: "datetime",
      group: "editorial",
    }),
    defineField({
      name: "targetAudience",
      title: "Target language edition",
      type: "string",
      group: ["editorial", "delivery"],
      initialValue: "both",
      options: {
        list: [
          {
            title: "English + Spanish subscribers (both editions)",
            value: "both",
          },
          { title: "English subscribers only (EN)", value: "en" },
          { title: "Spanish subscribers only (ES)", value: "es" },
        ],
      },
    }),
    defineField({
      name: "heroImage",
      title: "Issue photograph (at most one candid photo)",
      type: "image",
      group: "editorial",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text (English)",
          type: "string",
        }),
        defineField({
          name: "spanishAlt",
          title: "Alt text (Spanish)",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "heroImageCaptionEn",
      title: "Photo caption (English, deprecated)",
      description:
        "Deprecated: KarmaRise never renders visible explanatory captions beneath images.",
      type: "string",
      group: "english",
      hidden: true,
    }),
    defineField({
      name: "heroImageCaptionEs",
      title: "Photo caption (Spanish, deprecated)",
      description:
        "Deprecated: KarmaRise never renders visible explanatory captions beneath images.",
      type: "string",
      group: "spanish",
      hidden: true,
    }),
    defineField({
      name: "selectedStories",
      title: "Linked Stories (optional in letter mode; 2 to 4 in digest mode)",
      description:
        "Link the matching website Story so the email can invite readers to explore the full piece.",
      type: "array",
      group: "editorial",
      validation: (rule) => rule.max(6),
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "story" }],
        }),
      ],
    }),
    defineField({
      name: "titleEn",
      title: "Newsletter heading (English)",
      type: "string",
      group: "english",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subjectEn",
      title: "Email subject line (English, under 50 characters)",
      type: "string",
      group: "english",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "previewTextEn",
      title: "Inbox preview text (English)",
      type: "string",
      group: "english",
    }),
    defineField({
      name: "narratorLocationEn",
      title: "Writing from line (English)",
      description: "Example: Writing from our studio near Mumbai",
      type: "string",
      group: "english",
    }),
    defineField({
      name: "introEn",
      title: "Cold open / introduction (English)",
      description:
        "Used as the opening note in letter mode or the intro paragraph in digest mode.",
      type: "text",
      rows: 4,
      group: "english",
    }),
    defineField({
      name: "bodyEn",
      title: "Letter body (English, separate paragraphs with a blank line)",
      description:
        "300 to 450 words total. Use **bold** sparingly for turning points. The photo appears automatically after the opening paragraphs.",
      type: "text",
      rows: 12,
      group: "english",
    }),
    defineField({
      name: "replyPromptEn",
      title: "Single reply question (English)",
      description: "One direct question inviting the reader to hit reply.",
      type: "text",
      rows: 2,
      group: "english",
    }),
    defineField({
      name: "psEn",
      title: "P.S. note (English)",
      description:
        "2 to 3 lines for a personal aside, full Story link, or soft cross-link to the other track.",
      type: "text",
      rows: 3,
      group: "english",
    }),
    defineField({
      name: "closingEn",
      title: "Digest closing message (English, legacy digest mode)",
      type: "text",
      rows: 3,
      group: "english",
    }),
    defineField({
      name: "ctaTextEn",
      title: "Story link / button label (English)",
      type: "string",
      group: "english",
      initialValue: "Read the full Story on our website",
    }),
    defineField({
      name: "titleEs",
      title: "Newsletter heading (Spanish)",
      type: "string",
      group: "spanish",
    }),
    defineField({
      name: "subjectEs",
      title: "Email subject line (Spanish, under 50 characters)",
      type: "string",
      group: "spanish",
    }),
    defineField({
      name: "previewTextEs",
      title: "Inbox preview text (Spanish)",
      type: "string",
      group: "spanish",
    }),
    defineField({
      name: "narratorLocationEs",
      title: "Writing from line (Spanish)",
      description: "Ejemplo: Escrito desde nuestro estudio cerca de Bombay",
      type: "string",
      group: "spanish",
    }),
    defineField({
      name: "introEs",
      title: "Cold open / introduction (Spanish)",
      type: "text",
      rows: 4,
      group: "spanish",
    }),
    defineField({
      name: "bodyEs",
      title: "Letter body (Spanish, separate paragraphs with a blank line)",
      type: "text",
      rows: 12,
      group: "spanish",
    }),
    defineField({
      name: "replyPromptEs",
      title: "Single reply question (Spanish)",
      type: "text",
      rows: 2,
      group: "spanish",
    }),
    defineField({
      name: "psEs",
      title: "P.D. note (Spanish)",
      type: "text",
      rows: 3,
      group: "spanish",
    }),
    defineField({
      name: "closingEs",
      title: "Digest closing message (Spanish, legacy digest mode)",
      type: "text",
      rows: 3,
      group: "spanish",
    }),
    defineField({
      name: "ctaTextEs",
      title: "Story link / button label (Spanish)",
      description:
        "Etiqueta del enlace principal para Historias de KarmaRise en español.",
      type: "string",
      group: "spanish",
      initialValue: "Explorar las historias de KarmaRise",
    }),
    defineField({
      name: "ctaUrl",
      title: "Primary Story or destination URL (English)",
      type: "url",
      group: ["editorial", "delivery"],
      initialValue: "https://karmarisedglobal.com/stories",
    }),
    defineField({
      name: "ctaUrlEs",
      title: "Primary Story or destination URL (Spanish, optional)",
      description:
        "If omitted, English /stories/... URLs automatically localize to /es/stories/... for Spanish readers.",
      type: "url",
      group: ["editorial", "delivery"],
    }),
    defineField({
      name: "brevoCampaignIdEn",
      title: "Brevo Campaign ID (English draft)",
      type: "number",
      group: "delivery",
      readOnly: true,
    }),
    defineField({
      name: "brevoCampaignIdEs",
      title: "Brevo Campaign ID (Spanish draft)",
      type: "number",
      group: "delivery",
      readOnly: true,
    }),
    defineField({
      name: "lastSyncedAt",
      title: "Last synced to Brevo at",
      type: "datetime",
      group: "delivery",
      readOnly: true,
    }),
    defineField({
      name: "analytics",
      title: "Brevo campaign performance",
      type: "object",
      group: "delivery",
      fields: [
        defineField({
          name: "deliveredCount",
          title: "Delivered",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "openedCount",
          title: "Unique opened",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "totalOpenedCount",
          title: "Total opens (including repeats)",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "clickedCount",
          title: "Clicked",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "bouncedCount",
          title: "Bounced",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "unsubscribedCount",
          title: "Unsubscribed",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "spamCount",
          title: "Spam complaints",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "lastEventAt",
          title: "Last webhook event at",
          type: "datetime",
        }),
        defineField({
          name: "en",
          title: "English edition (EN) segment",
          type: "object",
          fields: [
            defineField({
              name: "deliveredCount",
              title: "Delivered",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "openedCount",
              title: "Unique opened",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "totalOpenedCount",
              title: "Total opens",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "clickedCount",
              title: "Clicked",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "bouncedCount",
              title: "Bounced",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "unsubscribedCount",
              title: "Unsubscribed",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "spamCount",
              title: "Spam complaints",
              type: "number",
              initialValue: 0,
            }),
          ],
        }),
        defineField({
          name: "es",
          title: "Spanish edition (ES) segment",
          type: "object",
          fields: [
            defineField({
              name: "deliveredCount",
              title: "Delivered",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "openedCount",
              title: "Unique opened",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "totalOpenedCount",
              title: "Total opens",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "clickedCount",
              title: "Clicked",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "bouncedCount",
              title: "Bounced",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "unsubscribedCount",
              title: "Unsubscribed",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "spamCount",
              title: "Spam complaints",
              type: "number",
              initialValue: 0,
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      issueNumber: "issueNumber",
      titleEn: "titleEn",
      internalName: "internalName",
      track: "track",
      narrator: "narrator",
      status: "status",
      media: "heroImage",
    },
    prepare({
      issueNumber,
      titleEn,
      internalName,
      track,
      narrator,
      status,
      media,
    }) {
      const trackTag =
        track === "manufacturing"
          ? "Track A"
          : track === "almarise"
            ? "Track B"
            : "All";
      const voiceTag =
        narrator === "alma"
          ? "Alma"
          : narrator === "shirish"
            ? "Shirish"
            : "Alma & Shirish";
      return {
        title: `${issueNumber ? `${issueNumber} · ` : ""}${titleEn || internalName || "Newsletter Issue"}`,
        subtitle: `${trackTag} · ${voiceTag} · ${status ?? "draft"}`,
        media,
      };
    },
  },
});
