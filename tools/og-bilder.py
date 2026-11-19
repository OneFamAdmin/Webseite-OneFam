#!/usr/bin/env python3
"""
Vorschaubilder (Open Graph, 1200 x 630) fuer onefam.ch — eines je Sprache.

    python3 tools/og-bilder.py

Schreibt public/og/onefam-og-<sprache>.jpg fuer en, de, fr, es.

WARUM ES DAS GIBT (19.11.2026): Bis dahin gab es ein einziges public/og-image.jpg,
fuer das keine Vorlage im Repo lag. Darauf stand der englische Claim und darunter
ein DEUTSCHER Satz — wer onefam.ch auf Englisch, Franzoesisch oder Spanisch teilte,
bekam eine halb deutsche Vorschau. Jetzt kommt jedes Bild aus derselben Vorlage,
mit den Texten aus messages/<sprache>.json, und laesst sich jederzeit neu erzeugen.

WIE: Die Vorlage ist HTML mit den echten Schriften (app/fonts) und Marken
(public/assets) der Seite. Google Chrome ohne Fenster fotografiert sie ab, Pillow
macht daraus ein JPEG. JPEG, nicht WebP und nicht PNG: WhatsApp zeigt WebP-Vorschauen
unzuverlaessig an (siehe lib/seo.ts), und ein Foto als PNG waere fuenfmal so gross.

AUFBAU wie das Hero der Startseite (components/Hero.tsx), damit Vorschau und Seite
zusammenpassen: Standbild des Hero-Videos abgedunkelt, Gesichtsmarke im Verlauf,
Wortmarke als Bild (sie ist keine Schrift), Claim in EB Garamond 400 in #EBD9A6,
goldene 1-px-Linie, darunter der erste Satz von seo.description in Satoshi.
Kein Verlaufsbalken oben wie im alten Bild — dekorative Verlaeufe sind nicht
erwuenscht (CLAUDE.md, Design und Marke).

Wer einen Claim oder die Beschreibung aendert, laesst dieses Skript neu laufen.
"""
import html
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

REPO = Path(__file__).resolve().parent.parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SPRACHEN = ["en", "de", "fr", "es"]
ZIEL = REPO / "public" / "og"


def erster_satz(text: str) -> str:
    # Der erste Satz der Beschreibung steht fuer sich; der zweite ("Nicht fuer alle …")
    # braucht den Zusammenhang der Seite und waere in einer Vorschau ein Raetsel.
    # Getrennt wird nur am Punkt: im Franzoesischen steht vor "?" ein Leerzeichen
    # ("D'où viens-tu ? »"), ein Fragezeichen als Satzende schnitt dort mitten ab.
    teile = re.split(r"(?<=\.)\s+", text.strip(), maxsplit=1)
    return teile[0]


def vorlage(claim: str, satz: str, sprache: str) -> str:
    f = (REPO / "app" / "fonts").as_uri()
    a = (REPO / "public" / "assets").as_uri()
    return f"""<!doctype html>
<html lang="{sprache}"><head><meta charset="utf-8">
<style>
@font-face {{ font-family: Garamond; src: url('{f}/EBGaramond-Variable.woff2') format('woff2'); font-weight: 400 800; }}
@font-face {{ font-family: Satoshi; src: url('{f}/Satoshi-Variable.woff2') format('woff2'); font-weight: 300 900; }}
html, body {{ margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #0a0a0a; }}
.foto {{ position: absolute; inset: -24px; background: url('{a}/hero-poster.jpg') center 38% / cover;
         filter: blur(4px) saturate(0.9); }}
.dunkel {{ position: absolute; inset: 0; background: radial-gradient(ellipse 62% 70% at 50% 52%, rgba(0,0,0,0.70), rgba(0,0,0,0.48)); }}
.inhalt {{ position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center;
           justify-content: center; text-align: center; padding: 0 90px; }}
.marke {{ height: 92px; width: 92px; }}
.wort {{ height: 34px; margin-top: 22px; }}
h1 {{ font-family: Garamond; font-weight: 400; color: #EBD9A6; font-size: 54px; line-height: 1.1;
      margin: 30px 0 0; max-width: 900px; text-wrap: balance; }}
.linie {{ width: 80px; height: 1px; background: #c9a84c; margin-top: 24px; }}
p {{ font-family: Satoshi; font-weight: 400; color: #c8c8c0; font-size: 23px; line-height: 1.5;
     letter-spacing: 0.012em; margin: 22px 0 0; max-width: 780px; text-wrap: balance; }}
.adresse {{ position: absolute; bottom: 30px; left: 0; right: 0; text-align: center;
            font-family: Satoshi; font-weight: 500; font-size: 16px; letter-spacing: 0.22em; color: #c9a84c; }}
</style></head>
<body>
<div class="foto"></div><div class="dunkel"></div>
<div class="inhalt">
  <img class="marke" src="{a}/logo-face-gradient.svg" alt="">
  <img class="wort" src="{a}/onefam-wortmarke.svg" alt="">
  <h1>{html.escape(claim)}</h1>
  <div class="linie"></div>
  <p>{html.escape(satz)}</p>
</div>
<div class="adresse">ONEFAM.CH</div>
</body></html>"""


def main() -> int:
    ZIEL.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        for sprache in SPRACHEN:
            texte = json.loads((REPO / "messages" / f"{sprache}.json").read_text(encoding="utf-8"))
            claim = texte["hero"]["claim"]
            satz = erster_satz(texte["seo"]["description"])
            seite = tmp / f"og-{sprache}.html"
            seite.write_text(vorlage(claim, satz, sprache), encoding="utf-8")
            png = tmp / f"og-{sprache}.png"
            subprocess.run(
                [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                 "--force-device-scale-factor=1", "--window-size=1200,630",
                 "--allow-file-access-from-files", "--virtual-time-budget=4000",
                 f"--user-data-dir={tmp / 'profil'}", f"--screenshot={png}", seite.as_uri()],
                check=True, capture_output=True, timeout=120,
            )
            bild = Image.open(png).convert("RGB")
            if bild.size != (1200, 630):
                print(f"{sprache}: falsche Groesse {bild.size}", file=sys.stderr)
                return 1
            ziel = ZIEL / f"onefam-og-{sprache}.jpg"
            bild.save(ziel, "JPEG", quality=86, optimize=True, progressive=True)
            print(f"{sprache}: {ziel.relative_to(REPO)}  {ziel.stat().st_size // 1024} KB  | {claim} | {satz}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
