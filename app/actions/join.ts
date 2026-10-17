'use server';

import { randomBytes } from 'node:crypto';
import { getTranslations } from 'next-intl/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendWaitlistConfirmEmail, type BestaetigungsTexte } from '@/lib/email/send';
import { FIRMA } from '@/lib/schema';
import { GUELTIG_TAGE, SPERRE_MINUTEN, TOKEN_MAX, joinUnterLink, joinUnterpfad } from '@/lib/warteliste';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/routing';
import { redirect } from 'next/navigation';

export type WaitlistState = { status: 'idle' | 'ok' | 'error'; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const token = () => randomBytes(24).toString('base64url');

/**
 * Warteliste mit doppelter Bestätigung (seit 18.10.2026).
 *
 * Bis dahin stand jede Adresse sofort auf der Liste — auch fremde. Jetzt:
 * Eintrag mit status 'pending' und Bestätigungsmail; erst der Klick auf den Link
 * (app/[locale]/join/bestaetigt) macht daraus 'confirmed'. Angeschrieben werden
 * darf später nur 'confirmed'.
 *
 * Geschrieben wird mit dem Service-Schlüssel: die Action setzt Tokens und Status,
 * das darf die öffentliche REST-Schnittstelle nicht (Policy in Migration 0017
 * entfernt).
 *
 * Der Besucher bekommt in jedem Fall dieselbe Antwort ("schau in dein
 * Postfach") — auch wenn die Adresse schon bestätigt ist. Die Liste verrät nie,
 * wer schon drin ist. Nur ein Versandfehler wird gemeldet, sonst wartet jemand
 * auf eine Mail, die nie kommt.
 */
export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const name = String(formData.get('name') ?? '').trim().slice(0, 40);
  const sprache = String(formData.get('sprache') ?? '');
  const locale: Locale = isLocale(sprache) ? sprache : DEFAULT_LOCALE;

  const t = await getTranslations({ locale, namespace: 'waitlist' });

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { status: 'error', message: t('fehler_adresse') };
  }

  try {
    const db = createAdminClient();

    // Aufräumen: unbestätigte Einträge, deren Link abgelaufen ist. Läuft bei jeder
    // Eintragung mit, statt als geplanter Auftrag — dieselbe Lösung wie im Shop.
    // Zeilen ohne token_sent_at stammen aus der Zeit zwischen Migration 0017 und
    // dem Deploy dieses Codes (altes Formular, keine Mail) — für sie zählt created_at.
    const grenze = new Date(Date.now() - GUELTIG_TAGE * 86_400_000).toISOString();
    await db
      .from('waitlist')
      .delete()
      .eq('status', 'pending')
      .or(`token_sent_at.lt.${grenze},and(token_sent_at.is.null,created_at.lt.${grenze})`);

    const { data: vorhanden, error: lesefehler } = await db
      .from('waitlist')
      .select('id, status, token_sent_at, unsub_token')
      .eq('email', email)
      .maybeSingle();
    if (lesefehler) throw lesefehler;

    if (vorhanden?.status === 'confirmed') {
      return { status: 'ok', message: email };
    }

    const zuletzt = vorhanden?.token_sent_at ? new Date(vorhanden.token_sent_at).getTime() : 0;
    if (vorhanden && Date.now() - zuletzt < SPERRE_MINUTEN * 60_000) {
      // Schon vor wenigen Minuten verschickt — nicht noch einmal, sonst taugt das
      // Formular dazu, fremde Postfächer zuzuschütten.
      return { status: 'ok', message: email };
    }

    const bestaetigung = token();
    const abmeldung = vorhanden?.unsub_token || token();
    const zeile = {
      email,
      name: name || null,
      source: 'site',
      status: 'pending',
      lang: locale,
      confirm_token: bestaetigung,
      token_sent_at: new Date().toISOString(),
      unsub_token: abmeldung,
    };

    const { error: schreibfehler } = vorhanden
      ? await db.from('waitlist').update(zeile).eq('id', vorhanden.id)
      : await db.from('waitlist').insert(zeile);
    if (schreibfehler) throw schreibfehler;

    const m = await getTranslations({ locale, namespace: 'waitlist_mail' });
    const texte: BestaetigungsTexte = {
      betreff: m('betreff'),
      titel: m('titel'),
      gruss: name ? m('gruss_name', { name }) : m('gruss'),
      text: m('text'),
      knopf: m('knopf'),
      gueltig: m('gueltig', { tage: GUELTIG_TAGE }),
      nicht_du: m('nicht_du'),
      abmelden: m('abmelden'),
      fuss: m('fuss'),
    };

    const versand = await sendWaitlistConfirmEmail({
      to: email,
      lang: locale,
      texte,
      link: joinUnterLink(locale, 'bestaetigt', bestaetigung),
      abmeldeLink: joinUnterLink(locale, 'abmelden', abmeldung),
      absender: `${FIRMA.rechtsform} · ${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort} · ${FIRMA.email}`,
    });

    if (!versand.ok) {
      // Ohne Mail kann niemand bestätigen. Eine neue Zeile fliegt wieder raus; bei
      // einer vorhandenen wird der Zeitstempel vor die 10-Minuten-Sperre gelegt,
      // damit ein zweiter Versuch sofort geht. (Nicht auf null setzen: dann fände
      // das Aufräumen oben die Zeile nie mehr.)
      if (vorhanden) {
        const frei = new Date(Date.now() - (SPERRE_MINUTEN + 1) * 60_000).toISOString();
        await db.from('waitlist').update({ token_sent_at: frei }).eq('id', vorhanden.id);
      } else {
        await db.from('waitlist').delete().eq('email', email).eq('status', 'pending');
      }
      return { status: 'error', message: t('fehler_versand') };
    }
  } catch (e) {
    console.error('[waitlist] Eintragen fehlgeschlagen', e);
    return { status: 'error', message: t('fehler_allgemein') };
  }

  return { status: 'ok', message: email };
}

/**
 * Abmelden (seit 18.10.2026). Löscht die Zeile vollständig — die
 * Datenschutzerklärung verspricht "danach löschen wir deinen Eintrag".
 *
 * Bewusst ein Knopf auf der Seite statt Löschen beim Aufruf des Links:
 * Virenscanner mancher Mailanbieter rufen Links in Mails vorab auf. Löschte schon
 * der Aufruf, wären Leute abgemeldet, ohne je geklickt zu haben.
 */
export async function abmelden(formData: FormData): Promise<void> {
  const t = String(formData.get('t') ?? '');
  const sprache = String(formData.get('sprache') ?? '');
  const locale: Locale = isLocale(sprache) ? sprache : DEFAULT_LOCALE;

  if (t && t.length <= TOKEN_MAX) {
    const { error } = await createAdminClient().from('waitlist').delete().eq('unsub_token', t);
    if (error) console.error('[waitlist] Abmelden fehlgeschlagen', error);
  }
  redirect(`${joinUnterpfad(locale, 'abmelden')}?fertig=1`);
}
