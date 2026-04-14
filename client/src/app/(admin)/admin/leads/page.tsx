'use client';

import { useEffect, useState } from 'react';
import { Phone, MessageCircle, Clock, MapPin, MousePointerClick } from 'lucide-react';

type ClickEvent = {
  id: string;
  type: 'WHATSAPP' | 'PHONE';
  source: string;
  device: string;
  location: string;
  createdAt: string;
};

export default function LeadsPage() {
  const [events, setEvents] = useState<ClickEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Mocking analytics data (Click Tracking)
  useEffect(() => {
    setTimeout(() => {
      setEvents([
        { id: '1', type: 'WHATSAPP', source: 'القسم الرئيسي (Hero)', device: 'هاتف ذكي (Apple)', location: 'الرياض، السعودية', createdAt: 'منذ 5 دقائق' },
        { id: '2', type: 'PHONE', source: 'الفوتر (تواصل معنا)', device: 'هاتف ذكي (Android)', location: 'جدة، السعودية', createdAt: 'منذ ساعتين' },
        { id: '3', type: 'WHATSAPP', source: 'شريط التنقل (Navbar)', device: 'كمبيوتر مكتبي (Windows)', location: 'الرياض، السعودية', createdAt: 'منذ 3 ساعات' },
        { id: '4', type: 'WHATSAPP', source: 'القسم الرئيسي (Hero)', device: 'هاتف ذكي (Apple)', location: 'غير معروف', createdAt: 'منذ يوم' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-6 md:space-y-10 py-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">
          نقرات التواصل الحية
        </h1>
        <p className="text-white/50 text-sm md:text-base font-medium">سجل بمحاولات تواصل العملاء عبر أزرار واتساب والاتصال الخلوي.</p>
      </div>

      <div className="w-full">
        {loading ? (
          <div className="w-full h-40 flex flex-col items-center justify-center gap-4 border border-white/5 bg-white/[0.01] rounded-[2rem]">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/50 font-bold text-sm">جاري جلب الإحصائيات...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="w-full h-40 flex items-center justify-center border border-white/5 bg-white/[0.01] rounded-[2rem]">
            <p className="text-white/50 font-bold">لم يتم تسجيل أي نقرات حتى الآن.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 md:p-6 bg-white/[0.02] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] hover:bg-white/[0.04] transition-colors group"
              >
                {/* Info block */}
                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <div className="flex items-center justify-between md:justify-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${event.type === 'WHATSAPP' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {event.type === 'WHATSAPP' ? <MessageCircle size={20} /> : <Phone size={20} />}
                      </div>
                      <h3 className="font-bold text-lg md:text-xl text-white">
                        {event.type === 'WHATSAPP' ? 'محاولة تواصل واتساب' : 'محاولة اتصال مباشر'}
                      </h3>
                    </div>
                    {event.createdAt.includes('دقائق') || event.createdAt.includes('ساعتين') || event.createdAt.includes('ساعات') ? (
                      <span className="flex items-center gap-1.5 bg-violet-500/10 text-violet-400 px-3 py-1 rounded-lg text-xs font-bold border border-violet-500/20 md:hidden">
                        نشط اليوم
                      </span>
                    ) : null}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/60 text-sm font-medium mt-2">
                    <div className="flex items-center gap-2">
                      <MousePointerClick size={14} className="text-violet-400" />
                      <span>{event.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-violet-400" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-violet-400" />
                      <span className="text-white/40">{event.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Badges Desktop */}
                <div className="hidden md:flex w-full md:w-auto items-center justify-end mt-2 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                  <span className="bg-white/5 text-white/60 px-4 py-2 rounded-xl text-sm font-bold">
                    {event.device}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
