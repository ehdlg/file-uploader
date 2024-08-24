import { body, param } from 'express-validator';

export const folderIdRule = (() => {
  return [
    param('folderId')
      .exists()
      .withMessage('Folder ID must be sent')
      .bail()
      .isUUID()
      .withMessage('Invalid folder ID'),
  ];
})();

export const folderPostRules = (() => {
  return [
    body('name')
      .exists()
      .withMessage('A folder name must be sent')
      .bail()
      .notEmpty()
      .withMessage('Folder name must not be empty'),

    body('parent_id')
      .optional({ values: 'null' })
      .custom((value) => {
        if (value === null) {
          return true;
        }

        const uuidRegex =
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

        if (uuidRegex.test(value)) {
          return true;
        }

        throw new Error('Invalid parent folder ID');
      }),
  ];
})();

export const folderPutRules = (() => {
  return [
    body('name')
      .optional()
      .exists()
      .withMessage('A folder name must be sent')
      .bail()
      .notEmpty()
      .withMessage('Folder name must not be empty'),

    body('parent_id')
      .optional({ values: 'null' })
      .custom((value) => {
        if (value === null) {
          return true;
        }

        const uuidRegex =
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

        if (uuidRegex.test(value)) {
          return true;
        }

        throw new Error('Invalid parent folder ID');
      }),
  ];
})();
