import { prisma } from '@/app/lib/prisma';

export interface SiteSettings {
  showPhone: boolean;
}

const DEFAULTS: SiteSettings = {
  showPhone: true,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      return DEFAULTS;
    }

    return {
      showPhone: settings.showPhone,
    };
  } catch {
    return DEFAULTS;
  }
}

export async function updateSiteSettings(
  data: Partial<SiteSettings>
): Promise<SiteSettings> {
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: data,
    create: {
      id: 'default',
      ...DEFAULTS,
      ...data,
    },
  });

  return {
    showPhone: settings.showPhone,
  };
}
