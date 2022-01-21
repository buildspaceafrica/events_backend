const Response = require("../utils/response");
const UploadService = require("../services/upload.service");
const fs = require("fs").promises;
const path = require("path");

class Contoller {
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
