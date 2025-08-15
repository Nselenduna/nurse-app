#!/usr/bin/env node

/**
 * Script to check dependencies for vulnerabilities and outdated packages
 * 
 * Usage: node scripts/check-dependencies.js
 * 
 * This script will:
 * 1. Run npm audit to check for vulnerabilities
 * 2. Run npm outdated to check for outdated packages
 * 3. Generate a report with recommendations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  outputFile: path.join(__dirname, '..', 'dependency-report.md'),
  highPriorityUpdateThreshold: 1, // Major version difference
  mediumPriorityUpdateThreshold: 0, // Minor version difference
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
 * Parses npm outdated output into a structured object
 * 
 * @param {string} output - npm outdated output
 * @returns {Array<Object>} Parsed dependencies
 */
function parseOutdatedOutput(output) {
  const lines = output.split('\n').filter(Boolean);
  const dependencies = [];
  
  // Skip the header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split by whitespace and filter out empty strings
    const parts = line.split(/\s+/).filter(Boolean);
    
    if (parts.length >= 4) {
      const [name, current, wanted, latest] = parts;
      
      // Calculate version differences
      const currentParts = current === 'MISSING' ? [0, 0, 0] : current.split('.').map(Number);
      const latestParts = latest.split('.').map(Number);
      
      const majorDiff = latestParts[0] - (currentParts[0] || 0);
      const minorDiff = latestParts[1] - (currentParts[1] || 0);
      const patchDiff = latestParts[2] - (currentParts[2] || 0);
      
      // Determine update priority
      let updatePriority = 'Low';
      if (current === 'MISSING') {
        updatePriority = 'High (Missing)';
      } else if (majorDiff > config.highPriorityUpdateThreshold) {
        updatePriority = 'High (Major)';
      } else if (minorDiff > config.mediumPriorityUpdateThreshold) {
        updatePriority = 'Medium (Minor)';
      } else if (patchDiff > 0) {
        updatePriority = 'Low (Patch)';
      } else {
        updatePriority = 'N/A (Current)';
      }
      
      dependencies.push({
        name,
        current,
        wanted,
        latest,
        updatePriority,
        isMissing: current === 'MISSING',
        majorDiff,
        minorDiff,
        patchDiff,
      });
    }
  }
  
  return dependencies;
}

/**
 * Parses npm audit output to get vulnerability information
 * 
 * @param {string} output - npm audit output
 * @returns {Object} Vulnerability information
 */
function parseAuditOutput(output) {
  const vulnerabilitiesMatch = output.match(/found (\d+) vulnerabilities/);
  const vulnerabilities = vulnerabilitiesMatch ? parseInt(vulnerabilitiesMatch[1], 10) : 0;
  
  return {
    vulnerabilities,
    output,
  };
}

/**
 * Generates upgrade commands for dependencies
 * 
 * @param {Array<Object>} dependencies - Parsed dependencies
 * @returns {Object} Upgrade commands grouped by priority
 */
function generateUpgradeCommands(dependencies) {
  const missingDeps = dependencies.filter(dep => dep.isMissing).map(dep => dep.name);
  const highPriorityDeps = dependencies.filter(dep => !dep.isMissing && dep.updatePriority.startsWith('High')).map(dep => dep.name);
  const mediumPriorityDeps = dependencies.filter(dep => !dep.isMissing && dep.updatePriority.startsWith('Medium')).map(dep => dep.name);
  const lowPriorityDeps = dependencies.filter(dep => !dep.isMissing && dep.updatePriority.startsWith('Low')).map(dep => dep.name);
  
  const commands = {
    high: [],
    medium: [],
    low: [],
  };
  
  if (missingDeps.length > 0) {
    commands.high.push(`npm install ${missingDeps.join(' ')}`);
  }
  
  if (highPriorityDeps.length > 0) {
    commands.high.push(`npm install ${highPriorityDeps.map(dep => `${dep}@latest`).join(' ')}`);
  }
  
  if (mediumPriorityDeps.length > 0) {
    commands.medium.push(`npm install ${mediumPriorityDeps.map(dep => `${dep}@latest`).join(' ')}`);
  }
  
  if (lowPriorityDeps.length > 0) {
    commands.low.push(`npm install ${lowPriorityDeps.map(dep => `${dep}@latest`).join(' ')}`);
  }
  
  return commands;
}

/**
 * Generates a markdown report
 * 
 * @param {Object} data - Report data
 * @returns {string} Markdown report
 */
function generateReport(data) {
  const { dependencies, audit, upgradeCommands } = data;
  
  const missingDeps = dependencies.filter(dep => dep.isMissing);
  const productionDeps = dependencies.filter(dep => !dep.name.startsWith('@types/') && !dep.name.includes('eslint') && !dep.name.includes('babel') && !dep.name.includes('typescript'));
  const devDeps = dependencies.filter(dep => dep.name.startsWith('@types/') || dep.name.includes('eslint') || dep.name.includes('babel') || dep.name.includes('typescript'));
  
  let report = `# Dependency Audit Report\n\n`;
  
  // Summary
  report += `## Summary\n\n`;
  report += `- **Total Dependencies**: ${dependencies.length}\n`;
  report += `- **Vulnerabilities**: ${audit.vulnerabilities}\n`;
  report += `- **Outdated Packages**: ${dependencies.length}\n`;
  report += `- **Missing Packages**: ${missingDeps.length}\n\n`;
  
  // Vulnerability Analysis
  report += `## Vulnerability Analysis\n\n`;
  if (audit.vulnerabilities === 0) {
    report += `No vulnerabilities were found in the current dependencies according to npm audit.\n\n`;
  } else {
    report += `${audit.vulnerabilities} vulnerabilities were found in the current dependencies.\n\n`;
    report += '```\n';
    report += audit.output;
    report += '```\n\n';
  }
  
  // Outdated Dependencies
  report += `## Outdated Dependencies\n\n`;
  report += `The following dependencies are outdated and should be considered for upgrading:\n\n`;
  
  // Production Dependencies
  report += `### Production Dependencies\n\n`;
  report += `| Package | Current | Latest | Update Priority |\n`;
  report += `|---------|---------|--------|------------------|\n`;
  productionDeps.forEach(dep => {
    report += `| ${dep.name} | ${dep.current} | ${dep.latest} | ${dep.updatePriority} |\n`;
  });
  report += '\n';
  
  // Development Dependencies
  report += `### Development Dependencies\n\n`;
  report += `| Package | Current | Latest | Update Priority |\n`;
  report += `|---------|---------|--------|------------------|\n`;
  devDeps.forEach(dep => {
    report += `| ${dep.name} | ${dep.current} | ${dep.latest} | ${dep.updatePriority} |\n`;
  });
  report += '\n';
  
  // Missing Dependencies
  if (missingDeps.length > 0) {
    report += `## Missing Dependencies\n\n`;
    report += `The following dependencies are listed in package.json but are not installed:\n\n`;
    missingDeps.forEach((dep, index) => {
      report += `${index + 1}. **${dep.name}**\n`;
    });
    report += '\n';
  }
  
  // Upgrade Recommendations
  report += `## Upgrade Recommendations\n\n`;
  
  if (upgradeCommands.high.length > 0) {
    report += `### High Priority\n\n`;
    upgradeCommands.high.forEach((command, index) => {
      report += `${index + 1}. Run:\n\`\`\`bash\n${command}\n\`\`\`\n\n`;
    });
  }
  
  if (upgradeCommands.medium.length > 0) {
    report += `### Medium Priority\n\n`;
    upgradeCommands.medium.forEach((command, index) => {
      report += `${index + 1}. Run:\n\`\`\`bash\n${command}\n\`\`\`\n\n`;
    });
  }
  
  if (upgradeCommands.low.length > 0) {
    report += `### Low Priority\n\n`;
    upgradeCommands.low.forEach((command, index) => {
      report += `${index + 1}. Run:\n\`\`\`bash\n${command}\n\`\`\`\n\n`;
    });
  }
  
  // Upgrade Strategy
  report += `## Upgrade Strategy\n\n`;
  report += `Given the nature of React Native and Expo projects, it's recommended to follow these steps for a safe upgrade:\n\n`;
  report += `1. Create a git branch for the upgrade\n`;
  report += `2. Install missing dependencies first\n`;
  report += `3. Update high-priority dependencies\n`;
  report += `4. Run tests to ensure functionality\n`;
  report += `5. Update medium-priority dependencies\n`;
  report += `6. Run tests again\n`;
  report += `7. Update low-priority dependencies\n`;
  report += `8. Run a full test suite\n`;
  report += `9. Address any breaking changes or deprecation warnings\n\n`;
  
  // Conclusion
  report += `## Conclusion\n\n`;
  if (audit.vulnerabilities === 0 && missingDeps.length === 0) {
    report += `The project's dependencies are generally in good shape with no known vulnerabilities. However, there are several outdated packages that should be addressed. Following the recommended upgrade strategy will help maintain a secure and up-to-date dependency tree.\n`;
  } else if (audit.vulnerabilities > 0) {
    report += `The project has ${audit.vulnerabilities} vulnerabilities that should be addressed immediately. Additionally, there are outdated packages that should be updated. Following the recommended upgrade strategy will help address these issues.\n`;
  } else if (missingDeps.length > 0) {
    report += `The project has ${missingDeps.length} missing dependencies that should be installed. Additionally, there are outdated packages that should be updated. Following the recommended upgrade strategy will help address these issues.\n`;
  }
  
  return report;
}

/**
 * Main function
 */
function main() {
  console.log('Checking dependencies...');
  
  // Run npm audit
  console.log('Running npm audit...');
  const auditOutput = runCommand('npm audit');
  const audit = parseAuditOutput(auditOutput);
  
  // Run npm outdated
  console.log('Running npm outdated...');
  const outdatedOutput = runCommand('npm outdated');
  const dependencies = parseOutdatedOutput(outdatedOutput);
  
  // Generate upgrade commands
  const upgradeCommands = generateUpgradeCommands(dependencies);
  
  // Generate report
  const report = generateReport({ dependencies, audit, upgradeCommands });
  
  // Write report to file
  fs.writeFileSync(config.outputFile, report);
  
  console.log(`Report generated at ${config.outputFile}`);
  
  // Print summary
  console.log('\nSummary:');
  console.log(`- Total Dependencies: ${dependencies.length}`);
  console.log(`- Vulnerabilities: ${audit.vulnerabilities}`);
  console.log(`- Outdated Packages: ${dependencies.length}`);
  console.log(`- Missing Packages: ${dependencies.filter(dep => dep.isMissing).length}`);
}

// Run the script
main();
