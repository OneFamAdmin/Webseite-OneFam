// Ladezeit wie auf einem Handy messen — ohne PageSpeed-Dienst (19.11.2026).
//
//   node tools/ladezeit-messen.mjs https://onefam.ch/de https://shop.onefam.ch/de/
//
// Wozu: Googles PageSpeed-Schnittstelle war am 19.11.2026 den ganzen Tag über ihrem
// Tageslimit. Dieses Skript misst dasselbe Grundbild selbst: Google Chrome ohne Fenster,
// Handy-Ansicht (412 x 823, Android-Kennung), Netz gedrosselt wie Lighthouse "Mobil"
// (150 ms Umlaufzeit, 1,6 Mbit/s), Prozessor 4-fach gebremst, ohne Zwischenspeicher.
//
// Ergebnis je Adresse: erste Anzeige (FCP), groesster Inhalt (LCP) samt Element,
// Ladeende, Anzahl Anfragen, uebertragene Menge und die zehn schwersten Dateien.
//
// Die Zahlen sind NICHT eins zu eins mit dem PageSpeed-Wert vergleichbar: Lighthouse
// rechnet die Drosselung aus, hier wird echt gedrosselt — das ergibt eher etwas
// langsamere Werte. Fuer Vorher/Nachher auf derselben Maschine taugen sie genau.
// Es liest nur; Cookie-Banner und Formulare werden nicht angefasst.

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

async function verbinden() {
  for (let i = 0; i < 50; i++) {
    try {
      const liste = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const seite = liste.find((t) => t.type === 'page');
      if (seite) return seite.webSocketDebuggerUrl;
    } catch {}
    await warte(200);
  }
  throw new Error('Chrome antwortet nicht');
}

function cdp(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const offen = new Map();
  const hoerer = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && offen.has(m.id)) { offen.get(m.id)(m); offen.delete(m.id); }
    else if (m.method) hoerer.forEach((h) => h(m));
  };
  return new Promise((ok) => {
    ws.onopen = () =>
      ok({
        send: (method, params = {}) =>
          new Promise((r) => { const i = ++id; offen.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); }),
        on: (h) => hoerer.push(h),
        close: () => ws.close(),
      });
  });
}

async function messen(c, adresse) {
  const dateien = new Map();
  c.on((m) => {
    if (m.method === 'Network.responseReceived') {
      const r = m.params.response;
      dateien.set(m.params.requestId, { url: r.url, typ: r.mimeType, bytes: 0 });
    }
    if (m.method === 'Network.dataReceived') {
      const d = dateien.get(m.params.requestId);
      if (d) d.bytes += m.params.encodedDataLength || 0;
    }
    if (m.method === 'Network.loadingFinished') {
      const d = dateien.get(m.params.requestId);
      if (d && m.params.encodedDataLength > d.bytes) d.bytes = m.params.encodedDataLength;
    }
  });

  await c.send('Page.navigate', { url: 'about:blank' });
  await warte(300);
  dateien.clear();
  await c.send('Page.navigate', { url: adresse });
  await warte(25000); // Drosselung: lieber zu lange warten als LCP zu frueh lesen

  const r = await c.send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      const l = window.__lcp || {};
      return { ttfb: Math.round(nav.responseStart || 0), fcp: fcp ? Math.round(fcp.startTime) : null,
               lcp: l.zeit ? Math.round(l.zeit) : null, lcpElement: l.element || null,
               load: Math.round(nav.loadEventEnd || 0), cls: Math.round((window.__cls || 0) * 1000) / 1000 };
    })()`,
  });
  const w = r.result?.result?.value || {};
  const liste = [...dateien.values()];
  const summe = liste.reduce((s, d) => s + d.bytes, 0);
  return { adresse, ...w, anfragen: liste.length, kb: Math.round(summe / 1024),
    schwerste: liste.sort((a, b) => b.bytes - a.bytes).slice(0, 10)
      .map((d) => `${Math.round(d.bytes / 1024)} KB  ${d.typ}  ${d.url.slice(0, 110)}`) };
}

const adressen = process.argv.slice(2);
if (!adressen.length) { console.error('Adressen angeben'); process.exit(1); }

const profil = mkdtempSync(join(tmpdir(), 'ladezeit-'));
// Ueber `arch -arm64`: das Node unter ~/.local/node ist eine Intel-Fassung und laeuft
// unter Rosetta. Ein daraus gestartetes Chrome erbt das und stuerzt als x64-Fassung ab
// ("Trying to load the allocator multiple times") — so geschehen beim ersten Lauf.
const chrome = spawn('arch', ['-arm64', CHROME, '--headless=new', `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profil}`, '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });

try {
  const c = await cdp(await verbinden());
  await c.send('Network.enable');
  await c.send('Network.setCacheDisabled', { cacheDisabled: true });
  await c.send('Network.emulateNetworkConditions', { offline: false, latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await c.send('Emulation.setDeviceMetricsOverride', { width: 412, height: 823, deviceScaleFactor: 1.75, mobile: true });
  await c.send('Emulation.setUserAgentOverride', { userAgent:
    'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36' });
  await c.send('Page.enable');
  await c.send('Page.addScriptToEvaluateOnNewDocument', { source: `
    new PerformanceObserver((l) => { for (const e of l.getEntries()) {
      const el = e.element; window.__lcp = { zeit: e.startTime,
        element: el ? (el.tagName + ' ' + (el.currentSrc || el.src || el.getAttribute('poster') || (el.textContent || '').trim().slice(0, 60))) : (e.url || '') };
    } }).observe({ type: 'largest-contentful-paint', buffered: true });
    window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
      .observe({ type: 'layout-shift', buffered: true });` });

  for (const a of adressen) {
    const e = await messen(c, a);
    console.log(`\n== ${e.adresse}`);
    console.log(`   Server-Antwort ${e.ttfb} ms | erste Anzeige ${e.fcp} ms | groesster Inhalt ${e.lcp} ms | Ladeende ${e.load} ms | Verschiebung ${e.cls}`);
    console.log(`   LCP-Element: ${e.lcpElement}`);
    console.log(`   ${e.anfragen} Anfragen, ${e.kb} KB uebertragen. Schwerste:`);
    e.schwerste.forEach((s) => console.log('     ' + s));
  }
  c.close();
} finally {
  chrome.kill();
  rmSync(profil, { recursive: true, force: true });
}
