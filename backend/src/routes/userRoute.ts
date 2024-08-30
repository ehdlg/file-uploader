import { Router } from 'express';
import UserController from '../controllers/UserController';
import { validateData, hashPassword, checkUserPermission, verifyToken } from '../middlewares';
import { userPostRules, userPutRules } from '../validation';
import folderRoute from './folderRoute';

const router = Router();

router.use('/:userId/folders/', verifyToken, checkUserPermission, folderRoute);

router.get('/:userId', verifyToken, checkUserPermission, validateData, UserController.getOne);

router.put(
  '/:userId',
  verifyToken,
  checkUserPermission,
  userPutRules,
  validateData,
  UserController.checkUsernameExists,
  UserController.checkEmailExists,
  hashPassword,
  UserController.update
);

router.delete('/:userId', verifyToken, checkUserPermission, validateData, UserController.delete);

router.post(
  '/',
  userPostRules,
  validateData,
  UserController.checkUsernameExists,
  UserController.checkEmailExists,
  hashPassword,
  UserController.create
);
//TODO add check admin permission
router.get('/', UserController.getAll);

export default router;
