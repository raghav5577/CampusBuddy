const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    try {
        const data = await resend.emails.send({
            from: 'CampusBuddy <onboarding@resend.dev>', // Use this default until you verify a domain
            to: options.email,
            subject: options.subject,
            html: options.html || options.message.replace(/\n/g, '<br>')
        });

        console.log('Email sent successfully:', data);
        return data;
    } catch (error) {
        console.error('Resend Email Error:', error);
        throw new Error(error.message);
    }
};

module.exports = sendEmail;
