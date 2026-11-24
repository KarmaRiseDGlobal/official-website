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
      name: "brevoManufacturingEnListId",
      title: "Brevo Track A Manufacturing (EN) list ID",
      type: "number",
    }),
    defineField({
      name: "brevoManufacturingEsListId",
      title: "Brevo Track A Manufacturing (ES) list ID",
      type: "number",
    }),
    defineField({
      name: "brevoAlmariseEnListId",
      title: "Brevo Track B AlmaRise D Brand & Culture (EN) list ID",
      type: "number",
    }),
    defineField({
      name: "brevoAlmariseEsListId",
      title: "Brevo Track B AlmaRise D Brand & Culture (ES) list ID",
      type: "number",
    }),
    defineField({
      name: "defaultFooterEn",
      title: "Default email footer (English)",
      type: "text",
      rows: 3,
      initialValue:
        "KarmaRise D Global · Spain & India · stories@karmarisedglobal.com",
    }),
    defineField({
      name: "defaultFooterEs",
      title: "Default email footer (Spanish)",
      type: "text",
      rows: 3,
      initialValue:
        "KarmaRise D Global · España e India · stories@karmarisedglobal.com",
    }),
  ],
  preview: {
    select: {
      title: "senderName",
      subtitle: "senderEmail",
    },
  },
});
