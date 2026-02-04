const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Standard "Cloud-Safe" Gmail Configuration
    // Port 587 is STARTTLS, which is usually open on containers where 25 and 465 are blocked.
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Must be false for port 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false // Helps with cloud self-signed certs
        },
        connectionTimeout: 15000, // 15 seconds
        greetingTimeout: 15000,
        socketTimeout: 15000
    });

    const message = {
        from: `${process.env.FROM_NAME || 'CampusBuddy'} <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Email send failed:', error);
        throw error;
    }
};

module.exports = sendEmail;
