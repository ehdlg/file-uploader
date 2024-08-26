import { body, param } from 'express-validator';
import { ROOT_FOLDER_NAME } from '../constants';

export const invalidFolder = (value: string) => {
  if (value === null || value === ROOT_FOLDER_NAME) {
    return true;
  }

  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (uuidRegex.test(value)) {
    return true;
  }

  throw new Error('Invalid folder ID');
};

export const folderIdRule = (() => {
  return [
    param('folderId').exists().withMessage('Folder ID must be sent').bail().custom(invalidFolder),
  ];
})();

export const folderPostRules = (() => {
  return [
    param('folderId').optional({ values: 'null' }).custom(invalidFolder),

    body('name')
      .exists()
      .withMessage('A folder name must be sent')
      .bail()
      .notEmpty()
      .withMessage('Folder name must not be empty'),
  ];
})();

export const folderPutRules = (() => {
  return [
    param('folderId').optional({ values: 'null' }).custom(invalidFolder),

    body('name')
      .optional()
      .exists()
      .withMessage('A folder name must be sent')
      .bail()
      .notEmpty()
      .withMessage('Folder name must not be empty'),
  ];
})();
