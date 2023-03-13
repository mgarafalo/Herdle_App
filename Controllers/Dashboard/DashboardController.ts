import { User } from "@prisma/client";
import express from "express";
import { findSingleGeneric } from "../../Utilities/Prisma";
import { findUser } from "../../Utilities/utils";

const app = express();

app.get("/:id", async (req, res) => {
  const user = await findSingleGeneric<User>("user", "id", req.params.id, {
    select: {
      id: true,
      herdle: {
        select: {
          id: true,
          name: true,
          photoUrl: true,
        },
      },
      herds: true,
    },
  });

  res.send(user);
});

export default app;
