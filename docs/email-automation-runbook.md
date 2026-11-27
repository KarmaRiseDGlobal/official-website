# KarmaRise D Global email automation runbook

Operational reference for syncing templates, wiring Brevo Automation workflows, and publishing biweekly bilingual newsletters across `karmarisedglobal.com`.

## 1. Command cheatsheet

| Command                 | What it does                                                                                                                                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm emails:preview`   | Renders all 58 offline EN and ES previews (automated sequences, Resend transactional emails, and Newsletter Issues #01 to #16) into `output/newsletter-previews/index.html`.                                         |
| `pnpm brevo:setup`      | Ensures Brevo contact attributes (`PRIMARY_TRACK`, `UTM_SOURCE`, `UTM_MEDIUM`, `UTM_CAMPAIGN`, `UTM_CONTENT`, `REFERRAL_SOURCE`, `REFERRAL_CODE`, `COMPANY`), lists, and Welcome Email 1 via the canonical renderer. |
| `pnpm emails:sync`      | Uploads sequence images to Sanity CDN and creates or updates all 20 automated Brevo SMTP templates (`--dry-run` validates locally without touching Brevo).                                                           |
| `pnpm newsletter:sync`  | Uploads issue hero images to Sanity CDN, syncs Issues #01 to #16 to Sanity CMS, and creates or updates Brevo campaign drafts (never sends automatically).                                                            |
| `pnpm emails:analytics` | Computes closed-window (7+ day) EN and ES campaign metrics from Brevo with segment reconciliation (`--demo` previews output offline).                                                                                |

## 2. Brevo Automation workflows to activate

Create these three visual workflows in **Brevo -> Automation -> Workflows** using the exact API-synced SMTP template names and custom events below.

### Workflow A: KarmaRise Stories Welcome Sequence (Days 0 to 14)

- **Immediate Email 1 (`W1`)**: Sent directly by `/api/newsletter` via Brevo SMTP Template #3 (`Welcome - KarmaRise Stories (EN)`) or #4 (`Bienvenida - Historias KarmaRise (ES)`) so new subscribers receive it within seconds, with dynamic `params.TRACK_NOTE` personalization.
- **Workflow Trigger**: Custom event `newsletter_subscribed` (fired by [brevo.ts](file:///g:/Gamoventure/Organisation/Kamarise/src/lib/brevo.ts) on first subscription).
- **Exit conditions**: Contact triggers `product_brief_submitted`, `call_booked`, unsubscribes, or hard-bounces.
- **Steps (weekday sends, 09:30 Europe/Madrid)**:
  1. Wait **2 days** -> Branch on `contact.LANGUAGE == "ES"`:
     - EN: `[AUTO][EN] Welcome 02 · Why we built this across two countries`
     - ES: `[AUTO][ES] Bienvenida 02 · Por qué levantamos esto entre dos países`
  2. Wait **3 days** (Day 5) -> Branch on `LANGUAGE`:
     - EN: `[AUTO][EN] Welcome 03 · Why phone photos lie about tan leather`
     - ES: `[AUTO][ES] Bienvenida 03 · Por qué una foto engaña con el color`
  3. Wait **4 days** (Day 9) -> Branch on `LANGUAGE`:
     - EN: `[AUTO][EN] Welcome 04 · What we make across India, and why`
     - ES: `[AUTO][ES] Bienvenida 04 · Qué fabricamos en la India y cómo`
  4. Wait **5 days** (Day 14) -> Check `product_brief_submitted` and `call_booked` have NOT occurred -> Branch on `LANGUAGE`:
     - EN: `[AUTO][EN] Welcome 05 · Whenever an idea is ready on your desk`
     - ES: `[AUTO][ES] Bienvenida 05 · Cuando tengas una idea sobre la mesa`

### Workflow B: Product Brief Day 4 Gentle Check-In

- **Immediate receipt**: Sent directly by `/api/product-brief` via Resend (never adds leads to marketing lists).
- **Workflow Trigger**: Custom event `product_brief_submitted` (emitted only when the visitor accepted optional attribution cookies via the Cookie Consent Banner).
- **Exit condition**: Custom event `call_booked`.
- **Steps**:
  1. Wait **4 days** (weekday, 10:00 Europe/Madrid).
  2. Confirm `call_booked` has NOT occurred.
  3. Branch on `event.language == "es"` (so existing newsletter subscribers keep their chosen newsletter language without silent attribute overwrites):
     - EN: `[AUTO][EN] Brief Follow-Up Day 4 · Quick note from Alma`
     - ES: `[AUTO][ES] Seguimiento Briefing Día 4 · Nota rápida de Alma`

### Workflow C: 90-Day Warm Reader Catch-Up

- **Workflow Trigger**: Contact on `KarmaRise Stories (EN)` or `KarmaRise Stories (ES)` with 90 days since last email click and zero confirmed unique opens across recent campaigns (allow re-entry at most once every 180 days).
- **Exit conditions**: Any email link click, `newsletter_language_switched` event, reply, or unsubscribe.
- **Steps**:
  1. Day 90 -> Branch on `LANGUAGE`:
     - EN: `[AUTO][EN] Re-engagement 01 · A warm hello from India and Spain`
     - ES: `[AUTO][ES] Reactivación 01 · Un saludo desde la India y España`
  2. Wait **7 days** (Day 97) -> Branch on `LANGUAGE`:
     - EN: `[AUTO][EN] Re-engagement 02 · Two things we learned lately`
     - ES: `[AUTO][ES] Reactivación 02 · Dos cosas que aprendimos sobre el terreno`
  3. Wait **7 days** (Day 104) -> Branch on `LANGUAGE`:
     - EN: `[AUTO][EN] Re-engagement 03 · What would you love to read next?`
     - ES: `[AUTO][ES] Reactivación 03 · ¿Qué te apetece leer en próximas cartas?`
  4. Leave subscribers on their chosen biweekly list with zero passive-aggressive removal ultimatums; every marketing email includes a language-switch confirmation link (protected against automated email link scanners) and clean unsubscribe controls in the footer.

## 3. Manual Post-Call Written Conclusions template

Right after every Google Meet call, Alma can send `[TEMPLATE][EN] Post-Call Written Conclusions · Alma` or `[TEMPLATE][ES] Conclusiones de la reunión · Alma` (passing `CATEGORY`, `MATERIAL_NOTES`, `NDA_STATUS`, `NEXT_STEP` params or copying from the preview desk).

## 4. Biweekly publishing rhythm (Issues #01 to #16)

1. Review the upcoming issue in Sanity Studio (`03 · Newsletter Issues`) or `output/newsletter-previews/index.html`.
2. Set status to **Approved** in Sanity Studio -> webhook syncs both `[EN]` and `[ES]` drafts to Brevo automatically without sending.
3. Send one test email to `stories@karmarisedglobal.com`, click every link to confirm UTM parameters land cleanly, then schedule for Tuesday or Thursday at **09:30 CET/CEST**.
