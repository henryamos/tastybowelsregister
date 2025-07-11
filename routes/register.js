import express from "express";
import Participant from "../models/Participant.js";
import sendConfirmationEmail from "../utils/sendEmail.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, telegramHandle, email } = req.body;

  if (!firstName || !lastName || !telegramHandle || !email) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existing = await Participant.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "You have already registered." });
    }

    const participant = await Participant.create({ firstName, lastName, telegramHandle, email });

    await sendConfirmationEmail(email, firstName);

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

export default router;
