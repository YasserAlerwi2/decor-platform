'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface CategoryItem { id: number; name: string; slug: string; }

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  categories: CategoryItem[];
}

export default function GalleryPage() {
  const router = useRouter();
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Reset lightbox when category changes
  useEffect(() => { setActiveIdx(null); }, [activeCategory]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { 
    setMounted(true); 
  }, []);

  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(data => {
        if (data.galleryImages && data.galleryImages.length > 0) {
          const mapped: GalleryImage[] = data.galleryImages.map((img: any) => ({
            id: img.id,
            url: img.imageUrl,
            title: img.title || 'صورة',
            categories: img.categories || [],
          }));
          setAllImages(mapped);
        }
        if (data.categories) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (activeIdx !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeIdx]);

  const filteredImages = activeCategory ? allImages.filter(i => i.categories.some(c => c.id === activeCategory)) : allImages;

  const nextImg = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev !== null ? (prev + 1) % filteredImages.length : null));
  };
  
  const prevImg = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null));
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background text-on-surface pb-24 relative selection:bg-primary/30">
      {/* Space for the fixed header on mobile and desktop */}
      <div className="h-16 md:h-24"></div>

      {/* Premium Hero Header */}
      <section className="relative h-[40vh] md:h-[55vh] flex items-end overflow-hidden mb-16">
        <img 
          src="/images/lux_marble_wall.png" 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Gallery Hero" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-16">
           <button 
             onClick={() => router.back()}
             className="flex items-center gap-2 mb-8 text-primary hover:text-secondary group transition-all w-fit bg-black/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/10"
           >
             <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
             <span className="font-body font-bold text-lg">العودة</span>
           </button>
           <div className="space-y-4">
             <h1 className="text-4xl md:text-8xl font-headline font-bold tracking-tight text-white drop-shadow-2xl">معرض الصور</h1>
             <p className="text-white/80 text-lg md:text-2xl font-body max-w-2xl drop-shadow-md">
               استكشف الجمال واكتشف التفاصيل التي نصنعها في مشاريعنا المنفذة.
             </p>
           </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Statistics or Filters could go here */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-outline-variant/10">
           <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
              <span className="font-body font-bold text-on-surface-variant">جميع الأعمال ({(activeCategory ? allImages.filter(i => i.categories.some(c => c.id === activeCategory)) : allImages).length} صورة)</span>
           </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${activeCategory === null ? "bg-primary text-on-primary border-primary" : "bg-surface-container-highest/60 text-on-surface-variant border-outline-variant/10 hover:bg-primary/5"}`}
            >الكل</button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${activeCategory === cat.id ? "bg-primary text-on-primary border-primary" : "bg-surface-container-highest/60 text-on-surface-variant border-outline-variant/10 hover:bg-primary/5"}`}
              >{cat.name}</button>
            ))}
          </div>
        )}

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-8 space-y-4 md:space-y-8">
          {filteredImages.map((img, idx) => (
            <motion.div
              layoutId={`img-card-${img.id}`}
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => setActiveIdx(idx)}
              className="break-inside-avoid relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl bg-surface-container-low border border-outline-variant/10"
            >
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full object-cover transition-transform duration-1000 group-hover:scale-110 pointer-events-none" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                 <p className="text-white font-body font-bold text-sm">{img.title}</p>
                 <div className="mt-2 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <span className="material-symbols-outlined text-white text-xs">zoom_in</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Inline Lightbox (Safer than Portal for some builds) */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-12"
          >
            {/* Close Overlay */}
            <div className="absolute inset-0 z-0" onClick={() => setActiveIdx(null)} />

            {/* Top Toolbar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-[1001] pointer-events-none">
               <div className="bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white font-body text-sm pointer-events-auto">
                 {activeIdx + 1} / {filteredImages.length}
               </div>
               <button 
                 onClick={() => setActiveIdx(null)}
                 className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-error transition-all active:scale-90 pointer-events-auto"
               >
                 <span className="material-symbols-outlined text-3xl">close</span>
               </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex absolute inset-x-8 top-1/2 -translate-y-1/2 items-center justify-between z-[1001] pointer-events-none">
               <button 
                 onClick={nextImg}
                 className="pointer-events-auto w-16 h-16 rounded-full bg-white/5 hover:bg-primary backdrop-blur-lg flex items-center justify-center text-white transition-all active:scale-90 shadow-2xl"
               >
                 <span className="material-symbols-outlined text-4xl">chevron_left</span>
               </button>
               <button 
                 onClick={prevImg}
                 className="pointer-events-auto w-16 h-16 rounded-full bg-white/5 hover:bg-primary backdrop-blur-lg flex items-center justify-center text-white transition-all active:scale-90 shadow-2xl"
               >
                 <span className="material-symbols-outlined text-4xl">chevron_right</span>
               </button>
            </div>

            {/* Image Container */}
            <motion.div 
              key={activeIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-[1000] w-full max-w-5xl h-[60vh] md:h-[75vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
               <TransformWrapper initialScale={1} centerOnInit>
                 <TransformComponent wrapperClass="!w-full !h-full cursor-zoom-in">
                    <img
                      src={filteredImages[activeIdx].url} 
                      alt={filteredImages[activeIdx].title} 
                      className="max-h-full max-w-full rounded-2xl md:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] object-contain select-none pointer-events-none"
                    />
                 </TransformComponent>
               </TransformWrapper>
            </motion.div>

            {/* Bottom Info & Mobile Nav */}
            <div className="relative z-[1001] w-full max-w-2xl mt-10 md:mt-12 flex flex-col items-center gap-6 px-6">
               <h2 className="text-white font-headline font-bold text-xl md:text-3xl text-center leading-tight">
                 {filteredImages[activeIdx].title}
               </h2>

               {/* Mobile Control Bar */}
               <div className="flex md:hidden items-center gap-10 bg-white/10 backdrop-blur-2xl px-12 py-5 rounded-full border border-white/10 shadow-2xl">
                  <button onClick={nextImg} className="text-white active:scale-125 transition-transform"><span className="material-symbols-outlined text-4xl">chevron_left</span></button>
                  <div className="w-[1px] h-8 bg-white/20"></div>
                  <button onClick={prevImg} className="text-white active:scale-125 transition-transform"><span className="material-symbols-outlined text-4xl">chevron_right</span></button>
               </div>

               {/* Hint */}
               <p className="text-white/40 font-body text-xs md:text-sm">استخدم اصابعك للتكبير أو الأسهم للتنقل</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
