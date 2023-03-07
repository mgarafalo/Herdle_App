import express from "express";
import { Animal } from "@prisma/client";
import {
  findSingleGeneric,
  createGeneric,
  deleteGeneric,
} from "../../Utilities/Prisma";

const app = express();

app.get("/single", async (req, res) => {
  const animal = await findSingleGeneric<Animal>(
    "animal",
    "id",
    req.query.animalId as string
  );
  res.json(animal);
});

app.post("/add", async (req, res) => {
  const newAnimalData = { ...req.body, ownerId: req.query["userId"] };
  const animal = await createGeneric<Animal>("animal", newAnimalData);
  res.json(animal);
});

app.post("/delete", async (req, res) => {
  await deleteGeneric("animal", "id", req.body.animalId).then(() => {
    res.send().status(200);
  });
});

export default app;
