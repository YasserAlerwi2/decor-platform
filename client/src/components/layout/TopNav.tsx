'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { trackClick } from '@/lib/trackClick';

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [siteName, setSiteName] = useState('العروي للديكورات');

  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(data => { if (data.settings?.siteName) setSiteName(data.settings.siteName); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`hidden md:flex fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-4 bg-background/80 backdrop-blur-2xl border-b border-outline-variant/20 shadow-xl" : "py-8 bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto w-full px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-transform group-hover:rotate-12 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-2xl">architecture</span>
            </div>
            <span className="font-headline font-bold text-xl text-on-surface tracking-tight">{siteName}</span>
          </Link>
          
          <div className="flex gap-10 items-center bg-surface-container-low/40 backdrop-blur-2xl px-10 py-3 rounded-full border border-outline-variant/20 shadow-lg">
            <Link href="/" className="font-body text-sm font-bold text-primary transition-colors">الرئيسية</Link>
            <Link href="/#services" className="font-body text-sm font-bold text-on-surface hover:text-primary transition-colors">خدماتنا</Link>
            <Link href="/gallery" className="font-body text-sm font-bold text-on-surface hover:text-primary transition-colors">معرض الصور</Link>
            <Link href="#contact" className="font-body text-sm font-bold text-on-surface hover:text-primary transition-colors">اتصل بنا</Link>
          </div>

          <Link 
            href="#contact" 
            onClick={() => trackClick('whatsapp', 'TopNav CTA')}
            className="bg-primary hover:bg-primary-dim text-on-primary-fixed font-bold px-7 py-3 rounded-full flex items-center gap-2 transition-all hover:-translate-y-1 active:scale-95 text-sm shadow-md"
          >
            <span className="material-symbols-outlined text-base">call</span>
            طلب استشارة
          </Link>
        </div>
      </nav>

      {/* Clean Full-Width Mobile Header */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-[60] w-full">
        <div className="bg-surface-container-low/40 backdrop-blur-3xl border-b border-white/5 p-4 flex items-center justify-between shadow-lg">
          <Link href="/" className="flex items-center gap-2 group relative z-10">
            <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-xl">architecture</span>
            </div>
            <span className="font-headline font-bold text-base text-on-surface tracking-tight">{siteName}</span>
          </Link>
          
          <Link 
            href="#contact" 
            onClick={() => trackClick('whatsapp', 'TopNav Mobile CTA')}
            className="relative z-10 w-10 h-10 rounded-xl bg-primary/10 backdrop-blur-md flex items-center justify-center text-primary border border-primary/20 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-xl font-bold">call</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
