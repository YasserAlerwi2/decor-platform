'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  category: string;
}

const defaultImages: GalleryImage[] = [
  { id: 1, url: '/images/lux_marble_wall.png', title: 'رخام أسود مع عروق ذهبية', category: 'marble' },
  { id: 2, url: '/images/elegant_wood_panels.png', title: 'جدارية شيبورد خشبية', category: 'wood' },
  { id: 3, url: '/images/parquet_floor.png', title: 'باركيه رمادي عصري', category: 'parquet' },
  { id: 4, url: '/images/modern_tv_unit.png', title: 'خلفية شاشة سينمائية', category: 'tv-unit' },
];

export default function HorizontalGallery() {
  const [allImages, setAllImages] = useState<GalleryImage[]>(defaultImages);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(data => {
        if (data.galleryImages && data.galleryImages.length > 0) {
          const mapped: GalleryImage[] = data.galleryImages.map((img: any) => ({
            id: img.id,
            url: img.imageUrl,
            title: img.title || 'صورة',
            category: img.category || 'general',
          }));
          setAllImages(mapped);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeIdx !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeIdx]);

  const nextImg = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev !== null ? (prev + 1) % allImages.length : null));
  };
  
  const prevImg = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev !== null ? (prev - 1 + allImages.length) % allImages.length : null));
  };

  if (!mounted) return null;

  const bentoImages = allImages.slice(0, 4);

  return (
    <section id="gallery" className="px-6 py-8 md:py-12 flex flex-col gap-6 md:gap-14 overflow-hidden relative">
      <div className="flex items-end justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-secondary font-bold text-sm md:text-base mb-2">
            <span className="material-symbols-outlined text-sm">photo_library</span>
            <span>معرض الصور</span>
          </div>
          <h2 className="font-headline font-bold text-2xl md:text-5xl text-on-surface">إلهام بلا حدود</h2>
          <p className="font-body text-sm md:text-lg text-on-surface-variant mt-2 max-w-xl hidden md:block">تصفح مجموعة مختارة من أرقى أعمالنا المنفذة بدقة وإتقان.</p>
        </div>
        <Link
          href="/gallery"
          className="hidden md:flex items-center gap-2 bg-surface-container-low hover:bg-surface-variant text-on-surface font-bold py-3 px-6 rounded-full transition-colors"
        >
          رؤية كل الصور
          <span className="material-symbols-outlined">arrow_left_alt</span>
        </Link>
        <Link href="/gallery" className="md:hidden text-secondary">
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>

      {/* Desktop: Bento Grid */}
      <div className="hidden md:grid grid-cols-4 gap-4 auto-rows-[220px]">
        {bentoImages.map((img, idx) => {
          const isLarge = idx === 0;
          const gridClass = isLarge ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1';
          return (
            <motion.div
              layoutId={`h-img-${img.id}`}
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setActiveIdx(idx)}
              className={`relative rounded-[2rem] overflow-hidden group shadow-xl cursor-pointer bg-surface-container-low ${gridClass}`}
            >
              <img
                src={img.url}
                alt={img.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <p className="text-white font-headline font-bold text-base lg:text-xl">{img.title}</p>
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mt-3">
                  <span className="material-symbols-outlined text-base">zoom_in</span>
                </div>
              </div>
            </motion.div>
          );
        })}
        {bentoImages.length >= 1 && (
          <Link
            href="/gallery"
            className="col-span-1 row-span-1 rounded-[2rem] bg-surface-container-highest/50 flex flex-col items-center justify-center gap-3 group hover:bg-primary/10 transition-colors border border-dashed border-outline-variant/40"
          >
            <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">arrow_outward</span>
            </div>
            <span className="font-body font-bold text-on-surface text-sm">المزيد</span>
          </Link>
        )}
      </div>

      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden -mx-6">
        <div className="flex overflow-x-auto gap-3 px-6 pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory">
          {allImages.map((img, idx) => (
            <motion.div
              layoutId={`h-img-mobile-${img.id}`}
              key={img.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setActiveIdx(idx)}
              className="relative shrink-0 w-[220px] aspect-[4/5] rounded-[1.5rem] overflow-hidden snap-center shadow-lg cursor-pointer bg-surface-container-low"
            >
              <img
                src={img.url}
                alt={img.title}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white font-body font-bold text-xs truncate">{img.title}</p>
              </div>
            </motion.div>
          ))}
          <Link
            href="/gallery"
            className="shrink-0 w-[160px] aspect-[4/5] rounded-[1.5rem] bg-surface-container-highest/50 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 border border-dashed border-outline-variant/40"
          >
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg">arrow_outward</span>
            </div>
            <span className="font-body font-bold text-on-surface text-xs">المزيد</span>
          </Link>
        </div>
      </div>

      {/* Lightbox Implementation */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4"
          >
            <div className="absolute inset-0" onClick={() => setActiveIdx(null)} />
            <div className="absolute top-6 right-6 z-[10002] flex items-center gap-4">
               <button onClick={() => setActiveIdx(null)} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-95 hover:bg-error transition-all"><span className="material-symbols-outlined text-3xl">close</span></button>
            </div>

            <div className="relative w-full h-full flex flex-col items-center justify-center gap-8" onClick={(e) => e.stopPropagation()}>
               <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-[10002] hidden md:flex">
                  <button onClick={nextImg} className="pointer-events-auto w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-all"><span className="material-symbols-outlined text-4xl">chevron_left</span></button>
                  <button onClick={prevImg} className="pointer-events-auto w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-all"><span className="material-symbols-outlined text-4xl">chevron_right</span></button>
               </div>

               <motion.div key={activeIdx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 w-full flex items-center justify-center min-h-0 relative">
                 <TransformWrapper initialScale={1} centerOnInit>
                   <TransformComponent wrapperClass="!w-full !h-full">
                      <img src={allImages[activeIdx].url} alt={allImages[activeIdx].title} className="max-h-[70vh] w-auto h-auto rounded-[2rem] shadow-2xl object-contain select-none pointer-events-none" />
                   </TransformComponent>
                 </TransformWrapper>
               </motion.div>
               
               <div className="text-center space-y-4 pb-12 z-[10002]">
                  <h2 className="text-white font-headline font-bold text-xl md:text-3xl px-6">{allImages[activeIdx].title}</h2>
                  <div className="flex md:hidden items-center justify-center gap-8 bg-white/10 backdrop-blur-xl px-12 py-5 rounded-full mx-auto w-fit border border-white/10">
                    <button onClick={nextImg} className="text-white"><span className="material-symbols-outlined text-4xl">chevron_left</span></button>
                    <span className="text-white/60 font-body ">{activeIdx + 1} / {allImages.length}</span>
                    <button onClick={prevImg} className="text-white"><span className="material-symbols-outlined text-4xl">chevron_right</span></button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
