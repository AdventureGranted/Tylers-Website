'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { containerVariants, slideInLeft } from '@/app/lib/animations';
import { Card } from '@/app/components/ui/Card';
import { SectionHeader } from '@/app/components/ui/SectionHeader';

const experiences = [
  {
    company: 'Signos',
    role: 'Software Engineer',
    date: 'July 2025 - Present',
    logo: '/signos.webp',
    logoAlt: 'Signos Logo',
    bullets: [
      'Develop and maintain backend services in Python powering the Signos iOS and Android mobile applications',
      'Build and enhance features for signos.com using React and TypeScript, delivering a seamless user experience',
      'Design and optimize data pipelines and analytics infrastructure using MongoDB, AWS, and Snowflake',
      'Collaborate with cross-functional teams to ship health-tech solutions that help users manage metabolic health/weight',
    ],
  },
  {
    company: 'Sorenson Communications',
    role: 'Software Engineer',
    date: 'December 2022 - July 2025',
    logo: '/sorensonCommunications.jpg',
    logoAlt: 'Sorenson Communications Logo',
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
    logo: '/uofu.svg',
    logoAlt: 'University of Utah Logo',
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
    logo: '/kantata.png',
    logoAlt: 'Kantata Logo',
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
    logo: '/zionsBank.jpg',
    logoAlt: 'Zions Bank Logo',
    bullets: [
      'Modernized UI components using Salesforce, JavaScript, and CSS, improving design consistency and usability',
      'Automated redaction of PII from financial documents, saving manual processing time and increasing compliance',
    ],
  },
];

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

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-0 left-8 hidden h-full w-0.5 bg-gradient-to-b from-purple-500 via-yellow-300 to-purple-500 md:block" />

        {experiences.map((exp) => (
          <motion.div
            key={exp.company}
            variants={slideInLeft}
            className="group relative mb-8 last:mb-0"
          >
            {/* Timeline dot */}
            <div className="absolute top-8 left-6 hidden h-5 w-5 rounded-full border-4 border-[var(--background)] bg-yellow-300 transition-all duration-300 group-hover:scale-125 group-hover:bg-purple-500 md:block" />

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
                      <h3 className="text-xl font-bold text-[var(--text-primary)]">
                        {exp.company}
                      </h3>
                      <p className="text-yellow-500 dark:text-yellow-300">
                        {exp.role}
                      </p>
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">
                      {exp.date}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {exp.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[var(--text-secondary)]"
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
    </motion.div>
  );
}
