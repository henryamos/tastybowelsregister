#!/usr/bin/env node

import { generateToken } from './utils/tokenGenerator.js';
import fs from 'fs';
import path from 'path';

console.log('🔐 Generating Secure Access Token...\n');

try {
  // Generate a secure token
  const token = generateToken(32, 'hex');
  
  console.log('✅ Token Generated Successfully!');
  console.log(`Token: ${token}\n`);
  
  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  const envExists = fs.existsSync(envPath);
  
  if (envExists) {
    console.log('📁 Found existing .env file');
    
    // Read current .env content
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if SIMPLE_ACCESS_TOKEN already exists
    if (envContent.includes('SIMPLE_ACCESS_TOKEN=')) {
      console.log('⚠️  SIMPLE_ACCESS_TOKEN already exists in .env file');
      console.log('   You can either:');
      console.log('   1. Replace the existing value manually');
      console.log('   2. Add this new token to your .env file:');
      console.log(`      SIMPLE_ACCESS_TOKEN=${token}`);
    } else {
      console.log('➕ Adding SIMPLE_ACCESS_TOKEN to .env file...');
      
      // Add the token to .env file
      const newEnvContent = envContent + `\n# Security Token (Generated: ${new Date().toISOString()})\nSIMPLE_ACCESS_TOKEN=${token}\n`;
      fs.writeFileSync(envPath, newEnvContent);
      
      console.log('✅ Token added to .env file successfully!');
    }
  } else {
    console.log('📁 No .env file found');
    console.log('   Create a .env file with this content:');
    console.log('   ┌─────────────────────────────────────┐');
    console.log('   │ SIMPLE_ACCESS_TOKEN=' + token + ' │');
    console.log('   └─────────────────────────────────────┘');
  }
  
  console.log('\n📝 Usage Instructions:');
  console.log('1. Restart your server to load the new token');
  console.log('2. Test with: curl -H "Authorization: Bearer ' + token + '" http://localhost:5011/api/v1/payment-details');
  console.log('3. Your payment endpoints are now protected!');
  
  console.log('\n🔒 Security Features Enabled:');
  console.log('   ✅ Token authentication required');
  console.log('   ✅ All payment endpoints protected');
  console.log('   ✅ Invalid tokens return 401 Unauthorized');
  
} catch (error) {
  console.error('❌ Error generating token:', error.message);
  process.exit(1);
} 