import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, startDate, endDate } = body;

    // Create a new poll
    const poll = await prisma.poll.create({
      data: {
        title: title || 'Group Holiday Poll',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      poll: {
        id: poll.id,
        title: poll.title,
        startDate: poll.startDate,
        endDate: poll.endDate,
        createdAt: poll.createdAt,
      }
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create poll' },
      { status: 500 }
    );
  }
}
