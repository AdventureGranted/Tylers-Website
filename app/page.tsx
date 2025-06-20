'use client';
import React, { useEffect, useState } from "react";
import ProfileCard from "./components/ProfileCard";
import TechnicalSkills from "./components/TechnicalSkills";
import WorkExperienceCard from "./components/WorkExperienceCard";
import Image from "next/image";

export default function Home() {
  const [showBubble, setShowBubble] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 20 && showBubble) {
        setShowBubble(false); // Hide on scroll down, never show again
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, showBubble]);

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <main className="px-6 pt-4 md:px-24 text-gray-200">
        <div className="">
          <ProfileCard />
          <TechnicalSkills />
          <WorkExperienceCard />
        </div>
      </main>
      {/* Floating Profile + Chat Bubble */}
      <div
        className={`fixed bottom-6 right-6 flex items-end z-50 transition-opacity duration-300 ${
          showBubble ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative">
          <Image
            src="/profile.jpg"
            alt="Profile Picture of Tyler"
            width={64}
            height={64}
            className="rounded-full border-4 border-black shadow-lg"
          />
          {/* Chat bubble */}
          <div className="absolute -left-56 bottom-2 flex items-center">
            <div className="bg-gray-900 text-gray-200 text-sm font-semibold px-4 py-2 rounded-2xl shadow-lg animate-bounce border-2 border-black relative after:content-[''] after:absolute after:top-1/2 after:right-[-16px] after:-translate-y-1/2 after:border-8 after:border-transparent after:border-l-yellow-300">
              Site is under development
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
