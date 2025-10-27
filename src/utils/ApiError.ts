export class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;
  
    constructor(statusCode: number, message: string, isOperational = true) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
  
      // Maintain proper stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }