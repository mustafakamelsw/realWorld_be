import { PROFILE_URLS } from './../constants/APP_PATH';
import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';
import { checkIsAuth } from '../middleware/checkIsAuth';
const router = Router();

router.get(PROFILE_URLS.GET_PROFILE, profileController.getProfile);
router.post(
  PROFILE_URLS.FOLLOW_USER,
  checkIsAuth,
  profileController.followUser
);
router.delete(
  PROFILE_URLS.UNFOLLOW_USER,
  checkIsAuth,
  profileController.unfollowUser
);
export { router as profileRouter };
