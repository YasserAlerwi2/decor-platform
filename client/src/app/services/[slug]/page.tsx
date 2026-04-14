'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import SpaceBackground from '@/components/ui/SpaceBackground';
import SimpleFooterContact from '@/components/sections/SimpleFooterContact';

// Mock data per service
const serviceData: Record<string, { title: string; desc: string; images: { id: string; url: string; title: string }[] }> = {
  'marble': {
    title: 'بديل رخام',
    desc: 'تصاميم قوية وفخمة تحاكي الطبيعة',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop', title: 'رخام أسود مع عروق ذهبية' },
      { id: '2', url: 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6?q=80&w=2670&auto=format&fit=crop', title: 'رخام أبيض كلاسيكي للمجالس' },
      { id: '3', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop', title: 'بديل رخام للمداخل الفاخرة' }
    ]
  },
  'wpc': {
    title: 'بديل شيبورد (خشب)',
    desc: 'استكشف إبداعاتنا في تكسيات بديل الخشب والشيبورد',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2669&auto=format&fit=crop', title: 'جداريات شيبورد خشبية مدمجة' },
      { id: '2', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2670&auto=format&fit=crop', title: 'تكسية واجهات خشبية راقية' }
    ]
  },
  'tv-decor': {
    title: 'ديكورات شاشات',
    desc: 'احصل على خلفيات شاشات تدمج بين الإنارة وبديل الرخام',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2670&auto=format&fit=crop', title: 'خلفية شاشة مع إضاءة مخفية' }
    ]
  },
  'office-decor': {
    title: 'ديكورات مكاتب',
    desc: 'تصاميم مكاتب عملية وملهمة ترفع من الإنتاجية',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop', title: 'تكسية مكاتب مشتركة' }
    ]
  },
  'villa-decor': {
    title: 'ديكورات فلل',
    desc: 'فخامة القصور تجسدها تفاصيلنا',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1613490908578-83861fb16e45?q=80&w=2670&auto=format&fit=crop', title: 'مدخل فيلا بلمسات ديكورمِكس' }
    ]
  },
  'paints': {
    title: 'دهانات داخلية',
    desc: 'ألوان جذابة تواكب أحدث المعايير العالمية',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1562184552-997c461abbe6?q=80&w=2670&auto=format&fit=crop', title: 'دهان روشن سادة عصري' }
    ]
  }
};

export default function ServiceGalleryPage() {
  const params = useParams();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) || '';
  const service = serviceData[slug];

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <h1 className="text-2xl font-bold">الخدمة غير متوفرة</h1>
      </div>
    );
  }

  const images = service.images;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIdx !== null) setActiveIdx((prev) => (prev! + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIdx !== null) setActiveIdx((prev) => (prev! - 1 + images.length) % images.length);
  };

  return (
    <main className="relative min-h-screen pt-32 pb-40 px-4 md:px-8 overflow-hidden">
      <SpaceBackground />
      <div className="relative z-10">
      {/* Back button */}
      <Link 
        href="/#gallery" 
        className="mb-8 flex w-fit items-center gap-2 text-white/50 hover:text-white transition-colors"
      >
        <ChevronRight size={20} />
        <span>العودة للرئيسية</span>
      </Link>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16 text-center md:text-right">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4">{service.title}</h1>
        <p className="text-violet-300 text-lg md:text-2xl font-medium">{service.desc}</p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
        {images.map((img: { id: string; url: string; title: string }, idx: number) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setActiveIdx(idx)}
            className="group cursor-pointer aspect-square w-full rounded-[2rem] overflow-hidden relative border border-white/10 hover:border-violet-500/50 shadow-xl"
          >
            <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-black/60 backdrop-blur-md p-4 rounded-full text-white">
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox — fully portaled to document.body (only on client) */}
      {mounted && activeIdx !== null && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(12px)' }}>

          {/* Overlay click to close */}
          <div style={{ position: 'absolute', inset: 0 }} onClick={() => setActiveIdx(null)} />

          {/* Close Button */}
          <button
            onClick={() => setActiveIdx(null)}
            style={{ position: 'absolute', top: 20, right: 20, zIndex: 1, width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            <X size={22} />
          </button>

          {/* Prev Arrow */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => nextImage(e)}
                style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 1, width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronLeft size={26} />
              </button>
              <button
                onClick={(e) => prevImage(e)}
                style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 1, width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}

          {/* Caption */}
          <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1, textAlign: 'center', whiteSpace: 'nowrap' }}>
            <div style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', padding: '10px 20px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 500, margin: 0 }}>{images[activeIdx].title}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '4px 0 0' }}>{activeIdx + 1} من {images.length} · إصبعيك للتكبير</p>
            </div>
          </div>

          {/* Zoomable Image */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
            <TransformWrapper initialScale={1} minScale={0.5} maxScale={5} centerOnInit wheel={{ step: 0.15 }}>
              <TransformComponent>
                <img
                  src={images[activeIdx].url}
                  alt={images[activeIdx].title}
                  draggable={false}
                  style={{ maxHeight: '80vh', maxWidth: '88vw', objectFit: 'contain', borderRadius: 12, cursor: 'grab', userSelect: 'none' }}
                />
              </TransformComponent>
            </TransformWrapper>
          </div>

        </div>,
        document.body
      )}
      </div>

      {/* Simplified Contact Footer */}
      <SimpleFooterContact />
    </main>
  );
}
