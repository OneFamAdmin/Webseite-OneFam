#!/usr/bin/env node
// Probe der Kasse von onefam.ch: vom Produkt bis INS ZAHLUNGSFENSTER von zahls.ch, dort Abbruch.
// Bezahlt wird nichts.
//
// ⚠️ JEDER LAUF LEGT IM SHOP EINE ECHTE, UNBEZAHLTE BESTELLUNG AN ("Zahlung ausstehend").
// Danach im wp-admin auf "Storniert" setzen. Besteller ist der Testname unten mit der
// Firmenadresse aus dem Impressum und info@onefam.ch — nie fremde Adressen eintragen.
//
// Wozu (22.11.2026): Die Währung folgt der ZEITZONE des Geräts (lib/shop/waehrung.ts). Am
// Schweizer Mac sieht man immer CHF; für Euro müsste man die Systemzeit umstellen. Dieses
// Skript startet stattdessen ein eigenes, unsichtbares Chrome mit vorgegebener Zeitzone und
// klickt den Weg durch. Es braucht nichts ausser Node 22 und Google Chrome.
//
// Aufruf:
//   node tools/kasse-probe.mjs --basis http://localhost:3001 --sprache de \
//        --zeitzone Europe/Berlin --land DE --plz 79098 --ort Freiburg --strasse "Teststrasse 1" \
//        --bilder /pfad/zu/ordner
//
//   --basis     Seite, die geprüft wird (lokaler Bau oder https://onefam.ch)
//   --sprache   de | en | fr | es   (en hat kein Präfix)
//   --zeitzone  z. B. Europe/Zurich (CHF), Europe/Berlin oder Europe/Paris (EUR)
//   --land      Lieferland als Kürzel (CH, DE, FR …)
//   --slug      Produkt, Vorgabe albania-hoodie      --groesse  Vorgabe M
//
// Ausgabe: eine JSON-Zeile mit allem Gemessenen; Bildschirmfotos im Ordner --bilder.
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const arg = (name, vorgabe) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : vorgabe;
};
const BASIS = arg('basis', 'http://localhost:3001').replace(/\/$/, '');
const SPRACHE = arg('sprache', 'de');
const ZEITZONE = arg('zeitzone', 'Europe/Zurich');
const LAND = arg('land', 'CH');
const SLUG = arg('slug', 'albania-hoodie');
const GROESSE = arg('groesse', 'M');
const BILDER = arg('bilder', null);
const BESTELLER = {
  email: 'info@onefam.ch',
  vorname: 'Test',
  nachname: `Testkauf ${SPRACHE.toUpperCase()} ${LAND} ${ZEITZONE.split('/')[1]}`,
  strasse: arg('strasse', 'Riehenstrasse 236'),
  plz: arg('plz', '4058'),
  ort: arg('ort', 'Basel'),
};
const PFAD = SPRACHE === 'en' ? '' : `/${SPRACHE}`;
const PORT = 9300 + Math.floor(Math.random() * 400);
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

const profil = mkdtempSync(join(tmpdir(), 'kasse-probe-'));
const chrome = spawn(
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profil}`,
    '--window-size=1440,1000',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ],
  { stdio: 'ignore' },
);

let ws;
let laufendeNummer = 0;
const offen = new Map();
const sende = (methode, parameter = {}) =>
  new Promise((ja, nein) => {
    const id = ++laufendeNummer;
    offen.set(id, { ja, nein });
    ws.send(JSON.stringify({ id, method: methode, params: parameter }));
  });
const rechne = async (ausdruck) => {
  const a = await sende('Runtime.evaluate', { expression: `(async()=>{${ausdruck}})()`, awaitPromise: true, returnByValue: true });
  if (a.exceptionDetails) throw new Error(a.exceptionDetails.exception?.description || a.exceptionDetails.text);
  return a.result.value;
};
const gehe = async (adresse, pause = 3500) => {
  await sende('Page.navigate', { url: adresse });
  await warte(pause);
};
const bisWahr = async (ausdruck, hoechstens = 25000) => {
  const ende = Date.now() + hoechstens;
  while (Date.now() < ende) {
    try {
      if (await rechne(`return !!(${ausdruck});`)) return true;
    } catch {
      /* Seite lädt gerade */
    }
    await warte(400);
  }
  return false;
};
let bildNummer = 0;
const foto = async (name) => {
  if (!BILDER) return;
  mkdirSync(BILDER, { recursive: true });
  const a = await sende('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
  writeFileSync(join(BILDER, `${SPRACHE}-${LAND}-${++bildNummer}-${name}.jpg`), Buffer.from(a.data, 'base64'));
};

const ergebnis = { basis: BASIS, sprache: SPRACHE, zeitzone: ZEITZONE, lieferland: LAND };
try {
  // Auf Chrome warten, dann die eine Seite ansprechen
  let ziel;
  for (let i = 0; i < 50 && !ziel; i++) {
    await warte(200);
    try {
      const liste = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      ziel = liste.find((z) => z.type === 'page');
    } catch {
      /* noch nicht bereit */
    }
  }
  if (!ziel) throw new Error('Chrome antwortet nicht');
  ws = new WebSocket(ziel.webSocketDebuggerUrl);
  await new Promise((ja, nein) => {
    ws.onopen = ja;
    ws.onerror = nein;
  });
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && offen.has(m.id)) {
      const { ja, nein } = offen.get(m.id);
      offen.delete(m.id);
      m.error ? nein(new Error(m.error.message)) : ja(m.result);
    }
  };
  await sende('Page.enable');
  await sende('Runtime.enable');
  await sende('Emulation.setTimezoneOverride', { timezoneId: ZEITZONE });
  await sende('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  const sprachKopf = { de: 'de-DE,de;q=0.9', fr: 'fr-FR,fr;q=0.9', es: 'es-ES,es;q=0.9', en: 'en-GB,en;q=0.9' }[SPRACHE];
  const ua = (await sende('Browser.getVersion')).userAgent.replace('HeadlessChrome', 'Chrome');
  await sende('Emulation.setUserAgentOverride', { userAgent: ua, acceptLanguage: sprachKopf });

  // 1. Produktseite: Preis lesen, Grösse wählen, in den Warenkorb
  await gehe(`${BASIS}${PFAD}/produkt/${SLUG}`);
  await bisWahr(`[...document.querySelectorAll('main button')].some(b=>b.innerText.trim()==='${GROESSE}')`);
  await warte(1200);
  ergebnis.produkt = await rechne(`
    const preis=[...document.querySelectorAll('main [aria-live]')].map(e=>e.innerText.replace(/\\s+/g,' ').trim()).filter(Boolean)[0];
    return { zeitzoneImBrowser: Intl.DateTimeFormat().resolvedOptions().timeZone, cookie: (document.cookie.match(/of_geo=\\w+/)||[''])[0], titel: document.querySelector('h1')?.innerText, preisZeile: preis };`);
  await foto('produkt');
  await rechne(`
    const kn=[...document.querySelectorAll('main button')];
    kn.find(b=>b.innerText.trim()==='${GROESSE}').click();
    await new Promise(r=>setTimeout(r,400));
    // Der Kaufknopf trägt den Markenverlauf als Stil — unabhängig von der Sprache.
    const kauf=kn.filter(b=>b.offsetParent && /gradient/.test(b.getAttribute('style')||''))[0];
    kauf.click();
    await new Promise(r=>setTimeout(r,4500));`);

  // 2. Warenkorb: Lieferland setzen, Summen lesen
  await gehe(`${BASIS}${PFAD}/warenkorb`, 4500);
  await bisWahr(`[...document.querySelectorAll('main select')].some(s=>[...s.options].some(o=>o.value==='${LAND}'))`);
  ergebnis.warenkorb = await rechne(`
    const sel=[...document.querySelectorAll('main select')].find(s=>[...s.options].some(o=>o.value==='${LAND}'));
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(sel,'${LAND}');
    sel.dispatchEvent(new Event('change',{bubbles:true}));
    await new Promise(r=>setTimeout(r,5000));
    const dl=[...document.querySelectorAll('main dl div')].map(d=>d.innerText.replace(/\\s+/g,' ').trim());
    const pos=document.querySelector('main ul li')?.innerText.replace(/\\s+/g,' ').replace(/ 1 2 3 4 5 6 7 8 9 10/,'').slice(0,90);
    return { position: pos, summen: dl, land: sel.value };`);
  await foto('warenkorb');

  // 3. Kasse: ausfüllen, Übersicht und Rechtssätze lesen
  await gehe(`${BASIS}${PFAD}/kasse`, 4500);
  await bisWahr(`document.querySelector('main input[autocomplete="email"]')`);
  await warte(1500);
  ergebnis.kasse = await rechne(`
    const setze=(e,w)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,w); e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true}));};
    const q=(a)=>document.querySelector('main input[autocomplete="'+a+'"]');
    setze(q('email'),${JSON.stringify(BESTELLER.email)});
    setze(q('shipping given-name'),${JSON.stringify(BESTELLER.vorname)});
    setze(q('shipping family-name'),${JSON.stringify(BESTELLER.nachname)});
    setze(q('shipping address-line1'),${JSON.stringify(BESTELLER.strasse)});
    setze(q('shipping postal-code'),${JSON.stringify(BESTELLER.plz)});
    setze(q('shipping address-level2'),${JSON.stringify(BESTELLER.ort)});
    await new Promise(r=>setTimeout(r,900));
    const a=document.querySelector('main aside');
    const kn=document.querySelector('main button[type=submit]');
    const saetze=[...a.querySelectorAll('p')].map(p=>p.innerText.replace(/\\s+/g,' ').trim()).filter(Boolean);
    return { landFeld: document.querySelector('main select[autocomplete="shipping country"]')?.value,
             felder: [...document.querySelectorAll('main label')].map(l=>l.innerText.split('\\n')[0].trim()).slice(0,12),
             summen: [...a.querySelectorAll('dl div')].map(d=>d.innerText.replace(/\\s+/g,' ').trim()),
             saetze, knopf: kn.innerText.trim(), knopfGesperrt: kn.disabled };`);
  await rechne(`document.querySelector('main button[type=submit]').scrollIntoView({block:'center'});`);
  await warte(400);
  await foto('kasse');

  // 4. Bestellen → Zahlungsfenster
  await rechne(`document.querySelector('main button[type=submit]').click();`);
  const beiZahls = await bisWahr(`location.host.includes('zahls')`, 30000);
  await warte(3500);
  if (!beiZahls) {
    ergebnis.zahlungsfenster = { fehler: 'kein Zahlungsfenster', adresse: await rechne(`return location.href.split('?')[0];`), text: await rechne(`return (document.querySelector('main')||document.body).innerText.replace(/\\s+/g,' ').slice(0,400);`) };
    await foto('kein-zahlungsfenster');
  } else {
    ergebnis.zahlungsfenster = await rechne(`
      const betrag=[...document.querySelectorAll('input')].map(i=>i.value).filter(Boolean);
      return { host: location.host, pfad: location.pathname, text: document.body.innerText.replace(/\\s+/g,' ').slice(0,200), felder: betrag.slice(0,4) };`);
    await foto('zahlungsfenster');

    // 5. Abbrechen: das Kreuz oben links im Fenster (echter Mausklick an seiner Stelle)
    const kreuz = await rechne(`
      const k=[...document.querySelectorAll('a,button,[role=button],svg,i,span')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>8&&r.width<70&&r.height>8&&r.height<70&&r.top<200;})
        .map(e=>({e, r:e.getBoundingClientRect()})).sort((a,b)=>(a.r.left+a.r.top)-(b.r.left+b.r.top))[0];
      return k ? { x: Math.round(k.r.left+k.r.width/2), y: Math.round(k.r.top+k.r.height/2), was: k.e.tagName+'.'+String(k.e.className).slice(0,40) } : null;`);
    ergebnis.kreuz = kreuz;
    if (kreuz) {
      for (const typ of ['mousePressed', 'mouseReleased']) {
        await sende('Input.dispatchMouseEvent', { type: typ, x: kreuz.x, y: kreuz.y, button: 'left', clickCount: 1 });
      }
    }
    const zurueck = await bisWahr(`location.origin===${JSON.stringify(new URL(BASIS).origin)}`, 25000);
    // Der Warenkorb lädt nach der Rückkehr erst: warten, bis Summen oder der Satz "leer" dastehen.
    // (Beim ersten Lauf nach 4,5 s gelesen — die Seite war noch leer, das Ergebnis sagte "nichts im Korb".)
    await bisWahr(`document.querySelector('main dl') || document.querySelector('main a[style*="gradient"]')`, 25000);
    await warte(800);
    ergebnis.rueckkehr = zurueck
      ? await rechne(`
          const u=new URL(location.href);
          const hinweis=[...document.querySelectorAll('main [role=status]')].map(e=>e.innerText.trim())[0];
          return { pfad: u.pathname, zahlsFehler: u.searchParams.get('zahls_error'), bestellung: u.searchParams.get('order_id'), hinweis,
                   nochImKorb: !!document.querySelector('main ul li'), summen: [...document.querySelectorAll('main dl div')].map(d=>d.innerText.replace(/\\s+/g,' ').trim()) };`)
      : { fehler: 'nicht zurückgekommen', adresse: await rechne(`return location.host+location.pathname;`) };
    await foto('rueckkehr');
  }
} catch (fehler) {
  ergebnis.abbruch = String(fehler.message || fehler);
} finally {
  console.log(JSON.stringify(ergebnis));
  try {
    ws?.close();
  } catch {
    /* schon zu */
  }
  chrome.kill();
  await warte(400);
  rmSync(profil, { recursive: true, force: true });
}
