import nodemailer from "nodemailer";

// Determine if we're in production
const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === "production";

// Select environment-specific SMTP configuration
const smtpConfig = {
  host: isProduction ? process.env.SMTP_HOST_PROD : process.env.SMTP_HOST,
  port: parseInt(
    isProduction
      ? process.env.SMTP_PORT_PROD || "587"
      : process.env.SMTP_PORT || "587"
  ),
  secure: isProduction
    ? parseInt(process.env.SMTP_PORT_PROD || "587") === 465
    : parseInt(process.env.SMTP_PORT || "587") === 465,
  auth: {
    user: isProduction ? process.env.SMTP_USER_PROD : process.env.SMTP_USER,
    pass: isProduction ? process.env.SMTP_PASS_PROD : process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

// Log which email service is being used (without exposing credentials)
console.log(
  `📧 Email Service: ${
    isProduction ? "Google (Production)" : "Zoho (Development)"
  }`
);
console.log(`📧 SMTP Host: ${smtpConfig.host}`);
console.log(`📧 SMTP Port: ${smtpConfig.port}`);

export const g_transporter = nodemailer.createTransport(smtpConfig);

export const defaultMailFrom = isProduction
  ? process.env.FROM_EMAIL_PROD || "no-reply@example.com"
  : process.env.FROM_EMAIL || "no-reply@example.com";
