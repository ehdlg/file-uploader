import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError';
import { Folder } from '../models/Folder';
import { ROOT_FOLDER_NAME } from '../constants';

export default class FolderController {
  static Model = new Folder();

  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const folders = await FolderController.Model.findAll();

      return res.json(folders);
    } catch (error) {
      next(error);
    }
  }

  static async getAllFromUser(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.validatedData;

    try {
      const folders = await FolderController.Model.findAllByUser(userId);

      return res.json(folders);
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    const { folderId, userId } = req.validatedData;
    try {
      const folder = await FolderController.Model.findByUserId(folderId, userId);

      if (null == folder) throw new HttpError({ status: 404, message: 'Folder not found' });

      return res.json(folder);
    } catch (error) {
      next(error);
    }
  }

  static async getSubfolders(req: Request, res: Response, next: NextFunction) {
    const { folderId } = req.validatedData;

    try {
      const subfolders = await FolderController.Model.findSubfolders(folderId);

      return res.json(subfolders);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    const { name, userId, folderId } = req.validatedData;

    try {
      const newFolder = await FolderController.Model.create({
        name,
        user_id: userId,
        parent_id: folderId,
      });

      return res.status(201).json(newFolder);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const { folderId } = req.validatedData;

    try {
      await FolderController.Model.delete(folderId);

      return res.json({ info: 'Folder deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async checkParentExists(req: Request, _res: Response, next: NextFunction) {
    const { parent_id } = req.validatedData;

    if (null == parent_id) return next();

    try {
      const folder = await FolderController.Model.findById(parent_id);

      if (null != folder) return next();

      throw new HttpError({ status: 404, message: 'The parent folder does not exist' });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const { folderId, userId, ...updatedData } = req.validatedData;

    try {
      if (Object.keys(updatedData).length === 0)
        return res.json(await FolderController.Model.findById(folderId));

      const updatedFolder = await FolderController.Model.update(folderId, updatedData);

      return res.json(updatedFolder);
    } catch (error) {
      next(error);
    }
  }

  static async checkFolderExists(req: Request, _res: Response, next: NextFunction) {
    const { folderId } = req.validatedData;

    try {
      const folder = await FolderController.Model.findById(folderId);

      if (null != folder) return next();

      throw new HttpError({ status: 404, message: 'Folder does not exist' });
    } catch (error) {
      next(error);
    }
  }

  static async checkDuplicateFolder(req: Request, _res: Response, next: NextFunction) {
    const { name, userId, folderId } = req.validatedData;

    try {
      const folder = await FolderController.Model.findByNameParentAndUser(name, userId, folderId);

      if (null == folder) return next();

      throw new HttpError({
        status: 409,
        message: 'Duplicate folder name',
      });
    } catch (error) {
      next(error);
    }
  }

  static async checkIfRootFolder(req: Request, _res: Response, next: NextFunction) {
    const { folderId, userId } = req.validatedData;

    if ((folderId as string) === ROOT_FOLDER_NAME) {
      const value = await FolderController.Model.findRootId(userId);

      req.validatedData.folderId = value.id;
    }

    return next();
  }
}
