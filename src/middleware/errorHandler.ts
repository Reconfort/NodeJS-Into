import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  
  console.error(`[Error] ${status} - ${message}`);
  if (status === 500) {
    console.error(err.stack);
  }
  
  res.status(status).json({
    error: {
      message,
      code: err.code || 'INTERNAL_SERVER_ERROR',
      status
    }
  });
};