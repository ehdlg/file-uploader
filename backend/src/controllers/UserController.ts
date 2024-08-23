import { NextFunction, Request, Response } from 'express';
import { query } from '../db';
import { User as UserModel } from '../models/User';
import { HttpError } from '../errors/HttpError';
import { UUID } from 'crypto';

export default class UserController {
  static Model = new UserModel();

  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserController.Model.findAll();

      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.validatedData;

    try {
      const user = await UserController.Model.findById(userId as UUID);

      if (null == user) throw new HttpError({ status: 404, message: 'User not found' });

      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    const { username, email, password } = req.validatedData;

    try {
      const newUser = await UserController.Model.create({
        username,
        email,
        password,
      });

      return res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    const { email, password } = req.body;

    const updatedData = {
      email,
      password,
    };

    try {
      const updatedUser = await UserController.Model.update(userId as UUID, updatedData);

      return res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;

    try {
      const user = await UserController.Model.findById(userId as UUID);

      if (null == user) throw new HttpError({ message: 'User not found', status: 404 });

      await UserController.Model.delete(userId as UUID);

      return res.json({ info: 'User deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async getByCredentials(req: Request, res: Response) {
    const { email } = req.body;

    if (null == email) return res.status(400).json({ error: 'bad request' });

    const sql = 'SELECT * FROM users WHERE email = $1';
    const user = await query(sql, [email]);

    return res.json(user);
  }

  static async checkUsernameExists(req: Request, _res: Response, next: NextFunction) {
    const { username } = req.body;

    try {
      const { rowCount } = await UserController.Model.findByColumnValue('username', username);

      if (rowCount === 0) return next();

      throw new HttpError({ status: 409, message: 'The username already exists' });
    } catch (error) {
      next(error);
    }
  }

  static async checkEmailExists(req: Request, _res: Response, next: NextFunction) {
    const { email } = req.body;

    try {
      const { rowCount } = await UserController.Model.findByColumnValue('email', email);

      if (rowCount === 0) return next();

      throw new HttpError({ status: 409, message: 'The email already exists' });
    } catch (error) {
      next(error);
    }
  }
}
