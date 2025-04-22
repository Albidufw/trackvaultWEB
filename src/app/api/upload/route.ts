import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import path from "path";
import { Readable } from "stream";
import type { Fields, Files, File } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
  runtime: "nodejs", 
  maxDuration: 60,   
  maxBodySize: "25mb", 
};


async function streamToNodeReadable(req: Request): Promise<Readable> {
  const reader = req.body?.getReader();
  const stream = new Readable({
    async read() {
      if (!reader) return this.push(null);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        this.push(value);
      }
      this.push(null);
    },
  });


  const contentType = req.headers.get("content-type") || "";
  const contentLength = req.headers.get("content-length") || "";

  (stream as any).headers = {
    "content-type": contentType,
    "content-length": contentLength,
  };

  return stream;
}


async function parseForm(req: Request): Promise<{ fields: Fields; files: Files }> {
  const { IncomingForm } = await import("formidable");
  const stream = await streamToNodeReadable(req);

  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), "tmp"),
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024, // 50 MB limit
  });

  return new Promise((resolve, reject) => {
    form.parse(stream as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { fields, files } = await parseForm(req);
    const { title, price, genre } = fields;

    const audioFile = Array.isArray(files.file) ? files.file[0] : files.file;
    const imageFile = files.image ? (Array.isArray(files.image) ? files.image[0] : files.image) : null;

    if (!title || !price || !audioFile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const audioFileName = audioFile.newFilename || "track.mp3";
    const fileUrl = `/uploads/${audioFileName}`;

    //if user didn't upload an image
    const imageFileName = imageFile?.newFilename || null;
    const imageUrl = imageFileName ? `/uploads/${imageFileName}` : "/default-track.jpg";

    const track = await prisma.track.create({
      data: {
        title: String(title),
        fileUrl,
        imageUrl,
        genre: Array.isArray(genre) ? genre[0] : genre,
        price: parseFloat(Array.isArray(price) ? price[0] : price),
        artist: { connect: { id: user.id } },
      },
    });

    return NextResponse.json({ success: true, track });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
