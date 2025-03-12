import { Request, Response, NextFunction } from 'express';

// Custom error class
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  // Check if it's our custom API error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message
    });
  }

  // Default to 500 server error
  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Internal Server Error'
  });
}; 