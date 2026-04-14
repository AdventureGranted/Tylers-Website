import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { getSiteSettings, updateSiteSettings } from '@/app/lib/settings';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = await updateSiteSettings({
      showPhone: typeof body.showPhone === 'boolean' ? body.showPhone : undefined,
    });

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
