import { PrismaClient, User } from "@prisma/client";
import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import formidable, { IncomingForm } from "formidable";
import cloudinary from "cloudinary";
import { findUser, imageUploader } from "./Utilities/helpers";

dotenv.config();

const PORT = 8080;
const app = express();
const prisma = new PrismaClient();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use(cors());
app.use(express.json());

/**
 * User Routes
 */

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  await prisma.user
    .findFirst({ where: { username: username } })
    .then(async (user: User | null) => {
      if (user === null) {
        res.send("No user found.");
      }
      await bcrypt
        .compare(password, user?.password!)
        .then((pwMatch: boolean) => {
          if (pwMatch) {
            const token = jwt.sign(
              { id: user?.id, email: user?.email },
              "secret"
            );
            res.header("x-auth-token", token).send({
              id: user?.id,
              email: user?.email,
              username: user?.username,
              token,
            });
          }
        });
    });
});

app.get("/getAllUsers", async (req, res) => {
  await prisma.$connect().catch((error) => {
    console.log("error", error);
  });

  const allUsers = await prisma.user.findMany();

  await prisma.$disconnect();

  res.send(allUsers);
});

app.post("/herdle/new", async (req, res) => {
  await bcrypt.hash(req.body.password, 10).then(async (hashedPw) => {
    await prisma.user
      .findFirst({
        where: {
          email: req.body.email,
        },
      })
      .then(async (results: User | null) => {
        if (results) {
          res.send("Email already taken");
        }
        await prisma.user.create({
          data: {
            username: req.body.username,
            email: req.body.email,
            password: hashedPw,
          },
        });

        const allUsers = await prisma.user.findMany();
        res.send(allUsers);
      });
  });
});

app.get("/herdle/profile", async (req, res) => {
  await findUser(req.query.userId as string).then(async (user) => {
    if (!user) res.send().status(400);
    res.send({
      ...user,
    });
  });
});

app.post("/herdle/followAction", async (req, res) => {
  await prisma.user
    .findFirst({
      where: {
        id: req.body.userInQuestion,
      },
    })
    .then(async (user) => {
      if (
        user?.followedByIDs.filter(
          (followerId) => followerId === req.body.userId
        ).length
      ) {
        await prisma.user
          .update({
            where: {
              id: req.body.userInQuestion,
            },
            data: {
              followedByIDs: user.followedByIDs.filter(
                (followerId) => followerId !== req.body.userId
              ),
            },
          })
          .then((newUser) => {
            res.send(newUser);
          });
      } else {
        await prisma.user
          .update({
            where: {
              id: req.body.userInQuestion,
            },
            data: {
              followedByIDs: {
                push: req.body.userId,
              },
            },
          })
          .then((newUser) => {
            res.send(newUser);
          });
      }
    });
});

app.get("/herdle/animals", async (req, res) => {
  const userAnimals = await prisma.animal.findMany({
    where: {
      ownerId: req.query.userId as string,
    },
  });
  res.send(userAnimals);
});

/**
 * Herd Routes
 */

app.post("/herd/new", async (req, res) => {
  const user = jwt.decode(req.headers["bearer"] as string) as User;
  await prisma.herd
    .create({
      data: {
        name: req.body.name,
        animals: {},
        ownerId: user.id,
      },
    })
    .then(() => {
      res.send("worked").status(200);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/herd/single", async (req, res) => {
  await prisma.herd
    .findFirst({
      where: {
        id: req.query["herdId"] as string,
      },
    })
    .then((herd) => {
      res.json(herd);
    });
});

app.get("/all_herds", async (req, res) => {
  await prisma.herd
    .findMany({
      where: {
        ownerId: req.query.id as string,
      },
    })
    .then((herds) => {
      res.json(herds);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post("/herd/add_animal", async (req, res) => {
  await prisma.animal
    .update({
      where: {
        id: req.body.animalId as string,
      },
      data: {
        herdId: {
          push: req.body.herdId as string,
        },
      },
    })
    .then(async () => {
      await prisma.herd
        .findFirst({
          where: {
            id: req.body.herdId as string,
          },
        })
        .then((herd) => {
          res.json(herd);
        });
    });
});

app.post("/herd/remove_animal", async (req, res) => {
  const animal = await prisma.animal.findFirst({
    where: { id: req.body.animalId },
  });

  await prisma.animal
    .update({
      where: {
        id: req.body.animalId,
      },
      data: {
        herdId: {
          set: animal?.herdId.filter((id: string) => id !== req.body.herdId),
        },
      },
    })
    .then(async () => {
      await prisma.herd
        .findFirst({
          where: {
            id: req.body.herdId as string,
          },
        })
        .then((herd) => {
          res.json(herd);
        });
    });
});

/**
 * Animal Routes
 */

app.get("/animal/single", async (req, res) => {
  await prisma.animal
    .findFirst({
      where: {
        id: req.query.animalId as string,
      },
    })
    .then((animal) => {
      res.json(animal);
    });
});

app.post("/animal/add", async (req, res) => {
  await prisma.animal
    .create({
      data: {
        ...req.body,
        ownerId: req.query["userId"],
      },
    })
    .then((animal) => {
      res.json(animal);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

app.post("/animal/delete", async (req, res) => {
  await prisma.animal
    .delete({
      where: {
        id: req.body.animalId,
      },
    })
    .then(() => {
      res.send().status(200);
    });
});

/**
 * Post Routes
 */

app.post("/post/new", async (req, res) => {
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (files) {
      await prisma.post
        .create({
          data: {
            authorId: fields.userId as string,
            body: fields.post as string,
            created: new Date(),
          },
        })
        .then(async (post) => {
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
    await findUser(req.body.userId).then(async (user) => {
      if (!user) res.send().status(400);
      res.send({
        ...user,
      });
    });
  });
});

app.post("/post/likePost", async (req, res) => {
  const { userId, postId } = req.body;

  const post = await prisma.post.findFirst({
    where: {
      id: postId as string,
    },
  });

  await prisma.post
    .update({
      where: {
        id: post?.id,
      },
      data: {
        likedByIDs: {
          set: post?.likedByIDs.includes(userId)
            ? post.likedByIDs.filter((id) => id !== userId)
            : post?.likedByIDs.concat([userId as string]),
        },
      },
    })
    .then(async () => {
      const userPosts = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          posts: true,
        },
      });
      res.send(userPosts);
    });
});

app.post("/post/comment", async (req, res) => {
  const { userId, postId, commentBody } = req.body;

  await prisma.comment
    .create({
      data: {
        userId: userId,
        body: commentBody,
        created: new Date(),
        postId: postId,
      },
    })
    .then(async () => {
      await findUser(userId).then((user) => {
        res.send(user);
      });
    });
});

app.delete("/post", async (req, res) => {
  await prisma.post.delete({
    where: {
      id: req.body.postId,
    },
  });
});

/**
 * Image Routes
 */

app.post("/herdle/profilePicture/upload", async (req, res) => {
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    await imageUploader(
      files.file as formidable.File,
      `Herdle/${req.query.location}`
    )
      .then(async (result) => {
        await prisma.user
          .update({
            where: {
              id: req.query.userId as string,
            },
            data: {
              avatar: result!.secure_url,
            },
          })
          .then((user) => {
            res.send(user);
          });
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
});

/**
 * TEST Routes
 */

app.get("/test", async (req, res) => {
  await prisma.user
    .findMany({
      include: {
        following: true,
      },
    })
    .then((user) => {
      res.send(user);
    });
});

app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
