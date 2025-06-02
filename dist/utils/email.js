"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = void 0;
exports.sendVerificationEmail = sendVerificationEmail;
const mail_transport_1 = require("../config/mail-transport");
async function sendVerificationEmail(email, link) {
    const transporter = await (0, mail_transport_1.createTransporter)();
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        html: `
      <h2>Welcome!</h2>
      <p>Click below to verify your email:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 24 hours.</p>
    `,
    });
}
const sendResetPasswordEmail = async (email, resetLink) => {
    const transporter = await (0, mail_transport_1.createTransporter)();
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Your Password',
        html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>This link will expire in 15 minutes.</p>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send reset password email. Please try again later.');
    }
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
//# sourceMappingURL=email.js.map