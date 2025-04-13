import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { generateComponents } from "@uploadthing/react";

const f = createUploadthing();

export const ourFileRouter = {
  trackUploader: f({ image: { maxFileSize: "4MB" }, audio: { maxFileSize: "16MB" } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) throw new Error("Unauthorized");
      return { userEmail: session.user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { UploadButton, UploadDropzone, Uploader } = generateComponents<OurFileRouter>();
