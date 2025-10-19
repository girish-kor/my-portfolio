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
    // Determine the current page scale. Prefer visualViewport.scale when available.
    const getScale = () => {
      if (typeof window === 'undefined') return 1;
      // visualViewport.scale exists in modern browsers and reflects zoom; fallback to devicePixelRatio
      // when visualViewport isn't available.
      // Treat a scale of exactly 1 as "100%" and apply 90% visual zoom.
      // Note: devicePixelRatio is not a perfect proxy but works for common cases.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vv: any = (window as any).visualViewport;
      return vv && typeof vv.scale === 'number' ? vv.scale : window.devicePixelRatio || 1;
    };

    // Detect phone-sized viewports. Prefer matchMedia for reliability.
    const isPhoneViewport = () => {
      if (typeof window === 'undefined') return false;
      if (window.matchMedia) {
        try {
          return window.matchMedia('(max-width: 768px)').matches;
        } catch (e) {
          // fallthrough
        }
      }
      // Fallback to visualViewport or innerWidth
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vv: any = (window as any).visualViewport;
      const width =
        vv && typeof vv.width === 'number'
          ? vv.width
          : window.innerWidth || document.documentElement.clientWidth || Infinity;
      return width <= 768;
    };

    const check = () => {
      // If on a narrow viewport (phone), do not apply the zoom-out transform.
      if (isPhoneViewport()) {
        setZoomOut(false);
        return;
      }

      const scale = getScale();
      setZoomOut(scale === 1);
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
    // When zooming out apply a visual scale; transformOrigin keeps the layout centered.
    <main
      className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-black cursor-none"
      style={zoomOut ? { transform: 'scale(0.9)', transformOrigin: 'center' } : undefined}
    >
      <Cursor />
      <div className="grid gap-6 w-full max-w-7xl mx-auto p-4">
        {/* Division 1 */}
        <div className="grid grid-cols-5 gap-6">
          {/* Division 1 SECTION A */}
          <BorderBox className="col-span-4">
            <HeroSection />
          </BorderBox>
          {/* Division 1 SECTION B */}
          <BorderBox className="col-span-1  flex justify-center items-center h-full">
            <CountSection />
          </BorderBox>
        </div>
        {/* Division 2 */}
        <div className="grid sm:grid-cols-1 md:grid-cols-5 gap-6">
          {/* Division 2 SECTION A */}
          <BorderBox className="md:col-span-1">
            <SkillsSection />
          </BorderBox>
          {/* Division 2 SECTION B */}
          <div className="md:col-span-2 grid grid-rows-4 gap-6">
            {/* SECTION B-1 */}
            <BorderBox className="row-span-3">
              <ProfileSection />
            </BorderBox>
            {/* SECTION B-2 */}
            <BorderBox className="row-span-1">
              <StatusSection />
            </BorderBox>
          </div>
          {/* Division 2 SECTION C */}
          <BorderBox className="md:col-span-2 ">
            <ProjectSection />
          </BorderBox>
        </div>
      </div>
    </main>
  );
}
