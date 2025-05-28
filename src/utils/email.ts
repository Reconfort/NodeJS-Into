import nodemailer from 'nodemailer';

export async function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Missing email credentials');
  }
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
  } catch (error) {
    console.error('Email configuration nodemailer error:', error);
    throw new Error('Failed to connect to email service. Please check your email cnfigurations.');
  }
  return transporter;
}

export async function sendVerificationEmail(email: string, link: string) {
  const transporter = await createTransporter();
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

export const sendResetPasswordEmail = async (email: string, resetLink: string) => {
  const transporter = await createTransporter();

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
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send reset password email. Please try again later.');
  }
};