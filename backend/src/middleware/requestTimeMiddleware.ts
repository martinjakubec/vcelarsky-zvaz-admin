import { NextFunction, Request, Response } from "express";

export function requestTimeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.requestTime = (new Date()).getTime();
  next();
}
