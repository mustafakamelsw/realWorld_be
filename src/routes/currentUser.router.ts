import { CURRENT_USER } from '../constants/APP_PATH';
import { Router } from 'express';
import * as currentUserController from '../controllers/currentUser.controller';
const router = Router();

router.get(CURRENT_USER.GET_CURRENT, currentUserController.getCurrentUser);
router.put(CURRENT_USER.UPDATE, currentUserController.updateUser);
export { router as currentUserRouter };
