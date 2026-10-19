'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import {
  HiOutlineDownload,
  HiOutlineLightBulb,
  HiOutlineMail,
  HiOutlineUser,
} from 'react-icons/hi';
import { useToast } from '@/app/hooks/useToast';
import { trackResumeDownload } from '@/app/lib/analytics';
import { SOCIAL_LINKS, SocialIconName } from '@/app/lib/config';

// Icons match the navbar's About and Projects links
const buttonClass =
  'group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold transition-all duration-200 focus-visible:ring-4 focus-visible:ring-accent/40 focus-visible:outline-none active:scale-[0.98]';

const secondaryButtonClass = `${buttonClass} border border-gray-300 bg-white text-gray-900 hover:border-accent hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700/60 dark:text-gray-200 dark:hover:border-accent dark:hover:bg-gray-700`;

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

      <div className="relative z-10 flex flex-col items-center justify-center text-center xl:pl-56">
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
          I&apos;m a software engineer with 5+ years building full-stack
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
          className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center"
        >
          <a
            href="/Tyler_Grant_Resume.pdf"
            download="Tyler_Grant_Resume.pdf"
            onClick={handleDownload}
            className={`${buttonClass} bg-accent-fill shadow-accent/25 hover:bg-accent-fill-hover hover:shadow-accent/40 text-gray-900 shadow-lg`}
          >
            <HiOutlineDownload className="h-5 w-5 transition-transform duration-200 group-hover:translate-y-0.5" />
            Download Resume
          </a>
          <Link href="/about" className={secondaryButtonClass}>
            <HiOutlineUser className="text-accent h-5 w-5" />
            Get to Know Me
          </Link>
          <Link href="/projects" className={secondaryButtonClass}>
            <HiOutlineLightBulb className="text-accent h-5 w-5" />
            Personal Projects
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
