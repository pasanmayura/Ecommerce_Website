const Joi = require('joi');

// Validation schema for user registration
const registerUserSchema = Joi.object({
  FirstName: Joi.string().pattern(/^[a-zA-Z]+$/).required().messages({
    'string.pattern.base': 'First name should only contain letters!',
    'any.required': 'First name is required!',
  }),
  LastName: Joi.string().pattern(/^[a-zA-Z]+$/).required().messages({
    'string.pattern.base': 'Last name should only contain letters!',
    'any.required': 'Last name is required!',
  }),
  Email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format!',
    'any.required': 'Email is required!',
  }),
  PhoneNumber: Joi.string().pattern(/^\d{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be a valid 10-digit number!',
    'any.required': 'Phone number is required!',
  }),
  Password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long!',
    'any.required': 'Password is required!',
  }),
});

// Validation schema for user login
const loginUserSchema = Joi.object({
  Email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format!',
    'any.required': 'Email is required!',
  }),
  Password: Joi.string().required().messages({
    'any.required': 'Password is required!',
  }),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
};