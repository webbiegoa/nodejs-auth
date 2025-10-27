import { body, ValidationChain } from 'express-validator';

export class AuthValidator {
  static signupValidation(): ValidationChain[] {
    return [
      body('firstname')
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),

      body('lastname')
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),

      body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address'),

      body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

      body('phone')
        .notEmpty().withMessage('Phone number is required')
        .isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
    ];
  }

  static loginValidation(): ValidationChain[] {
    return [
      body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address'),

      body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ];
  }

  static forgotPasswordValidation(): ValidationChain[] {
    return [
      body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address'),      
    ];
  }

  static resetPasswordValidation(): ValidationChain[] {
    return [
      body('token')
        .notEmpty().withMessage('Token is required'),
      body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ];
  }
}
