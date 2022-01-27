const UploadService = require("../services/upload.service");
const UserModel = require("../models/users.model");
const { Contract } = require("../utils/contract");
const MailService = require("../services/mail.service");
const sharp = require("sharp");
const config = require("../config");
const generateNFTAsset = require("../utils/generateNFTAsset");
const logger = require("../utils/logger");

module.exports = function (agenda) {
  agenda.define("mint-nft", async (job) => {
    logger.info("Starting minting");
    const { user, address } = job.attrs.data;

    const userInfo = await UserModel.findOne({ email: user.email });

    if (!userInfo) return;

    const { name, email, isAvailable, isVerified } = userInfo;

    // if user has minted nft before
    if (isVerified) return;

    const totalSupply = await Contract.methods.totalSupply().call();

    const svg = await generateNFTAsset({
      user: userInfo,
      ticketNumber: Number(totalSupply) + 1,
    });

    const { url } = await UploadService.uploadImage(svg);

    const metadata = {
      image: url,
      name,
      description: `${name} event ticket`,
      attributes: [
        {
          "attendee-type": isAvailable ? "physical" : "virtual",
        },
      ],
    };

    const tokenURI = await UploadService.uploadMetadataToIPFS(metadata);

    await Contract.methods
      .mint(address, tokenURI, isAvailable)
      .send({ from: config.SIGNING_ADDRESS });

    const fileBuffer = await sharp(Buffer.from(svg)).png();

    await MailService.sendNFTMintedMail({
      email,
      name,
      fileBuffer,
      nft: { url, tokenURI },
    });

    // update user verification status after svg generation is completed
    await UserModel.findOneAndUpdate(
      { email },
      { isVerified: true, tokenURI, image: url }
    );

    logger.info("MINTING ENDED");
  });
};
