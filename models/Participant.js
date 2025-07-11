import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  telegramHandle: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now }
});

const Participant = mongoose.model("Participant", participantSchema);
export default Participant;
