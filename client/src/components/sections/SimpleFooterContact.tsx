'use client';

import Link from 'next/link';
import { trackClick } from '@/lib/trackClick';

export default function SimpleFooterContact() {
  return (
    <footer className="w-full bg-surface-container-highest/30 border-t border-outline-variant/20 py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-8">
        
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-on-surface">ابدأ مشروعك معنا اليوم</h2>
          <p className="text-on-surface-variant text-lg md:text-xl font-body max-w-2xl mx-auto">
            نحن هنا لنحول رؤيتك إلى واقع ملهم. تواصل معنا للحصول على استشارة مجانية وعرض سعر مخصص.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="https://wa.me/966506027658"
            target="_blank"
            onClick={() => trackClick('whatsapp', 'Simple Footer WhatsApp')}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-secondary text-on-secondary-fixed hover:bg-secondary-dim px-10 py-4 rounded-full transition-all shadow-lg font-bold text-lg hover:-translate-y-1 active:scale-95"
          >
            <span className="material-symbols-outlined">chat</span>
            <span>تواصل عبر واتساب</span>
          </Link>
          <Link
            href="tel:+966506027658"
            onClick={() => trackClick('phone', 'Simple Footer Phone')}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-variant px-10 py-4 rounded-full transition-all shadow-lg font-bold text-lg hover:-translate-y-1 active:scale-95"
          >
            <span className="material-symbols-outlined">call</span>
            <span>اتصل بنا الآن</span>
          </Link>
        </div>

        <div className="mt-8 border-t border-outline-variant/30 pt-8 w-full">
           <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-on-surface-variant font-body text-sm">
              <p>© 2026 العروي للديكورات — جميع الحقوق محفوظة</p>
              <p>تطوير <span className="text-on-surface font-bold">ياسر العروي</span></p>
           </div>
        </div>

      </div>
    </footer>
  );
}
