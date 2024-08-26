import { Router } from 'express';
import { folderIdRule, folderPostRules, folderPutRules } from '../validation/folderValidation';
import FolderController from '../controllers/FolderController';
import { validateData } from '../middlewares';
import { userIdRule } from '../validation';

const router = Router({ mergeParams: true });

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
  userIdRule,
  folderPostRules,
  validateData,
  FolderController.checkIfRootFolder,
  FolderController.checkDuplicateFolder,
  FolderController.create
);

router.get('/', userIdRule, validateData, FolderController.getAllFromUser);

export default router;
