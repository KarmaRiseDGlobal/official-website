# Agent guidance

- Domain: Read `CONTEXT.md` before changing business terminology, brand relationships, public copy, or content models.
- Styling: Use Tailwind CSS and the tokens in `src/app/globals.css` by default. Reach for styled-components only when component-scoped dynamic styles make the result clearer.
- Motion: Use CSS for simple transitions and GSAP for deliberate sequences. Add Three.js only when an approved design requires real-time 3D.
- Integrations: Sanity, Brevo, hosting, live chat, WhatsApp automation, and localization tooling remain deferred until their requirements are defined.
- Verification: Run `pnpm check` and `pnpm build` after code or configuration changes. Exercise changed UI in a running production build when behavior is affected.
