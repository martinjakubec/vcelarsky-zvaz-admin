import dotenv from 'dotenv';
dotenv.config();
import express, {NextFunction, Request, Response} from 'express';
import path from 'path';
import apiRouter from './router/apiRouter';
import authMiddleware from './middleware/authMiddleware';
import {debug} from './utils/debug';
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')));
app.use(authMiddleware);
process.env.DEBUG === '1' && app.use(debug);

app.use('/api', apiRouter);

app.listen(3000, () => {
  console.log('listening on port 3000');
});
