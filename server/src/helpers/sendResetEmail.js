// src/helpers/sendResetEmail.js
"use strict";
const nodemailer = require("nodemailer");

const sendResetEmail = async (to, resetToken) => {
  const mailSettings = {
    service: "Gmail",
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  };

  const transporter = nodemailer.createTransport({
    service: mailSettings.service,
    auth: {
      user: mailSettings.user,
      pass: mailSettings.pass,
    },
  });

  const mailOptions = {
    from: mailSettings.user,
    to: to,
    subject: "Password Reset Link",
    text: `You requested a password reset. Click the link to reset your password: 
    http://localhost:3061/reset-password?token=${resetToken}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
