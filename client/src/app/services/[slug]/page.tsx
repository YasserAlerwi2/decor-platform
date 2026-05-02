'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface ServiceImage { id: number; url: string; title: string; }

export default function ServiceGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) || '';

  const [service, setService] = useState<{ title: string; desc: string; heroImg: string } | null>(null);
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(data => {
        const svc = data.services?.find((s: any) => s.slug === slug);
        if (svc) {
          setService({ title: svc.name, desc: svc.description || '', heroImg: svc.heroImageUrl || '/images/lux_marble_wall.png' });
        }
        // Get gallery images linked to this service's category
        const categoryId = svc?.category?.id || svc?.categoryId;
        const svcImages = data.galleryImages
          ?.filter((img: any) => {
            // Match by serviceId or by shared category
            if (img.serviceId === svc?.id) return true;
            if (categoryId && img.categories?.some((c: any) => c.id === categoryId)) return true;
            return false;
          })
          .map((img: any) => ({ id: img.id, url: img.imageUrl, title: img.title || 'صورة' })) || [];
        // Remove duplicates
        const uniqueImages = svcImages.filter((img: ServiceImage, idx: number, arr: ServiceImage[]) => arr.findIndex(i => i.id === img.id) === idx);
        // If no images found, use the hero image
        if (uniqueImages.length === 0 && svc) {
          uniqueImages.push({ id: 1, url: svc.heroImageUrl || '/images/lux_marble_wall.png', title: svc.name });
        }
        setImages(uniqueImages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (activeIdx !== null) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeIdx]);

  const nextImg = (e?: React.MouseEvent) => { e?.stopPropagation(); setActiveIdx(p => p !== null ? (p + 1) % images.length : null); };
  const prevImg = (e?: React.MouseEvent) => { e?.stopPropagation(); setActiveIdx(p => p !== null ? (p - 1 + images.length) % images.length : null); };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span></div>;

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-surface p-6 gap-6">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant">error_outline</span>
        <h1 className="text-3xl font-headline font-bold">الخدمة غير متوفرة</h1>
        <Link href="/" className="bg-primary text-on-primary px-8 py-3 rounded-full font-body font-bold">العودة للرئيسية</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-on-surface selection:bg-primary/30">
      <div className="h-16 md:h-24"></div>

      <section className="relative h-[45vh] md:h-[60vh] flex items-end overflow-hidden">
        <img src={service.heroImg} className="absolute inset-0 w-full h-full object-cover" alt={service.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-20">
           <button onClick={() => router.back()} className="flex items-center gap-2 mb-8 text-primary hover:text-secondary group transition-all w-fit bg-black/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
             <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
             <span className="font-body font-bold text-lg">العودة</span>
           </button>
           <h1 className="text-4xl md:text-8xl font-headline font-bold mb-4 text-white drop-shadow-2xl">{service.title}</h1>
           <p className="text-white/80 text-lg md:text-2xl font-body max-w-2xl drop-shadow-lg">{service.desc}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="flex items-center gap-3 mb-12">
            <span className="w-10 h-[2px] bg-primary"></span>
            <span className="font-headline font-bold text-xl uppercase tracking-widest text-primary">الأعمال المنفذة</span>
        </div>
        {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {images.map((img, idx) => (
            <motion.div key={img.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} onClick={() => setActiveIdx(idx)} className="relative aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl bg-surface-container-low border border-outline-variant/10 transition-all hover:-translate-y-2">
              <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                 <p className="text-white font-body font-bold text-sm md:text-lg">{img.title}</p>
                 <span className="material-symbols-outlined text-white mt-2">zoom_in</span>
              </div>
            </motion.div>
          ))}
        </div>
        ) : (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-4 block">photo_library</span>
            <p className="font-body text-lg">لا توجد صور لهذه الخدمة حالياً</p>
          </div>
        )}
      </section>

      <AnimatePresence>
        {mounted && activeIdx !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setActiveIdx(null)} />
            <div className="absolute top-8 right-8 z-[10002]">
               <button onClick={() => setActiveIdx(null)} className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white active:scale-90 hover:bg-error transition-all">
                 <span className="material-symbols-outlined text-3xl">close</span>
               </button>
            </div>
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-8" onClick={(e) => e.stopPropagation()}>
               <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-[10002] hidden md:flex">
                  <button onClick={prevImg} className="pointer-events-auto w-16 h-16 rounded-full bg-white/5 hover:bg-primary backdrop-blur-lg flex items-center justify-center text-white transition-all"><span className="material-symbols-outlined text-4xl">chevron_right</span></button>
                  <button onClick={nextImg} className="pointer-events-auto w-16 h-16 rounded-full bg-white/5 hover:bg-primary backdrop-blur-lg flex items-center justify-center text-white transition-all"><span className="material-symbols-outlined text-4xl">chevron_left</span></button>
               </div>
               <motion.div key={activeIdx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 w-full flex items-center justify-center min-h-0 relative px-4">
                 <TransformWrapper initialScale={1} centerOnInit>
                   <TransformComponent wrapperClass="!w-full !h-full">
                      <img src={images[activeIdx].url} alt={images[activeIdx].title} className="max-h-[70vh] md:max-h-[75vh] w-auto h-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl object-contain select-none pointer-events-none" />
                   </TransformComponent>
                 </TransformWrapper>
               </motion.div>
               <div className="text-center space-y-4 pb-12 z-[10002]">
                  <h2 className="text-white font-headline font-bold text-2xl md:text-4xl px-6">{images[activeIdx].title}</h2>
                  <div className="flex md:hidden items-center justify-center gap-8 bg-white/10 backdrop-blur-2xl px-12 py-5 rounded-full border border-white/10 shadow-2xl mx-auto w-fit">
                    <button onClick={prevImg} className="text-white"><span className="material-symbols-outlined text-4xl">chevron_right</span></button>
                    <span className="text-white/60 font-body">{activeIdx + 1} / {images.length}</span>
                    <button onClick={nextImg} className="text-white"><span className="material-symbols-outlined text-4xl">chevron_left</span></button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
