const Joi = require("@hapi/joi");
const {isValidAddress} = require("../utils/contract")

const MintTokenPayloadSchema = Joi.object().keys({
  otp: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required().custom((value, helper) => {
    if(!isValidAddress(value)) return helper.error('any.invalid');
    return true;
  })
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
