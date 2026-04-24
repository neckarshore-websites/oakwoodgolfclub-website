---
title: "Neue Webseite 2026: Was sich für Mitglieder ändert"
date: "2026-04-19"
modified: "2026-04-19"
excerpt: "Die Webseite des Oakwood Golf Club ist neu aufgebaut — schneller, auf dem Handy lesbar, datenschutzfreundlich und ohne Tracker Dritter. Was Mitglieder konkret davon haben, wie sich das Ganze anfühlt, und für die Neugierigen: womit wir es gebaut haben."
categories:
  - "Club"
pinned: true
author: "Oakwood Golf Club"
draft: false
---

## TL;DR / Zusammenfassung
Unsere **Webseite ist neu**. Schneller beim Laden, sauber auf dem Handy lesbar, ohne Tracker Dritter, mit funktionierenden Formularen. Alle bestehenden Inhalte bleiben erhalten — **Fernmitgliedschaft**, **Preise**, **Partnerplätze**, **FAQ**, **Blog**. Der Bestellweg zur Mitgliedschaft ist kürzer geworden. An der Mitgliedschaft selbst ändert sich nichts.

## Was Mitglieder konkret davon haben

Wer die alte Seite kennt, weiß: Sie war über Jahre gewachsen, gut gemeint, aber nicht mehr auf der Höhe der Zeit. Die neue Version ist keine Kosmetik, sondern ein Neubau auf anderem Fundament. Was davon im Alltag tatsächlich spürbar ist:

- **Tempo.** Die Startseite ist auf dem Handy in unter einer Sekunde da — auch mit mittelprächtigem Mobilfunk auf der Autobahn.
- **Lesbarkeit auf dem Handy.** Schriftgrößen, Zeilenlängen, Abstände sind konsequent vom Smartphone aus gedacht. Pinch-and-Zoom ist nicht mehr nötig.
- **Formulare, die funktionieren.** Anfragen, Kontakt, Mitgliedsantrag — alles ohne Aussetzer, mit klaren Rückmeldungen und Bestätigungsmail innerhalb weniger Sekunden.
- **Kein Tracker-Wildwuchs.** Keine Cookies von Google, Meta oder sonstigen Dritten. Kein Cookie-Banner, das einen auf jeder Unterseite überfällt — weil es schlicht nichts zuzustimmen gibt.
- **Ehrliche Datenschutzerklärung.** Aufgeräumt, auf die Dinge reduziert, die wir wirklich tun. Kein Copy-Paste-Textblock, der "nur für den Fall" Dinge auflistet, die wir gar nicht nutzen.
- **Widerruf und Geld-zurück-Garantie deutlich ausgewiesen.** 14 Tage Widerruf nach Gesetz, und darüber hinaus unsere freiwillige Rückerstattungszusage im ersten Jahr — beides steht jetzt dort, wo man es sucht, nicht versteckt im Kleingedruckten.
- **Blog, der sich lesen lässt.** Alte Beiträge sind erhalten, neue werden regelmäßiger erscheinen. Lange Posts haben Zwischenüberschriften, lesbare Absätze und eine Fazit-Box oben.

Was sich **nicht** ändert: die Mitgliedschaft selbst, die Preise, der Ablauf der Handicap-Verwaltung, die Partnerplätze in **Österreich** und der Schweiz, die Mitgliedskarten aus Papier, die ihr weiterhin per Post bekommt. Der Kern bleibt — nur der Rahmen ist neu.

## Vorher / Nachher

Zum Vergleich, wie die Startseite **vorher** aussah:

![Screenshot der alten Webseite: WordPress-Template mit grauem Hintergrund, zentralem Titelbild, klassischem Menü und einer eingebetteten Google-Karte der Partnerplätze](/blog/images/website-relaunch-vorher.webp)

Und so sieht sie **jetzt** aus:

![Screenshot der neuen Webseite: klare Typografie, großer Hero-Bereich mit Foto vom Fairway, Preisbox und prominente Call-to-Action — gebaut mobile-first](/blog/images/website-relaunch-nachher.webp)

Die beiden Screenshots sagen mehr als jede Aufzählung. Es geht nicht um *schöner* — es geht um *lesbarer, schneller, klarer*. Genau die Dinge, bei denen eine Webseite entweder hilft oder im Weg steht.

## Für die Neugierigen — unser Tech-Stack

Kurzer Nerd-Corner für die, die sich dafür interessieren. Wenn nicht: dieser Abschnitt lässt sich überspringen, es passiert nichts.

- **Framework: Next.js 16 mit App-Router** auf **React 19**. Das Frontend-Gerüst, hinter dem auch Unternehmen wie TikTok, Loom oder Walmart stehen. Serverseitiges Rendering bedeutet: Die Seite ist für Suchmaschinen und für den Browser gleichermaßen sofort lesbar — keine leere Hülle, die erst per JavaScript mit Inhalt gefüllt wird.
- **Styling: Tailwind CSS v4.** Konsistente Abstände, Farben und Typografie aus einem zentralen Design-System — kein Flickenteppich aus alten Stilregeln.
- **Hosting: Vercel.** Das Netzwerk, auf dem auch unser Framework entstanden ist. Inhalte werden regional zwischengespeichert, sodass der Handy-Abruf aus Wien genauso schnell ist wie aus Zürich oder Hamburg.
- **Schriften: selbst gehostet.** Keine Einbindung von Google Fonts — die Schriften liegen auf unserem eigenen Server. Heißt: keine IP-Adressen, die bei Google landen, keine DSGVO-Stolperfalle.
- **Analytik: minimal und cookiefrei.** Wir wissen, wie viele Leute die Preisseite aufrufen. Wir wissen nicht, wer sie aufruft. So soll es sein.
- **Formulare: eigenes Backend + IONOS-Mailversand.** Anfragen landen direkt bei uns, nicht bei einem amerikanischen Formular-Dienstleister.
- **Qualitätssicherung: Playwright.** Eine automatisierte Nacht-für-Nacht-Prüfung fährt das Anfrageformular gegen die echte Produktionsumgebung und merkt, wenn etwas kaputtgeht — bevor es ein Mitglied bemerkt.
- **Performance-Ziel: Lighthouse 95+** auf jeder Kernseite, Desktop wie Mobil. Ist objektiv messbar und bleibt auch nach jedem Release auf dem Niveau.

Das Ganze ist bewusst schlank gehalten. Kein Baukasten, kein Redaktionssystem mit zwanzig Plugins, die uns fremd warten. Jede Zeile Code steht für eine bewusste Entscheidung — und lässt sich von uns selbst lesen, prüfen, anpassen. Kleines Setup, langer Atem.

## Was als Nächstes kommt

Der Relaunch ist der Anfang, nicht das Ende. In der nächsten Ausbaustufe planen wir:

- **Mitgliederbereich** mit Login, Übersicht der eigenen Mitgliedschaftsdaten und Nachbestellung der Mitgliedskarte.
- **Digitale Scorecard-Anbindung.** Wir schauen uns an, wie sich die Runden-Erfassung und Handicap-Führung direkt mit unserer Lösung koppeln lässt — im Gleichklang mit unserer [Empfehlung für die StrokesIn-App](/blog/strokesin-app-empfehlung).
- **Newsletter**, den man als Mitglied abonnieren kann, um über Platz-News und Club-Geschichten informiert zu bleiben. Optional und nur mit ausdrücklicher Zustimmung.
- **Heatmap unserer Mitglieder** — ohne personenbezogene Daten, nur aggregiert auf Länder- oder Regionsebene, damit sichtbar wird, wie international unser kleiner Fernclub mittlerweile geworden ist.

Alles davon ist in Vorbereitung. Nichts davon wird live gehen, bevor es rund läuft und datenschutzrechtlich sauber ist.

## Feedback willkommen

Wenn euch etwas auffällt — ein kaputter Link, ein Tippfehler, eine Seite, die auf dem Handy eigenartig aussieht, eine Idee für einen Blog-Beitrag — schreibt uns kurz an [info@oakwoodgolfclub.de](mailto:info@oakwoodgolfclub.de). Wir sind ein kleines Team und lesen jede Mail. Rückmeldungen fließen direkt in die nächste Ausbauwelle.

Wer neu im Club ist oder es werden möchte: An unserer **14-tägigen Widerrufsfrist** und an unserer **Geld-zurück-Garantie im ersten Jahr** ändert sich nichts. Reinschnuppern ist risikolos — genau so, wie wir uns einen fairen Club-Eintritt vorstellen.
