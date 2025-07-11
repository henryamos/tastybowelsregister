import nodemailer from "nodemailer";

// // Debug: Log email configuration
// console.log('📧 Email Configuration:');
// console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
// console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
// console.log('EMAIL_USER:', process.env.EMAIL_USER);
// console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    // Don't fail on invalid certs
    rejectUnauthorized: false
  }
});

async function sendConfirmationEmail(to, firstName) {
  const html = `
    <div style="font-family:Arial,sans-serif;padding:20px;">
      <h2 style="color:#407062;">Welcome to the Master Cooking Class, ${firstName}!</h2>
      <p>We’ve received your registration and you’re now officially part of the upcoming Telegram class.</p>
      <p>Details and schedule will be shared with you soon via email and on Telegram.</p>
      <p>Make sure to join the Telegram group using your handle: <strong>@${firstName}</strong>.</p>
      <p style="margin-top:30px;">Happy Cooking! 🍳</p>
      <p>The Cooking Masterclass Team</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "✅ You're Registered – Cooking Masterclass",
      html
    });
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

export default sendConfirmationEmail;
