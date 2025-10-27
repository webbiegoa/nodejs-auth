import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { sendError } from '../controllers/BaseController'; // ✅ now valid

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isCustom = err instanceof ApiError;

  const statusCode = isCustom ? err.statusCode : 500;
  const message = isCustom
    ? err.message
    : 'Something went wrong. Please try again later.';

  console.error('[Error]', err);

  sendError(
    res,
    message,
    statusCode,
    isCustom ? undefined : err.message // show internal error only if not custom
  );
};