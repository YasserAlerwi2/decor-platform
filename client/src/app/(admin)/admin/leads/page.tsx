'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ClickStats {
  total: number;
  whatsapp: number;
  phone: number;
  today: number;
  thisWeek: number;
}

interface RecentClick {
  id: number;
  clickType: 'whatsapp' | 'phone';
  sourcePage: string | null;
  sourceLabel: string | null;
  deviceType: 'mobile' | 'tablet' | 'desktop' | null;
  clickedAt: string;
}

export default function LeadsPage() {
  const [stats, setStats] = useState<ClickStats>({ total: 0, whatsapp: 0, phone: 0, today: 0, thisWeek: 0 });
  const [recentClicks, setRecentClicks] = useState<RecentClick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/track-click')
      .then(res => res.json())
      .then(data => {
        setStats({
          total: data.total,
          whatsapp: data.whatsapp,
          phone: data.phone,
          today: data.today,
          thisWeek: data.thisWeek,
        });
        setRecentClicks(data.recent);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Format time ago in Arabic
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const clicked = new Date(date);
    const diffMs = now.getTime() - clicked.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${diffDays} يوم`;
  };
  return (
    <div className="space-y-4 md:space-y-8 pb-32">
      {/* ════ HEADER ════ */}
      <div className="flex items-center justify-between gap-3 bg-surface-container-low/60 backdrop-blur-xl p-5 md:p-10 rounded-[1.5rem] md:rounded-[3rem] border border-outline-variant/10 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
           <h1 className="text-lg md:text-5xl font-headline font-bold">إحصائيات التواصل</h1>
           <p className="text-[9px] md:text-lg font-body text-on-surface-variant/70">
              عدد الضغطات على أزرار الاتصال والواتساب في الموقع
           </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-emerald-500/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* ════ STATS GRID ════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {/* Total */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 p-5 md:p-10 rounded-[2rem] bg-surface-container-low border border-outline-variant/10 shadow-sm flex flex-col gap-2"
        >
           <span className="text-[9px] md:text-sm font-bold uppercase tracking-widest text-on-surface-variant">إجمالي النقرات</span>
           <span className="text-5xl md:text-7xl font-headline font-bold text-on-surface">{stats.total}</span>
           <span className="text-[9px] font-body text-on-surface-variant/50">منذ بداية التتبع</span>
        </motion.div>

        {/* WhatsApp */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="p-5 md:p-10 rounded-[2rem] bg-surface-container-low border border-emerald-500/20 shadow-sm flex flex-col gap-2"
        >
           <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500 text-lg">chat</span>
              <span className="text-[9px] md:text-sm font-bold text-emerald-500">واتساب</span>
           </div>
           <span className="text-3xl md:text-5xl font-headline font-bold text-on-surface">{stats.whatsapp}</span>
           <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.total > 0 ? (stats.whatsapp / stats.total) * 100 : 0}%` }}></div>
           </div>
        </motion.div>

        {/* Phone */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-5 md:p-10 rounded-[2rem] bg-surface-container-low border border-primary/20 shadow-sm flex flex-col gap-2"
        >
           <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">phone</span>
              <span className="text-[9px] md:text-sm font-bold text-primary">اتصال</span>
           </div>
           <span className="text-3xl md:text-5xl font-headline font-bold text-on-surface">{stats.phone}</span>
           <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${stats.total > 0 ? (stats.phone / stats.total) * 100 : 0}%` }}></div>
           </div>
        </motion.div>
      </div>

      {/* Quick Numbers Row */}
      <div className="grid grid-cols-2 gap-3">
         <div className="p-4 md:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10 flex items-center gap-4">
            <span className="material-symbols-outlined text-amber-500 text-2xl">today</span>
            <div>
               <p className="text-[9px] text-on-surface-variant">اليوم</p>
               <p className="text-2xl font-headline font-bold">{stats.today}</p>
            </div>
         </div>
         <div className="p-4 md:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10 flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-2xl">date_range</span>
            <div>
               <p className="text-[9px] text-on-surface-variant">هذا الأسبوع</p>
               <p className="text-2xl font-headline font-bold">{stats.thisWeek}</p>
            </div>
         </div>
      </div>

      {/* ════ RECENT CLICKS TABLE ════ */}
      <div className="bg-surface-container-low rounded-[2rem] border border-outline-variant/10 shadow-sm overflow-hidden">
         <div className="p-5 md:p-8 border-b border-outline-variant/10 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">history</span>
            <h2 className="font-headline font-bold text-sm md:text-xl">آخر النقرات</h2>
         </div>
         <div className="divide-y divide-outline-variant/10">
            {recentClicks.map((click) => (
               <div key={click.id} className="flex items-center gap-3 md:gap-6 p-4 md:p-6 hover:bg-surface-container-highest/20 transition-all">
                  {/* Icon */}
                  <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${click.clickType === 'whatsapp' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                     <span className="material-symbols-outlined text-lg">{click.clickType === 'whatsapp' ? 'chat' : 'phone'}</span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                     <p className="text-[10px] md:text-sm font-bold truncate">{click.sourcePage || 'الصفحة الرئيسية'}</p>
                     <p className="text-[8px] md:text-xs text-on-surface-variant">{click.deviceType === 'mobile' ? 'جوال' : click.deviceType === 'desktop' ? 'كمبيوتر' : 'تابلت'}</p>
                  </div>
                  {/* Badge */}
                  <span className={`hidden md:block px-3 py-1 rounded-full text-[9px] font-bold border ${click.clickType === 'whatsapp' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                     {click.clickType === 'whatsapp' ? 'واتساب' : 'اتصال'}
                  </span>
                  {/* Time */}
                  <span className="text-[8px] md:text-xs text-on-surface-variant/50 whitespace-nowrap">{formatTimeAgo(click.clickedAt)}</span>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
