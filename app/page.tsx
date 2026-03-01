import ProfileCard from './components/ProfileCard';
import TechnicalSkills from './components/TechnicalSkills';
import WorkExperienceCard from './components/WorkExperienceCard';
import CTAFooter from './components/CTAFooter';
import PageTransition from './components/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <div className="relative min-h-screen">
        <main className="mx-6 pt-4 pb-16 text-gray-900 lg:mx-25 dark:text-gray-200">
          <ProfileCard />
          <TechnicalSkills />
          <WorkExperienceCard />
          <CTAFooter />
        </main>
      </div>
    </PageTransition>
  );
}
