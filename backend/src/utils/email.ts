import nodemailer from "nodemailer";

// ─── Generate 6-digit OTP code ──────────────────────────────
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ─── Create email transporter ───────────────────────────────
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null; // No SMTP configured — will log to console
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

// ─── Send verification email ────────────────────────────────
export const sendVerificationEmail = async (
  email: string,
  code: string,
  fullName: string
): Promise<boolean> => {
  const transporter = createTransporter();

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a0f; border-radius: 16px; overflow: hidden; border: 1px solid rgba(139, 92, 246, 0.3);">
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4f46e5 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">HireMate AI</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Intelligent Interview Preparation</p>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #e2e8f0; margin: 0 0 8px; font-size: 20px;">Verify your email</h2>
        <p style="color: #94a3b8; margin: 0 0 24px; font-size: 14px; line-height: 1.6;">
          Hi <strong style="color: #c4b5fd;">${fullName}</strong>, use the code below to verify your email address and complete your registration.
        </p>
        <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
          <p style="color: #94a3b8; margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Verification Code</p>
          <p style="color: #c4b5fd; margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</p>
        </div>
        <p style="color: #64748b; margin: 0; font-size: 13px; line-height: 1.6;">
          This code expires in <strong style="color: #94a3b8;">10 minutes</strong>. If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
      <div style="border-top: 1px solid rgba(139, 92, 246, 0.15); padding: 16px 24px; text-align: center;">
        <p style="color: #475569; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} HireMate AI. All rights reserved.</p>
      </div>
    </div>
  `;

  // If no SMTP configured, log to console (development mode)
  if (!transporter) {
    console.log(`\n╔══════════════════════════════════════════════╗`);
    console.log(`║  📧 EMAIL VERIFICATION CODE                  ║`);
    console.log(`║  To: ${email.padEnd(38)} ║`);
    console.log(`║  Code: ${code}                                ║`);
    console.log(`╚══════════════════════════════════════════════╝\n`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"HireMate AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `${code} is your HireMate AI verification code`,
      html: htmlContent,
    });
    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    return false;
  }
};
