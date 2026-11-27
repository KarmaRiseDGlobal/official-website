import fs from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const SRC_ROOT = path.join(REPO_ROOT, "src");

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

loadEnvFile(path.join(REPO_ROOT, ".env"));
loadEnvFile(path.join(REPO_ROOT, ".env.local"));

const CANDIDATE_EXTENSIONS = [
  "",
  ".ts",
  ".tsx",
  ".mts",
  ".mjs",
  ".js",
  "/index.ts",
  "/index.tsx",
];

function resolveCandidateFile(basePath) {
  for (const suffix of CANDIDATE_EXTENSIONS) {
    const candidate = `${basePath}${suffix}`;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return pathToFileURL(candidate).href;
    }
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") {
      return { shortCircuit: true, url: "data:text/javascript,export {};" };
    }
    if (specifier.startsWith("@/")) {
      const resolvedUrl = resolveCandidateFile(
        path.join(SRC_ROOT, specifier.slice(2)),
      );
      if (resolvedUrl) {
        return { shortCircuit: true, url: resolvedUrl };
      }
    }
    if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      context.parentURL?.startsWith(pathToFileURL(SRC_ROOT).href)
    ) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      const resolvedUrl = resolveCandidateFile(
        path.resolve(parentDir, specifier),
      );
      if (resolvedUrl) {
        return { shortCircuit: true, url: resolvedUrl };
      }
    }
    return nextResolve(specifier, context);
  },
});

const { computeCampaignMetrics, reconcileLanguageSegments } =
  await import("@/lib/email-analytics");

const useDemo = process.argv.includes("--demo");

function formatPct(value) {
  if (value === null || !Number.isFinite(value)) {
    return "n/a";
  }
  return `${(value * 100).toFixed(2)}%`;
}

function inferLanguageFromCampaignName(name) {
  const upper = String(name || "").toUpperCase();
  if (upper.startsWith("[ES]") || upper.includes("(ES)")) {
    return "es";
  }
  return "en";
}

async function fetchSentBrevoCampaigns() {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      "BREVO_API_KEY is missing. Pass --demo to inspect sample closed-window output offline.",
    );
    process.exit(1);
  }

  const res = await fetch(
    "https://api.brevo.com/v3/emailCampaigns?status=sent&limit=100&offset=0",
    {
      headers: {
        "api-key": apiKey,
        Accept: "application/json",
      },
    },
  );

  if (!res.ok) {
    console.error(
      `Failed to fetch Brevo sent campaigns (${res.status}):`,
      await res.text().catch(() => ""),
    );
    process.exit(1);
  }

  const json = await res.json();
  const campaigns = Array.isArray(json.campaigns) ? json.campaigns : [];

  return campaigns.map((camp) => {
    const stats = camp.statistics?.globalStats || {};
    const sent = Number(stats.sent || 0);
    const delivered = Number(stats.delivered || 0);
    const uniqueOpened = Number(stats.uniqueViews || stats.viewed || 0);
    const uniqueClicked = Number(stats.uniqueClicks || stats.clickers || 0);
    const bounced =
      Number(stats.hardBounces || 0) + Number(stats.softBounces || 0);
    const unsubscribed = Number(stats.unsubscriptions || 0);
    const spam = Number(stats.complaints || 0);

    return {
      id: String(camp.id),
      label: camp.name || `Campaign #${camp.id}`,
      language: inferLanguageFromCampaignName(camp.name),
      sentAtIso: camp.sentDate || camp.scheduledAt || undefined,
      sent,
      delivered,
      uniqueOpened,
      uniqueClicked,
      bounced,
      unsubscribed,
      spam,
    };
  });
}

function buildDemoRows(now) {
  const daysAgo = (days) =>
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  return [
    {
      id: "demo-101",
      label: "[EN] Issue #01 · Three states for one leather bag",
      language: "en",
      sentAtIso: daysAgo(21),
      sent: 120,
      delivered: 119,
      uniqueOpened: 64,
      uniqueClicked: 7,
      bounced: 1,
      unsubscribed: 0,
      spam: 0,
    },
    {
      id: "demo-102",
      label: "[ES] Issue #01 · Tres estados para un solo bolso",
      language: "es",
      sentAtIso: daysAgo(21),
      sent: 185,
      delivered: 184,
      uniqueOpened: 112,
      uniqueClicked: 12,
      bounced: 1,
      unsubscribed: 1,
      spam: 0,
    },
    {
      id: "demo-103",
      label: "[ES] Issue #02 · Nadie lo veía hasta que abrí la maleta",
      language: "es",
      sentAtIso: daysAgo(3),
      sent: 192,
      delivered: 191,
      uniqueOpened: 88,
      uniqueClicked: 6,
      bounced: 0,
      unsubscribed: 0,
      spam: 0,
    },
  ];
}

async function main() {
  const now = new Date();
  const rows = useDemo ? buildDemoRows(now) : await fetchSentBrevoCampaigns();

  console.log(
    `\n=== KarmaRise D Global · Email Analytics Report (${useDemo ? "DEMO DATA" : "LIVE BREVO"}) ===`,
  );
  console.log(`Generated at: ${now.toISOString()}`);
  console.log(
    "Observation rule: sends under 7 days old are labelled PENDING and excluded from closed-window segment rates.",
  );
  console.log(
    "Apple MPP note: treat unique open rate strictly as a directional trend per language list, never against static external benchmarks.\n",
  );

  if (rows.length === 0) {
    console.log("No sent email campaigns recorded in Brevo yet.");
    return;
  }

  const computed = rows.map((row) => computeCampaignMetrics(row, now));
  const reconciled = reconcileLanguageSegments(computed);

  for (const item of computed) {
    const statusTag =
      item.windowStatus === "pending"
        ? `PENDING (${item.daysSinceSend}d < 7d)`
        : `CLOSED (${item.daysSinceSend ?? "?"}d)`;
    console.log(
      `[${item.language.toUpperCase()}] ${item.label} | ${statusTag}`,
    );
    console.log(
      `    Sent: ${item.sent} | Delivered: ${item.delivered} (${formatPct(item.deliveryRate)}) | Unique opens*: ${item.uniqueOpened} (${formatPct(item.uniqueOpenRate)}) | Clicks: ${item.uniqueClicked} (${formatPct(item.clickRate)} CTR / ${formatPct(item.clickToOpenRate)} CTOR) | Unsub: ${item.unsubscribed} (${formatPct(item.unsubscribeRate)}) | Bounce/Spam: ${item.bounced}/${item.spam}`,
    );
    for (const alert of item.alerts) {
      console.log(`    ALERT: ${alert}`);
    }
  }

  console.log("\n--- Closed-Window Segment Summary (EN vs ES) ---");
  for (const [label, summary] of [
    ["English (EN)", reconciled.en],
    ["Spanish (ES)", reconciled.es],
    ["Combined", reconciled.combined],
  ]) {
    console.log(
      `${label}: ${summary.closedCampaignCount} closed (${summary.pendingCampaignCount} pending excluded) | Delivered: ${summary.closedDelivered} | CTR: ${formatPct(summary.closedClickRate)} | Unique Open Trend*: ${formatPct(summary.closedUniqueOpenRate)} | Unsub: ${formatPct(summary.closedUnsubscribeRate)}`,
    );
  }
  console.log(
    `Segment reconciliation check (EN + ES == Combined): ${reconciled.reconciled ? "PASS" : "MISMATCH"}`,
  );
}

main().catch((error) => {
  console.error("Email analytics report failed:", error);
  process.exit(1);
});
