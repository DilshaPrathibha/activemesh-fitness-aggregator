import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (email, name, resetUrl) => {
  await transporter.sendMail({
    from: `"ActiveMesh" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Reset your ActiveMesh password',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Reset Your Password</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset the password for your ActiveMesh account.</p>
        <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}" 
           style="display:inline-block; background:#7c3aed; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; margin:16px 0;">
          Reset Password
        </a>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <hr />
        <p style="color:#6b7280; font-size:12px;">ActiveMesh — Australia's Fitness Platform</p>
      </div>
    `,
  });
};
