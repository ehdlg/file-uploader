import { body, param } from 'express-validator';
import { PASSWORD_REGEXP } from '../constants';

export const userIdRule = (() => {
  return [
    param('userId')
      .exists()
      .withMessage('User ID must be sent')
      .bail()
      .isUUID()
      .withMessage('Invalid user ID'),
  ];
})();

export const userPostRules = (() => {
  return [
    body('username')
      .exists()
      .withMessage('Username must be sent')
      .bail()
      .notEmpty()
      .withMessage('Username must not be empty'),

    body('email')
      .exists()
      .withMessage('Email must be sent')
      .isEmail()
      .withMessage('The email is not valid'),

    body('password')
      .exists()
      .withMessage('Passwrod must be sent')
      .matches(PASSWORD_REGEXP)
      .withMessage(
        'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.'
      )
      .bail()
      .custom((value, { req }) => {
        return value === req.body.confirmPassword;
      })
      .withMessage('Passwords do not match'),
  ];
})();

export const userPutRules = (() => {
  return [
    body('username').optional().notEmpty().withMessage('Username must not be empty'),

    body('email').optional().isEmail().withMessage('The email is not valid'),

    body('password')
      .optional()
      .matches(PASSWORD_REGEXP)
      .withMessage(
        'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.'
      )
      .bail()
      .custom((value, { req }) => {
        return value === req.body.confirmPassword;
      })
      .withMessage('Passwords do not match'),
  ];
})();
