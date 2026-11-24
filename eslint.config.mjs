import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    files: ["src/**/*.tsx"],
    ignores: ["src/components/stories/media-placeholder.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name='figcaption']",
          message:
            "Do not render visible <figcaption> explanations on photographs; keep descriptive alt text on <Image> only (DESIGN.md > Copy).",
        },
      ],
    },
  },
  globalIgnores([
    ".agents/**",
    ".next/**",
    ".open-next/**",
    ".sanity/**",
    ".wrangler/**",
    "dist/**",
    "out/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
]);
