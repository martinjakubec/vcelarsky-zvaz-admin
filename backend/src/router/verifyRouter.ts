import express from 'express';
import {TokenExpiredError, sign, verify} from 'jsonwebtoken';
import {JWT_SECRET} from '../contants';
import prismaClient from '../prismaClient';
import {compare} from 'bcrypt';
import {TokenPayload} from '../types/tokenPayload';

const verifyRouter = express.Router();

verifyRouter.post('/', async (req, res) => {
  console.log('verifying token');

  if (!res.locals.isUserLoggedIn) return res.status(401).send('Unauthorized');
  const tokenPayload: TokenPayload = {
    username: res.locals.username,
  };

  return res.status(200).json({
    token: sign(tokenPayload, JWT_SECRET, {
      expiresIn: '4h',
    }),
  });
});

export default verifyRouter;
