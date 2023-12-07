
const nodemailer = require('nodemailer')
const asyncErrorHandler = require('../middleware/asyncErrorHandler')

const sendEmail = asyncErrorHandler(async (options) => {

    try {
        // Create a transporter using your email service provider's SMTP settings
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_HOST_PORT,
            secure: false, // Set to true if using a secure connection (e.g., SSL/TLS)
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        // Define the email options
        const mailOptions = {
            from:  process.env.EMAIL,
            to: options.email,
            subject: options.subject,
            text: options.message
        }

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        return info;

    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
})

module.exports = sendEmail;