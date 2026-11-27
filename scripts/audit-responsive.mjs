import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DEFAULT_URL = "http://localhost:3000";

const BROWSER_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/chromium",
  "/usr/bin/google-chrome",
].filter(Boolean);

const VIEWPORTS = [
  {
    id: "ipad-mini-p",
    tier: "ipad",
    width: 744,
    height: 1133,
    mobile: true,
    touch: true,
  },
  {
    id: "ipad-p",
    tier: "ipad",
    width: 768,
    height: 1024,
    mobile: true,
    touch: true,
  },
  {
    id: "ipad-air-p",
    tier: "ipad",
    width: 820,
    height: 1180,
    mobile: true,
    touch: true,
  },
  {
    id: "ipad-pro11-p",
    tier: "ipad",
    width: 834,
    height: 1194,
    mobile: true,
    touch: true,
  },
  {
    id: "ipad-l",
    tier: "ipad",
    width: 1024,
    height: 768,
    mobile: true,
    touch: true,
  },
  {
    id: "ipad-air-l",
    tier: "ipad",
    width: 1180,
    height: 820,
    mobile: true,
    touch: true,
  },
  {
    id: "ipad-pro12-p",
    tier: "ipad",
    width: 1024,
    height: 1366,
    mobile: true,
    touch: true,
  },
  {
    id: "iphone-se",
    tier: "mobile",
    width: 375,
    height: 667,
    mobile: true,
    touch: true,
  },
  {
    id: "iphone-se-l",
    tier: "mobile",
    width: 667,
    height: 375,
    mobile: true,
    touch: true,
  },
  {
    id: "laptop-1280",
    tier: "laptop",
    width: 1280,
    height: 720,
    mobile: false,
    touch: false,
  },
  {
    id: "laptop-1440",
    tier: "laptop",
    width: 1440,
    height: 900,
    mobile: false,
    touch: false,
  },
];

const ROUTES = [
  "/",
  "/es",
  "/about",
  "/es/about",
  "/manufacturing",
  "/es/manufacturing",
  "/how-we-work",
  "/es/how-we-work",
  "/almarise",
  "/es/almarise",
  "/womens-training-initiative",
  "/es/womens-training-initiative",
  "/stories",
  "/es/stories",
  "/contact",
  "/es/contact",
  "/product-brief",
  "/es/product-brief",
  "/book-a-call",
  "/es/book-a-call",
  "/legal-notice",
  "/es/legal-notice",
  "/privacy-policy",
  "/es/privacy-policy",
  "/terms",
  "/es/terms",
  "/cookie-policy",
  "/es/cookie-policy",
  "/for/b2b-retail-podcast",
  "/es/para/b2b-retail-podcast",
];

function parseArgs(argv) {
  let baseUrl = DEFAULT_URL;
  let tier = "all";
  let port = 9235;
  for (const arg of argv.slice(2)) {
    if (arg.startsWith("--url=")) baseUrl = arg.slice(6).replace(/\/$/, "");
    else if (arg.startsWith("--tier=")) tier = arg.slice(7);
    else if (arg.startsWith("--port=")) port = Number(arg.slice(7)) || 9235;
  }
  return { baseUrl, tier, port };
}

function findBrowser() {
  for (const candidate of BROWSER_CANDIDATES) {
    if (candidate && existsSync(candidate)) return candidate;
  }
  throw new Error(
    "No Chromium/Chrome/Edge binary found. Set CHROME_PATH and re-run.",
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPageTarget(port, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (res.ok) {
        const targets = await res.json();
        const page = targets.find((target) => target.type === "page");
        if (page?.webSocketDebuggerUrl) return page;
      }
    } catch {
      // retry until browser opens remote debugging port
    }
    await sleep(200);
  }
  throw new Error("Timed out waiting for headless browser DevTools target.");
}

class CdpSession {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 0;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      } else if (message.method && this.listeners.has(message.method)) {
        for (const fn of this.listeners.get(message.method)) fn(message.params);
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  once(method, timeoutMs = 12000) {
    return new Promise((resolve) => {
      let settled = false;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          resolve(null);
        }
      }, timeoutMs);
      const list = this.listeners.get(method) || [];
      const handler = (params) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(params);
        }
      };
      list.push(handler);
      this.listeners.set(method, list);
    });
  }

  close() {
    this.ws.close();
  }
}

const EVAL_AUDIT = `(() => {
  const vw = window.innerWidth;
  const docOverflowX = Math.round(document.documentElement.scrollWidth - vw);

  const isVisible = (el) => {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  // Check Safari auto-zoom inputs (< 16px)
  const smallInputs = [];
  for (const el of document.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), select, textarea')) {
    if (!isVisible(el) || el.closest('.menu-panel:not([data-open="true"])')) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 16) {
      smallInputs.push({ tag: el.tagName.toLowerCase(), name: el.getAttribute('name') || el.id || '', fontSize: Math.round(fs * 10) / 10 });
    }
  }

  // Check card/control horizontal overflow hidden by overflow-x: clip
  const cardOverflows = [];
  for (const link of document.querySelectorAll('a[href^="mailto:"]')) {
    if (!isVisible(link) || link.closest('footer')) continue;
    const card = link.closest('article, div[class*="rounded-"], dt');
    if (!card) continue;
    const lr = link.getBoundingClientRect();
    const cr = card.getBoundingClientRect();
    if (lr.right > cr.right + 2) {
      cardOverflows.push({ type: 'mailto', text: link.textContent.trim().slice(0, 32), overflowPx: Math.round(lr.right - cr.right) });
    }
  }

  for (const sel of document.querySelectorAll('select')) {
    if (!isVisible(sel)) continue;
    const card = sel.closest('div[class*="rounded-"]');
    if (!card) continue;
    const sr = sel.getBoundingClientRect();
    const cr = card.getBoundingClientRect();
    if (sr.right > cr.right + 2) {
      cardOverflows.push({ type: 'select', text: sel.getAttribute('name') || 'select', overflowPx: Math.round(sr.right - cr.right) });
    }
  }

  const sliceTrack = document.querySelector('.concerns-slice-track');
  if (sliceTrack && isVisible(sliceTrack)) {
    const overflow = Math.round(sliceTrack.scrollWidth - sliceTrack.clientWidth);
    if (overflow > 4) {
      cardOverflows.push({ type: 'concerns-slice-track', text: 'slice track', overflowPx: overflow });
    }
  }

  const footerEmailInput = document.querySelector('footer form input[type="email"]');
  if (footerEmailInput && isVisible(footerEmailInput)) {
    const w = Math.round(footerEmailInput.getBoundingClientRect().width);
    if (w < 120) {
      cardOverflows.push({ type: 'newsletter-input', text: 'crushed width=' + w + 'px', overflowPx: 120 - w });
    }
  }

  // Check calendar day buttons minimum size
  let minDayCell = null;
  const dayBtns = [...document.querySelectorAll('.grid-cols-7 button')].filter(isVisible);
  if (dayBtns.length) {
    const rects = dayBtns.map((b) => b.getBoundingClientRect());
    const minW = Math.round(Math.min(...rects.map((r) => r.width)) * 10) / 10;
    const minH = Math.round(Math.min(...rects.map((r) => r.height)) * 10) / 10;
    minDayCell = { w: minW, h: minH };
  }

  // Check header overlap with H1
  const header = document.querySelector('.site-header');
  const h1 = document.querySelector('h1');
  let headerOverlapH1 = false;
  if (header && h1 && isVisible(header) && isVisible(h1)) {
    if (h1.getBoundingClientRect().top < header.getBoundingClientRect().bottom - 4) {
      headerOverlapH1 = true;
    }
  }

  // Check HorizontalShowcase enhanced state & panel geometry, plus /stories asymmetric magazine grid integrity
  const showcase = document.querySelector('.horizontal-showcase');
  const showcaseEnhanced = showcase?.getAttribute('data-enhanced') || null;

  const storiesGrid = document.querySelector('.stories-category-grid');
  let storiesGridReport = null;
  if (storiesGrid) {
    const cards = [...storiesGrid.querySelectorAll('article')];
    const gridRect = storiesGrid.getBoundingClientRect();
    const overflowCards = [];
    for (let i = 0; i < cards.length; i++) {
      const r = cards[i].getBoundingClientRect();
      if (r.right > vw + 2 || r.left < -2 || r.width < 180) {
        overflowCards.push('card[' + i + '] [' + Math.round(r.left) + '..' + Math.round(r.right) + '] w=' + Math.round(r.width));
      }
    }
    const cols = getComputedStyle(storiesGrid).gridTemplateColumns.split(' ').filter(Boolean).length;
    storiesGridReport = {
      cardCount: cards.length,
      gridWidth: Math.round(gridRect.width),
      cols,
      overflowCards,
    };
  }

  const showcaseGeometryIssues = [];
  if (showcase && showcaseEnhanced === 'true') {
    const clientW = document.documentElement.clientWidth;
    const panels = [...showcase.querySelectorAll('.horizontal-panel')];
    for (let i = 0; i < panels.length; i++) {
      const pw = Math.round(panels[i].offsetWidth);
      if (Math.abs(pw - clientW) > 4) {
        showcaseGeometryIssues.push('panel[' + i + '] width=' + pw + 'px expected ' + clientW + 'px');
      }
    }
    const heading = showcase.querySelector('.concerns-header h2');
    if (heading) {
      const hr = heading.getBoundingClientRect();
      if (hr.left < 0 || hr.right > vw + 2) {
        showcaseGeometryIssues.push('concerns h2 out of viewport [' + Math.round(hr.left) + '..' + Math.round(hr.right) + ']');
      }
    }
    const activeCard = showcase.querySelector('.concerns-slice-card[data-active="true"]');
    if (activeCard) {
      const cr = activeCard.getBoundingClientRect();
      if (cr.left < -2 || cr.right > vw + 2 || cr.width < 300) {
        showcaseGeometryIssues.push('active slice card misplaced [' + Math.round(cr.left) + '..' + Math.round(cr.right) + '] w=' + Math.round(cr.width));
      }
    }
  }

  return {
    docOverflowX,
    smallInputs,
    cardOverflows,
    minDayCell,
    headerOverlapH1,
    showcaseEnhanced,
    storiesGridReport,
    showcaseGeometryIssues,
  };
})()`;

async function main() {
  const { baseUrl, tier, port } = parseArgs(process.argv);
  try {
    const probe = await fetch(baseUrl, { method: "HEAD" });
    if (!probe.ok) {
      throw new Error(`HTTP ${probe.status}`);
    }
  } catch (error) {
    throw new Error(
      `Cannot reach ${baseUrl} (${error instanceof Error ? error.message : String(error)}). Start the server first (e.g. pnpm start).`,
    );
  }
  const browserPath = findBrowser();
  const profileDir = mkdtempSync(join(tmpdir(), "krdg-responsive-audit-"));
  const selectedViewports =
    tier === "all"
      ? VIEWPORTS
      : VIEWPORTS.filter((viewport) => viewport.tier === tier);

  const browser = spawn(
    browserPath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profileDir}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let failures = 0;

  try {
    const page = await waitForPageTarget(port);
    const cdp = new CdpSession(page.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
      source:
        "try { sessionStorage.setItem('karmarise-skip-loader-once', '1'); localStorage.setItem('karmarise_cookie_consent_v1', 'essential'); } catch {}",
    });

    for (const vp of selectedViewports) {
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.mobile ? 2 : 1,
        mobile: vp.mobile,
      });
      await cdp.send("Emulation.setTouchEmulationEnabled", {
        enabled: vp.touch,
        maxTouchPoints: vp.touch ? 5 : 1,
      });

      const vpIssues = [];

      for (const route of ROUTES) {
        const loaded = cdp.once("Page.loadEventFired", 12000);
        await cdp.send("Page.navigate", { url: `${baseUrl}${route}` });
        await loaded;
        await sleep(550);

        const res = await cdp.send("Runtime.evaluate", {
          expression: EVAL_AUDIT,
          returnByValue: true,
        });
        const report = res.result?.value;
        if (!report) {
          vpIssues.push(`${route}: evaluation failed`);
          continue;
        }

        if (report.docOverflowX > 0) {
          vpIssues.push(
            `${route}: document overflow +${report.docOverflowX}px`,
          );
        }
        if (report.headerOverlapH1) {
          vpIssues.push(`${route}: fixed header overlaps h1`);
        }
        if (report.smallInputs.length > 0) {
          vpIssues.push(
            `${route}: inputs < 16px (${report.smallInputs.map((item) => `${item.tag}[${item.name}]=${item.fontSize}px`).join(", ")})`,
          );
        }
        if (report.cardOverflows.length > 0) {
          vpIssues.push(
            `${route}: clipped overflows (${report.cardOverflows.map((item) => `${item.type}:${item.text}:+${item.overflowPx}px`).join(", ")})`,
          );
        }
        if (
          vp.touch &&
          report.minDayCell &&
          (report.minDayCell.w < 40 || report.minDayCell.h < 44)
        ) {
          vpIssues.push(
            `${route}: small calendar day cells (${report.minDayCell.w}x${report.minDayCell.h}px)`,
          );
        }
        if (
          vp.tier === "ipad" &&
          vp.width < 1024 &&
          report.showcaseEnhanced === "true"
        ) {
          vpIssues.push(
            `${route}: desktop pinned mode active on portrait touch iPad (${vp.width}px, showcase=${report.showcaseEnhanced})`,
          );
        }
        if (
          vp.tier === "laptop" &&
          (route === "/" || route === "/es") &&
          report.showcaseEnhanced !== "true"
        ) {
          vpIssues.push(
            `${route}: desktop HorizontalShowcase not enhanced on laptop`,
          );
        }
        if (route === "/stories" || route === "/es/stories") {
          const grid = report.storiesGridReport;
          if (!grid || grid.cardCount < 7) {
            vpIssues.push(
              `${route}: Stories asymmetric magazine grid missing or incomplete (cards=${grid?.cardCount ?? 0})`,
            );
          } else {
            if (vp.width >= 768 && grid.cols < 12) {
              vpIssues.push(
                `${route}: Stories magazine grid expected 12 columns at ${vp.width}px, got ${grid.cols}`,
              );
            }
            if (grid.overflowCards.length > 0) {
              vpIssues.push(
                `${route}: Stories magazine cards overflow (${grid.overflowCards.join("; ")})`,
              );
            }
          }
        }
        if (report.showcaseGeometryIssues?.length > 0) {
          vpIssues.push(
            `${route}: HorizontalShowcase geometry broken (${report.showcaseGeometryIssues.join("; ")})`,
          );
        }
      }

      if (vpIssues.length === 0) {
        console.log(
          `PASS ${vp.id} (${vp.width}x${vp.height}) across ${ROUTES.length} routes`,
        );
      } else {
        failures += vpIssues.length;
        console.log(
          `FAIL ${vp.id} (${vp.width}x${vp.height}) - ${vpIssues.length} issue(s):`,
        );
        for (const issue of vpIssues) console.log(`  - ${issue}`);
      }
    }

    cdp.close();
  } finally {
    browser.kill();
    await new Promise((resolve) => {
      if (browser.exitCode !== null) resolve();
      else {
        browser.once("exit", resolve);
        setTimeout(resolve, 1500);
      }
    });
    try {
      rmSync(profileDir, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 200,
      });
    } catch {
      // ignore lingering OS file lock on temp profile dir
    }
  }

  if (failures > 0) {
    console.error(`\nResponsive audit failed with ${failures} issue(s).`);
    process.exit(1);
  }
  console.log("\nResponsive audit passed cleanly across all checked tiers.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
