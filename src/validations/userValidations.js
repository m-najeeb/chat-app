const Joi = require("joi");
const constants = require("../utilities/constants");

class userValidation {
  async signUp(userData) {
    const schema = Joi.object({
      profilePicture: Joi.string().uri().optional(),
      fullName: Joi.string().max(55).required(),
      username: Joi.string().max(55).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().length(11).required(),
      country: Joi.string().optional(),
      password: Joi.string()
        .regex(constants.PASSWORD.REGEX)
        .required()
        .messages({
          "string.pattern.base": constants.PASSWORD.MESSAGE_FORMAT,
        }),
    });
    return schema.validate(userData);
  }

  async signIn(userData) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    return schema.validate(userData);
  }

  async profileEdit(userData) {
    const schema = Joi.object({
      id: Joi.string().required(),
      profilePicture: Joi.string().uri().optional(),
      fullName: Joi.string().max(55).optional(),
      phone: Joi.string().length(11).optional(),
      country: Joi.string().optional(),
    });
    return schema.validate(userData);
  }

  async verifyOTP(userData) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      otp: Joi.string().length(6).required(),
    });
    return schema.validate(userData);
  }

  async changePassword(userData) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      currentPassword: Joi.string().required(),
      newPassword: Joi.string()
        .regex(constants.PASSWORD.REGEX)
        .required()
        .messages({
          "string.pattern.base": constants.PASSWORD.MESSAGE_FORMAT,
        }),
    });
    return schema.validate(userData);
  }
}

module.exports = new userValidation();
