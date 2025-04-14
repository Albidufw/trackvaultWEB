import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { title, price, genre, fileUrl, imageUrl } = await req.json();

    const track = await prisma.track.create({
      data: {
        title,
        price: parseFloat(price),
        genre,
        fileUrl,
        imageUrl,
        artistId: user.id,
      },
    });

    return NextResponse.json({ track });
  } catch (error) {
    console.error('Error saving track:', error);
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
    console.error('Error fetching tracks:', error);
    return NextResponse.json({ error: 'Failed to load tracks' }, { status: 500 });
  }
}
