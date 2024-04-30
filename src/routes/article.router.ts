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
export { router as articleRouter };
