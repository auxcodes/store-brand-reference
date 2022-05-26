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

async function sendSignInEmail(emailAddress, link) {
    const mailOptions = {
        to: emailAddress,
        from: "noreply@aux.codes",
        subject: "Login Link for Store Search",
        html: `
        <div style="border: 2px #c1c1c1 solid; border-radius: 1em; padding: 1em; font-family: Arial, sans-serif;">
        <p style="">Please click the below button to login to Store Search:</p>
        <a href="${link}" style="background-color: #4CAF50;
        border-radius: 1em;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-family: Arial, sans-serif;
        font-size: 16px;
        font-weight: 700">Login</a>
        <p style="">If you didn’t try to login, you can ignore this email.</p>
        <p style="">Thanks</p>
        <p style="">Store Search Team</p>
      </div>
      `
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

module.exports = { sendSignInEmail };