import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const tracks = await prisma.track.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('[TRACK_GET] Error fetching tracks:', error);
    return NextResponse.json({ error: 'Failed to load tracks' }, { status: 500 });
  }
}