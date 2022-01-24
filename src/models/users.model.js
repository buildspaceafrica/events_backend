const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    image: { type: String },
    tokenURI: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", usersSchema);
