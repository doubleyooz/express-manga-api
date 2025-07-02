import nodemailer from "nodemailer";

import env from "../env.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GMAIL_EMAIL,
    pass: env.GMAIL_PASS,
  },

  port: 2525,
  secure: true,
});
