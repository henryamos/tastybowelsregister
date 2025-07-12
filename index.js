import 'dotenv/config'; // Load environment variables first
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from 'http';

import registerRoute from "./routes/register.js";
import paymentRoute from "./routes/payment.js";

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "🍽️ Tasty Bowls API is Live",
    status: "healthy",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5011
  });
});

// API routes
app.use("/api/v1", registerRoute);
app.use("/api/v1", paymentRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Simple server startup
const PORT = process.env.PORT || 5011;

async function startServer() {
  try {
    // Connect to MongoDB first
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB connected");
    
    // Start server on configured port
    const server = createServer(app);
    
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/`);
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        throw err;
      }
    });
    
    setupGracefulShutdown(server);
    
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

// Graceful shutdown handling
function setupGracefulShutdown(server) {
  const gracefulShutdown = () => {
    console.log('\n🛑 Shutting down gracefully...');
    server.close(() => {
      console.log('✅ HTTP server closed');
      mongoose.connection.close().then(() => {
        console.log('✅ MongoDB connection closed');
        process.exit(0);
      });
    });
  };
  
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

// Start the server
startServer();
