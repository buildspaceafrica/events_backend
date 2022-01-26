
const fs = require("fs").promises;
const path = require("path");
const UploadService = require("../services/upload.service");
const UserModel = require("../models/users.model");
const Contract = require("../utils/contract");
const MailService = require("../services/mail.service")
const generateQRCode = require("../utils/generateQRCode");
const capitalize = require("../utils/capitalize");
const sharp = require("sharp")


module.exports = function (agenda){
    agenda.define("mint-nft", async (job) => {
        try {
        const userInfo = job.attrs.data;

        const {name, email} = userInfo;

        let svg = await fs.readFile(path.resolve('./src/assets/ticket.svg'), "utf-8");

        const [firstName = "", lastName = ""] = name.split(" ");

        const qrcode = await generateQRCode(
          `name=${name}\nemail=${email}`
        );
    
        svg = svg
          .replace("{{FIRST_NAME}}", capitalize(firstName))
          .replace("{{LAST_NAME}}", capitalize(lastName))
          .replace("{{QR_CODE}}", qrcode);
    
        const {url} = await UploadService.uploadImage(svg);
    
        const metadata = {
          image: url,
          name,
          description: `${name} event ticket`,
          attributes: {
            email,
          },
        };
    
        const tokenURI = await UploadService.uploadMetadataToIPFS(metadata);
    
        

        const fileBuffer = await sharp(Buffer.from(svg)).png();

        MailService.sendNFTMintedMail({email, name, fileBuffer, nft: {url, tokenURI}})

        // update user verification status after svg generation is completed
        await UserModel.findOneAndUpdate(
            { email },
            { isVerified: true, tokenURI, image: url }
          );

       
        } catch (error) {
            console.log({error})
        }
    })
}