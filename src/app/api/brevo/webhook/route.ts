import { NextResponse } from "next/server";

import { fetchSanity, patchSanityDocument } from "@/lib/sanity";
import { readJsonObject, verifyWebhookSecret } from "@/lib/security";

/**
 * Maps Brevo webhook events to Sanity `analytics.*` fields.
 * Uses `unique_opened` for `openedCount` and `opened` for `totalOpenedCount`
 * so repeat opens never inflate open counts past delivered totals.
 */
const EVENT_TO_COUNTER_KEY = new Map<string, string>([
  ["delivered", "deliveredCount"],
  ["unique_opened", "openedCount"],
  ["opened", "totalOpenedCount"],
  ["click", "clickedCount"],
  ["hard_bounce", "bouncedCount"],
  ["soft_bounce", "bouncedCount"],
  ["unsubscribed", "unsubscribedCount"],
  ["spam", "spamCount"],
  ["complaint", "spamCount"],
]);

function parsePositiveSafeInt(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) {
      return null;
    }
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
  }
  return null;
}

export async function POST(request: Request) {
  const auth = verifyWebhookSecret(
    request,
    ["BREVO_WEBHOOK_SECRET"],
    ["x-brevo-secret", "authorization"],
  );
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  const parsed = await readJsonObject(request, 64 * 1024);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: parsed.error },
      { status: parsed.status },
    );
  }

  const payload = parsed.data;
  const event =
    typeof payload.event === "string" ? payload.event.trim().toLowerCase() : "";
  const campIdRaw = payload.camp_id ?? payload["camp-id"] ?? payload.campaignId;
  const campId = parsePositiveSafeInt(campIdRaw);

  const counterKey = EVENT_TO_COUNTER_KEY.get(event);
  if (!counterKey || !campId) {
    return NextResponse.json({
      ok: true,
      ignored: true,
      reason: "Event or campaign ID not tracked.",
    });
  }

  const matchingIssue = await fetchSanity<{
    _id: string;
    brevoCampaignIdEn?: number;
    brevoCampaignIdEs?: number;
  }>(
    `*[_type == "newsletterIssue" && (brevoCampaignIdEn == $campId || brevoCampaignIdEs == $campId)][0]{ _id, brevoCampaignIdEn, brevoCampaignIdEs }`,
    { campId },
    { cache: "no-store" },
  );

  if (!matchingIssue?._id) {
    return NextResponse.json({
      ok: true,
      ignored: true,
      reason: "No matching newsletterIssue found for campaign ID.",
    });
  }

  const segmentKey =
    matchingIssue.brevoCampaignIdEs === campId
      ? "es"
      : matchingIssue.brevoCampaignIdEn === campId
        ? "en"
        : null;

  const incPatch: Record<string, number> = {
    [`analytics.${counterKey}`]: 1,
    ...(segmentKey ? { [`analytics.${segmentKey}.${counterKey}`]: 1 } : {}),
  };

  const patched = await patchSanityDocument(
    matchingIssue._id,
    { "analytics.lastEventAt": new Date().toISOString() },
    incPatch,
  );

  if (!patched) {
    return NextResponse.json(
      { ok: false, error: "Failed to record Brevo webhook event in Sanity." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    issueId: matchingIssue._id,
    segment: segmentKey,
    recordedEvent: event,
  });
}
