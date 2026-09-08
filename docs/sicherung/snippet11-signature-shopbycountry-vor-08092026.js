// Snippet 11, /shop-by-country/: die Signature-Reihe (#lltiles) im Zustand vor dem
// 08.09.2026 — sieben Kacheln fest verkettet, 2 lebende und 5 "Bald verfuegbar".
// Am 08.09.2026 ersetzt durch die Liste BALD mit BALD_ZEIGEN=2, damit die
// vierspaltige .sigrid in einer Reihe aufgeht (gleicher Eingriff wie am 07.09.
// auf der Startseite, dort SOON_ZEIGEN). Zurueckholen = diesen Block wieder
// einsetzen; die Bildadressen der drei ausgeblendeten Kacheln stehen unveraendert
// weiter im Snippet, in der Liste BALD.
    box.innerHTML = kauf('/onefam-logo/','onefam-card-logo-v2-opt.webp','Logo')
      + kauf('/logo-black/','onefam-card-black-logo-v3-opt.webp','Logo Black')
      + bald('Logo White','/wp-content/uploads/2026/07/onefam-card-white-logo-v2-opt.webp')
      + bald('Logo Pink','/wp-content/uploads/2026/08/onefam-card-logo-pink.webp')
      + bald('Logo Platinum','/wp-content/uploads/2026/08/onefam-card-logo-platin.webp')
      + bald('Logo Bronze','/wp-content/uploads/2026/08/onefam-card-logo-bronze.webp')
      + bald('Logo Gold','/wp-content/uploads/2026/08/onefam-card-logo-gold.webp');
