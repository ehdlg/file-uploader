import { Router } from 'express';
import UserController from '../controllers/UserController';
import { validateData } from '../middlewares';
import { userIdRule, userPostRules, userPutRules } from '../validation';

const router = Router();

router.get('/:userId', userIdRule, validateData, UserController.getOne);

router.put('/:userId', userPutRules, validateData, UserController.update);

router.delete('/:userId', userIdRule, validateData, UserController.delete);

router.post(
  '/',
  userPostRules,
  validateData,
  UserController.checkUsernameExists,
  UserController.checkEmailExists,
  UserController.create
);

router.get('/', UserController.getAll);

export default router;
