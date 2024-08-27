import { NextFunction, Request, Response } from 'express';
import { query } from '../db';
import bcrypt from 'bcrypt';
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
      const user = await UserController.Model.findById(userId);

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
    const { userId, ...updatedData } = req.validatedData;

    try {
      if (Object.keys(updatedData).length === 0)
        return res.json(await UserController.Model.findById(userId));

      const updatedUser = await UserController.Model.update(userId, updatedData);

      return res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.validatedData;

    try {
      const user = await UserController.Model.findById(userId);

      if (null == user) throw new HttpError({ message: 'User not found', status: 404 });

      await UserController.Model.delete(userId as UUID);

      return res.json({ info: 'User deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async getByCredentials(req: Request, res: Response) {
    const { email } = req.validatedData;

    if (null == email) return res.status(400).json({ error: 'bad request' });

    const sql = 'SELECT * FROM users WHERE email = $1';
    const user = await query(sql, [email]);

    return res.json(user);
  }

  static async checkUsernameExists(req: Request, _res: Response, next: NextFunction) {
    const { username } = req.validatedData;

    try {
      const { rowCount } = await UserController.Model.findByColumnValue('username', username);

      if (rowCount === 0) return next();

      throw new HttpError({ status: 409, message: 'The username already exists' });
    } catch (error) {
      next(error);
    }
  }

  static async checkEmailExists(req: Request, _res: Response, next: NextFunction) {
    const { email } = req.validatedData;

    try {
      const { rowCount } = await UserController.Model.findByColumnValue('email', email);

      if (rowCount === 0) return next();

      throw new HttpError({ status: 409, message: 'The email already exists' });
    } catch (error) {
      next(error);
    }
  }

  static async checkUserExists(req: Request, _res: Response, next: NextFunction) {
    const { userId } = req.validatedData;
    try {
      const user = await UserController.Model.findById(userId);
      console.log(userId, user);

      if (null != user) return next();

      throw new HttpError({ status: 404, message: 'User does not exist' });
    } catch (error) {
      next(error);
    }
  }

  static async checkUserCredentials(req: Request, _res: Response, next: NextFunction) {
    const { email, password, username } = req.validatedData;

    try {
      let userRecord;

      if (email) {
        userRecord = await UserController.Model.findByColumnValue('email', email);
      }

      if ((userRecord == null || userRecord?.rowCount == 0) && username) {
        userRecord = await UserController.Model.findByColumnValue('username', username);
      }

      if (null == userRecord || userRecord.rowCount == 0 || userRecord.rows.length === 0) {
        throw new HttpError({ status: 404, message: 'User not found' });
      }

      const [user] = userRecord.rows;

      if (!(await bcrypt.compare(password, user.password))) {
        throw new HttpError({ message: 'Unathorized', status: 401 });
      }

      req.authData = {
        email: user.email,
        id: user.id,
        username: user.username,
      };

      return next();
    } catch (error) {
      next(error);
    }
  }
}
