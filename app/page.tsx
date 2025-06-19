import React from "react";
import ProfileCard from "./components/ProfileCard";
import TechnicalSkills from "./components/TechnicalSkills";
import WorkExperienceCard from "./components/WorkExperienceCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="px-6 pt-4 md:px-24 text-gray-200">
        <div className="">
          <ProfileCard />
          <TechnicalSkills />
          <WorkExperienceCard />
        </div>
      </main>
    </div>
  );
}
