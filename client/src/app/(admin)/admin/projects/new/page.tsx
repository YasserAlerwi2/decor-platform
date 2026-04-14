'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      alert('تم رفع العمل بنجاح!');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-amber-200 to-amber-600 mb-2">
          إضافة عمل جديد للطبيعة الساحرة
        </h1>
        <p className="text-neutral-400">ارفع أحدث أعمالك في بديل الرخام أو الدهانات ليراها العالم فوراً.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-neutral-950 p-8 rounded-3xl border border-neutral-800 space-y-6">
        
        {/* Image Upload Area */}
        <div className="border-2 border-dashed border-neutral-700 rounded-2xl p-12 flex flex-col items-center justify-center text-neutral-400 hover:bg-neutral-900 transition cursor-pointer group">
          <UploadCloud size={48} className="mb-4 text-neutral-600 group-hover:text-amber-500 transition" />
          <p className="text-lg">اسحب وأفلت الصورة الأساسية هنا</p>
          <p className="text-sm mt-2 opacity-70">أو اضغط لاختيار ملف (يفضل حجم أقل من 2 بيكسل WebP)</p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-neutral-300 mb-2 font-medium">عنوان العمل (مثال: جدارية بديل الرخام)</label>
            <input 
              required
              type="text" 
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition"
              placeholder="اكتب عنواناً جذاباً"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 mb-2 font-medium">التصنيف</label>
              <select className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 outline-none appearance-none cursor-pointer">
                <option>بديل الرخام</option>
                <option>دهانات داخلية</option>
                <option>تكسيات خشبية</option>
              </select>
            </div>
            <div>
              <label className="block text-neutral-300 mb-2 font-medium">الرابط المخصص (Slug)</label>
              <input 
                type="text" 
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition"
                placeholder="marble-wall-design"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 mb-2 font-medium">وصف فني للعمل</label>
            <textarea 
              rows={4}
              required
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition"
              placeholder="صف الإبداع في هذا العمل التفصيلي..."
            ></textarea>
          </div>
        </div>

        {/* Submit */}
        <button 
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-neutral-950 transition-all ${
            loading ? 'bg-neutral-600' : 'bg-amber-500 hover:bg-amber-400'
          }`}
        >
          {loading ? 'جاري الرندرة والرفع...' : 'نشر العمل'}
        </button>
      </form>
    </div>
  );
}
