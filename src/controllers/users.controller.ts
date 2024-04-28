import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import validator from 'validator';
import { AppDataSource } from '../../ormconfig';
import { JWT_SECRET } from '../constants/security';
import { User } from '../entities/user';
import { STATUS_CODES } from '../types/statusCodes';
import { internalServerError, validationError } from './common.controller';
export const login = async (req: Request, res: Response) => {
  const { t } = req;
  const { email, username, password } = req.body;
  if (!password && (!username || !email)) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      error: t('COMMON_ERROR.badRequest'),
      errorDesc: t('USER.loginValidationError'),
    });
  }
  const isEmailValid = validator.isEmail(email);

  if (email && !isEmailValid) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      error: t('COMMON_ERROR.badRequest'),
      errorDesc: t('USER.emailValidationError'),
    });
  }
  const userRepo = AppDataSource.getRepository(User);
  const users = await userRepo.findOne({
    where: [
      {
        email,
      },
      {
        username,
      },
    ],
  });
  if (users) {
    console.log({ users, password, password2: users.password });
    compare(password, users.password, (err: any, result) => {
      if (err) {
        const error = new Error(t('USER.loginValidationError'));
        return internalServerError(error, req, res);
      }
      if (!result) {
        console.log({ result });
        const error = new Error(t('USER.loginValidationError'));
        return internalServerError(error, req, res);
      } else {
        const token = sign(
          {
            id: users.id,
            username: users.username,
            email: users.email,
          },
          JWT_SECRET,
          {
            expiresIn: '1d',
          }
        );
        return res.status(STATUS_CODES.OK).json({
          token,
          user: {
            username: users?.username,
            email: users?.email,
            password: users.password,
          },
        });
      }
    });
  } else {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      error: t('COMMON_ERROR.notFound'),
      errorDesc: t('USER.userNotFound'),
    });
  }
};

export const register = async (req: Request, res: Response) => {
  const { t } = req;
  const userRepo = AppDataSource.getRepository(User);

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return validationError({ username, email, password }, req, res);
  }
  // check if user exists
  const isFindUser = await userRepo.find({
    where: [{ username }, { email }],
  });
  if (isFindUser?.length > 0) {
    return res.status(STATUS_CODES.ENTITY_ALREADY_EXISTS).json({
      error: t('USER.userExists'),
    });
  }
  // add validator error
  const isEmailValid = validator.isEmail(email);

  if (isEmailValid)
    try {
      hash(password, 10, (err, hash) => {
        if (err) {
          return internalServerError(err, req, res);
        }
        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = hash;
        userRepo.save(newUser);
        // password removed here for security only
        res.status(STATUS_CODES.CREATED).json({
          user: {
            username: newUser.username,
            email: newUser.email,
          },
        });
      });
    } catch (error: any) {
      return internalServerError(error, req, res);
    }
  else {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      error: t('USER.emailNotValid'),
    });
  }
};

export const updateUser = async (req: Request | any, res: Response) => {
  const { file, body, user } = req;
  const t = req.i18n;
  const userRepo = AppDataSource.getRepository(User);

  userRepo
    .update(
      { id: user.id },
      {
        email: body.email,
        bio: body?.bio,
        image: file.path,
      }
    )
    .then(async (result) => {
      const updatedUser = await userRepo.findOneBy({ id: user.id });
      if (updatedUser) {
        return res.status(STATUS_CODES.CREATED).json({
          user: {
            email: updatedUser.email,
            bio: updatedUser.bio,
            image: updatedUser.image,
          },
        });
      } else {
        const error = new Error(t('COMMON_ERROR.somethingWentWrong'));
        return internalServerError(error, req, res);
      }
    })
    .catch((err) => {
      console.log({ err });
      return internalServerError(err, req, res);
    });
};
