import { authorType } from "./author";
import { categoryType } from "./category";
import { newsletterIssueType } from "./newsletterIssue";
import { newsletterSettingsType } from "./newsletterSettings";
import { storyType } from "./story";

export const schemaTypes = [
  storyType,
  categoryType,
  authorType,
  newsletterIssueType,
  newsletterSettingsType,
];
