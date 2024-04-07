import { USERS_URLs } from '../constants/APP_PATH';
import { Router } from 'express';
import * as usersController from '../controllers/users.controller';
const router = Router();

router.post(USERS_URLs.LOGIN, usersController.login);
router.post(USERS_URLs.REGISTER, usersController.register);

export { router as userRouter };
