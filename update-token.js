#!/usr/bin/env node

import { generateToken } from './utils/tokenGenerator.js';
import fs from 'fs';
import path from 'path';

console.log('🔄 Updating Secure Access Token...\n');

try {
  // Generate a new secure token
  const newToken = generateToken(32, 'hex');
  
  console.log('✅ New Token Generated Successfully!');
  console.log(`New Token: ${newToken}\n`);
  
  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ No .env file found. Run "npm run generate-token" first.');
    process.exit(1);
  }
  
  // Read current .env content
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check if SIMPLE_ACCESS_TOKEN exists
  if (!envContent.includes('SIMPLE_ACCESS_TOKEN=')) {
    console.log('❌ SIMPLE_ACCESS_TOKEN not found in .env file');
    console.log('   Run "npm run generate-token" to add it first.');
    process.exit(1);
  }
  
  // Replace the existing token
  const updatedContent = envContent.replace(
    /SIMPLE_ACCESS_TOKEN=.*/,
    `SIMPLE_ACCESS_TOKEN=${newToken}`
  );
  
  // Write back to .env file
  fs.writeFileSync(envPath, updatedContent);
  
  console.log('✅ Token updated in .env file successfully!');
  console.log('   Old token has been replaced with the new one.\n');
  
  console.log('📝 Next Steps:');
  console.log('1. Restart your server to load the new token');
  console.log('2. Test with: curl -H "Authorization: Bearer ' + newToken + '" http://localhost:5011/api/v1/payment-details');
  console.log('3. Update your frontend to use the new token');
  
  console.log('\n🔒 Security Note:');
  console.log('   The old token is no longer valid.');
  console.log('   Make sure to update any applications using the old token.');
  
} catch (error) {
  console.error('❌ Error updating token:', error.message);
  process.exit(1);
} 