import express from "express";
import Participant from "../models/Participant.js";
import sendConfirmationEmail from "../utils/sendEmail.js";
import QRCode from "qrcode";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, telegramHandle, email, phoneNumber } = req.body;

  if (!firstName || !lastName || !telegramHandle || !email || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existing = await Participant.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "You have already registered." });
    }

    const participant = await Participant.create({ firstName, lastName, telegramHandle, email, phoneNumber });

    // Payment information for this specific registration
    const paymentData = {
      registrationId: participant._id,
      participantName: `${firstName} ${lastName}`,
      email: email,
      paymentLink: "https://paymentrequest.natwestpayit.com/reusable-links/9044cee9-ccea-46fa-bf8a-3be06865157e",
      amount: "£100",
      reference: `Tasty Bowls - ${firstName} ${lastName}`,
      timestamp: new Date().toISOString()
    };

    // Generate QR code containing the payment link
    const qrCodeBase64 = await QRCode.toDataURL(paymentData.paymentLink, {
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#2E7D32',
        light: '#FFFFFF'
      }
    });

    // Send confirmation email
    await sendConfirmationEmail(email, firstName, phoneNumber);

    res.status(201).json({ 
      success: true,
      message: "Registration successful! Payment QR code generated.", 
      data: {
        registrationId: participant._id,
        firstName: participant.firstName,
        lastName: participant.lastName,
        email: participant.email,
        phoneNumber: participant.phoneNumber,
        telegramHandle: participant.telegramHandle,
        registeredAt: participant.createdAt,
        paymentQR: qrCodeBase64,
        paymentLink: paymentData.paymentLink,
        paymentData: paymentData
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// GET /api/v1/registration/:id/qr - Get QR code for specific registration
router.get("/registration/:id/qr", async (req, res) => {
  try {
    const { id } = req.params;
    
    const participant = await Participant.findById(id);
    if (!participant) {
      return res.status(404).json({ message: "Registration not found." });
    }

    // Payment information for this specific registration
    const paymentData = {
      registrationId: participant._id,
      participantName: `${participant.firstName} ${participant.lastName}`,
      email: participant.email,
      paymentLink: "https://paymentrequest.natwestpayit.com/reusable-links/9044cee9-ccea-46fa-bf8a-3be06865157e",
      amount: "£100",
      reference: `Tasty Bowls - ${participant.firstName} ${participant.lastName}`,
      timestamp: new Date().toISOString()
    };

    // Generate QR code containing the payment link
    const qrCodeBase64 = await QRCode.toDataURL(paymentData.paymentLink, {
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#2E7D32',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      data: {
        registrationId: participant._id,
        participantName: `${participant.firstName} ${participant.lastName}`,
        paymentQR: qrCodeBase64,
        paymentLink: paymentData.paymentLink,
        paymentData: paymentData
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

export default router;
