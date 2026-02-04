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
            rejectUnauthorized: false // Helps with some cloud provider network issues
        },
        logger: true, // Log SMTP info for debugging
        debug: true   // Include debug info
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
