const nodeMailer = require('nodemailer');

let transporter = nodeMailer.createTransport({
    host: "smtp.zoho.com.au",
    secure: true,
    port: 465,
    auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
    },
});

async function sendLoginLink(emailAddress, link) {
    const mailOptions = {
        to: emailAddress,
        from: "noreply@aux.codes",
        subject: "Login Link for Store Search",
        html: `
        <p>Please click the below link to login to Store Search:</p>
        <a>${link}</a>
        <p>If you didn’t try to login, you can ignore this email.</p>
        <p>Thanks</p>
        <p>Store Search Team</p>`
    }

    await transporter.sendMail(mailOptions, (error, info) => {
        if (info) {
            console.log(info);
        }

        if (error) {
            console.error('Error sending email: ', error);
        }
    });
}

module.exports = { sendLoginLink };