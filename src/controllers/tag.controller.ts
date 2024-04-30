import { Request, Response } from 'express';
import { AppDataSource } from '../../ormconfig';
import { Tag } from '../entities/tag.entity';
import { STATUS_CODES } from '../types/statusCodes';
import { getValidationErrorMessage } from '../utils/errors';
import { internalServerError } from './common.controller';
import { ILike } from 'typeorm';

export const createTag = (req: Request, res: Response) => {
  const tagRepo = AppDataSource.getRepository(Tag);
  const { t } = req;
  const { name } = req.body;
  if (!name) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(getValidationErrorMessage(t, { name }));
  } else {
    tagRepo
      .findOne({
        where: { name },
      })
      .then((tag) => {
        if (tag) {
          return res.status(STATUS_CODES.CREATED).json({
            tag: {
              id: tag.id,
              name: tag.name,
            },
          });
        } else {
          const newTag = tagRepo.create({ name });
          tagRepo
            .save(newTag)
            .then((result) => {
              return res.status(STATUS_CODES.CREATED).json({
                tag: {
                  id: result.id,
                  name: result.name,
                },
              });
            })
            .catch((err) => {
              return internalServerError(err, req, res);
            });
        }
      })
      .catch((err) => {
        return internalServerError(err, req, res);
      });
  }
};

export const searchTags = (req: Request, res: Response) => {
  const tagRepo = AppDataSource.getRepository(Tag);
  const { t } = req;
  const { name } = req.query;
  if (!name) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(getValidationErrorMessage(t, { name: name?.toString() as any }));
  } else {
    tagRepo
      .find({
        where: { name: ILike(`%${name.toString()}%`) },
      })
      .then((tags) => {
        return res.status(STATUS_CODES.OK).json({ tags });
      })
      .catch((err) => {
        return internalServerError(err, req, res);
      });
  }
};
