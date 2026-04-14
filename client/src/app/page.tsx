import HeroGallery from '@/components/sections/HeroGallery';
import SpaceBackground from '@/components/ui/SpaceBackground';
import FooterContact from '@/components/sections/FooterContact';

export default function Home() {
  return (
    <main className="relative overflow-hidden w-full flex flex-col items-center justify-center">
      <SpaceBackground />
      <HeroGallery />
      <FooterContact />
    </main>
  );
}
