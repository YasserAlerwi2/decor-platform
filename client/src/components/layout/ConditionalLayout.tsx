'use client';

import { usePathname } from 'next/navigation';
import TopNav from './TopNav';
import Footer from './Footer';
import BottomNav from './BottomNav';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthOrAdmin = pathname?.startsWith('/admin') || pathname === '/login';

  if (isAuthOrAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <TopNav />
      {children}
      <Footer />
      <BottomNav />
    </>
  );
}
