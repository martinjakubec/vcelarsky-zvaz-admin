import express from 'express';
import prismaClient from '../prismaClient';
import {compare, hash} from 'bcrypt';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  const users = await prismaClient.user.findMany({
    select: {
      id: true,
      username: true,
    },
  });
  res.json(users);
});

userRouter.get('/:username', async (req, res) => {
  const {username} = req.params;
  const user = await prismaClient.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
    },
  });
  res.json(user);
});

userRouter.post('/', async (req, res) => {
  const {username, password} = req.body;
  if (!username) {
    res.status(400).send('Username is required');
    return;
  }
  if (!password) {
    res.status(400).send('Password is required');
    return;
  }
  if (await prismaClient.user.findUnique({where: {username}})) {
    res.status(400).send('Username already exists');
    return;
  }
  try {
    const user = await prismaClient.user.create({
      data: {
        username,
        password: await hash(password, 10),
      },
      select: {
        id: true,
        username: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).send('Something went wrong');
  }
});

userRouter.put('/:username', async (req, res) => {
  const {username} = req.params;
  const {oldPassword, newPassword} = req.body;
  if (!oldPassword) {
    res.status(400).send('Old password is required');
    return;
  }
  if (!newPassword) {
    res.status(400).send('New password is required');
    return;
  }
  const userToUpdate = await prismaClient.user.findUnique({
    where: {
      username,
    },
  });
  if (!userToUpdate) {
    res.status(404).send('User not found');
    return;
  }
  const oldPasswordMatches = await compare(oldPassword, userToUpdate.password);
  if (!oldPasswordMatches) {
    res.status(400).send('Old password does not match');
    return;
  }

  const user = await prismaClient.user.update({
    where: {
      username,
    },
    data: {
      password: await hash(newPassword, 10),
    },
    select: {
      id: true,
      username: true,
    },
  });
  res.json(user);
});

userRouter.delete('/', async (req, res) => {
  const {username} = req.body;
  const isUserLoggedIn = res.locals.isUserLoggedIn;
  if (!username) return res.status(400).send('Username is required');
  if (!isUserLoggedIn) return res.status(401).send('Unauthorized');
  if (res.locals.username !== username)
    return res.status(401).send('Unauthorized');

  const user = await prismaClient.user.update({
    where: {
      username,
    },
    data: {
      deletedAt: new Date(),
    },
    select: {
      id: true,
      username: true,
    },
  });
  res.json(user);
});

export default userRouter;
