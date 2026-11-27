import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const PHOTO_WIDTHS = [384, 640, 960, 1440];
const CUTOUT_WIDTHS = [256, 384, 640];
const LOGO_WIDTHS = [64, 128, 256, 384, 512];

const TARGET_IMAGES = [
  // Capabilities & replacements
  {
    src: "/images/capabilities/leather-hides.jpg",
    slug: "cap-leather-hides",
    kind: "photo",
  },
  {
    src: "/images/capabilities/natural-fabrics.jpg",
    slug: "cap-natural-fabrics",
    kind: "photo",
  },
  {
    src: "/images/capabilities/textile-accessories.jpg",
    slug: "cap-textile-accessories",
    kind: "photo",
  },
  {
    src: "/images/capabilities/unbleached-cotton-pouches.jpg",
    slug: "cap-unbleached-cotton-pouches",
    kind: "photo",
  },
  {
    src: "/images/Leather/pexels-vlada-karpovich-4452603.jpg",
    slug: "leather-vlada-karpovich-workbench",
    kind: "photo",
  },
  // AlmaRise D Brand
  {
    src: "/images/almarise/almarise-saree-design-review.jpeg",
    slug: "almarise-saree-design-review",
    kind: "photo",
  },
  {
    src: "/images/almarise/almarise-reborn-olive-pallu-shrug-madrid-street.jpeg",
    slug: "almarise-olive-pallu-shrug",
    kind: "photo",
  },
  {
    src: "/images/almarise/almarise-reborn-geometric-saree-tunic-madrid-station.jpeg",
    slug: "almarise-geometric-saree-tunic",
    kind: "photo",
  },
  {
    src: "/images/almarise/almarise-reborn-bandhani-saree-shrug-madrid.jpeg",
    slug: "almarise-bandhani-saree-shrug",
    kind: "photo",
  },
  {
    src: "/images/almarise/almarise-reborn-coral-zari-saree-portrait-madrid.jpeg",
    slug: "almarise-coral-zari-saree",
    kind: "photo",
  },
  {
    src: "/images/almarise/almarise-reborn-red-saree-shrug-madrid-steps.jpeg",
    slug: "almarise-red-saree-shrug",
    kind: "photo",
  },
  {
    src: "/images/almarise/almarise-reborn-magenta-saree-shrug-principe-pio.jpeg",
    slug: "almarise-magenta-saree-shrug",
    kind: "photo",
  },
  {
    src: "/images/almarise/almarise-reborn-magenta-saree-garment.jpeg",
    slug: "almarise-magenta-saree-garment",
    kind: "photo",
  },
  {
    src: "/images/almarise/reviewing-saree-garment-sketches-india.jpeg",
    slug: "almarise-reviewing-garment-sketches",
    kind: "photo",
  },
  {
    src: "/images/almarise/alma-inspecting-blue-embroidered-saree-studio.jpg",
    slug: "almarise-blue-embroidered-saree-studio",
    kind: "photo",
  },
  {
    src: "/images/almarise/almarise-sewing-studio-wide-view-india.jpg",
    slug: "almarise-sewing-studio-wide-view",
    kind: "photo",
  },
  {
    src: "/images/almarise/alma-draping-saree-dress-form-studio.jpeg",
    slug: "almarise-draping-saree-dress-form",
    kind: "photo",
  },
  {
    src: "/images/almarise/design-students-saree-stacks-mumbai-studio.jpeg",
    slug: "almarise-saree-stacks-studio",
    kind: "photo",
  },
  {
    src: "/images/almarise/karmarise-studio-sewing-tables-preparation-india.jpeg",
    slug: "almarise-studio-sewing-tables-prep",
    kind: "photo",
  },
  {
    src: "/images/almarise/alma-kalyan-fashion-studio-briefing.jpeg",
    slug: "almarise-kalyan-studio-briefing",
    kind: "photo",
  },
  {
    src: "/images/almarise/alma-indian-woman-folded-silk-sarees-home.jpeg",
    slug: "almarise-folded-silk-sarees-home",
    kind: "photo",
  },
  {
    src: "/images/almarise/indian-family-saree-handover-almarise.jpeg",
    slug: "almarise-family-saree-handover",
    kind: "photo",
  },
  // Founders & client studio
  {
    src: "/images/client/client.jpg.jpeg",
    slug: "founders-client-portrait",
    kind: "photo",
  },
  {
    src: "/images/client/client 2.jpeg",
    slug: "founders-client-tablet-session",
    kind: "photo",
  },
  {
    src: "/images/founders/alma-and-shirish-avatar.jpg",
    slug: "founders-alma-shirish-avatar",
    kind: "photo",
  },
  {
    src: "/images/founders/alma-portrait.jpeg",
    slug: "founders-alma-portrait",
    kind: "photo",
  },
  {
    src: "/images/founders/alma-swing-laughing.jpeg",
    slug: "founders-alma-swing-laughing",
    kind: "photo",
  },
  {
    src: "/images/founders/alma-shirish-planning-table-window-india.jpeg",
    slug: "founders-alma-shirish-planning-window",
    kind: "photo",
  },
  {
    src: "/images/founders/alma-shirish-team-dinner-india.jpg",
    slug: "founders-alma-shirish-team-dinner",
    kind: "photo",
  },
  {
    src: "/images/founders/shirish-india-railway-station.jpeg",
    slug: "founders-shirish-railway-station",
    kind: "photo",
  },
  // Production sites & India craft
  {
    src: "/images/workshops/alma-shirish-india-office-meeting.jpg",
    slug: "workshops-alma-shirish-office-meeting",
    kind: "photo",
  },
  {
    src: "/images/workshops/shirish-at-leather-warehouse-desk.jpeg",
    slug: "workshops-shirish-warehouse-desk",
    kind: "photo",
  },
  {
    src: "/images/workshops/brown-black-leather-panels-brass-hardware.jpg",
    slug: "workshops-brown-black-leather-panels",
    kind: "photo",
  },
  {
    src: "/images/workshops/cognac-leather-bag-bodies-brass-zippers.jpg",
    slug: "workshops-cognac-bag-bodies-zippers",
    kind: "photo",
  },
  {
    src: "/images/workshops/alma-dark-leather-swatch-binder-review.jpeg",
    slug: "workshops-alma-leather-swatch-binder",
    kind: "photo",
  },
  {
    src: "/images/workshops/alma-purple-leather-hide-drape-check.jpeg",
    slug: "workshops-alma-purple-leather-hide",
    kind: "photo",
  },
  {
    src: "/images/workshops/alma-leather-manufacturing-partner-team-india.jpg",
    slug: "workshops-alma-partner-team",
    kind: "photo",
  },
  {
    src: "/images/workshops/alma-shirish-leather-partner-family-india.jpg",
    slug: "workshops-alma-shirish-partner-family",
    kind: "photo",
  },
  {
    src: "/images/workshops/alma-black-leather-tote-inspection.jpeg",
    slug: "workshops-alma-black-leather-tote",
    kind: "photo",
  },
  {
    src: "/images/workshops/alma-cognac-crossbody-hide-table.jpeg",
    slug: "workshops-alma-cognac-crossbody-hide",
    kind: "photo",
  },
  {
    src: "/images/workshops/alma-natural-canvas-fabric-cutting-table.jpeg",
    slug: "workshops-alma-natural-canvas-cutting",
    kind: "photo",
  },
  {
    src: "/images/workshops/alma-reviewing-leather-hides-workshop.jpeg",
    slug: "workshops-alma-reviewing-hides",
    kind: "photo",
  },
  {
    src: "/images/workshops/alma-tan-leather-hides-batch-check.jpeg",
    slug: "workshops-alma-tan-hides-batch",
    kind: "photo",
  },
  {
    src: "/images/workshops/shirish-artisan-cotton-lining-bench-india.jpeg",
    slug: "workshops-shirish-artisan-lining-bench",
    kind: "photo",
  },
  {
    src: "/images/workshops/shirish-inspecting-leather-cutting-table.jpeg",
    slug: "workshops-shirish-inspecting-cutting",
    kind: "photo",
  },
  {
    src: "/images/workshops/shirish-machinist-leather-strap-vertical.jpeg",
    slug: "workshops-shirish-machinist-strap",
    kind: "photo",
  },
  {
    src: "/images/workshops/shirish-master-cutter-seam-inspection.jpeg",
    slug: "workshops-shirish-master-cutter-seam",
    kind: "photo",
  },
  {
    src: "/images/workshops/shirish-tan-black-leather-bags-inspection.jpeg",
    slug: "workshops-shirish-bags-inspection",
    kind: "photo",
  },
  {
    src: "/images/workshops/shirish-woman-artisan-striped-cotton-linings.jpeg",
    slug: "workshops-shirish-woman-artisan-linings",
    kind: "photo",
  },
  {
    src: "/images/workshops/leather-bags-export-cartons.jpeg",
    slug: "workshops-export-cartons",
    kind: "photo",
  },
  // Stories & culture photography
  {
    src: "/images/culture/alma-brown-idli-sambar-india-table.jpg",
    slug: "culture-alma-brown-idli-sambar",
    kind: "photo",
  },
  {
    src: "/images/culture/alma-colleague-maroon-sawtooth-saree-maharashtra.jpeg",
    slug: "culture-maroon-sawtooth-saree",
    kind: "photo",
  },
  {
    src: "/images/culture/diwali-spiral-chakli-masala-chai.jpg",
    slug: "culture-diwali-chakli-masala-chai",
    kind: "photo",
  },
  {
    src: "/images/culture/home-cooked-chicken-biryani-raita.jpg",
    slug: "culture-home-cooked-biryani-raita",
    kind: "photo",
  },
  {
    src: "/images/culture/maharashtra-basalt-fort-valley.jpg",
    slug: "culture-maharashtra-basalt-fort-valley",
    kind: "photo",
  },
  {
    src: "/images/culture/maharashtra-festive-paithani-attire.jpg",
    slug: "culture-maharashtra-paithani-attire",
    kind: "photo",
  },
  {
    src: "/images/culture/maharashtra-handloom-zari-border.jpg",
    slug: "culture-maharashtra-handloom-zari-border",
    kind: "photo",
  },
  {
    src: "/images/culture/rajgad-sanjivani-machi-arch-torna-fort.jpg",
    slug: "culture-rajgad-sanjivani-machi-arch",
    kind: "photo",
  },
  {
    src: "/images/culture/serving-spiced-chicken-biryani-pot.jpg",
    slug: "culture-serving-spiced-biryani-pot",
    kind: "photo",
  },
  {
    src: "/images/culture/shirish-at-maharashtra-fort.jpg",
    slug: "culture-shirish-at-maharashtra-fort",
    kind: "photo",
  },
  {
    src: "/images/culture/spanish-minced-meat-croquetas-bechamel.jpg",
    slug: "culture-spanish-croquetas-bechamel",
    kind: "photo",
  },
  {
    src: "/images/culture/steamed-brown-idli-spiced-chutney.jpg",
    slug: "culture-steamed-brown-idli-chutney",
    kind: "photo",
  },
  // Hero video posters
  {
    src: "/videos/posters/how-we-work-working-banner.jpg",
    slug: "poster-how-we-work-working-banner",
    kind: "photo",
  },
  {
    src: "/videos/posters/spain-india-workshop-banner.jpg",
    slug: "poster-spain-india-workshop-banner",
    kind: "photo",
  },
  // Story reference popover imagery (> 100 KB)
  {
    src: "/references/gudi-padwa-rally.jpg",
    slug: "ref-gudi-padwa-rally",
    kind: "photo",
  },
  {
    src: "/references/sant-dnyaneshwar.jpg",
    slug: "ref-sant-dnyaneshwar",
    kind: "photo",
  },
  {
    src: "/references/vitthal-on-brick.jpg",
    slug: "ref-vitthal-on-brick",
    kind: "photo",
  },
  {
    src: "/references/xuanzang-framed.jpg",
    slug: "ref-xuanzang-framed",
    kind: "photo",
  },
  // Brand marks
  {
    src: "/brand/main-logo-transparent.png",
    slug: "main-logo-transparent",
    kind: "logo",
  },
  {
    src: "/brand/emblem-transparent.png",
    slug: "emblem-transparent",
    kind: "logo",
  },
  {
    src: "/brand/almarise-d-brand-logo.png",
    slug: "almarise-d-brand-logo",
    kind: "logo",
  },
  // Manufacturing #product-categories contemporary 3D illustrative craft cutouts (16 assets)
  {
    src: "/images/categories-3d/leather/hobo-bag.webp",
    slug: "cat3d-leather-hobo-bag",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/leather/everyday-backpack.webp",
    slug: "cat3d-leather-everyday-backpack",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/leather/small-crossbody.webp",
    slug: "cat3d-leather-small-crossbody",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/leather/pouches-wallets.webp",
    slug: "cat3d-leather-pouches-wallets",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/clothing/midi-dress.webp",
    slug: "cat3d-clothing-midi-dress",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/clothing/denim-jacket.webp",
    slug: "cat3d-clothing-denim-jacket",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/clothing/linen-blouse.webp",
    slug: "cat3d-clothing-linen-blouse",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/clothing/linen-jumpsuit.webp",
    slug: "cat3d-clothing-linen-jumpsuit",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/textile-accessories/quilted-tote.webp",
    slug: "cat3d-textile-acc-quilted-tote",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/textile-accessories/pashmina-scarf.webp",
    slug: "cat3d-textile-acc-pashmina-scarf",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/textile-accessories/toiletry-headband.webp",
    slug: "cat3d-textile-acc-toiletry-headband",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/textile-accessories/embroidered-clutch.webp",
    slug: "cat3d-textile-acc-embroidered-clutch",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/home-decor/kantha-bedspread.webp",
    slug: "cat3d-home-decor-kantha-bedspread",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/home-decor/cushion-covers.webp",
    slug: "cat3d-home-decor-cushion-covers",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/home-decor/dhurrie-rug.webp",
    slug: "cat3d-home-decor-dhurrie-rug",
    kind: "cutout",
  },
  {
    src: "/images/categories-3d/home-decor/table-linens.webp",
    slug: "cat3d-home-decor-table-linens",
    kind: "cutout",
  },
];

function getNaturalWidth(filePath) {
  const output = execFileSync(
    "magick",
    [filePath, "-auto-orient", "-format", "%w", "info:"],
    {
      encoding: "utf8",
    },
  ).trim();
  const width = Number.parseInt(output, 10);
  if (!Number.isFinite(width) || width <= 0) {
    throw new Error(`Could not read width for ${filePath}: ${output}`);
  }
  return width;
}

const manifest = {};
const generatedFiles = new Set();
let totalSourceBytes = 0;
let totalSampleTargetBytes = 0;

for (const item of TARGET_IMAGES) {
  const inputPath = path.join(REPO_ROOT, "public", item.src.replace(/^\//, ""));
  const sourceBytes = statSync(inputPath).size;
  totalSourceBytes += sourceBytes;

  const naturalWidth = getNaturalWidth(inputPath);
  const candidateWidths =
    item.kind === "logo"
      ? LOGO_WIDTHS
      : item.kind === "cutout"
        ? CUTOUT_WIDTHS
        : PHOTO_WIDTHS;
  const outputWidths = Array.from(
    new Set(candidateWidths.map((w) => Math.min(w, naturalWidth))),
  ).sort((a, b) => a - b);

  const outSubDir = item.kind === "logo" ? "brand/_opt" : "images/_opt";
  const outDir = path.join(REPO_ROOT, "public", outSubDir);
  mkdirSync(outDir, { recursive: true });

  const basePath = `/${outSubDir}/${item.slug}`;
  const generatedSizes = [];

  for (const w of outputWidths) {
    const outFile = path.join(outDir, `${item.slug}-w${w}.webp`);
    generatedFiles.add(path.resolve(outFile));
    const args =
      item.kind === "logo" || item.kind === "cutout"
        ? [
            inputPath,
            "-strip",
            "-resize",
            `${w}x>`,
            "-quality",
            item.kind === "logo" ? "90" : "86",
            "-define",
            "webp:alpha-quality=100",
            "-define",
            "webp:method=6",
            outFile,
          ]
        : [
            inputPath,
            "-auto-orient",
            "-strip",
            "-resize",
            `${w}x>`,
            "-quality",
            "80",
            "-define",
            "webp:method=6",
            outFile,
          ];
    execFileSync("magick", args, { stdio: "inherit" });
    generatedSizes.push(`${w}w:${Math.round(statSync(outFile).size / 1024)}KB`);
  }

  const representativeWidth =
    outputWidths[Math.min(1, outputWidths.length - 1)] ?? outputWidths[0];
  totalSampleTargetBytes += statSync(
    path.join(outDir, `${item.slug}-w${representativeWidth}.webp`),
  ).size;

  manifest[item.src] = {
    basePath,
    widths: outputWidths,
  };

  console.log(
    `${item.src} (${Math.round(sourceBytes / 1024)}KB, ${naturalWidth}px) -> ${generatedSizes.join(", ")}`,
  );
}

// Prune orphaned _opt files for removed or banned assets
let prunedOrphans = 0;
for (const sub of ["images/_opt", "brand/_opt"]) {
  const dir = path.join(REPO_ROOT, "public", sub);
  for (const name of readdirSync(dir)) {
    const full = path.resolve(dir, name);
    if (!generatedFiles.has(full)) {
      unlinkSync(full);
      prunedOrphans++;
    }
  }
}
if (prunedOrphans > 0) {
  console.log(`\nPruned ${prunedOrphans} orphaned _opt files.`);
}

const manifestPath = path.join(
  REPO_ROOT,
  "src",
  "lib",
  "local-image-variants.ts",
);
const entriesCode = Object.entries(manifest)
  .map(
    ([src, entry]) =>
      `  ${JSON.stringify(src)}: {\n    basePath: ${JSON.stringify(entry.basePath)},\n    widths: [${entry.widths.join(", ")}],\n  },`,
  )
  .join("\n");

const manifestFileContent = `// Generated by scripts/optimize-local-images.mjs. Do not edit by hand.

export interface LocalImageVariantSet {
  readonly basePath: string;
  readonly widths: readonly number[];
}

export const LOCAL_IMAGE_VARIANTS: Readonly<
  Record<string, LocalImageVariantSet>
> = {
${entriesCode}
};
`;

writeFileSync(manifestPath, manifestFileContent, "utf8");
console.log(
  `\nWrote ${path.relative(REPO_ROOT, manifestPath)} (sources: ${Math.round(totalSourceBytes / 1024)}KB -> typical desktop mid-width total: ${Math.round(totalSampleTargetBytes / 1024)}KB)`,
);
