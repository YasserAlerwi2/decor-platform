import type { Metadata } from 'next';
import { Alexandria } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import BfcacheFix from '@/components/ui/BfcacheFix';

const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ديكورمِكس | بديل الرخام والدهانات الداخلية الفاخرة',
  description: 'أرقى أعمال الديكور وبديل الرخام والدهانات الداخلية في الرياض.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${alexandria.className} bg-[#050505] text-white antialiased`}>
        <BfcacheFix />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
