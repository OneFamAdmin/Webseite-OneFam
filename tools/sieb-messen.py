#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Misst, wie fein die Motive bei welcher Druckgroesse werden — fuer Siebdruck.

Warum es dieses Skript zusaetzlich zu tools/motiv-messen.py gibt (21.09.2026):
motiv-messen.py beantwortet genau eine Frage ("wie viel geht beim Sticken
verloren") gegen genau eine Grenze, und es zaehlt nur Farben ueber 2 % der
Motivflaeche — genau das Feine (Wappen, Schrift, Sterne) faellt also heraus.
Beim Stick ist das egal, weil es dort ohnehin verschwindet. Beim Siebdruck ist
es der ganze Punkt: das Verfahren kann viel feiner, also muss das Feine
mitgezaehlt werden.

Gemessen wird deshalb hier:
  * eine Reihe von Grenzen auf einmal (0,2 bis 2,0 mm), weil die Distanzkarte
    ohnehin nur einmal gerechnet werden muss;
  * mit einer sehr kleinen Farbschwelle (0,1 % statt 2 %), damit Wappen und
    Schrift als eigene Farbe ueberleben.

Bezugsgroesse ist wie ueberall **8 cm Motivbreite**. Die Kennzahl ist
massstabsfrei umrechenbar: der Anteil unter g mm bei einer Motivbreite von
B cm ist derselbe wie der Anteil unter g * 8 / B mm bei 8 cm. Wer also wissen
will, was der Siebdruck bei 5 cm Motivbreite und einer Verfahrensgrenze von
0,3 mm noch traegt, liest die Spalte 0,48 mm ab (0,3 * 8 / 5).

Quelle ist dieselbe PDF wie bei der Stickfassung (252 Seiten), gerendert mit
Ghostscript — pdftoppm ist auf diesem Mac nicht installiert, gs schon.

Aufruf:
    python3 tools/sieb-messen.py --ziel /pfad/sieb-messwerte.csv
"""
import argparse, os, subprocess, sys, tempfile
from multiprocessing import Pool
import numpy as np
from PIL import Image
from scipy import ndimage as nd

PDF = os.environ.get('PDF', '/Users/labinotbajrami/Downloads/loco-motive_Logo_rgb_flags_final 2.pdf')
GRENZEN = [0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.5, 2.0]   # mm, bei 8 cm Motivbreite
FARBSCHWELLE = 0.001      # 0,1 % der Motivflaeche — Wappen und Schrift ueberleben
BEZUG_MM = 80.0
DPI = 400


def freistellen(arr):
    """Hintergrund und Flaggenkachel weg. Logik uebernommen aus
    tools/stickfassung/v2.py (zerlege) — dort an 99 Seiten kontrolliert:
    die Kachel sitzt immer unten rechts ab 78 % der Seite."""
    H, W, _ = arr.shape
    ring = np.concatenate([arr[:3].reshape(-1, 3), arr[-3:].reshape(-1, 3),
                           arr[:, :3].reshape(-1, 3), arr[:, -3:].reshape(-1, 3)])
    c, n = np.unique(ring.reshape(-1, 3), axis=0, return_counts=True)
    bg = c[n.argmax()]
    m = (np.abs(arr.astype(int) - bg.astype(int)).sum(axis=2) > 30)
    kachel = np.zeros_like(m)
    kachel[int(0.78 * H):, int(0.78 * W):] = True
    return m & ~kachel


def innen(maske):
    """Kantenglaettung wegnehmen — sonst zaehlen halbtransparente Randpixel
    als eigene Farbe. Gleiche Vierer-Nachbarschaft wie in motiv-messen.py."""
    i = maske.copy()
    for sh, ax in ((1, 0), (-1, 0), (1, 1), (-1, 1)):
        r = np.roll(maske, sh, axis=ax)
        if ax == 0:
            r[0 if sh == 1 else -1, :] = False
        else:
            r[:, 0 if sh == 1 else -1] = False
        i &= r
    return i


def messe_seite(seite):
    with tempfile.TemporaryDirectory() as tmp:
        ziel = os.path.join(tmp, 'p.png')
        subprocess.run(['gs', '-q', '-dSAFER', '-dBATCH', '-dNOPAUSE',
                        '-dFirstPage=%d' % seite, '-dLastPage=%d' % seite,
                        '-sDEVICE=png16m', '-r%d' % DPI, '-o', ziel, PDF],
                       check=True, capture_output=True)
        arr = np.array(Image.open(ziel).convert('RGB'))

    maske = freistellen(arr)
    if not maske.any():
        return None
    inn = innen(maske)
    xs = np.nonzero(maske)[1]
    breite_px = int(xs.max() - xs.min() + 1)
    mmpx = BEZUG_MM / breite_px            # mm je Pixel, bezogen auf 8 cm

    q = arr[..., :3] // 48
    schluessel = q[..., 0].astype(int) * 10000 + q[..., 1] * 100 + q[..., 2]
    werte, anzahl = np.unique(schluessel[inn], return_counts=True)
    gesamt = int(inn.sum())
    haupt = werte[anzahl > gesamt * FARBSCHWELLE]
    rest_px = gesamt - int(anzahl[anzahl > gesamt * FARBSCHWELLE].sum())

    verlust = {g: 0 for g in GRENZEN}
    for farbe in haupt:
        m = inn & (schluessel == farbe)
        d = nd.distance_transform_edt(m)
        lab, anz = nd.label(m)
        if anz == 0:
            continue
        # groesster Radius je Fleck; Fleckbreite = zweimal dieser Radius
        maxr = nd.maximum(d, lab, index=np.arange(1, anz + 1))
        groesse = np.bincount(lab.ravel())[1:]
        breiten_mm = 2 * np.asarray(maxr) * mmpx
        for g in GRENZEN:
            verlust[g] += int(groesse[breiten_mm < g].sum())

    zeile = {'seite': seite, 'breite_px': breite_px,
             'aufloesung_mm': round(mmpx, 4), 'farben': int(len(haupt)),
             'restflaeche_pct': round(100.0 * rest_px / gesamt, 2)}
    for g in GRENZEN:
        zeile['u%s' % g] = round(100.0 * verlust[g] / gesamt, 2)
    return zeile


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--ziel', required=True)
    p.add_argument('--seiten', default='1-252')
    p.add_argument('--prozesse', type=int, default=4)
    a = p.parse_args()

    if '-' in a.seiten:
        v, b = a.seiten.split('-')
        seiten = list(range(int(v), int(b) + 1))
    else:
        seiten = [int(s) for s in a.seiten.split(',')]

    with Pool(a.prozesse) as pool:
        erg = []
        for i, z in enumerate(pool.imap(messe_seite, seiten), 1):
            if z:
                erg.append(z)
            if i % 20 == 0:
                print('fertig bis Seite %d (%d/%d)' % (z['seite'] if z else -1, i, len(seiten)), flush=True)

    erg.sort(key=lambda z: z['seite'])
    kopf = ['seite', 'breite_px', 'aufloesung_mm', 'farben', 'restflaeche_pct'] + ['u%s' % g for g in GRENZEN]
    with open(a.ziel, 'w', encoding='utf-8') as f:
        f.write(';'.join(kopf) + '\n')
        for z in erg:
            f.write(';'.join(str(z[k]).replace('.', ',') for k in kopf) + '\n')
    print('geschrieben:', a.ziel, len(erg), 'Zeilen')


if __name__ == '__main__':
    main()
