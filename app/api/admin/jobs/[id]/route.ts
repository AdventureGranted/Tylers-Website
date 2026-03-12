import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { JobStatus, JobSource, LocationType, Prisma } from '@prisma/client';

const jobIncludes = {
  interviews: { orderBy: { scheduledDate: 'asc' as const } },
  contacts: { orderBy: { createdAt: 'asc' as const } },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const job = await prisma.jobApplication.findUnique({
      where: { id },
      include: jobIncludes,
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job application' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const data: Prisma.JobApplicationUpdateInput = {};

    if (body.company !== undefined) data.company = body.company;
    if (body.position !== undefined) data.position = body.position;
    if (body.applicationDate !== undefined)
      data.applicationDate = new Date(body.applicationDate);
    if (body.status !== undefined) {
      if (Object.values(JobStatus).includes(body.status)) {
        data.status = body.status;
      }
    }
    if (body.postingUrl !== undefined) data.postingUrl = body.postingUrl;
    if (body.salaryMin !== undefined) data.salaryMin = body.salaryMin;
    if (body.salaryMax !== undefined) data.salaryMax = body.salaryMax;
    if (body.salaryNotes !== undefined) data.salaryNotes = body.salaryNotes;
    if (body.location !== undefined) data.location = body.location;
    if (body.locationType !== undefined) {
      if (
        body.locationType === null ||
        Object.values(LocationType).includes(body.locationType)
      ) {
        data.locationType = body.locationType;
      }
    }
    if (body.source !== undefined) {
      if (Object.values(JobSource).includes(body.source)) {
        data.source = body.source;
      }
    }
    if (body.sourceDetail !== undefined) data.sourceDetail = body.sourceDetail;
    if (body.resumeVersion !== undefined)
      data.resumeVersion = body.resumeVersion;
    if (body.coverLetterUrl !== undefined)
      data.coverLetterUrl = body.coverLetterUrl;
    if (body.customResumeUrl !== undefined)
      data.customResumeUrl = body.customResumeUrl;
    if (body.notes !== undefined) data.notes = body.notes;
    if (body.followUpDate !== undefined)
      data.followUpDate = body.followUpDate
        ? new Date(body.followUpDate)
        : null;
    if (body.followUpNotes !== undefined)
      data.followUpNotes = body.followUpNotes;

    const job = await prisma.jobApplication.update({
      where: { id },
      data,
      include: jobIncludes,
    });

    return NextResponse.json(job);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Job application not found' },
        { status: 404 }
      );
    }
    console.error('Error updating job application:', error);
    return NextResponse.json(
      { error: 'Failed to update job application' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.jobApplication.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Job application not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting job application:', error);
    return NextResponse.json(
      { error: 'Failed to delete job application' },
      { status: 500 }
    );
  }
}
