#!/usr/bin/env python3
"""
One-time-ish migration script: WordPress FAQs XML export → content/faqs.ts

Reads: wordpress-exports/oakwoodgolfclubde.WordPress.*-FAQs.xml (gitignored)
Writes: content/faqs.ts (committed)

Re-run whenever a fresh WP-export is dropped into wordpress-exports/.

Heuristics:
- Category is inferred from keyword matches in the question (see CATEGORIES
  below). Unmatched FAQs go to "Sonstiges".
- `published: true` for everything that was publish in WP AND is not
  a handicap-process claim. Handicap-workflow FAQs that contradict
  our D9 truth-alignment decision (we don't actively manage handicaps
  right now) get `published: false, needsReview: true` so they appear
  in content/faqs.ts for human decision — rewrite or drop.
- Private FAQs from WP also come in with `published: false`.

Does NOT expand FAQs to the 120-150-word MASCHIN-audit target. That's
content work, requires judgement, happens in a separate pass.
"""

import xml.etree.ElementTree as ET
import glob
import re
import sys
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXPORT_GLOB = str(ROOT / 'wordpress-exports' / '*FAQs.xml')
OUTPUT = ROOT / 'content' / 'faqs-wp.ts'  # generated — curated FAQs live in faqs-curated.ts

NS = {
    'wp': 'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
}

# Category buckets with matching patterns. First match wins.
CATEGORIES = [
    ('mitgliedschaft', [
        r'mitgliedschaft.*(verlänger|kalender|kündig|eintritt|jahr)',
        r'wie kann ich mitglied',
        r'verlänger',
        r'kündig',
    ]),
    ('karte', [
        r'clubkarte', r'mitgliederkarte', r'karte',
    ]),
    ('handicap', [
        r'handicap', r'hcp', r'platzreife', r'dgv', r'recreational',
    ]),
    ('akzeptanz', [
        r'österreich', r'akzeptier', r'anerkannt', r'andere clubs',
        r'ausland', r'international',
    ]),
    ('mitglieder', [
        r'mitgliederzahl', r'wieviele.*mitglied', r'wo kommen',
    ]),
]

# FAQs about handicap PROCESS/WORKFLOW that contradict truth-alignment (D9).
# These come in flagged for human review. Question-side keywords only.
HANDICAP_PROCESS_FLAGS = [
    r'prinzipielle.*ablauf',
    r'übermittle ich mein erstes handicap',
    r'wie bekomme ich.*handicap',
    r'wie werden handicaps berechnet',
    r'aktuellen handicap-nachweis',
    r'golfclubs in die handicapverwaltung',
    r'fortlaufendes handicap',
]


def slugify(s: str) -> str:
    s = s.lower()
    s = s.replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue').replace('ß', 'ss')
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')[:80]


def clean_answer(raw_html: str) -> str:
    """WP/Avada HTML → clean plain text with minimal markup (bullets + paragraphs)."""
    if not raw_html:
        return ''
    s = raw_html
    # Strip script/style
    s = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', s, flags=re.DOTALL | re.I)
    # Convert <br> to newlines
    s = re.sub(r'<br\s*/?>', '\n', s, flags=re.I)
    # Convert <li> to bullet lines
    s = re.sub(r'<li[^>]*>', '\n- ', s, flags=re.I)
    s = re.sub(r'</li>', '', s, flags=re.I)
    # Convert paragraph-closers to double newline
    s = re.sub(r'</p>', '\n\n', s, flags=re.I)
    # Strip all remaining tags
    s = re.sub(r'<[^>]+>', '', s)
    # Decode entities
    s = unescape(s)
    # Collapse runs of blank lines
    s = re.sub(r'\n{3,}', '\n\n', s)
    # Collapse horizontal whitespace
    s = re.sub(r'[ \t]+', ' ', s)
    # Trim lines
    s = '\n'.join(line.rstrip() for line in s.split('\n'))
    return s.strip()


def pick_category(question: str) -> str:
    q = question.lower()
    for cat_id, patterns in CATEGORIES:
        for p in patterns:
            if re.search(p, q):
                return cat_id
    return 'sonstiges'


def is_handicap_process(question: str) -> bool:
    q = question.lower()
    return any(re.search(p, q) for p in HANDICAP_PROCESS_FLAGS)


def main() -> int:
    files = sorted(glob.glob(EXPORT_GLOB))
    if not files:
        print(f'No XML found matching {EXPORT_GLOB}', file=sys.stderr)
        return 1

    source = files[-1]  # newest by filename sort
    print(f'Reading {source}')

    tree = ET.parse(source)
    channel = tree.getroot().find('channel')
    faqs = []

    for item in channel.findall('item'):
        pt = item.find('wp:post_type', NS)
        if pt is None or pt.text != 'avada_faq':
            continue

        status = (item.find('wp:status', NS).text or '').strip()
        title = (item.find('title').text or '').strip()
        content = item.find('content:encoded', NS)
        raw_html = content.text if content is not None else ''
        id_el = item.find('wp:post_id', NS)
        wp_id = id_el.text if id_el is not None else ''

        answer = clean_answer(raw_html)
        category = pick_category(title)

        is_publish = status == 'publish'
        # Stricter rule: ALL handicap-category FAQs require truth-align review,
        # not just the workflow-process ones. WP copy sometimes claims things
        # that contradict D9 even outside the explicit workflow FAQs.
        needs_review = is_handicap_process(title) or category == 'handicap'
        published = is_publish and not needs_review

        faqs.append({
            'wp_id': wp_id,
            'slug': slugify(title),
            'question': title,
            'answer': answer,
            'category': category,
            'published': published,
            'needs_review': needs_review,
            'original_status': status,
        })

    # Stable sort: by category order, then wp_id
    cat_order = {c[0]: i for i, c in enumerate(CATEGORIES)}
    cat_order['sonstiges'] = len(CATEGORIES)
    faqs.sort(key=lambda f: (cat_order.get(f['category'], 99), int(f['wp_id'] or 0)))

    # Emit TypeScript
    def ts_escape(s: str) -> str:
        return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

    lines = [
        '/**',
        ' * WordPress-migrated FAQs — generated by scripts/migrate-faqs.py.',
        ' *',
        ' * DO NOT HAND-EDIT. Re-running the migration script overwrites this',
        ' * file. For hand-kuratierte FAQs use content/faqs-curated.ts.',
        ' * content/faqs.ts aggregates both.',
        ' *',
        ' * published=false + needsReview=true means the imported FAQ',
        ' * contradicts our D9 truth-alignment (active handicap claims).',
        ' * Decision per FAQ: rewrite honestly in faqs-curated.ts, or drop.',
        ' */',
        '',
        'import type { FaqItem } from "@/lib/faqs/types";',
        '',
        'export const WP_FAQS: FaqItem[] = [',
    ]
    for f in faqs:
        lines.append('  {')
        lines.append(f'    slug: "{f["slug"]}",')
        lines.append(f'    question: `{ts_escape(f["question"])}`,')
        lines.append(f'    answer: `{ts_escape(f["answer"])}`,')
        lines.append(f'    category: "{f["category"]}",')
        lines.append(f'    published: {"true" if f["published"] else "false"},')
        if f['needs_review']:
            lines.append(f'    needsReview: true,')
        lines.append(f'    wpId: "{f["wp_id"]}",')
        lines.append('  },')
    lines.append('];')
    lines.append('')

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text('\n'.join(lines), encoding='utf-8')

    published_count = sum(1 for f in faqs if f['published'])
    review_count = sum(1 for f in faqs if f['needs_review'])
    draft_private = sum(1 for f in faqs if not f['published'] and not f['needs_review'])

    print(f'Wrote {len(faqs)} FAQs to {OUTPUT}')
    print(f'  published: {published_count}')
    print(f'  needsReview (handicap workflow): {review_count}')
    print(f'  draft (was private in WP): {draft_private}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
