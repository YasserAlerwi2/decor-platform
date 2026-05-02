'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    { label: "الرئيسية", icon: "home", href: "/" },
    { label: "خدماتنا", icon: "foundation", href: "/#services" },
    { label: "معرض الصور", icon: "photo_library", href: "/gallery" },
    { label: "اتصل بنا", icon: "chat", href: "#contact" },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-0 right-0 mx-auto flex justify-around items-center px-2 py-3 z-50 bg-surface-container-low/80 backdrop-blur-2xl w-[92%] rounded-[2rem] border border-outline-variant/30 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 tap-highlight-transparent active:scale-90 transition-all ${
              isActive 
                ? "text-on-secondary-fixed bg-secondary shadow-[0_0_20px_rgba(107,255,143,0.3)]" 
                : "text-on-surface-variant hover:bg-surface-variant/50"
            }`}
          >
            <span 
              className="material-symbols-outlined text-2xl" 
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-body text-[10px] font-bold mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
