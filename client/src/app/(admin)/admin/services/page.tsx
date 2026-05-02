'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
  id: number;
  name: string;
  slug: string;
  heroImageUrl: string | null;
  status: 'published' | 'draft';
  category: { id: number; name: string } | null;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
  } | null;
}

export default function ServicesAdminPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;

    try {
      await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-10 pb-32">
      {/* ════ COMPACT HEADER ════ */}
      <div className="flex items-center justify-between gap-3 bg-surface-container-low/60 backdrop-blur-xl p-4 md:p-10 rounded-[1.5rem] md:rounded-[3rem] border border-outline-variant/10 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
           <h1 className="text-lg md:text-5xl font-headline font-bold tracking-tight">إدارة الخدمات</h1>
           <p className="text-[9px] md:text-lg font-body text-on-surface-variant/70">تحكم بمحتوى الخدمات وتصدر نتائج البحث.</p>
        </div>
        <Link 
          href="/admin/services/new"
          className="relative z-10 bg-primary text-on-primary px-5 py-2.5 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-[10px] md:text-base border border-white/10"
        >
           <span className="material-symbols-outlined text-sm md:text-2xl">add</span>
           <span>إضافة</span>
        </Link>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-primary/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* ════ COMPACT SERVICES LIST ════ */}
      <div className="flex flex-col gap-3 md:gap-6">
        {services.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-surface-container-low/80 p-3 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-outline-variant/10 shadow-sm flex items-center gap-3 md:gap-6 hover:border-primary/30 transition-all cursor-pointer"
          >
            {/* Image - Smaller on mobile */}
            <div className="w-16 h-16 md:w-32 md:h-32 rounded-xl md:rounded-2xl overflow-hidden border border-outline-variant/10 shrink-0">
               <img src={service.heroImageUrl || '/images/placeholder.png'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={service.name} />
            </div>

            {/* Info - Streamlined */}
            <div className="flex-1 min-w-0 py-1">
               <div className="flex items-center justify-between mb-1 md:mb-3">
                  <h3 className="font-headline font-bold text-xs md:text-2xl truncate">{service.name}</h3>
                  <div className={`px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-bold border ${service.status === 'published' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-on-surface/5 text-on-surface-variant border-outline-variant/10'}`}>
                     {service.status === 'published' ? 'نشط' : 'مسودة'}
                  </div>
               </div>
               
               <div className="flex items-center gap-3 md:gap-6">
                  <div className="flex items-center gap-1">
                     <span className="material-symbols-outlined text-xs md:text-lg text-primary">search_insights</span>
                     <span className="text-[9px] md:text-sm text-on-surface-variant font-medium">SEO: {service.seo?.metaTitle ? 'ممتاز' : 'يحتاج تحسين'}</span>
                  </div>
                  {service.category && (
                    <div className="flex items-center gap-1">
                       <span className="material-symbols-outlined text-xs md:text-lg text-primary">category</span>
                       <span className="text-[9px] md:text-sm text-on-surface-variant font-medium">{service.category.name}</span>
                    </div>
                  )}
                  <div className="hidden md:flex items-center gap-1">
                     <span className="material-symbols-outlined text-lg text-on-surface-variant/40">link</span>
                     <span className="text-sm text-on-surface-variant/50">/{service.slug}</span>
                  </div>
               </div>
            </div>

            {/* Action Buttons - Compact */}
            <div className="flex flex-col md:flex-row gap-1.5 md:gap-3">
               <Link
                  href={`/admin/services/${service.id}/edit`}
                  className="w-7 h-7 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-surface-container-highest text-on-surface-variant flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <span className="material-symbols-outlined text-sm md:text-2xl">edit</span>
               </Link>
               <button
                  onClick={() => handleDelete(service.id)}
                  className="hidden md:flex w-12 h-12 rounded-xl bg-surface-container-highest text-on-surface-variant items-center justify-center hover:bg-error/10 hover:text-error transition-all"
                >
                  <span className="material-symbols-outlined text-2xl">delete</span>
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
