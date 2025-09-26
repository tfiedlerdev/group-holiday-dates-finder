import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ poll_id: string }> }
) {
  try {
    const { poll_id: pollId } = await params;

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        dateRanges: true,
      },
    });

    if (!poll) {
      return NextResponse.json(
        { success: false, error: 'Poll not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      poll: {
        id: poll.id,
        title: poll.title,
        startDate: poll.startDate,
        endDate: poll.endDate,
        createdAt: poll.createdAt,
        dateRanges: poll.dateRanges,
      },
    });
  } catch (error) {
    console.error('Error fetching poll:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch poll' },
      { status: 500 }
    );
  }
}
