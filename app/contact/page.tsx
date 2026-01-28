import { HiOutlineMail } from 'react-icons/hi';
import { BsTelephone, BsLinkedin, BsGithub } from 'react-icons/bs';

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
    <main className="flex min-h-screen flex-col items-center bg-gray-900 px-4 py-12 md:py-20">
      <div className="w-full max-w-2xl md:max-w-4xl">
        <h1 className="mb-4 text-center text-4xl font-bold text-gray-200 md:mb-6 md:text-5xl">
          Get In Touch
        </h1>
        <p className="mb-10 text-center text-lg text-gray-400 md:mb-14 md:text-xl">
          Feel free to reach out! I&apos;m always open to discussing new
          opportunities, projects, or just having a chat.
        </p>

        {/* Contact Methods */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 md:mb-10 md:gap-6">
          {contactMethods.map((method) => (
            <a
              key={method.label}
              href={method.href}
              className="group flex items-center gap-4 rounded-2xl border border-gray-700 bg-gray-800 p-6 transition-all duration-300 hover:border-yellow-300/50 hover:bg-gray-750 hover:shadow-lg hover:shadow-yellow-300/10 md:gap-6 md:rounded-3xl md:p-8"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-700 text-yellow-300 transition-colors group-hover:bg-yellow-300 group-hover:text-gray-900 md:h-16 md:w-16 md:rounded-2xl md:text-4xl">
                {method.icon}
              </div>
              <div>
                <p className="text-sm text-gray-400 md:text-base">{method.label}</p>
                <p className="font-semibold text-gray-200 transition-colors group-hover:text-yellow-300 md:text-lg">
                  {method.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Social Links */}
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 md:rounded-3xl md:p-10">
          <h2 className="mb-4 text-center text-lg font-semibold text-gray-300 md:mb-6 md:text-xl">
            Connect With Me
          </h2>
          <div className="flex justify-center gap-4 md:gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-700 text-gray-300 transition-all duration-300 hover:bg-yellow-300 hover:text-gray-900 hover:shadow-lg hover:shadow-yellow-300/20 md:h-16 md:w-16 md:rounded-2xl md:text-3xl"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
