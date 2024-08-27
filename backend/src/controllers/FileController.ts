import { NextFunction, Request, Response } from 'express';
import { File } from '../models/File';
import { HttpError } from '../errors/HttpError';
import { UUID } from 'crypto';

export default class FileController {
  static Model = new File();

  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const files = await FileController.Model.findAll();

      return res.json(files);
    } catch (error) {
      next(error);
    }
  }

  static async getAllFromFolder(req: Request, res: Response, next: NextFunction) {
    const { userId, folderId } = req.validatedData;
    try {
      const files = await FileController.Model.findAllByFolder(folderId, userId);

      return res.json(files);
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    const { fileId, folderId } = req.validatedData;

    try {
      const file = await FileController.Model.findByFolder(fileId, folderId as UUID);

      if (null == file) throw new HttpError({ status: 404, message: 'File not found' });

      return res.json(file);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    const { userId, folderId, folder_id, ...data } = req.validatedData;

    try {
      const newFile = await FileController.Model.create({
        folder_id: (folderId as UUID) ?? folder_id ?? null,
        ...data,
      });

      return res.status(201).json(newFile);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const { fileId } = req.validatedData;

    try {
      await FileController.Model.delete(fileId);

      return res.json({ info: 'File deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const { userId, fileId, folderId, ...updatedData } = req.validatedData;

    try {
      if (Object.keys(updatedData).length === 0) {
        console.log('asd');
        return res.json(await FileController.Model.findByFolder(fileId, folderId as UUID));
      }

      const updatedFile = await FileController.Model.update(fileId, updatedData);

      return res.json(updatedFile);
    } catch (error) {
      next(error);
    }
  }

  static async checkFileExists(req: Request, _res: Response, next: NextFunction) {
    const { fileId } = req.validatedData;
    try {
      const file = await FileController.Model.findById(fileId);

      if (null != file) return next();

      throw new HttpError({ status: 404, message: 'File not found' });
    } catch (error) {
      next(error);
    }
  }

  static async checkDuplicateNameFile(req: Request, _res: Response, next: NextFunction) {
    const { name, folderId } = req.validatedData;
    try {
      const file = await FileController.Model.findByNameAndFolder(name, folderId as UUID);

      if (null == file) return next();

      throw new HttpError({ status: 409, message: `File '${name}' already exists in this folder` });
    } catch (error) {
      next(error);
    }
  }
}
