import { ThemeSwitch } from '~/components/theme-switch';
import { BorderBox } from '../components/ui/border-box';
import { CountSection } from './CountSection';
import { HeroSection } from './HeroSection';
import { ProfileSection } from './ProfileSection';
import { ProjectSection } from './ProjectSection';
import { SkillsSection } from './SkillsSection';
import { StatusSection } from './StatusSection';

export function Layout() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen ">
      <div className="grid gap-6 p-6 w-full max-w-7xl">
        {/* Division 1 */}
        <div className="grid grid-cols-5 gap-6">
          <ThemeSwitch className="fixed top-0 right-0 " />
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
