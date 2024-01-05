import {NextFunction, Request, Response} from 'express';

export function debug(req: Request, res: Response, next: NextFunction) {
  next();
}
