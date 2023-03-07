import { User, PrismaClient } from "@prisma/client";
import express from "express";
import { findSingleGeneric, findManyGeneric } from "../../Utilities/Prisma";
import { findUser, imageUploader } from "../../Utilities/utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import formidable, { IncomingForm } from "formidable";

const app = express();
const prisma = new PrismaClient();

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  await findSingleGeneric<User | null>("user", "username", username).then(
    async (user: User | null) => {
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
    }
  );
});

app.get("/getAllUsers", async (req, res) => {
  await prisma.$connect().catch((error) => {
    console.log("error", error);
  });

  const allUsers = await findManyGeneric<User[]>("user");

  await prisma.$disconnect();

  res.send(allUsers);
});

app.post("/new", async (req, res) => {
  await bcrypt.hash(req.body.password, 10).then(async (hashedPw) => {
    await findSingleGeneric<User>("user", "email", req.body.email, {
      select: { email: true },
    }).then(async (results: User | null) => {
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

app.get("/profile", async (req, res) => {
  await findUser(req.query.userId as string).then(async (user) => {
    if (!user) res.send().status(400);
    res.send({
      ...user,
    });
  });
});

app.post("/followAction", async (req, res) => {
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

app.get("/animals", async (req, res) => {
  const userAnimals = await findManyGeneric(
    "animal",
    "ownerId",
    req.query.userId as string
  );
  res.send(userAnimals);
});

app.post("/profilePicture/upload", async (req, res) => {
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

export default app;
