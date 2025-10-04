import * as Joi from "joi";

export const employeeDataValidationSchema = Joi.object({
  employeeId: Joi.string()
    .trim()
    .pattern(/^[A-Za-z][A-Za-z0-9_-]*$/)
    .message(
      "Employee ID must start with a letter and can only contain letters, numbers, underscores, or dashes"
    )
    .min(3)
    .max(20)
    .required()
    .messages({
      "string.empty": "Employee ID is required",
      "string.min": "Employee ID must be at least 3 characters",
      "string.max": "Employee ID must be at most 20 characters",
    }),

  name: Joi.string()
    .trim()
    .pattern(/^[A-Za-z][A-Za-z0-9_]*(?: [A-Za-z0-9_]+)*$/)
    .message(
      "Name must start with a letter and can contain letters, numbers, underscores, and single spaces (no leading or multiple spaces)"
    )
    .min(3)
    .required()
    .messages({
      "string.empty": "Employee name is required",
      "string.min": "Must be at least 3 characters",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^(?:\+?[0-9]{1,3}[- ]?)?[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base":
        "Phone number must be 10 digits, with optional country code",
    }),

  position: Joi.string()
    .trim()
    .pattern(/^[A-Za-z][A-Za-z\s/-]*$/)
    .message(
      "Position must start with a letter and can only contain letters, spaces, dashes, or slashes"
    )
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Position is required",
      "string.min": "Position must be at least 2 characters",
      "string.max": "Position must be at most 50 characters",
    }),
});
