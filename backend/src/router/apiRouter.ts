import express from 'express';
import memberRouter from './memberRouter';
import userRouter from './userRouter';
import loginRouter from './loginRouter';
import districtRouter from './districtRouter';

const apiRouter = express.Router();

apiRouter.use('/members', memberRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/login', loginRouter);
apiRouter.use('/districts', districtRouter);

export default apiRouter;
