'use client';

import { Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { trackClick } from '@/lib/trackClick';

const WhatsappIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function FooterContact() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(data => { if (data.settings) setSettings(data.settings); })
      .catch(() => {});
  }, []);

  const footerHeading = settings?.footerHeading || 'جاهزون لتحويل\nمساحتك إلى تحفة فنية';
  const footerDesc = settings?.footerDescription || 'تواصل معنا الآن عبر واتساب أو اتصل مباشرة واحصل على استشارة مجانية لمشروعك';
  const footerCta = settings?.footerCtaText || 'تواصل معنا الآن عبر واتساب أو اتصل مباشرة واحصل على استشارة مجانية لمشروعك';
  const whatsappLink = settings?.whatsappUrl || 'https://wa.me/966506027658';
  const phoneLink = settings?.phone ? `tel:${settings.phone}` : 'tel:+966506027658';
  const phoneDisplay = settings?.phone ? `+${settings.phone.replace(/^(966)/, '966 ')}` : '+966 50 602 7658';
  const address = settings?.address || 'محايل عسير';

  return (
    <section id="contact" className="relative z-10 pt-12 md:pt-36 pb-6 md:pb-8 w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl mb-8 md:mb-24 flex flex-col items-center text-center bg-white/[0.02] backdrop-blur-2xl border-y md:border border-white/[0.05] md:rounded-[4rem] p-5 py-10 md:p-20 shadow-[0_0_80px_rgba(0,0,0,0.5)]">

        <div
          className="flex flex-col items-center w-full animate-fadeInUp"
        >
          {/* Label */}
          <span className="text-violet-400 text-xs md:text-base font-bold tracking-widest mb-3 md:mb-6">
            ✦ تواصل معنا
          </span>

          {/* Heading */}
          <h2 className="text-lg md:text-4xl font-black text-white leading-[1.6] md:leading-[1.7] mb-6">
            {footerHeading.split('\n').map((line: string, i: number) => (
              <span key={i}>{line}{i < footerHeading.split('\n').length - 1 && <br />}</span>
            ))}
          </h2>

          {/* Description */}
          <p className="text-white/60 text-xs md:text-xl font-medium max-w-2xl text-center mb-6 md:mb-16">
            {footerDesc}
          </p>

          {/* Buttons */}
          <div className="flex flex-row items-center justify-center gap-2 md:gap-6 w-full mb-16 px-1 md:px-0">
            {/* WhatsApp */}
            <Link
              href={whatsappLink}
              target="_blank"
              onClick={() => trackClick('whatsapp', 'Footer WhatsApp')}
              className="group flex flex-row items-center justify-center gap-1.5 md:gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs md:text-lg px-3 py-3 md:px-10 md:py-5 rounded-xl md:rounded-3xl transition-all duration-300 shadow-[0_0_30px_rgba(37,211,102,0.2)] hover:shadow-[0_0_50px_rgba(37,211,102,0.5)] w-full sm:w-auto whitespace-nowrap"
            >
              <WhatsappIcon size={18} className="group-hover:scale-110 transition-transform md:w-[24px] md:h-[24px]" />
              <span>واتساب</span>
            </Link>

            {/* Phone */}
            <Link
              href={phoneLink}
              onClick={() => trackClick('phone', 'Footer Phone')}
              className="group flex flex-row items-center justify-center gap-1.5 md:gap-3 border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white font-bold text-xs md:text-lg px-3 py-3 md:px-10 md:py-5 rounded-xl md:rounded-3xl transition-all duration-300 w-full sm:w-auto whitespace-nowrap"
            >
              <Phone size={16} className="text-white/50 group-hover:text-white transition-colors md:w-[22px] md:h-[22px]" />
              <span dir="ltr">{phoneDisplay}</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="w-full max-w-xs md:max-w-md h-px bg-white/[0.05] my-6 md:my-8" />

          {/* Social Links & Address Section */}
          <div className="flex flex-col items-center justify-center gap-5 w-full">
            
            {/* Social Links */}
            <div className="flex flex-row flex-wrap sm:flex-nowrap items-center justify-center gap-6 md:gap-8 text-white/50 text-sm md:text-base font-medium">
              <Link href="#" className="group flex items-center gap-2 hover:text-[#E4405F] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E4405F] group-hover:scale-110 transition-transform"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                <span className="hidden sm:inline">إنستغرام</span>
              </Link>
              <Link href="#" className="group flex items-center gap-2 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white group-hover:scale-110 transition-transform"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.36-2.91 5.75-1.74 1.38-4.01 1.84-6.14 1.36-2.07-.46-3.8-1.92-4.66-3.85-.86-1.93-.65-4.24.47-6.04 1.1-1.76 2.91-2.96 4.93-3.23v4.06c-.46.12-.9.34-1.25.68-.41.4-.73.91-.84 1.48-.15.71.02 1.46.46 2.03.41.52 1.04.83 1.69.89.71.05 1.43-.2 1.94-.71.55-.55.84-1.33.86-2.11V0z"/></svg>
                <span className="hidden sm:inline">تيك توك</span>
              </Link>
              <Link href="#" className="group flex items-center gap-2 hover:text-[#FFFC00] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#FFFC00] group-hover:scale-110 transition-transform"><path d="M12 3c-3.866 0-7 3.134-7 7 0 .58.07 1.14.2 1.68-.64.31-1.12.92-1.27 1.65l-.33 1.61c-.02.08.01.17.07.23s.15.08.22.06l1.54-.46c.46 1.63 1.49 3.03 2.89 3.93.06.04.14.04.2-.01.06-.05.08-.13.06-.21-.13-.53-.13-1.09.02-1.63.48.24 1.01.37 1.56.37 1.42 0 2.71-.85 3.32-2.11.19.04.38.06.57.06.53 0 1.05-.12 1.54-.35.15.54.15 1.1.02 1.63-.02.08.01.16.06.21.06.05.14.05.2.01 1.4-.9 2.43-2.3 2.89-3.93l1.54.46c.07.02.16 0 .22-.06s.09-.15.07-.23l-.33-1.61c-.15-.73-.63-1.34-1.27-1.65.13-.54.2-1.11.2-1.69 0-3.866-3.134-7-7-7z"/></svg>
                <span className="hidden sm:inline">سناب شات</span>
              </Link>
            </div>

            {/* Address */}
            <div className="flex items-center gap-1.5 text-white/50 text-xs md:text-sm font-medium mt-2">
              <MapPin size={16} className="text-violet-400" />
              {address}
            </div>
          </div>

        </div>
      </div>

      {/* Independent Credits Section */}
      <div className="w-full flex flex-col items-center justify-center gap-2 border-t border-white/5 pt-6 mt-auto text-center">
        <p className="text-white/40 text-xs md:text-sm font-medium">
          تم تطويره بواسطة{' '}
          <Link
            href="https://wa.me/966506027658"
            target="_blank"
            className="text-white/60 hover:text-white transition-colors underline decoration-white/10 hover:decoration-white/50"
          >
            ياسر العروي
          </Link>
        </p>
        <p className="text-white/20 text-[10px] tracking-wider mt-1">
          © 2026 ديكورمِكس — جميع الحقوق محفوظة
        </p>
      </div>
    </section>
  );
}
