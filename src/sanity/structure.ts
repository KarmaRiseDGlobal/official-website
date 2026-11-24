import type { StructureResolver } from "sanity/structure";

const STORY_CATEGORIES = [
  "Heritage & Culture",
  "Sustainable Fashion",
  "People & Craftsmanship",
  "Art & Design",
  "India Meets Europe",
  "Inside KarmaRise",
] as const;

export const editorialStructure: StructureResolver = (S) =>
  S.list()
    .title("KarmaRise Editorial & Newsletter Desk")
    .items([
      // 01. Stories & Articles
      S.listItem()
        .title("01 · Stories & Articles")
        .child(
          S.list()
            .title("Stories & Articles")
            .items([
              S.listItem()
                .title("All Stories")
                .schemaType("story")
                .child(S.documentTypeList("story").title("All Stories")),
              S.listItem()
                .title("Featured Cover Stories")
                .schemaType("story")
                .child(
                  S.documentList()
                    .title("Featured Cover Stories")
                    .filter('_type == "story" && featured == true'),
                ),
              S.listItem()
                .title("Newsletter-Eligible Stories")
                .schemaType("story")
                .child(
                  S.documentList()
                    .title("Newsletter-Eligible Stories")
                    .filter('_type == "story" && newsletterEligible == true'),
                ),
              S.divider(),
              ...STORY_CATEGORIES.map((category, index) => {
                const isInsideKarmaRise = category === "Inside KarmaRise";
                const documentList = S.documentList()
                  .title(category)
                  .filter(
                    isInsideKarmaRise
                      ? '_type == "story" && (category == "Inside KarmaRise" || category == "KarmaRise Journal")'
                      : '_type == "story" && category == $category',
                  );

                return S.listItem()
                  .title(`0${index + 1}. ${category}`)
                  .schemaType("story")
                  .child(
                    isInsideKarmaRise
                      ? documentList
                      : documentList.params({ category }),
                  );
              }),
            ]),
        ),

      // 02. Categories & Topics
      S.listItem()
        .title("02 · Categories & Authors")
        .child(
          S.list()
            .title("Categories & Authors")
            .items([
              S.documentTypeListItem("category").title(
                "Editorial Pillars (Categories)",
              ),
              S.documentTypeListItem("author").title("Authors & Contributors"),
            ]),
        ),

      // 03. Newsletter Issues
      S.listItem()
        .title("03 · Newsletter Issues")
        .child(
          S.list()
            .title("Newsletter Issues")
            .items([
              S.listItem()
                .title("All Newsletter Issues")
                .schemaType("newsletterIssue")
                .child(
                  S.documentTypeList("newsletterIssue").title(
                    "All Newsletter Issues",
                  ),
                ),
              S.listItem()
                .title("Draft Editions")
                .schemaType("newsletterIssue")
                .child(
                  S.documentList()
                    .title("Draft Editions")
                    .filter('_type == "newsletterIssue" && status == "draft"'),
                ),
              S.listItem()
                .title("Awaiting Editorial Review")
                .schemaType("newsletterIssue")
                .child(
                  S.documentList()
                    .title("Awaiting Editorial Review")
                    .filter('_type == "newsletterIssue" && status == "review"'),
                ),
              S.listItem()
                .title("Approved · Ready for Brevo")
                .schemaType("newsletterIssue")
                .child(
                  S.documentList()
                    .title("Approved · Ready for Brevo")
                    .filter(
                      '_type == "newsletterIssue" && status in ["approved", "synced_to_brevo", "scheduled"]',
                    ),
                ),
            ]),
        ),

      // 04. Campaign Archive & Settings
      S.listItem()
        .title("04 · Campaign Archive & Settings")
        .child(
          S.list()
            .title("Campaign Archive & Settings")
            .items([
              S.listItem()
                .title("Sent Campaigns Archive")
                .schemaType("newsletterIssue")
                .child(
                  S.documentList()
                    .title("Sent Campaigns Archive")
                    .filter('_type == "newsletterIssue" && status == "sent"'),
                ),
              S.divider(),
              S.listItem()
                .title("Global Newsletter Settings")
                .child(
                  S.document()
                    .schemaType("newsletterSettings")
                    .documentId("newsletterSettings"),
                ),
            ]),
        ),
    ]);
