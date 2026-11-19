import { NextResponse } from "next/server";

import { fetchSanity, patchSanityDocument } from "@/lib/sanity";
import { readJsonObject, verifyWebhookSecret } from "@/lib/security";

const EVENT_TO_COUNTER_FIELD = new Map<string, string>([
  ["delivered", "analytics.deliveredCount"],
  ["opened", "analytics.openedCount"],
  ["unique_opened", "analytics.openedCount"],
  ["click", "analytics.clickedCount"],
  ["hard_bounce", "analytics.bouncedCount"],
  ["soft_bounce", "analytics.bouncedCount"],
  ["unsubscribed", "analytics.unsubscribedCount"],
  ["spam", "analytics.spamCount"],
  ["complaint", "analytics.spamCount"],
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

  const counterField = EVENT_TO_COUNTER_FIELD.get(event);
  if (!counterField || !campId) {
    return NextResponse.json({
      ok: true,
      ignored: true,
      reason: "Event or campaign ID not tracked.",
    });
  }

  const matchingIssue = await fetchSanity<{ _id: string }>(
    `*[_type == "newsletterIssue" && (brevoCampaignIdEn == $campId || brevoCampaignIdEs == $campId)][0]{ _id }`,
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

  const patched = await patchSanityDocument(
    matchingIssue._id,
    { "analytics.lastEventAt": new Date().toISOString() },
    { [counterField]: 1 },
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
    recordedEvent: event,
  });
}
