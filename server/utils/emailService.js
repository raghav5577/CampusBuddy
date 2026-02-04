const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Use 'service: gmail' with relaxed security for cloud environments
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        },
        logger: true,
        debug: true,
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
        family: 4 // Force IPv4 to prevent ENETUNREACH errors on IPv6-limited networks
    });

    const message = {
        from: `${process.env.FROM_NAME || 'CampusBuddy'} <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
