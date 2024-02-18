import express from 'express';
import prismaClient from '../prismaClient';
import {compare, hash} from 'bcrypt';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  try {
    const users = await prismaClient.user.findMany({
      select: {
        id: true,
        username: true,
      },
    });
    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
  }
});

userRouter.get('/:username', async (req, res) => {
  const {username} = req.params;
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
      },
    });
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
  }
});

userRouter.post('/', async (req, res) => {
  const {username, password, passwordConfirmation} = req.body;
  if (!username) return res.status(400).send('Username is required');
  if (!password) return res.status(400).send('Password is required');
  if (!passwordConfirmation)
    return res.status(400).send('Password confirmation is required');
  if (password !== passwordConfirmation)
    return res.status(400).send('Passwords do not match');
  try {
    if (await prismaClient.user.findUnique({where: {username}}))
      return res.status(400).send('Username already exists');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
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
    return res.json(user);
  } catch (error) {
    return res.status(500).send('Something went wrong');
  }
});

userRouter.put('/:username', async (req, res) => {
  const {username} = req.params;
  const {oldPassword, newPassword} = req.body;
  if (!res.locals.isUserLoggedIn) return res.status(401).send('Unauthorized');
  if (res.locals.username !== username)
    return res.status(401).send('Unauthorized');
  if (!oldPassword) return res.status(400).send('Old password is required');
  if (!newPassword) return res.status(400).send('New password is required');
  try {
    const userToUpdate = await prismaClient.user.findUnique({
      where: {
        username,
      },
    });
    if (!userToUpdate) {
      return res.status(404).send('User not found');
    }
    const oldPasswordMatches = await compare(
      oldPassword,
      userToUpdate.password
    );
    if (!oldPasswordMatches) {
      return res.status(400).send('Old password does not match');
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
  }

  try {
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
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
  }
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
