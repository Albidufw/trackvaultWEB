import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userWithPurchases = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        purchases: {
          include: { track: true },
        },
      },
    });

    if (!userWithPurchases) {
      return NextResponse.json({ purchases: [] });
    }

    return NextResponse.json({ purchases: userWithPurchases.purchases });
  } catch (error) {
    console.error("[PURCHASES_GET] Error fetching purchases:", error);
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { trackId, amount } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        trackId,
        amount,
      },
    });

    return NextResponse.json({ success: true, purchase });
  } catch (error) {
    console.error("[PURCHASES_POST] Error creating purchase:", error);
    return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 });
  }
}
