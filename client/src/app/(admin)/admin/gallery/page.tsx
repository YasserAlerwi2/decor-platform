'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface CategoryItem { id: number; name: string; }

interface GalleryImage {
  id: number;
  imageUrl: string;
  title: string | null;
  categories: CategoryItem[];
  seo: {
    altText: string | null;
    titleTag: string | null;
  } | null;
}

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/gallery')
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(d => setCategories(d))
      .catch(() => {});
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;

    try {
      await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      setImages(images.filter(img => img.id !== id));
      setSelectedImage(null);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleSaveSeo = async () => {
    if (!selectedImage) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/gallery/${selectedImage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedImage.title,
          categoryIds: selectedImage.categories.map(c => c.id),
          seo: {
            altText: selectedImage.seo?.altText || '',
            titleTag: selectedImage.seo?.titleTag || '',
          },
        }),
      });
      setImages(images.map(img => img.id === selectedImage.id ? selectedImage : img));
      setSelectedImage(null);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-8 pb-32">
      {/* ════ COMPACT HEADER ════ */}
      <div className="flex items-center justify-between gap-3 bg-surface-container-low/60 backdrop-blur-xl p-4 md:p-10 rounded-[1.5rem] md:rounded-[3rem] border border-outline-variant/10 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
           <h1 className="text-lg md:text-5xl font-headline font-bold tracking-tight">إدارة الصور</h1>
           <p className="text-[9px] md:text-lg font-body text-on-surface-variant/70">تحكم بالصور وأرشفتها في محركات البحث.</p>
        </div>
        <Link 
          href="/admin/gallery/new"
          className="relative z-10 bg-primary text-on-primary px-5 py-2.5 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-[10px] md:text-base border border-white/10"
        >
           <span className="material-symbols-outlined text-sm md:text-2xl">add_a_photo</span>
           <span>إضافة</span>
        </Link>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-primary/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* ════ COMPACT GALLERY GRID ════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
        {images.map((img, idx) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`group relative aspect-square rounded-[1.2rem] md:rounded-[2.5rem] overflow-hidden border border-outline-variant/10 bg-surface-container-low shadow-sm cursor-pointer ${selectedImage?.id === img.id ? 'ring-2 md:ring-4 ring-primary ring-offset-2 scale-95' : ''}`}
            onClick={() => setSelectedImage(img)}
          >
            <img src={img.imageUrl} className="w-full h-full object-cover transition-transform duration-700" alt={img.seo?.altText || img.title || ''} />
            <div className="absolute inset-x-0 bottom-0 p-2 md:p-5 bg-gradient-to-t from-black/80 to-transparent">
               <p className="text-white font-body font-bold text-[8px] md:text-xs truncate">{img.title || 'بدون عنوان'}</p>
            </div>
            
            {/* Quick Delete Mobile Overlay */}
            <div 
              onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
              className={`absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity ${selectedImage?.id === img.id ? 'opacity-100' : ''}`}
            >
               <button className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-error/20 backdrop-blur-md text-error-container flex items-center justify-center hover:bg-error hover:text-white"><span className="material-symbols-outlined text-[10px] md:text-sm">delete</span></button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ════ IMAGE SEO EDITOR (Floating Panel on Mobile) ════ */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-24 md:bottom-12 mx-auto w-[92%] md:w-[500px] z-[60] bg-surface-container-low/95 backdrop-blur-3xl p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-outline-variant/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-4 md:space-y-6"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-3">
               <h3 className="font-headline font-bold text-xs md:text-xl">تعديل الـ SEO للصورة</h3>
               <button onClick={() => setSelectedImage(null)} className="text-on-surface-variant hover:text-error"><span className="material-symbols-outlined text-lg">close</span></button>
            </div>

            <div className="space-y-3">
               <div className="space-y-1">
                  <label className="text-[9px] font-bold text-primary px-1">النص البديل (Alt)</label>
                  <input 
                    type="text" 
                    value={selectedImage.seo?.altText || ''}
                    onChange={(e) => setSelectedImage({...selectedImage, seo: {...(selectedImage.seo || {altText: null, titleTag: null}), altText: e.target.value}})}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant/10 rounded-xl p-3 outline-none focus:border-primary font-body text-[10px] md:text-sm" 
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-[9px] font-bold text-primary px-1">العنوان (Title)</label>
                  <input 
                    type="text" 
                    value={selectedImage.title || ''}
                    onChange={(e) => setSelectedImage({...selectedImage, title: e.target.value})}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant/10 rounded-xl p-3 outline-none focus:border-primary font-body text-[10px] md:text-sm" 
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-[9px] font-bold text-primary px-1">الفئات</label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map(cat => {
                      const selected = selectedImage.categories.some(c => c.id === cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            const newCats = selected
                              ? selectedImage.categories.filter(c => c.id !== cat.id)
                              : [...selectedImage.categories, cat];
                            setSelectedImage({...selectedImage, categories: newCats});
                          }}
                          className={`px-3 py-1.5 rounded-full text-[9px] font-bold whitespace-nowrap transition-all border ${selected ? "bg-primary text-on-primary border-primary" : "bg-surface-container-highest/60 text-on-surface-variant border-outline-variant/10 hover:bg-primary/5"}`}
                        >{cat.name}</button>
                      );
                    })}
                  </div>
               </div>
            </div>

            <div className="flex gap-2">
               <button 
                 onClick={handleSaveSeo}
                 disabled={saving}
                 className="flex-1 bg-primary text-on-primary py-3 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-lg shadow-primary/20 text-xs md:text-sm disabled:opacity-50"
               >
                 {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
               </button>
               <button 
                 onClick={() => handleDelete(selectedImage.id)}
                 className="w-12 bg-error/10 text-error py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm hover:bg-error hover:text-white transition-all"
               >
                 <span className="material-symbols-outlined">delete</span>
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {selectedImage && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden" onClick={() => setSelectedImage(null)}></div>}
    </div>
  );
}
