  import { Response } from 'express';

export const err = (response: Response, status: number, error: string | Error): Response => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  return response.status(status).json({ error: errorMessage });
};
