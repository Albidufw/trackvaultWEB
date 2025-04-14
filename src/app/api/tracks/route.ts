import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Get session and verify user
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      console.warn('[TRACK_UPLOAD] Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.warn('[TRACK_UPLOAD] User not found in DB:', email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { title, price, genre, fileUrl, imageUrl } = body;

    // Basic field validation
    if (!title || !price || !genre || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const track = await prisma.track.create({
      data: {
        title: String(title),
        price: parseFloat(price),
        genre: String(genre),
        fileUrl: String(fileUrl),
        imageUrl: imageUrl || '/default-track.jpg',
        artistId: user.id,
      },
    });

    return NextResponse.json({ success: true, track });
  } catch (error) {
    console.error('[TRACK_UPLOAD] Error saving track:', error);
    return NextResponse.json({ error: 'Failed to save track' }, { status: 500 });
  }
}

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
