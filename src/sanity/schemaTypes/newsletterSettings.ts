import { defineField, defineType } from "sanity";

export const newsletterSettingsType = defineType({
  name: "newsletterSettings",
  title: "Newsletter Settings",
  type: "document",
  fields: [
    defineField({
      name: "senderName",
      title: "Sender name",
      type: "string",
      initialValue: "KarmaRise D Global",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "senderEmail",
      title: "Sender email address",
      type: "string",
      initialValue: "stories@karmarisedglobal.com",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "replyToEmail",
      title: "Reply-to email address",
      type: "string",
      initialValue: "stories@karmarisedglobal.com",
    }),
    defineField({
      name: "brevoMasterListId",
      title: "Brevo master subscriber list ID",
      type: "number",
    }),
    defineField({
      name: "brevoEnglishListId",
      title: "Brevo English segment/list ID",
      type: "number",
    }),
    defineField({
      name: "brevoSpanishListId",
      title: "Brevo Spanish segment/list ID",
      type: "number",
    }),
    defineField({
      name: "defaultFooterEn",
      title: "Default email footer (English)",
      type: "text",
      rows: 3,
      initialValue:
        "KarmaRise · Madrid & Maharashtra · stories@karmarisedglobal.com",
    }),
    defineField({
      name: "defaultFooterEs",
      title: "Default email footer (Spanish)",
      type: "text",
      rows: 3,
      initialValue:
        "KarmaRise · Madrid y Maharashtra · stories@karmarisedglobal.com",
    }),
  ],
  preview: {
    select: {
      title: "senderName",
      subtitle: "senderEmail",
    },
  },
});
