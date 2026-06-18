/**
 * Type declarations for the IndexNow submitter's exported helpers, so the
 * TypeScript unit test (tests/seo/indexnow.test.ts) type-checks cleanly even
 * though the runtime module is plain `.mjs` (it is invoked directly via
 * `node scripts/indexnow-submit.mjs` in CI, so it can't be a `.ts` file).
 */

export declare const SITE_URL: string;

export declare function deriveSlug(
  filename: string,
  frontmatter?: { slug?: string },
): string;

export declare function blogUrl(slug: string, base?: string): string;

export declare function isBlogPostPath(file: string, postsDir?: string): boolean;

export declare function findKey(
  publicDir?: string,
  siteUrl?: string,
): { key: string; keyLocation: string };

export declare function allPublishedUrls(postsDir?: string): string[];

export declare function changedPostUrls(
  changedFiles: string[],
  postsDir?: string,
): string[];
