import { HttpError } from '../errors/HttpError';
import { ErrorRequestHandler, RequestHandler } from 'express';

export const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  res.status(status).json({ error: message });
};

export const notFound: RequestHandler = () => {
  throw new HttpError({ message: 'Not found', status: 404 });
};
