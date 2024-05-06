import {randomUUID} from 'crypto';
import {NextFunction, Request, Response} from 'express';

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.requestId = randomUUID();
  next();
}
