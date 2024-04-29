import { Request, Response } from 'express';
import { AppDataSource } from '../../ormconfig';
import { User } from '../entities/user';
import { STATUS_CODES } from '../types/statusCodes';
import { internalServerError } from './common.controller';

export const getProfile = (req: Request, res: Response) => {
  const userId = req.params.username;
  const userRepo = AppDataSource.getRepository(User);
  const { t } = req;
  userRepo
    .findOne({
      where: {
        id: Number(userId),
      },
    })
    .then((user) => {
      if (user) {
        return res.status(STATUS_CODES.OK).json({
          profile: {
            email: user.email,
            bio: user.bio,
            image: user.image,
            username: user.username,
          },
        });
      } else {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          error: t('COMMON_ERROR.notFound'),
          errorDesc: t('USER.userNotFound'),
        });
      }
    })
    .catch((err) => {
      return internalServerError(err, req, res);
    });
};

export const followUser = (req: Request, res: Response) => {};

export const unfollowUser = (req: Request, res: Response) => {};
