import { Router } from 'express';
import FileController from '../controllers/FileController';
import { folderIdRule } from '../validation/folderValidation';
import { validateData } from '../middlewares';
import { fileIdRule, filePostRules, filePutRules } from '../validation/fileValidation';
import FolderController from '../controllers/FolderController';

const router = Router({ mergeParams: true });

router.get(
  '/:fileId',
  folderIdRule,
  fileIdRule,
  validateData,
  FolderController.checkIfRootFolder,
  FileController.getOne
);

router.delete(
  '/:fileId',
  fileIdRule,
  validateData,
  FolderController.checkIfRootFolder,
  FileController.checkFileExists,
  FileController.delete
);

router.put(
  '/:fileId',
  folderIdRule,
  fileIdRule,
  filePutRules,
  validateData,
  FolderController.checkIfRootFolder,
  FileController.checkFileExists,
  FileController.checkDuplicateNameFile,
  FileController.update
);

router.post(
  '/',
  folderIdRule,
  filePostRules,
  validateData,
  FolderController.checkIfRootFolder,
  FileController.checkDuplicateNameFile,
  FileController.create
);

router.get(
  '/',
  folderIdRule,
  validateData,
  FolderController.checkIfRootFolder,
  FileController.getAllFromFolder
);

export default router;
