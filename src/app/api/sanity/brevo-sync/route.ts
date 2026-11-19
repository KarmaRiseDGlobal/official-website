import { NextResponse } from "next/server";

import { syncNewsletterIssueToBrevo } from "@/lib/brevo-campaigns";
import { getNewsletterIssueById, patchSanityDocument } from "@/lib/sanity";
import { readJsonObject, verifyWebhookSecret } from "@/lib/security";
import { readTrimmedString } from "@/lib/validation";

const VALID_SANITY_ID_PATTERN = /^[a-zA-Z0-9._-]+$/;

export async function POST(request: Request) {
  const auth = verifyWebhookSecret(
    request,
    ["SANITY_WEBHOOK_SECRET", "SANITY_REVALIDATE_SECRET"],
    ["x-sanity-secret", "authorization"],
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
  const docType = readTrimmedString(payload._type, 64);
  const docId = readTrimmedString(payload._id, 128);

  // Safety rule: ordinary Story publications never trigger a newsletter campaign.
  if (
    docType !== "newsletterIssue" ||
    !docId ||
    docId.startsWith("drafts.") ||
    docId.startsWith("versions.")
  ) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason:
        "Only published newsletterIssue documents are eligible for Brevo sync.",
    });
  }

  if (!VALID_SANITY_ID_PATTERN.test(docId)) {
    return NextResponse.json(
      { ok: false, error: "Invalid Sanity document ID." },
      { status: 400 },
    );
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

  const patched = await patchSanityDocument(docId, {
    status: "synced_to_brevo",
    ...(syncResult.brevoCampaignIdEn
      ? { brevoCampaignIdEn: syncResult.brevoCampaignIdEn }
      : {}),
    ...(syncResult.brevoCampaignIdEs
      ? { brevoCampaignIdEs: syncResult.brevoCampaignIdEs }
      : {}),
    lastSyncedAt: new Date().toISOString(),
  });

  if (!patched) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Brevo drafts synced, but failed to update Sanity document status.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    synced: true,
    brevoCampaignIdEn: syncResult.brevoCampaignIdEn,
    brevoCampaignIdEs: syncResult.brevoCampaignIdEs,
  });
}
