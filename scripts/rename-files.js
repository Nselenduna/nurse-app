#!/usr/bin/env node

/**
 * Script to rename files according to naming conventions
 * 
 * Usage: node scripts/rename-files.js
 * 
 * This script will:
 * 1. Scan the src directory for files
 * 2. Identify files that don't follow naming conventions
 * 3. Suggest new names for these files
 * 4. Optionally rename the files (with user confirmation)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const config = {
  rootDir: path.join(__dirname, '..', 'src'),
  dryRun: true, // Set to false to actually rename files
  patterns: [
    // Components should use PascalCase and have .tsx extension
    {
      test: (file) => file.includes('/components/') && file.endsWith('.tsx'),
      rename: (file) => {
        const dir = path.dirname(file);
        const base = path.basename(file, '.tsx');
        // Convert to PascalCase
        const pascalCase = base
          .split(/[-_.]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join('');
        return path.join(dir, `${pascalCase}.tsx`);
      }
    },
    // Hooks should start with 'use' and use camelCase
    {
      test: (file) => file.includes('/hooks/') && file.endsWith('.ts') && !file.includes('.test.'),
      rename: (file) => {
        const dir = path.dirname(file);
        const base = path.basename(file, '.ts');
        // Ensure it starts with 'use'
        const camelCase = base.startsWith('use')
          ? base
          : 'use' + base.charAt(0).toUpperCase() + base.slice(1);
        return path.join(dir, `${camelCase}.ts`);
      }
    },
    // Services should end with 'Service' and use camelCase
    {
      test: (file) => file.includes('/services/') && file.endsWith('.ts') && !file.includes('.test.'),
      rename: (file) => {
        const dir = path.dirname(file);
        const base = path.basename(file, '.ts');
        // Ensure it ends with 'Service'
        const camelCase = base.endsWith('Service')
          ? base
          : base + 'Service';
        return path.join(dir, `${camelCase}.ts`);
      }
    },
    // Test files should have .test. before the extension
    {
      test: (file) => (file.endsWith('.ts') || file.endsWith('.tsx')) && 
                      file.includes('/__tests__/') && 
                      !file.includes('.test.'),
      rename: (file) => {
        const dir = path.dirname(file);
        const ext = path.extname(file);
        const base = path.basename(file, ext);
        return path.join(dir, `${base}.test${ext}`);
      }
    }
  ]
};

/**
 * Walk a directory recursively and collect all files
 * 
 * @param {string} dir - Directory to walk
 * @param {string[]} [fileList=[]] - Accumulator for file list
 * @returns {string[]} List of all files
 */
function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fileList = walkDir(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Find files that need to be renamed
 * 
 * @param {string[]} files - List of files to check
 * @returns {Object[]} List of files to rename with their new names
 */
function findFilesToRename(files) {
  const toRename = [];
  
  files.forEach(file => {
    // Check each pattern
    config.patterns.forEach(pattern => {
      if (pattern.test(file)) {
        const newName = pattern.rename(file);
        if (newName !== file) {
          toRename.push({
            oldPath: file,
            newPath: newName,
            oldName: path.basename(file),
            newName: path.basename(newName)
          });
        }
      }
    });
  });
  
  return toRename;
}

/**
 * Rename a file
 * 
 * @param {Object} file - File to rename
 * @returns {Promise<void>}
 */
function renameFile(file) {
  return new Promise((resolve, reject) => {
    if (config.dryRun) {
      console.log(`Would rename: ${file.oldName} -> ${file.newName}`);
      resolve();
      return;
    }
    
    fs.rename(file.oldPath, file.newPath, (err) => {
      if (err) {
        console.error(`Error renaming ${file.oldName}:`, err);
        reject(err);
      } else {
        console.log(`Renamed: ${file.oldName} -> ${file.newName}`);
        resolve();
      }
    });
  });
}

/**
 * Main function
 */
async function main() {
  try {
    // Get all files
    const files = walkDir(config.rootDir);
    
    // Find files to rename
    const toRename = findFilesToRename(files);
    
    if (toRename.length === 0) {
      console.log('No files need to be renamed.');
      rl.close();
      return;
    }
    
    console.log(`Found ${toRename.length} files to rename:`);
    toRename.forEach(file => {
      console.log(`  ${file.oldName} -> ${file.newName}`);
    });
    
    if (config.dryRun) {
      console.log('\nThis was a dry run. Set config.dryRun = false to actually rename files.');
      rl.close();
      return;
    }
    
    // Ask for confirmation
    rl.question('\nDo you want to rename these files? (y/n) ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        // Rename files
        for (const file of toRename) {
          await renameFile(file);
        }
        console.log('All files renamed successfully.');
      } else {
        console.log('Operation cancelled.');
      }
      rl.close();
    });
  } catch (err) {
    console.error('Error:', err);
    rl.close();
  }
}

// Run the script
main();
