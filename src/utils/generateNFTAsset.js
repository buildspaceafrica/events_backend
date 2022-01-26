
const generateQRCode = require('./generateQRCode');
const fs = require("fs").promises;
const capitalize = require("./capitalize");
const path = require("path")


async function generateNFTAsset({ user, ticketNumber }) {
    const { name, email, isAvailable } = user;

    let svg = await fs.readFile(path.resolve('./src/assets/ticket.svg'), "utf-8");

    const qrcode = await generateQRCode(
        `name=${name}\nemail=${email}`
    );

    const [firstName = '', lastName = ''] = name.split(' ');

    svg = svg
        .replace("{{FIRST_NAME}}", capitalize(firstName))
        .replace("{{LAST_NAME}}", capitalize(lastName))
        .replace("{{QR_CODE}}", qrcode)
        .replace("{{TICKET_NUMBER}}", ticketNumber).replace('{{PHYSICAL}}', isAvailable ? 'Physical' : 'Virtual')

    return svg;
}



module.exports = generateNFTAsset;