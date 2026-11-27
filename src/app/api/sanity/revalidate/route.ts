import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { readBoundedBodyText, verifyWebhookSecret } from "@/lib/security";

function extractValidSlug(payload: Record<string, unknown>): string {
  const rawSlug =
    typeof payload.slug === "string"
      ? payload.slug
      : typeof payload.slug === "object" &&
          payload.slug !== null &&
          "current" in payload.slug &&
          typeof payload.slug.current === "string"
        ? payload.slug.current
        : "";

  const normalized = rawSlug.trim();
  return normalized && /^[a-z0-9-]+$/i.test(normalized) ? normalized : "";
}

export async function POST(request: Request) {
  const auth = verifyWebhookSecret(
    request,
    ["SANITY_REVALIDATE_SECRET"],
    ["x-sanity-secret", "authorization"],
  );
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  const bodyResult = await readBoundedBodyText(request, 64 * 1024);
  if (!bodyResult.ok) {
    return NextResponse.json(
      { ok: false, error: bodyResult.error },
      { status: bodyResult.status },
    );
  }

  let slug = "";
  if (bodyResult.text.trim()) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(bodyResult.text);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON payload." },
        { status: 400 },
      );
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return NextResponse.json(
        { ok: false, error: "Expected a JSON object payload." },
        { status: 400 },
      );
    }

    const payload = parsed as Record<string, unknown>;
    if (
      "slug" in payload &&
      payload.slug !== undefined &&
      payload.slug !== null
    ) {
      slug = extractValidSlug(payload);
      if (!slug) {
        return NextResponse.json(
          { ok: false, error: "Invalid story slug." },
          { status: 400 },
        );
      }
    }
  }

  revalidatePath("/stories");
  revalidatePath("/es/stories");
  revalidatePath("/stories/rss.xml");
  revalidatePath("/es/stories/rss.xml");
  revalidatePath("/sitemap.xml");
  revalidatePath("/stories/[slug]", "page");
  revalidatePath("/es/stories/[slug]", "page");
  if (slug) {
    revalidatePath(`/stories/${slug}`);
    revalidatePath(`/es/stories/${slug}`);
  }
  revalidateTag("stories", "max");

  return NextResponse.json({ ok: true, revalidated: true });
}
