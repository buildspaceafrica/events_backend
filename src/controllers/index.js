const Response = require("../utils/response");
const mailService = require("../services/mail.service");
const UserModel = require("../models/users.model");
const OtpModel = require("../models/otp.model");
const generateOtp = require("../utils/generateOtp");
const CustomError = require("../utils/custom-error");
const agenda = require("../utils/agenda");
const config = require("../config");

class Contoller {
  async registUser(req, res, next) {
    if (config.STOP_PHYSICAL_MINTING && req.body?.isAvailable) {
      throw new CustomError("Physical minting has ended");
    }

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
    const { otp, email, address } = req.body;
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

    agenda.now("mint-nft", { address, user });

    res.send(
      Response(
        "NFT minting is in progress. You would receive a mail when minting ends successfully"
      )
    );
  }
}

module.exports = new Contoller();
