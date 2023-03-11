import formidable from "formidable";
import cloudinary from "cloudinary";
import { findSingleGeneric, getPrismaModel, ModelName } from "./Prisma";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function findUser(userId: string) {
  return await findSingleGeneric<User>("user", "id", userId, {
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      followedByIDs: true,
      followingIDs: true,
      herdle: true,
      herds: {
        include: {
          animals: true,
        },
      },
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
