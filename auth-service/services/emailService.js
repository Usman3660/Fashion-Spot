//auth-service/services/emailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendResetEmail = async (to, resetLink) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Reset Your Password - Fashion Spot',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>`,
  });
};
