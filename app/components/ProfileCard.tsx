'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';
import { useToast } from '@/app/hooks/useToast';
import { trackResumeDownload } from '@/app/lib/analytics';
import { SOCIAL_LINKS, SocialIconName } from '@/app/lib/config';

// Pre-generated blur data URL for profile image (10x10 placeholder)
const profileBlurDataURL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgcI/8QAIhAAAQMEAQUBAAAAAAAAAAAAAQIDBAAFBhEHEiExQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAcEQACAgIDAAAAAAAAAAAAAAABAgADBBESIUH/2gAMAwEAAhEDEEA/AJJxnmV6wq8SLlZoUB2W7H8Il3FCy4hHWFKSgKCe4B76/NVu2c4X6Db4sNuzWVLMdpDKVeEcJ6QBv59d6rNKVTiyyzKA3zOWmjFeUx2f/9k=';

export default function ProfileCard() {
  const { success } = useToast();

  const handleDownload = () => {
    trackResumeDownload();
    success('Thank you for downloading my resume!');
  };

  // Map icon names to components (inside component to avoid hydration issues)
  const iconMap: Record<SocialIconName, React.ReactNode> = {
    github: <BsGithub className="text-xl" />,
    linkedin: <BsLinkedin className="text-xl" />,
    email: <HiOutlineMail className="text-xl" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto mt-4 overflow-hidden rounded-3xl border border-gray-300 bg-white p-8 shadow-md xl:min-h-[280px] xl:py-12 dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg"
    >
      {/* Profile Image - centered on mobile, absolute left on md+ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative mx-auto mb-6 w-fit xl:absolute xl:top-1/2 xl:left-8 xl:mb-0 xl:-translate-y-1/2"
      >
        <div className="relative h-40 w-48 overflow-hidden rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-105 xl:h-[200px] xl:w-[200px]">
          <Image
            src="/profile.jpg"
            alt="Profile Picture of Tyler"
            fill
            priority
            sizes="(min-width: 1280px) 200px, 192px"
            placeholder="blur"
            blurDataURL={profileBlurDataURL}
            className="object-cover object-top"
          />
        </div>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl text-4xl font-bold text-gray-900 dark:text-gray-200"
        >
          Hi, I&apos;m <span className="text-accent">Tyler Grant</span>. Nice to
          meet you!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 max-w-xl text-xl text-gray-700 dark:text-gray-400"
        >
          I&apos;m a software engineer with 4+ years building full-stack
          products, from a real-time ASL interpretation platform to checkout
          systems and cloud services for brands like Owala and BlenderBottle. I
          love automating the boring stuff and picking up new tech.
        </motion.p>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 flex gap-4"
        >
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="hover:bg-accent-fill flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 transition-all duration-300 hover:scale-110 hover:text-gray-900 active:scale-95 dark:bg-gray-700 dark:text-gray-400"
            >
              {iconMap[link.iconName]}
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 flex flex-wrap justify-center gap-4"
        >
          <a
            href="/Tyler_Grant_Resume.pdf"
            download="Tyler_Grant_Resume.pdf"
            onClick={handleDownload}
            className="bg-accent-fill shadow-accent/25 hover:bg-accent-fill-hover hover:shadow-accent/40 inline-block rounded-full px-8 py-4 text-lg font-bold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Download Resume
          </a>
          <Link
            href="/about"
            className="hover:border-accent/50 inline-block rounded-full border border-gray-300 bg-white px-8 py-4 text-lg font-bold text-gray-900 transition-all duration-300 hover:scale-105 hover:bg-gray-100 active:scale-95 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Learn More About Me
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
