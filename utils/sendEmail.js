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

async function sendConfirmationEmail(to, firstName, phoneNumber = '') {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Confirmed - Tasty Bowls</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #2E7D32 0%, #388E3C 100%);
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #43A047, #66BB6A);
          color: white;
          text-align: center;
          padding: 40px 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .header p {
          margin: 10px 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px;
        }
        .welcome {
          text-align: center;
          margin-bottom: 30px;
        }
        .welcome h2 {
          color: #2E7D32;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .details {
          background: #f1f8e9;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #4CAF50;
        }
        .details h3 {
          color: #2E7D32;
          margin-top: 0;
          margin-bottom: 15px;
        }
        .course-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        .feature {
          text-align: center;
          padding: 20px;
          background: #f1f8e9;
          border-radius: 10px;
          border: 1px solid #C8E6C9;
        }
        .feature-icon {
          font-size: 30px;
          margin-bottom: 10px;
        }
        .feature h4 {
          color: #2E7D32;
          margin: 10px 0 5px;
        }
        .next-steps {
          background: linear-gradient(135deg, #388E3C, #43A047);
          color: white;
          padding: 25px;
          border-radius: 10px;
          margin: 30px 0;
        }
        .next-steps h3 {
          margin-top: 0;
          margin-bottom: 15px;
        }
        .next-steps ol {
          padding-left: 20px;
        }
        .next-steps li {
          margin: 8px 0;
        }
        .payment-info {
          background: #e8f5e8;
          border: 1px solid #81C784;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
        }
        .payment-info h4 {
          color: #2E7D32;
          margin-top: 0;
        }
        .bank-details {
          background: #f1f8e9;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
          border-left: 3px solid #4CAF50;
        }
        .bank-details div {
          margin: 5px 0;
        }
        .contact-section {
          background: #e8f5e8;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          margin: 20px 0;
          border: 1px solid #81C784;
        }
        .contact-section h4 {
          color: #2E7D32;
          margin-top: 0;
        }
        .whatsapp-btn {
          background: #25D366;
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          text-decoration: none;
          display: inline-block;
          font-weight: bold;
          margin-top: 10px;
          transition: background-color 0.3s;
        }
        .whatsapp-btn:hover {
          background: #128C7E;
        }
        .footer {
          text-align: center;
          padding: 30px;
          background: #f1f8e9;
          color: #2E7D32;
        }
        .footer a {
          color: #43A047;
          text-decoration: none;
        }
        .highlight {
          background: #A5D6A7;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: bold;
          color: #1B5E20;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍽️ Tasty Bowls</h1>
          <p>Summer Cooking Master Class 1.0</p>
        </div>
        
        <div class="content">
          <div class="welcome">
            <h2>🎉 Welcome to the Master Class!</h2>
            <p>Hi <strong>${firstName}</strong>, your registration has been confirmed!</p>
          </div>
          
          <div class="details">
            <h3>📋 Your Registration Details</h3>
            <div style="margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #C8E6C9;">
              <strong style="color: #2E7D32; width: 120px; display: inline-block;">Name:</strong> ${firstName}
            </div>
            <div style="margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #C8E6C9;">
              <strong style="color: #2E7D32; width: 120px; display: inline-block;">Email:</strong> ${to}
            </div>
            <div style="margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #C8E6C9;">
              <strong style="color: #2E7D32; width: 120px; display: inline-block;">Phone:</strong> ${phoneNumber}
            </div>
            <div style="margin: 10px 0; padding: 8px 0;">
              <strong style="color: #2E7D32; width: 120px; display: inline-block;">Status:</strong> <span class="highlight">Confirmed</span>
            </div>
          </div>
          
          <div class="course-features">
            <div class="feature">
              <div class="feature-icon">📚</div>
              <h4>50+ Recipes</h4>
              <p>Professional recipes included</p>
            </div>
            <div class="feature">
              <div class="feature-icon">📅</div>
              <h4>2 Weeks</h4>
              <p>Intensive Training</p>
            </div>
            <div class="feature">
              <div class="feature-icon">💰</div>
              <h4>£100 Only</h4>
              <p>Complete investment</p>
            </div>
            <div class="feature">
              <div class="feature-icon">🎯</div>
              <h4>100% Interactive</h4>
              <p>Live training sessions</p>
            </div>
          </div>
          
          <div class="next-steps">
            <h3>🚀 Next Steps</h3>
            <ol>
              <li>Complete your payment of <span class="highlight">£100</span> using the bank details below</li>
              <li>Send your payment receipt to WhatsApp: <strong>+44 7376 943574</strong></li>
              <li>Include your full name and "Cooking Master Class" in the message</li>
              <li>Wait for payment confirmation and Telegram group access</li>
            </ol>
          </div>
          
          <div class="payment-info">
            <h4>💳 Payment Information</h4>
            <div class="bank-details">
              <div><strong>Payment Link:</strong> <a href="https://paymentrequest.natwestpayit.com/reusable-links/9044cee9-ccea-46fa-bf8a-3be06865157e" style="color: #2E7D32; text-decoration: underline;">Click here to pay £100</a></div>
              <div><strong>Amount:</strong> £100</div>
              <div><strong>Reference:</strong> Tasty Bowls - ${firstName}</div>
            </div>
            <p><strong>⚠️ Important:</strong> Payment must be completed before the class starts</p>
            <p><strong>💡 Tip:</strong> Use the payment link above for a quick and secure payment experience</p>
          </div>
          
          <div class="contact-section">
            <h4>📞 Need Help?</h4>
            <p>Contact us on WhatsApp for immediate assistance</p>
            <a href="https://wa.me/447376943574" class="whatsapp-btn">💬 WhatsApp: +44 7376 943574</a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for joining Tasty Bowls Summer Cooking Master Class!</strong></p>
          <p>Transform your culinary skills with our comprehensive intensive program.</p>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            This email was sent to ${to}. If you have any questions, please contact us via WhatsApp.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Tasty Bowls Master Class" <${process.env.EMAIL_FROM}>`,
      to,
      subject: "🎉 Registration Confirmed - Tasty Bowls Summer Cooking Master Class",
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
