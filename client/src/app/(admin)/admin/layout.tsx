import { LayoutDashboard, Users, Settings, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col md:flex-row pb-20 md:pb-0" dir="rtl">
      
      {/* ════ SIDEBAR (Desktop) ════ */}
      <aside className="hidden md:flex flex-col w-72 bg-white/[0.02] border-l border-white/[0.05] p-6 h-screen sticky top-0">
        <div className="flex items-center gap-3 text-violet-400 font-black text-xl mb-12">
          <Settings size={28} />
          <span>لوحة التحكم</span>
        </div>
        
        <nav className="flex flex-col gap-3">
          <Link href="/admin" className="flex items-center gap-3 p-4 rounded-xl hover:bg-violet-600/10 hover:text-violet-300 transition-colors text-white/70 font-medium">
            <LayoutDashboard size={22} />
            <span>نظرة عامة</span>
          </Link>
          <Link href="/admin/projects" className="flex items-center gap-3 p-4 rounded-xl hover:bg-violet-600/10 hover:text-violet-300 transition-colors text-white/70 font-medium">
            <PlusCircle size={22} />
            <span>إضافة أعمال</span>
          </Link>
          <Link href="/admin/leads" className="flex items-center gap-3 p-4 rounded-xl hover:bg-violet-600/10 hover:text-violet-300 transition-colors text-white/70 font-medium">
            <Users size={22} />
            <span>طلبات التواصل</span>
            <span className="bg-violet-500 text-white px-2.5 py-0.5 rounded-lg text-xs font-bold mr-auto">جديد</span>
          </Link>
        </nav>
      </aside>

      {/* ════ BOTTOM NAV (Mobile) ════ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0a0a0f]/90 backdrop-blur-xl border-t border-white/[0.05] z-50 flex items-center justify-around px-2">
        <Link href="/admin" className="flex flex-col items-center gap-1.5 p-2 text-white/60 hover:text-violet-400 transition-colors">
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </Link>
        <Link href="/admin/projects" className="flex flex-col items-center gap-1.5 p-2 text-white/60 hover:text-violet-400 transition-colors">
          <PlusCircle size={24} />
          <span className="text-[10px] font-bold">أعمال</span>
        </Link>
        <Link href="/admin/leads" className="relative flex flex-col items-center gap-1.5 p-2 text-white/60 hover:text-violet-400 transition-colors">
          <Users size={24} />
          <span className="text-[10px] font-bold">الطلبات</span>
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
        </Link>
      </nav>

      {/* ════ MAIN CONTENT ════ */}
      <main className="flex-1 w-full p-4 md:p-10 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
