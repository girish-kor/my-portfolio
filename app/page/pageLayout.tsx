import { useEffect, useState } from 'react';
import { Cursor } from '~/components/cursor';
import { BorderBox } from '../components/ui/border-box';
import { CountSection } from './CountSection';
import { HeroSection } from './HeroSection';
import { ProfileSection } from './ProfileSection';
import { ProjectSection } from './ProjectSection';
import { SkillsSection } from './SkillsSection';
import { StatusSection } from './StatusSection';

export function Layout() {
  const [zoomOut, setZoomOut] = useState(false);

  useEffect(() => {
    const getScale = () => {
      if (typeof window === 'undefined') return 1;
      const vv: any = (window as any).visualViewport;
      return vv && typeof vv.scale === 'number' ? vv.scale : window.devicePixelRatio || 1;
    };

    const isPhoneViewport = () => {
      if (typeof window === 'undefined') return false;
      if (window.matchMedia) {
        try {
          return window.matchMedia('(max-width: 768px)').matches;
        } catch (e) {}
      }
      const vv: any = (window as any).visualViewport;
      const width =
        vv && typeof vv.width === 'number'
          ? vv.width
          : window.innerWidth || document.documentElement.clientWidth || Infinity;
      return width <= 768;
    };

    const check = () => {
      if (isPhoneViewport()) {
        setZoomOut(false);
        return;
      }

      const scale = getScale();
      // ✅ FIXED: Zoom out means scale < 1
      setZoomOut(scale < 1);
    };

    check();
    window.addEventListener('resize', check);
    if ((window as any).visualViewport) {
      (window as any).visualViewport.addEventListener('resize', check);
    }
    return () => {
      window.removeEventListener('resize', check);
      if ((window as any).visualViewport) {
        (window as any).visualViewport.removeEventListener('resize', check);
      }
    };
  }, []);

  return (
    <main
      className={`flex flex-col justify-center items-center min-h-screen cursor-none transition-transform duration-300 ${
        zoomOut ? 'scale-90 origin-center' : ''
      }`}
    >
      <Cursor />
      <div className="grid gap-6 w-full max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-5 gap-6">
          <BorderBox className="col-span-4">
            <HeroSection />
          </BorderBox>
          <BorderBox className="col-span-1 flex justify-center items-center h-full">
            <CountSection />
          </BorderBox>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-5 gap-6">
          <BorderBox className="md:col-span-1">
            <SkillsSection />
          </BorderBox>
          <div className="md:col-span-2 grid grid-rows-4 gap-6">
            <BorderBox className="row-span-3">
              <ProfileSection />
            </BorderBox>
            <BorderBox className="row-span-1">
              <StatusSection />
            </BorderBox>
          </div>
          <BorderBox className="md:col-span-2">
            <ProjectSection />
          </BorderBox>
        </div>
      </div>
    </main>
  );
}
