'use client';
import React, { useEffect, useState } from 'react';
import ProfileCard from './components/ProfileCard';
import TechnicalSkills from './components/TechnicalSkills';
import WorkExperienceCard from './components/WorkExperienceCard';
import Image from 'next/image';

export default function Home() {
  const [showBubble, setShowBubble] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 20 && showBubble) {
        setShowBubble(false); // Hide on scroll down, never show again
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, showBubble]);

  return (
    <div className="relative min-h-screen bg-gray-900">
      <main className="mb-6 px-6 pt-4 text-gray-200 md:px-24">
        <div className="">
          <ProfileCard />
          <TechnicalSkills />
          <WorkExperienceCard />
        </div>
      </main>
      {/* Floating Profile + Chat Bubble */}
      <div
        className={`fixed right-6 bottom-6 z-50 flex items-end transition-opacity duration-300 ${
          showBubble ? 'opacity-100' : 'pointer-events-none opacity-0'
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
          <div className="absolute bottom-2 -left-56 flex items-center">
            <div className="relative animate-bounce rounded-2xl border-2 border-black bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-200 shadow-lg after:absolute after:top-1/2 after:right-[-16px] after:-translate-y-1/2 after:border-8 after:border-transparent after:border-l-yellow-300 after:content-['']">
              Site is under development
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
