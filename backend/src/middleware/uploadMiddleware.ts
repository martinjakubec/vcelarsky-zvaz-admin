import {NextFunction} from 'express';
import {createFolderIfNotExists} from '../utils/createReports';
import {DEFAULT_REPORTS_PATH, DEFAULT_UPLOADS_PATH} from '../constants';
import path from 'path';

export async function createFolderMiddleware(
  req: Express.Request,
  res: Express.Response,
  next: NextFunction
): Promise<void> {
  try {
    await createFolderIfNotExists(
      path.join(DEFAULT_REPORTS_PATH, req.requestId)
    );
    next();
  } catch (err) {
    next(err);
  }
}
