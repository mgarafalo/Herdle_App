import { PrismaClient, User } from '@prisma/client';
import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const PORT = 8080;
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/getAllUsers', async (req, res) => {
  await prisma.$connect().catch((error) => {
    console.log('error', error);
  });

  const allUsers = await prisma.user.findMany();

  await prisma.$disconnect();

  res.send(allUsers);
});

/**
 * User Routes
 */

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  await prisma.user
    .findFirst({ where: { email: email } })
    .then(async (user: User | null) => {
      if (user === null) {
        res.send('No user found.');
      }
      await bcrypt
        .compare(password, user?.password!)
        .then((pwMatch: boolean) => {
          if (pwMatch) {
            const token = jwt.sign(
              { id: user?.id, email: user?.email },
              'secret'
            );
            res
              .header('x-auth-token', token)
              .send({ id: user?.id, email: user?.email, token });
          }
        });
    });
});

app.post('/user/new', async (req, res) => {
  await bcrypt.hash(req.body.password, 10).then(async (hashedPw) => {
    await prisma.user
      .findFirst({
        where: {
          email: req.body.email,
        },
      })
      .then(async (results: User | null) => {
        if (results) {
          res.send('Email already taken');
        }
        await prisma.user.create({
          data: {
            name: req.body.username,
            email: req.body.email,
            password: hashedPw,
          },
        });

        const allUsers = await prisma.user.findMany();
        res.send(allUsers);
      });
  });
});

app.get('/user/profile', async (req, res) => {
  await prisma.user
    .findFirst({ where: { id: req.query.id as string } })
    .then(async (user) => {
      if (!user) res.send().status(400);
      const { id, name, email } = user!;
      res.send({ id, name, email } );
    });
});

app.get('/user/animals', async (req, res) => {
  const userAnimals = await prisma.animal
    .findMany({
      where: {
        ownerId: req.query.userId as string,
      },
    })
    res.send(userAnimals);
});

/**
 * Herd Routes
 */

app.post('/herd/new', async (req, res) => {
  const user = jwt.decode(req.headers['bearer'] as string) as User;
  await prisma.herd
    .create({
      data: {
        name: req.body.name,
        animals: {},
        ownerId: user.id,
      },
    })
    .then(() => {
      res.send('worked').status(200);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get('/herd/single', async (req, res) => {
  await prisma.herd
    .findFirst({
      where: {
        id: req.query['herdId'] as string,
      },
    })
    .then((herd) => {
      res.json(herd);
    });
});

app.get('/all_herds', async (req, res) => {
  await prisma.herd
    .findMany({
      where: {
        ownerId: req.query['userId'] as string,
      },
    })
    .then((userHerds) => {
      res.json(userHerds);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post('/herd/add_animal', async (req, res) => {
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

app.post('/herd/remove_animal', async (req, res) => {
  await prisma.animal
    .update({
      where: {
        id: req.body.animalId,
      },
      data: {
        herdId: '',
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

app.get('/animal/single', async (req, res) => {
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

app.post('/animal/add', async (req, res) => {
  await prisma.animal
    .create({
      data: {
        ...req.body,
        ownerId: req.query['userId'],
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

app.post('/animal/delete', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
