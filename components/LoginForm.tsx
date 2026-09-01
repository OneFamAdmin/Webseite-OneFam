'use client';

import React from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';
import Button from './Button';
import { createClient } from '@/lib/supabase/client';

type State = 'idle' | 'submitting' | 'sent';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Reiner Magic-Link-Login für bestehende Mitglieder (Käufer-Bereich, Voting, Admin).
 *  Bewusst OHNE Gruppengrösse / Teilnahme: der Login legt keine Auslosungs-Teilnahme
 *  an. Die Teilnahme-Mechanik ist bis zur rechtlichen Prüfung geparkt (siehe
 *  docs/handover-shop-pool.md §3). */
export default function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [state, setState] = React.useState<State>('idle');
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError('Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }
    setError(null);
    setState('submitting');
    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (otpError) {
      setError('Hoppla – das hat nicht geklappt. Versuch es gleich nochmal.');
      setState('idle');
      return;
    }
    setState('sent');
  };

  if (state === 'sent') {
    return (
      <div className="rounded-[10px] border border-line bg-surface p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/40">
          <Check size={24} strokeWidth={2} className="text-gold" />
        </div>
        <p className="mt-4 font-display text-xl font-semibold text-primary">Link unterwegs.</p>
        <p className="mt-2 font-body text-sm leading-relaxed text-secondary">
          Wir haben dir einen Anmelde-Link an <span className="text-primary">{email}</span> geschickt. Öffne ihn – und du
          bist drin.
        </p>
        <button
          type="button"
          onClick={() => {
            setState('idle');
            setEmail('');
          }}
          className="mt-5 font-body text-sm text-gold underline-offset-4 transition-colors duration-[180ms] hover:text-gold-hover hover:underline"
        >
          Andere E-Mail verwenden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <label htmlFor="login-email" className="sr-only">
        E-Mail-Adresse
      </label>
      <div className="relative">
        <Mail
          size={18}
          strokeWidth={1.6}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
        />
        <input
          id="login-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="deine@email.ch"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          disabled={state === 'submitting'}
          className="w-full rounded-[4px] border border-line bg-surface py-3.5 pl-11 pr-4 font-body text-base text-primary outline-none transition-colors duration-[180ms] placeholder:text-faint focus:border-gold/60 disabled:opacity-60"
        />
      </div>
      {error && <p className="font-body text-sm text-red-400">{error}</p>}
      <Button
        type="submit"
        variant="primary"
        disabled={state === 'submitting'}
        className="w-full disabled:cursor-default disabled:opacity-60 disabled:hover:scale-100"
      >
        {state === 'submitting' ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sende Link …
          </>
        ) : (
          'Anmelde-Link senden'
        )}
      </Button>
    </form>
  );
}
