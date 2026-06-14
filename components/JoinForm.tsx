'use client';

import React from 'react';
import { Mail, Check, Loader2, User } from 'lucide-react';
import Button from './Button';
import { createClient } from '@/lib/supabase/client';

type State = 'idle' | 'submitting' | 'sent';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GROUP_OPTIONS = [1, 2, 3, 4, 5];

export default function JoinForm() {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [groupSize, setGroupSize] = React.useState(1);
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
      options: {
        // carry the chosen group size + display name through the magic-link round-trip
        emailRedirectTo: `${window.location.origin}/auth/callback?g=${groupSize}${
          name.trim() ? `&n=${encodeURIComponent(name.trim())}` : ''
        }`,
      },
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
        <p className="mt-4 font-display text-xl font-semibold text-primary">Fast geschafft.</p>
        <p className="mt-2 font-body text-sm leading-relaxed text-secondary">
          Wir haben dir einen Bestätigungs-Link an <span className="text-primary">{email}</span> geschickt. Öffne ihn –
          und du bist dabei{groupSize > 1 ? `, für dich und ${groupSize - 1} weitere (${groupSize} Personen)` : ''}.
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
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* display name — how you appear in the public draw (optional, for everyone) */}
      <div>
        <label htmlFor="join-name" className="mb-2 block font-body text-sm text-secondary">
          Dein Name in der Ziehung <span className="text-faint">(optional)</span>
        </label>
        <div className="relative">
          <User
            size={18}
            strokeWidth={1.6}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
          />
          <input
            id="join-name"
            type="text"
            maxLength={30}
            placeholder="z. B. Maria aus Basel"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={state === 'submitting'}
            className="w-full rounded-[4px] border border-line bg-surface py-3.5 pl-11 pr-4 font-body text-base text-primary outline-none transition-colors duration-[180ms] placeholder:text-faint focus:border-gold/60 disabled:opacity-60"
          />
        </div>
        <p className="mt-1.5 font-body text-xs text-faint">
          So erscheinst du öffentlich im Archiv, wenn du gewinnst. Leer lassen = anonym (nur eine ID).
        </p>
      </div>

      {/* group size — one ticket, prize covers the chosen group */}
      <div>
        <p className="mb-2 font-body text-sm text-secondary">
          Wer reist mit? <span className="text-faint">(du + bis zu 4)</span>
        </p>
        <div className="grid grid-cols-5 gap-2">
          {GROUP_OPTIONS.map((n) => {
            const active = groupSize === n;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={active}
                onClick={() => setGroupSize(n)}
                className={`rounded-[4px] border py-2.5 font-body text-sm font-medium transition-colors duration-[180ms] ${
                  active
                    ? 'border-gold bg-gold text-bg'
                    : 'border-line text-secondary hover:border-gold/50 hover:text-primary'
                }`}
              >
                {n === 1 ? 'Nur ich' : `+${n - 1}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* email */}
      <div className="space-y-3">
        <label htmlFor="join-email" className="sr-only">
          E-Mail-Adresse
        </label>
        <div className="relative">
          <Mail
            size={18}
            strokeWidth={1.6}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
          />
          <input
            id="join-email"
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
            'Kostenlos dabei sein'
          )}
        </Button>
      </div>
    </form>
  );
}
