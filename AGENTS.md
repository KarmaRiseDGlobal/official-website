# Agent guidance

- **Domain.** Read `CONTEXT.md` before changing business terminology, brand relationships, public copy, or content models.
- **Voice and localization.** Read `LANGUAGE.md` before writing, editing, or translating public copy, Stories, newsletters, email templates, or UI text in English, Spanish, or any other language.
- **Bilingual routes and SEO.** Keep English pages under `/` and Spanish pages under `/es` in sync, including server-rendered `<html lang>`, localized metadata, `hreflang` alternates, and sitemap coverage. Do not add social media links.
- **Styling.** Use Tailwind CSS and the tokens in `src/app/globals.css` and `src/app/tokens.css` by default. Reach for `styled-components` only when component-scoped dynamic styles make the result clearer.
- **Motion.** Use CSS for simple transitions and GSAP for deliberate sequences. Add Three.js only when an approved design requires real-time 3D.
- **Active integrations.** Maintain Sanity CMS schemas and queries in `sanity.config.ts`, `src/sanity/`, and `src/lib/sanity.ts`, Brevo newsletter and campaign handlers in `src/lib/brevo.ts`, `src/lib/brevo-campaigns.ts`, and `scripts/setup-brevo.mjs`, Resend email handlers in `src/lib/resend.ts`, and Cloudflare Workers configuration in `wrangler.jsonc` and `open-next.config.ts`.
- **Deferred work.** Keep additional European languages beyond English and Spanish, external localization tooling, live chat, and WhatsApp Business automation beyond the static footer link deferred until the team defines their requirements.
- **Verification.** Run `pnpm check` and `pnpm build` after code or configuration changes, and run `pnpm cf:build` when changing Next.js, OpenNext, or Cloudflare configuration. Exercise changed UI in a running production build when behavior is affected.
