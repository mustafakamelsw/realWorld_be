import { Request, Response } from 'express';
import { AppDataSource } from '../../ormconfig';
import { Article } from '../entities/article.entity';
import { getValidationErrorMessage } from '../utils/errors';
import { User } from '../entities/user';
import { internalServerError } from './common.controller';
import { Tag } from '../entities/tag.entity';
import { STATUS_CODES } from '../types/statusCodes';
import { In } from 'typeorm';

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
                author: result.author,
              },
            });
          })
          .catch((err) => {
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
      if ((req as any).user?.id == article.author) {
        return res.status(STATUS_CODES.FORBIDDEN).json({
          error: t('COMMON_ERROR.forbidden'),
          errorDesc: t('ARTICLE.forbidden'),
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
      return internalServerError(error, req, res);
    });
};

export const getArticles = (req: Request, res: Response) => {
  const articleRepo = AppDataSource.getRepository(Article);
  const userRepo = AppDataSource.getRepository(User);
  const { t } = req;
  const { limit, offset } = req.query;
  const { tag } = req.query;
  const { author } = req.query;
  //TODO: add favorite list on article entity
  const { favorited } = req.query;

  let query = articleRepo.createQueryBuilder('article');
  if (tag) {
    query = query.leftJoinAndSelect('article.tagList', 'tag');
    query = query.where('tag.name = :tag', { tag });
  }
  if (author) {
    query = query.leftJoinAndSelect('article.author', 'author');
    query = query.where('author.id = :author', { author });
  }

  query = query.skip(offset ? Number(offset) : 0);
  query = query.take(limit ? Number(limit) : 10);
  query = query.orderBy('article.createdAt', 'DESC');
  query
    .getMany()
    .then((articles) => {
      return res.status(STATUS_CODES.OK).json({ articles });
    })
    .catch((error) => {
      return internalServerError(error, req, res);
    });
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { params, user, t } = req as any;
  const articleRepo = AppDataSource.getRepository(Article);

  try {
    const article = await articleRepo.findOne({
      where: { id: params.slug },
      relations: ['author', 'tagList'],
    });

    if (!article) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        error: t('COMMON_ERROR.notFound'),
        errorDesc: t('ARTICLE.articleNotFound'),
      });
    }

    if (article.author.id !== user.id) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        error: t('COMMON_ERROR.forbidden'),
        errorDesc: t('ARTICLE.deleteForbidden'),
      });
    }

    // Remove the associations between Tag and Article
    await Promise.all(
      article.tagList.map(async (tag) => {
        tag.articles = tag.articles.filter((a) => a.id !== article.id);
        const tagRepo = AppDataSource.getRepository(Tag);
        await tagRepo.save(tag);
      })
    );

    // Now delete the article
    await articleRepo.delete(article.id);

    return res.status(STATUS_CODES.CREATED).json({
      message: t('ARTICLE.articleDeleted'),
    });
  } catch (error: any) {
    console.log('sdfsdfsdf', error);
    return internalServerError(error, req, res);
  }
};

export const favoriteArticle = (req: Request, res: Response) => {
  const articleRepo = AppDataSource.getRepository(Article);
  const userRepo = AppDataSource.getRepository(User);
  const { slug } = req.params;
  const { user } = req as any;

  const { t } = req;
  articleRepo
    .findOne({
      where: { id: Number(slug) },
      relations: {
        favoritedBy: true,
      },
    })
    .then(async (article) => {
      if (!article) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          error: t('COMMON_ERROR.notFound'),
          errorDesc: t('ARTICLE.articleNotFound'),
        });
      }
      const currentUser = await userRepo.findOne({
        where: {
          id: Number(user.id),
        },
      });
      if (currentUser) {
        if (article.favoritedBy?.length > 0) {
          article.favoritedBy.push(user);
        } else {
          article.favoritedBy = [user];
        }
        await articleRepo.save(article);
        return res.status(STATUS_CODES.CREATED).json({ article });
      }
    })
    .catch((error) => {
      return internalServerError(error, req, res);
    });
};

export const unfavoriteArticle = (req: Request, res: Response) => {
  const articleRepo = AppDataSource.getRepository(Article);
  const userRepo = AppDataSource.getRepository(User);
  const { slug } = req.params;
  const { user } = req as any;

  const { t } = req;
  articleRepo
    .findOne({
      where: { id: Number(slug) },
      relations: {
        favoritedBy: true,
      },
    })
    .then(async (article) => {
      if (!article) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          error: t('COMMON_ERROR.notFound'),
          errorDesc: t('ARTICLE.articleNotFound'),
        });
      }
      const currentUser = await userRepo.findOne({
        where: {
          id: Number(user.id),
        },
      });
      if (currentUser) {
        const find = article.favoritedBy.find(
          (item) => item.id === currentUser.id
        );
        if (find) {
          article.favoritedBy = article.favoritedBy.filter(
            (item) => item.id !== currentUser.id
          );
        }
        await articleRepo.save(article);
        return res.status(STATUS_CODES.CREATED).json({ article });
      }
    })
    .catch((error) => {
      return internalServerError(error, req, res);
    });
};

export const getFeed = async (req: Request, res: Response) => {
  const { user, t } = req as any;
  const userRepo = AppDataSource.getRepository(User);
  const articleRepo = AppDataSource.getRepository(Article);
  const currentUser = await userRepo.findOne({
    where: {
      id: user.id,
    },
  });
  if (!currentUser) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      error: t('COMMON_ERROR.notFound'),
      errorDesc: t('USER.userNotFound'),
    });
  }

  const follows = currentUser.follow?.map((id) => Number(id));

  const articles = await articleRepo.findAndCount({
    where: {
      author: {
        id: In(follows), // Replace with the actual user IDs from the follow list
      },
    },
    relations: {
      author: true,
    },
  });
  return res
    .status(STATUS_CODES.OK)
    .json({ articles: articles[0], count: articles[1] });
};
