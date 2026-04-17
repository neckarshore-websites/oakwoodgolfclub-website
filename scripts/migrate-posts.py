#!/usr/bin/env python3
"""
One-time-ish migration script: WordPress blog posts XML export → content/blog/*.md

Reads: wordpress-exports/oakwoodgolfclubde.WordPress.*-Beiträge.xml (gitignored)
Writes: content/blog/*.md (one file per publish post — committed)

Re-run whenever a fresh WP-export is dropped into wordpress-exports/.

Pipeline per post:
  1. Filter: only post_type=post, status=publish.
  2. Strip Avada/Fusion shortcodes ([fusion_builder_*], [fusion_text], etc.).
  3. Parse with BeautifulSoup, strip empty elements.
  4. Convert to Markdown via markdownify.
  5. Generate excerpt from first real paragraph (~160 chars).
  6. Emit YAML frontmatter + body.

Handicap-category posts get draft=true automatically (D9 truth-alignment).
Human must review and decide: rewrite, drop, or promote to draft=false.
"""

import xml.etree.ElementTree as ET
import glob
import re
import sys
from html import unescape
from pathlib import Path
from datetime import datetime

from bs4 import BeautifulSoup
from markdownify import markdownify

ROOT = Path(__file__).resolve().parent.parent
EXPORT_GLOB = str(ROOT / 'wordpress-exports' / '*Beiträge.xml')
OUTPUT_DIR = ROOT / 'content' / 'blog'

NS = {
    'wp': 'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
    'dc': 'http://purl.org/dc/elements/1.1/',
}

# Category mapping: WordPress name → normalised display name.
# Uncategorized is filtered out silently. Handicap-related posts get draft=true.
CATEGORY_MAP = {
    'Das 19. Loch': 'Golfkultur',
    'Training': 'Training',
    'Golfplätze': 'Golfplätze',
    'Handicapverwaltung': 'Handicap',  # triggers draft=true
    'Greenfees': 'Greenfees',
    'Equipment &amp; Spielzeug': 'Equipment',
    'Equipment & Spielzeug': 'Equipment',
    'Uncategorized': None,  # skip
}

HANDICAP_CATEGORIES = {'Handicap', 'Handicapverwaltung'}


# ---------------------------------------------------------------------------
# Shortcode stripping — remove Avada/Fusion builder wrappers, keep content.

# Matches any [shortcode ...] or [/shortcode], with or without attributes,
# self-closing or paired. Avada attrs are gnarly and span many chars.
SHORTCODE_PATTERN = re.compile(
    r'\[/?(?:fusion_[a-z_]+|fusion_builder_[a-z_]+|fusion_text|fusion_separator)'
    r'[^\]]*\]',
    re.IGNORECASE
)

# [caption id="..."]<img .../>Caption text[/caption] — keep the <img>, drop
# the wrapper. markdownify will handle the <img> → ![alt](src).
CAPTION_PATTERN = re.compile(
    r'\[caption[^\]]*\](.*?)\[/caption\]',
    re.IGNORECASE | re.DOTALL,
)


def strip_wp_shortcodes(html: str) -> str:
    # Extract inner content from captions first
    html = CAPTION_PATTERN.sub(lambda m: m.group(1), html)
    # Then strip all Avada/Fusion builder shortcodes
    html = SHORTCODE_PATTERN.sub('', html)
    return html


# ---------------------------------------------------------------------------
# Post-processing on Markdown output.

def normalise_markdown(md: str) -> str:
    # Force https on our own domain — WP exported http everywhere.
    md = re.sub(
        r'http://(www\.)?oakwoodgolfclub\.de',
        'https://oakwoodgolfclub.de',
        md,
    )
    # markdownify sometimes outputs runs of 3+ blank lines; collapse to 2.
    md = re.sub(r'\n{3,}', '\n\n', md)
    # Strip trailing whitespace on each line.
    md = '\n'.join(line.rstrip() for line in md.split('\n'))
    # Strip leading/trailing blank lines.
    return md.strip() + '\n'


def strip_leading_h1(md: str) -> str:
    """Drop the first H1 if present — Post title already in frontmatter."""
    lines = md.split('\n')
    out = []
    h1_stripped = False
    for line in lines:
        if not h1_stripped and line.startswith('# ') and not line.startswith('## '):
            h1_stripped = True
            continue
        # Also drop a blank line immediately after a stripped H1
        if h1_stripped and not out and line == '':
            continue
        out.append(line)
    return '\n'.join(out)


# ---------------------------------------------------------------------------
# Excerpt generation.

def make_excerpt(markdown: str, max_chars: int = 180) -> str:
    # First non-empty, non-heading, non-image line.
    for line in markdown.split('\n'):
        line = line.strip()
        if not line or line.startswith('#') or line.startswith('!['):
            continue
        if line.startswith('[') and ']' in line and '(' in line:
            # Pure link line — skip.
            continue
        # Strip markdown syntax for preview
        plain = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', line)  # [text](url) → text
        plain = re.sub(r'\*{1,2}([^*]+)\*{1,2}', r'\1', plain)  # bold/italic
        plain = plain.strip()
        if len(plain) < 30:
            continue  # too short, probably a caption
        if len(plain) <= max_chars:
            return plain
        # Cut at word boundary
        cut = plain[:max_chars].rsplit(' ', 1)[0]
        return cut.rstrip(',.;:!?') + ' …'
    return ''


# ---------------------------------------------------------------------------
# YAML string escaping.

def yaml_quote(s: str) -> str:
    """Safe YAML scalar in double quotes — escape backslashes + double quotes."""
    s = s.replace('\\', '\\\\').replace('"', '\\"')
    return f'"{s}"'


# ---------------------------------------------------------------------------
# Main

def main() -> int:
    files = sorted(glob.glob(EXPORT_GLOB))
    if not files:
        print(f'No XML found matching {EXPORT_GLOB}', file=sys.stderr)
        return 1

    source = files[-1]
    print(f'Reading {source}')

    tree = ET.parse(source)
    channel = tree.getroot().find('channel')

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    migrated = 0
    drafts = 0
    skipped = 0

    for item in channel.findall('item'):
        pt = item.find('wp:post_type', NS)
        st = item.find('wp:status', NS)
        if pt is None or pt.text != 'post':
            continue
        if st is None or st.text != 'publish':
            continue

        title = (item.find('title').text or '').strip()
        slug = (item.find('wp:post_name', NS).text or '').strip()
        date_gmt = (item.find('wp:post_date_gmt', NS).text or '').strip()
        modified_gmt = (item.find('wp:post_modified_gmt', NS).text or '').strip()
        content_el = item.find('content:encoded', NS)
        raw_html = (content_el.text if content_el is not None else '') or ''

        # Categories
        wp_cats = [c.text for c in item.findall('category[@domain="category"]') if c.text]
        mapped_cats = []
        for c in wp_cats:
            # XML parser leaves &amp; intact; normalise
            c_norm = c.replace('&amp;', '&')
            mapped = CATEGORY_MAP.get(c_norm, c_norm)
            if mapped is None:
                continue
            if mapped not in mapped_cats:
                mapped_cats.append(mapped)

        if not mapped_cats:
            mapped_cats = ['Sonstiges']

        # Tags
        wp_tags = [c.text for c in item.findall('category[@domain="post_tag"]') if c.text]

        # Draft flag: Handicap-category posts need truth-align review.
        is_handicap = any(c in HANDICAP_CATEGORIES for c in mapped_cats)

        # Content pipeline
        html_clean = strip_wp_shortcodes(raw_html)
        soup = BeautifulSoup(html_clean, 'html.parser')
        # markdownify options: bullet style, heading style, code fences
        md_raw = markdownify(
            str(soup),
            heading_style='ATX',
            bullets='-',
            code_language='',
            strip=['script', 'style'],
        )
        md = normalise_markdown(md_raw)
        md = strip_leading_h1(md)

        excerpt = make_excerpt(md)
        if not excerpt:
            # Fallback — at least something non-empty (required by blog loader).
            excerpt = f'Beitrag von {date_gmt[:10]} · {", ".join(mapped_cats)}.'

        # Date format YYYY-MM-DD (not full ISO — matches blog type-system).
        date_short = date_gmt[:10] if date_gmt else datetime.now().strftime('%Y-%m-%d')
        mod_short = modified_gmt[:10] if modified_gmt else ''

        # Build frontmatter
        fm_lines = [
            '---',
            f'title: {yaml_quote(title)}',
            f'date: "{date_short}"',
        ]
        if mod_short and mod_short != date_short:
            fm_lines.append(f'modified: "{mod_short}"')
        fm_lines.extend([
            f'excerpt: {yaml_quote(excerpt)}',
            'categories:',
        ])
        for c in mapped_cats:
            fm_lines.append(f'  - {yaml_quote(c)}')
        if wp_tags:
            fm_lines.append('tags:')
            for t in wp_tags:
                fm_lines.append(f'  - {yaml_quote(t)}')
        fm_lines.append('author: "Oakwood Golf Club"')
        if is_handicap:
            fm_lines.append('draft: true  # needs truth-align review (D9)')
        else:
            fm_lines.append('draft: false')
        fm_lines.append('---')
        fm_lines.append('')

        out_path = OUTPUT_DIR / f'{slug}.md'
        out_path.write_text('\n'.join(fm_lines) + md, encoding='utf-8')

        status_tag = '[DRAFT]' if is_handicap else '[OK]'
        print(f'  {status_tag} {slug}.md  ({len(md)} chars md)')

        migrated += 1
        if is_handicap:
            drafts += 1

    print()
    print(f'Migrated: {migrated} posts')
    print(f'  published: {migrated - drafts}')
    print(f'  draft (handicap, needs review): {drafts}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
