import { Post, PrismaClient } from "@prisma/client";
import express from "express";
import formidable, { IncomingForm } from "formidable";
import {
  findManyGeneric,
  createGeneric,
  findSingleGeneric,
  updateSingleGeneric,
  deleteGeneric,
} from "../../Utilities/Prisma";
import { imageUploader, findUser } from "../../Utilities/utils";

const app = express();
const prisma = new PrismaClient();

app.get("/serve", async (req, res) => {
  const posts = await findManyGeneric<Post[]>("post", undefined, undefined, {
    orderBy: { created: "desc" },
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
      likedBy: true,
    },
  });
  res.send(posts);
});

app.post("/new", async (req, res) => {
  if (Object.values(req.body).length === 0) {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (files) {
        await createGeneric<Post>("post", {
          authorId: fields.userId as string,
          body: fields.post as string,
          created: new Date(),
        }).then(async (post) => {
          await imageUploader(
            files.file as formidable.File,
            `Herdle/posts/${post.id}`
          ).then(async (result) => {
            if (result) {
              await prisma.post.update({
                where: {
                  id: post.id,
                },
                data: {
                  img: result.secure_url,
                },
              });
            }
          });
        });
      }
    });
  } else {
    await createGeneric<Post>("post", {
      authorId: req.body.userId as string,
      body: req.body.post as string,
      created: new Date(),
    });
  }

  const user = await findUser(req.body.userId);
  if (!user) res.send().status(400);
  res.send({ ...user });
});

app.post("/likePost", async (req, res) => {
  const { userId, postId } = req.body;

  const post = await findSingleGeneric<Post>("post", "id", postId as string);

  await updateSingleGeneric<Post>("post", "id", post.id, "likedByIDs", {
    set: post?.likedByIDs.includes(userId)
      ? post.likedByIDs.filter((id) => id !== userId)
      : post?.likedByIDs.concat([userId as string]),
  }).then(async () => {
    const user = await findUser(userId);
    res.send(user);
  });
});

app.post("/comment", async (req, res) => {
  const { userId, postId, commentBody } = req.body;

  await createGeneric<Comment>("comment", {
    userId: userId,
    body: commentBody,
    created: new Date(),
    postId: postId,
  }).then(async () => {
    const user = await findUser(userId);
    res.send(user);
  });
});

app.delete("/", async (req, res) => {
  await deleteGeneric<Post>("post", "id", req.body.postId);
});

export default app;
