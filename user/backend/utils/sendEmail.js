const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');

/**
 * Email service for local dev and cloud (Render blocks SMTP ports — use SendGrid/Brevo API).
 */

const isRender = process.env.RENDER === 'true';
const isPlaceholder = (value, placeholders = []) => {
  const normalized = String(value || '').trim();
  if (!normalized) return true;
  return placeholders.some((item) => normalized === item);
};

const sendEmailWithGmail = async (options) => {
  if (isRender) {
    throw new Error('Gmail SMTP is blocked on Render. Use SENDGRID_API_KEY or BREVO_API_KEY instead.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  await transporter.verify();

  const mailOptions = {
    from: `"${process.env.FROM_NAME || 'iVotePK'}" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
    priority: 'high',
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent via Gmail to ${options.email}`);
  return info;
};

const sendEmailWithSendGrid = async (options) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: options.email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER,
      name: process.env.FROM_NAME || 'iVotePK'
    },
    subject: options.subject,
    html: options.message,
  };

  const response = await sgMail.send(msg);
  console.log(`✅ Email sent via SendGrid to ${options.email}`);
  return response;
};

const sendEmailWithBrevo = async (options) => {
  const fromEmail = process.env.BREVO_FROM_EMAIL || process.env.EMAIL_USER;
  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: { name: process.env.FROM_NAME || 'iVotePK', email: fromEmail },
      to: [{ email: options.email }],
      subject: options.subject,
      htmlContent: options.message,
    },
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );
  console.log(`✅ Email sent via Brevo API to ${options.email}`);
};

/** Brevo SMTP — local dev only (Render blocks port 587). */
const sendEmailWithBrevoSmtp = async (options) => {
  if (isRender) {
    throw new Error('Brevo SMTP is blocked on Render. Use BREVO_API_KEY (API tab) instead.');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: Number(process.env.BREVO_SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_KEY,
    },
  });

  const fromEmail = process.env.BREVO_FROM_EMAIL || process.env.EMAIL_USER;
  const info = await transporter.sendMail({
    from: `"${process.env.FROM_NAME || 'iVotePK'}" <${fromEmail}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  });
  console.log(`✅ Email sent via Brevo SMTP to ${options.email}`);
  return info;
};

const displayOTPInConsole = (options) => {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║  📧 EMAIL NOT CONFIGURED - OTP DISPLAYED BELOW       ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log(`📬 To: ${options.email}`);
  console.log(`📋 Subject: ${options.subject}\n`);

  const otpMatch = options.message.match(/\b\d{6}\b/);
  if (otpMatch) {
    console.log(`🔑 OTP CODE: ${otpMatch[0]}`);
    console.log('⚠️  Copy this code from Render logs if email delivery failed.\n');
  }
};

const sendEmail = async (options) => {
  try {
    if (!isPlaceholder(process.env.SENDGRID_API_KEY, ['your_sendgrid_api_key'])) {
      const response = await sendEmailWithSendGrid(options);
      return { success: true, method: 'sendgrid', response };
    }

    if (!isPlaceholder(process.env.BREVO_API_KEY)) {
      await sendEmailWithBrevo(options);
      return { success: true, method: 'brevo' };
    }

    if (
      !isRender &&
      !isPlaceholder(process.env.BREVO_SMTP_USER) &&
      !isPlaceholder(process.env.BREVO_SMTP_KEY)
    ) {
      const info = await sendEmailWithBrevoSmtp(options);
      return { success: true, method: 'brevo_smtp', info };
    }

    if (
      !isRender &&
      !isPlaceholder(process.env.EMAIL_USER, ['your_email@gmail.com']) &&
      !isPlaceholder(process.env.EMAIL_PASS, ['your_gmail_app_password_here'])
    ) {
      const info = await sendEmailWithGmail(options);
      return { success: true, method: 'gmail', info };
    }

    displayOTPInConsole(options);
    return {
      success: false,
      method: 'console',
      message: isRender
        ? 'Email API not configured on Render. Set SENDGRID_API_KEY or BREVO_API_KEY.'
        : 'Email service is not configured. OTP printed in backend console.',
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    displayOTPInConsole(options);
    return { success: false, method: 'console_fallback', error: error.message };
  }
};

module.exports = sendEmail;
