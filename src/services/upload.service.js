const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");
const CustomError = require("./../utils/custom-error");
const { create } = require("ipfs-http-client");
const client = create("https://ipfs.infura.io:5001/api/v0");

class UploadService {
  uploadImage(svgString) {
    return new Promise(async (resolve, reject) => {
      let cloudinaryStreamUpload = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (result) resolve({ url: result.secure_url });
          else reject(new CustomError("Image Upload Failed", 400));
        }
      );

      sharp(Buffer.from(svgString)).pipe(cloudinaryStreamUpload);
    });
  }

  async uploadMetadataToIPFS(metadata) {
    const added = await client.add(JSON.stringify(metadata));

    const url = `https://ipfs.infura.io/ipfs/${added.path}`;

    return url;
  }
}

module.exports = new UploadService();
