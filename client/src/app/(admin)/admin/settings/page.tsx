'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    siteName: '',
    phone: '',
    whatsappUrl: '',
    address: '',
    yearsExperience: 7,
    totalProjects: 1200,
    satisfactionRate: 98,
    instagramUrl: '',
    tiktokUrl: '',
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    heroImageUrl: '',
    servicesLabel: '',
    servicesTitle: '',
    servicesDescription: '',
    footerHeading: '',
    footerDescription: '',
    footerCtaText: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
    },
    analytics: {
      googleAnalyticsId: '',
      searchConsoleCode: '',
    }
  });

  // Fetch settings on load
  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.id) setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) alert('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      alert('خطأ في الحفظ');
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-10 pb-32">
      {/* ════ PRESTIGE HEADER ════ */}
      <div className="flex items-center justify-between gap-4 bg-surface-container-low/40 backdrop-blur-3xl p-5 md:p-12 rounded-[1.5rem] md:rounded-[3.5rem] border border-outline-variant/10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
           <h1 className="text-xl md:text-5xl font-headline font-bold text-on-surface">إعدادات الموقع</h1>
           <p className="text-[9px] md:text-xl font-body text-on-surface-variant/60">تحكم شامل في الهوية، البيانات، ومحركات البحث</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="relative z-10 bg-primary text-on-primary px-6 py-3 md:px-12 md:py-5 rounded-xl md:rounded-2xl font-bold shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-xs md:text-base flex items-center gap-2"
        >
           {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : null}
           <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
        </button>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
        
        {/* ════ LEFT COLUMN: STATS & LINKS ════ */}
        <div className="lg:col-span-4 space-y-4 md:space-y-8">
           {/* Section: Success Stats */}
           <div className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-surface-container-low/60 border border-outline-variant/10 shadow-sm backdrop-blur-2xl">
              <h2 className="text-sm md:text-xl font-headline font-bold mb-6 flex items-center gap-2">
                 <span className="material-symbols-outlined text-amber-500">military_tech</span>
                 إحصائيات النجاح
              </h2>
              <div className="grid grid-cols-1 gap-4">
                 <div className="flex items-center justify-between p-4 bg-surface-container-highest/20 rounded-2xl border border-outline-variant/10">
                    <span className="text-xs md:text-sm font-bold font-body">سنوات الخبرة</span>
                    <input 
                      type="number" 
                      value={settings.yearsExperience}
                      onChange={e => setSettings({...settings, yearsExperience: parseInt(e.target.value)})}
                      className="w-16 bg-transparent text-center font-headline font-bold text-amber-500 text-lg outline-none" 
                    />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-surface-container-highest/20 rounded-2xl border border-outline-variant/10">
                    <span className="text-xs md:text-sm font-bold font-body">المشاريع المنفذة</span>
                    <input 
                      type="number" 
                      value={settings.totalProjects}
                      onChange={e => setSettings({...settings, totalProjects: parseInt(e.target.value)})}
                      className="w-20 bg-transparent text-center font-headline font-bold text-primary text-lg outline-none" 
                    />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-surface-container-highest/20 rounded-2xl border border-outline-variant/10">
                    <span className="text-xs md:text-sm font-bold font-body">نسبة الرضاء (%)</span>
                    <input 
                      type="number" 
                      value={settings.satisfactionRate}
                      onChange={e => setSettings({...settings, satisfactionRate: parseInt(e.target.value)})}
                      className="w-16 bg-transparent text-center font-headline font-bold text-emerald-500 text-lg outline-none" 
                    />
                 </div>
              </div>
           </div>

           {/* Section: Social Media */}
           <div className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-surface-container-low/60 border border-outline-variant/10 shadow-sm backdrop-blur-2xl">
              <h2 className="text-sm md:text-xl font-headline font-bold mb-6 flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">public</span>
                 قنوات التواصل
              </h2>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold text-on-surface-variant/50 px-2 uppercase tracking-tight">Instagram</label>
                    <input 
                      type="text" 
                      value={settings.instagramUrl || ''}
                      onChange={e => setSettings({...settings, instagramUrl: e.target.value})}
                      placeholder="@username" 
                      className="w-full bg-surface-container-highest/40 border border-outline-variant/10 rounded-xl p-3 outline-none focus:border-primary font-body text-xs" 
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold text-on-surface-variant/50 px-2 uppercase tracking-tight">TikTok</label>
                    <input 
                      type="text" 
                      value={settings.tiktokUrl || ''}
                      onChange={e => setSettings({...settings, tiktokUrl: e.target.value})}
                      placeholder="@username" 
                      className="w-full bg-surface-container-highest/40 border border-outline-variant/10 rounded-xl p-3 outline-none focus:border-primary font-body text-xs" 
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* ════ MAIN COLUMN: IDENTITY & SEO ════ */}
        <div className="lg:col-span-8 space-y-4 md:space-y-8">
           {/* Section: Brand Identity */}
           <div className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-surface-container-low border border-outline-variant/10 shadow-sm">
              <h2 className="text-base md:text-3xl font-headline font-bold mb-8 md:mb-12 flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary">badge</span>
                 الهوية والتواصل
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1">اسم المؤسسة</label>
                    <input 
                      type="text" 
                      value={settings.siteName}
                      onChange={e => setSettings({...settings, siteName: e.target.value})}
                      placeholder="العروي للديكورات" 
                      className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-primary font-body text-xs md:text-base" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1">رقم الجوال / واتساب</label>
                    <input 
                      type="tel" 
                      value={settings.phone || ''}
                      onChange={e => setSettings({...settings, phone: e.target.value})}
                      placeholder="9665xxxxxxxx" 
                      className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-primary font-body text-xs md:text-base text-left" dir="ltr" 
                    />
                 </div>
                 <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1">شعار المنصة</label>
                    <div className="flex items-center gap-6 p-6 bg-surface-container-highest/20 rounded-[2rem] border border-dashed border-outline-variant/20 hover:border-primary transition-all cursor-pointer">
                       <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-on-surface-variant/40 group-hover:text-primary transition-all">
                          <span className="material-symbols-outlined text-3xl md:text-5xl">add_photo_alternate</span>
                       </div>
                       <div>
                          <p className="font-body font-bold text-xs md:text-lg">تحديث الشعار</p>
                          <p className="text-[9px] md:text-xs text-on-surface-variant font-body">PNG, SVG (max 5MB)</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section: Homepage Hero Content */}
           <div className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-surface-container-low border border-outline-variant/10 shadow-sm">
              <h2 className="text-base md:text-3xl font-headline font-bold mb-8 md:mb-12 flex items-center gap-3">
                 <span className="material-symbols-outlined text-violet-500">home_app_logo</span>
                 محتوى الصفحة الرئيسية
              </h2>
              
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1">العنوان الرئيسي</label>
                       <input 
                         type="text" 
                         value={settings.heroTitle || ''}
                         onChange={e => setSettings({...settings, heroTitle: e.target.value})}
                         placeholder="نصنع الفخامة" 
                         className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-violet-500 font-body text-xs md:text-base" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1">العنوان الفرعي</label>
                       <input 
                         type="text" 
                         value={settings.heroSubtitle || ''}
                         onChange={e => setSettings({...settings, heroSubtitle: e.target.value})}
                         placeholder="في كل زاوية" 
                         className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-violet-500 font-body text-xs md:text-base" 
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1">وصف الهيرو</label>
                    <textarea 
                      rows={3} 
                      value={settings.heroDescription || ''}
                      onChange={e => setSettings({...settings, heroDescription: e.target.value})}
                      placeholder="تنفرد شركة العروي بتقديم تصاميم داخلية عصرية..." 
                      className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-violet-500 font-body text-xs md:text-base leading-relaxed" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1">صورة خلفية الهيرو</label>
                    <div className="flex flex-col gap-3">
                       {settings.heroImageUrl && (
                         <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-outline-variant/10">
                           <img src={settings.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
                         </div>
                       )}
                       <div className="flex items-center gap-4">
                         <label className="flex items-center gap-2 bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 font-bold px-4 py-3 rounded-xl cursor-pointer transition-colors text-xs md:text-sm">
                           <span className="material-symbols-outlined text-base">upload</span>
                           رفع صورة
                           <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                             const file = e.target.files?.[0];
                             if (!file) return;
                             const formData = new FormData();
                             formData.append('file', file);
                             try {
                               const res = await fetch('/api/upload', { method: 'POST', body: formData });
                               const data = await res.json();
                               if (data.url) setSettings({...settings, heroImageUrl: data.url});
                             } catch (err) { console.error('Upload error:', err); }
                           }} />
                         </label>
                         <input 
                           type="text" 
                           value={settings.heroImageUrl || ''}
                           onChange={e => setSettings({...settings, heroImageUrl: e.target.value})}
                           placeholder="/images/lux_marble_wall.png" 
                           className="flex-1 bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-violet-500 font-body text-xs md:text-base text-left" dir="ltr" 
                         />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section: Services Section Content */}
           <div className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-surface-container-low border border-outline-variant/10 shadow-sm">
              <h2 className="text-base md:text-3xl font-headline font-bold mb-8 md:mb-12 flex items-center gap-3">
                 <span className="material-symbols-outlined text-secondary">design_services</span>
                 محتوى قسم الخدمات
              </h2>
              
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1">العلامة (Label)</label>
                       <input 
                         type="text" 
                         value={settings.servicesLabel || ''}
                         onChange={e => setSettings({...settings, servicesLabel: e.target.value})}
                         placeholder="احترافية وإبداع" 
                         className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-secondary font-body text-xs md:text-base" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1">عنوان القسم</label>
                       <input 
                         type="text" 
                         value={settings.servicesTitle || ''}
                         onChange={e => setSettings({...settings, servicesTitle: e.target.value})}
                         placeholder="خدماتنا المتميزة" 
                         className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-secondary font-body text-xs md:text-base" 
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1">وصف القسم</label>
                    <textarea 
                      rows={3} 
                      value={settings.servicesDescription || ''}
                      onChange={e => setSettings({...settings, servicesDescription: e.target.value})}
                      placeholder="نقدم حلول متكاملة للديكور الداخلي..." 
                      className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-secondary font-body text-xs md:text-base leading-relaxed" 
                    />
                 </div>
              </div>
           </div>

           {/* Section: Footer Content */}
           <div className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-surface-container-low border border-outline-variant/10 shadow-sm">
              <h2 className="text-base md:text-3xl font-headline font-bold mb-8 md:mb-12 flex items-center gap-3">
                 <span className="material-symbols-outlined text-amber-500">dock</span>
                 محتوى الفوتر
              </h2>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1 flex justify-between">
                       <span>عنوان الفوتر</span>
                       <span className="text-amber-500/50 text-[10px]">{settings.footerHeading?.length || 0}/255</span>
                    </label>
                    <input 
                      type="text" 
                      value={settings.footerHeading || ''}
                      onChange={e => setSettings({...settings, footerHeading: e.target.value})}
                      placeholder="جاهزون لتحويل مساحتك إلى تحفة فنية" 
                      className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-amber-500 font-body text-xs md:text-base" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1">وصف الفوتر</label>
                    <textarea 
                      rows={3} 
                      value={settings.footerDescription || ''}
                      onChange={e => setSettings({...settings, footerDescription: e.target.value})}
                      placeholder="تواصل معنا الآن عبر واتساب أو اتصل مباشرة واحصل على استشارة مجانية لمشروعك" 
                      className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-amber-500 font-body text-xs md:text-base leading-relaxed" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1">نص زر التواصل</label>
                    <input 
                      type="text" 
                      value={settings.footerCtaText || ''}
                      onChange={e => setSettings({...settings, footerCtaText: e.target.value})}
                      placeholder="تواصل معنا الآن عبر واتساب أو اتصل مباشرة واحصل على استشارة مجانية لمشروعك" 
                      className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-amber-500 font-body text-xs md:text-base" 
                    />
                 </div>
              </div>
           </div>

           {/* Section: SEO & Search Engines */}
           <div className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-surface-container-low border border-outline-variant/10 shadow-sm relative overflow-hidden">
              <h2 className="text-base md:text-3xl font-headline font-bold mb-8 md:mb-12 flex items-center gap-3">
                 <span className="material-symbols-outlined text-emerald-500">search_insights</span>
                 إعدادات محركات البحث (SEO)
              </h2>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1 flex justify-between">
                       <span>عنوان الموقع (Meta Title)</span>
                       <span className="text-primary/50 text-[10px]">{settings.seo?.metaTitle?.length || 0}/60</span>
                    </label>
                    <input 
                      type="text" 
                      value={settings.seo?.metaTitle || ''}
                      onChange={e => setSettings({...settings, seo: {...settings.seo, metaTitle: e.target.value}})}
                      placeholder="العروي للديكورات - بديل رخام وخشب في محايل عسير" 
                      className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-primary font-body text-xs md:text-base" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1 flex justify-between">
                       <span>وصف الموقع العام (Meta Description)</span>
                       <span className="text-primary/50 text-[10px]">{settings.seo?.metaDescription?.length || 0}/160</span>
                    </label>
                    <textarea 
                      rows={3} 
                      value={settings.seo?.metaDescription || ''}
                      onChange={e => setSettings({...settings, seo: {...settings.seo, metaDescription: e.target.value}})}
                      placeholder="نحن رائدون في تقديم حلول الديكورات الحديثة..." 
                      className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-primary font-body text-xs leading-relaxed" 
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/10 space-y-3">
                       <h4 className="text-[11px] font-bold uppercase tracking-widest text-emerald-500">Google Analytics</h4>
                       <input 
                         type="text" 
                         value={settings.analytics?.googleAnalyticsId || ''}
                         onChange={e => setSettings({...settings, analytics: {...settings.analytics, googleAnalyticsId: e.target.value}})}
                         placeholder="G-XXXXXXXXXX" 
                         className="w-full bg-surface-container-highest border border-outline-variant/10 rounded-xl p-3 outline-none focus:border-emerald-500 font-body text-xs text-left" dir="ltr" 
                       />
                    </div>
                    <div className="p-5 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/10 space-y-3">
                       <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary">Search Console</h4>
                       <input 
                         type="text" 
                         value={settings.analytics?.searchConsoleCode || ''}
                         onChange={e => setSettings({...settings, analytics: {...settings.analytics, searchConsoleCode: e.target.value}})}
                         placeholder="Verification Code" 
                         className="w-full bg-surface-container-highest border border-outline-variant/10 rounded-xl p-3 outline-none focus:border-primary font-body text-xs text-left" dir="ltr" 
                       />
                    </div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[80px]"></div>
           </div>
        </div>

      </div>
    </div>
  );
}
