'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.user?.username) setUsername(d.user.username); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    router.push('/login');
    router.refresh();
  };

  const menuItems = [
    { label: "لوحة التحكم", icon: "dashboard", href: "/admin" },
    { label: "الفئات", icon: "category", href: "/admin/categories" },
    { label: "إدارة الخدمات", icon: "design_services", href: "/admin/services" },
    { label: "معرض الصور", icon: "photo_library", href: "/admin/gallery" },
    { label: "طلبات التواصل", icon: "contact_support", href: "/admin/leads" },
    { label: "إعدادات الموقع", icon: "settings", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row pb-28 md:pb-0" dir="rtl">
      
      {/* ════ SIDEBAR (Desktop) ════ */}
      <aside className="hidden md:flex flex-col w-80 bg-surface-container-low/40 backdrop-blur-3xl border-l border-outline-variant/10 p-8 h-screen sticky top-0 shadow-2xl z-40">
        <div className="flex items-center gap-4 mb-14 px-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-2xl">architecture</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-xl tracking-tight">إدارة العروي</span>
            <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Super Admin</span>
          </div>
        </div>
        
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`relative flex items-center gap-4 py-4 px-6 rounded-2xl group transition-all duration-300 ${
                  isActive 
                  ? "bg-primary text-on-primary shadow-xl shadow-primary/20" 
                  : "hover:bg-primary/10 text-on-surface-variant hover:text-primary"
                }`}
              >
                <span className={`material-symbols-outlined transition-transform group-hover:scale-110 ${isActive ? "" : "text-primary/60"}`}>
                  {item.icon}
                </span>
                <span className="font-body font-bold text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
           <Link href="/" className="flex items-center gap-3 p-4 rounded-2xl border border-outline-variant/10 hover:bg-surface-container-highest transition-all group font-body text-sm font-bold">
              <span className="material-symbols-outlined text-primary group-hover:-translate-x-1 transition-transform">input</span>
              زيارة الموقع
           </Link>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 p-4 rounded-2xl bg-error/5 text-error hover:bg-error hover:text-white transition-all font-body text-sm font-bold group"
           >
              <span className="material-symbols-outlined">logout</span>
              تسجيل الخروج
           </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen relative">
        
        {/* ════ ADMIN HEADER ════ */}
        <header className="sticky top-0 z-30 w-full px-5 py-4 md:px-12 md:py-6 bg-background/60 backdrop-blur-2xl border-b border-outline-variant/10 flex items-center justify-between">
           <div className="md:hidden flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                 <span className="material-symbols-outlined text-base">architecture</span>
              </div>
              <span className="font-headline font-bold text-base">إدارة العروي</span>
           </div>

           <div className="hidden md:block">
              <h2 className="font-headline font-bold text-lg text-on-surface-variant">مرحباً، <span className="text-on-surface">{username || 'مستخدم'}</span></h2>
           </div>

           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/10">
                 <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px] uppercase">{username.slice(0, 2) || '--'}</div>
                 <span className="hidden md:block text-xs font-bold">{username}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="w-9 h-9 rounded-full bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-white transition-all"
              >
                 <span className="material-symbols-outlined text-xl">logout</span>
              </button>
           </div>
        </header>

        <main className="flex-1 w-full p-4 md:p-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <nav className="md:hidden fixed bottom-6 left-0 right-0 mx-auto flex justify-around items-center px-1 py-3 z-50 bg-surface-container-low/80 backdrop-blur-3xl w-[94%] rounded-[2rem] border border-outline-variant/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center rounded-2xl py-2 px-1 tap-highlight-transparent active:scale-95 transition-all ${
                isActive 
                  ? "text-on-primary bg-primary shadow-xl shadow-primary/30" 
                  : "text-on-surface-variant hover:bg-surface-variant/20"
              }`}
            >
              <span 
                className="material-symbols-outlined text-2xl" 
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="font-body text-[9px] font-bold mt-1 leading-none whitespace-nowrap text-center w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
