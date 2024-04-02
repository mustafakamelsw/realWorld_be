import { STATUS_CODES } from '../types/statusCodes';
import { NextFunction, Request, Response } from 'express';

export const handleCorsError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Header', '*');
  if (req.method === 'OPTIONS') {
    res.header(
      'Access-Control-Allow-Methods',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method == 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET'
      );
      res.status(STATUS_CODES.OK).json({});
    }
  }
  next();
};
