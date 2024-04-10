import { NextFunction, Request, Response } from "express";
import { statfsSync } from "fs";

export function debug(req: Request, res: Response, next: NextFunction) {
  // console.log(new Date().toTimeString(), 'Request URL:', req.originalUrl);
  

  next();
}
