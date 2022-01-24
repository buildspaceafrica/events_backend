const crypto = require("crypto");

function generateOtp(length = 4) {
  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomNumber = crypto.randomInt(0, 9);
    otp += randomNumber;
  }

  return otp;
}

module.exports = generateOtp;
