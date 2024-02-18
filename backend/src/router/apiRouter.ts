import express from 'express';
import memberRouter from './memberRouter';
import userRouter from './userRouter';
import loginRouter from './loginRouter';
import districtRouter from './districtRouter';
import verifyRouter from './verifyRouter';

const apiRouter = express.Router();

apiRouter.use('/members', memberRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/login', loginRouter);
apiRouter.use('/districts', districtRouter);
apiRouter.use('/verify', verifyRouter);

export default apiRouter;
