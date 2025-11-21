// backend/middleware/validation.js
const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
exports.validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// User login validation
exports.validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Profile update validation
exports.validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  handleValidationErrors
];

// Skill validation
exports.validateSkill = [
  body('skill')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Skill must be between 2 and 50 characters'),
  body('proficiency')
    .optional()
    .isIn(['beginner', 'intermediate', 'expert'])
    .withMessage('Proficiency must be beginner, intermediate, or expert'),
  body('currentLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Current level must be beginner, intermediate, or advanced'),
  handleValidationErrors
];

// Chat message validation
exports.validateMessage = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('messageType')
    .optional()
    .isIn(['text', 'image', 'file', 'system'])
    .withMessage('Invalid message type'),
  handleValidationErrors
];

// Session validation
exports.validateSession = [
  body('teacherId')
    .isMongoId()
    .withMessage('Valid teacher ID is required'),
  body('skill')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Skill must be between 2 and 50 characters'),
  body('scheduledDate')
    .isISO8601()
    .withMessage('Valid date is required')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Scheduled date must be in the future');
      }
      return true;
    }),
  body('duration')
    .isInt({ min: 15, max: 240 })
    .withMessage('Duration must be between 15 and 240 minutes'),
  body('agenda')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Agenda cannot exceed 500 characters'),
  handleValidationErrors
];