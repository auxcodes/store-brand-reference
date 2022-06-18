const mailer = require('./mailer');

const headers = {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Authorization'
};

exports.handler = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    const contactInfo = {
        email: body['email'],
        name: body['name'],
        subject: body['subject'],
        message: body['message']
    }

    console.log('Contact Form: ', context, body);
    await mailer.sendContactEmail(contactInfo)
        .then(result => {
            callback(null, {
                statusCode: 200,
                headers,
                body: JSON.stringify({ msg: 'Contact Successful' })
            });
            console.log('Contact form response: ', result);
        })
        .catch(error => {
            console.log('Contact form error: ', error);
            callback(null, {
                statusCode: 200,
                headers,
                body: JSON.stringify({ msg: "Send Contact Form Error:", error: error })
            });
        });
}