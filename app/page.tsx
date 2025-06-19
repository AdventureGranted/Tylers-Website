import React from "react";
import ProfileCard from "./components/ProfileCard";
import TechnicalSkills from "./components/TechnicalSkills";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="px-6 pt-4 md:px-24">
        <div className="">
          <ProfileCard />
          <TechnicalSkills />
        </div>
      </main>
    </div>
  );
}
