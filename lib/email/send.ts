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

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
