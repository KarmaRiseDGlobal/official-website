import { NextResponse } from "next/server";

import { fetchSanity, patchSanityDocument } from "@/lib/sanity";

const EVENT_TO_COUNTER_FIELD: Record<string, string> = {
  delivered: "analytics.deliveredCount",
  opened: "analytics.openedCount",
  unique_opened: "analytics.openedCount",
  click: "analytics.clickedCount",
  hard_bounce: "analytics.bouncedCount",
  soft_bounce: "analytics.bouncedCount",
  unsubscribed: "analytics.unsubscribedCount",
  spam: "analytics.spamCount",
  complaint: "analytics.spamCount",
};

export async function POST(request: Request) {
  const secret = process.env.BREVO_WEBHOOK_SECRET?.trim();
  if (secret) {
    const provided =
      request.headers.get("x-brevo-secret") ||
      new URL(request.url).searchParams.get("secret");
    if (provided !== secret) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized Brevo webhook." },
        { status: 401 },
      );
    }
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const event = String(payload.event ?? "").toLowerCase();
  const campIdRaw = payload.camp_id ?? payload["camp-id"] ?? payload.campaignId;
  const campId =
    typeof campIdRaw === "number"
      ? campIdRaw
      : Number.parseInt(String(campIdRaw ?? ""), 10);

  const counterField = EVENT_TO_COUNTER_FIELD[event];
  if (!counterField || !Number.isFinite(campId) || campId <= 0) {
    return NextResponse.json({
      ok: true,
      ignored: true,
      reason: "Event or campaign ID not tracked.",
    });
  }

  const matchingIssue = await fetchSanity<{ _id: string }>(
    `*[_type == "newsletterIssue" && (brevoCampaignIdEn == $campId || brevoCampaignIdEs == $campId)][0]{ _id }`,
    { campId },
  );

  if (!matchingIssue?._id) {
    return NextResponse.json({
      ok: true,
      ignored: true,
      reason: "No matching newsletterIssue found for campaign ID.",
    });
  }

  await patchSanityDocument(
    matchingIssue._id,
    { "analytics.lastEventAt": new Date().toISOString() },
    { [counterField]: 1 },
  );

  return NextResponse.json({
    ok: true,
    issueId: matchingIssue._id,
    recordedEvent: event,
  });
}
