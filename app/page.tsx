import ProfileCard from './components/ProfileCard';
import TechnicalSkills from './components/TechnicalSkills';
import WorkExperienceCard from './components/WorkExperienceCard';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-900">
      <main className="mb-6 px-6 pt-4 text-gray-200 md:px-24">
        <div className="">
          <ProfileCard />
          <TechnicalSkills />
          <WorkExperienceCard />
        </div>
      </main>
    </div>
  );
}
