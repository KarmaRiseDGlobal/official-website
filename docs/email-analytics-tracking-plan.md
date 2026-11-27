# KarmaRise D Global email analytics tracking plan

- **Stack**: Brevo Campaigns + Brevo Events API (`/v3/events`) + Brevo Webhooks (`/api/brevo/webhook` -> Sanity `newsletterIssue.analytics`) + consent-gated first-party attribution handoff ([client-handoff.ts](file:///g:/Gamoventure/Organisation/Kamarise/src/lib/client-handoff.ts)) + Resend internal attribution lines + Cal.com booking metadata.
- **Privacy compliance**: Zero third-party ad pixels, zero PII in UTM parameters or event properties, and explicit Cookie Consent Banner gating (`attributionConsent === true`) for 30-day first-party attribution storage (`karmarise_attribution_v1`) and non-newsletter Brevo Events (GDPR / LSSI-CE compliant with [cookie-policy-client.tsx](file:///g:/Gamoventure/Organisation/Kamarise/src/views/cookie-policy-client.tsx)).
- **Last updated**: 2026-11-27

## 1. Decisions this tracking plan informs

1. Which website signup surface (`Footer`, `Stories Page`, `Story: <slug>`, `AlmaRise D Brand Page`, `Womens Training Initiative Page`) and partner/creator channel brings engaged subscribers who read and convert.
2. How Peninsular Spanish (`es`) and English (`en`) editions perform independently without hiding segment drops in combined averages, and how often readers switch languages.
3. Which automated welcome steps (`welcome-01` to `welcome-05`), biweekly letters (`issue-01` to `issue-16`), podcasts, newsletters, and creator campaigns generate qualified Product Briefs and video call bookings.
4. When unsubscribe (`> 0.50%`) or bounce/spam (`> 0.10%`) thresholds require list hygiene or copy adjustment.

## 2. Event taxonomy (Object-Action)

| Event name                     | Trigger                                                                              | Non-PII properties                                                                                                                                                                              | Destination                                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `newsletter_subscribed`        | New subscriber added in `POST /api/newsletter`                                       | `language`, `signup_source`, `primary_track`, `tracks`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `referral_code`, `referral_source`, `landing_path`               | Brevo Events API (`/v3/events`)                                                                              |
| `newsletter_language_switched` | Subscriber confirms EN/ES language change in `/api/newsletter/preferences`           | `language`, `utm_campaign`                                                                                                                                                                      | Brevo Events API (`/v3/events`) + Brevo EN/ES & track list migration                                         |
| `product_brief_submitted`      | Product Brief accepted in `POST /api/product-brief` (when `attributionConsent=true`) | `language`, `product_category`, `readiness_stage`, `has_attachments`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `referral_code`, `referral_source`, `landing_path` | Brevo Events API (trigger/exit only; never adds to marketing list or overwrites `LANGUAGE`) + Resend alert   |
| `call_booked`                  | Cal.com booking confirmed in `POST /api/book-call` (when `attributionConsent=true`)  | `language`, `site_language`, `call_language`, `duration_minutes`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `referral_code`, `referral_source`, `landing_path`     | Brevo Events API (exits Welcome W5 and Day 4 Brief check-in; never overwrites `LANGUAGE`) + Cal.com metadata |
| `contact_submitted`            | Contact enquiry sent in `POST /api/contact` (when `attributionConsent=true`)         | `language`, `topic`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `referral_code`, `referral_source`, `landing_path`                                                  | Brevo Events API + Resend internal alert                                                                     |

## 3. UTM and partner attribution naming standard

Enforced in code via `appendEmailUtm()` and `sanitizeSessionAttribution()` in [email-analytics.ts](file:///g:/Gamoventure/Organisation/Kamarise/src/lib/email-analytics.ts):

- **All lowercase, hyphen-separated** (no spaces, underscores, or uppercase) for UTM tokens and `ref`/`code` tokens.
- **Zero PII** in query parameters or event properties (values containing `@` are dropped automatically).
- **Email campaigns (Brevo & Resend)**:
  - `utm_source`: `brevo` (automations and newsletters) or `resend` (transactional confirmations).
  - `utm_medium`: `email`.
  - `utm_campaign`: `{flow-or-issue}-{lang}`, for example `welcome-02-en`, `welcome-05-es`, `issue-09-es`, `brief-confirmation-es`, `brief-followup-01-en`, `reengage-03-es`.
  - `utm_content`: placement token, for example `primary-cta`, `secondary-call-link`, `ps-almarise-link`, `ps-cta`, `hero-image`, `book-call-cta`.
- **Partner, podcast, newsletter-sponsor, and creator campaigns**:
  - `utm_source`: lowercase partner or creator slug, for example `modaes-newsletter`, `maria-madrid`, `retail-cast-es`, `b2b-retail-podcast`.
  - `utm_medium`: `podcast` | `newsletter-sponsor` | `creator` | `gifting` | `linkedin-partner` | `social`.
  - `utm_campaign`: `{track}-{wave}-{lang}`, for example `b2b-q2-es`, `reborn-seeding-es`.
  - `utm_content`: `{slot-or-format}`, for example `midroll-1`, `primary-slot`, `reel-bio`, `story-link`.
  - `ref` / `code`: optional vanity/partner token forwarded as `referral_code`.
  - `referralSource`: optional self-reported `"How did you hear about us?"` answer captured directly in Resend internal alerts, Cal.com metadata, and Brevo `REFERRAL_SOURCE` / `referral_source`.

## 4. Webhook and segment accounting rules

Implemented in [webhook/route.ts](file:///g:/Gamoventure/Organisation/Kamarise/src/app/api/brevo/webhook/route.ts) and [email-analytics.ts](file:///g:/Gamoventure/Organisation/Kamarise/src/lib/email-analytics.ts):

- **No open double-counting**: `unique_opened` increments `analytics.openedCount`; raw `opened` increments `analytics.totalOpenedCount` separately.
- **Segment isolation**: Webhook events increment both `analytics.*` totals and per-language counters (`analytics.en.*` or `analytics.es.*`) based on matching `brevoCampaignIdEn` vs `brevoCampaignIdEs`.
- **Apple Mail Privacy Protection (MPP)**: Never judge email success by raw open rate against external benchmarks. Track unique opens strictly as a directional trend within each language list, and optimize for **reply rate** (Welcome 1 target >= 5%), **click-through rate** (target 2% to 5%), and **Product Brief / Call conversions**.
- **Closed observation windows**: `pnpm emails:analytics` marks any campaign sent less than **7 days** ago as `PENDING` and excludes it from closed-window segment denominators so partial-window sends never distort rates.
- **Reconciliation check**: Every report verifies `EN closed + ES closed == Combined closed` automatically.

## 5. Health alert thresholds (closed sends with >= 25 deliveries)

| Metric                       | Target   | Alert threshold | Action                                                                           |
| ---------------------------- | -------- | --------------- | -------------------------------------------------------------------------------- |
| Welcome 1 reply rate         | >= 5%    | < 2%            | Tighten opening hook or simplify reply prompt                                    |
| Campaign click rate (CTR)    | 2% to 5% | < 2%            | Test clearer single CTA label and placement                                      |
| Unsubscribe rate             | < 0.50%  | > 0.50%         | Audit expectation alignment and frequency                                        |
| Bounce + spam complaint rate | < 0.10%  | > 0.10%         | Audit list acquisition sources, suppress hard bounces, and verify SPF/DKIM/DMARC |
