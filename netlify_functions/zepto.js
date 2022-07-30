
const zeptoMail = require("zeptomail");

const url = "api.zeptomail.com.au/";
const token = process.env.ZEPTO_API_KEY;
const loginTemplateKey = process.env.LOGIN_EMAIL_TEMPLATE_KEY;
let client = new zeptoMail.SendMailClient({ url, token });

async function sendLoginTemplate(emailAddress, link, emailUrl) {
    try {
        const bounceAddress = "noreply@bounce" + emailUrl;
        const fromAddress = "noreply@" + emailUrl;
        console.log('>------', emailUrl, bounceAddress, fromAddress);
        return client.sendMailWithTemplate({
            "mail_template_key": loginTemplateKey,
            "bounce_address": bounceAddress,
            "from": {
                "address": fromAddress,
                "name": "Store Search"
            },
            "to": [
                {
                    "email_address": {
                        "address": emailAddress,
                        "name": ""
                    }
                }
            ],
            "merge_info": {
                "link": link
            },
        })
    }
    catch (error) {
        console.log("!! Zepto sendLoginTemplate error: ", error);
        return error;
    }
}

module.exports = { sendLoginTemplate };
