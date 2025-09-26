import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { RangeType } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ poll_id: string }> }
) {
  try {
    const { poll_id: pollId } = await params;
    const { username, ranges } = await request.json();

    if (!username || !Array.isArray(ranges)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Start a transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // Delete all existing ranges for this user in this poll
      await tx.dateRange.deleteMany({
        where: {
          pollId: pollId,
          userName: username,
        },
      });

      // Insert new ranges if any
      if (ranges.length > 0) {
        await tx.dateRange.createMany({
          data: ranges.map((range: { startDate: string; endDate: string; type: string }) => ({
            pollId: pollId,
            userName: username,
            startDate: new Date(range.startDate),
            endDate: new Date(range.endDate),
            type: range.type as RangeType,
          })),
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Date ranges updated successfully',
    });
  } catch (error) {
    console.error('Error updating date ranges:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update date ranges' },
      { status: 500 }
    );
  }
}
