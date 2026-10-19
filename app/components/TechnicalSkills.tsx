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
  SiTerraform,
  SiAnsible,
  SiShopify,
  SiGraphql,
  SiReactrouter,
  SiFastapi,
  SiPayloadcms,
  SiPosthog,
  SiAwslambda,
  SiGithubactions,
} from 'react-icons/si';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import { FaJava, FaWindows } from 'react-icons/fa';
import {
  TbBrandCpp,
  TbBrandCSharp,
  TbDroplet,
  TbAtom2,
  TbDatabaseCog,
  TbFunction,
  TbLayoutBoardSplit,
  TbWebhook,
  TbInfinity,
  TbTestPipe,
} from 'react-icons/tb';
import { VscAzure } from 'react-icons/vsc';
import { containerVariants, itemVariants } from '@/app/lib/animations';
import { Card } from '@/app/components/ui/Card';
import { SectionHeader } from '@/app/components/ui/SectionHeader';

const skillCategories = [
  {
    title: 'Languages & Frameworks',
    skills: [
      { name: 'TypeScript', icon: SiTypescript, color: 'text-blue-400' },
      { name: 'JavaScript', icon: SiJavascript, color: 'text-accent-strong' },
      { name: 'React', icon: SiReact, color: 'text-cyan-400' },
      {
        name: 'Next.js',
        icon: SiNextdotjs,
        color: 'text-gray-800 dark:text-gray-300',
      },
      { name: 'React Router', icon: SiReactrouter, color: 'text-red-500' },
      { name: 'Node.js', icon: SiNodedotjs, color: 'text-green-500' },
      { name: 'GraphQL', icon: SiGraphql, color: 'text-pink-500' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: 'text-cyan-400' },
      { name: 'NextAuth', icon: RiShieldKeyholeLine, color: 'text-purple-400' },
      { name: 'Python', icon: SiPython, color: 'text-accent' },
      { name: 'FastAPI', icon: SiFastapi, color: 'text-teal-500' },
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
      { name: 'AWS Lambda', icon: SiAwslambda, color: 'text-orange-500' },
      { name: 'CI/CD', icon: TbInfinity, color: 'text-teal-400' },
      { name: 'GitHub Actions', icon: SiGithubactions, color: 'text-blue-500' },
      { name: 'Testing & TDD', icon: TbTestPipe, color: 'text-green-400' },
      { name: 'Docker', icon: SiDocker, color: 'text-blue-400' },
      { name: 'Kubernetes', icon: SiKubernetes, color: 'text-blue-500' },
      { name: 'Azure', icon: VscAzure, color: 'text-blue-400' },
      { name: 'Terraform', icon: SiTerraform, color: 'text-purple-500' },
      { name: 'Ansible', icon: SiAnsible, color: 'text-red-400' },
      { name: 'Git', icon: SiGit, color: 'text-orange-500' },
    ],
  },
  {
    title: 'Shopify & Commerce',
    skills: [
      { name: 'Shopify', icon: SiShopify, color: 'text-lime-500' },
      { name: 'Hydrogen', icon: TbAtom2, color: 'text-blue-400' },
      { name: 'Shopify Functions', icon: TbFunction, color: 'text-orange-400' },
      { name: 'Liquid', icon: TbDroplet, color: 'text-sky-400' },
      {
        name: 'Storefront & Admin APIs',
        icon: SiGraphql,
        color: 'text-pink-500',
      },
      {
        name: 'Metafields & Metaobjects',
        icon: TbDatabaseCog,
        color: 'text-purple-400',
      },
      { name: 'Webhooks', icon: TbWebhook, color: 'text-accent-strong' },
      {
        name: 'Builder.io',
        icon: TbLayoutBoardSplit,
        color: 'text-fuchsia-400',
      },
    ],
  },
  {
    title: 'Databases & Tools',
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql, color: 'text-blue-400' },
      { name: 'MongoDB', icon: SiMongodb, color: 'text-green-500' },
      { name: 'MySQL', icon: SiMysql, color: 'text-blue-400' },
      {
        name: 'Payload CMS',
        icon: SiPayloadcms,
        color: 'text-gray-800 dark:text-gray-300',
      },
      { name: 'PostHog', icon: SiPosthog, color: 'text-orange-400' },
      { name: 'Postman', icon: SiPostman, color: 'text-orange-500' },
      { name: 'Salesforce', icon: SiSalesforce, color: 'text-blue-400' },
    ],
  },
  {
    title: 'Platforms',
    skills: [
      { name: 'Linux', icon: SiLinux, color: 'text-accent-strong' },
      { name: 'Debian', icon: SiDebian, color: 'text-red-400' },
      { name: 'Ubuntu', icon: SiUbuntu, color: 'text-orange-500' },
      {
        name: 'macOS',
        icon: SiApple,
        color: 'text-gray-800 dark:text-gray-300',
      },
      { name: 'Windows', icon: FaWindows, color: 'text-blue-400' },
    ],
  },
];

const subjects = [
  'Object Oriented Programming',
  'Data Structures & Algorithms',
  'Web & Mobile Development',
  'Headless & Composable Commerce',
  'Agile & Test Driven Development',
  'Distributed Systems',
  'Human-Computer Interaction',
  'Data Analysis & Statistics',
];

export default function TechnicalSkills() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="mt-12"
    >
      <SectionHeader title="Technical Skills" variants={itemVariants} />

      {/* Skills Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {skillCategories.map((category) => (
          <motion.div
            key={category.title}
            variants={itemVariants}
            className="h-full"
          >
            <Card className="h-full">
              <h3 className="text-accent mb-4 text-xl font-semibold">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="group flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 transition-all duration-300 hover:scale-105 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <skill.icon className={`text-lg ${skill.color}`} />
                    <span className="text-sm text-gray-700 dark:text-gray-200">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Knowledge Areas */}
      <motion.div variants={itemVariants} className="mt-8">
        <Card>
          <h3 className="text-accent mb-4 text-xl font-semibold">
            Knowledge Areas
          </h3>
          <div className="flex flex-wrap gap-3">
            {subjects.map((subject) => (
              <span
                key={subject}
                className="hover:border-accent-soft/50 dark:hover:border-accent/50 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-all duration-300 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                {subject}
              </span>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
