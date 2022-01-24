const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  code: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, expires: "10m", default: Date.now },
});

module.exports = mongoose.model("otp", otpSchema);
