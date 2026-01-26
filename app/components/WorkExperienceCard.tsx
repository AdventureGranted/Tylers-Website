import Image from 'next/image';
import React from 'react';

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
      'Collaborate with cross-functional teams to ship health-tech solutions that help users manage metabolic health',
    ],
  },
  {
    company: 'Sorenson Communications',
    role: 'Software Engineer',
    date: 'December 2022 - July 3, 2025',
    logo: '/sorensonCommunications.jpg',
    logoAlt: 'Sorenson Communications Logo',
    bullets: [
      'Designed and deployed a full-stack, real-time ASL interpretation platform using React, Node.js, AWS (Lambda, DynamoDB), and Netlify',
      'Enabled in-store QR-based access to interpreters for deaf and hard-of-hearing users, enhancing accessibility in retail environments',
      'Implemented dynamic geofencing and automated billing logic to support location-aware access and accurate usage tracking',
      'Built an SSO-enabled bypass flow to extend service access outside geofenced areas as an enterprise accessibility benefit',
      'Improved user experience with a responsive, mobile-friendly frontend and seamless authentication flow',
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
      'Served as a retention TA, offering additional support to students at risk of dropping courses, contributing to improved course completion rates',
    ],
  },
  {
    company: 'Kantata',
    role: 'Software Engineer Intern',
    date: 'May 2022 - August 2022',
    logo: '/kantata.png',
    logoAlt: 'Kantata Logo',
    bullets: [
      'Collaborated with 4 interns to build admin panel features in Ruby on Rails and React, including a secure user impersonation tool to enhance QA',
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

export default function WorkExperienceCard() {
  return (
    <div className="mt-8 max-w-full rounded-4xl bg-gray-800 shadow-md">
      <h1 className="pt-8 text-center text-3xl font-bold text-gray-200">
        Work Experience
      </h1>
      <div className="mx-auto mt-2 mb-2 h-1 w-3/4 rounded bg-gray-400 md:w-1/2 xl:w-1/4" />
      <div className="mt-4 flex flex-col items-start gap-8 overflow-hidden p-6">
        {experiences.map((exp) => (
          <div
            key={exp.company}
            className="flex h-full w-full flex-col text-left"
          >
            <div className="flex w-full flex-col items-center justify-between lg:flex-row">
              <div className="flex flex-col items-center lg:flex-row">
                <h1 className="text-center text-2xl font-bold lg:text-left">
                  {exp.company}
                </h1>
                <h2 className="text-md text-left lg:mt-1 lg:ml-4">
                  {exp.role}
                </h2>
              </div>
              <h2 className="text-md text-right whitespace-nowrap lg:mt-1">
                {exp.date}
              </h2>
            </div>
            <div className="my-2 h-px w-full bg-gray-400" />
            <div className="mt-4 flex w-full flex-col items-center lg:flex-row lg:items-start">
              <Image
                src={exp.logo}
                alt={exp.logoAlt}
                width={240}
                height={240}
              />
              <ul className="ml-8 list-disc space-y-2 p-4 text-xl">
                {exp.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
