import {NextFunction, Request, Response} from 'express';
import {TokenExpiredError, verify} from 'jsonwebtoken';
import {JWT_SECRET} from '../contants';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.isUserLoggedIn = false;
  const token = req.headers.authorization;
  if (!token) return next();
  try {
    const decoded = verify(token, JWT_SECRET);
    if (typeof decoded !== 'string') {
      res.locals.username = decoded.username;
    }
    res.locals.isUserLoggedIn = true;
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next();
    } else {
      console.log(error);
    }
    return next();
  }
};

export default authMiddleware;
