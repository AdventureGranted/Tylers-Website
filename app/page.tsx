import ProfileCard from './components/ProfileCard';
import TechnicalSkills from './components/TechnicalSkills';
import WorkExperienceCard from './components/WorkExperienceCard';
import CTAFooter from './components/CTAFooter';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-900">
      <main className="mx-6 pt-4 pb-16 text-gray-200 lg:mx-25">
        <ProfileCard />
        <TechnicalSkills />
        <WorkExperienceCard />
        <CTAFooter />
      </main>
    </div>
  );
}
