#!/usr/bin/env node

/**
 * Script to scan the codebase for security issues
 * 
 * Usage: node scripts/security-scan.js
 * 
 * This script will:
 * 1. Scan for hardcoded secrets and API keys
 * 2. Check for insecure error handling
 * 3. Check for insecure data storage
 * 4. Generate a report with findings and recommendations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  outputFile: path.join(__dirname, '..', 'security-scan-report.md'),
  patterns: {
    secrets: [
      'password\\s*[=:]\\s*["\']\\w+["\']',
      'secret\\s*[=:]\\s*["\']\\w+["\']',
      'key\\s*[=:]\\s*["\'][\\w-]+["\']',
      'token\\s*[=:]\\s*["\'][\\w-]+["\']',
      'api[_-]?key\\s*[=:]\\s*["\'][\\w-]+["\']',
      'auth\\s*[=:]\\s*["\'][\\w-]+["\']',
      'credential\\s*[=:]\\s*["\'][\\w-]+["\']',
      'private\\s*[=:]\\s*["\'][\\w-]+["\']',
    ],
    apiKeys: [
      'api_key\\s*[=:]\\s*["\'][\\w-]+["\']',
      'apikey\\s*[=:]\\s*["\'][\\w-]+["\']',
      'client_secret\\s*[=:]\\s*["\'][\\w-]+["\']',
      'client_id\\s*[=:]\\s*["\'][\\w-]+["\']',
      'access_token\\s*[=:]\\s*["\'][\\w-]+["\']',
      'refresh_token\\s*[=:]\\s*["\'][\\w-]+["\']',
      'authorization\\s*[=:]\\s*["\'][\\w-]+["\']',
    ],
    insecureErrorHandling: [
      'console\\.error\\(',
      'console\\.log\\(.*error',
      'throw new Error\\(',
    ],
    insecureDataStorage: [
      'AsyncStorage\\.setItem\\(',
      'localStorage\\.setItem\\(',
      'sessionStorage\\.setItem\\(',
    ],
  },
  excludeDirs: [
    'node_modules',
    'build',
    'dist',
    'coverage',
    '.git',
    '.expo',
    'android',
    'ios',
  ],
};

/**
 * Runs a command and returns the output
 * 
 * @param {string} command - Command to run
 * @returns {string} Command output
 */
function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    return error.stdout;
  }
}

/**
 * Scans files for a pattern
 * 
 * @param {string} pattern - Regex pattern to search for
 * @param {string[]} excludeDirs - Directories to exclude
 * @returns {Array<{file: string, line: string, lineNumber: number}>} Matches
 */
function scanForPattern(pattern, excludeDirs = []) {
  const excludeArgs = excludeDirs.map(dir => `--exclude-dir=${dir}`).join(' ');
  const command = `grep -r -n -P "${pattern}" --include="*.{js,jsx,ts,tsx,json}" ${excludeArgs} .`;
  
  try {
    const output = execSync(command, { encoding: 'utf8' });
    const matches = [];
    
    output.split('\n').forEach(line => {
      if (!line.trim()) return;
      
      const match = line.match(/^(.+):(\d+):(.*)/);
      if (match) {
        const [, file, lineNumber, matchedLine] = match;
        matches.push({
          file,
          line: matchedLine.trim(),
          lineNumber: parseInt(lineNumber, 10),
        });
      }
    });
    
    return matches;
  } catch (error) {
    if (error.status === 1) {
      // grep returns 1 when no matches are found
      return [];
    }
    console.error('Error scanning for pattern:', error);
    return [];
  }
}

/**
 * Scans the codebase for security issues
 * 
 * @returns {Object} Scan results
 */
function scanCodebase() {
  const results = {
    secrets: [],
    apiKeys: [],
    insecureErrorHandling: [],
    insecureDataStorage: [],
  };
  
  // Scan for secrets
  config.patterns.secrets.forEach(pattern => {
    const matches = scanForPattern(pattern, config.excludeDirs);
    results.secrets.push(...matches);
  });
  
  // Scan for API keys
  config.patterns.apiKeys.forEach(pattern => {
    const matches = scanForPattern(pattern, config.excludeDirs);
    results.apiKeys.push(...matches);
  });
  
  // Scan for insecure error handling
  config.patterns.insecureErrorHandling.forEach(pattern => {
    const matches = scanForPattern(pattern, config.excludeDirs);
    results.insecureErrorHandling.push(...matches);
  });
  
  // Scan for insecure data storage
  config.patterns.insecureDataStorage.forEach(pattern => {
    const matches = scanForPattern(pattern, config.excludeDirs);
    results.insecureDataStorage.push(...matches);
  });
  
  return results;
}

/**
 * Generates a markdown report
 * 
 * @param {Object} results - Scan results
 * @returns {string} Markdown report
 */
function generateReport(results) {
  let report = `# Security Scan Report\n\n`;
  
  // Summary
  report += `## Summary\n\n`;
  report += `- **Hardcoded Secrets**: ${results.secrets.length} found\n`;
  report += `- **API Keys**: ${results.apiKeys.length} found\n`;
  report += `- **Insecure Error Handling**: ${results.insecureErrorHandling.length} instances\n`;
  report += `- **Insecure Data Storage**: ${results.insecureDataStorage.length} instances\n\n`;
  
  // Hardcoded Secrets
  report += `## Hardcoded Secrets\n\n`;
  if (results.secrets.length === 0) {
    report += `No hardcoded secrets found.\n\n`;
  } else {
    report += `The following hardcoded secrets were found:\n\n`;
    results.secrets.forEach(match => {
      report += `- **${match.file}:${match.lineNumber}**: \`${match.line}\`\n`;
    });
    report += '\n';
  }
  
  // API Keys
  report += `## API Keys\n\n`;
  if (results.apiKeys.length === 0) {
    report += `No API keys found.\n\n`;
  } else {
    report += `The following API keys were found:\n\n`;
    results.apiKeys.forEach(match => {
      report += `- **${match.file}:${match.lineNumber}**: \`${match.line}\`\n`;
    });
    report += '\n';
  }
  
  // Insecure Error Handling
  report += `## Insecure Error Handling\n\n`;
  if (results.insecureErrorHandling.length === 0) {
    report += `No instances of insecure error handling found.\n\n`;
  } else {
    report += `The following instances of potentially insecure error handling were found:\n\n`;
    results.insecureErrorHandling.forEach(match => {
      report += `- **${match.file}:${match.lineNumber}**: \`${match.line}\`\n`;
    });
    report += '\n';
  }
  
  // Insecure Data Storage
  report += `## Insecure Data Storage\n\n`;
  if (results.insecureDataStorage.length === 0) {
    report += `No instances of insecure data storage found.\n\n`;
  } else {
    report += `The following instances of potentially insecure data storage were found:\n\n`;
    results.insecureDataStorage.forEach(match => {
      report += `- **${match.file}:${match.lineNumber}**: \`${match.line}\`\n`;
    });
    report += '\n';
  }
  
  // Recommendations
  report += `## Recommendations\n\n`;
  
  if (results.secrets.length > 0 || results.apiKeys.length > 0) {
    report += `### 1. Remove Hardcoded Secrets\n\n`;
    report += `- Move secrets and API keys to environment variables or secure storage\n`;
    report += `- Use a configuration service to load secrets at runtime\n`;
    report += `- Consider using a secrets management service\n\n`;
  }
  
  if (results.insecureErrorHandling.length > 0) {
    report += `### ${results.secrets.length > 0 || results.apiKeys.length > 0 ? '2' : '1'}. Improve Error Handling\n\n`;
    report += `- Replace direct error logging with a structured logging service\n`;
    report += `- Sanitize sensitive information in error messages\n`;
    report += `- Use different log levels for development and production\n\n`;
  }
  
  if (results.insecureDataStorage.length > 0) {
    report += `### ${(results.secrets.length > 0 || results.apiKeys.length > 0 ? 1 : 0) + (results.insecureErrorHandling.length > 0 ? 1 : 0) + 1}. Secure Data Storage\n\n`;
    report += `- Use secure storage for sensitive information (e.g., \`expo-secure-store\`)\n`;
    report += `- Encrypt sensitive data before storing\n`;
    report += `- Implement proper data validation\n\n`;
  }
  
  report += `### General Security Recommendations\n\n`;
  report += `- Implement a security audit process\n`;
  report += `- Regularly scan dependencies for vulnerabilities\n`;
  report += `- Use HTTPS for all network requests\n`;
  report += `- Implement proper authentication and authorization\n`;
  report += `- Validate and sanitize all user input\n\n`;
  
  return report;
}

/**
 * Main function
 */
function main() {
  console.log('Scanning codebase for security issues...');
  
  // Scan codebase
  const results = scanCodebase();
  
  // Generate report
  const report = generateReport(results);
  
  // Write report to file
  fs.writeFileSync(config.outputFile, report);
  
  console.log(`Report generated at ${config.outputFile}`);
  
  // Print summary
  console.log('\nSummary:');
  console.log(`- Hardcoded Secrets: ${results.secrets.length}`);
  console.log(`- API Keys: ${results.apiKeys.length}`);
  console.log(`- Insecure Error Handling: ${results.insecureErrorHandling.length}`);
  console.log(`- Insecure Data Storage: ${results.insecureDataStorage.length}`);
}

// Run the script
main();
