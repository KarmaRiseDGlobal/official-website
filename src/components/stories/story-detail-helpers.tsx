"use client";

import type { ReactNode } from "react";

import {
  segmentParagraphWithReferences,
  StoryReferenceSegments,
} from "@/components/stories/story-reference-text";
import type { StoryReferenceEntry } from "@/data/story-references";
import type {
  StoryBodyBlock,
  StoryEntry,
  StoryImage,
  StoryLanguage,
  StoryMarkDef,
  StoryPullQuote,
  StorySection,
  StoryTextSpan,
} from "@/data/story-types";

export function sanitizePortableLinkHref(rawHref: unknown): string | null {
  if (typeof rawHref !== "string") {
    return null;
  }

  if (/[\u0000-\u001F\u007F]/.test(rawHref)) {
    return null;
  }

  const trimmed = rawHref.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("#")) {
    return trimmed.length > 1 && !/\s/.test(trimmed) ? trimmed : null;
  }

  if (trimmed.startsWith("/")) {
    if (trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
      return null;
    }

    try {
      const resolved = new URL(trimmed, "https://karmarisedglobal.invalid");
      return resolved.origin === "https://karmarisedglobal.invalid"
        ? trimmed
        : null;
    } catch {
      return null;
    }
  }

  if (/^mailto:/i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (
        parsed.protocol === "mailto:" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.pathname)
      ) {
        return trimmed;
      }
    } catch {
      return null;
    }
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (
        (parsed.protocol === "http:" || parsed.protocol === "https:") &&
        Boolean(parsed.hostname) &&
        !parsed.username &&
        !parsed.password
      ) {
        return parsed.href;
      }
    } catch {
      return null;
    }
    return null;
  }

  return null;
}

export function toSectionId(heading: string, index: number): string {
  const slugified = heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slugified || `section-${index + 1}`;
}

export function getImageDimensionsFromUrl(
  url?: string,
): { width: number; height: number } | null {
  if (!url) return null;
  const match = url.match(/-(\d+)x(\d+)\.[a-z0-9]+(?:\?.*)?$/i);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }
  return { width, height };
}

export function resolveAspectRatio(
  url?: string,
  declared?: StoryImage["aspectRatio"],
  fallback: StoryImage["aspectRatio"] = "4:5",
): StoryImage["aspectRatio"] {
  const dims = getImageDimensionsFromUrl(url);
  if (dims) {
    const ratio = dims.width / dims.height;
    if (ratio >= 1.55) return "16:9";
    if (ratio >= 1.15) return "4:3";
    if (ratio <= 0.88) return "4:5";
  }
  return declared ?? fallback;
}

export function getAspectConfig(aspectRatio?: StoryImage["aspectRatio"]): {
  aspectClass: string;
  ratioLabel: string;
  singleMaxWidthClass: string;
} {
  if (aspectRatio === "16:9") {
    return {
      aspectClass: "aspect-[16/9]",
      ratioLabel: "16:9 wide",
      singleMaxWidthClass: "w-full",
    };
  }
  if (aspectRatio === "4:3") {
    return {
      aspectClass: "aspect-[4/3]",
      ratioLabel: "4:3 horizontal",
      singleMaxWidthClass: "mx-auto w-full max-w-[44rem] lg:mx-0",
    };
  }
  return {
    aspectClass: "aspect-[4/5]",
    ratioLabel: "4:5 portrait",
    singleMaxWidthClass: "mx-auto w-full max-w-[28rem] lg:mx-0",
  };
}

export function renderSpanWithMarks(
  span: StoryTextSpan,
  markDefs: StoryMarkDef[] | undefined,
  lang: StoryLanguage,
  seenReferenceIds: Set<string> | undefined,
  collectedReferences?: StoryReferenceEntry[],
): ReactNode {
  const marks = span.marks ?? [];
  let content: ReactNode;

  if (marks.length === 0 && seenReferenceIds) {
    const segments = segmentParagraphWithReferences(
      span.text,
      lang,
      seenReferenceIds,
    );
    if (collectedReferences) {
      for (const segment of segments) {
        if (segment.kind === "ref") {
          collectedReferences.push(segment.entry);
        }
      }
    }
    content = <StoryReferenceSegments segments={segments} lang={lang} />;
  } else {
    content = span.text;
  }

  for (const mark of marks) {
    if (mark === "strong") {
      content = (
        <strong
          key={`${span._key}-strong`}
          className="font-semibold text-[var(--color-forest-deep)]"
        >
          {content}
        </strong>
      );
    } else if (mark === "em") {
      content = <em key={`${span._key}-em`}>{content}</em>;
    } else {
      const linkDef = markDefs?.find((def) => def._key === mark);
      const safeHref = linkDef ? sanitizePortableLinkHref(linkDef.href) : null;
      if (linkDef && safeHref) {
        const isExternal = /^https?:\/\//i.test(safeHref);
        content = (
          <a
            key={`${span._key}-${mark}`}
            href={safeHref}
            target={linkDef.blank || isExternal ? "_blank" : undefined}
            rel={
              linkDef.blank || isExternal ? "noopener noreferrer" : undefined
            }
            className="font-medium text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
          >
            {content}
          </a>
        );
      } else {
        content = <span key={`${span._key}-${mark}`}>{content}</span>;
      }
    }
  }

  return <span key={span._key}>{content}</span>;
}

export interface PortableChapter {
  id: string;
  heading?: string;
  headingNodes?: ReactNode;
  blocks: StoryBodyBlock[];
  imageGrid?: StoryImage[];
}

export function groupPortableBlocksIntoChapters(
  blocks: StoryBodyBlock[],
  lang: StoryLanguage,
): PortableChapter[] {
  const chapters: PortableChapter[] = [];
  let current: PortableChapter = { id: "opening", blocks: [] };
  let h2Counter = 0;

  for (const block of blocks) {
    if (block._type === "block" && block.style === "h2") {
      if (current.heading || current.blocks.length > 0) {
        chapters.push(current);
      }
      const plainText = block.children.map((c) => c.text).join("");
      const idx = h2Counter;
      h2Counter += 1;
      current = {
        id: toSectionId(plainText, idx),
        heading: plainText,
        headingNodes: block.children.map((span) =>
          renderSpanWithMarks(span, block.markDefs, lang, undefined),
        ),
        blocks: [],
      };
    } else {
      current.blocks.push(block);
    }
  }

  if (current.heading || current.blocks.length > 0) {
    chapters.push(current);
  }

  return chapters;
}

const INLINE_MARKDOWN_LINK_PATTERN =
  /\[([^[\]\r\n]+)\]\(((?:[^()\s]+|\([^()\s]*\))+)\)/g;

export function parseParagraphWithInlineLinks(
  paragraph: string,
  keyPrefix: string,
): {
  children: StoryTextSpan[];
  markDefs?: StoryMarkDef[];
} {
  if (!paragraph.includes("](")) {
    return {
      children: [{ _key: `${keyPrefix}-s-0`, text: paragraph }],
    };
  }

  const children: StoryTextSpan[] = [];
  const markDefs: StoryMarkDef[] = [];
  let plainBuffer = "";
  let lastIndex = 0;
  let spanIndex = 0;
  let linkIndex = 0;

  const flushPlain = () => {
    if (!plainBuffer) {
      return;
    }
    children.push({
      _key: `${keyPrefix}-s-${spanIndex}`,
      text: plainBuffer,
    });
    spanIndex += 1;
    plainBuffer = "";
  };

  for (const match of paragraph.matchAll(INLINE_MARKDOWN_LINK_PATTERN)) {
    const matchIndex = match.index ?? 0;
    const label = match[1] ?? "";
    const rawHref = match[2] ?? "";

    if (matchIndex > lastIndex) {
      plainBuffer += paragraph.slice(lastIndex, matchIndex);
    }

    const safeHref = sanitizePortableLinkHref(rawHref);
    if (safeHref && label) {
      flushPlain();
      const markKey = `${keyPrefix}-link-${linkIndex}`;
      linkIndex += 1;
      const isExternal = /^https?:\/\//i.test(safeHref);
      markDefs.push({
        _key: markKey,
        _type: "link",
        href: safeHref,
        ...(isExternal ? { blank: true } : {}),
      });
      children.push({
        _key: `${keyPrefix}-s-${spanIndex}`,
        text: label,
        marks: [markKey],
      });
      spanIndex += 1;
    } else {
      plainBuffer += label || match[0];
    }

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < paragraph.length) {
    plainBuffer += paragraph.slice(lastIndex);
  }
  flushPlain();

  if (children.length === 0) {
    return {
      children: [{ _key: `${keyPrefix}-s-0`, text: paragraph }],
    };
  }

  return {
    children,
    ...(markDefs.length > 0 ? { markDefs } : {}),
  };
}

export function convertSectionsToPortableChapters(
  sections: readonly StorySection[],
  pullQuote?: StoryPullQuote,
): PortableChapter[] {
  return sections.map((section, sectionIndex) => {
    const blocks: StoryBodyBlock[] = section.paragraphs.map(
      (paragraph, pIndex) => {
        const keyPrefix = `sec-${sectionIndex}-p-${pIndex}`;
        const parsed = parseParagraphWithInlineLinks(paragraph, keyPrefix);
        return {
          _key: keyPrefix,
          _type: "block",
          style: "normal",
          children: parsed.children,
          ...(parsed.markDefs ? { markDefs: parsed.markDefs } : {}),
        };
      },
    );

    if (sectionIndex === 0 && pullQuote?.text) {
      blocks.push({
        _key: `sec-${sectionIndex}-quote`,
        _type: "pullQuoteBlock",
        text: pullQuote.text,
        attribution: pullQuote.attribution,
      });
    }

    if (section.images && section.images.length === 1) {
      const img = section.images[0]!;
      blocks.push({
        _key: `sec-${sectionIndex}-img-0`,
        _type: "image",
        url: img.url,
        alt: img.alt,
        aspectRatio: img.aspectRatio,
        objectPosition: img.objectPosition,
      });
    }

    return {
      id: toSectionId(section.heading, sectionIndex),
      heading: section.heading,
      headingNodes: section.heading,
      blocks,
      imageGrid:
        section.images && section.images.length > 1
          ? section.images
          : undefined,
    };
  });
}

export function resolveStoryChapters(
  story: StoryEntry,
  sections: readonly StorySection[],
  pullQuote: StoryPullQuote | undefined,
  lang: StoryLanguage,
): PortableChapter[] {
  const isEs = lang === "es";
  const activeBody = isEs
    ? story.spanishBody && story.spanishBody.length > 0
      ? story.spanishBody
      : story.language === "es" &&
          (!story.spanishSections || story.spanishSections.length === 0)
        ? story.body
        : undefined
    : story.body;

  if (activeBody && activeBody.length > 0) {
    return groupPortableBlocksIntoChapters(activeBody, lang);
  }

  return convertSectionsToPortableChapters(sections, pullQuote);
}

export interface PortableChapterRow {
  kind: "prose";
  key: string;
  blocks: Exclude<StoryBodyBlock, { _type: "image" }>[];
}

export interface PortableImageRow {
  kind: "image";
  key: string;
  block: Extract<StoryBodyBlock, { _type: "image" }>;
}

export interface PortableImageGridRow {
  kind: "imageGrid";
  key: string;
  images: StoryImage[];
}

export type PortableRenderRow =
  PortableChapterRow | PortableImageRow | PortableImageGridRow;

export function splitChapterIntoRows(
  blocks: StoryBodyBlock[],
  imageGrid?: StoryImage[],
  chapterId = "chapter",
): PortableRenderRow[] {
  const rows: PortableRenderRow[] = [];
  let proseBuffer: Exclude<StoryBodyBlock, { _type: "image" }>[] = [];

  const flushProse = () => {
    if (proseBuffer.length === 0) return;
    rows.push({
      kind: "prose",
      key: `prose-${proseBuffer[0]!._key}`,
      blocks: proseBuffer,
    });
    proseBuffer = [];
  };

  for (const block of blocks) {
    if (block._type === "image") {
      flushProse();
      rows.push({
        kind: "image",
        key: block._key,
        block,
      });
    } else {
      proseBuffer.push(block);
    }
  }
  flushProse();

  if (imageGrid && imageGrid.length > 1) {
    rows.push({
      kind: "imageGrid",
      key: `grid-${chapterId}`,
      images: imageGrid,
    });
  }

  return rows;
}

export function renderPortableProseBlocks(
  blocks: Exclude<StoryBodyBlock, { _type: "image" }>[],
  lang: StoryLanguage,
  seenReferenceIds: Set<string>,
  firstParagraphState: { rendered: boolean },
  collectedReferences: StoryReferenceEntry[],
): ReactNode[] {
  const elements: ReactNode[] = [];

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i]!;
    if (block._type === "block") {
      if (block.listItem === "bullet" || block.listItem === "number") {
        const listKind = block.listItem;
        const listItems: Array<{ key: string; nodes: ReactNode }> = [];

        while (i < blocks.length) {
          const current = blocks[i]!;
          if (current._type !== "block" || current.listItem !== listKind) {
            break;
          }
          listItems.push({
            key: current._key,
            nodes: current.children.map((span) =>
              renderSpanWithMarks(
                span,
                current.markDefs,
                lang,
                seenReferenceIds,
                collectedReferences,
              ),
            ),
          });
          i += 1;
        }
        i -= 1;

        const ListTag = listKind === "number" ? "ol" : "ul";
        elements.push(
          <ListTag
            key={`list-${listItems[0]!.key}`}
            className={`m-0 grid max-w-[var(--measure-copy)] gap-2.5 ps-6 text-[length:var(--text-md)] leading-[1.68] text-[var(--color-ink)] ${
              listKind === "number" ? "list-decimal" : "list-disc"
            } marker:font-semibold marker:text-[var(--color-clay-ink)]`}
          >
            {listItems.map((item) => (
              <li key={item.key}>{item.nodes}</li>
            ))}
          </ListTag>,
        );
        continue;
      }

      const isAnnotatable =
        block.style !== "h2" &&
        block.style !== "h3" &&
        block.style !== "blockquote";
      const renderedChildren = block.children.map((span) =>
        renderSpanWithMarks(
          span,
          block.markDefs,
          lang,
          isAnnotatable ? seenReferenceIds : undefined,
          isAnnotatable ? collectedReferences : undefined,
        ),
      );

      if (block.style === "h3") {
        elements.push(
          <h3
            key={block._key}
            className="max-w-[var(--measure-copy)] pt-3 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.2] font-normal text-[var(--color-forest-deep)]"
          >
            {renderedChildren}
          </h3>,
        );
      } else if (block.style === "blockquote") {
        elements.push(
          <blockquote
            key={block._key}
            className="m-0 my-4 grid max-w-[var(--measure-copy)] gap-3 border-s border-[var(--color-clay)] py-2 ps-6 sm:ps-8"
          >
            <p className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.32] text-[var(--color-forest-deep)] md:text-[length:var(--text-2xl)]">
              &ldquo;{renderedChildren}&rdquo;
            </p>
          </blockquote>,
        );
      } else {
        const isFirst = !firstParagraphState.rendered;
        firstParagraphState.rendered = true;
        elements.push(
          <p
            key={block._key}
            className={`max-w-[var(--measure-copy)] text-[length:var(--text-md)] leading-[1.68] text-[var(--color-ink)] ${
              isFirst
                ? "first-letter:float-start first-letter:me-3 first-letter:font-[family-name:var(--font-display)] first-letter:text-[length:var(--text-display-s)] first-letter:leading-[0.94] first-letter:text-[var(--color-forest-deep)]"
                : ""
            }`}
          >
            {renderedChildren}
          </p>,
        );
      }
    } else if (block._type === "pullQuoteBlock") {
      elements.push(
        <blockquote
          key={block._key}
          className="m-0 my-4 grid max-w-[var(--measure-copy)] gap-3 border-s border-[var(--color-clay)] py-2 ps-6 sm:ps-8"
        >
          <p className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.32] text-[var(--color-forest-deep)] md:text-[length:var(--text-2xl)]">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.attribution ? (
            <cite className="text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-clay-ink)] uppercase not-italic">
              {block.attribution}
            </cite>
          ) : null}
        </blockquote>,
      );
    }
  }

  return elements;
}
