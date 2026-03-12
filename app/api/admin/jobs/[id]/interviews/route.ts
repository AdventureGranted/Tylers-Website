import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

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
    const interviews = await prisma.interview.findMany({
      where: { jobApplicationId: id },
      orderBy: { scheduledDate: 'asc' },
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    );
  }
}

export async function POST(
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

    if (!body.scheduledDate) {
      return NextResponse.json(
        { error: 'scheduledDate is required' },
        { status: 400 }
      );
    }

    if (body.rating !== undefined && body.rating !== null) {
      const rating = Number(body.rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'rating must be an integer between 1 and 5' },
          { status: 400 }
        );
      }
    }

    const interview = await prisma.interview.create({
      data: {
        jobApplicationId: id,
        scheduledDate: new Date(body.scheduledDate),
        type: body.type,
        interviewerNames: body.interviewerNames,
        prepNotes: body.prepNotes,
        questionsAsked: body.questionsAsked,
        yourAnswers: body.yourAnswers,
        debriefNotes: body.debriefNotes,
        rating: body.rating !== undefined ? Number(body.rating) : undefined,
        followUpSentAt: body.followUpSentAt
          ? new Date(body.followUpSentAt)
          : undefined,
        expectedResponseDate: body.expectedResponseDate
          ? new Date(body.expectedResponseDate)
          : undefined,
        responseReceivedAt: body.responseReceivedAt
          ? new Date(body.responseReceivedAt)
          : undefined,
      },
    });

    return NextResponse.json(interview, { status: 201 });
  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json(
      { error: 'Failed to create interview' },
      { status: 500 }
    );
  }
}
