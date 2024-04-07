import { Request, Response } from 'express';
import { internalServerError, validationError } from './common.controller';
import { hash } from 'bcrypt';
import { User } from '../entities/user';
import { AppDataSource } from '../../ormconfig';
import { STATUS_CODES } from '../types/statusCodes';
export const login = (req: Request, res: Response) => {};

export const register = (req: Request, res: Response) => {
  const userRepo = AppDataSource.getRepository(User);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return validationError({ username, email, password }, req, res);
  }
  // add validator error
  if (e)
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
};
