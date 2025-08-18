/**
 * Script to run the app with production environment variables
 */
const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.APP_VARIANT = 'production';
process.env.NODE_ENV = 'production';

console.log('🚀 Running in production simulation mode');

// Get command line args
const platform = process.argv[2] || '';

// Build the command
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['expo', 'start'];

if (platform === 'android') {
  args.push('--android');
} else if (platform === 'ios') {
  args.push('--ios');
}

// Run the command with environment variables
const child = spawn(command, args, {
  stdio: 'inherit',
  env: process.env
});

// Handle process events
child.on('error', (error) => {
  console.error(`Error starting the process: ${error}`);
  process.exit(1);
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`Process exited with code ${code}`);
  }
  process.exit(code);
});
