import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import UserController from "./Controllers/User/UserController";
import HerdController from "./Controllers/Herd/HerdController";
import AnimalController from "./Controllers/Animal/AnimalController";
import PostController from "./Controllers/Post/PostController";

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
app.use("/herdle", UserController);
app.use("/herd", HerdController);
app.use("/animal", AnimalController);
app.use("/post", PostController);

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
