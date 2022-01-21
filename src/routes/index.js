const router = require("express").Router();
const Validator = require("../validators");
const { MintTokenPayloadSchema } = require("../validators/schema");
const Controller = require("../controllers");

router.post(
  "/mint-ticket",
  Validator(MintTokenPayloadSchema),
  Controller.mintTicket
);

module.exports = router;
