'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Here we would call the Node.js Backend API: POST /api/leads
    // The node backend would then trigger GA4 Measurement Protocol / Ads CAPI.
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-neutral-950 pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Texts & Info */}
        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            دعنا نبني <span className="bg-clip-text text-transparent bg-gradient-to-l from-amber-200 to-amber-600">الفخامة</span> معاً
          </h1>
          <p className="text-xl text-neutral-400 font-light leading-relaxed">
            سواء كنت تفكر في تجديد مجلسك، أو تصميم واجهة ملكية ببديل الرخام، فريقنا الفني مستعد. اطلب تسعيرة مجانية اليوم.
          </p>

          <div className="space-y-6 pt-8">
            <div className="flex items-center gap-4 text-neutral-300">
              <div className="bg-neutral-900 p-4 rounded-full text-amber-500">
                <Phone size={24} />
              </div>
              <div className="text-lg">+966 50 123 4567</div>
            </div>
            <div className="flex items-center gap-4 text-neutral-300">
              <div className="bg-neutral-900 p-4 rounded-full text-amber-500">
                <Mail size={24} />
              </div>
              <div className="text-lg">luxury@decor-platform.com</div>
            </div>
            <div className="flex items-center gap-4 text-neutral-300">
              <div className="bg-neutral-900 p-4 rounded-full text-amber-500">
                <MapPin size={24} />
              </div>
              <div className="text-lg">الرياض، المملكة العربية السعودية</div>
            </div>
          </div>
        </div>

        {/* The Form */}
        <div className="bg-neutral-900 border border-neutral-800 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
          {submitted ? (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-4xl mb-4 text-center">✓</div>
              <h3 className="text-3xl font-bold text-white">تم استلام طلبك!</h3>
              <p className="text-neutral-400">سيتواصل معك مهندس الديكور الخاص بنا خلال 24 ساعة.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-neutral-400 mb-2">الاسم الكريم</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-amber-500 transition"
                  placeholder="مثال: أحمد عبد الله"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-2">رقم الجوال للتواصل (واتساب)</label>
                <input 
                  required
                  type="tel" 
                  dir="ltr"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-amber-500 transition text-right"
                  placeholder="+966 5X XXX XXXX"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-2">نوع الخدمة المطلوبة</label>
                <select className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-amber-500 outline-none appearance-none cursor-pointer">
                  <option>تركيب بديل الرخام</option>
                  <option>دهانات داخلية متطورة</option>
                  <option>استشارة وتصميم شامل</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 mb-2">تفاصيل إضافية عن مساحتك</label>
                <textarea 
                  rows={4}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-amber-500 transition"
                  placeholder="لدي صالة بمساحة 5x6 وأرغب في تنفيذ جدارية شاشة..."
                ></textarea>
              </div>
              <button 
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-neutral-950 text-lg transition-all ${
                  loading ? 'bg-neutral-600' : 'bg-amber-500 hover:bg-amber-400'
                }`}
              >
                {loading ? 'جاري الإرسال...' : 'اطلب التسعيرة الآن'}
              </button>
            </form>
          )}

          {/* Decorative Glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        </div>

      </div>
    </main>
  );
}
