import express from "express";
import { Animal, Herd, PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import {
  findSingleGeneric,
  findManyGeneric,
  updateSingleGeneric,
} from "../../Utilities/Prisma";

const app = express();
const prisma = new PrismaClient();

app.post("/new", async (req, res) => {
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

app.get("/single", async (req, res) => {
  const herd = await findSingleGeneric<Herd>(
    "herd",
    "id",
    req.query["herdId"] as string
  );
  res.json(herd);
});

app.get("/all_herds", async (req, res) => {
  const userHerds = await findManyGeneric<Herd[]>(
    "herd",
    "ownerId",
    req.query.id as string
  );
  res.json(userHerds);
});

app.post("/add_animal", async (req, res) => {
  await updateSingleGeneric<Animal>(
    "animal",
    "id",
    req.body.animalId as string,
    "herdId",
    { push: req.body.herdId as string }
  ).then(async () => {
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

app.post("/remove_animal", async (req, res) => {
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

export default app;
