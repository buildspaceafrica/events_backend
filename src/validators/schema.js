const Joi = require("@hapi/joi");

const MintTokenPayloadSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

module.exports = {
  MintTokenPayloadSchema,
};
