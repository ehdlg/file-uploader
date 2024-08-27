import { Router } from 'express';
import UserController from '../controllers/UserController';
import { validateData, hashPassword, createToken } from '../middlewares';
import { userLoginRules, userIdRule, userPostRules, userPutRules } from '../validation';
import folderRoute from './folderRoute';

const router = Router();

router.use('/:userId/folders/', folderRoute);

router.get('/:userId', userIdRule, validateData, UserController.getOne);

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
  '/login',
  userLoginRules,
  validateData,
  UserController.checkUserCredentials,
  createToken
);

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
