import assert from "node:assert/strict";
import { inflateSync } from "node:zlib";

import * as ogModule from "../../app/opengraph-image";

/**
 * Wirkungstest fuer die Social-Kachel (2026-08-20).
 *
 * WAS PASSIERT IST: die Kachel schrieb auf JEDEM geteilten Link "im Golfclub
 * fuer55 Euro" — ohne Leerzeichen. Sie steht seit ihrem Einbau (PR #21) auf jeder
 * Vorschau bei WhatsApp, LinkedIn, Slack, Signal und in jedem Chat, in dem jemand
 * oakwoodgolfclub.de teilt.
 *
 * WER ES GEFUNDEN HAT: niemand und nichts. Kein Test, kein Lint, kein Review — es
 * fiel auf, weil jemand das Bild oeffnete, waehrend er etwas ganz anderes nachmass.
 * Zur Kachel gab es bis heute NULL Tests. Das ist der Befund; der fehlende
 * Zwischenraum ist nur das Zeichen.
 *
 * WARUM ER IM QUELLTEXT UNSICHTBAR WAR — und warum dieser Test rendert statt liest:
 * dort stand `fuer{" "}` vor dem naechsten Element, also ein voellig korrekt
 * aussehendes Leerzeichen. Satori (die Layout-Maschine hinter next/og) ist aber kein
 * Browser: einen ALLEINSTEHENDEN Weissraum-Knoten zwischen zwei Flex-Kindern
 * verwirft es. Ein Test, der die Datei liest, haette gruen gemeldet — er haette das
 * Leerzeichen ja gefunden. Nur im Bild war es nicht.
 *
 * Deshalb misst dieser Test das BILD. Der Trick ist, dass die beiden Woerter
 * verschiedene Markenfarben tragen: "fuer" steht in Pergament, "55 Euro" in
 * Fairway-Hell. Der Abstand zwischen dem letzten Pergament-Pixel und dem ersten
 * gruenen Pixel IST der Zwischenraum, um den es geht — kein Stellvertreter dafuer.
 *
 * ROT GEGENGEPROBT, nicht nur gruen gesehen (2026-08-20): mit dem Fix misst die
 * Luecke 12 px, mit dem wiederhergestellten Defekt exakt 0 px. Der Grenzwert von
 * 6 px liegt dazwischen und hat nach beiden Seiten Luft.
 *
 * NETZWERK: dieser Test laedt die drei Schriften vom fontsource-CDN, weil die
 * Kachel das tut. Das ist KEINE neue Abhaengigkeit der CI — `next build` holt
 * dieselben Dateien im Prerender-Durchlauf, der Bau faellt also ohnehin um, wenn
 * das CDN weg ist. Laufzeit lokal rund 1,4 s.
 */

// Die Kachel ist ein Next.js-Dateikonvention-Modul. Unter tsx kommt der
// Default-Export je nach Aufloesung einmal verschachtelt heraus; beide Formen
// werden hier abgefangen, damit der Test nicht an der Modulverpackung scheitert
// statt am Bild.
type Renderer = () => Promise<Response>;
const modAny = ogModule as unknown as {
  default: Renderer | { default: Renderer };
  size: { width: number; height: number };
};
const renderKachel: Renderer =
  typeof modAny.default === "function" ? modAny.default : modAny.default.default;

type Bild = { breite: number; hoehe: number; bpp: number; px: Buffer };

/** Minimaler PNG-Leser fuer 8-Bit RGB/RGBA ohne Verschraenkung. */
function liesPng(buf: Buffer): Bild {
  assert.equal(buf.readUInt32BE(0), 0x89504e47, "Antwort ist kein PNG");

  let off = 8;
  let kopf: { breite: number; hoehe: number; tiefe: number; farbtyp: number } | null = null;
  const idat: Buffer[] = [];

  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const typ = buf.toString("ascii", off + 4, off + 8);
    const daten = buf.subarray(off + 8, off + 8 + len);
    if (typ === "IHDR") {
      kopf = {
        breite: daten.readUInt32BE(0),
        hoehe: daten.readUInt32BE(4),
        tiefe: daten[8],
        farbtyp: daten[9],
      };
    } else if (typ === "IDAT") {
      idat.push(daten);
    } else if (typ === "IEND") {
      break;
    }
    off += 12 + len;
  }

  assert.ok(kopf, "kein IHDR im PNG");
  assert.equal(kopf.tiefe, 8, "erwartet 8 Bit Farbtiefe");
  assert.ok(kopf.farbtyp === 2 || kopf.farbtyp === 6, `unerwarteter Farbtyp ${kopf.farbtyp}`);

  const bpp = kopf.farbtyp === 6 ? 4 : 3;
  const roh = inflateSync(Buffer.concat(idat));
  const stride = kopf.breite * bpp;
  const px = Buffer.alloc(kopf.hoehe * stride);

  for (let y = 0; y < kopf.hoehe; y++) {
    const filter = roh[y * (stride + 1)];
    const zeile = roh.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? px[y * stride + i - bpp] : 0;
      const b = y > 0 ? px[(y - 1) * stride + i] : 0;
      const c = i >= bpp && y > 0 ? px[(y - 1) * stride + i - bpp] : 0;
      let v = zeile[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[y * stride + i] = v & 0xff;
    }
  }

  return { breite: kopf.breite, hoehe: kopf.hoehe, bpp, px };
}

/** Markenfarben, gespiegelt aus app/opengraph-image.tsx. */
const FAIRWAY = [0x1b, 0x66, 0x40];
const FAIRWAY_HELL = [0x52, 0xb2, 0x7f];
const PERGAMENT = [0xfa, 0xfa, 0xfa];
const GOLD = [0xd4, 0xa1, 0x2e];

/** Toleranz gegen Kantenglaettung — die Glyphenraender blenden in den Grund. */
const TOLERANZ = 40;

const trifft = (bild: Bild, i: number, farbe: number[]) =>
  Math.abs(bild.px[i] - farbe[0]) +
    Math.abs(bild.px[i + 1] - farbe[1]) +
    Math.abs(bild.px[i + 2] - farbe[2]) <
  TOLERANZ;

function zaehle(bild: Bild, farbe: number[]): number {
  let n = 0;
  for (let i = 0; i < bild.px.length; i += bild.bpp) if (trifft(bild, i, farbe)) n++;
  return n;
}

let pass = 0,
  fail = 0;
function check(label: string, fn: () => void) {
  try {
    fn();
    pass++;
    console.log(`  ok  ${label}`);
  } catch (err) {
    fail++;
    console.error(`  FAIL ${label}`);
    console.error(`       ${(err as Error).message}`);
  }
}

console.log("tests/seo/opengraph-image.test.ts");

// In einer Funktion gekapselt, weil dieses Testformat nach CJS uebersetzt wird und
// dort kein Top-Level-await erlaubt ist.
async function main() {
const antwort = await renderKachel();
assert.equal(
  antwort.headers.get("content-type"),
  "image/png",
  "die Kachel liefert kein PNG aus",
);
const bild = liesPng(Buffer.from(await antwort.arrayBuffer()));

check("die Kachel hat die Masse, die das Modul selbst angibt", () => {
  assert.equal(bild.breite, modAny.size.width, "Breite");
  assert.equal(bild.hoehe, modAny.size.height, "Hoehe");
});

check("das Bild ist tatsaechlich gezeichnet, nicht nur eine leere Flaeche", () => {
  // Faengt den Totalausfall: ein Renderfehler, der eine einfarbige Kachel liefert,
  // wuerde jede Massangabe oben bestehen.
  const grund = zaehle(bild, FAIRWAY);
  const schrift = zaehle(bild, PERGAMENT);
  const linie = zaehle(bild, GOLD);
  const gesamt = bild.breite * bild.hoehe;
  assert.ok(grund / gesamt > 0.5, `Fairway-Grund deckt nur ${((100 * grund) / gesamt).toFixed(1)} %`);
  assert.ok(schrift > 5000, `nur ${schrift} Pergament-Pixel — die Ueberschrift fehlt`);
  assert.ok(linie > 100, `nur ${linie} Gold-Pixel — die Zierlinie fehlt`);
});

check("zwischen 'fuer' und '55 Euro' steht ein sichtbarer Zwischenraum", () => {
  // Der eigentliche Waechter. "55 Euro" ist das einzige Fairway-Hell im Bild, also
  // markiert der gruene Block die zweite Zeile eindeutig. Das letzte Pergament LINKS
  // davon ist das Ende von "fuer". Der Abstand dazwischen ist der Zwischenraum.
  const { breite: B, hoehe: H, bpp } = bild;

  let gruenOben = H,
    gruenUnten = -1,
    gruenLinks = B;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < B; x++) {
      const i = (y * B + x) * bpp;
      if (trifft(bild, i, FAIRWAY_HELL)) {
        if (y < gruenOben) gruenOben = y;
        if (y > gruenUnten) gruenUnten = y;
        if (x < gruenLinks) gruenLinks = x;
      }
    }
  }
  assert.ok(
    gruenUnten >= 0,
    "kein einziges Fairway-Hell im Bild — '55 Euro' wird gar nicht hervorgehoben",
  );

  let pergamentRechts = -1;
  for (let y = gruenOben; y <= gruenUnten; y++) {
    for (let x = 0; x < gruenLinks; x++) {
      const i = (y * B + x) * bpp;
      if (trifft(bild, i, PERGAMENT) && x > pergamentRechts) pergamentRechts = x;
    }
  }
  assert.ok(
    pergamentRechts >= 0,
    "links von '55 Euro' steht kein heller Text — die Zeile 'im Golfclub fuer' fehlt",
  );

  const luecke = gruenLinks - pergamentRechts - 1;
  assert.ok(
    luecke >= 6,
    `nur ${luecke} px zwischen 'fuer' und '55 Euro' (gemessen: gruen ab x=${gruenLinks}, ` +
      `Pergament bis x=${pergamentRechts}). Mit Fix sind es 12 px, mit dem Defekt 0. ` +
      `Wahrscheinliche Ursache: ein alleinstehender Weissraum-Knoten zwischen zwei ` +
      `Flex-Kindern — den verwirft Satori. Abhilfe ist ein &nbsp; IM Textknoten.`,
  );
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
}

// Ein Fehler beim Rendern selbst — CDN weg, Satori-Ausnahme, kaputtes PNG — darf
// NICHT als stiller Erfolg enden. Deshalb wird hier hart abgebrochen statt geloggt.
main().catch((err) => {
  console.error("  FAIL die Kachel liess sich gar nicht erst rendern");
  console.error(`       ${(err as Error).message}`);
  process.exit(1);
});
