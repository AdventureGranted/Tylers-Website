import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { JobStatus, JobSource, LocationType, Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const sort = searchParams.get('sort') || 'applicationDate';
  const order = searchParams.get('order') || 'desc';
  const statusParam = searchParams.get('status');
  const sourceParam = searchParams.get('source');
  const search = searchParams.get('search') || '';
  const skip = (page - 1) * limit;

  try {
    const where: Prisma.JobApplicationWhereInput = {};

    if (statusParam) {
      const statuses = statusParam.split(',') as JobStatus[];
      where.status = { in: statuses };
    }

    if (sourceParam) {
      const sources = sourceParam.split(',') as JobSource[];
      where.source = { in: sources };
    }

    if (search) {
      where.OR = [
        { company: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        include: {
          _count: {
            select: { interviews: true },
          },
        },
        orderBy: { [sort]: order },
        skip,
        take: limit,
      }),
      prisma.jobApplication.count({ where }),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { company, position, applicationDate } = body;

    if (!company || !position || !applicationDate) {
      return NextResponse.json(
        { error: 'company, position, and applicationDate are required' },
        { status: 400 }
      );
    }

    const data: Prisma.JobApplicationCreateInput = {
      company,
      position,
      applicationDate: new Date(applicationDate),
    };

    if (body.status && Object.values(JobStatus).includes(body.status)) {
      data.status = body.status;
    }
    if (body.postingUrl !== undefined) data.postingUrl = body.postingUrl;
    if (body.salaryMin !== undefined) data.salaryMin = body.salaryMin;
    if (body.salaryMax !== undefined) data.salaryMax = body.salaryMax;
    if (body.salaryNotes !== undefined) data.salaryNotes = body.salaryNotes;
    if (body.location !== undefined) data.location = body.location;
    if (
      body.locationType &&
      Object.values(LocationType).includes(body.locationType)
    ) {
      data.locationType = body.locationType;
    }
    if (body.source && Object.values(JobSource).includes(body.source)) {
      data.source = body.source;
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
      data.followUpDate = new Date(body.followUpDate);
    if (body.followUpNotes !== undefined)
      data.followUpNotes = body.followUpNotes;

    const job = await prisma.jobApplication.create({ data });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job application:', error);
    return NextResponse.json(
      { error: 'Failed to create job application' },
      { status: 500 }
    );
  }
}
