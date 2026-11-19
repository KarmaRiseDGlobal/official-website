# Language, voice, and transcreation guide

KarmaRise D Global is built by Alma and Shirish as a fusion of India and Europe, with Spain as its core market and the whole of India as its manufacturing and cultural scope. Every piece of writing across the website, Stories, newsletters, email templates, and UI microcopy must read like direct, thoughtful human writing from the two founders, never like corporate brochure filler, agency clichés, or mechanical translation.

## 1. Grounded founder voice and geography

- **Represent all of India and foreground Spain.** KarmaRise D Global works with specialist workshops and craft traditions across the whole of India while serving Spain as its primary market alongside wider Europe. Frame brand-wide copy, navigation, datelines, and summaries around **India & Spain** (`India y España`) or **Spain, Europe & India** rather than narrowing the company to Maharashtra alone.
- **Never use `Ulhasnagar` in editorial, marketing, or UI copy.** Readers in Spain and Europe do not know where Ulhasnagar is. Reserve `Ulhasnagar` strictly for legal and postal `<address>` disclosures of `Karmarise Global LLP`. Everywhere else, refer to **"our studio in India"**, **"our office in India"**, or **"near Mumbai"** if physical proximity matters, and mention **"Maharashtra"** only when a specific regional subject genuinely calls for it, such as Maratha forts, regional weaving, or travelling between Indian states.
- **Portray Alma and Shirish accurately.** Alma flew from Spain to India, where she and Shirish founded KarmaRise D Global together. She works on the ground in India alongside Shirish, visiting factories across the country, inspecting hides and textiles, and developing Almarise, while speaking directly with Clients in Spain and across Europe in Spanish, English, and Portuguese. Shirish is a lawyer by profession in India who structures clear agreements with Manufacturing Partners, audits workshops in person across India, and oversees production quality from sampling to Bulk Order delivery.
- **Assign one primary narrator per Story.** Sign Stories in first person as **Alma** or **Shirish** rather than writing third-person bios under a founder byline. Use `I` for personal observation and `we` when acting together, including in photo captions.
  - **Alma's voice.** A Spanish business owner living and working in India. She describes unfamiliar Indian details by sight and hand-feel without pretending to be a local encyclopaedia, pushes back on broad "Europe vs. India" generalizations, and pairs dry humour with warmth.
  - **Shirish's voice.** An Indian lawyer on home ground. He reads how a workshop operates behind a polite yes, checks machinery, capacity, and floor discipline in person across India, and turns spoken promises into clear, fair agreements.
- **Avoid cultural caricatures and repetitive props.** Do not portray Alma as stuck at a café in Madrid or Shirish at a street chai stall, and do not lean on repetitive "worktable" or "pull up a chair at our table" clichés.
- **Use one publishing term: Stories, or `Historias` in Spanish.** Never mix "Stories" and "Journal".
- **Write with substance and clarity.** Name the actual work: how a Product Brief is specified, what makes a leather or garment factory capable of a run, how vintage Indian sarees are recut for Almarise, and how commercial orders fund the groundwork for the Women's Training Initiative.

## 2. Editorial voice benchmark

Use Alma's Story `three-biryanis-on-eid` in `src/data/stories.ts` as the voice benchmark for conversational candour, first-person captions, rhythm, and observation. Apply these five rules whenever drafting or editing a Story:

1. **Start from recorded debriefs and physical props.** Shape Stories from real spoken conversations around an actual sample, workshop visit, household, or meal rather than abstract topic outlines.
2. **State plain truths, including friction.** If nothing remarkable happened on a trip, if a prototype failed a test in the hand, or if three Eid biryanis in one day made Alma sick, say so plainly. Unhedged honesty earns trust for every positive claim.
3. **Describe by sight, feel, and failure mode.** Show how an object behaves in real life, such as chakli described as "the spiral one," biryani where spice enters the grain rather than sitting beside plain rice, or edge paint staying tacky in monsoon humidity. Do not stack textbook equipment nouns without showing what breaks when one is missing.
4. **Split broad geographies into real places.** Distinguish Spain, Portugal, France, and England just as clearly as different states and kitchens across India. One recipe, or one Product Brief, changes completely between one door and another.
5. **Keep table-level dialogue and varied rhythm.** Let brief spoken exchanges, such as "No thank you, baba, I have had enough," sit naturally inside the prose. Vary sentence and paragraph length, write captions in the author's own voice, use pull quotes for candid observations rather than company slogans, and leave `takeaway` empty whenever the closing paragraph already lands.

## 3. Story over UI filler

- **Every block must earn its place.** Do not treat copy as decorative filler to occupy cards, grids, or hero banners. If a sentence could sit unchanged on any sourcing agency's website, cut it.
- **Ground information in real materials, regions, and decisions.** Connect practical production details, such as hide grain, seam allowances, saree borders, factory capacity, and commercial terms, to the reality of working across India, Spain, and Europe.
- **Give inline tooltips dedicated visuals, never recycled Story gallery photos.** Tooltips in `src/data/story-references.ts` should pair with custom illustrations, maps, or properly licensed external photographs stored in `public/references/` (and mirrored in `Karmarise Content/media/references/`), rather than repeating photographs already used in the Story media gallery (`public/images/`).
- **Keep microcopy natural.** Buttons, form labels, and navigation links should be clear and human.

## 4. Native transcreation, never word-for-word translation

- **Write each language from the inside out.** Compose for how native speakers actually think, speak, and read in English, Spanish, or any other target language.
- **Never use literal machine-translation calques.** Do not mirror English sentence structure clause by clause in Spanish. Rethink the idea from scratch and write it naturally.
- **Spanish voice, `ES`.** Write in warm, natural Peninsular Spanish, `español cercano y natural`, speaking `de tú a tú`, clear and confident without stiff corporate formulas or forced slang. Since Spain is the primary market, Spanish copy must read as native Spain Spanish, and when Alma narrates, it must carry the idiomatic cadence she uses at home.
- **English voice, `EN`.** Write in clear, warm, direct English with concrete detail, active verbs, and natural spoken rhythm.

## 5. Pre-publish checklist

Before shipping any page, Story, newsletter issue, or email template in any language, verify:

1. **Geography test.** Does the text represent all of India and foreground Spain alongside Europe, with zero `Ulhasnagar` references outside legal postal addresses and no over-narrowing to Maharashtra?
2. **Accuracy and narrator test.** Does the text reflect how Alma and Shirish actually work together, written in genuine first person, including captions, without third-person self-introductions or stereotypes?
3. **Friction and specificity test.** Does the piece turn on a real moment, physical detail, or honest opinion rather than repeating a generic value proposition?
4. **Terminology test.** Are published pieces consistently called **Stories**, or `Historias` in Spanish, and are `CONTEXT.md` domain terms respected?
5. **Native fluency test.** Does the Spanish, or other target language, read as if conceived in Spain first, with zero literal translation stiffness?
