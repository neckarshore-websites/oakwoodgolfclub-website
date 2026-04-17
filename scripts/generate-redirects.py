#!/usr/bin/env python3
"""
Generate lib/redirects.ts from WordPress XML exports.

Reads: wordpress-exports/*Beiträge.xml, *Seiten.xml, *FAQs.xml
Writes: lib/redirects.ts — TypeScript module exporting a RedirectEntry[]

next.config.ts imports this array inside its async redirects() function.

Mapping strategy:
  1. Blog posts (post/publish):
     /<slug>/ → /blog/<slug>

  2. FAQ items (avada_faq/publish):
     /faq-items/<slug>/ → /faq#<slug>

  3. Pages (page/publish AND page/private):
     Hand-curated map below. Private pages redirect too, because external
     links to them might still exist (bookmarks, external blog mentions).

Attachments (images) are NOT redirected — they live under wp-content/uploads
and either get proxy-served or 404 naturally. B9.1 will migrate them.

All redirects are permanent (308), which Next.js emits by default for
`permanent: true`.
"""

import xml.etree.ElementTree as ET
import glob
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'lib' / 'redirects.ts'

NS = {'wp': 'http://wordpress.org/export/1.2/'}

# Hand-curated page mapping. Keys are WP path-with-trailing-slash.
# Values are the new destination (anchor hashes are supported).
PAGE_MAPPING = {
    # Structural pages
    '/info/': '/ueber-uns',
    '/info/ueber-uns/': '/ueber-uns',
    '/info/agb/': '/agb',
    '/info/datenschutzerklaerung/': '/datenschutz',
    '/info/impressum/': '/impressum',
    '/info/kontakt/': '/kontakt',
    '/info/feedback-der-mitglieder/': '/ueber-uns',
    '/faq-fragen-zur-fernmitgliedschaft/': '/faq',
    '/blog-zur-fernmitgliedschaft-im-golfclub/': '/blog',

    # Signup flow
    '/golfclub/fernmitgliedschaft-im-golfclub-beantragen/': '/mitglied-werden',
    '/golfclub/fernmitgliedschaft-im-golfclub-beantragen/55-euro-fuer-ein-jahr-fernmitgliedschaft/': '/mitglied-werden',
    '/golfclub/fernmitgliedschaft-im-golfclub-beantragen/143-euro-per-flight-fuer-4-freunde/': '/mitglied-werden',
    '/golfclub/fernmitgliedschaft-im-golfclub-beantragen/10-euro-werbepraemie/': '/faq#gibt-es-ein-auto-renewal',

    # Renewal flow — NOTE: legacy URL has a typo ("golflcub" not "golfclub")
    '/golfclub/fernmitgliedschaft-im-golflcub-verlaengern/': '/mitgliedschaft-verlaengern',

    # Retired feature pages — map to the honest replacement content
    '/golfclub/scorekarte-erfassen/': '/faq#welche-app-fuer-scorecard-und-handicap-tracking',
    '/golfclub/handicapverwaltung-testen/': '/faq#warum-aktuell-keine-handicap-verwaltung',

    # Community / links pages — no direct replacement, land on closest neighbour
    '/golfclub/google-maps-mitglieder/': '/ueber-uns',
    '/golfclub/links-zum-thema-golf/': '/blog',
    '/fuer-wen-lohnt-sich-eine-fernmitgliedschaft/': '/mitglied-werden',
    '/blog-zur-fernmitgliedschaft-im-golfclub/worldhandicap-sytem-whs/': '/faq#was-ist-ein-recreational-hcp-wie-unterscheidet-es-sich-vom-hcp-des-dgv',
    '/blog-zur-fernmitgliedschaft-im-golfclub/golfbuddy-golfuhr-fuer-fernmitgliedschaft/': '/blog',

    # Legacy cruft (old / backup / drafts)
    '/products/': '/mitglied-werden',
    '/home-2/': '/',
    '/golfclub/scorekarte-erfassen-cloned-backup/': '/faq',
}


def collect_post_redirects():
    """post/publish: /<slug>/ → /blog/<slug>"""
    entries = []
    for xml_path in glob.glob(str(ROOT / 'wordpress-exports' / '*Beiträge.xml')):
        tree = ET.parse(xml_path)
        for item in tree.getroot().find('channel').findall('item'):
            pt = item.find('wp:post_type', NS)
            st = item.find('wp:status', NS)
            if pt is None or pt.text != 'post': continue
            if st is None or st.text != 'publish': continue

            name = item.find('wp:post_name', NS)
            if name is None or not name.text: continue
            slug = name.text.strip()

            entries.append({
                'source': f'/{slug}/',
                'destination': f'/blog/{slug}',
                'category': 'blog-post',
            })
    return entries


def collect_faq_redirects():
    """avada_faq/publish: /faq-items/<slug>/ → /faq#<slug>"""
    entries = []
    for xml_path in glob.glob(str(ROOT / 'wordpress-exports' / '*FAQs.xml')):
        tree = ET.parse(xml_path)
        for item in tree.getroot().find('channel').findall('item'):
            pt = item.find('wp:post_type', NS)
            st = item.find('wp:status', NS)
            if pt is None or pt.text != 'avada_faq': continue
            if st is None or st.text != 'publish': continue

            name = item.find('wp:post_name', NS)
            if name is None or not name.text: continue
            slug = name.text.strip()

            entries.append({
                'source': f'/faq-items/{slug}/',
                'destination': f'/faq#{slug}',
                'category': 'faq',
            })
    return entries


def collect_page_redirects():
    """Hand-curated mapping of WP pages → new routes."""
    entries = []
    for src, dest in sorted(PAGE_MAPPING.items()):
        # Skip root — already /
        if src == '/': continue
        entries.append({
            'source': src,
            'destination': dest,
            'category': 'page',
        })
    return entries


def emit_typescript(entries):
    by_cat = {}
    for e in entries:
        by_cat.setdefault(e['category'], []).append(e)

    lines = [
        '/**',
        ' * Legacy WordPress → new-site redirect map.',
        ' * Generated by scripts/generate-redirects.py from wordpress-exports/.',
        ' *',
        ' * DO NOT HAND-EDIT. Re-generate whenever a fresh WP export drops into',
        ' * wordpress-exports/ and URL changes need to be reflected.',
        ' *',
        ' * Consumed by next.config.ts → async redirects(). All entries are',
        ' * permanent (308) by default. Next.js automatically handles both',
        ' * trailing-slash and non-trailing-slash variants of the source path.',
        ' */',
        '',
        'export type RedirectEntry = {',
        '  source: string;',
        '  destination: string;',
        '  permanent: boolean;',
        '};',
        '',
    ]

    total = 0
    for cat in ['page', 'blog-post', 'faq']:
        if cat not in by_cat: continue
        arr_name = {
            'page': 'PAGE_REDIRECTS',
            'blog-post': 'BLOG_POST_REDIRECTS',
            'faq': 'FAQ_REDIRECTS',
        }[cat]
        header = {
            'page': 'Pages — hand-curated per category mapping in the generator.',
            'blog-post': 'Blog posts — each WP /<slug>/ maps to /blog/<slug>.',
            'faq': 'FAQ items — each WP /faq-items/<slug>/ maps to /faq#<slug>.',
        }[cat]
        lines.append(f'/** {header} */')
        lines.append(f'export const {arr_name}: RedirectEntry[] = [')
        for e in by_cat[cat]:
            lines.append(f'  {{ source: "{e["source"]}", destination: "{e["destination"]}", permanent: true }},')
        lines.append('];')
        lines.append('')
        total += len(by_cat[cat])

    lines.append('/** All redirects merged — consumed by next.config.ts. */')
    lines.append(
        'export const ALL_REDIRECTS: RedirectEntry[] = [...PAGE_REDIRECTS, ...BLOG_POST_REDIRECTS, ...FAQ_REDIRECTS];'
    )
    lines.append('')

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text('\n'.join(lines), encoding='utf-8')

    print(f'Wrote {total} redirects to {OUTPUT}')
    for cat, items in sorted(by_cat.items()):
        print(f'  {cat}: {len(items)}')


def main() -> int:
    entries = []
    entries.extend(collect_page_redirects())
    entries.extend(collect_post_redirects())
    entries.extend(collect_faq_redirects())

    if not entries:
        print('No entries — is wordpress-exports/ populated?', file=sys.stderr)
        return 1

    emit_typescript(entries)
    return 0


if __name__ == '__main__':
    sys.exit(main())
