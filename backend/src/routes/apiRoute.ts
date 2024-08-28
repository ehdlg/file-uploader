import Router, { Request, Response } from 'express';
import userRouter from './userRoute';
import { createToken, validateData, verifyToken } from '../middlewares';
import UserController from '../controllers/UserController';
import { userLoginRules } from '../validation';

const router = Router();

router.post(
  '/login',
  userLoginRules,
  validateData,
  UserController.checkUserCredentials,
  createToken
);

router.use('/users', verifyToken, userRouter);

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the File Uploader API' });
});

export default router;
