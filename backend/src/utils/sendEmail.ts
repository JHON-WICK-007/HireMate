import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const isSmtpConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD;

  if (isSmtpConfigured) {
    try {
      const port = parseInt(process.env.SMTP_PORT || "587");
      const isGmail = (process.env.SMTP_HOST || "").includes("gmail");

      const transporter = nodemailer.createTransport(
        isGmail
          ? {
              service: "gmail",
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
              },
              connectionTimeout: 8000,
              greetingTimeout: 8000,
              socketTimeout: 10000,
            }
          : {
              host: process.env.SMTP_HOST,
              port,
              secure: port === 465,
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
              },
              connectionTimeout: 8000,
              greetingTimeout: 8000,
              socketTimeout: 10000,
            }
      );

      const mailOptions = {
        from: `${process.env.FROM_NAME || "HireMate AI"} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        ...(options.html ? { html: options.html } : {}),
      };

      await transporter.sendMail(mailOptions);
      console.log(`[SMTP] Reset email successfully dispatched to ${options.email}`);
      return;
    } catch (err) {
      console.error("[SMTP] Error sending email via SMTP:", err);
      console.log("--- FALLING BACK TO CONSOLE LOGGING ---");
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
