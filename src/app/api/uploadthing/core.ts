import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { z } from "zod";

const trackInput = z.object({
  title: z.string().min(1),
  price: z.number().positive(),
  genre: z.string().min(1),
});

const f = createUploadthing();

export const ourFileRouter = {
  audioUploader: f(["audio"])
    .input(trackInput)
    .middleware(async ({ input }) => {
      const session = await getServerSession(authOptions);
      const email = session?.user?.email;
      if (!email) throw new Error("Unauthorized");
      return { userEmail: email, input }; // pass `input` into metadata
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userEmail, input } = metadata;

      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        console.error("[UPLOADTHING] User not found:", userEmail);
        return;
      }

      const track = await prisma.track.create({
        data: {
          title: input.title,
          price: input.price,
          genre: input.genre,
          fileUrl: file.url,
          imageUrl: null,
          artistId: user.id,
        },
      });

      console.log("[UPLOADTHING] Audio uploaded and track created:", track.id);
      return { url: file.url };
    }),

  imageUploader: f(["image"])
    .input(trackInput)
    .middleware(async ({ input }) => {
      const session = await getServerSession(authOptions);
      const email = session?.user?.email;
      if (!email) throw new Error("Unauthorized");
      return { userEmail: email, input }; // also here
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userEmail, input } = metadata;

      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        console.error("[UPLOADTHING] User not found for image:", userEmail);
        return;
      }

      const existingTrack = await prisma.track.findFirst({
        where: {
          title: input.title,
          artistId: user.id,
        },
        orderBy: { createdAt: "desc" },
      });

      if (!existingTrack) {
        console.error("[UPLOADTHING] No matching track found for image upload");
        return;
      }

      const updated = await prisma.track.update({
        where: { id: existingTrack.id },
        data: {
          imageUrl: file.url,
        },
      });

      console.log("[UPLOADTHING] Image added to track:", updated.id);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
