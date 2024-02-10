import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const config = {
  host: "smtp.mailgun.org",
  port: 587,
  secure: true,
  auth: {
    user: "postmaster@sandbox608361e9aed3457a9acce677f94a2b6b.mailgun.org",
    pass: process.env.API_KEY,
  },
};
const transporter = nodemailer.createTransport(config);
const emailOptions = {
  from: "your-email@test.pl",
  to: "noresponse@gmail.com",
  subject: "Nodemailer test",
  text: "Cześć. Testujemy wysyłanie wiadomości!",
};
transporter
  .sendMail(emailOptions)
  .then((info) => console.log(info))
  .catch((err) => console.log(err));

export default {
  transporter,
};
