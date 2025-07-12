import crypto from 'crypto';

/**
 * Generate a secure random token
 * @param {number} length - Length of the token (default: 32)
 * @param {string} type - Type of token: 'hex', 'base64', 'alphanumeric' (default: 'hex')
 * @returns {string} - Generated token
 */
export const generateToken = (length = 32, type = 'hex') => {
  try {
    switch (type) {
      case 'hex':
        return crypto.randomBytes(length).toString('hex');
      case 'base64':
        return crypto.randomBytes(length).toString('base64').replace(/[+/=]/g, '');
      case 'alphanumeric':
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from(crypto.randomBytes(length))
          .map(byte => chars[byte % chars.length])
          .join('');
      default:
        return crypto.randomBytes(length).toString('hex');
    }
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
};

/**
 * Generate a token with timestamp for tracking
 * @param {number} length - Length of the token (default: 32)
 * @returns {object} - Token object with token and timestamp
 */
export const generateTokenWithTimestamp = (length = 32) => {
  const token = generateToken(length);
  return {
    token,
    timestamp: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  };
};

/**
 * Validate token format (basic validation)
 * @param {string} token - Token to validate
 * @returns {boolean} - Whether token is valid
 */
export const validateTokenFormat = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Check if token is at least 16 characters and contains valid characters
  const validFormat = /^[a-zA-Z0-9]+$/.test(token) && token.length >= 16;
  return validFormat;
}; 