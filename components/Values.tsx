import {
  Heart,
  MessagesSquare,
  HeartHandshake,
  Users,
  Scale,
  Globe,
  Sprout,
  Sparkles,
  Handshake,
  ShieldCheck,
  HandHeart,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';

// icons map by Family-Code order (1 Love&Respect … 11 Community Service)
const ICONS = [Heart, MessagesSquare, HeartHandshake, Users, Scale, Globe, Sprout, Sparkles, Handshake, ShieldCheck, HandHeart];

const Values = () => {
  const t = useTranslations('values');
  const items = t.raw('items') as { title: string; text: string }[];

  return (
    <section id="werte" className="bg-bg py-24 md:py-32">
      <MaxWidth>
        <Reveal>
          <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">
            {t('label')}
          </p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[0.02em] text-primary">
            {t('title')}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-6 max-w-[640px] font-body text-lg leading-relaxed text-secondary">
            {t('intro')}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {items.map((item, i) => {
            const Icon = ICONS[i] ?? Heart;
            return (
              <Reveal
                as="div"
                key={item.title}
                delay={0.1 + (i % 2) * 0.08}
                className="rounded-[8px] border border-line p-7"
              >
                <Icon size={24} strokeWidth={1.5} className="text-gold" />
                <h3 className="mt-4 font-display text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 font-body text-base leading-relaxed text-secondary">{item.text}</p>
              </Reveal>
            );
          })}
        </div>
      </MaxWidth>
    </section>
  );
};

export default Values;
