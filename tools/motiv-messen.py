#!/usr/bin/env python3
"""Misst, wie viel eines Motivs beim Sticken verloren ginge.

Warum es dieses Skript gibt (12.09.2026): Die Einteilung "welches Land laesst
sich sticken" war vorher eine Einschaetzung nach Flaggenaufbau — und die war
falsch. Die Motive sind eine Strichzeichnung mit unterbrochenen Strichen, die
Flagge liegt *in* den Strichen. Entscheidend ist deshalb nicht die Flagge,
sondern wie klein die Farbstuecke innerhalb eines Strichs werden.

Gemessen wird genau eine Zahl: der Anteil der Motivflaeche, der in Teilen
steckt, die schmaler als die Stickgrenze sind (voreingestellt 1 mm — darunter
gibt es keinen Satinstich). Null heisst: vollstaendig stickbar, ohne dass
etwas weggelassen werden muss. Das ist Labis Bedingung.

Die erste Messung lief an den Webdateien (public/faces, 256 px). Die reichen
fuer das Shirt (69 mm Druckbreite, 0,44 mm je Pixel), aber NICHT fuer den
Hoodie (166 mm): dort waere ein Pixel 1,05 mm gross, feineres kann in der
Datei gar nicht vorkommen, und die Messung sagt zwangslaeufig "kein Verlust".
Deshalb braucht es die EPS-Druckdaten, gerendert mit mindestens 5 Pixeln je
Millimeter.

Aufruf:
    python3 tools/motiv-messen.py <ordner> --breite-mm 166
    python3 tools/motiv-messen.py public/faces --breite-mm 69 --json /tmp/m.json

EPS zuerst in PNG wandeln, Motivbreite mindestens 1000 px, z. B.:
    gs -dSAFER -sDEVICE=pngalpha -r600 -o motiv.png datei.eps
    magick -density 600 datei.eps -background none motiv.png
"""
import argparse, glob, json, os, sys
import numpy as np
from PIL import Image

NACHBARN = ((1, 0), (-1, 0), (1, 1), (-1, 1))


def _edt1d(f):
    """Exakte quadrierte Distanz je Zeile (Felzenszwalb). Reines numpy, damit
    das Skript ohne scipy laeuft — auf dem Mac ist scipy oft nicht da."""
    n = len(f); d = np.empty(n); v = np.zeros(n, int); z = np.empty(n + 1)
    k = 0; z[0] = -1e20; z[1] = 1e20
    for q in range(1, n):
        s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
        while s <= z[k]:
            k -= 1
            s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
        k += 1; v[k] = q; z[k] = s; z[k + 1] = 1e20
    k = 0
    for q in range(n):
        while z[k + 1] < q:
            k += 1
        d[q] = (q - v[k]) ** 2 + f[v[k]]
    return d


def distanz(maske):
    f = np.where(maske, 1e20, 0.0)
    for i in range(f.shape[0]):
        f[i] = _edt1d(f[i])
    for j in range(f.shape[1]):
        f[:, j] = _edt1d(f[:, j])
    return np.sqrt(f)


def komponenten(maske):
    """Zusammenhaengende Flecken per Maximum-Ausbreitung. Langsamer als eine
    Bibliothek, aber ohne Abhaengigkeit — und die Bilder sind klein."""
    lab = np.where(maske, np.arange(maske.size).reshape(maske.shape), -1)
    while True:
        alt = lab.copy()
        for sh, ax in NACHBARN:
            r = np.roll(lab, sh, axis=ax)
            if ax == 0:
                r[0 if sh == 1 else -1, :] = -1
            else:
                r[:, 0 if sh == 1 else -1] = -1
            lab = np.where(maske, np.maximum(lab, r), -1)
        if (lab == alt).all():
            return lab


def innen(maske):
    """Kantenglaettung wegnehmen: nur Pixel, deren vier Nachbarn auch im Motiv
    liegen. Sonst zaehlen halbtransparente Randpixel als eigene Farben."""
    i = maske.copy()
    for sh, ax in NACHBARN:
        r = np.roll(maske, sh, axis=ax)
        if ax == 0:
            r[0 if sh == 1 else -1, :] = False
        else:
            r[:, 0 if sh == 1 else -1] = False
        i &= r
    return i


def messen(pfad, breite_mm, grenze_mm, mindestanteil):
    bild = Image.open(pfad).convert('RGBA')
    a = np.array(bild)
    maske = a[..., 3] > 200
    if not maske.any():
        return None
    inn = innen(maske)
    xs = np.nonzero(maske)[1]
    bbox_px = xs.max() - xs.min() + 1
    mmpx = breite_mm / bbox_px

    # Farben grob buendeln, damit Verlaeufe im Bild nicht als 200 Farben zaehlen
    q = a[..., :3] // 48
    schluessel = q[..., 0].astype(int) * 10000 + q[..., 1] * 100 + q[..., 2]
    werte, anzahl = np.unique(schluessel[inn], return_counts=True)
    haupt = werte[anzahl > inn.sum() * mindestanteil]

    verlust_px = 0
    for farbe in haupt:
        m = inn & (schluessel == farbe)
        d = distanz(m)
        lab = komponenten(m)
        for i in np.unique(lab[m]):
            fleck = lab == i
            # Breite eines Flecks = zweimal der groesste Radius, der hineinpasst
            if 2 * d[fleck].max() * mmpx < grenze_mm:
                verlust_px += int(fleck.sum())

    return dict(datei=os.path.basename(pfad),
                bbox_px=int(bbox_px),
                aufloesung_mm=round(mmpx, 3),
                farben=int(len(haupt)),
                flaeche_mm2=round(float(inn.sum()) * mmpx * mmpx, 1),
                verlust_prozent=round(100.0 * verlust_px / inn.sum(), 2))


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('ordner', help='Ordner mit den Motivbildern (PNG mit Transparenz)')
    p.add_argument('--breite-mm', type=float, required=True,
                   help='Druckbreite des Motivs in mm (Hoodie 166, Shirt/Sweater 69)')
    p.add_argument('--grenze-mm', type=float, default=1.0,
                   help='kleinste stickbare Breite, voreingestellt 1,0 mm')
    p.add_argument('--mindestanteil', type=float, default=0.02,
                   help='ab welchem Flaechenanteil eine Farbe als Hauptfarbe zaehlt')
    p.add_argument('--json', help='Ergebnis zusaetzlich als JSON hierhin schreiben')
    a = p.parse_args()

    dateien = sorted(sum([glob.glob(os.path.join(a.ordner, e))
                          for e in ('*.png', '*.PNG')], []))
    if not dateien:
        sys.exit(f'Keine PNG in {a.ordner}. EPS vorher rendern — siehe Kopf dieser Datei.')

    erg = []
    for d in dateien:
        z = messen(d, a.breite_mm, a.grenze_mm, a.mindestanteil)
        if z:
            erg.append(z)
            print(f"{z['datei']:<28} Verlust {z['verlust_prozent']:6.2f} %   "
                  f"Farben {z['farben']:2d}   {z['aufloesung_mm']:.3f} mm/px", flush=True)

    schlecht = [z for z in erg if z['aufloesung_mm'] > a.grenze_mm / 5]
    v = np.array([z['verlust_prozent'] for z in erg])
    print(f"\n{len(erg)} Motive bei {a.breite_mm:.0f} mm Druckbreite, Grenze {a.grenze_mm} mm")
    print(f"  ohne Verlust (unter 0,5 %): {(v < 0.5).sum()}")
    print(f"  0,5 bis 2 %: {((v >= 0.5) & (v < 2)).sum()}   "
          f"2 bis 5 %: {((v >= 2) & (v < 5)).sum()}   ueber 5 %: {(v >= 5).sum()}")
    print(f"  Median {np.median(v):.2f} %, schlechtestes {v.max():.1f} %")
    if schlecht:
        # Das ist die Falle, in die die erste Messung gelaufen ist: zu grobe
        # Vorlage, und das Ergebnis sagt zwangslaeufig "kein Verlust".
        print(f"\n  ACHTUNG: {len(schlecht)} Bilder sind zu grob aufgeloest "
              f"(ueber {a.grenze_mm/5:.2f} mm je Pixel). Deren 0 % sind kein Befund,")
        print( "  sondern ein Artefakt. Hoeher rendern und noch einmal messen.")
    if a.json:
        json.dump(erg, open(a.json, 'w'), ensure_ascii=False, indent=1)
        print(f"\nJSON: {a.json}")


if __name__ == '__main__':
    main()
