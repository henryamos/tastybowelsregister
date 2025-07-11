import 'dotenv/config'; // Load environment variables first
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import registerRoute from "./routes/register.js";

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send(" Tasy Bowls API is Live");
});

app.use("/api/V1/", registerRoute);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));
