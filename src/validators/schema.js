const Joi = require("@hapi/joi");

const MintTokenPayloadSchema = Joi.object().keys({
  otp: Joi.string().required(),
  email: Joi.string().email().required(),
});

const RegisterUserSchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .regex(/^(\w+\s\w+)*$/, "Name must contain first and last name")
    .required(),
  email: Joi.string().email().required(),
  isAvailable: Joi.bool(),
});

module.exports = {
  MintTokenPayloadSchema,
  RegisterUserSchema,
};
