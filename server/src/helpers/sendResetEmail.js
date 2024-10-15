"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
// node i nodemailer
// sendMail(to:string, subject:string, message:string):

const nodemailer = require("nodemailer");

module.exports = function (to, subject, message) {
  // Set Passive:
  return true;

  //? GoogleMail (gmail):
  // Google -> AccountHome -> Security -> Two-Step-Verify -> App-Passwords
  const mailSettings = {
    service: "Gmail",
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  };

  // Connect to mailServer:
  const transporter = nodemailer.createTransport({
    service: mailSettings.service,
    auth: {
      user: mailSettings.user,
      pass: mailSettings.pass,
    },
  });
  // SendMail:
  transporter.sendMail(
    {
      from: mailSettings.user,
      to: to,
      subject: subject,
      text: message,
      html: message,
    },
    (error, info) => {
      error ? console.log(error) : console.log(info);
    }
  );
};
