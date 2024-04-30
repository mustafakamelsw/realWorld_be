import { Request, Response } from 'express';
import { AppDataSource } from '../../ormconfig';
import { Article } from '../entities/article.entity';
import { getValidationErrorMessage } from '../utils/errors';
import { User } from '../entities/user';
import { internalServerError } from './common.controller';
import { Tag } from '../entities/tag.entity';
import { STATUS_CODES } from '../types/statusCodes';

export const createArticle = (req: Request, res: Response) => {
  const articleRepo = AppDataSource.getRepository(Article);
  const userRepo = AppDataSource.getRepository(User);
  const tagRepo = AppDataSource.getRepository(Tag);
  const { t } = req;
  //validation
  const { title, description, body, tagList } = req.body;
  if (!title || !description || !body) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(getValidationErrorMessage(t, { title, description, body }));
  }
  // get current user
  const userId = (req as any).user.id;
  userRepo
    .findOne({ where: { id: userId } })
    .then(async (currentUser) => {
      if (!currentUser) {
        const error = new Error(t('COMMON_ERROR.somethingWentWrong'));
        return internalServerError(error, req, res);
      } else {
        const tags = await Promise.all(
          tagList.map(async (tagId: number) => {
            let tag = await tagRepo.findOne({ where: { id: tagId } });
            return tag;
          })
        );
        const newArticle = articleRepo.create({
          title,
          description,
          body,
          tagList: tags,
          author: currentUser,
        });
        articleRepo
          .save(newArticle)
          .then((result) => {
            return res.status(STATUS_CODES.CREATED).json({
              article: {
                title: result.title,
                description: result.description,
                body: result.body,
                tagList: result.tagList,
              },
            });
          })
          .catch((err) => {
            console.log({ err });
            return internalServerError(err, req, res);
          });
      }
    })
    .catch((error) => {
      return internalServerError(error, req, res);
    });
};

export const updateArticle = async (req: Request, res: Response) => {
  const { t, body, params } = req;
  const articleRepo = AppDataSource.getRepository(Article);
  const tagRepo = AppDataSource.getRepository(Tag);

  let tags = [];
  if (body.tagList?.length > 0) {
    tags = await Promise.all(
      body.tagList.map(async (id: number) => {
        let tag = await tagRepo.findOne({ where: { id } });
        return tag;
      })
    );
  }

  articleRepo
    .findOne({ where: { id: Number(params.slug) }, relations: ['tagList'] })
    .then(async (article) => {
      if (!article) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          error: t('COMMON_ERROR.notFound'),
          errorDesc: t('ARTICLE.articleNotFound'),
        });
      }

      article.title = body.title || article.title;
      article.description = body.description || article.description;
      article.body = body.body || article.body;
      article.tagList = tags.length > 0 ? tags : article.tagList;

      await articleRepo.save(article);

      return res.status(STATUS_CODES.OK).json({ article });
    })
    .catch((error) => {
      console.log('Error:', error);
      return internalServerError(error, req, res);
    });
};
