'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import InteractiveServicesGrid from "../components/sections/InteractiveServicesGrid";
import HorizontalGallery from "../components/sections/HorizontalGallery";
import Counter from "../components/ui/Counter";
import { trackClick } from "../lib/trackClick";

interface SiteSettings {
  siteName: string;
  phone: string | null;
  whatsappUrl: string | null;
  address: string | null;
  yearsExperience: number;
  totalProjects: number;
  satisfactionRate: number;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroDescription: string | null;
  heroImageUrl: string | null;
  servicesLabel: string | null;
  servicesTitle: string | null;
  servicesDescription: string | null;
}

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const heroTitle = settings?.heroTitle || 'نصنع الفخامة';
  const heroSubtitle = settings?.heroSubtitle || 'في كل زاوية';
  const heroDesc = settings?.heroDescription || 'تنفرد شركة العروي بتقديم تصاميم داخلية عصرية، بدائل رخام رائعة، بانوهات وورق جدران، وديكورات شاشات مدمجة لترتقي بأسلوب حياتك.';
  const heroImage = settings?.heroImageUrl || '/images/lux_marble_wall.png';
  const whatsappLink = settings?.whatsappUrl || 'https://wa.me/966506027658';
  const phoneLink = settings?.phone ? `tel:${settings.phone}` : 'tel:+966506027658';
  const servicesLabel = settings?.servicesLabel || 'احترافية وإبداع';
  const servicesTitle = settings?.servicesTitle || 'خدماتنا المتميزة';
  const servicesDesc = settings?.servicesDescription || 'نقدم حلول متكاملة للديكور الداخلي تشمل أحدث خامات بديل الرخام، بديل الخشب، وأعمال الباركيه والإنارة المخفية.';

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[550px] md:min-h-[85vh] flex flex-col justify-end md:justify-center px-6 pb-12 pt-24 overflow-hidden rounded-b-[2rem] md:rounded-b-[4rem]">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-80 md:opacity-75" 
            src={heroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent/30 md:bg-gradient-to-r md:from-background md:via-background/80 md:to-transparent/10"></div>
          <div className="absolute inset-0 bg-hero-glow mix-blend-screen opacity-50 md:opacity-30 pointer-events-none"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6 md:items-center">
          <div className="space-y-4 md:space-y-8 md:max-w-xl lg:max-w-2xl">
            <h1 className="font-headline font-bold text-4xl md:text-6xl lg:text-[5rem] leading-tight text-on-surface drop-shadow-lg">
              {heroTitle}<br/><span className="text-primary mt-2 inline-block">{heroSubtitle}</span>
            </h1>
            <p className="font-body text-on-surface-variant text-base md:text-lg lg:text-xl leading-relaxed max-w-sm md:max-w-xl">
              {heroDesc}
            </p>
            
            <div className="flex flex-row gap-3 mt-4 md:mt-10 md:w-fit w-full">
              <a 
                href={whatsappLink}
                target="_blank"
                onClick={() => trackClick('whatsapp', 'Hero WhatsApp')}
                className="flex-1 md:flex-none md:w-auto bg-secondary hover:bg-secondary-dim text-on-secondary-fixed font-bold px-4 md:px-8 rounded-full flex items-center justify-center gap-1 md:gap-2 transition-transform hover:-translate-y-1 active:scale-95 shadow-[0_0_30px_rgba(107,255,143,0.3)] py-3 md:py-4 text-sm md:text-lg"
              >
                <span className="material-symbols-outlined text-base md:text-xl">chat</span>
                واتساب
              </a>
              <a 
                href={phoneLink}
                onClick={() => trackClick('phone', 'Hero Phone')}
                className="flex-1 md:flex-none md:w-auto bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/60 text-on-surface hover:bg-surface-container-highest font-bold px-4 md:px-8 rounded-full flex items-center justify-center gap-1 md:gap-2 transition-colors active:scale-95 py-3 md:py-4 text-sm md:text-lg"
              >
                <span className="material-symbols-outlined text-base md:text-xl">call</span>
                اتصال
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full mb-12">
        {/* Stats Section */}
        <section className="px-6 py-8 md:py-20">
          <div className="grid grid-cols-3 gap-3 md:gap-10">
            <div className="bg-surface-container-highest/80 backdrop-blur-sm rounded-2xl md:rounded-[2rem] p-4 md:p-10 flex flex-col items-center justify-center text-center gap-1 shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/5 transition-transform hover:-translate-y-2">
              <span className="font-headline font-bold text-2xl md:text-6xl text-primary drop-shadow-[0_0_15px_rgba(186,158,255,0.4)]">
                <Counter value={settings?.totalProjects ?? 1000} prefix="+" />
              </span>
              <span className="font-body text-xs md:text-lg text-on-surface-variant mt-1 md:mt-3 font-medium">مشروع مكتمل</span>
            </div>
            <div className="bg-surface-container-highest/80 backdrop-blur-sm rounded-2xl md:rounded-[2rem] p-4 md:p-10 flex flex-col items-center justify-center text-center gap-1 shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/5 transition-transform hover:-translate-y-2">
              <span className="font-headline font-bold text-2xl md:text-6xl text-secondary drop-shadow-[0_0_15px_rgba(107,255,143,0.4)]">
                 <Counter value={settings?.satisfactionRate ?? 98} suffix="%" />
              </span>
              <span className="font-body text-xs md:text-lg text-on-surface-variant mt-1 md:mt-3 font-medium">رضا العملاء</span>
            </div>
            <div className="bg-surface-container-highest/80 backdrop-blur-sm rounded-2xl md:rounded-[2rem] p-4 md:p-10 flex flex-col items-center justify-center text-center gap-1 shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/5 transition-transform hover:-translate-y-2">
              <span className="font-headline font-bold text-2xl md:text-6xl text-primary drop-shadow-[0_0_15px_rgba(186,158,255,0.4)]">
                <Counter value={settings?.yearsExperience ?? 7} prefix="+" />
              </span>
              <span className="font-body text-xs md:text-lg text-on-surface-variant mt-1 md:mt-3 font-medium">سنوات خبرة</span>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="px-6 py-8 md:py-12 flex flex-col gap-6 md:gap-14">
          <div className="flex items-end justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm md:text-base mb-2">
                <span className="material-symbols-outlined text-sm">stars</span>
                <span>{servicesLabel}</span>
              </div>
              <h2 className="font-headline font-bold text-2xl md:text-5xl text-on-surface">{servicesTitle}</h2>
              <p className="font-body text-sm md:text-lg text-on-surface-variant mt-2 max-w-xl hidden md:block">{servicesDesc}</p>
            </div>
            <button className="hidden md:flex items-center gap-2 bg-surface-container-low hover:bg-surface-variant text-on-surface font-bold py-3 px-6 rounded-full transition-colors">
              عرض الكل
              <span className="material-symbols-outlined">arrow_left_alt</span>
            </button>
            <span className="material-symbols-outlined text-primary md:hidden">arrow_forward</span>
          </div>

          <InteractiveServicesGrid />
        </section>

        {/* Home Photo Gallery Slider */}
        <HorizontalGallery />
      </div>
    </main>
  );
}
