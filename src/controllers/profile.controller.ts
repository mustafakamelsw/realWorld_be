import { Request, Response } from 'express';
import { AppDataSource } from '../../ormconfig';
import { User } from '../entities/user';
import { STATUS_CODES } from '../types/statusCodes';
import { internalServerError } from './common.controller';
import { JWT_SECRET } from '../constants/security';
import { verify } from 'jsonwebtoken';

export const getProfile = async (req: Request, res: Response) => {
  const userId = req.params.username;
  const userRepo = AppDataSource.getRepository(User);
  const { t } = req;
  userRepo
    .findOne({
      where: {
        id: Number(userId),
      },
    })
    .then(async (user) => {
      const token = req.headers.authorization?.split(' ')[1];
      const currentUser: any = verify(token || '', JWT_SECRET);
      if (user && currentUser.id) {
        userRepo
          .findOne({
            where: {
              id: currentUser.id,
            },
          })
          .then((myUser) => {
            const isFollowing = myUser?.follow.find((id) => id == user.id);
            return res.status(STATUS_CODES.OK).json({
              profile: {
                email: user.email,
                bio: user.bio,
                image: user.image,
                username: user.username,
                following: isFollowing ? true : false,
              },
            });
          })
          .catch((err) => {
            return res.status(STATUS_CODES.NOT_FOUND).json({
              error: t('COMMON_ERROR.notFound'),
              errorDesc: t('USER.userNotFound'),
            });
          });
      } else if (user && !currentUser) {
        return res.status(STATUS_CODES.OK).json({
          profile: {
            email: user.email,
            bio: user.bio,
            image: user.image,
            username: user.username,
            following: false,
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

export const followUser = (req: Request, res: Response) => {
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
        const myId: User = (req as any).user;
        userRepo.findOne({ where: { id: Number(myId.id) } }).then((myUser) => {
          if (myUser) {
            const newFollow = myUser.follow?.length > 0 ? myUser.follow : [];
            const findFollow = newFollow.find((id) => user.id == id);
            if (!findFollow) {
              newFollow.push(Number(user.id));
            }
            userRepo
              .update(
                { id: myUser.id },
                {
                  follow: newFollow,
                }
              )
              .then((result) => {
                if (result)
                  return res.status(STATUS_CODES.OK).json({
                    profile: {
                      email: user.email,
                      bio: user.bio,
                      image: user.image,
                      username: user.username,
                      follow: true,
                    },
                  });

                return res.status(STATUS_CODES.NOT_FOUND).json({
                  error: t('COMMON_ERROR.notFound'),
                  errorDesc: t('USER.userNotFound'),
                });
              })
              .catch((err) => {
                return internalServerError(err, req, res);
              });
          }
        });
      } else {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          error: t('COMMON_ERROR.notFound'),
          errorDesc: t('USER.userNotFound'),
        });
      }
    });
};

export const unfollowUser = (req: Request, res: Response) => {
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
        const myId: User = (req as any).user;
        userRepo.findOne({ where: { id: Number(myId.id) } }).then((myUser) => {
          if (myUser) {
            const newFollow = myUser.follow?.length > 0 ? myUser.follow : [];
            const updatedFollow = newFollow.filter((id) => id != user.id);

            userRepo
              .update(
                { id: myUser.id },
                {
                  follow: updatedFollow,
                }
              )
              .then((result) => {
                if (result)
                  return res.status(STATUS_CODES.OK).json({
                    profile: {
                      email: user.email,
                      bio: user.bio,
                      image: user.image,
                      username: user.username,
                      follow: false,
                    },
                  });

                return res.status(STATUS_CODES.NOT_FOUND).json({
                  error: t('COMMON_ERROR.notFound'),
                  errorDesc: t('USER.userNotFound'),
                });
              })
              .catch((err) => {
                return internalServerError(err, req, res);
              });
          }
        });
      } else {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          error: t('COMMON_ERROR.notFound'),
          errorDesc: t('USER.userNotFound'),
        });
      }
    });
};
