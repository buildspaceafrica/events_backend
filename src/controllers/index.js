const Response = require("../utils/response");
const UploadService = require("../services/upload.service");
const mailService = require("../services/mail.service");
const UserModel = require("../models/users.model");
const OtpModel = require("../models/otp.model");
const fs = require("fs").promises;
const path = require("path");
const generateOtp = require("../utils/generateOtp");
const CustomError = require("../utils/custom-error");

class Contoller {
  async registUser(req, res, next) {
    const exists = await UserModel.findOne({ email: req.body.email });

    if (exists) {
      throw new CustomError("User already registered");
    }

    const user = await UserModel.create(req.body);

    const otp = generateOtp();
    await OtpModel.create({ email: user.email, code: otp });

    await mailService.sendEmailVerificationMail(otp, user.email);

    return res.send(Response("User successfully registered"));
  }

  async mintTicket(req, res, next) {
    const svg = await fs.readFile(path.join(__dirname, "test.svg"), "utf-8");

    const { url } = await UploadService.uploadImage(svg);
    const { name, email } = req.body;

    const metadata = {
      image: url,
      name,
      description: `${name} event ticket`,
      attributes: {
        email,
      },
    };

    const tokenURI = await UploadService.uploadMetadataToIPFS(metadata);

    return res.send(
      Response("Token successfully minted", { imageUrl: url, tokenURI })
    );
  }
}

module.exports = new Contoller();
