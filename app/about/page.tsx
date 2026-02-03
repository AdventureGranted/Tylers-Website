'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  HiOutlineAcademicCap,
  HiOutlineLightBulb,
  HiOutlineHeart,
  HiOutlineCode,
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineSparkles,
} from 'react-icons/hi';
import { SiHomeassistant, SiPlex, SiNvidia, SiProxmox } from 'react-icons/si';
import {
  FaBasketballBall,
  FaSkiing,
  FaBaby,
  FaBrain,
  FaQuoteLeft,
} from 'react-icons/fa';
import { GiWoodBeam } from 'react-icons/gi';
import { IoMdHeart } from 'react-icons/io';
import PageTransition from '@/app/components/PageTransition';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-[var(--background)] px-4 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto max-w-4xl"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-[var(--text-primary)] md:text-5xl">
              About{' '}
              <span className="text-yellow-500 dark:text-yellow-300">Me</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-[var(--text-secondary)]">
              Software engineer, self-hosting enthusiast, husband, and dad.
              Here&apos;s my story.
            </p>
          </motion.div>

          {/* Fun Facts / Quick Stats */}
          <motion.div
            variants={itemVariants}
            className="mb-12 grid grid-cols-2 gap-4"
          >
            <div
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 text-center"
              style={{ boxShadow: 'var(--card-shadow)' }}
            >
              <Image
                src="/about/drPepperCan.png"
                alt="Dr Pepper"
                width={48}
                height={48}
                className="mx-auto mb-2"
              />
              <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-300">
                500+
              </div>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Cans of Dr Pepper consumed while coding
              </p>
            </div>
            <div
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 text-center"
              style={{ boxShadow: 'var(--card-shadow)' }}
            >
              <HiOutlineCode className="mx-auto mb-2 h-12 w-12 text-purple-500" />
              <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-300">
                Too Many
              </div>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Times lost track of time passionately coding
              </p>
            </div>
          </motion.div>

          {/* Motto */}
          <motion.div variants={itemVariants} className="mb-12">
            <div
              className="relative rounded-2xl border border-[var(--card-border)] bg-gradient-to-br from-purple-500/10 to-yellow-300/10 p-8 text-center"
              style={{ boxShadow: 'var(--card-shadow)' }}
            >
              <FaQuoteLeft className="mx-auto mb-4 h-8 w-8 text-yellow-500/50 dark:text-yellow-300/50" />
              <p className="text-xl font-medium text-[var(--text-primary)] italic md:text-2xl">
                &ldquo;You can either drown in the wake of change or ride the
                cutting edge and make a difference.&rdquo;
              </p>
              <p className="mt-4 text-sm text-[var(--text-muted)]">
                — A motto I live by
              </p>
            </div>
          </motion.div>

          {/* My Story Section */}
          <motion.section variants={itemVariants} className="mb-12">
            <div
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 md:p-8"
              style={{ boxShadow: 'var(--card-shadow)' }}
            >
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-[var(--text-primary)]">
                <HiOutlineLightBulb className="h-7 w-7 text-yellow-500 dark:text-yellow-300" />
                My Journey into Software Engineering
              </h2>

              <div className="space-y-4 text-[var(--text-secondary)]">
                <p>
                  When I started college, I had two parents and my best
                  friend&apos;s dad who were all accountants—one being a partner
                  at one of the Big Four accounting firms. I knew if I graduated
                  with my Masters in Accounting and passed the CPA, I&apos;d
                  easily have a job lined up.
                </p>

                <p>
                  It wasn&apos;t until my second year in accounting when I took
                  an advanced Excel course that everything changed. We had one
                  assignment where we had to create macros and automate Excel
                  using VBA (Visual Basic for Applications).{' '}
                  <span className="font-medium text-yellow-500 dark:text-yellow-300">
                    That was the first time I didn&apos;t hate a homework
                    assignment.
                  </span>{' '}
                  I went above and beyond, messing around and pushing it to its
                  limits. I realized you actually <em>can</em> enjoy
                  assignments, and I was probably in the wrong degree.
                </p>

                <p>
                  I decided to take some computer science classes the following
                  semester alongside accounting to see how I felt. Not soon into
                  that semester, I met my soon-to-be wife—who was also in
                  computer science—and everything just felt like it was put in
                  place for a reason. Assignments became fun. I&apos;d complete
                  them as soon as they came out, constantly refactoring and
                  improving performance.
                </p>

                <div className="my-6 rounded-xl bg-purple-500/10 p-4">
                  <p className="text-sm text-purple-400 italic">
                    We&apos;ll ignore the only C I ever got—which was in
                    accounting that semester. I had no interest in those
                    assignments or pursuing the degree anymore.
                  </p>
                </div>

                <p>
                  It was by far the best decision I ever made to throw away 1+
                  years of classes (only a few generals transferred,
                  unfortunately). To this day, I love my job and my decision to
                  become a software engineer.{' '}
                  <span className="font-medium text-yellow-500 dark:text-yellow-300">
                    I love that my wife also shares the same passion for
                    software engineering.
                  </span>
                </p>
              </div>
            </div>
          </motion.section>

          {/* Education Section */}
          <motion.section variants={itemVariants} className="mb-12">
            <div
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 md:p-8"
              style={{ boxShadow: 'var(--card-shadow)' }}
            >
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-[var(--text-primary)]">
                <HiOutlineAcademicCap className="h-7 w-7 text-yellow-500 dark:text-yellow-300" />
                Education & Achievements
              </h2>

              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-white p-2">
                  <Image
                    src="/uofu.svg"
                    alt="University of Utah"
                    width={48}
                    height={48}
                    className="h-auto w-auto object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    University of Utah
                  </h3>
                  <p className="text-yellow-500 dark:text-yellow-300">
                    B.S. in Computer Science
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-[var(--text-secondary)]">
                <p>
                  Once I found my passion, I excelled in all my courses. I
                  became a Teaching Assistant as soon as I could and pushed
                  myself to graduate in 4 years instead of 5—all while working
                  nearly full time.
                </p>

                {/* Achievements Grid */}
                <div className="my-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-[var(--input-bg)] p-4">
                    <h4 className="mb-2 font-semibold text-[var(--text-primary)]">
                      Teaching Assistant
                    </h4>
                    <p className="text-sm">
                      <strong>CS 2420</strong> - Data Structures & Algorithms
                      <br />
                      <strong>CS 3500</strong> - Software Practice 1
                    </p>
                  </div>
                  <div className="rounded-xl bg-[var(--input-bg)] p-4">
                    <h4 className="mb-2 font-semibold text-[var(--text-primary)]">
                      Retention TA
                    </h4>
                    <p className="text-sm">
                      Hand-picked to help struggling students succeed in
                      foundational CS courses through extra sessions and
                      guidance.
                    </p>
                  </div>
                  <div className="rounded-xl bg-[var(--input-bg)] p-4">
                    <h4 className="mb-2 font-semibold text-[var(--text-primary)]">
                      UGSAC Secretary
                    </h4>
                    <p className="text-sm">
                      Undergraduate Student Advisory Committee—worked with
                      professors, participated in faculty hiring interviews, and
                      organized CS events.
                    </p>
                  </div>
                  <div className="rounded-xl bg-[var(--input-bg)] p-4">
                    <h4 className="mb-2 font-semibold text-[var(--text-primary)]">
                      Work-Life Balance
                    </h4>
                    <p className="text-sm">
                      ~25 hrs at Enerbank + ~15-20 hrs as TA + full course load
                      + UGSAC + getting married = nearly all A&apos;s
                    </p>
                  </div>
                </div>

                <p>
                  I tried to be the TA that didn&apos;t just give answers or
                  dismiss code because it wasn&apos;t written like the solution.
                  I truly understood each student&apos;s approach so I could
                  quickly assess and guide them to success. This was noticed by
                  the professor I taught with, which led to my nomination as
                  Retention TA.
                </p>
              </div>
            </div>
          </motion.section>

          {/* What I'm Currently Learning Section */}
          <motion.section variants={itemVariants} className="mb-12">
            <div
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 md:p-8"
              style={{ boxShadow: 'var(--card-shadow)' }}
            >
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-[var(--text-primary)]">
                <FaBrain className="h-7 w-7 text-yellow-500 dark:text-yellow-300" />
                What I&apos;m Currently Learning
              </h2>

              <div className="space-y-4 text-[var(--text-secondary)]">
                <p>
                  I&apos;m diving deep into{' '}
                  <span className="font-medium text-yellow-500 dark:text-yellow-300">
                    AI and machine learning
                  </span>
                  —exploring how to incorporate AI-driven features into
                  applications. The future is undeniably AI-driven, and I want
                  to be at the forefront of building these experiences.
                </p>

                <p>
                  I self-host several AI models on my dedicated Proxmox server
                  equipped with an{' '}
                  <span className="font-medium text-green-400">
                    NVIDIA RTX 3090
                  </span>
                  , which allows me to run just about any model locally. Adding
                  the AI chatbot to this website and building the AI-powered
                  receipt parser have been incredibly fun projects—I can&apos;t
                  wait to see what else I create with it.
                </p>

                <div className="my-6 flex flex-wrap gap-3">
                  <span className="flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400">
                    <SiNvidia /> RTX 3090
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-2 text-sm text-orange-400">
                    <SiProxmox /> Proxmox
                  </span>
                  <span className="rounded-full bg-purple-500/20 px-4 py-2 text-sm text-purple-400">
                    Llama 3.2 Vision
                  </span>
                  <span className="rounded-full bg-blue-500/20 px-4 py-2 text-sm text-blue-400">
                    Local LLMs
                  </span>
                  <span className="rounded-full bg-yellow-500/20 px-4 py-2 text-sm text-yellow-400">
                    Open WebUI
                  </span>
                </div>

                <div className="rounded-xl bg-green-500/10 p-4">
                  <p className="text-sm text-green-400">
                    The best part? All of this is{' '}
                    <strong>completely free and self-hosted</strong>—built and
                    maintained by me. Knowing I have full control over my AI
                    infrastructure just adds to the passion. No API costs, no
                    rate limits, just pure experimentation.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Outside of Coding Section */}
          <motion.section variants={itemVariants} className="mb-12">
            <div
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 md:p-8"
              style={{ boxShadow: 'var(--card-shadow)' }}
            >
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-[var(--text-primary)]">
                <HiOutlineSparkles className="h-7 w-7 text-yellow-500 dark:text-yellow-300" />
                Outside of Coding
              </h2>

              {/* Self-Hosting */}
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
                  <HiOutlineHome className="h-5 w-5 text-purple-500" />
                  Self-Hosting Enthusiast
                </h3>
                <p className="mb-4 text-[var(--text-secondary)]">
                  I&apos;m very tech-savvy and love new technologies, especially
                  in a self-hosted aspect. I could talk for hours about how{' '}
                  <span className="font-medium text-blue-400">
                    Home Assistant
                  </span>{' '}
                  has made a difference in my life—but that stems from being a
                  passionate software engineer. I don&apos;t like doing mundane
                  tasks if I don&apos;t have to, always looking to improve
                  automations and speed up pipelines.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-2 text-sm text-blue-400">
                    <SiHomeassistant /> Home Assistant
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-2 text-sm text-orange-400">
                    <SiPlex /> Plex Server
                  </span>
                  <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400">
                    Immich (Photos)
                  </span>
                  <span className="rounded-full bg-purple-500/20 px-4 py-2 text-sm text-purple-400">
                    Mealie (Recipes)
                  </span>
                  <span className="rounded-full bg-[var(--input-bg)] px-4 py-2 text-sm text-[var(--text-muted)]">
                    + tons more
                  </span>
                </div>
                <p className="mt-4 text-sm text-[var(--text-muted)] italic">
                  I didn&apos;t create this website to find a job—I created it
                  because of my passion. I love tinkering and trying new things
                  or new tech stacks.
                </p>

                {/* Server Rack Photo */}
                <div className="mt-6">
                  <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:mx-auto sm:w-[70%]">
                    <Image
                      src="/about/server.jpg"
                      alt="Tyler's self-hosted server, NAS, and networking rack"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <p className="absolute bottom-3 left-3 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      The Heart of the Operation
                    </p>
                  </div>
                  <div className="mt-4 rounded-xl bg-purple-500/10 p-4">
                    <p className="text-sm text-purple-400">
                      Yes, it&apos;s a bit messy—but it&apos;s what it{' '}
                      <em>runs</em> that matters. 😅 My goal is to migrate
                      everything to Ubiquiti networking and get a proper
                      full-size rack to clean things up. If you&apos;d like to
                      contribute to my future homelab dreams, feel free to Venmo{' '}
                      <a
                        href="https://venmo.com/u/tyler-grant47"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-yellow-500 hover:text-yellow-400 dark:text-yellow-300"
                      >
                        @tyler-grant47
                      </a>
                      . No pressure—but also, imagine how clean that rack could
                      look. 🙏
                    </p>
                  </div>
                </div>
              </div>

              {/* Hobbies */}
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
                  <HiOutlineHeart className="h-5 w-5 text-red-500" />
                  Hobbies & Interests
                </h3>
                <div className="mb-4 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 rounded-xl bg-[var(--input-bg)] px-4 py-3">
                    <FaBasketballBall className="text-orange-500" />
                    <span className="text-[var(--text-secondary)]">
                      Basketball (Rec Leagues)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-[var(--input-bg)] px-4 py-3">
                    <FaSkiing className="text-blue-400" />
                    <span className="text-[var(--text-secondary)]">Skiing</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-[var(--input-bg)] px-4 py-3">
                    <HiOutlineCode className="text-green-500" />
                    <span className="text-[var(--text-secondary)]">
                      Tinkering with Tech
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-[var(--input-bg)] px-4 py-3">
                    <GiWoodBeam className="text-amber-600" />
                    <span className="text-[var(--text-secondary)]">
                      Cabinetry & Woodworking
                    </span>
                  </div>
                </div>

                {/* Hobby Photos */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:w-[48%]">
                    <Image
                      src="/about/skiing.jpg"
                      alt="Tyler skiing"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <p className="absolute bottom-3 left-3 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Hitting the Slopes
                    </p>
                  </div>
                  <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:w-[48%]">
                    <Image
                      src="/about/workshop.jpg"
                      alt="Tyler's woodworking workshop"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <p className="absolute bottom-3 left-3 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      The Workshop
                    </p>
                  </div>
                </div>
              </div>

              {/* Family */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
                  <HiOutlineUserGroup className="h-5 w-5 text-yellow-500 dark:text-yellow-300" />
                  Family
                </h3>

                {/* Family Photos */}
                <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:w-[60%]">
                    <Image
                      src="/about/family.jpg"
                      alt="Tyler with his family"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <p className="absolute bottom-3 left-3 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      The Grant Family
                    </p>
                  </div>
                  <div className="group relative aspect-[3/4] w-[70%] overflow-hidden rounded-xl sm:w-[35%]">
                    <Image
                      src="/about/tyler_ashton.jpg"
                      alt="Tyler with his son Ashton"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <p className="absolute bottom-3 left-3 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Tyler & Ashton
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-[var(--text-secondary)]">
                  <div className="flex items-start gap-3">
                    <IoMdHeart className="mt-1 h-5 w-5 flex-shrink-0 text-red-500" />
                    <p>
                      <strong className="text-[var(--text-primary)]">
                        My wife
                      </strong>{' '}
                      is also a software engineer with her Master&apos;s degree.
                      She told me if I got a solid job that paid over a certain
                      threshold, she&apos;d let me skip getting my
                      Master&apos;s. Challenge accepted—that&apos;s what led me
                      to Sorenson Communications and graduating with just my
                      Bachelor&apos;s. No regrets.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaBaby className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
                    <p>
                      <strong className="text-[var(--text-primary)]">
                        My son
                      </strong>{' '}
                      is 2 years old and means the world to me. He&apos;s like
                      his father—non-stop energy, never stops trying to
                      accomplish whatever he sets his mind to. He&apos;s ahead
                      on just about everything and basically potty-trained
                      himself at 2¼ years. Everything he figures out amazes me.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-yellow-500/10 p-4">
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    I&apos;m a go-getter who can function with just about no
                    sleep if it means helping someone else. I&apos;m constantly
                    trying to make memories with my wife and kid outside of
                    work.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="mb-4 text-[var(--text-secondary)]">
              Want to connect or learn more about my work?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="rounded-full bg-yellow-500 px-8 py-3 font-medium text-gray-900 transition-all hover:scale-105 hover:bg-yellow-400 dark:bg-yellow-300"
              >
                Get in Touch
              </a>
              <a
                href="/projects"
                className="rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-8 py-3 font-medium text-[var(--text-primary)] transition-all hover:scale-105 hover:bg-[var(--nav-hover)]"
              >
                View Projects
              </a>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </PageTransition>
  );
}
