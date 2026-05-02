'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [siteName, setSiteName] = useState('العروي للديكورات');
  const [phone, setPhone] = useState('966506027658');
  const [address, setAddress] = useState('محايل عسير، المملكة العربية السعودية');

  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          if (data.settings.siteName) setSiteName(data.settings.siteName);
          if (data.settings.phone) setPhone(data.settings.phone);
          if (data.settings.address) setAddress(data.settings.address);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer id="contact" className="w-full bg-surface-container-low border-t border-outline-variant/20 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center transition-transform group-hover:rotate-12">
                <span className="material-symbols-outlined text-primary text-3xl">architecture</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-2xl text-on-surface tracking-tight">{siteName}</span>
              </div>
            </Link>
            <p className="text-on-surface-variant font-body text-base leading-relaxed">
              نحن متخصصون في تحويل المساحات العادية إلى لوحات فنية فخمة باستخدام أحدث بدائل الرخام والخشب والديكورات العصرية.
            </p>
          </div>

          {/* Quick Contact Section */}
          <div className="space-y-6">
             <h3 className="font-headline font-bold text-xl text-on-surface">معلومات التواصل</h3>
             <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                   <span className="material-symbols-outlined text-primary mt-1">location_on</span>
                   <div className="flex flex-col">
                      <span className="font-body text-on-surface font-bold">الموقع</span>
                      <address className="not-italic text-on-surface-variant font-body">{address}</address>
                   </div>
                </li>
                <li className="flex items-start gap-3 group">
                   <span className="material-symbols-outlined text-primary mt-1">call</span>
                   <div className="flex flex-col">
                      <span className="font-body text-on-surface font-bold">اتصال مباشرة</span>
                      <a href={`tel:${phone}`} className="text-on-surface-variant font-body hover:text-primary transition-colors" dir="ltr">+{phone}</a>
                   </div>
                </li>
             </ul>
          </div>

          {/* Direct Support */}
          <div className="space-y-6">
             <h3 className="font-headline font-bold text-xl text-on-surface">الدعم المباشر</h3>
             <div className="flex flex-col gap-3">
                <a 
                  href="https://wa.me/966506027658" 
                  target="_blank"
                  className="bg-secondary text-on-secondary-fixed flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-body font-bold hover:bg-secondary-dim transition-all active:scale-95 text-center shadow-lg shadow-secondary/20"
                >
                  <span className="material-symbols-outlined">chat</span>
                  تحدث معنا عبر واتساب
                </a>
             </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-outline-variant/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-on-surface-variant font-body text-sm text-center md:text-right">
             © 2026 جميع الحقوق محفوظة — {siteName}
           </p>
           <div className="flex items-center gap-3 font-body text-sm bg-surface-container-highest/30 px-6 py-2 rounded-full border border-outline-variant/10">
              <span className="text-on-surface-variant">تم تطويره بواسطة</span>
              <a href="https://wa.me/966506027658" target="_blank" className="text-primary font-bold hover:text-secondary transition-colors underline decoration-primary/20">ياسر العروي</a>
           </div>
        </div>
      </div>
    </footer>
  );
}
