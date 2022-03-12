require('dotenv').config();
const nodemailer = require('nodemailer');
const Logger = require('../../config/logger');

const sendEmail = async (email, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      secure: process.env.NODEMAILER_SECURE,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject,
      text,
      html
    });

    Logger.info(`Email sended to ${email}`);
    return true;
  } catch (e) {
    Logger.error(e.message);
    return false;
  }
};

module.exports = {
  sendEmail
};
