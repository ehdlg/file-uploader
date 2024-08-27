import Router, { Request, Response } from 'express';
import userRouter from './userRoute';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the File Uploader API' });
});

router.use('/users', userRouter);

export default router;
