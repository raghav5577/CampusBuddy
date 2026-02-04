require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendTestEmail = async () => {
    console.log('Testing Email Service...');
    console.log('API Key:', process.env.RESEND_API_KEY ? 'Loaded (starts with ' + process.env.RESEND_API_KEY.substring(0, 5) + '...)' : 'MISSING');

    // Use the email you mentioned in the screenshot
    const testEmail = 'raghavmil425@gmail.com';

    try {
        console.log(`Attempting to send email to: ${testEmail}`);

        const data = await resend.emails.send({
            from: 'CampusBuddy <onboarding@resend.dev>',
            to: testEmail,
            subject: 'Test Email from CampusBuddy Debugger',
            html: '<h1>It Works!</h1><p>If you see this, your Resend API setup is perfect.</p>'
        });

        if (data.error) {
            console.error('❌ Resend API returned an error:', data.error);
        } else {
            console.log('✅ Email sent successfully!', data);
        }
    } catch (error) {
        console.error('❌ FATAL ERROR:', error.message);
        if (error.response) {
            console.error('Error Details:', JSON.stringify(error.response.data, null, 2));
        }
    }
};

sendTestEmail();
