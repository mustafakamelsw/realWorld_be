import { USERS_URLs } from '../constants/APP_PATH';
import { Router } from 'express';
import * as usersController from '../controllers/users.controller';
import { upload } from '../utils/storage';
import { checkIsForbidden } from '../middleware/checkisForbidden';
const router = Router();

router.post(USERS_URLs.LOGIN, usersController.login);
router.post(USERS_URLs.REGISTER, usersController.register);
router.put(
  USERS_URLs.UPDATE,
  checkIsForbidden,
  upload.single('image'),
  usersController.updateUser
);
export { router as userRouter };
