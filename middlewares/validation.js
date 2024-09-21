const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  // Allow both direct URLs and some Google Image URLs
  if (
    validator.isURL(value, {
      protocols: ["http", "https"],
      require_protocol: true,
    })
  ) {
    return value; // Allow non-image URLs for trial purposes
  }
  return helpers.error("string.uri"); // Invalid URL
};

module.exports.validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().custom(validateURL).messages({
      "string.uri": 'The "avatar" field must be a valid URL', // No strict image extension check
    }),
  }),
});

// Validation for creating a clothing item
module.exports.validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
  }),
});

// Validation for creating a user
module.exports.validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().custom(validateURL).messages({
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// Validation for updating a user profile (Profile Edit)
module.exports.validateUserProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().custom(validateURL).messages({
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
    // Email is optional for profile updates
    email: Joi.string().email().optional().allow(null, "").messages({
      "string.email": 'The "email" field must be a valid email',
    }),
  }),
});

// Validation for user login
module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// Validation for IDs (e.g., user ID, clothing item ID)
module.exports.validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.alternatives()
      .try(
        Joi.string().hex().length(24), // MongoDB ObjectID
        Joi.string().required() // Custom ID for default items
      )
      .messages({
        "string.hex": 'The "id" must be a valid hexadecimal or custom ID',
        "string.length": 'The "id" must be 24 characters long or a custom ID',
      })
      .required(),
  }),
});
