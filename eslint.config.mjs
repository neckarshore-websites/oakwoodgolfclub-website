import { createRequire } from "node:module";

import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * Flat ESLint config — Next.js 16 + TypeScript + Core Web Vitals.
 * Both shareable configs already export flat-config arrays, so we spread them.
 */

// eslint-plugin-react (von eslint-config-next mitgebracht) erkennt die React-Version
// ueber eine ESLint-9-API, die ESLint 10 entfernt hat — der Lauf bricht dann vor der
// ersten Datei ab. Die Version zu nennen ueberspringt diesen Pfad. Aus package.json
// abgeleitet statt hingeschrieben, damit ein React-Sprung sie nicht still veralten laesst.
const reactVersion = createRequire(import.meta.url)("./package.json").dependencies.react;

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  // Muss NACH den Voreinstellungen stehen: spaetere Objekte gewinnen bei `settings`.
  { settings: { react: { version: reactVersion } } },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"],
  },
];

export default eslintConfig;
