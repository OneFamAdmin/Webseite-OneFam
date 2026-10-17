// Transactional e-mail via Resend (https://resend.com). Dependency-free: just a
// POST to the Resend API. No-ops silently if RESEND_API_KEY isn't set yet, so
// sign-ups never break before e-mail is configured.

const FROM = process.env.EMAIL_FROM || 'OneFam <onboarding@resend.dev>';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://onefam.ch';

type WelcomeOpts = { to: string; name?: string | null; groupSize: number; year: number };

export async function sendWelcomeEmail(opts: WelcomeOpts): Promise<{ ok: boolean; skipped?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, skipped: true }; // not configured yet

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: opts.to,
      subject: 'Willkommen in der Fam',
      html: welcomeHtml(opts),
    }),
  });

  if (!res.ok) {
    console.error('[email] Resend error', res.status, await res.text().catch(() => ''));
    return { ok: false };
  }
  return { ok: true };
}

function welcomeHtml({ name, groupSize, year }: WelcomeOpts): string {
  const greeting = name ? `Hey ${escapeHtml(name)},` : 'Hey,';
  const groupLine =
    groupSize > 1
      ? `für dich und ${groupSize - 1} weitere (${groupSize} Personen)`
      : 'für dich';

  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
        <tr><td style="font-family:Arial,Helvetica,sans-serif;color:#C9A84C;font-size:14px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">OneFam</td></tr>
        <tr><td style="padding-top:24px;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:28px;font-weight:bold;line-height:1.2;">Du bist dabei.</td></tr>
        <tr><td style="padding-top:16px;font-family:Arial,Helvetica,sans-serif;color:#C8C8C0;font-size:16px;line-height:1.7;">
          ${greeting}<br><br>
          deine Teilnahme für <strong style="color:#ffffff;">${year}</strong> ist bestätigt – ${groupLine}. Schön, dass du Teil der Fam bist.
        </td></tr>
        <tr><td style="padding-top:24px;font-family:Arial,Helvetica,sans-serif;color:#C8C8C0;font-size:15px;line-height:1.7;">
          So läuft's:
          <ul style="margin:8px 0 0;padding-left:20px;color:#C8C8C0;">
            <li>Die Teilnahme ist und bleibt <strong style="color:#ffffff;">kostenlos</strong> – einmal im Jahr.</li>
            <li>Die Auswahl läuft über eine <strong style="color:#ffffff;">faire, öffentlich nachprüfbare Ziehung</strong>.</li>
            <li>Der Reise-Pool finanziert die gemeinsamen Erlebnisse – du musst nichts tun.</li>
            <li>Wirst du gezogen, melden wir uns bei dir.</li>
          </ul>
        </td></tr>
        <tr><td style="padding-top:28px;">
          <a href="${SITE}" style="display:inline-block;background:#C9A84C;color:#0A0A0A;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;padding:13px 26px;border-radius:4px;">Zur Community</a>
        </td></tr>
        <tr><td style="padding-top:36px;border-top:1px solid #2A2A2A;margin-top:36px;"></td></tr>
        <tr><td style="padding-top:16px;font-family:Arial,Helvetica,sans-serif;color:#6B6B6B;font-size:12px;line-height:1.6;">
          OneFam — For good souls worldwide.<br>
          Du erhältst diese E-Mail, weil du dich bei OneFam angemeldet hast.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ── Warteliste: Bestätigungsmail (doppelte Bestätigung, 18.10.2026) ─────────
//
// Anders als sendWelcomeEmail meldet diese Funktion ein fehlendes RESEND_API_KEY
// als Fehler: Ohne Mail kann niemand bestätigen, und der Besucher soll das
// erfahren, statt auf eine Mail zu warten, die nie kommt.
//
// Die Texte kommen fertig übersetzt aus messages/<sprache>.json ("waitlist_mail"),
// damit die Mail dieselbe Sprache spricht wie die Seite, auf der man sich
// eingetragen hat.

export type BestaetigungsTexte = {
  betreff: string;
  titel: string;
  gruss: string;
  text: string;
  knopf: string;
  gueltig: string;
  nicht_du: string;
  abmelden: string;
  fuss: string;
};

type BestaetigungOpts = {
  to: string;
  lang: string;
  texte: BestaetigungsTexte;
  link: string;
  abmeldeLink: string;
  absender: string;
};

export async function sendWaitlistConfirmEmail(opts: BestaetigungOpts): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[email] RESEND_API_KEY fehlt — Bestaetigungsmail nicht verschickt');
    return { ok: false };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: opts.to,
      subject: opts.texte.betreff,
      html: bestaetigungHtml(opts),
      text: bestaetigungText(opts),
    }),
  });

  if (!res.ok) {
    console.error('[email] Resend error', res.status, await res.text().catch(() => ''));
    return { ok: false };
  }
  return { ok: true };
}

function bestaetigungText({ texte, link, abmeldeLink, absender }: BestaetigungOpts): string {
  return [
    texte.gruss,
    '',
    texte.text,
    '',
    `${texte.knopf}: ${link}`,
    '',
    texte.gueltig,
    texte.nicht_du,
    '',
    `${texte.abmelden}: ${abmeldeLink}`,
    '',
    texte.fuss,
    absender,
  ].join('\n');
}

function bestaetigungHtml({ lang, texte, link, abmeldeLink, absender }: BestaetigungOpts): string {
  const p = 'font-family:Arial,Helvetica,sans-serif;';
  return `<!doctype html>
<html lang="${escapeHtml(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
        <tr><td style="${p}color:#C9A84C;font-size:14px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">OneFam</td></tr>
        <tr><td style="padding-top:24px;${p}color:#ffffff;font-size:28px;font-weight:bold;line-height:1.2;">${escapeHtml(texte.titel)}</td></tr>
        <tr><td style="padding-top:16px;${p}color:#C8C8C0;font-size:16px;line-height:1.7;">
          ${escapeHtml(texte.gruss)}<br><br>${escapeHtml(texte.text)}
        </td></tr>
        <tr><td style="padding-top:28px;">
          <a href="${escapeHtml(link)}" style="display:inline-block;background:#C9A84C;color:#0A0A0A;${p}font-size:15px;font-weight:bold;text-decoration:none;padding:13px 26px;border-radius:4px;">${escapeHtml(texte.knopf)}</a>
        </td></tr>
        <tr><td style="padding-top:24px;${p}color:#8A8A82;font-size:13px;line-height:1.7;">
          ${escapeHtml(texte.gueltig)}<br>${escapeHtml(texte.nicht_du)}
        </td></tr>
        <tr><td style="padding-top:28px;border-top:1px solid #2A2A2A;"></td></tr>
        <tr><td style="padding-top:16px;${p}color:#6B6B6B;font-size:12px;line-height:1.6;">
          ${escapeHtml(texte.fuss)}<br>${escapeHtml(absender)}<br>
          <a href="${escapeHtml(abmeldeLink)}" style="color:#8A8A82;">${escapeHtml(texte.abmelden)}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
