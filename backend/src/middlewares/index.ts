import { validationResult, matchedData } from 'express-validator';
import { HttpError } from '../errors/HttpError';
import { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express';
import { ValidatedData } from '../interfaces';

export const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  res.status(status).json({ error: message });
};

export const notFound: RequestHandler = () => {
  throw new HttpError({ message: 'Not found', status: 404 });
};

export function validateData(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const validatedData = matchedData<ValidatedData>(req);
    req.validatedData = validatedData;

    return next();
  }

  const errorsMessages = errors.array().map((error) => {
    return error.msg;
  });

  return res.status(422).json({ errrors: errorsMessages });
}
