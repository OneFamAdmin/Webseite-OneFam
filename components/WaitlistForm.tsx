'use client';

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Mail, Check, Loader2, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Button from './Button';
import { joinWaitlist, type WaitlistState } from '@/app/actions/join';

const INITIAL: WaitlistState = { status: 'idle', message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations('waitlist');
  return (
    <Button
      type="submit"
      variant="primary"
      disabled={pending}
      className="w-full disabled:cursor-default disabled:opacity-60 disabled:hover:scale-100"
    >
      {pending ? (
        <>
          <Loader2 size={18} className="animate-spin" /> {t('sendet')}
        </>
      ) : (
        t('senden')
      )}
    </Button>
  );
}

/** Warteliste — bewusst ein reines E-Mail-Signup: kein Konto, keine Teilnahme,
 *  kein Gewinnversprechen. Der Draw-Funnel (JoinForm) ist bis zur rechtlichen
 *  Prüfung geparkt, siehe docs/handover-shopify-pool.md §3. */
export default function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [state, formAction] = useActionState(joinWaitlist, INITIAL);
  const t = useTranslations('waitlist');

  if (state.status === 'ok') {
    return (
      <div className="rounded-[10px] border border-line bg-surface p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/40">
          <Check size={24} strokeWidth={2} className="text-gold" />
        </div>
        <p className="mt-4 font-display text-xl font-semibold text-primary">{t('ok_titel')}</p>
        <p className="mt-2 font-body text-sm leading-relaxed text-secondary">
          {t('ok_vor')} <span className="text-primary">{state.message}</span>
          {t('ok_nach')}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-4">
      {!compact && (
        <div>
          <label htmlFor="wl-name" className="mb-2 block font-body text-sm text-secondary">
            {t('name_label')} <span className="text-faint">{t('name_optional')}</span>
          </label>
          <div className="relative">
            <User
              size={18}
              strokeWidth={1.6}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
            />
            <input
              id="wl-name"
              name="name"
              type="text"
              maxLength={40}
              placeholder={t('name_platzhalter')}
              className="w-full rounded-[4px] border border-line bg-surface py-3.5 pl-11 pr-4 font-body text-base text-primary outline-none transition-colors duration-[180ms] placeholder:text-faint focus:border-gold/60"
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <label htmlFor="wl-email" className="sr-only">
          {t('email_label')}
        </label>
        <div className="relative">
          <Mail
            size={18}
            strokeWidth={1.6}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
          />
          <input
            id="wl-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={t('email_platzhalter')}
            className="w-full rounded-[4px] border border-line bg-surface py-3.5 pl-11 pr-4 font-body text-base text-primary outline-none transition-colors duration-[180ms] placeholder:text-faint focus:border-gold/60"
          />
        </div>
        {state.status === 'error' && <p className="font-body text-sm text-red-400">{state.message}</p>}
        <SubmitButton />
        <p className="text-center font-body text-xs text-faint">{t('hinweis')}</p>
      </div>
    </form>
  );
}
