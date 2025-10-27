import { Response } from 'express';

export type ApiResponseFormat<T = any> =
  | { success: true; data: T; message?: string | null }
  | { success: true; data: null; message: string }
  | { success: false; data: null; message: string; error?: string };

export class BaseController {
  protected ok<T>(
    res: Response,
    data: T,
    message: string | null = null,
    statusCode = 200
  ): Response<ApiResponseFormat<T>> {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  }

  protected message(
    res: Response,
    message: string,
    statusCode = 200
  ): Response<ApiResponseFormat<null>> {
    return res.status(statusCode).json({
      success: true,
      data: null,
      message,
    });
  }
}

// ✅ ✅ Standalone export for use in middlewares
export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  errorDetails?: string
): Response<ApiResponseFormat<null>> => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    error: errorDetails,
  });
};
