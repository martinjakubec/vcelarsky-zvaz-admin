import { NextFunction, Request, Response } from "express";

export function debug(req: Request, res: Response, next: NextFunction) {
  if (process.env.DEBUG === 'true') {
    console.log(new Date().toTimeString(), 'Request URL:', req.originalUrl, 'IP:', req.ip);
  }

  next();
}
