import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative flex min-h-[600px] items-center overflow-hidden bg-black md:min-h-[800px]">
      {/* Background image placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-40" />
      </div>

      <div className="relative z-10 mx-4 pt-[411px] pb-[54px] md:mx-[130px] md:pt-[280px] md:pb-[220px]">
        <h1
          className="text-white"
          style={{
            fontFamily: 'var(--font-anuphan)',
            fontWeight: 700,
            fontSize: '64px',
            lineHeight: '100%',
            letterSpacing: '0%',
          }}
        >
          <span className="mb-8 block">Empowering Progress</span>
          <span className="mb-8 block">from Space to Ground</span>
        </h1>
        <p
          className="mb-8 text-white/80"
          style={{
            fontFamily: 'var(--font-anuphan)',
            fontWeight: 300,
            fontSize: '24px',
            lineHeight: '24px',
            letterSpacing: '0%',
          }}
        >
          HiTerraTech, ศิลาชัยเจริญ และ กิจธนาทรัพย์
        </p>
        <Button
          className="md:!h-[60px] md:!w-[260px] md:!text-[22px]"
          style={{
            width: '209px',
            height: '49px',
            gap: '10px',
            paddingTop: '12px',
            paddingRight: '16px',
            paddingBottom: '12px',
            paddingLeft: '16px',
            backgroundColor: '#3F3F3F',
            borderRadius: '0px',
            fontSize: '18px',
            fontWeight: '700',
            fontFamily: 'var(--font-anuphan)',
          }}
        >
          Explore Our Services
        </Button>
      </div>
    </section>
  );
}
