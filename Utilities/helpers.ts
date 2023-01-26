import formidable from "formidable";
import cloudinary from "cloudinary";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function findUser(userId: string) {
  return await prisma.user.findFirst({
    where: { id: userId as string },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      followedByIDs: true,
      followingIDs: true,
      herdle: true,
      posts: {
        include: {
          comments: {
            select: {
              body: true,
              user: {
                select: {
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: {
          created: "desc",
        },
      },
    },
  });
}

export function imageUploader(
  files: formidable.File,
  folderLocation: string
): Promise<cloudinary.UploadApiResponse | undefined | null> {
  return new Promise((resolve, reject) => {
    if (!files) resolve(null);
    cloudinary.v2.uploader
      .upload(
        files.filepath,
        {
          use_filename: true,
          folder: folderLocation,
        },
        (cloudError, result) => {
          console.log(result);
          if (cloudError) {
            console.log(cloudError);
          }
          resolve(result);
        }
      )
      .catch((error) => {
        console.log("error", error);
        reject(error);
      });
  });
}
