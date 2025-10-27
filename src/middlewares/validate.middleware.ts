import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendError } from '../controllers/BaseController';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array().map(err => err.msg).join(', ');
    sendError(res, 'Validation failed', 422, errorMessage);
    return; // ✅ explicitly return to ensure type is void
  }

  next();
};
