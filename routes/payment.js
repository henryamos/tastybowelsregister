import express from "express";
import QRCode from "qrcode";
import { generateToken, generateTokenWithTimestamp, validateTokenFormat } from "../utils/tokenGenerator.js";

const router = express.Router();

// Security middleware for optional IP filtering and token verification
const securityCheck = (req, res, next) => {
  try {
    // Optional: Basic IP filtering
    if (process.env.ALLOWED_IPS) {
      const allowedIPs = process.env.ALLOWED_IPS.split(',').map(ip => ip.trim());
      const clientIP = req.ip || req.connection.remoteAddress;
      if (!allowedIPs.includes(clientIP)) {
        return res.status(403).json({ 
          success: false,
          error: 'Access denied' 
        });
      }
    }

    // Optional: Simple token verification
    if (process.env.SIMPLE_ACCESS_TOKEN) {
      const token = req.headers.authorization;
      if (token !== `Bearer ${process.env.SIMPLE_ACCESS_TOKEN}`) {
        return res.status(401).json({ 
          success: false,
          error: 'Unauthorized' 
        });
      }
    }

    next();
  } catch (error) {
    console.error('Security check error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Security check failed' 
    });
  }
};

// GET /api/v1/payment-details - Serve payment details securely
router.get('/payment-details', securityCheck, (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        bankName: process.env.BANK_NAME || "NATWEST",
        accountName: process.env.ACCOUNT_NAME || "NEXT OASIS LTD",
        accountNumber: process.env.ACCOUNT_NUMBER || "22774866",
        sortCode: process.env.SORT_CODE || "52-21-18"
      }
    });
  } catch (error) {
    console.error('Error serving payment details:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to retrieve payment details" 
    });
  }
});

// GET /api/v1/payment-qr - Generate QR code dynamically (Public access)
router.get('/payment-qr', async (req, res) => {
  try {
    // Get payment details from environment variables
    const bankName = process.env.BANK_NAME || "NATWEST";
    const accountName = process.env.ACCOUNT_NAME || "NEXT OASIS LTD";
    const accountNumber = process.env.ACCOUNT_NUMBER || "22774866";
    const sortCode = process.env.SORT_CODE || "52-21-18";
    
    // Create payment data string for QR code
    const paymentData = {
      bankName,
      accountName,
      accountNumber,
      sortCode,
      reference: "Tasty Bowls Registration"
    };
    
    // Convert to JSON string for QR code
    const qrData = JSON.stringify(paymentData);
    
    // Generate QR code as PNG buffer
    const qrBuffer = await QRCode.toBuffer(qrData, {
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Set proper headers for image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.setHeader('Content-Length', qrBuffer.length);
    
    // Send the generated QR code
    res.send(qrBuffer);
    
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to generate QR code" 
    });
  }
});

// GET /api/v1/payment-qr-data - Get QR code data as JSON (Public access)
router.get('/payment-qr-data', (req, res) => {
  try {
    const bankName = process.env.BANK_NAME || "NATWEST";
    const accountName = process.env.ACCOUNT_NAME || "NEXT OASIS LTD";
    const accountNumber = process.env.ACCOUNT_NUMBER || "22774866";
    const sortCode = process.env.SORT_CODE || "52-21-18";
    
    const paymentData = {
      bankName,
      accountName,
      accountNumber,
      sortCode,
      reference: "Tasty Bowls Registration",
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: paymentData,
      qrData: JSON.stringify(paymentData)
    });
  } catch (error) {
    console.error('Error getting QR data:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to get QR data" 
    });
  }
});

// POST /api/v1/payment-qr-custom - Generate custom QR code
router.post('/payment-qr-custom', async (req, res) => {
  try {
    const { data, width = 300, format = 'png' } = req.body;
    
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Data is required for QR code generation"
      });
    }
    
    let qrBuffer;
    
    if (format === 'svg') {
      // Generate SVG format
      const svgString = await QRCode.toString(data, {
        type: 'svg',
        width: width,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(svgString);
    } else {
      // Generate PNG format
      qrBuffer = await QRCode.toBuffer(data, {
        type: 'image/png',
        width: width,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('Content-Length', qrBuffer.length);
      res.send(qrBuffer);
    }
    
  } catch (error) {
    console.error('Error generating custom QR code:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to generate custom QR code" 
    });
  }
});

// GET /api/v1/payment-health - Health check for payment routes
router.get('/payment-health', (req, res) => {
  res.json({
    success: true,
    message: "Payment routes are healthy",
    timestamp: new Date().toISOString(),
    features: {
      dynamicQR: true,
      securityEnabled: {
        tokenAuth: !!process.env.SIMPLE_ACCESS_TOKEN,
        ipFiltering: !!process.env.ALLOWED_IPS
      }
    }
  });
});

// POST /api/v1/generate-token - Generate a new access token
router.post('/generate-token', (req, res) => {
  try {
    const { length = 32, type = 'hex', includeTimestamp = false } = req.body;
    
    // Validate parameters
    if (length < 16 || length > 128) {
      return res.status(400).json({
        success: false,
        message: "Token length must be between 16 and 128 characters"
      });
    }
    
    if (!['hex', 'base64', 'alphanumeric'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Token type must be 'hex', 'base64', or 'alphanumeric'"
      });
    }
    
    // Generate token
    let result;
    if (includeTimestamp) {
      result = generateTokenWithTimestamp(length);
    } else {
      result = { token: generateToken(length, type) };
    }
    
    res.json({
      success: true,
      message: "Token generated successfully",
      data: result,
      instructions: {
        usage: "Add this token to your .env file as SIMPLE_ACCESS_TOKEN",
        example: `SIMPLE_ACCESS_TOKEN=${result.token}`,
        header: "Include in requests: Authorization: Bearer your-token"
      }
    });
    
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({
      success: false,
      message: "Failed to generate token"
    });
  }
});

// POST /api/v1/validate-token - Validate a token format
router.post('/validate-token', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required"
      });
    }
    
    const isValid = validateTokenFormat(token);
    
    res.json({
      success: true,
      isValid,
      tokenLength: token.length,
      message: isValid ? "Token format is valid" : "Token format is invalid"
    });
    
  } catch (error) {
    console.error('Error validating token:', error);
    res.status(500).json({
      success: false,
      message: "Failed to validate token"
    });
  }
});

export default router; 