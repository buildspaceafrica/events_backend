const router = require("express").Router();
const Validator = require("../validators");
const {
  MintTokenPayloadSchema,
  RegisterUserSchema,
} = require("../validators/schema");
const Controller = require("../controllers");

router.post(
  "/mint-ticket",
  Validator(MintTokenPayloadSchema),
  Controller.mintTicket
);

router.post("/register", Validator(RegisterUserSchema), Controller.registUser);

module.exports = router;
