const services = [
  {
    color: '#D9D9D9',
    label: 'HITERRATECH (SATELLITE DATA)',
    description: 'บริการข้อมูลภาพถ่ายดาวเทียม วิเคราะห์พื้นที่ Geospatial',
  },
  {
    color: '#707070',
    label: 'ศิลาชัยเจริญ (ROCK QUARRY)',
    description: 'ผลิตและจำหน่ายหินก่อสร้างทุกชนิด กระบวนการที่ได้มาตรฐาน',
  },
  {
    color: '#D9D9D9',
    label: 'กิจธนากรัพย์ (BRICK FACTORY)',
    description: 'ผลิตอิฐบล็อกคุณภาพสูง รองรับงานโครงการก่อสร้างทุกระดับ',
  },
];

export function Services() {
  return (
    <section
      id="services"
      style={{ backgroundColor: '#000000' }}
      className="py-[60px] md:py-[120px]"
    >
      <div className="w-full px-4 md:px-[72px]">
        <h2
          className="inline-block bg-white px-4 py-2 text-[40px] leading-[100%] font-[500] text-black md:px-6 md:py-3 md:text-[56px]"
          style={{ fontFamily: 'var(--font-anuphan)', letterSpacing: '0%' }}
        >
          Our Services
        </h2>
        {/* Service cards: horizontal scroll on xs, grid on sm+ */}

        <div className="-mx-4 mt-10 flex gap-6 overflow-x-auto px-4 pb-4 sm:-mx-0 sm:grid sm:grid-cols-3 sm:gap-8 sm:px-0">
          {services.map((service) => (
            <div
              key={service.label}
              className="flex min-w-[320px] flex-shrink-0 flex-col sm:min-w-0"
            >
              {/* Circle */}
              <div
                className="mx-auto h-[320px] w-[320px] rounded-full border border-[#ffffff1a]"
                style={{ backgroundColor: service.color }}
              />

              {/* Label row */}
              <div className="mt-6 flex items-center justify-between gap-4">
                {/* Badge */}
                <span
                  className="inline-flex items-center rounded-[5px] border border-white px-[8px] py-[4px] text-[13px] leading-[100%] text-white md:px-[10px] md:py-[6px] md:text-[15px]"
                  style={{ fontFamily: 'var(--font-anuphan)', fontWeight: 400, gap: '4px' }}
                >
                  {service.label}
                </span>

                {/* View More */}
                <span
                  className="shrink-0 text-[16px] leading-[100%] text-white md:text-[20px]"
                  style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600 }}
                >
                  View More
                </span>
              </div>

              {/* Description */}
              <p
                className="mt-3 text-[16px] leading-[100%] text-[#868686] md:mt-4 md:text-[18px] md:leading-[160%]"
                style={{ fontFamily: 'var(--font-anuphan)', fontWeight: 400 }}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
