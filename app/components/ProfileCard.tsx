'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';
import { useToast } from '@/app/hooks/useToast';
import { trackResumeDownload } from '@/app/lib/analytics';

// Pre-generated blur data URL for profile image (10x10 placeholder)
const profileBlurDataURL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgcI/8QAIhAAAQMEAQUBAAAAAAAAAAAAAQIDBAAFBhEHEiExQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAcEQACAgIDAAAAAAAAAAAAAAABAgADBBESIUH/2gAMAwEAAhEDEEA/AJJxnmV6wq8SLlZoUB2W7H8Il3FCy4hHWFKSgKCe4B76/NVu2c4X6Db4sNuzWVLMdpDKVeEcJ6QBv59d6rNKVTiyyzKA3zOWmjFeUx2f/9k=';

export default function ProfileCard() {
  const { success } = useToast();

  const handleDownload = () => {
    trackResumeDownload();
    success('Thank you for downloading my resume!');
  };

  const socialLinks = [
    {
      icon: <BsGithub className="text-xl" />,
      href: 'https://github.com/tylerbb812',
      label: 'GitHub',
    },
    {
      icon: <BsLinkedin className="text-xl" />,
      href: 'https://www.linkedin.com/in/tyler-james-grant/',
      label: 'LinkedIn',
    },
    {
      icon: <HiOutlineMail className="text-xl" />,
      href: 'mailto:recruit.tyler.grant@gmail.com',
      label: 'Email',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto mt-4 overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 xl:min-h-[280px] xl:py-12"
      style={{ boxShadow: 'var(--card-shadow)' }}
    >
      {/* Subtle gradient background decoration */}
      <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-yellow-300/10 blur-3xl" />

      {/* Profile Image - centered on mobile, absolute left on md+ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative mx-auto mb-6 w-fit xl:absolute xl:top-1/2 xl:left-8 xl:mb-0 xl:-translate-y-1/2"
      >
        {/* Glow effect behind image */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500 to-yellow-300 opacity-50 blur-xl" />
        <Image
          src="/profile.jpg"
          alt="Profile Picture of Tyler"
          width={200}
          height={200}
          priority
          placeholder="blur"
          blurDataURL={profileBlurDataURL}
          className="relative rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-105"
        />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl text-4xl font-bold text-[var(--text-primary)]"
        >
          Hi, I&apos;m{' '}
          <span className="text-yellow-500 dark:text-yellow-300">
            Tyler Grant
          </span>
          . Nice to meet you!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 max-w-xl text-xl text-[var(--text-secondary)]"
        >
          I&apos;m a passionate software engineer with experience in building
          modern, responsive websites and applications. I love learning new
          technologies and creating projects that make a difference.
        </motion.p>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 flex gap-4"
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--input-bg)] text-[var(--text-secondary)] transition-all duration-300 hover:scale-110 hover:bg-yellow-300 hover:text-gray-900"
            >
              {link.icon}
            </a>
          ))}
        </motion.div>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          href="/Tyler_Grant_Resume_2025.pdf"
          download
          onClick={handleDownload}
          className="mt-6 inline-block rounded-full bg-yellow-300 px-12 py-5 text-lg font-bold text-gray-900 shadow-lg shadow-yellow-300/25 transition-all duration-300 hover:scale-105 hover:bg-yellow-400 hover:shadow-yellow-300/40"
        >
          Download Resume
        </motion.a>
      </div>
    </motion.div>
  );
}
