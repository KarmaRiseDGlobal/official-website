# Translation decisions

## YYYY-MM-DD

- Decision:
- Context:
- Locale:
- Status: draft

## 2026-11-22

- Decision: Use `Cuéntanos tu idea (1 min)` as the primary low-friction CTA across navigation, Home, and `/es/manufacturing` (with category variants `Cuéntanos tu idea de bolsos de piel (1 min)` and `Cuéntanos tu idea de ropa (1 min)`), paired with `Reserva una llamada gratis de 15 min con Alma` and `Escribe a Alma por WhatsApp`.
- Context: Peninsular Spanish transcreation of `Share your product idea (1 min)`, keeping familiar `de tú a tú` address while using `vosotros` only in FAQ questions directed by the reader to Alma and Shirish.
- Locale: es-ES
- Status: approved

- Decision: Keep `shrug` untranslated as `shrug` (plural `shrugs`) in Spanish copy rather than translating it to `torera` or `chaqueta ligera`. Supersedes the earlier draft decision that mapped `shrugs` to `toreras`; added `shrug` to `protected-terms.txt` and `glossary.csv`.
- Context: Project owner terminology directive on 2026-11-22 covering Home, Manufacturing, Almarise, and `public/llms.txt`.
- Locale: es-ES
- Status: approved

- Decision: Translate `soft carryalls` as `bolsón` (plural `bolsones`, with acute accent on the final `o`), replacing both `bolsos blandos de diario` and `capazos blandos`.
- Context: Project owner terminology directive on 2026-11-22 covering Home, Manufacturing, Product Brief form, and `public/llms.txt`.
- Locale: es-ES
- Status: approved

- Decision: Translate `pre-screened sample` / `pre-screened sampling` as `muestra para valoración` (plural `muestras para valoración`). Supersedes the earlier draft decision that used `muestras filtradas antes del envío` and `muestra física filtrada en la India`.
- Context: Project owner terminology directive on 2026-11-22 covering Home, Manufacturing, How we work, About, Product Brief, SEO metadata, structured data, and `public/llms.txt`.
- Locale: es-ES
- Status: approved

- Decision: Translate `unbleached chemical-free recycled cardboard care hangtags` as `etiquetas de cartón reciclado sin blanquear, libre de químicos` (concise label variant: `etiquetas cartón reciclado sin blanquear, libre de químicos`), and include `recycled` in English source copy as well for EN/ES parity.
- Context: Project owner terminology directive on 2026-11-22 covering Home, Manufacturing, How we work, and `public/llms.txt`.
- Locale: en-GB, es-ES
- Status: approved

- Decision: Translate `open-door workshop audits` as `auditorías externas`, replacing `auditorías a puerta abierta`.
- Context: Project owner terminology directive on 2026-11-22 covering About (`src/data/about-content.ts`) and workshop auditing copy.
- Locale: es-ES
- Status: approved

- Decision: Translate `surprise repacking fees` as `costes imprevistos de reembalaje`.
- Context: `/es/manufacturing` pre-production agreements (`sec-7-agreements`).
- Locale: es-ES
- Status: approved

- Decision: Synced approved `.translation/` configuration (`project-brief.md`, `style-guide.md`, `glossary.csv`, `protected-terms.txt`) and rebound `setup-approval.json` hashes to include renamed routes (`/manufacturing`, `/how-we-work`), new content modules, the 2026-11-22 `CONTEXT.md` website content tone rule, and all 30 promoted terms.
- Context: Full-site bilingual terminology promotion and approval cycle on 2026-11-22.
- Locale: en-GB, es-ES
- Status: approved

- Decision: Use `Envíame la próxima carta` as the Peninsular Spanish (`es-ES`) newsletter CTA for `Send me the next letter` on `/es/stories` (hero secondary action and form submit button), paired with `Edición en español. Cambia el idioma a English para recibir las cartas en inglés.` above the email input.
- Context: Transcreation of the `/stories` editorial hub content document into `es-ES`, keeping familiar `de tú a tú` address, warm founder voice, and parity with the English CTA approved by the project owner.
- Locale: es-ES
- Status: draft

## 2026-11-23

- Decision: Replace `workshop floor`, `sales floor`, `a pie de taller`, generic `mesas de corte`, and repetitive `workshops` / `talleres` with operational facility and on-ground vocabulary (`production sites`, `production units`, `manufacturing units`, `facilities`, `on the ground` in `en-GB`; `unidades de producción`, `puntos de producción`, `lugares de producción`, `fábricas de corte familiar`, `sobre el terreno`, `a pie de obra` in `es-ES`), using `taller colaborador` sparingly.
- Context: Alma's 2026-11-23 bilingual EN/ES landing page redlines (flagged across meta description, menu aside, Hero, positioning, capabilities, Panel 1, and FAQs).
- Locale: en-GB, es-ES
- Status: approved

- Decision: Always write `Spain and the rest of Europe` (`España y el resto de Europa` or `España o en algún lugar de Europa`) rather than `Spain and Europe` (`España y Europa`), and name all four core Indian leather and craft hubs (**Kolkata / Calcuta, Kanpur, Agra, Chennai**) alongside Maharashtra oversight when citing Indian production geography.
- Context: Alma's 2026-11-23 bilingual landing page redlines (Spain-in-Europe correction repeated 6 times in ES; 4-city Indian hub list added in EN Section 3 intro).
- Locale: en-GB, es-ES
- Status: approved

- Decision: Avoid `bulk cutting`, `cutting bulk materials`, and literal `cortar la producción` in public-facing headlines and FAQs; describe the actual pre-production milestone (`before cutting starts`, `before production begins` / `antes de comenzar con el corte de las piezas`, `antes de proceder a la producción`). Avoid `filtrar` / `muestra física filtrada` and secretive `en privado` phrasing in Spanish; use `revisamos`, `muestra para valoración`, or `muestra física previamente revisada y aprobada por ti`.
- Context: Alma's 2026-11-23 bilingual landing page redlines across Section 3.01, Panel 1 Card 03, Stage 04, and FAQ 4.
- Locale: en-GB, es-ES
- Status: approved

- Decision: Standardize Alma's native Peninsular Spanish (`es-ES`) web phrasing and eliminate English UI/copy calques: `curtido vegetal` (replacing `curtición vegetal`), `conclusiones de la reunión` (replacing stiff `acta` in warm web copy), `comercios` alongside `marcas`, `ofrecer moda a medida`, `Solo tú que subes el cierre de tu tienda cada día`, `comprar a un mayorista`, `Seguimos tu pedido` (KarmaRise owns tracking), `prendas de uso diario` (never `capas`), `dar el salto` in written web copy, `completar tu briefing` (never `prerrellenar`), `Selecciona en qué categoría de producto vas a trabajar` (never `Deja tu categoría preseleccionada`), `en la puerta de tu negocio`, `colocar directamente en el escaparate`, `corte incómodo`, `textura`, `acabados`, `entre otros` on fruit/plant-waste lists, and `strap drop` (`caída del asa`) in EN/ES handbag ergonomics.
- Context: Alma's 2026-11-23 bilingual landing page redlines; also enforce strict grammatical person consistency (no 3rd-person subject with 1st-person verb, no `tú` to `su` drift), KarmaRise-led physical swatch creation phrasing, explicit NDA reassurance, and zero consecutive language-list repetition in the Hero.
- Locale: en-GB, es-ES
- Status: approved

- Decision: Confirmed seven founder rulings from Alma's 2026-11-23 landing page review and promoted them into `CONTEXT.md`, `ALMA.md`, `SHIRISH.md`, `LANGUAGE.md`, `.agents/product-marketing.md` (`v6`), and `.translation/` (`project-brief.md`, `style-guide.md`, `glossary.csv`, `protected-terms.txt`): (1) add **Home Decor** (`decoración del hogar`) as KarmaRise's 4th core manufacturing category and as an expansion line under **AlmaRise**; (2) use operational facility terms (`production sites`, `production units`, `manufacturing units`, `facilities` / `unidades de producción`, `puntos de producción`, `lugares de producción`) **alongside** existing craft-specific nouns while avoiding `workshop floor`, `sales floor`, `a pie de taller`, and repetitive `workshops`/`talleres`; (3) mention Alma's spoken languages (Spanish, English, Portuguese) **only where specifically relevant** (Q&A/FAQs, `/book-a-call`, `/contact`), never as boilerplate across Hero or general sections; (4) confirm zippers as one single spec (`high-quality Japanese plastic YKK zippers` / `cremalleras japonesas YKK de plástico de alta calidad`); (5) adopt retail-friendly natural/varied fabric phrasing (`clothing in natural and varied fabrics` / `prendas de diversos tejidos`, `ropa de tejidos naturales`, `prendas de diseño`) instead of overly technical `woven clothing` / `tejido plano` in general marketing copy; (6) standardize visible brand capitalization strictly to **`AlmaRise`** (`AlmaRise Reborn`, `AlmaRise Organic`) while preserving lowercase `/almarise` URL routes; (7) drop the rigid `piel`-only ban in `es-ES` and use whichever of `piel` or `cuero` feels most natural in context, keeping Section 3.01's CTA as an action label (never overwritten by QC text).
- Context: Project owner confirmation on 2026-11-23 resolving all seven open terminology/scope questions from Alma's landing page review.
- Locale: en-GB, es-ES
- Status: approved

- Decision: Defer the interactive **NDA uploading** control in `/product-brief` (`subida de NDA`) to a later release; retain copy stating that designs stay confidential and mutual NDAs are available (`NDA`) without promising an upload feature until built.
- Context: Project owner confirmation on 2026-11-23 (decision #4: "we will come to this part later"); kept in `draft-terminology.csv` only.
- Locale: en-GB, es-ES
- Status: draft

## 2026-11-24

- Decision: Update the owned fashion and lifestyle label name from standalone `AlmaRise` to **`AlmaRise D Brand`**, and insert `D` into every associated line (**`AlmaRise D Reborn`**, **`AlmaRise D Organic`**, **`AlmaRise D Home Decor`**) across all English and Spanish pages, metadata, JSON-LD, chat prompts, RSS, Brevo/Sanity labels, `public/llms.txt`, and documentation, while preserving existing lowercase `/almarise` and `/es/almarise` URL routes, fragment anchors, and internal enum/env identifiers.
- Context: Project owner directive on 2026-11-24 updating standalone brand and sub-line naming sitewide.
- Locale: en-GB, es-ES
- Status: approved

## 2026-11-27

- Decision: Replace the retired zero-social-links rule with the **Approved Official Social Channels policy**, strictly limited to the five verified LinkedIn and Instagram URLs in `src/data/socials.ts` (`KarmaRise D Global` LinkedIn and Instagram, `AlmaRise D Brand` Instagram, `Alma` LinkedIn, and `Shirish` LinkedIn) across footer links, founder sections, `/almarise`, `public/llms.txt`, and JSON-LD `sameAs`. Unowned or third-party social networks (such as X, Facebook, or TikTok) remain strictly banned.
- Context: Project owner approval of KarmaRise D Global and AlmaRise D Brand's five official LinkedIn and Instagram profiles on 2026-11-27.
- Locale: en-GB, es-ES
- Status: approved

- Decision: Standardize KarmaRise's four manufacturing categories across all canonical documentation, glossaries, metadata, and structured data strictly to the v7 set: **leather goods** (`bolsos y artículos de piel`), **clothing** (`ropa y prendas`), **textile accessories** (`complementos textiles`), and **textile home decor** (`decoración textil del hogar`), retiring legacy `"custom sewn accessories and brand presentation"`.
- Context: Full codebase and canonical-docs parity alignment on 2026-11-27 resolving v6-to-v7 category drift in `PRODUCT.md` and downstream references.
- Locale: en-GB, es-ES
- Status: approved

- Decision: Omit repetitive duration tags (`(1 min)`, `1-min`, `15-min`) inside CTA button labels (using `"Share your product idea"` / `"Cuéntanos tu idea"` and `"Book a free call with Alma"` / `"Reserva una llamada gratis con Alma"`), keeping duration reassurance strictly in supporting prose; harmonize HTML `lang`, `hreflang`, `content-language`, `sitemap.ts`, and JSON-LD `inLanguage` on pan-European `en` and `es` while keeping OpenGraph `og:locale` on `en_GB` and `es_ES`.
- Context: Global design-taste rule #1 and sitewide bilingual SEO alignment on 2026-11-27.
- Locale: en-GB, es-ES
- Status: approved
