import { TAG_URLS } from '../constants/APP_PATH';
import { Router } from 'express';
import * as tagController from '../controllers/tag.controller';
import { checkIsAuth } from '../middleware/checkIsAuth';
const router = Router();

router.post(TAG_URLS.CREATE_TAG, checkIsAuth, tagController.createTag);
router.get(TAG_URLS.GET_TAGS, tagController.searchTags);
export { router as tagRouter };
