'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineCode,
} from 'react-icons/hi';
import { containerVariants, slideInLeft } from '@/app/lib/animations';
import { Card } from '@/app/components/ui/Card';
import { SectionHeader } from '@/app/components/ui/SectionHeader';

interface Experience {
  company: string;
  role: string;
  date: string;
  startDate: Date;
  endDate: Date | null;
  logo: string;
  logoAlt: string;
  bullets: string[];
  skills: string[];
  category?: 'engineering' | 'prior';
}

function calculateDuration(start: Date, end: Date | null): string {
  const endDate = end || new Date();
  const months =
    (endDate.getFullYear() - start.getFullYear()) * 12 +
    (endDate.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) return `${remainingMonths} mo`;
  if (remainingMonths === 0) return `${years} yr`;
  return `${years} yr ${remainingMonths} mo`;
}

function calculateTotalExperience(): string {
  const now = new Date();
  const start = new Date('2021-10-01'); // First software engineering role
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  return `${years}+`;
}

const experiences: Experience[] = [
  {
    company: 'Signos',
    role: 'Software Engineer',
    date: 'July 2025 - February 2026',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2026-02-01'),
    logo: '/signos.webp',
    logoAlt: 'Signos Logo',
    skills: [
      'Next.js',
      'React',
      'TypeScript',
      'Python',
      'FastAPI',
      'GraphQL',
      'PostHog',
      'Shopify',
      'Payload CMS',
      'MongoDB',
      'AWS',
    ],
    bullets: [
      'Led development of a Next.js/TypeScript e-commerce platform with Shopify Storefront API (GraphQL), delivering subscription flows, cart lifecycle management, discounts, and multi-project checkout',
      'Architected server-side feature flags and A/B testing with PostHog to optimize landing pages, pricing, and navigation conversion',
      'Contributed to a large-scale Python/FastAPI backend for a metabolic health platform, building Shopify webhooks, subscription billing integrations, and async pipelines processing ~250 glucose readings per user daily',
      'Developed CMS-driven landing pages with Payload CMS and a dual partner/consumer dashboard supporting subscriptions, health analytics, and 14+ locales',
    ],
  },
  {
    company: 'Sorenson Communications',
    role: 'Software Engineer',
    date: 'December 2022 - July 2025',
    startDate: new Date('2022-12-01'),
    endDate: new Date('2025-07-01'),
    logo: '/sorensonCommunications.jpg',
    logoAlt: 'Sorenson Communications Logo',
    skills: ['React', 'Node.js', 'AWS Lambda', 'DynamoDB', 'TypeScript'],
    bullets: [
      'Designed and deployed a full-stack, real-time ASL interpretation platform using React, Node.js, AWS (Lambda, DynamoDB), and Netlify',
      'Enabled in-store QR-based access to interpreters for deaf and hard-of-hearing users, enhancing accessibility in retail environments',
      'Implemented dynamic geofencing and automated billing logic to support location-aware access and accurate usage tracking',
      'Built an SSO-enabled bypass flow to extend service access outside geofenced areas as an enterprise accessibility benefit',
    ],
  },
  {
    company: 'University of Utah',
    role: 'Teaching Assistant',
    date: 'Spring 2021 - Fall 2022',
    startDate: new Date('2021-01-01'),
    endDate: new Date('2022-12-01'),
    logo: '/uofu.svg',
    logoAlt: 'University of Utah Logo',
    skills: ['Java', 'C++', 'Data Structures', 'Algorithms'],
    bullets: [
      'Led office hours, lab sessions, and review events to support over 100 students in Data Structures, Algorithms, and Software Engineering courses',
      'Graded assignments and provided detailed technical feedback to reinforce core computer science concepts',
      'Served as a retention TA, offering additional support to students at risk of dropping courses',
    ],
  },
  {
    company: 'Kantata',
    role: 'Software Engineer Intern',
    date: 'May 2022 - August 2022',
    startDate: new Date('2022-05-01'),
    endDate: new Date('2022-08-01'),
    logo: '/kantata.png',
    logoAlt: 'Kantata Logo',
    skills: ['Ruby on Rails', 'React', 'Salesforce', 'TDD', 'CI/CD'],
    bullets: [
      'Collaborated with 4 interns to build admin panel features in Ruby on Rails and React, including a secure user impersonation tool',
      'Integrated Salesforce and Slack into the product ecosystem, simplifying customer workflows',
      'Practiced test-driven development, pair programming, and CI/CD under mentorship from senior engineers',
    ],
  },
  {
    company: 'Zions Bank',
    role: 'Software Engineer Intern',
    date: 'October 2021 - May 2022',
    startDate: new Date('2021-10-01'),
    endDate: new Date('2022-05-01'),
    logo: '/zionsBank.jpg',
    logoAlt: 'Zions Bank Logo',
    skills: ['Salesforce', 'JavaScript', 'CSS', 'Automation'],
    bullets: [
      'Modernized UI components using Salesforce, JavaScript, and CSS, improving design consistency and usability',
      'Automated redaction of PII from financial documents, saving manual processing time and increasing compliance',
    ],
  },
  {
    company: 'EnerBank USA',
    role: 'Senior Lender Support Specialist',
    date: 'June 2020 - August 2022',
    startDate: new Date('2020-06-01'),
    endDate: new Date('2022-08-01'),
    logo: '/enerbank.png',
    logoAlt: 'EnerBank USA Logo',
    category: 'prior',
    skills: ['Loan Processing', 'Compliance', 'Training', 'Communication'],
    bullets: [
      'Answered complex inquiries about loan applications and verification documents to assist customers and support internal lenders',
      'Provided training for new lenders on application workflows, documentation standards, and internal tools',
      'Processed complex verification paperwork by following advanced procedures with a focus on accuracy and compliance',
      'De-escalated challenging customer interactions with empathy and professionalism, ensuring a high standard of service',
    ],
  },
  {
    company: 'EnerBank USA',
    role: 'Inbound Customer Service Representative',
    date: 'December 2018 - June 2020',
    startDate: new Date('2018-12-01'),
    endDate: new Date('2020-06-01'),
    logo: '/enerbank.png',
    logoAlt: 'EnerBank USA Logo',
    category: 'prior',
    skills: ['Loan Processing', 'Compliance', 'Customer Service', 'Training'],
    bullets: [
      'Processed and managed customer and contractor loan applications with strict adherence to bank procedures and compliance standards',
      'Trained and mentored several new employees to accelerate onboarding and maintain team performance',
      'Achieved and maintained a >90% accuracy rate over several consecutive months',
    ],
  },
];

const engineeringExperiences = experiences.filter(
  (e) => e.category !== 'prior'
);
const priorExperiences = experiences.filter((e) => e.category === 'prior');

// Calculate unique technologies count (engineering roles only)
const uniqueTechnologies = [
  ...new Set(engineeringExperiences.flatMap((e) => e.skills)),
].length;

// Use stagger 0.2 for work experience
const workContainerVariants = {
  ...containerVariants,
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function WorkExperienceCard() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={workContainerVariants}
      className="mt-12"
    >
      <SectionHeader title="Work Experience" variants={slideInLeft} />

      {/* Stats Bar */}
      <motion.div
        variants={slideInLeft}
        className="mb-8 grid grid-cols-3 gap-4 rounded-2xl border border-gray-300 bg-white p-4 shadow-md sm:p-6 dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg"
      >
        <div className="text-center">
          <div className="mb-1 flex items-center justify-center gap-2">
            <HiOutlineBriefcase className="h-5 w-5 text-teal-600 dark:text-yellow-300" />
            <span className="text-2xl font-bold text-yellow-500 sm:text-3xl dark:text-yellow-300">
              {engineeringExperiences.length}
            </span>
          </div>
          <p className="text-xs text-gray-500 sm:text-sm">Companies</p>
        </div>
        <div className="text-center">
          <div className="mb-1 flex items-center justify-center gap-2">
            <HiOutlineClock className="h-5 w-5 text-purple-500" />
            <span className="text-2xl font-bold text-purple-500 sm:text-3xl">
              {calculateTotalExperience()}
            </span>
          </div>
          <p className="text-xs text-gray-500 sm:text-sm">Years Experience</p>
        </div>
        <div className="text-center">
          <div className="mb-1 flex items-center justify-center gap-2">
            <HiOutlineCode className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold text-blue-500 sm:text-3xl">
              {uniqueTechnologies}+
            </span>
          </div>
          <p className="text-xs text-gray-500 sm:text-sm">Technologies</p>
        </div>
      </motion.div>

      {/* Engineering Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-0 left-8 hidden h-full w-0.5 bg-gradient-to-b from-purple-500 via-yellow-300 to-purple-500 md:block" />

        {engineeringExperiences.map((exp) => (
          <motion.div
            key={`${exp.company}-${exp.role}`}
            variants={slideInLeft}
            className="group relative mb-8 last:mb-0"
          >
            {/* Timeline dot */}
            <div className="absolute top-8 left-6 hidden h-5 w-5 rounded-full border-4 border-gray-100 bg-yellow-300 transition-all duration-300 group-hover:scale-125 group-hover:bg-purple-500 md:block dark:border-gray-900" />

            {/* Card */}
            <Card className="transition-all duration-300 hover:opacity-90 md:ml-16">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                {/* Logo */}
                <div className="flex-shrink-0 self-center lg:self-start">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-white p-2">
                    <Image
                      src={exp.logo}
                      alt={exp.logoAlt}
                      width={64}
                      height={64}
                      className="h-auto max-h-16 w-auto object-contain"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200">
                        {exp.company}
                      </h3>
                      <p className="text-teal-600 dark:text-yellow-300">
                        {exp.role}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:justify-end">
                      <span className="text-sm whitespace-nowrap text-gray-700 dark:text-gray-400">
                        {exp.date}
                      </span>
                      <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-purple-400">
                        {calculateDuration(exp.startDate, exp.endDate)}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {exp.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-gray-700 dark:text-gray-400"
                      >
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Prior Experience */}
      {priorExperiences.length > 0 && (
        <>
          <motion.div variants={slideInLeft} className="mt-12 mb-6">
            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
              Prior Experience
            </h3>
            <div className="mt-2 h-px bg-gray-300 dark:bg-gray-700" />
          </motion.div>

          <div className="relative">
            <div className="absolute top-0 left-8 hidden h-full w-0.5 bg-gradient-to-b from-gray-500 via-gray-400 to-gray-500 md:block" />

            {priorExperiences.map((exp) => (
              <motion.div
                key={`${exp.company}-${exp.role}`}
                variants={slideInLeft}
                className="group relative mb-8 last:mb-0"
              >
                <div className="absolute top-8 left-6 hidden h-5 w-5 rounded-full border-4 border-gray-100 bg-gray-400 transition-all duration-300 group-hover:scale-125 group-hover:bg-gray-500 md:block dark:border-gray-900" />

                <Card className="transition-all duration-300 hover:opacity-90 md:ml-16">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                    <div className="flex-shrink-0 self-center lg:self-start">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-white p-2">
                        <Image
                          src={exp.logo}
                          alt={exp.logoAlt}
                          width={64}
                          height={64}
                          className="h-auto max-h-16 w-auto object-contain"
                        />
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200">
                            {exp.company}
                          </h3>
                          <p className="text-teal-600 dark:text-yellow-300">
                            {exp.role}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:justify-end">
                          <span className="text-sm whitespace-nowrap text-gray-700 dark:text-gray-400">
                            {exp.date}
                          </span>
                          <span className="rounded-full bg-gray-500/20 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-gray-400">
                            {calculateDuration(exp.startDate, exp.endDate)}
                          </span>
                        </div>
                      </div>

                      <ul className="mt-4 space-y-2">
                        {exp.bullets.map((bullet, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-gray-700 dark:text-gray-400"
                          >
                            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
