import { Router } from 'express';
import FolderController from '../controllers/FolderController';
import fileRoute from './fileRoute';
import { folderIdRule, folderPostRules, folderPutRules, userIdRule } from '../validation';
import { validateData } from '../middlewares';

const router = Router({ mergeParams: true });

router.use('/:folderId/files', fileRoute);

router.get(
  '/:folderId/subfolders',
  userIdRule,
  folderIdRule,
  validateData,
  FolderController.checkIfRootFolder,
  FolderController.getSubfolders
);

router.get(
  '/:folderId',
  userIdRule,
  folderIdRule,
  validateData,
  FolderController.checkIfRootFolder,
  FolderController.getOne
);

router.delete(
  '/:folderId',
  userIdRule,
  folderIdRule,
  validateData,
  FolderController.checkFolderExists,
  FolderController.delete
);

router.put(
  '/:folderId',
  userIdRule,
  folderIdRule,
  folderPutRules,
  validateData,
  FolderController.checkIfRootFolder,
  FolderController.checkFolderExists,
  FolderController.update
);

router.post(
  '/:folderId',
  folderPostRules,
  validateData,
  FolderController.checkIfRootFolder,
  FolderController.checkDuplicateFolder,
  FolderController.create
);

router.get('/', validateData, FolderController.getAllFromUser);

export default router;
