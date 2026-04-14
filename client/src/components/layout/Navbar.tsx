'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-6 md:py-5"
    >
      <nav
        className="max-w-4xl mx-auto flex items-center justify-between rounded-2xl px-5 py-3 md:px-8 md:py-3.5"
        style={{
          background: 'rgba(10, 10, 20, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <Link href="/" className="font-black text-base md:text-lg text-white" style={{ textDecoration: 'none' }}>
          ديكور<span className="text-violet-400">مِكس</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link
            href="/"
            className="text-white/80 hover:text-white text-sm font-medium transition-colors hidden sm:block"
            style={{ textDecoration: 'none' }}
          >
            الرئيسية
          </Link>
          <Link
            href="/#gallery"
            className="text-white/50 hover:text-white text-sm font-medium transition-colors hidden sm:block"
            style={{ textDecoration: 'none' }}
          >
            أعمالنا
          </Link>
          <Link
            href="/#contact"
            className="text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300"
            style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
            }}
          >
            تواصل معنا
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
