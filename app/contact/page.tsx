'use client';

import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineChatAlt2 } from 'react-icons/hi';
import { BsTelephone, BsLinkedin, BsGithub } from 'react-icons/bs';
import ContactForm from '@/app/components/ContactForm';
import PageTransition from '@/app/components/PageTransition';
import { containerVariants, itemVariants } from '@/app/lib/animations';

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <HiOutlineMail className="text-3xl" />,
      label: 'Email',
      value: 'recruit.tyler.grant@gmail.com',
      href: 'mailto:recruit.tyler.grant@gmail.com',
    },
    {
      icon: <BsTelephone className="text-2xl" />,
      label: 'Phone',
      value: '(801) 608-4675',
      href: 'tel:8016084675',
    },
  ];

  const socialLinks = [
    {
      icon: <BsLinkedin className="text-2xl" />,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/tyler-james-grant/',
    },
    {
      icon: <BsGithub className="text-2xl" />,
      label: 'GitHub',
      href: 'https://github.com/tylerbb812',
    },
  ];

  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col items-center px-4 py-12 md:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-2xl md:max-w-4xl"
        >
          {/* Hero Section */}
          <motion.div
            variants={itemVariants}
            className="relative mb-10 text-center md:mb-14"
          >
            {/* Blurred gradient orbs */}
            <div className="pointer-events-none absolute -top-16 left-1/4 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -top-10 right-1/4 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl" />

            <div className="relative">
              <h1 className="mb-4 flex items-center justify-center gap-3 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl dark:text-gray-200">
                <HiOutlineChatAlt2 className="h-9 w-9 text-purple-500 md:h-11 md:w-11 dark:text-purple-400" />
                Get In Touch
              </h1>
              <div className="mx-auto mb-6 h-1 w-full max-w-xs rounded-full bg-gradient-to-r from-purple-500 to-yellow-300 md:max-w-sm" />
              <p className="text-lg text-gray-700 md:text-xl dark:text-gray-400">
                Feel free to reach out! I&apos;m always open to discussing new
                opportunities, projects, or just having a chat.
              </p>
            </div>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            variants={itemVariants}
            className="mb-8 grid gap-4 sm:grid-cols-2 md:mb-10 md:gap-6"
          >
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                className="group flex items-center gap-4 rounded-2xl border border-gray-300 bg-white p-6 shadow-md transition-all duration-300 hover:border-yellow-500/50 hover:shadow-lg md:gap-6 md:rounded-3xl md:p-8 dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg dark:hover:border-yellow-300/50"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gray-300 bg-white text-yellow-500 transition-colors group-hover:border-yellow-300 group-hover:bg-yellow-300 group-hover:text-gray-900 md:h-16 md:w-16 md:rounded-2xl md:text-4xl dark:border-gray-700 dark:bg-gray-700 dark:text-yellow-300">
                  {method.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-700 md:text-base dark:text-gray-400">
                    {method.label}
                  </p>
                  <p className="font-semibold text-gray-900 transition-colors group-hover:text-yellow-300 md:text-lg dark:text-gray-200">
                    {method.value}
                  </p>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="mb-8 rounded-2xl border border-gray-300 bg-white p-6 shadow-md md:mb-10 md:rounded-3xl md:p-10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg"
          >
            <h2 className="mb-2 text-center text-lg font-semibold text-gray-700 md:text-xl dark:text-gray-400">
              Connect With Me
            </h2>
            <div className="mx-auto mb-4 h-0.5 w-24 rounded-full bg-gradient-to-r from-purple-500 to-yellow-300 md:mb-6" />
            <div className="flex justify-center gap-4 md:gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 w-14 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-700 transition-all duration-300 hover:border-yellow-300 hover:bg-yellow-300 hover:text-gray-900 hover:shadow-lg md:h-16 md:w-16 md:rounded-2xl md:text-3xl dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <ContactForm />
          </motion.div>
        </motion.div>
      </main>
    </PageTransition>
  );
}
