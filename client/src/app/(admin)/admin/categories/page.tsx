'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Category {
  id: number; name: string; slug: string; description: string | null;
  imageUrl: string | null; sortOrder: number;
  _count: { services: number; images: number };
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', imageUrl: '', sortOrder: 0 });

  useEffect(() => { fetchCats(); }, []);

  const fetchCats = () => {
    fetch('/api/admin/categories').then(r => r.json()).then(d => { setCategories(d); setLoading(false); }).catch(() => setLoading(false));
  };

  const genSlug = (n: string) => n.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, slug: form.slug || genSlug(form.name) };
    const res = editing
      ? await fetch('/api/admin/categories', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...payload }) })
      : await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) { setShowForm(false); setEditing(null); setForm({ name: '', slug: '', description: '', imageUrl: '', sortOrder: 0 }); fetchCats(); }
    else { const d = await res.json(); alert(d.error || 'خطأ'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('حذف الفئة؟')) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' }); fetchCats();
  };

  const startEdit = (c: Category) => {
    setEditing(c); setForm({ name: c.name, slug: c.slug, description: c.description || '', imageUrl: c.imageUrl || '', sortOrder: c.sortOrder }); setShowForm(true);
  };

  const cancelForm = () => { setShowForm(false); setEditing(null); setForm({ name: '', slug: '', description: '', imageUrl: '', sortOrder: 0 }); };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'categories');
    try { const res = await fetch('/api/upload', { method: 'POST', body: fd }); const data = await res.json(); if (data.url) setForm(f => ({ ...f, imageUrl: data.url })); } catch {}
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-headline font-bold text-on-surface">إدارة الفئات</h1>
          <p className="text-on-surface-variant font-body mt-2">أنشئ فئات لتنظيم الخدمات والصور</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', slug: '', description: '', imageUrl: '', sortOrder: 0 }); }} className="flex items-center gap-2 bg-primary hover:bg-primary-dim text-on-primary-fixed font-bold px-6 py-3 rounded-2xl transition-all active:scale-95">
          <span className="material-symbols-outlined">add</span>فئة جديدة
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-10 rounded-[2rem] bg-surface-container-low border border-outline-variant/10 shadow-lg">
          <h2 className="text-lg md:text-2xl font-headline font-bold mb-6">{editing ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant px-1">اسم الفئة</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: genSlug(e.target.value) })} placeholder="بديل الرخام" className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl p-4 outline-none focus:border-primary font-body" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant px-1">الرابط (Slug)</label>
                <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="marble-alternative" className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl p-4 outline-none focus:border-primary font-body text-left" dir="ltr" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant px-1">الوصف</label>
              <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="وصف مختصر..." className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl p-4 outline-none focus:border-primary font-body" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant px-1">صورة الفئة</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold px-4 py-3 rounded-xl cursor-pointer text-sm shrink-0">
                  <span className="material-symbols-outlined text-base">upload</span>رفع
                  <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
                </label>
                <input type="text" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="/uploads/categories/..." className="flex-1 bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl p-4 outline-none focus:border-primary font-body text-left text-sm" dir="ltr" />
              </div>
              {form.imageUrl && <img src={form.imageUrl} alt="preview" className="w-32 h-20 object-cover rounded-xl mt-2" />}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" className="bg-primary hover:bg-primary-dim text-on-primary-fixed font-bold px-8 py-3 rounded-2xl transition-all active:scale-95">{editing ? 'حفظ التعديلات' : 'إضافة الفئة'}</button>
              <button type="button" onClick={cancelForm} className="bg-surface-container-highest/30 text-on-surface-variant font-bold px-6 py-3 rounded-2xl transition-all">إلغاء</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">category</span>
          <p className="font-body text-lg text-on-surface-variant">لا توجد فئات بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <motion.div key={cat.id} layout className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/10 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} className="w-12 h-12 rounded-xl object-cover" /> : <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary">category</span></div>}
                  <div>
                    <h3 className="font-headline font-bold text-on-surface">{cat.name}</h3>
                    <span className="text-on-surface-variant text-xs font-body" dir="ltr">{cat.slug}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(cat)} className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                  <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center hover:bg-error/20 transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                </div>
              </div>
              {cat.description && <p className="text-on-surface-variant text-sm font-body mb-3 line-clamp-2">{cat.description}</p>}
              <div className="flex items-center gap-4 text-xs text-on-surface-variant font-body">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">design_services</span>{cat._count.services} خدمة</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">photo_library</span>{cat._count.images} صورة</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}