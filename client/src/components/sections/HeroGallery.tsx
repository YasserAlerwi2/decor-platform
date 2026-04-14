'use client';

import Link from 'next/link';

const services = [
  {
    id: 'marble',
    title: 'بديل رخام',
    desc: 'لمسات رخامية فخمة بعمر أطول',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: 'wpc',
    title: 'بديل شيبورد (خشب)',
    desc: 'دفء الخشب وجودة لا تضاهى',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2669&auto=format&fit=crop',
  },
  {
    id: 'tv-decor',
    title: 'ديكورات شاشات',
    desc: 'تصاميم ذكية تزين قلب منزلك',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: 'office-decor',
    title: 'ديكورات مكاتب',
    desc: 'بيئات عمل مريحة وملهمة',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: 'villa-decor',
    title: 'ديكورات فلل',
    desc: 'فخامة القصور بتفاصيل معمارية بارزة',
    image: 'https://images.unsplash.com/photo-1613490908578-83861fb16e45?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: 'paints',
    title: 'دهانات داخلية',
    desc: 'ألوان عصرية للمساحات الأنيقة',
    image: 'https://images.unsplash.com/photo-1562184552-997c461abbe6?q=80&w=2670&auto=format&fit=crop',
  },
];

export default function HeroGallery() {
  return (
    <div className="relative z-10 w-full flex flex-col items-center">

      {/* ═══════════ HERO ═══════════ */}
      <section className="w-full flex flex-col items-center justify-center text-center px-4 md:px-6 pt-28 md:pt-36 pb-6 relative">
        <div className="w-full flex flex-col items-center max-w-5xl animate-fadeInUp">
          {/* Tagline */}
          <span className="text-violet-300 text-sm md:text-base font-bold tracking-widest mb-6">
            ✦ مرحباً بك في المستقبل
          </span>

          {/* Main Title */}
          <h1 className="font-black text-violet-400 text-2xl md:text-4xl lg:text-5xl leading-[1.6] md:leading-[1.7] mb-6">
            نصنع <span className="text-white">الفخامة</span>
            <br />
            في كل زاوية
          </h1>

          {/* Subtitle */}
          <p className="text-violet-400 font-medium text-sm md:text-xl leading-loose max-w-2xl text-center mb-12">
            بديل رخام · شيبورد · ورق · ديكورات شاشات · بديل شيبورد · باركيه · وجميع أنواع الديكورات
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-row w-full justify-center items-center gap-2 md:gap-4 px-1 md:px-0">
            <a
              href="#contact"
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs md:text-lg px-4 py-3 md:px-10 md:py-5 rounded-xl md:rounded-3xl transition-all duration-300 shadow-[0_8px_30px_rgba(124,58,237,0.4)] hover:shadow-[0_8px_40px_rgba(124,58,237,0.6)] whitespace-nowrap"
            >
              تواصل معنا
            </a>
            <a
              href="#gallery"
              className="border border-white/10 hover:border-white/30 bg-white/5 text-white font-bold text-xs md:text-lg px-4 py-3 md:px-10 md:py-5 rounded-xl md:rounded-3xl transition-all duration-300 whitespace-nowrap"
            >
              شاهد أعمالنا
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ GALLERY ═══════════ */}
      <section id="gallery" className="w-full pt-8 pb-16 md:py-28 px-4 md:px-8 flex flex-col items-center">
        <div className="w-full max-w-6xl">

          {/* Section Header */}
          <div className="w-full flex flex-col items-center text-center mb-8 md:mb-16 animate-fadeInUp">
            <span className="text-violet-400 text-sm font-bold tracking-widest mb-4">
              نحن هنا لنلهمك
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
              خدماتنا
            </h2>
            <p className="text-white/60 text-base md:text-xl max-w-2xl">
              يمكنك تصفح أعمالنا ورؤية إبداعاتنا من خلال الضغط على إحدى الخدمات أدناه.
            </p>
          </div>

          {/* Cards (Carousel on Mobile, Grid on Desktop) */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 w-full overflow-x-auto overflow-y-hidden md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 scrollbar-hide pl-4 md:pl-0">
            {services.map((service, i) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group cursor-pointer w-[70vw] sm:w-[50vw] md:w-full shrink-0 snap-center md:snap-align-none block animate-fadeInUp"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative aspect-[3/4] md:aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl hover:border-violet-500/30 transition-all duration-300">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 z-20">
                    <h3 className="text-xl md:text-3xl font-black text-white mb-2 md:mb-3 shadow-black transition-colors group-hover:text-violet-300">
                      {service.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/80 font-medium md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      {service.desc}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-violet-400 font-bold text-xs md:text-sm uppercase tracking-wider md:opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      تصفح الأعمال &larr;
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Scroll Indicator (mobile only) */}
          <div className="flex md:hidden items-center justify-center gap-2 mt-4">
            <span className="text-white/30 text-xs">← مرر لرؤية المزيد →</span>
          </div>
        </div>
      </section>
    </div>
  );
}
