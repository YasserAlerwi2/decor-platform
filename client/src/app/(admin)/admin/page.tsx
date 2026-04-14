import { ArrowUpRight, CheckCircle, TrendingUp, Users } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8 md:space-y-12 py-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">
          نظرة عامة
        </h1>
        <p className="text-white/50 text-sm md:text-base font-medium">مرحباً بك مجدداً! إليك ملخص لأداء المنصة.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group hover:borderColor-violet-500/30 transition-all">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all"></div>
          <p className="text-white/50 mb-4 text-sm font-bold flex items-center gap-2">
            <CheckCircle size={16} className="text-violet-400" /> إجمالي الأعمال المعروضة
          </p>
          <p className="text-4xl md:text-5xl font-black text-white">24</p>
        </div>

        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group hover:borderColor-violet-500/30 transition-all">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <p className="text-white/50 mb-4 text-sm font-bold flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" /> زيارات المعرض
          </p>
          <div className="flex items-end gap-3">
            <p className="text-4xl md:text-5xl font-black text-white">1,405</p>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg flex items-center mb-1">+12%</span>
          </div>
        </div>

        <div className="p-6 rounded-[2rem] bg-violet-600/10 border border-violet-500/20 relative overflow-hidden group shadow-[0_0_30px_rgba(124,58,237,0.1)]">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl group-hover:bg-violet-500/30 transition-all"></div>
          <p className="text-violet-300 mb-4 text-sm font-bold flex items-center gap-2">
            <Users size={16} /> نقرات التواصل المباشر
          </p>
          <div className="flex items-center justify-between">
            <p className="text-4xl md:text-5xl font-black text-white">18</p>
            <a href="/admin/leads" className="w-10 h-10 rounded-full bg-violet-500 hover:bg-violet-400 text-white flex items-center justify-center transition-colors">
              <ArrowUpRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
