const formData = require("form-data");
const Mailgun = require("mailgun.js");
const path = require("path");
const fs = require('fs').promises;
const { MAILGUN } = require("./../config");
const mailgun = new Mailgun(formData);
const CustomError = require("./../utils/custom-error");
const logger = require("../utils/logger")


class MailService {
  constructor() {
    this.mailClient = mailgun.client({
      username: "api",
      key: MAILGUN.APIKEY,
      url: "https://api.eu.mailgun.net",
    });
    this.from = MAILGUN.EMAIL;
  }

  async send(messageParams) {
    const data = {
     ...messageParams,
      from: this.from,
    };

    try {
      // Invokes the method to send emails given the above data with the helper library
      const response = await this.mailClient.messages.create(
        MAILGUN.DOMAIN,
        data
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async sendEmailVerificationMail(otp, email) {
    const subject = "Email Verification";
    const html = `<h1>Verify your mail</h1><p>Your one time passcode is ${otp}</p>`;

    return await this.send({ subject, html, to: email });
  }

  async sendNFTMintedMail({email, name, fileBuffer, nft}){
    let messageParams = {
      to: email,
      subject: "Event Ticket is Ready",
      html: `<h1>Hey ${name}</h1><p>We are excited to have you at the buildspace event. Attached to the mail is your event ticket. View on ${nft.url}</p><p>Your token uri is ${nft.tokenURI}</p>`,
      attachment: [{filename: `${name.split(' ').join('-')}-ticket.png`, data: fileBuffer}]
  }

  return  await this.send(messageParams)
  }

  async sendEventDetailsMail(email){
    const file = await fs.readFile(path.resolve('./src/assets/eventBanner.jpg'))
    let messageParams = {
      to: email,
      subject: 'Getting ready for the event?',
      html: `<h1>Let's Talk Web3</h1><p>Join us on Saturday, January 29 on the buildspace event livestream: <a href="www.buildspace.africa">www.events.buildspace.africa</a></p><p>Check email attachment for more details on the event</p>`,
      attachment: [{filename: 'buildspace-africa-event.jpg', data: file }]
    }

    return  await this.send(messageParams);
  }
}

module.exports = new MailService();
