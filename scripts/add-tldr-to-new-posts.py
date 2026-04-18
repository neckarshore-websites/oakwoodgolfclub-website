#!/usr/bin/env python3
"""One-shot transformation: add TL;DR top section + remove Fazit closing on
the seven 2026-era equipment / culture blog posts.

User direction (2026-04-18):
  Setze das Fazit am Ende der Seiten durch ein "Too long; didn't read" /
  TL;DR / Summary ganz oben auf der Seite. Da kann man auch schön noch mal
  die SEO Keywords reinpacken.

Why a script and not 14 inline Edits:
  Each TL;DR text is custom-written per post (I won't auto-generate from
  the body — too easy to drop nuance). But the *transformation* is identical
  for all seven files: insert ## TL;DR right after the closing frontmatter
  line, remove the ## Fazit section to EOF. Doing this in one place means
  the transformation is auditable and the edits are uniform.

Idempotent: if the file already has a "## TL;DR" section, skip the insert.
If it has no "## Fazit" section, skip the removal.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = REPO_ROOT / "content" / "blog"

# slug -> TL;DR markdown body (no leading "## TL;DR" header — the script
# adds that). Each TL;DR is 2-3 sentences with bolded keywords for SEO.
TLDR_PER_SLUG: dict[str, str] = {
    "dji-osmo-pocket-3-swing-video": (
        "Die **DJI Osmo Pocket 3** ist die kompakte 1-Zoll-Sensor-Gimbal-"
        "Kamera, die wir Golfern für **Swing-Videos** und **Golf-Reisen** "
        "empfehlen. **4K bei 120 Bildern pro Sekunde** ermöglicht echte "
        "Slow-Motion-Schwung-Analyse, **ActiveTrack 6.0** macht Solo-"
        "Aufnahmen ohne Kamera-Assistenten möglich. Klare Empfehlung für "
        "alle, die ihre Technik datenbasiert verbessern oder auf Reisen "
        "mehr als Handy-Qualität mitnehmen wollen."
    ),
    "bushnell-launch-pro-launch-monitor": (
        "Der **Bushnell Launch Pro** ist ein **kamera-basierter Launch "
        "Monitor** für ambitionierte Amateure und Club-Fitter — rund **3.200 "
        "Euro**, **13+ Datenpunkte**, Indoor und Outdoor, ohne die typischen "
        "Radar-Probleme bei wechselndem Licht. Das **Gold-Abonnement** (499 "
        "USD/Jahr) schaltet 25 virtuelle Kurse plus **GSPro-Integration** "
        "frei. Sinnvoll, wenn du mit Messwerten arbeitest oder einen "
        "Home-Simulator baust — kein Pflicht-Equipment für reine Greenfee-"
        "Spieler."
    ),
    "happy-gilmore-2-netflix": (
        "**Happy Gilmore 2** ist seit 2026 auf **Netflix** verfügbar — der "
        "lang erwartete Sequel zu **Adam Sandlers** 1996er Golf-Komödie. "
        "Sandler kehrt als gereifter Happy zurück, mit neuen Figuren und "
        "**PGA-Tour-Cameos**. Für Golfer, die das Original mögen, ein "
        "gelungener Nostalgie-Abend; für Neulinge auch eigenständig "
        "funktional, gewinnt aber durch Kontext aus Teil 1."
    ),
    "strokesin-app-empfehlung": (
        "**StrokesIn** von golfsoft.ch ist die **Scorecard- und Handicap-"
        "App**, die wir Mitgliedern empfehlen — besonders wegen ihrer "
        "durchdachten **Statistik-Funktionen** (Drive-Distanzen, Putt-"
        "Analyse, Multi-Runden-Mustererkennung). **World Handicap System "
        "(WHS)**-konform, für **iOS und Android**, auf Deutsch und "
        "Englisch. Drei Eingabe-Methoden: manuell, **Foto-Scan** der "
        "Scorekarte oder **Voice-Diktat** auf der Runde."
    ),
    "magnetischer-ballmarker-puttergriff": (
        "**Magnetische Ballmarker-Halter** am Puttergriff lösen das Alltags-"
        "Problem verlorener Marker auf simple Art: der Marker hängt "
        "magnetisch am Putter und ist dadurch immer dabei. Beim Kauf auf "
        "**Haltekraft des Magneten**, **Griff-Kompatibilität**, "
        "**Marker-Größe** (24 mm USGA-Standard) und **Material** "
        "(Edelstahl/Aluminium statt Plastik) achten. Niedriger Preis, "
        "täglich spürbarer Nutzen für jeden, der regelmäßig spielt."
    ),
    "nivea-uv-dry-protect-sport-sonnenspray": (
        "Eine 18-Loch-Runde dauert vier bis fünf Stunden in voller Sonne — "
        "**Hautkrebs-Prävention** ist für Golfer kein Randthema. Wir "
        "empfehlen **NIVEA UV Dry Protect Sport** mit **LSF 50**: Sport-"
        "Spray, **wasserfest bis 80 Minuten**, trockenes Finish ohne "
        "klebriges Hautgefühl. Auftragen vor dem ersten Tee und an Loch "
        "9/10 nachsprühen — keine 30 Sekunden Aufwand, dauerhafter "
        "Hautschutz."
    ),
    "counterpain-hot-plus-muskelpflege": (
        "**Counterpain Hot Plus** ist eine **Wärme-Salbe** des japanischen "
        "Herstellers **Taisho**, die seit Jahrzehnten in japanischen "
        "Clubhäusern zum Standard im Golfer-Kit gehört. **0,5 % Piroxicam** "
        "plus Menthol und Methyl Salicylate — gezielt für **Nacken-, "
        "Schulter-, Rücken- und Unterarm-Beschwerden** nach asymmetrischer "
        "Golf-Belastung. Klein genug fürs Reisegepäck. **Achtung:** kein "
        "Medizin-Ersatz, Warnhinweise vom Hersteller beachten."
    ),
}

# Match the closing --- of frontmatter followed by a blank line then ## .
FRONTMATTER_END_RE = re.compile(r"^---\s*$\n\n", re.MULTILINE)
# Match either old ("## TL;DR") or new ("## TL;DR – Fazit") header for
# idempotency — and the rename pass below upgrades old to new.
TLDR_HEADER_RE = re.compile(r"^## TL;DR( – Fazit)?\s*$", re.MULTILINE)
TLDR_HEADER = "## TL;DR – Fazit"
# Match "## Fazit" or "## Unser Fazit" through end of file.
FAZIT_BLOCK_RE = re.compile(r"\n+## (?:Unser )?Fazit\s*\n.*\Z", re.DOTALL)


def transform(slug: str, text: str) -> tuple[str, list[str]]:
    """Returns (new_text, log_messages)."""
    log: list[str] = []
    new_text = text

    # 1) Rename old "## TL;DR" header to "## TL;DR – Fazit" (User-Request
    #    04-18: "Schreibe ruhig auch 'TL;DR - Fazit' als Überschrift, weil
    #    nicht alle Golfer vom Alter her Digital Natives sind.").
    rename_pattern = re.compile(r"^## TL;DR\s*$", re.MULTILINE)
    if rename_pattern.search(new_text):
        new_text = rename_pattern.sub(TLDR_HEADER, new_text)
        log.append("renamed TL;DR header to 'TL;DR – Fazit'")

    # 2) Insert TL;DR right after frontmatter, before the first ##.
    if TLDR_HEADER_RE.search(new_text):
        log.append("skip TL;DR insert (already present)")
    else:
        tldr_block = (
            f"{TLDR_HEADER}\n\n{TLDR_PER_SLUG[slug]}\n\n"
        )
        # Find the line that ends the frontmatter (---) followed by blank line.
        match = FRONTMATTER_END_RE.search(new_text)
        if not match:
            log.append("FAIL: no closing frontmatter line found")
            return (new_text, log)
        insert_at = match.end()
        new_text = new_text[:insert_at] + tldr_block + new_text[insert_at:]
        log.append("inserted TL;DR")

    # 3) Strip any ## Fazit section from the end.
    fazit_match = FAZIT_BLOCK_RE.search(new_text)
    if fazit_match:
        new_text = new_text[: fazit_match.start()].rstrip() + "\n"
        log.append("removed Fazit section")
    else:
        log.append("skip Fazit removal (no Fazit found)")

    return (new_text, log)


def main() -> int:
    if not BLOG_DIR.is_dir():
        print(f"FATAL: blog dir {BLOG_DIR} not found", file=sys.stderr)
        return 2

    any_failures = False
    for slug, _ in TLDR_PER_SLUG.items():
        path = BLOG_DIR / f"{slug}.md"
        if not path.is_file():
            print(f"  ! {slug}: file not found ({path})")
            any_failures = True
            continue
        text = path.read_text(encoding="utf-8")
        new_text, log = transform(slug, text)
        for entry in log:
            print(f"  {slug}: {entry}")
        if new_text != text:
            path.write_text(new_text, encoding="utf-8")

    print()
    print("Done.")
    return 1 if any_failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
