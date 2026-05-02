'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface DashboardStats {
  galleryCount: number;
  servicesCount: number;
  totalServicesCount: number;
  contactClicksCount: number;
  whatsappClicksCount: number;
  recentClicks: number;
  visitsCount: number;
  siteName: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  const statCards = [
    { label: "الأعمال المنفذة", value: stats?.galleryCount ?? 0, icon: "photo_library", color: "text-primary", bg: "bg-primary/5", trend: `${stats?.totalServicesCount ?? 0} خدمة` },
    { label: "عدد الخدمات", value: stats?.totalServicesCount ?? 0, icon: "design_services", color: "text-secondary", bg: "bg-secondary/5", trend: `${stats?.servicesCount ?? 0} نشطة` },
    { label: "عدد الزيارات", value: stats?.visitsCount ?? 0, icon: "visibility", color: "text-emerald-500", bg: "bg-emerald-500/5", trend: `${stats?.contactClicksCount ?? 0} نقرة` },
    { label: "نقرات التواصل", value: stats?.contactClicksCount ?? 0, icon: "contact_phone", color: "text-blue-500", bg: "bg-blue-500/5", trend: `${stats?.whatsappClicksCount ?? 0} واتساب` },
  ];

  return (
    <div className="space-y-4 md:space-y-10 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-surface-container-low/40 backdrop-blur-xl p-5 md:p-12 rounded-[1.5rem] md:rounded-[3rem] border border-outline-variant/10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col gap-0.5">
          <h1 className="text-xl md:text-5xl font-headline font-bold text-on-surface tracking-tight">
            مرحباً، <span className="text-primary">ياسر</span> 👋
          </h1>
          <p className="text-on-surface-variant text-[10px] md:text-xl font-body">إليك ملخص أداء "العروي للديكورات" اليوم.</p>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-surface-container-low border border-outline-variant/10 shadow-sm"
          >
            <div className={`w-9 h-9 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-2 md:mb-6`}>
              <span className="material-symbols-outlined text-lg md:text-3xl">{stat.icon}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-on-surface-variant text-[9px] md:text-sm font-bold font-body">{stat.label}</span>
              <div className="flex items-baseline justify-between md:justify-start gap-2 md:gap-4">
                <span className="text-xl md:text-5xl font-headline font-bold text-on-surface tracking-tighter">{stat.value}</span>
                <span className={`text-[8px] md:text-[10px] font-bold ${stat.color === 'text-secondary' ? 'text-secondary bg-secondary/10' : 'text-primary bg-primary/10'} px-2 py-0.5 rounded-lg`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
         {/* Quick Actions */}
         <div className="p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-surface-container-low border border-outline-variant/10 shadow-sm space-y-4 md:space-y-8">
            <h3 className="font-headline font-bold text-sm md:text-2xl flex items-center gap-2 md:gap-3">
               <span className="material-symbols-outlined text-primary text-xl md:text-3xl">bolt</span>
               إجراءات سريعة
            </h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
               <Link 
                 href="/admin/services/new"
                 className="flex flex-col items-center gap-2 md:gap-4 p-4 md:p-8 rounded-xl md:rounded-[2rem] bg-surface-container-highest/30 border border-outline-variant/10 hover:border-primary/50 transition-all text-center group"
               >
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
                     <span className="material-symbols-outlined text-lg md:text-2xl">add_circle</span>
                  </div>
                  <span className="font-body font-bold text-[9px] md:text-sm">إضافة خدمة</span>
               </Link>
               <Link 
                 href="/admin/gallery/new"
                 className="flex flex-col items-center gap-2 md:gap-4 p-4 md:p-8 rounded-xl md:rounded-[2rem] bg-surface-container-highest/30 border border-outline-variant/10 hover:border-secondary/50 transition-all text-center group"
               >
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-all">
                     <span className="material-symbols-outlined text-lg md:text-2xl">add_a_photo</span>
                  </div>
                  <span className="font-body font-bold text-[9px] md:text-sm">رفع صور</span>
               </Link>
            </div>
         </div>

         {/* Compact Subtle Gallery Banner */}
         <div className="p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-surface-container-highest/20 border border-outline-variant/10 relative overflow-hidden flex flex-col justify-center min-h-[140px] md:min-h-[200px]">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 md:space-y-3">
                   <h3 className="font-headline font-bold text-sm md:text-3xl text-on-surface">معرض الأعمال</h3>
                   <p className="font-body text-on-surface-variant text-[9px] md:text-lg max-w-[200px] md:max-w-sm leading-tight">
                      حدث معرضك باستمرار لجذب المزيد من العملاء.
                   </p>
                </div>
                <Link 
                  href="/admin/gallery"
                  className="w-full md:w-auto px-6 py-3 md:px-10 md:py-4 bg-surface-container-low text-on-surface border border-outline-variant/20 rounded-xl md:rounded-2xl font-bold shadow-sm flex items-center justify-center gap-2 text-[10px] md:text-base hover:bg-surface-container-highest transition-all"
                >
                   دخول المعرض
                   <span className="material-symbols-outlined text-sm md:text-xl">arrow_back</span>
                </Link>
            </div>
            {/* Subtle Patterns instead of bright colors */}
            <div className="absolute -bottom-4 -left-4 w-16 h-16 md:w-32 md:h-32 bg-on-surface/5 rounded-full blur-2xl"></div>
            <div className="absolute top-0 right-0 w-24 h-24 md:w-48 md:h-48 border-[20px] md:border-[40px] border-on-surface/[0.02] rounded-full -translate-y-1/2 translate-x-1/2"></div>
         </div>
      </div>
    </div>
  );
}
