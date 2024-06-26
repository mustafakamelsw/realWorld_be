import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../types/statusCodes';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/security';
import { internalServerError } from '../controllers/common.controller';

export const checkIsForbidden = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { t } = req.i18n;
  if (!token) {
    return res.status(STATUS_CODES.FORBIDDEN).json({
      error: t('COMMON_ERROR.forbidden'),
      errorDesc: t('COMMON_ERROR.forbiddenDesc'),
    });
  }
  try {
    const user = verify(token, JWT_SECRET);
    (req as any).user = user;
    next();
  } catch (error) {
    const newError = new Error('check is forbidden:' + error);
    return internalServerError(newError, req, res);
  }
};
