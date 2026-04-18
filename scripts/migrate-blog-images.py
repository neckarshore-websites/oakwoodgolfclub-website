#!/usr/bin/env python3
"""Download all WordPress-hosted blog images into the repo and rewrite the
Markdown bodies to point at the local copies. Idempotent — re-runs are
cheap (HEAD-style skip if the local file exists with non-zero size).

Why we do this:
    The blog posts in content/blog/*.md still reference image URLs on the
    legacy WordPress server (oakwoodgolfclub.de/wp-content/uploads/...
    and one stray s522799978.online.de host). When we DNS-cutover the
    apex to Vercel (Backlog #11 / B14), the old WordPress server stops
    serving — and every blog post turns into a wall of broken images.

    This script collapses that risk: download every WP-hosted image,
    save it under public/blog/images/<filename>, and replace the URL in
    Markdown with /blog/images/<filename>. After this runs, the blog is
    self-hosted and the WP server can die without consequence.

What we DO NOT migrate:
    - URLs on third-party domains (e.g. www.1golf.eu) — those are
      external attributions for content we don't own; rewriting them
      would silently host someone else's image as ours.

Filename collisions:
    Filenames are flattened from the URL's basename. Two different URLs
    could in theory produce the same basename (e.g. 2017/04/foo.jpg
    and 2023/04/foo.jpg). We hash-prefix on collision to keep both.
"""
from __future__ import annotations

import hashlib
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = REPO_ROOT / "content" / "blog"
PUBLIC_IMAGES_DIR = REPO_ROOT / "public" / "blog" / "images"

# Hosts whose images we want to take ownership of.
MIGRATE_HOSTS = {
    "oakwoodgolfclub.de",
    "www.oakwoodgolfclub.de",
    "s522799978.online.de",
}

# Anything matching a URL with one of these extensions in any of the
# files. Kept conservative on purpose — we don't want to re-host PDFs
# or video files by accident.
IMAGE_URL_RE = re.compile(
    r"https?://[^\s)\"'<>]+?\.(?:jpg|jpeg|png|gif|webp)",
    re.IGNORECASE,
)


def safe_filename(url: str, taken: set[str]) -> str:
    """Derive a flat filename from a URL, handling collisions deterministically."""
    parsed = urllib.parse.urlparse(url)
    base = Path(parsed.path).name
    # Some WP URLs include backslash-escaped underscores from the
    # Markdown source (\_). Strip those before saving.
    base = base.replace(r"\_", "_")
    if base in taken:
        # Hash-prefix the path so we don't lose a distinct image.
        h = hashlib.sha1(parsed.path.encode("utf-8")).hexdigest()[:8]
        stem = Path(base).stem
        ext = Path(base).suffix
        base = f"{stem}-{h}{ext}"
    taken.add(base)
    return base


def download(url: str, dest: Path) -> tuple[bool, str]:
    """Returns (downloaded, message)."""
    if dest.exists() and dest.stat().st_size > 0:
        return (False, f"skip (exists, {dest.stat().st_size} bytes)")
    req = urllib.request.Request(
        url,
        headers={
            # WP servers sometimes 403 the default urllib User-Agent.
            "User-Agent": "OGC-image-migration/1.0 (linus@neckarshore.ai)"
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
    except Exception as exc:  # noqa: BLE001
        return (False, f"FAIL {exc.__class__.__name__}: {exc}")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return (True, f"ok ({len(data)} bytes)")


def main() -> int:
    if not BLOG_DIR.is_dir():
        print(f"FATAL: blog dir {BLOG_DIR} not found", file=sys.stderr)
        return 2

    taken_filenames: set[str] = set()
    url_to_local: dict[str, str] = {}
    skipped_external: set[str] = set()

    # Pass 1: scan, classify, download.
    md_files = sorted(BLOG_DIR.glob("*.md"))
    all_urls: set[str] = set()
    for md in md_files:
        text = md.read_text(encoding="utf-8")
        for m in IMAGE_URL_RE.finditer(text):
            all_urls.add(m.group(0))

    print(f"[scan] {len(md_files)} markdown files, {len(all_urls)} unique image URLs")

    for url in sorted(all_urls):
        host = urllib.parse.urlparse(url).hostname or ""
        if host not in MIGRATE_HOSTS:
            skipped_external.add(url)
            continue
        # Strip backslash-escaped underscores in URL paths (MD-escaped form).
        clean_url = url.replace(r"\_", "_")
        filename = safe_filename(clean_url, taken_filenames)
        dest = PUBLIC_IMAGES_DIR / filename
        downloaded, msg = download(clean_url, dest)
        marker = "↓" if downloaded else "·"
        print(f"  {marker} {filename:60s} {msg}")
        # Map BOTH the original (possibly escaped) URL and the cleaned URL
        # to the same local path, so the rewriter catches all variants.
        url_to_local[url] = f"/blog/images/{filename}"
        url_to_local[clean_url] = f"/blog/images/{filename}"

    # Pass 2: rewrite Markdown.
    rewrite_count = 0
    files_changed = 0
    for md in md_files:
        text = md.read_text(encoding="utf-8")
        new_text = text
        local_changes = 0
        # Sort by length descending so longer URLs match before any prefix matches.
        for original_url in sorted(url_to_local.keys(), key=len, reverse=True):
            local_path = url_to_local[original_url]
            if original_url in new_text:
                count_before = new_text.count(original_url)
                new_text = new_text.replace(original_url, local_path)
                local_changes += count_before
        if new_text != text:
            md.write_text(new_text, encoding="utf-8")
            files_changed += 1
            rewrite_count += local_changes
            print(f"[rewrite] {md.name}: {local_changes} URL substitutions")

    print()
    print(f"[summary] downloaded/already-present: {len(url_to_local) // 2} images")
    print(f"[summary] markdown files modified:   {files_changed}")
    print(f"[summary] URL substitutions:         {rewrite_count}")
    print(f"[summary] external URLs left as-is:  {len(skipped_external)}")
    if skipped_external:
        for u in sorted(skipped_external):
            print(f"          - {u}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
