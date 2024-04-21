import {NextFunction, Request, Response} from 'express';
import {JsonWebTokenError, TokenExpiredError, verify} from 'jsonwebtoken';
import {JWT_SECRET} from '../constants';

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
      res.locals.username = decoded.username as string;
    }
    res.locals.isUserLoggedIn = true;
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.log('Token expired');
      return next();
    } else if (error instanceof JsonWebTokenError) {
      console.log('Invalid token');
      return next();
    } else {
      console.log(error);
      return next();
    }
  }
};

export default authMiddleware;
