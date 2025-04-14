import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { generateUploadButton } from "@uploadthing/react";

const f = createUploadthing();

export const ourFileRouter = {
  trackUploader: f(["image", "audio"])
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) throw new Error("Unauthorized");
      return { userEmail: session.user.email };
    })
    .onUploadComplete(
      async ({
        metadata,
        file,
      }: {
        metadata: { userEmail: string };
        file: {
          url: string;
          name: string;
          size: number;
          key: string;
        };
      }) => {
        console.log("Upload complete!");
        console.log("File:", file);
        console.log("Uploaded by:", metadata.userEmail);
      }
    ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const UploadButton = generateUploadButton<OurFileRouter>();
