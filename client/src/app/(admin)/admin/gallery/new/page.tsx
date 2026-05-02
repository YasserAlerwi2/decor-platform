'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Category { id: number; name: string; }

interface StagedImage {
  id: string;
  file: File | null;
  preview: string;
  imageUrl: string;
  alt: string;
  title: string;
  categoryIds: number[];
}

export default function NewGalleryPhotosPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(d => setCategories(d)).catch(() => {});
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: StagedImage[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      file,
      preview: URL.createObjectURL(file),
      imageUrl: '',
      alt: '',
      title: '',
      categoryIds: []
    }));

    setStagedImages([...stagedImages, ...newImages]);
  };

  const updateImage = (id: string, field: keyof StagedImage, value: string) => {
    setStagedImages(stagedImages.map(img => 
      img.id === id ? { ...img, [field]: value } : img
    ));
  };

  const removeImage = (id: string) => {
    setStagedImages(stagedImages.filter(img => img.id !== id));
  };

  const handleSaveAll = async () => {
    if (stagedImages.length === 0) return;
    setSaving(true);

    try {
      // Upload all images first
      const uploadedImages = await Promise.all(
        stagedImages.map(async (img) => {
          if (!img.file) return null;

          const formData = new FormData();
          formData.append('file', img.file);
          formData.append('folder', 'gallery');
          formData.append('customName', img.title || 'gallery-image');

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const uploadData = await uploadRes.json();
          return {
            ...img,
            imageUrl: uploadData.url,
          };
        })
      );

      // Filter out failed uploads
      const validImages = uploadedImages.filter(Boolean);

      // Save to database
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          validImages.map(img => ({
            imageUrl: img!.imageUrl,
            title: img!.title || null,
            categoryIds: img!.categoryIds,
            seo: {
              altText: img!.alt || img!.title || '',
            },
          }))
        ),
      });

      if (res.ok) {
        router.push('/admin/gallery');
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-8 pb-32">
      {/* ════ TOP BAR ════ */}
      <div className="flex items-center justify-between gap-3 bg-surface-container-low/60 backdrop-blur-xl p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-outline-variant/10 shadow-sm sticky top-24 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
          <div>
            <h1 className="text-base md:text-3xl font-headline font-bold">رفع صور</h1>
            <p className="hidden md:block text-xs text-on-surface-variant font-body">تحسين الصور لمحركات البحث دفعة واحدة.</p>
          </div>
        </div>
        <button 
          onClick={handleSaveAll}
          disabled={saving || stagedImages.length === 0}
          className="bg-primary text-on-primary px-5 py-2.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xs md:text-sm font-body disabled:opacity-50"
        >
           {saving ? 'جاري الحفظ...' : `نشر الكل (${stagedImages.length})`}
        </button>
      </div>

      {/* ════ UPLOAD ZONE ════ */}
      <label 
        className="group border-2 border-dashed border-primary/20 bg-primary/5 p-6 md:p-16 rounded-[1.5rem] md:rounded-[3rem] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/10 transition-all text-center"
      >
         <input 
           type="file" 
           accept="image/*" 
           multiple 
           onChange={handleFileSelect}
           className="hidden" 
         />
         <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl md:text-5xl">add_a_photo</span>
         </div>
         <div className="space-y-1">
            <h3 className="font-headline font-bold text-sm md:text-2xl">اضغط هنا لإضافة صور</h3>
            <p className="text-[10px] md:text-sm text-on-surface-variant font-body">يمكنك اختيار أكثر من صورة معاً</p>
         </div>
      </label>

      {/* ════ STAGED IMAGES LIST ════ */}
      <div className="space-y-4">
         <div className="flex items-center justify-between px-2">
            <h2 className="text-sm md:text-xl font-headline font-bold">تعديل البيانات ({stagedImages.length})</h2>
            <span className="text-[10px] text-on-surface-variant italic font-body">يفضل ملء كافة النصوص للـ SEO</span>
         </div>
         
         <div className="flex flex-col gap-3 md:gap-6">
           <AnimatePresence initial={false}>
             {stagedImages.map((img) => (
                <motion.div 
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-surface-container-low/80 p-3 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-outline-variant/10 shadow-sm flex flex-col md:flex-row gap-4 md:gap-6 relative group border-r-4 border-r-primary"
                >
                   {/* Preview - More compact on mobile */}
                   <div className="w-full md:w-40 aspect-video md:aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-inner border border-outline-variant/10 shrink-0">
                      <img src={img.preview} className="w-full h-full object-cover" alt="Preview" />
                   </div>

                   {/* SEO Form - Compact inputs */}
                   <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                         <label className="text-[9px] md:text-[10px] font-bold text-primary px-1">نص الأرشفة (Alt Text)</label>
                         <input 
                           type="text" 
                           value={img.alt}
                           onChange={(e) => updateImage(img.id, 'alt', e.target.value)}
                           placeholder="مثلاً: بديل رخام في مجلس" 
                           className="w-full bg-surface-container-highest/40 border border-outline-variant/10 rounded-lg md:rounded-xl p-2.5 md:p-3 outline-none focus:border-primary font-body text-[10px] md:text-xs" 
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] md:text-[10px] font-bold text-primary px-1">عنوان الصورة</label>
                         <input 
                           type="text" 
                           value={img.title}
                           onChange={(e) => updateImage(img.id, 'title', e.target.value)}
                           placeholder="اسم العمل الظاهر" 
                           className="w-full bg-surface-container-highest/40 border border-outline-variant/10 rounded-lg md:rounded-xl p-2.5 md:p-3 outline-none focus:border-primary font-body text-[10px] md:text-xs" 
                         />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                         <label className="text-[9px] md:text-[10px] font-bold text-primary px-1">الفئات</label>
                         <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                            {categories.map(cat => {
                              const selected = img.categoryIds.includes(cat.id);
                              return (
                               <button 
                                 key={cat.id} 
                                 type="button"
                                 onClick={() => {
                                   const newIds = selected ? img.categoryIds.filter((id: number) => id !== cat.id) : [...img.categoryIds, cat.id];
                                   setStagedImages(stagedImages.map(i => i.id === img.id ? { ...i, categoryIds: newIds } : i));
                                 }}
                                 className={`px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-bold whitespace-nowrap transition-all border ${selected ? "bg-primary text-on-primary border-primary shadow-sm" : "bg-surface-container-highest/60 text-on-surface-variant border-outline-variant/10 hover:bg-primary/5"}`}
                               >
                                  {cat.name}
                               </button>
                              );
                            })}
                         </div>
                      </div>
                   </div>

                   {/* Remove Button - Top right mobile */}
                   <button 
                     onClick={() => removeImage(img.id)}
                     className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-7 h-7 md:w-10 md:h-10 rounded-full bg-error text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all md:opacity-0 group-hover:opacity-100 z-10"
                   >
                      <span className="material-symbols-outlined text-sm md:text-xl">close</span>
                   </button>
                </motion.div>
             ))}
           </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
