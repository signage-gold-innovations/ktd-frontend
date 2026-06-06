'use client';

import { useLanguage } from '@/contexts/language-context';

import { Button } from '@/components/ui/button';

export function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative flex min-h-[600px] items-center overflow-hidden bg-black md:min-h-[800px]">
      {/* Background image placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black">
        <div className="absolute inset-0 bg-[url('/assets/hero/hero-background.png')] bg-cover bg-center opacity-70" />
      </div>

      <div className="relative z-10 mx-4 pt-[411px] pb-[54px] md:mx-[130px] md:pt-[280px] md:pb-[220px]">
        <p
          className="mb-4 text-[18px] text-white/80 md:text-[20px]"
          style={{
            fontFamily: 'var(--font-anuphan)',
            fontWeight: 700,
            lineHeight: '120%',
            letterSpacing: '0%',
          }}
        >
          Tod Sirawattananon
        </p>
        <h1
          className="text-[36px] text-white md:text-[64px]"
          style={{
            fontFamily: 'var(--font-anuphan)',
            fontWeight: 700,
            lineHeight: '100%',
            letterSpacing: '0%',
          }}
        >
          <span className="mb-8 block">{t.hero.title}</span>
        </h1>
        <p
          className="mb-0 text-[20px] leading-[24px] text-[#F3F3F3] md:text-[32px] md:leading-[32px]"
          style={{
            fontFamily: 'var(--font-anuphan)',
            fontWeight: 300,
            letterSpacing: '0%',
          }}
        >
          {t.hero.subtitle}
        </p>
        <Button
          className="mt-16 md:!h-[60px] md:!w-[260px] md:!text-[22px]"
          style={{
            width: '217px',
            height: '49px',
            gap: '10px',
            paddingTop: '12px',
            paddingRight: '16px',
            paddingBottom: '12px',
            paddingLeft: '16px',
            backgroundColor: '#A92DFF',
            backgroundImage: 'linear-gradient(0deg, #A92DFF, #A92DFF)',
            opacity: 1,
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: '700',
            fontFamily: 'var(--font-anuphan)',
          }}
        >
          {t.hero.cta}
        </Button>
      </div>
    </section>
  );
}
