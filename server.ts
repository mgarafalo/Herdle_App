import { PrismaClient, User } from "@prisma/client";
import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import formidable, { IncomingForm } from "formidable";
import cloudinary from "cloudinary";

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
  await prisma.user
    .findFirst({
      where: { id: req.query.id as string },
      include: { herdle: true, posts: true },
    })
    .then(async (user) => {
      if (!user) res.send().status(400);
      const {
        id,
        username,
        email,
        avatar,
        herdle,
        posts,
        followedByIDs,
        followingIDs,
      } = user!;
      res.send({
        id,
        username,
        email,
        avatar,
        herdle,
        posts,
        followers: followedByIDs,
        following: followingIDs,
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
  await prisma.user
    .findMany({
      where: {
        id: req.query.id as string,
      },
      include: {
        herdle: true,
      },
    })
    .then((user) => {
      res.json(user[0].herdle);
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
        herdId: req.body.herdId as string,
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
  await prisma.animal
    .update({
      where: {
        id: req.body.animalId,
      },
      data: {
        herdId: "",
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

app.post("/posts/new", async (req, res) => {
  await prisma.post
    .create({
      data: {
        authorId: req.body.userId,
        body: req.body.post,
        created: new Date(),
      },
    })
    .then((post) => {
      res.send(post);
    })
    .catch((error) => {
      console.log(error);
    });
});

/**
 * Image Routes
 */

app.post("/herdle/profilePicture/upload", async (req, res) => {
  const form = new IncomingForm();
  form.parse(req, (err, fields, files) => {
    const filePath = files.file as formidable.File;
    console.log({ fields, files });
    cloudinary.v2.uploader
      .upload(
        filePath.filepath,
        {
          use_filename: true,
          folder: `Herdle/${req.query.location}`,
        },
        async (cloudError, result) => {
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
        }
      )
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
