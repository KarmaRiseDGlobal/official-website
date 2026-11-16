import { NextResponse } from "next/server";

import { syncNewsletterIssueToBrevo } from "@/lib/brevo-campaigns";
import { getNewsletterIssueById, patchSanityDocument } from "@/lib/sanity";

export async function POST(request: Request) {
  const secret =
    process.env.SANITY_WEBHOOK_SECRET?.trim() ||
    process.env.SANITY_REVALIDATE_SECRET?.trim();

  if (secret) {
    const provided =
      request.headers.get("x-sanity-secret") ||
      new URL(request.url).searchParams.get("secret");
    if (provided !== secret) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized webhook request." },
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

  const docType = typeof payload._type === "string" ? payload._type : "";
  const docId = typeof payload._id === "string" ? payload._id : "";

  // Safety rule: ordinary Story publications never trigger a newsletter campaign.
  if (docType !== "newsletterIssue" || !docId || docId.startsWith("drafts.")) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason:
        "Only published newsletterIssue documents are eligible for Brevo sync.",
    });
  }

  const issue = await getNewsletterIssueById(docId);
  if (!issue) {
    return NextResponse.json(
      { ok: false, error: "Newsletter issue not found in Sanity." },
      { status: 404 },
    );
  }

  if (issue.status !== "approved") {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: `Newsletter issue status is "${issue.status ?? "draft"}", not "approved".`,
    });
  }

  const syncResult = await syncNewsletterIssueToBrevo(issue);
  if (!syncResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: syncResult.error || "Failed to sync campaign drafts.",
      },
      { status: 502 },
    );
  }

  await patchSanityDocument(docId, {
    status: "synced_to_brevo",
    ...(syncResult.brevoCampaignIdEn
      ? { brevoCampaignIdEn: syncResult.brevoCampaignIdEn }
      : {}),
    ...(syncResult.brevoCampaignIdEs
      ? { brevoCampaignIdEs: syncResult.brevoCampaignIdEs }
      : {}),
    lastSyncedAt: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    synced: true,
    brevoCampaignIdEn: syncResult.brevoCampaignIdEn,
    brevoCampaignIdEs: syncResult.brevoCampaignIdEs,
  });
}
