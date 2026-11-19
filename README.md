# KarmaRise D Global website

This is the bilingual website for KarmaRise D Global. It presents the Manufacturing Programmes alongside Stories, Almarise, the Women's Training Initiative, a Product Brief intake flow, and contact routing.

## Local development

1. Install Node.js 24 and pnpm 11.
2. Copy `.env.example` to `.env.local` and fill in the required keys. If you run the Sanity CLI, also keep those variables in `.env`.
3. Run `pnpm install`.
4. Run `pnpm dev`.

Use `pnpm check` to run ESLint, TypeScript type checking, and Prettier formatting checks. Use `pnpm build` to verify the Next.js production build.

## Architecture and integrations

- **Multilingual routes and SEO.** English pages sit under `/` and Spanish pages sit under `/es`, backed by `LanguageProvider` in `src/context/language-context.tsx`, localized page metadata, `hreflang` alternates, and a dynamic sitemap in `src/app/sitemap.ts`.
- **Sanity CMS.** Editorial Stories and Newsletter Issues live in Sanity via `sanity.config.ts` and `src/sanity/`. `src/lib/sanity.ts` fetches published entries and falls back to `src/data/stories.ts` when needed.
- **Brevo.** Newsletter subscriptions, EN and ES list routing, preference updates, Sanity campaign draft sync, and delivery webhooks run through `src/lib/brevo.ts`, `src/lib/brevo-campaigns.ts`, `scripts/setup-brevo.mjs`, `src/app/api/newsletter/`, and `src/app/api/brevo/webhook/`.
- **Resend.** Contact topic routing and Product Brief submissions send through `src/lib/resend.ts` from `src/app/api/contact/` and `src/app/api/product-brief/`.
- **Cloudflare Workers hosting & AI chatbox.** The production app deploys to the `official-website` Cloudflare Worker via `@opennextjs/cloudflare`, `open-next.config.ts`, and `wrangler.jsonc`. The bilingual assistant (`src/components/chat-widget.tsx` and `src/app/api/chat/route.ts`) uses the Workers AI (`AI`) and edge rate-limiting (`CHAT_RATE_LIMITER`) bindings with Turnstile session verification and fallback handoffs to `/product-brief`, `/contact`, and WhatsApp.

## Scripts and deployment

- `pnpm studio` starts Sanity Studio locally; `pnpm studio:deploy` deploys Studio.
- `pnpm sanity:seed` seeds Stories and categories from `scripts/seed-sanity-stories.mjs`.
- `pnpm brevo:setup` creates or updates Brevo attributes, lists, and welcome templates via `scripts/setup-brevo.mjs`.
- `pnpm cf:build` builds the OpenNext Cloudflare Worker bundle in `.open-next/`.
- `pnpm cf:preview` runs the Cloudflare Worker locally with Wrangler.
- `pnpm cf:deploy` builds and deploys the Worker to Cloudflare.

## Deferred work

- European languages beyond English and Spanish
- External localization management tooling
- Human live chat agent inbox and WhatsApp Business automation beyond the static footer link
- Three.js
