import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const isSmtpConfigured =
    (process.env.SMTP_HOST || (process.env.SMTP_USER && process.env.SMTP_PASSWORD)) &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD;

  if (isSmtpConfigured) {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "587");
    const isSecure = port === 465;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: isSecure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });

    const mailOptions = {
      from: `${process.env.FROM_NAME || "HireMate AI"} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      ...(options.html ? { html: options.html } : {}),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[SMTP] Reset email successfully dispatched to ${options.email} (Message ID: ${info.messageId})`);
      return;
    } catch (smtpErr: any) {
      console.warn(`[SMTP Warning] SMTP delivery failed (${smtpErr.message || smtpErr}). Falling back to Dev Email console logger.`);
    }
  }

  // Fallback console log (very clean for development)
  console.log("\n==================================================");
  console.log("           📧 HIREMATE AI DEV EMAIL SYSTEM");
  console.log("==================================================");
  console.log(`To:      ${options.email}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Message:\n\n${options.message}`);
  console.log("==================================================\n");
};
