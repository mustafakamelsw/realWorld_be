import { STATUS_CODES } from '../types/statusCodes';
import { getErrorMessage } from '../utils/errors';

import { NextFunction, Request, Response } from 'express';

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { t } = req.i18n;
  const error = new Error(t('commonErrors_notFound'));
  return res
    .status(STATUS_CODES.NOT_FOUND)
    .json(getErrorMessage(error.message));
};

export const serverError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR);
  res.json(getErrorMessage(error?.message));
};
export const internalServerError = (
  err: Error,
  req: Request,
  res: Response
) => {
  const { t } = req.i18n;
  return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    error: err,
    errorDesc: t('commonErrors_internalServerError'),
  });
};
