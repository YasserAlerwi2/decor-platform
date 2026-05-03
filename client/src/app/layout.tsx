import type { Metadata } from 'next';
import './globals.css';
import BfcacheFix from '../components/ui/BfcacheFix';
import MobileViewport from '../components/ui/MobileViewport';
import ConditionalLayout from '../components/layout/ConditionalLayout';

export const metadata: Metadata = {
  title: 'العروي للديكورات',
  description: 'تصاميم داخلية عصرية، بدائل رخام، بدائل خشب، ديكورات شاشات، وخامات فاخرة ترتقي بأسلوب حياتك.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@160..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`bg-background text-on-surface antialiased min-h-screen selection:bg-primary-container selection:text-on-primary-container`}>
        <BfcacheFix />
        <MobileViewport />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
