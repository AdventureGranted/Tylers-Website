'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ChatBubble() {
  const [showBubble, setShowBubble] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 20 && showBubble) {
        setShowBubble(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, showBubble]);

  return (
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
        <div className="absolute bottom-2 -left-56 flex items-center">
          <div className="relative animate-bounce rounded-2xl border-2 border-black bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-200 shadow-lg after:absolute after:top-1/2 after:right-[-16px] after:-translate-y-1/2 after:border-8 after:border-transparent after:border-l-yellow-300 after:content-['']">
            Site is under development
          </div>
        </div>
      </div>
    </div>
  );
}
