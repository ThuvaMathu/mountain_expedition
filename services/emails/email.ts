import nodemailer from "nodemailer";

export const COMPANY_NAME = "Tamil Adventure Trekking Club";
export const COMPANY_LOGO_URL =
  "https://yourcdn.com/assets/tamil-adventure-trekking-logo.png"; // update with real logo path

export const g_transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const defaultMailFrom = process.env.FROM_EMAIL || "no-reply@example.com";
