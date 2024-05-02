import { ARTICLE_URLS } from './../constants/APP_PATH';
import { Router } from 'express';
import * as articleController from '../controllers/article.controller';
import { checkIsAuth } from '../middleware/checkIsAuth';
const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           description: article title
 *         body:
 *           type: string
 *           description: article body
 *         description:
 *           type: string
 *           description: article description
 *         tagList:
 *           type: array
 *           items:
 *             type: string
 *           description: article tag list
 */

/**
 * @swagger
 * /api/articles/:
 *   post:
 *     summary: create a new article
 *     tags:
 *       - article
 *     requestBody:
 *      require: true
 *      content:
 *       application/json:
 *         schema:
 *          type: object
 *          properties:
 *           title:
 *            type: string
 *            description: article title
 *           body:
 *            type: string
 *            description: article body
 *           description:
 *            type: string
 *            description: article description
 *           tagList:
 *            type: array
 *            items:
 *             type: string
 *             description: article tag list
 *     responses:
 *       200:
 *         description: create a new article for user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

router.post(
  ARTICLE_URLS.CREATE_ARTICLE,
  checkIsAuth,
  articleController.createArticle
);

router.put(
  ARTICLE_URLS.UPDATE_ARTICLE,
  checkIsAuth,
  articleController.updateArticle
);
router.get(ARTICLE_URLS.GET_ARTICLES, articleController.getArticles);
router.post(
  ARTICLE_URLS.FAVORITE_ARTICLE,
  checkIsAuth,
  articleController.favoriteArticle
);
router.delete(
  ARTICLE_URLS.UNFAVORITE_ARTICLE,
  checkIsAuth,
  articleController.unfavoriteArticle
);
router.delete(
  ARTICLE_URLS.DELETE_ARTICLE,
  checkIsAuth,
  articleController.deleteArticle
);

router.get(ARTICLE_URLS.GET_FEED, checkIsAuth, articleController.getFeed);
export { router as articleRouter };
