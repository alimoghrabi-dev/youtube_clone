import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/prisma";
import { UserSession } from "@/types";
import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import Mux from "@mux/mux-node";

const f = createUploadthing();

const { Video } = new Mux(process.env.MUX_API_ID!, process.env.MUX_API_SECRET!);

const handleAuth = async () => {
  const session: UserSession | null = await getServerSession(authOptions);

  const userId = session?.user.id;

  return { userId };
};

export const ourFileRouter = {
  userImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      await db.user.update({
        where: {
          id: metadata.userId,
        },
        data: {
          profilePicture: file.url,
        },
      });
    }),
  videoUploader: f({ video: { maxFileSize: "512MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      const video = await db.video.create({
        data: {
          userId: metadata.userId as string,
        },
      });

      if (file.url) {
        const existingMuxData = await db.muxData.findFirst({
          where: {
            videoId: video.id,
          },
        });

        if (existingMuxData) {
          await Video.Assets.del(existingMuxData.assetId);
          await db.muxData.delete({
            where: {
              id: existingMuxData.id,
            },
          });
        }

        const asset = await Video.Assets.create({
          input: file.url,
          playback_policy: "public",
          test: false,
        });

        await db.muxData.create({
          data: {
            videoId: video.id,
            assetId: asset.id,
            playbackId: asset.playback_ids?.[0].id,
          },
        });

        await db.video.update({
          where: {
            id: video.id,
          },
          data: {
            videoUrl: asset.playback_ids?.[0].id,
          },
        });

        return { playbackId: asset.playback_ids?.[0].id, videoId: video.id };
      }
    }),
  videoThumbnailUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(({ file }) => {
      if (file.url) {
        return {
          thumbnail: file.url,
        };
      }
    }),
  communityImageUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(({ file }) => {
      if (file.url) {
        return {
          image: file.url,
        };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
