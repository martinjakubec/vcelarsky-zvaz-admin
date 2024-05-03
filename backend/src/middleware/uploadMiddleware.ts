import {NextFunction} from 'express';
import {createFolderIfNotExists} from '../utils/createReports';
import {DEFAULT_REPORTS_PATH, DEFAULT_UPLOADS_PATH} from '../constants';

export async function createFolderMiddleware(
  req: Express.Request,
  res: Express.Response,
  next: NextFunction
): Promise<void> {
  try {
    await createFolderIfNotExists(DEFAULT_UPLOADS_PATH);
    await createFolderIfNotExists(DEFAULT_REPORTS_PATH);
    next();
  } catch (err) {
    next(err);
  }
}
