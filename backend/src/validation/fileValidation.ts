import { body, param } from 'express-validator';
import { invalidFolder } from './folderValidation';

export const fileIdRule = (() => {
  return [
    param('fileId')
      .exists()
      .withMessage('File ID must be sent')
      .bail()
      .isUUID()
      .withMessage('Invalid file ID'),
  ];
})();

export const filePostRules = (() => {
  return [
    body('name')
      .exists()
      .withMessage('A file name must be sent')
      .bail()
      .notEmpty()
      .withMessage('File name must not be empty'),

    body('mimetype')
      .exists()
      .withMessage('A mimetype must be sent')
      .bail()
      .notEmpty()
      .withMessage('File mimetype must not be empty'),

    body('url')
      .exists()
      .withMessage('File url must be sent')
      .bail()
      .notEmpty()
      .withMessage('File URL must not be empty')
      .bail()
      .isURL()
      .withMessage('Invalid file URL'),

    body('size')
      .exists()
      .withMessage('File size must be sent')
      .bail()
      .isInt({ min: 0 })
      .withMessage('File size must be an integer greater than 0'),
  ];
})();

export const filePutRules = (() => {
  return [
    body('name')
      .optional()
      .exists()
      .withMessage('A file name must be sent')
      .bail()
      .notEmpty()
      .withMessage('File name must not be empty'),

    body('mimetype')
      .optional()
      .exists()
      .withMessage('A mimetype must be sent')
      .bail()
      .notEmpty()
      .withMessage('File mimetype must not be empty'),

    body('url')
      .exists()
      .optional()
      .withMessage('File url must be sent')
      .bail()
      .notEmpty()
      .withMessage('File URL must not be empty')
      .bail()
      .isURL()
      .withMessage('Invalid file URL'),

    body('folder_id').optional({ values: 'null' }).custom(invalidFolder),
  ];
})();
