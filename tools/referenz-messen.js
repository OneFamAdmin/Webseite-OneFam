// Referenz-Messung fuer Startseiten (18.10.2026).
//
// Wozu: Der Eindruck "wirkt edel" oder "wirkt billig" soll mit Zahlen beantwortet
// werden, nicht mit Geschmack. Dieses Skript misst eine fremde Startseite und
// onefam.ch auf genau dieselbe Weise. Es liest nur, es klickt nichts und uebernimmt
// keinen fremden Code. Gemessen werden Masse und Verhaeltnisse.
//
// Benutzung: im Browser auf der Startseite ausfuehren (Claude in Chrome,
// javascript_tool), Fenster innen 1440 x 685 wie bei der Shop-Messung vom
// 06.09.2026 (docs/REFERENZ-shopdesign.md). Ergebnis ist ein Objekt mit allen
// Werten. Ausgeloggt, ohne Query-Parameter, Cookie-Banner nicht anklicken —
// feste Ebenen (Banner, Popups) werden aus der Messung herausgerechnet.
//
// Lehre aus dem 06.09.: ein <video> ohne poster sah dort aus wie "kein Bild".
// Deshalb zaehlt hier jedes sichtbare Video mit, und nach der Messung wird
// IMMER ein Bildschirmfoto angesehen.

(async () => {
  const vw = innerWidth, vh = innerHeight;
  const warte = ms => new Promise(r => setTimeout(r, ms));

  // Einmal durchscrollen, damit nachgeladene Bilder und Abschnitte da sind.
  for (let y = 0; y < document.documentElement.scrollHeight; y += vh * 0.8) {
    scrollTo(0, y); await warte(250);
  }
  scrollTo(0, 0); await warte(800);

  const sichtbar = e => {
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  // Feste Ebenen, die keine Kopfzeile sind (Cookie-Banner, Popups, Chat-Knoepfe).
  const inFesterEbene = e => {
    for (let p = e; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.position === 'fixed' || cs.position === 'sticky') {
        const r = p.getBoundingClientRect();
        const istKopf = r.top <= 1 && r.height < vh * 0.25 && r.width > vw * 0.8;
        // Eine feste Ebene, die fast den ganzen Schirm fuellt, ist Hintergrund
        // (z. B. das Vollbild-Video bei Aime Leon Dore), kein Banner.
        const istHintergrund = r.width >= vw * 0.9 && r.height >= vh * 0.9;
        return !istKopf && !istHintergrund;
      }
    }
    return false;
  };
  const absTop = e => e.getBoundingClientRect().top + scrollY;
  const px = v => Math.round(parseFloat(v) * 10) / 10;

  // ── Bilder: img, video, picture, canvas, Hintergrundbilder ──────────────
  const medien = [];
  for (const e of document.querySelectorAll('img, video, canvas, svg image, *')) {
    let art = null;
    if (e.tagName === 'IMG' && e.currentSrc) art = 'img';
    else if (e.tagName === 'VIDEO') art = e.poster ? 'video+poster' : 'video';
    else if (e.tagName === 'CANVAS') art = 'canvas';
    else {
      const bg = getComputedStyle(e).backgroundImage;
      if (bg && bg.includes('url(')) art = 'hintergrund';
    }
    if (!art || !sichtbar(e) || inFesterEbene(e)) continue;
    const r = e.getBoundingClientRect();
    if (r.width < 120 || r.height < 120) continue; // Logos und Symbole weg
    medien.push({ art, top: r.top + scrollY, left: r.left, w: r.width, h: r.height });
  }
  // Flaeche im ersten Bildschirm: Raster aus Messpunkten statt Summe, damit
  // uebereinanderliegende Bilder nicht doppelt zaehlen.
  let treffer = 0, punkte = 0;
  for (let y = 5; y < vh; y += 20) for (let x = 5; x < vw; x += 20) {
    punkte++;
    if (medien.some(m => m.top <= y && y <= m.top + m.h && m.left <= x && x <= m.left + m.w)) treffer++;
  }
  const ersteMedien = medien.filter(m => m.top < vh * 3).sort((a, b) => a.top - b.top);
  const hochformat = medien.filter(m => m.h > m.w * 1.05).length;
  const querformat = medien.filter(m => m.w > m.h * 1.05).length;

  // ── Text ────────────────────────────────────────────────────────────────
  const textEl = [...document.querySelectorAll('h1,h2,h3,h4,p,a,span,li,blockquote,button,div')]
    .filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1))
    .filter(e => sichtbar(e) && !inFesterEbene(e));
  const stil = e => {
    const cs = getComputedStyle(e);
    return {
      text: e.innerText.trim().replace(/\s+/g, ' ').slice(0, 80),
      groesse: px(cs.fontSize), schrift: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
      gewicht: cs.fontWeight, zeilenhoehe: cs.lineHeight === 'normal' ? 'normal' : px(cs.lineHeight),
      laufweite: cs.letterSpacing, gross: cs.textTransform, farbe: cs.color,
      top: Math.round(absTop(e)),
    };
  };
  const h1 = [...document.querySelectorAll('h1')].find(e => sichtbar(e) && !inFesterEbene(e));
  const ersterSchirm = textEl.filter(e => absTop(e) < vh);
  const groesster = ersterSchirm.slice().sort((a, b) =>
    parseFloat(getComputedStyle(b).fontSize) - parseFloat(getComputedStyle(a).fontSize))[0];

  // Fliesstext: Schriftgroesse, gewichtet nach Zeichen, nur Absaetze mit > 60 Zeichen.
  const absaetze = [...document.querySelectorAll('p, li, blockquote')]
    .filter(e => sichtbar(e) && !inFesterEbene(e) && e.innerText.trim().length > 60);
  const nachGroesse = {};
  for (const p of absaetze) {
    const k = px(getComputedStyle(p).fontSize);
    nachGroesse[k] = (nachGroesse[k] || 0) + p.innerText.length;
  }
  const fliessGroesse = Object.entries(nachGroesse).sort((a, b) => b[1] - a[1])[0];
  const fliessBsp = absaetze.find(p => fliessGroesse && px(getComputedStyle(p).fontSize) == fliessGroesse[0]);
  const breiten = absaetze.map(p => p.getBoundingClientRect().width).sort((a, b) => a - b);
  const median = a => a.length ? a[Math.floor(a.length / 2)] : null;
  const zeichenJeZeile = fliessBsp
    ? Math.round(fliessBsp.getBoundingClientRect().width / (parseFloat(getComputedStyle(fliessBsp).fontSize) * 0.5))
    : null;

  // Schriften nach Zeichenanteil.
  const schriften = {};
  for (const e of textEl) {
    const f = getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const n = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('').length;
    schriften[f] = (schriften[f] || 0) + n;
  }
  const summe = Object.values(schriften).reduce((a, b) => a + b, 0) || 1;
  const schriftAnteile = Object.entries(schriften).sort((a, b) => b[1] - a[1]).slice(0, 4)
    .map(([f, n]) => `${f} ${Math.round(n / summe * 100)} %`);

  // Ueberschriften: wie viele in Grossbuchstaben, Groessen h2.
  const ueber = [...document.querySelectorAll('h1,h2,h3')].filter(e => sichtbar(e) && !inFesterEbene(e));
  const versal = ueber.filter(e => getComputedStyle(e).textTransform === 'uppercase'
    || (e.innerText.length > 3 && e.innerText === e.innerText.toUpperCase())).length;
  const h2 = [...document.querySelectorAll('h2')].filter(e => sichtbar(e) && !inFesterEbene(e)).map(e => px(getComputedStyle(e).fontSize));

  // ── Farben nach Flaeche (grosse Bloecke) ────────────────────────────────
  const farben = {};
  for (const e of document.querySelectorAll('body, body *')) {
    if (!sichtbar(e) || inFesterEbene(e)) continue;
    const r = e.getBoundingClientRect();
    if (r.width < vw * 0.6 || r.height < 120) continue;
    const bg = getComputedStyle(e).backgroundColor;
    if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') continue;
    farben[bg] = (farben[bg] || 0) + r.width * r.height;
  }
  const flaeche = Object.values(farben).reduce((a, b) => a + b, 0) || 1;
  const hintergruende = Object.entries(farben).sort((a, b) => b[1] - a[1]).slice(0, 4)
    .map(([c, a]) => `${c} ${Math.round(a / flaeche * 100)} %`);

  // ── Knoepfe im ersten Bildschirm ────────────────────────────────────────
  const knoepfe = [...document.querySelectorAll('a, button')]
    .filter(e => sichtbar(e) && !inFesterEbene(e) && absTop(e) < vh * 1.5 && e.innerText.trim())
    .filter(e => {
      const cs = getComputedStyle(e);
      // backgroundImage mitzaehlen: Verlaufsknoepfe (wie "Join the Fam") haben
      // eine transparente backgroundColor und fielen sonst durch.
      return (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none'
        || parseFloat(cs.borderTopWidth) > 0) && e.getBoundingClientRect().height >= 30;
    }).slice(0, 4).map(e => {
      const cs = getComputedStyle(e);
      return `"${e.innerText.trim().slice(0, 30)}" ${px(cs.fontSize)}px ${cs.textTransform} r=${cs.borderRadius} bg=${cs.backgroundColor} h=${Math.round(e.getBoundingClientRect().height)}`;
    });

  // ── Kopfzeile ───────────────────────────────────────────────────────────
  const kopf = [...document.querySelectorAll('header, nav, [role=banner]')]
    .filter(e => sichtbar(e) && e.getBoundingClientRect().top < 5 && e.getBoundingClientRect().width > vw * 0.8)
    .sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0];

  // ── Woerter ─────────────────────────────────────────────────────────────
  const woerter = t => (t.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;
  const woerterErster = woerter(ersterSchirm.map(e =>
    [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(' ')).join(' '));

  const seite = document.documentElement.scrollHeight;
  // In window.__mess abgelegt: das Browser-Werkzeug kuerzt lange Ausgaben, die
  // Teile lassen sich so einzeln abholen.
  return window.__mess = {
    adresse: location.href, fenster: `${vw} x ${vh}`, sprache: document.documentElement.lang,
    seitenhoehe_bildschirme: Math.round(seite / vh * 10) / 10,
    erstes_bild_ab_px: ersteMedien[0] ? Math.round(ersteMedien[0].top) : null,
    erstes_bild_art: ersteMedien[0] ? ersteMedien[0].art : null,
    bildflaeche_erster_schirm: Math.round(treffer / punkte * 100) + ' %',
    bilder_gesamt: medien.length, hochformat, querformat,
    h1: h1 ? stil(h1) : 'keine h1',
    groesster_text_erster_schirm: groesster ? stil(groesster) : null,
    h2_groessen: [...new Set(h2)].slice(0, 6),
    ueberschriften_versal: `${versal} von ${ueber.length}`,
    fliesstext: fliessBsp ? { ...stil(fliessBsp), anteil_zeichen: fliessGroesse[1] } : null,
    textspalte_median_px: median(breiten) ? Math.round(median(breiten)) : null,
    zeichen_je_zeile_ca: zeichenJeZeile,
    schriften: schriftAnteile,
    hintergruende_nach_flaeche: hintergruende,
    kopfzeile_hoehe: kopf ? Math.round(kopf.getBoundingClientRect().height) : null,
    knoepfe,
    woerter_erster_schirm: woerterErster,
    woerter_gesamt: woerter(document.body.innerText),
  };
})();
