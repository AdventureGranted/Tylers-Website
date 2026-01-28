'use client';

import { motion } from 'framer-motion';
import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiPython,
  SiKotlin,
  SiRubyonrails,
  SiDocker,
  SiKubernetes,
  SiAmazonwebservices,
  SiMongodb,
  SiMysql,
  SiGit,
  SiUbuntu,
  SiApple,
  SiPostman,
  SiSalesforce,
  SiNextdotjs,
  SiTailwindcss,
  SiPostgresql,
  SiDebian,
  SiLinux,
} from 'react-icons/si';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import { FaJava, FaWindows } from 'react-icons/fa';
import { TbBrandCpp, TbBrandCSharp } from 'react-icons/tb';
import { VscAzure } from 'react-icons/vsc';

const skillCategories = [
  {
    title: 'Languages & Frameworks',
    skills: [
      { name: 'TypeScript', icon: SiTypescript, color: 'text-blue-400' },
      { name: 'JavaScript', icon: SiJavascript, color: 'text-yellow-400' },
      { name: 'React', icon: SiReact, color: 'text-cyan-400' },
      { name: 'Next.js', icon: SiNextdotjs, color: 'text-gray-300' },
      { name: 'Node.js', icon: SiNodedotjs, color: 'text-green-500' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: 'text-cyan-400' },
      { name: 'NextAuth', icon: RiShieldKeyholeLine, color: 'text-purple-400' },
      { name: 'Python', icon: SiPython, color: 'text-yellow-300' },
      { name: 'C#', icon: TbBrandCSharp, color: 'text-purple-400' },
      { name: 'Java', icon: FaJava, color: 'text-red-400' },
      { name: 'C++', icon: TbBrandCpp, color: 'text-blue-500' },
      { name: 'Ruby on Rails', icon: SiRubyonrails, color: 'text-red-500' },
      { name: 'Kotlin', icon: SiKotlin, color: 'text-purple-500' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    skills: [
      { name: 'AWS', icon: SiAmazonwebservices, color: 'text-orange-400' },
      { name: 'Azure', icon: VscAzure, color: 'text-blue-400' },
      { name: 'Docker', icon: SiDocker, color: 'text-blue-400' },
      { name: 'Kubernetes', icon: SiKubernetes, color: 'text-blue-500' },
      { name: 'Git', icon: SiGit, color: 'text-orange-500' },
    ],
  },
  {
    title: 'Databases & Tools',
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql, color: 'text-blue-400' },
      { name: 'MongoDB', icon: SiMongodb, color: 'text-green-500' },
      { name: 'MySQL', icon: SiMysql, color: 'text-blue-400' },
      { name: 'Postman', icon: SiPostman, color: 'text-orange-500' },
      { name: 'Salesforce', icon: SiSalesforce, color: 'text-blue-400' },
    ],
  },
  {
    title: 'Platforms',
    skills: [
      { name: 'Linux', icon: SiLinux, color: 'text-yellow-400' },
      { name: 'Debian', icon: SiDebian, color: 'text-red-400' },
      { name: 'Ubuntu', icon: SiUbuntu, color: 'text-orange-500' },
      { name: 'macOS', icon: SiApple, color: 'text-gray-300' },
      { name: 'Windows', icon: FaWindows, color: 'text-blue-400' },
    ],
  },
];

const subjects = [
  'Object Oriented Programming',
  'Data Structures & Algorithms',
  'Web & Mobile Development',
  'Agile & Test Driven Development',
  'Distributed Systems',
  'Human-Computer Interaction',
  'Data Analysis & Statistics',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TechnicalSkills() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="mt-12"
    >
      {/* Section Header */}
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-200">Technical Skills</h2>
        <div className="mx-auto mt-2 h-1 w-72 rounded bg-gradient-to-r from-purple-500 to-yellow-300" />
      </motion.div>

      {/* Skills Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {skillCategories.map((category) => (
          <motion.div
            key={category.title}
            variants={itemVariants}
            className="rounded-2xl bg-gray-800 p-6"
          >
            <h3 className="mb-4 text-xl font-semibold text-yellow-300">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-3">
              {category.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="group flex items-center gap-2 rounded-full bg-gray-700/50 px-4 py-2 transition-all duration-300 hover:scale-105 hover:bg-gray-700"
                >
                  <skill.icon className={`text-lg ${skill.color}`} />
                  <span className="text-sm text-gray-300">{skill.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Knowledge Areas */}
      <motion.div
        variants={itemVariants}
        className="mt-8 rounded-2xl bg-gray-800 p-6"
      >
        <h3 className="mb-4 text-xl font-semibold text-yellow-300">
          Knowledge Areas
        </h3>
        <div className="flex flex-wrap gap-3">
          {subjects.map((subject) => (
            <span
              key={subject}
              className="rounded-full border border-gray-600 bg-gray-700/30 px-4 py-2 text-sm text-gray-300 transition-all duration-300 hover:border-yellow-300/50 hover:bg-gray-700"
            >
              {subject}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
