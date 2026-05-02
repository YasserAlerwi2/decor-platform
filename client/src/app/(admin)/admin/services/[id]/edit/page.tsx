'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';

interface ServiceData {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  heroImageUrl: string | null;
  status: 'published' | 'draft';
  categoryId: number | null;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
    keywords: string | null;
    imageAltText: string | null;
    imageTitleTag: string | null;
  } | null;
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'seo'>('content');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<{id: number; name: string}[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    heroImageUrl: '',
    status: 'published' as 'published' | 'draft',
    categoryId: null as number | null,
  });
  const [seoData, setSeoData] = useState({
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    imageAltText: '',
    imageTitleTag: '',
  });

  const tabs = [
    { id: 'content', label: 'المحتوى', icon: 'edit_square' },
    { id: 'media', label: 'الوسائط', icon: 'image' },
    { id: 'seo', label: 'الـ SEO', icon: 'search_insights' },
  ];

  // Fetch categories
  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(d => setCategories(d)).catch(() => {});
  }, []);

  // Fetch service data on mount
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/admin/services/${serviceId}`);
        const data: ServiceData = await res.json();

        setFormData({
          name: data.name,
          description: data.description || '',
          heroImageUrl: data.heroImageUrl || '',
          status: data.status,
          categoryId: data.categoryId,
        });

        if (data.seo) {
          setSeoData({
            metaTitle: data.seo.metaTitle || '',
            metaDescription: data.seo.metaDescription || '',
            keywords: data.seo.keywords || '',
            imageAltText: data.seo.imageAltText || '',
            imageTitleTag: data.seo.imageTitleTag || '',
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        router.push('/admin/services');
      }
    };

    fetchService();
  }, [serviceId, router]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'services');
      formDataUpload.append('serviceName', formData.name);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, heroImageUrl: data.url }));
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('يجب إدخال اسم الخدمة');
      return;
    }

    setSaving(true);
    try {
      const slug = generateSlug(formData.name);

      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug,
          description: formData.description,
          heroImageUrl: formData.heroImageUrl,
          status: formData.status,
          categoryId: formData.categoryId,
          seo: {
            metaTitle: seoData.metaTitle || formData.name,
            metaDescription: seoData.metaDescription,
            keywords: seoData.keywords,
            imageAltText: seoData.imageAltText,
            imageTitleTag: seoData.imageTitleTag,
          },
        }),
      });

      if (res.ok) {
        router.push('/admin/services');
      }
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
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 bg-surface-container-low/60 backdrop-blur-xl p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-surface-container-highest flex items-center justify-center text-on-surface hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-xl md:text-2xl">arrow_forward</span>
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-4xl font-headline font-bold leading-tight">تعديل الخدمة</h1>
            <p className="hidden md:block text-xs text-on-surface-variant font-body">تعديل بيانات الخدمة والـ SEO</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-primary text-on-primary px-5 py-2.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xs md:text-sm font-body disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'تحديث'}
        </button>
      </div>

      {/* TABS */}
      <div className="flex bg-surface-container-low/80 backdrop-blur-xl p-1 rounded-2xl border border-outline-variant/10 shadow-sm sticky top-24 z-20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-2 py-3 md:py-4 rounded-xl transition-all ${
              activeTab === tab.id ? "bg-primary text-on-primary shadow-md shadow-primary/10" : "text-on-surface-variant hover:bg-surface-container-highest/50"
            }`}
          >
            <span className="material-symbols-outlined text-lg md:text-xl">{tab.icon}</span>
            <span className="font-body font-bold text-[10px] md:text-base">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4 md:space-y-8"
        >
          {activeTab === 'content' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              <div className="md:col-span-2 p-5 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-surface-container-low border border-outline-variant/10 space-y-6 md:space-y-10">
                <div className="space-y-5 md:space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-primary px-1">اسم الخدمة</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="مثلاً: بديل الرخام الفاخر"
                      className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-primary transition-all font-body text-sm md:text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-primary px-1">وصف الخدمة</label>
                    <textarea
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="اشرح مميزات الخدمة..."
                      className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-primary transition-all font-body text-sm leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-surface-container-low border border-outline-variant/10 h-fit space-y-4">
                <h3 className="font-headline font-bold text-sm md:text-xl">خيارات النشر</h3>
                <div className="p-3 bg-surface-container-highest rounded-xl border border-outline-variant/10 space-y-2">
                  <span className="text-[10px] md:text-sm font-bold font-body">حالة الخدمة</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'published' | 'draft'})}
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl p-3 outline-none focus:border-primary transition-all font-body text-sm"
                  >
                    <option value="published">نشط</option>
                    <option value="draft">مسودة</option>
                  </select>
                </div>
                <div className="p-3 bg-surface-container-highest rounded-xl border border-outline-variant/10 space-y-2">
                  <span className="text-[10px] md:text-sm font-bold font-body">الفئة</span>
                  <select
                    value={formData.categoryId ?? ''}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value ? Number(e.target.value) : null})}
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl p-3 outline-none focus:border-primary transition-all font-body text-sm"
                  >
                    <option value="">بدون فئة</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-surface-container-low border border-outline-variant/10 space-y-6">
                <h2 className="text-lg md:text-2xl font-headline font-bold">صورة الخدمة</h2>
                <div className="aspect-video rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-3 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer relative overflow-hidden">
                  {formData.heroImageUrl ? (
                    <img src={formData.heroImageUrl} alt="Service" className="w-full h-full object-cover absolute inset-0" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-3xl md:text-5xl text-primary">cloud_upload</span>
                      <p className="font-body font-bold text-[10px] md:text-sm text-center px-4">
                        {uploading ? 'جاري الرفع...' : 'ارفع صورة رئيسية عالية الجودة'}
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-surface-container-low border border-outline-variant/10 space-y-6">
                <h2 className="text-lg md:text-2xl font-headline font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                  تحسين الصورة (SEO)
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1">نص بديل (Alt Text)</label>
                    <input
                      type="text"
                      value={seoData.imageAltText}
                      onChange={(e) => setSeoData({...seoData, imageAltText: e.target.value})}
                      placeholder="وصف لمحتوى الصورة..."
                      className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl p-4 outline-none focus:border-primary transition-all font-body text-[10px] md:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-on-surface-variant px-1">عنوان الصورة</label>
                    <input
                      type="text"
                      value={seoData.imageTitleTag}
                      onChange={(e) => setSeoData({...seoData, imageTitleTag: e.target.value})}
                      placeholder="يظهر عند الوقوف على الصورة"
                      className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl p-4 outline-none focus:border-primary transition-all font-body text-[10px] md:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
              <div className="lg:col-span-2 space-y-4 md:space-y-8">
                <div className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-surface-container-low border border-outline-variant/10 space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary">معاينة جوجل</h3>
                  <div className="bg-white p-4 md:p-6 rounded-xl shadow-inner border border-gray-100 flex flex-col gap-0.5 max-w-lg">
                    <span className="text-[10px] md:text-[12px] text-[#202124] font-body">www.alorwi.com &rsaquo; ...</span>
                    <span className="text-[14px] md:text-[18px] text-[#1a0dab] font-body truncate font-medium">
                      {seoData.metaTitle || formData.name || "عنوان البحث الاحترافي"}
                    </span>
                    <p className="text-[11px] md:text-[14px] text-[#4d5156] font-body line-clamp-2 leading-relaxed">
                      {seoData.metaDescription || formData.description?.substring(0, 160) || "وصف الخدمة الذي سيظهر في نتائج البحث..."}
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-surface-container-low border border-outline-variant/10 space-y-5 md:space-y-8">
                  <div className="space-y-4 md:space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] md:text-sm font-bold text-on-surface-variant flex justify-between">
                        <span>عنوان الـ SEO</span>
                        <span className="text-primary-dim">{seoData.metaTitle.length}/60</span>
                      </label>
                      <input
                        type="text"
                        value={seoData.metaTitle}
                        onChange={(e) => setSeoData({...seoData, metaTitle: e.target.value})}
                        placeholder="العنوان في نتائج البحث"
                        className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-primary transition-all font-body text-xs md:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] md:text-sm font-bold text-on-surface-variant flex justify-between">
                        <span>وصف الميتا</span>
                        <span className="text-primary-dim">{seoData.metaDescription.length}/160</span>
                      </label>
                      <textarea
                        rows={3}
                        value={seoData.metaDescription}
                        onChange={(e) => setSeoData({...seoData, metaDescription: e.target.value})}
                        placeholder="اكتب وصفاً مختصراً..."
                        className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-primary transition-all font-body text-xs md:text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-surface-container-low border border-outline-variant/10 h-fit space-y-4">
                <h3 className="font-headline font-bold text-sm md:text-lg">الكلمات الدلالية</h3>
                <textarea
                  value={seoData.keywords}
                  onChange={(e) => setSeoData({...seoData, keywords: e.target.value})}
                  placeholder="كلمات بحث منفصلة..."
                  className="w-full h-32 md:h-40 bg-surface-container-highest border border-outline-variant/20 rounded-xl p-4 outline-none focus:border-primary transition-all font-body text-[10px] md:text-sm"
                />
                <div className="p-3 bg-primary/5 rounded-xl text-[9px] md:text-xs font-medium text-primary leading-relaxed">
                  استخدم كلمات تدل على تخصصك ومنطقتك الجغرافية.
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
