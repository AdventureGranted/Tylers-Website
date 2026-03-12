import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; interviewId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, interviewId } = await params;

  try {
    const body = await request.json();

    if (body.rating !== undefined && body.rating !== null) {
      const rating = Number(body.rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'rating must be an integer between 1 and 5' },
          { status: 400 }
        );
      }
    }

    const data: Record<string, unknown> = {};

    if (body.scheduledDate !== undefined)
      data.scheduledDate = new Date(body.scheduledDate);
    if (body.type !== undefined) data.type = body.type;
    if (body.interviewerNames !== undefined)
      data.interviewerNames = body.interviewerNames;
    if (body.prepNotes !== undefined) data.prepNotes = body.prepNotes;
    if (body.questionsAsked !== undefined)
      data.questionsAsked = body.questionsAsked;
    if (body.yourAnswers !== undefined) data.yourAnswers = body.yourAnswers;
    if (body.debriefNotes !== undefined) data.debriefNotes = body.debriefNotes;
    if (body.rating !== undefined)
      data.rating = body.rating !== null ? Number(body.rating) : null;
    if (body.followUpSentAt !== undefined)
      data.followUpSentAt = body.followUpSentAt
        ? new Date(body.followUpSentAt)
        : null;
    if (body.expectedResponseDate !== undefined)
      data.expectedResponseDate = body.expectedResponseDate
        ? new Date(body.expectedResponseDate)
        : null;
    if (body.responseReceivedAt !== undefined)
      data.responseReceivedAt = body.responseReceivedAt
        ? new Date(body.responseReceivedAt)
        : null;

    const interview = await prisma.interview.update({
      where: { id: interviewId, jobApplicationId: id },
      data,
    });

    return NextResponse.json(interview);
  } catch (error) {
    console.error('Error updating interview:', error);
    return NextResponse.json(
      { error: 'Failed to update interview' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; interviewId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, interviewId } = await params;

  try {
    await prisma.interview.delete({
      where: { id: interviewId, jobApplicationId: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting interview:', error);
    return NextResponse.json(
      { error: 'Failed to delete interview' },
      { status: 500 }
    );
  }
}
