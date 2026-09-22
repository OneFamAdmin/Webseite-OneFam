#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Findet zu einer PDF-Seite die passende EPS-Datei — ueber das Farbprofil.

Warum es das gibt (22.09.2026): Die 253 EPS-Druckdaten heissen
„loco-motive_Zeichenflaeche 1 Kopie NNN.eps" und tragen **keinen Laendernamen**.
Die Seitenzahl der PDF laesst sich dagegen ueber `docs/sicherungen/
siebdruck-messwerte-252.csv` einem Land zuordnen. Dieses Skript schlaegt die
Bruecke: Es rendert die PDF-Seite als Referenz, rendert alle EPS klein, und
vergleicht die Farbanteile des freigestellten Motivs.

Am 22.09.2026 an Albanien geprueft: PDF-Seite 6 → „Kopie 5", Abstand **0,085**
gegen **0,429** beim Zweitbesten. **Und visuell an der Flaggenkachel
bestaetigt** — die sitzt unten rechts auf jeder PDF-Seite und zeigt die echte
Flagge. Ein Treffer ist erst ein Befund, wenn diese Kachel stimmt.

Aufruf:
    python3 tools/motiv-finden.py --seite 6
    python3 tools/motiv-finden.py --seite 144 --eps ~/Downloads/onefam-eps

Danach die Flaggenkachel ansehen (das Skript schreibt sie mit heraus) und erst
dann die gefundene Datei benutzen.

**Zugriffsfalle:** `~/Documents`, `~/Desktop` und externe Datentraeger sind fuer
Claude Code durch TCC gesperrt. Die EPS muessen unter `~/Downloads` liegen.
"""
import argparse, glob, os, subprocess, tempfile
import numpy as np
from PIL import Image

PDF = os.path.expanduser('~/Downloads/loco-motive_Logo_rgb_flags_final 2.pdf')


def freistellen(arr):
    """Hintergrund und Flaggenkachel weg — dieselbe Logik wie in sieb-messen.py."""
    H, W, _ = arr.shape
    ring = np.concatenate([arr[:3].reshape(-1, 3), arr[-3:].reshape(-1, 3),
                           arr[:, :3].reshape(-1, 3), arr[:, -3:].reshape(-1, 3)])
    c, n = np.unique(ring.reshape(-1, 3), axis=0, return_counts=True)
    bg = c[n.argmax()]
    m = (np.abs(arr.astype(int) - bg.astype(int)).sum(axis=2) > 30)
    kachel = np.zeros_like(m)
    kachel[int(0.78 * H):, int(0.78 * W):] = True
    return m & ~kachel


def profil(arr):
    m = freistellen(arr)
    if m.sum() < 50:
        return None
    q = arr[m] // 64                       # grob buendeln, Rendering-Unterschiede ausgleichen
    cols, cnt = np.unique(q.reshape(-1, 3), axis=0, return_counts=True)
    return {tuple(int(x) for x in c): k / cnt.sum() for c, k in zip(cols, cnt)}


def abstand(a, b):
    return sum(abs(a.get(k, 0) - b.get(k, 0)) for k in set(a) | set(b))


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--seite', type=int, required=True, help='PDF-Seite des gesuchten Motivs')
    p.add_argument('--eps', default=os.path.expanduser('~/Downloads/onefam-eps'))
    p.add_argument('--pdf', default=PDF)
    p.add_argument('--treffer', type=int, default=5)
    p.add_argument('--ziel', default='.', help='wohin Referenzbild und Flaggenkachel geschrieben werden')
    a = p.parse_args()

    with tempfile.TemporaryDirectory() as tmp:
        ref_png = os.path.join(tmp, 'ref.png')
        subprocess.run(['gs', '-q', '-dSAFER', '-dBATCH', '-dNOPAUSE',
                        '-dFirstPage=%d' % a.seite, '-dLastPage=%d' % a.seite,
                        '-sDEVICE=png16m', '-r150', '-o', ref_png, a.pdf], check=True)
        ref_bild = Image.open(ref_png).convert('RGB')
        ref = profil(np.array(ref_bild))

        # Flaggenkachel zur Sichtpruefung herausschreiben — ohne sie ist der Treffer kein Befund
        W, H = ref_bild.size
        kachel = ref_bild.crop((int(.78 * W), int(.78 * H), W, H)).resize((360, 360), Image.NEAREST)
        k_pfad = os.path.join(a.ziel, 'flaggenkachel_seite%d.png' % a.seite)
        kachel.save(k_pfad)

        dateien = [f for f in glob.glob(os.path.join(a.eps, '*.eps'))
                   if not os.path.basename(f).startswith('._')]
        if not dateien:
            print('Keine EPS gefunden in', a.eps)
            print('Liegen sie unter ~/Documents oder auf einer externen Platte? Die sind gesperrt.')
            return
        print('Vergleiche PDF-Seite %d mit %d EPS-Dateien …' % (a.seite, len(dateien)))

        erg = []
        z = os.path.join(tmp, 'x.png')
        for i, f in enumerate(dateien):
            try:
                subprocess.run(['gs', '-q', '-dSAFER', '-dBATCH', '-dNOPAUSE', '-dEPSCrop',
                                '-sDEVICE=png16m', '-r30', '-o', z, f],
                               check=True, capture_output=True, timeout=60)
                pr = profil(np.array(Image.open(z).convert('RGB')))
                if pr:
                    erg.append((abstand(ref, pr), os.path.basename(f)))
            except Exception:
                pass
            if (i + 1) % 60 == 0:
                print('  … %d/%d' % (i + 1, len(dateien)), flush=True)

    erg.sort()
    print('\nBeste Treffer (kleiner Abstand = aehnlicher):')
    for d, n in erg[:a.treffer]:
        print('  %.3f  %s' % (d, n))
    if len(erg) > 1:
        v = erg[1][0] / erg[0][0] if erg[0][0] > 0 else 999
        print('\nAbstandsverhaeltnis zum Zweitbesten: %.1fx' % v)
        print('Unter 2x ist der Treffer nicht eindeutig — dann in jedem Fall die Kachel pruefen.')
    print('\nFlaggenkachel zur Sichtpruefung:', k_pfad)


if __name__ == '__main__':
    main()
