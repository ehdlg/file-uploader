import { ErrorRequestHandler } from 'express';

export const handleError: ErrorRequestHandler = (error, _, res, __) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  res.status(status).json({ error: message });
};
