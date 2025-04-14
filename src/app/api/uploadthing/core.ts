import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Define input schema
const trackInput = z.object({
  title: z.string(),
  price: z.number(),
  genre: z.string(),
});

const f = createUploadthing();

export const ourFileRouter = {
  trackUploader: f(["image", "audio"])
    .input(trackInput)
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) throw new Error("Unauthorized");
      return { userEmail: session.user.email };
    })
    .onUploadComplete(
      async (ctx) => {
        const { metadata, file, input } = ctx as unknown as {
          metadata: { userEmail: string };
          file: {
            url: string;
            name: string;
            size: number;
            key: string;
            type: string;
          };
          input: {
            title: string;
            price: number;
            genre: string;
          };
        };

        const user = await prisma.user.findUnique({
          where: { email: metadata.userEmail },
        });

        if (!user) {
          console.error("User not found");
          return;
        }

        const isAudio = file.type.startsWith("audio");
        const isImage = file.type.startsWith("image");

        const existingTrack = await prisma.track.findFirst({
          where: {
            title: input.title,
            artistId: user.id,
          },
        });

        if (isAudio && !existingTrack) {
          await prisma.track.create({
            data: {
              title: input.title,
              price: input.price,
              genre: input.genre,
              fileUrl: file.url,
              imageUrl: null,
              artist: { connect: { id: user.id } },
            },
          });
        }

        if (isImage && existingTrack) {
          await prisma.track.update({
            where: { id: existingTrack.id },
            data: {
              imageUrl: file.url,
            },
          });
        }

        console.log("Upload completed and saved to DB");
      }
    ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
