import fs from "node:fs";
import path from "node:path";

import { stories } from "../src/data/stories.ts";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }
    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    const rawValue = line.slice(index + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.resolve(process.cwd(), ".env"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
const token = process.env.SANITY_API_KEY?.trim();

if (!projectId || !token) {
  console.error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_KEY must be set in .env.",
  );
  process.exit(1);
}

const mutations = stories.map((story, index) => ({
  createIfNotExists: {
    _id: `story-${story.slug}`,
    _type: "story",
    title: story.title,
    slug: { _type: "slug", current: story.slug },
    featured: Boolean(story.featured),
    publishedAt: new Date(Date.now() - index * 86_400_000).toISOString(),
    category: story.category,
    location: story.location,
    summary: story.summary,
    leadSlot: story.leadSlot,
    pairSlots: story.pairSlots.map((slot, slotIndex) => ({
      _key: `slot-${slotIndex}`,
      ...slot,
    })),
    sections: story.sections.map((section, sectionIndex) => ({
      _key: `section-${sectionIndex}`,
      heading: section.heading,
      paragraphs: section.paragraphs,
    })),
    takeaway: story.takeaway,
  },
}));

const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/mutate/${dataset}`;
const response = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ mutations }),
});

if (!response.ok) {
  console.error("Sanity seed failed:", response.status, await response.text());
  process.exit(1);
}

const result = await response.json();
console.log(
  `Seeded ${result.results?.length ?? 0} Stories into ${projectId}/${dataset}.`,
);
