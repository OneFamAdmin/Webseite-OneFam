#!/usr/bin/env python3
"""Macht aus dem freihängenden Hoodie-Bild eines Landes das Bild für die Übersicht
"Nach Land shoppen": das Zeichen gross, so wie es auf dem Stoff sitzt.

Warum (22.11.2026): In "Jetzt verfügbar" standen vier fast gleiche schwarze Hoodies
nebeneinander; das Zeichen war rund 15 % der Kachel breit und zu klein, um die Länder
zu unterscheiden (Befund 4 der Durchsicht vom 21.11.2026). Jetzt ist es rund 60 %.

Wie: ein fester Ausschnitt der Brust aus dem 4k-Bild (3712 x 4608). Der Druck wird in
alle Länderbilder an derselben Stelle rechnerisch eingerechnet — nachgesehen an
Afghanistan, Albanien, Andorra und Argentinien —, deshalb passt derselbe Kasten für
jedes Land. Es wird nichts neu erzeugt.

Der Stoff läuft oval aus, als Durchsichtigkeit im Bild (WebP mit Alpha). So schwebt das
Zeichen auf der Seite, egal welche Farbe sie hat. Verworfen: ein Rechteck mit weichem
Rand — es sah auf der Seite weiter nach Kasten aus.

Aufruf:
    python3 tools/zeichen-ausschnitt.py <slug> <Bilddatei oder https-Adresse>

    slug = Kategorie-Slug des Landes im Shop (afghanistan, albania, andorra, argentina …)
    Bild = das freihängende schwarze Hoodie-Bild in voller Grösse, z. B.
           https://shop.onefam.ch/wp-content/uploads/2026/08/OneFam_Albanien_Hoodie_schwarz_Freihaengend_4k-1.webp

Schreibt public/shop/zeichen/<slug>.webp (800 x 1000). Danach den Slug in
lib/shop/zeichenbilder.ts eintragen — ohne Eintrag zeigt die Übersicht das Produktbild.
"""
import io
import os
import sys
import urllib.request

import numpy as np
from PIL import Image

# 1500 x 1875 = 4:5, im 3712 x 4608 grossen Original. Oben die Kordeln und Ösen, unten der
# Ansatz der Tasche: so bleibt erkennbar, dass es ein Hoodie ist.
KASTEN = (1106, 852, 2606, 2727)
GROESSE = (800, 1000)  # Kachel höchstens 385 px breit (vier Spalten bei 1680 px), mal zwei für scharfe Bildschirme

# Diese Kacheln sind KEINE Ausschnitte aus dem Hoodie-Bild, sondern von Hand eingesetzte
# Nahfotos des Sticks (lib/shop/zeichenbilder.ts). Das Werkzeug überschreibt sie nicht.
VON_HAND = {"albania"}


def weich(t):
    """0 → 1 ohne Knick an beiden Enden."""
    u = np.clip(t, 0, 1)
    return u * u * u * (u * (u * 6 - 15) + 10)


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    slug, quelle = sys.argv[1], sys.argv[2]
    if slug in VON_HAND:
        sys.exit(f"{slug}.webp ist ein Stick-Nahfoto und wird nicht aus dem Hoodie-Bild erzeugt (siehe lib/shop/zeichenbilder.ts).")
    if quelle.startswith("https://"):
        with urllib.request.urlopen(urllib.request.Request(quelle, headers={"User-Agent": "zeichen-ausschnitt"})) as antwort:
            bild = Image.open(io.BytesIO(antwort.read()))
    else:
        bild = Image.open(quelle)
    bild = bild.convert("RGB")
    if bild.size != (3712, 4608):
        sys.exit(f"Erwartet wird das 4k-Bild 3712 x 4608, bekommen: {bild.size}. Der Kasten passt sonst nicht.")

    a = np.asarray(bild.crop(KASTEN).resize(GROESSE, Image.LANCZOS))
    h, w, _ = a.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    # Ellipse um das Zeichen: bis 58 % des Halbmessers voll deckend, an den Kantenmitten und
    # in den Ecken ganz durchsichtig.
    r = np.sqrt(((xx - w * 0.5) / (w * 0.5)) ** 2 + ((yy - h * 0.5) / (h * 0.5)) ** 2)
    deckkraft = (1.0 - weich((r - 0.58) / 0.40)) * 255.0

    ziel = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "shop", "zeichen")
    os.makedirs(ziel, exist_ok=True)
    datei = os.path.join(ziel, f"{slug}.webp")
    Image.fromarray(np.dstack([a, deckkraft.astype(np.uint8)]), "RGBA").save(datei, "WEBP", quality=84, alpha_quality=92, method=6)
    print(f"{datei}  {GROESSE[0]} x {GROESSE[1]}  {os.path.getsize(datei) // 1024} KB")


if __name__ == "__main__":
    main()
