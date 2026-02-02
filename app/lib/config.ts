export const SOCIAL_LINKS = [
  {
    href: 'https://github.com/tylerbb812',
    label: 'GitHub',
    iconName: 'github' as const,
  },
  {
    href: 'https://www.linkedin.com/in/tyler-james-grant/',
    label: 'LinkedIn',
    iconName: 'linkedin' as const,
  },
  {
    href: 'mailto:recruit.tyler.grant@gmail.com',
    label: 'Email',
    iconName: 'email' as const,
  },
];

export type SocialIconName = (typeof SOCIAL_LINKS)[number]['iconName'];
