import assert from "node:assert/strict";
import test from "node:test";

const hooksModuleUrl = new URL("./test-hooks.mts", import.meta.url).href;
const hooksModule = (await import(hooksModuleUrl)) as {
  registerTestModuleHooks: () => void;
};
hooksModule.registerTestModuleHooks();

const {
  getCalEventConfig,
  isValidIanaTimeZone,
  mapCallLanguageOptionValue,
  normalizeCallDuration,
  normalizeCallLanguage,
} = await import("@/lib/cal");
const { resetRateLimitStore } = await import("@/lib/security");
const { GET: slotsGet } = await import("@/app/api/book-call/slots/route");
const { POST: bookCallPost } = await import("@/app/api/book-call/route");

interface RecordedFetch {
  url: string;
  method: string;
  headers: Record<string, string>;
  bodyText: string;
}

async function withMockedFetch(
  responder: (
    url: string,
    init: RequestInit | undefined,
  ) => Promise<Response> | Response,
  run: (calls: RecordedFetch[]) => Promise<void>,
): Promise<void> {
  const originalFetch = globalThis.fetch;
  const calls: RecordedFetch[] = [];

  globalThis.fetch = (async (
    input: string | URL | Request,
    init?: RequestInit,
  ) => {
    const url = typeof input === "string" ? input : input.toString();
    const headers: Record<string, string> = {};
    if (init?.headers) {
      const h = new Headers(init.headers);
      h.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
      });
    }
    const bodyText = typeof init?.body === "string" ? init.body : "";
    calls.push({
      url,
      method: (init?.method ?? "GET").toUpperCase(),
      headers,
      bodyText,
    });
    return responder(url, init);
  }) as typeof fetch;

  try {
    await run(calls);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("cal helpers resolve bilingual event configs, languages, and timezones", () => {
  assert.equal(normalizeCallDuration("15"), "15");
  assert.equal(normalizeCallDuration("30"), "30");
  assert.equal(normalizeCallDuration("invalid"), "30");

  assert.equal(normalizeCallLanguage("es", "en"), "es");
  assert.equal(normalizeCallLanguage("Portuguese", "en"), "pt");
  assert.equal(normalizeCallLanguage("unknown", "es"), "es");

  assert.equal(getCalEventConfig("en", "30").slug, "product-brief-call");
  assert.equal(getCalEventConfig("en", "15").slug, "quick-intro-call");
  assert.equal(getCalEventConfig("es", "30").slug, "reunion-product-brief");
  assert.equal(getCalEventConfig("es", "15").slug, "llamada-rapida");

  assert.equal(mapCallLanguageOptionValue("en", "pt"), "Portuguese");
  assert.equal(mapCallLanguageOptionValue("es", "es"), "Español");

  assert.equal(isValidIanaTimeZone("Europe/Madrid"), true);
  assert.equal(isValidIanaTimeZone("Europe/Lisbon"), true);
  assert.equal(isValidIanaTimeZone("Asia/Kolkata"), true);
  assert.equal(isValidIanaTimeZone("Mars/Olympus"), false);
});

test("GET /api/book-call/slots returns 503 when CAL_ALMA_API_KEY is missing and fetches Cal slots when present", async () => {
  resetRateLimitStore();
  const prevCalKey = process.env.CAL_ALMA_API_KEY;
  delete process.env.CAL_ALMA_API_KEY;

  try {
    const missingRes = await slotsGet(
      new Request(
        "https://karmarisedglobal.com/api/book-call/slots?language=en&duration=30&month=2026-11&timeZone=Europe/Madrid",
        { headers: { "cf-connecting-ip": "203.0.113.101" } },
      ),
    );
    assert.equal(missingRes.status, 503);

    process.env.CAL_ALMA_API_KEY = "cal_live_test_key";
    await withMockedFetch(
      () =>
        new Response(
          JSON.stringify({
            status: "success",
            data: {
              "2026-11-23": [
                { start: "2026-11-23T09:00:00.000+01:00" },
                { start: "2026-11-23T10:30:00.000+01:00" },
              ],
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      async (calls) => {
        const res = await slotsGet(
          new Request(
            "https://karmarisedglobal.com/api/book-call/slots?language=es&duration=15&month=2026-11&timeZone=Europe/Lisbon",
            { headers: { "cf-connecting-ip": "203.0.113.102" } },
          ),
        );
        assert.equal(res.status, 200);
        const body = (await res.json()) as {
          ok: boolean;
          timeZone: string;
          duration: string;
          slotsByDate: Record<string, string[]>;
        };
        assert.equal(body.ok, true);
        assert.equal(body.timeZone, "Europe/Lisbon");
        assert.equal(body.duration, "15");
        assert.deepEqual(body.slotsByDate["2026-11-23"], [
          "2026-11-23T09:00:00.000+01:00",
          "2026-11-23T10:30:00.000+01:00",
        ]);
        assert.equal(calls.length, 1);
        assert.equal(calls[0]?.headers["cal-api-version"], "2024-09-04");
        assert.match(calls[0]?.url ?? "", /eventTypeId=8003655/);
        assert.match(calls[0]?.url ?? "", /timeZone=Europe%2FLisbon/);
      },
    );
  } finally {
    if (prevCalKey === undefined) {
      delete process.env.CAL_ALMA_API_KEY;
    } else {
      process.env.CAL_ALMA_API_KEY = prevCalKey;
    }
  }
});

test("POST /api/book-call validates input, creates Cal bookings, handles honeypot and conflicts", async () => {
  resetRateLimitStore();
  const prevCalKey = process.env.CAL_ALMA_API_KEY;
  const prevTurnstile = process.env.TURNSTILE_SECRET_KEY;
  process.env.CAL_ALMA_API_KEY = "cal_live_test_key";
  delete process.env.TURNSTILE_SECRET_KEY;

  const futureSlot = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();

  try {
    // 1. Honeypot short-circuits silently
    await withMockedFetch(
      () => new Response("{}", { status: 200 }),
      async (calls) => {
        const honeyRes = await bookCallPost(
          new Request("https://karmarisedglobal.com/api/book-call", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "cf-connecting-ip": "203.0.113.110",
            },
            body: JSON.stringify({
              siteLanguage: "en",
              name: "Bot",
              email: "bot@example.com",
              companyWebsite: "https://spam.example",
            }),
          }),
        );
        assert.equal(honeyRes.status, 200);
        assert.equal(calls.length, 0);
      },
    );

    // 2. Invalid email returns 400
    const invalidRes = await bookCallPost(
      new Request("https://karmarisedglobal.com/api/book-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cf-connecting-ip": "203.0.113.111",
        },
        body: JSON.stringify({
          siteLanguage: "en",
          duration: "30",
          start: futureSlot,
          timeZone: "Europe/Madrid",
          name: "Lucia",
          email: "not-an-email",
          callLanguage: "es",
        }),
      }),
    );
    assert.equal(invalidRes.status, 400);

    // 3. Valid booking forwards expected Cal v2 payload and returns meetingUrl
    await withMockedFetch(
      () =>
        new Response(
          JSON.stringify({
            status: "success",
            data: {
              id: 99,
              uid: "bkg_test_123",
              title: "Reunión de Product Brief (30 min)",
              status: "ACCEPTED",
              start: futureSlot,
              end: futureSlot,
              meetingUrl: "https://meet.google.com/abc-defg-hij",
            },
          }),
          { status: 201, headers: { "Content-Type": "application/json" } },
        ),
      async (calls) => {
        const okRes = await bookCallPost(
          new Request("https://karmarisedglobal.com/api/book-call", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "cf-connecting-ip": "203.0.113.112",
            },
            body: JSON.stringify({
              siteLanguage: "es",
              duration: "30",
              start: futureSlot,
              timeZone: "Europe/Madrid",
              name: "Lucía Navarro",
              email: "lucia@marca.es",
              company: "Casa Sol",
              callLanguage: "pt",
              notes: "Bolsos de piel reciclada, 250 unidades.",
            }),
          }),
        );
        assert.equal(okRes.status, 200);
        const body = (await okRes.json()) as {
          ok: boolean;
          booking: {
            uid: string;
            meetingUrl: string | null;
            callLanguage: string;
          };
        };
        assert.equal(body.ok, true);
        assert.equal(body.booking.uid, "bkg_test_123");
        assert.equal(
          body.booking.meetingUrl,
          "https://meet.google.com/abc-defg-hij",
        );
        assert.equal(body.booking.callLanguage, "pt");

        assert.equal(calls.length, 1);
        assert.equal(calls[0]?.headers["cal-api-version"], "2024-08-13");
        const sentPayload = JSON.parse(calls[0]?.bodyText || "{}") as {
          eventTypeId: number;
          attendee: { language: string; timeZone: string };
          bookingFieldsResponses: Record<string, string>;
        };
        assert.equal(sentPayload.eventTypeId, 8003654);
        assert.equal(sentPayload.attendee.language, "pt");
        assert.equal(sentPayload.attendee.timeZone, "Europe/Madrid");
        assert.equal(sentPayload.bookingFieldsResponses.company, "Casa Sol");
        assert.equal(
          sentPayload.bookingFieldsResponses["call-language"],
          "Portugués",
        );
      },
    );

    // 4. Slot conflict maps cleanly to 409 slot_unavailable
    await withMockedFetch(
      () =>
        new Response(
          JSON.stringify({
            status: "error",
            message: "Selected slot is not available anymore.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        ),
      async () => {
        const conflictRes = await bookCallPost(
          new Request("https://karmarisedglobal.com/api/book-call", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "cf-connecting-ip": "203.0.113.113",
            },
            body: JSON.stringify({
              siteLanguage: "en",
              duration: "15",
              start: futureSlot,
              timeZone: "Europe/Lisbon",
              name: "Marta Silva",
              email: "marta@atelier.pt",
              callLanguage: "pt",
            }),
          }),
        );
        assert.equal(conflictRes.status, 409);
        const body = (await conflictRes.json()) as { code?: string };
        assert.equal(body.code, "slot_unavailable");
      },
    );
  } finally {
    if (prevCalKey === undefined) {
      delete process.env.CAL_ALMA_API_KEY;
    } else {
      process.env.CAL_ALMA_API_KEY = prevCalKey;
    }
    if (prevTurnstile === undefined) {
      delete process.env.TURNSTILE_SECRET_KEY;
    } else {
      process.env.TURNSTILE_SECRET_KEY = prevTurnstile;
    }
  }
});
