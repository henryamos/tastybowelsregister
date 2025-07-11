# 🍽️ Tasty Bowls Registration API

A professional Node.js/Express API for managing cooking class registrations with email notifications and MongoDB storage.

## ✨ Features

- **User Registration** with comprehensive validation
- **Professional Email Templates** with modern design
- **MongoDB Integration** with Mongoose ODM
- **Smart Port Management** with automatic fallback
- **Graceful Shutdown** handling
- **CORS Configuration** for cross-origin requests
- **Error Handling** with detailed logging
- **Environment-based Configuration**

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- MongoDB (local or cloud)
- Email SMTP credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:henryamos/tastybowelsregister.git
   cd tastybowelsregister
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your credentials:
   ```env
   # Server Configuration
   PORT=5011
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   
   # Database
   MONGO_URI=your_mongodb_connection_string
   
   # Email Configuration
   EMAIL_HOST=your_smtp_host
   EMAIL_PORT=587
   EMAIL_USER=your_email@domain.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=your_email@domain.com
   ```

4. **Start the server**
   ```bash
   # Development (with auto-restart)
   npm run dev
   
   # Production
   npm start
   ```

## 🔧 Port Configuration

The server uses a single configured port:

- **Port**: Uses `PORT` from environment (default: 5011)
- **Error Handling**: Shows clear error if port is already in use
- **Simple Setup**: No complex port management needed

Example output:
```
✅ Server running on port 5011
🌐 API URL: http://localhost:5011
🏥 Health check: http://localhost:5011/
```

## 📡 API Endpoints

### Health Check
```
GET /
Response: Server status and info
```

### Register User
```
POST /api/v1/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "telegramHandle": "@johndoe",
  "email": "john@example.com",
  "phoneNumber": "+44 123 456 7890"
}
```

**Success Response (201)**:
```json
{
  "message": "Registration successful!"
}
```

**Error Responses**:
- `400`: Missing required fields
- `409`: Email already registered
- `500`: Server error

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password in `EMAIL_PASS`

### Outlook Setup
1. Generate App Password: https://account.live.com/proofs/AppPassword
2. Use app password in `EMAIL_PASS`

### Custom SMTP
Configure your hosting provider's SMTP settings.

## 🛠️ Development

### Project Structure
```
tastybowelsregister/
├── models/
│   └── Participant.js    # MongoDB schema
├── routes/
│   └── register.js       # Registration endpoint
├── utils/
│   └── sendEmail.js      # Email service
├── index.js              # Main server file
├── package.json          # Dependencies & scripts
└── .env                  # Environment variables
```

### Scripts
```bash
npm start      # Production server
npm run dev    # Development with nodemon
npm test       # Run tests (placeholder)
```

## 🚀 Deployment

### Railway / Heroku
1. Connect your GitHub repository
2. Set environment variables in the platform
3. Deploy automatically on push

### Manual Server
1. Clone repository on server
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start with PM2: `pm2 start index.js --name tasty-bowls-api`

## 🔒 Security Features

- **Input Validation**: All fields required and validated
- **CORS Protection**: Configurable origin restrictions
- **Error Handling**: Secure error messages in production
- **Rate Limiting**: Ready for implementation
- **Environment Separation**: Development vs production configs

## 🌟 Recent Improvements

- ✅ **Simple Port Configuration**: Clean, straightforward setup
- ✅ **Graceful Shutdown**: Proper cleanup on exit
- ✅ **Enhanced Error Handling**: Better error messages
- ✅ **Professional Email Template**: Modern, responsive design
- ✅ **Phone Number Field**: Added to registration
- ✅ **Health Check Endpoint**: Server status monitoring
- ✅ **CORS Configuration**: Cross-origin support

## 📞 Support

- **WhatsApp**: +44 7376 943574
- **Email**: Cookingmasterclass@tasty-bowls.com
- **GitHub**: [henryamos/tastybowelsregister](https://github.com/henryamos/tastybowelsregister)

## 📄 License

MIT License - feel free to use for your projects!

---

**🍽️ Tasty Bowls** - Transforming culinary skills through technology 