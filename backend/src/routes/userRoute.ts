import { Router } from 'express';
import UserController from '../controllers/UserController';
import { validateData, hashPassword, checkUserPermission } from '../middlewares';
import { userIdRule, userPostRules, userPutRules } from '../validation';
import folderRoute from './folderRoute';

const router = Router();

router.use('/:userId/folders/', folderRoute);

router.get('/:userId', checkUserPermission, UserController.getOne);

router.put(
  '/:userId',
  userPutRules,
  userIdRule,
  validateData,
  UserController.checkUsernameExists,
  UserController.checkEmailExists,
  hashPassword,
  UserController.update
);

router.delete('/:userId', userIdRule, validateData, UserController.delete);

router.post(
  '/',
  userPostRules,
  validateData,
  UserController.checkUsernameExists,
  UserController.checkEmailExists,
  hashPassword,
  UserController.create
);

router.get('/', UserController.getAll);

export default router;
