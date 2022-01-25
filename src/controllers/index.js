const Response = require("../utils/response");
const UploadService = require("../services/upload.service");
const mailService = require("../services/mail.service");
const UserModel = require("../models/users.model");
const OtpModel = require("../models/otp.model");
const fs = require("fs").promises;
const path = require("path");
const generateOtp = require("../utils/generateOtp");
const CustomError = require("../utils/custom-error");
const capitalize = require("../utils/capitalize");

class Contoller {
  async registUser(req, res, next) {
    const exists = await UserModel.findOne({ email: req.body.email });
    let user;

    if (exists) {
      // if user exists and has minted
      if (exists.isVerified) {
        throw new CustomError("User already registered");
      }

      user = exists;
    } else {
      user = await UserModel.create(req.body);
    }

    const otp = generateOtp();

    // update user otp or create a new document if it dosen't exist
    await OtpModel.findOneAndUpdate(
      { email: user.email },
      { code: otp },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await mailService.sendEmailVerificationMail(otp, user.email);

    return res.send(Response("User successfully registered"));
  }

  async mintTicket(req, res, next) {
    const { otp, email } = req.body;
    const otpDetails = await OtpModel.findOne({ code: otp, email });

    if (!otpDetails) {
      throw new CustomError("Invalid Otp");
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new CustomError("User dosen't exist");
    }

    if (user.isVerified) {
      throw new CustomError("User has minted before");
    }

    let svg = await fs.readFile(path.join(__dirname, "ticket.svg"), "utf-8");

    const [firstName = "", lastName = ""] = user.name.split(" ");

    svg = svg
      .replace("{{FIRST_NAME}}", capitalize(firstName))
      .replace("{{LAST_NAME}}", capitalize(lastName));

    const { url } = await UploadService.uploadImage(svg);

    const metadata = {
      image: url,
      name: user.name,
      description: `${user.name} event ticket`,
      attributes: {
        email,
      },
    };

    const tokenURI = await UploadService.uploadMetadataToIPFS(metadata);

    // update user verification status after svg generation is completed
    await UserModel.findOneAndUpdate(
      { email },
      { isVerified: true, tokenURI, image: url }
    );

    return res.send(
      Response("Token successfully minted", { imageUrl: url, tokenURI })
    );
  }
}

module.exports = new Contoller();
