const formData = require("form-data");
const Mailgun = require("mailgun.js");
const { MAILGUN } = require("./../config");
const mailgun = new Mailgun(formData);
const CustomError = require("./../utils/custom-error");

class MailService {
  constructor() {
    this.mailClient = mailgun.client({ username: "api", key: MAILGUN.APIKEY });
    this.from = MAILGUN.EMAIL;
  }

  async send({ subject, content, to }) {
    const data = {
      subject,
      html: content,
      to: Array.isArray(to) ? to.join(",") : to,
      from: this.from,
    };

    try {
      // Invokes the method to send emails given the above data with the helper library
      const response = await this.mailClient.messages.create(
        MAILGUN.DOMAIN,
        data
      );

      console.log(response);

      return response;
    } catch (error) {
      throw new CustomError("Unable to send mail");
    }
  }

  async sendEmailVerificationMail(otp, email) {
    const subject = "Email Verification";
    const content = `<h1>Verify your mail</h1><p>Your one time passcode is ${otp}</p>`;

    return await this.send({ subject, content, to: email });
  }
}

module.exports = MailService;
