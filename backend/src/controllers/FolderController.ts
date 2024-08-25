import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError';
import { Folder } from '../models/Folder';

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
    console.log(folderId, userId);
    try {
      const folder = await FolderController.Model.findByUserId(folderId, userId);
      console.log(folder);

      if (null == folder) throw new HttpError({ status: 404, message: 'Folder not found' });

      return res.json(folder);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    const { name, userId, parent_id } = req.validatedData;

    try {
      const newFolder = await FolderController.Model.create({
        name,
        user_id: userId,
        parent_id: parent_id ?? null,
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
    const { name, userId, parent_id } = req.validatedData;

    try {
      const folder = await FolderController.Model.findByNameParentAndUser(
        name,
        userId,
        parent_id ?? null
      );

      if (null == folder) return next();

      throw new HttpError({
        status: 409,
        message: 'Duplicate folder name',
      });
    } catch (error) {
      next(error);
    }
  }
}
