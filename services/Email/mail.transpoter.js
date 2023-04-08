// Mail transpoter service goes here...

require("dotenv").config();
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  // host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "email@gmail.com",
    pass: process.env.EMAIL_ID_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

let mailOptions = {
  from: "Company <no-reply@gmail.com>",
  to: "",
  subject: "",
};

const apiHostTestUrl = `${process.env.HOST_URL}/api/user/verify`;
const apiClientUrl = process.env.CLIENT_URL;

module.exports = { transporter, mailOptions, apiClientUrl, apiHostTestUrl };
