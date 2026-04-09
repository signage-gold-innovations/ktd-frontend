import { Button } from '@/components/ui/button';

export function About() {
  return (
    <section id="about" className="relative" style={{ backgroundColor: '#1D1D1D' }}>
      <div className="relative mx-auto w-full max-w-[1440px] px-4 pt-[80px] pb-[160px] md:px-[72px] md:pb-[80px]">
        {/* flex-wrap: left column has a fixed min-width matching the absolute blocks' extent
            (pl 100 + left 232 + w 353 = 685px). When viewport is too narrow for both columns,
            right column wraps below automatically instead of overlapping. */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:flex-wrap md:items-start md:gap-8">
          {/* Left design column — always fixed size; overflow-x-auto prevents narrow-screen breakout */}
          <div className="w-full overflow-hidden md:w-auto md:overflow-visible">
            <div className="relative h-[464px] w-[685px] shrink-0">
              <div
                className="absolute top-[32px] h-[156.1897430419922px] w-[140.21038818359375px] bg-[#707070] md:top-0 md:left-0 md:h-[222px] md:w-[206px]"
                style={{ transform: 'rotate(0deg)', opacity: 1 }}
              />

              <div
                className="absolute top-[32px] left-[157.74px] h-[248.3557586669922px] w-[240.26344299316406px] bg-[#3F3F3F] md:top-0 md:left-[232px] md:h-[353px] md:w-[353px]"
                style={{ transform: 'rotate(0deg)', opacity: 1 }}
              />

              <div
                className="absolute top-[205.78px] h-[152.6719512939453px] w-[322.6200256347656px] bg-[#D9D9D9] md:top-[247px] md:left-0 md:h-[217px] md:w-[474px]"
                style={{ transform: 'rotate(0deg)', opacity: 1 }}
              />
            </div>
          </div>

          {/* Right content column — centered on mobile, flex-1 on md+ */}
          <div className="w-full max-w-[428px] text-left md:mt-0 md:mt-[40px] md:flex md:min-w-[300px] md:flex-1 md:flex-col md:justify-start md:gap-8">
            {/* Company Name — visible on mobile only */}
            <h1
              className="block text-[40px] leading-[100%] font-[700] text-white md:hidden"
              style={{ fontFamily: 'var(--font-anuphan)' }}
            >
              Company Name
            </h1>

            <h2
              className="mt-[32px] text-[20px] leading-[100%] font-[500] text-[#969696] md:mt-4 md:text-[40px] md:leading-[100%] md:font-[400] md:text-[var(--Gray-1,#E0E0E0)]"
              style={{ fontFamily: 'var(--font-anuphan)' }}
            >
              <span className="inline md:block">HiTerraTech,</span>
              <span className="inline md:block">ศิลาชัยเจริญ และ</span>
              <span className="inline md:block">กิจธนาทรัพย์</span>
            </h2>

            <p
              className="mt-[32px] text-[20px] leading-[100%] text-[#969696] md:mt-4"
              style={{ fontFamily: 'var(--font-anuphan)', fontWeight: 500 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <div className="mt-[32px] md:mt-4">
              <Button
                className="h-[49px] w-[124px] bg-[#3F3F3F] text-white"
                style={{
                  fontFamily: 'var(--font-anuphan)',
                  fontWeight: 700,
                  borderRadius: '0px',
                  fontSize: '18px',
                }}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
