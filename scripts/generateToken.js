#!/usr/bin/env node

import { generateToken, generateTokenWithTimestamp } from '../utils/tokenGenerator.js';

// Parse command line arguments
const args = process.argv.slice(2);
const help = args.includes('--help') || args.includes('-h');

if (help) {
  console.log(`
🔐 Token Generator CLI

Usage: node scripts/generateToken.js [options]

Options:
  --length <number>     Token length (default: 32)
  --type <string>       Token type: hex, base64, alphanumeric (default: hex)
  --timestamp          Include timestamp and expiration
  --env                Output as .env format
  --help, -h           Show this help

Examples:
  node scripts/generateToken.js
  node scripts/generateToken.js --length 48 --type alphanumeric
  node scripts/generateToken.js --timestamp --env
  node scripts/generateToken.js --type base64 --length 64
`);
  process.exit(0);
}

// Parse options
const length = parseInt(args[args.indexOf('--length') + 1]) || 32;
const type = args[args.indexOf('--type') + 1] || 'hex';
const includeTimestamp = args.includes('--timestamp');
const envFormat = args.includes('--env');

try {
  let result;
  
  if (includeTimestamp) {
    result = generateTokenWithTimestamp(length);
  } else {
    result = { token: generateToken(length, type) };
  }
  
  if (envFormat) {
    console.log(`\n🔐 Generated Token for .env file:`);
    console.log(`SIMPLE_ACCESS_TOKEN=${result.token}\n`);
  } else {
    console.log(`\n🔐 Generated Token:`);
    console.log(`Token: ${result.token}`);
    console.log(`Length: ${result.token.length} characters`);
    console.log(`Type: ${type}`);
    
    if (result.timestamp) {
      console.log(`Generated: ${result.timestamp}`);
      console.log(`Expires: ${result.expiresAt}`);
    }
    
    console.log(`\n📝 Usage Instructions:`);
    console.log(`1. Add to your .env file: SIMPLE_ACCESS_TOKEN=${result.token}`);
    console.log(`2. Include in requests: Authorization: Bearer ${result.token}`);
    console.log(`3. Test with: curl -H "Authorization: Bearer ${result.token}" http://localhost:5011/api/v1/payment-details\n`);
  }
  
} catch (error) {
  console.error('❌ Error generating token:', error.message);
  process.exit(1);
} 