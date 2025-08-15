const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Function to fix markdown files
function fixMarkdownFile(filePath) {
  console.log(`Processing: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix trailing spaces (MD009)
  content = content.replace(/[ \t]+$/gm, '');
  
  // Fix trailing punctuation in headings (MD026)
  content = content.replace(/^(#+.*[:.!?,;])$/gm, (match) => {
    return match.replace(/[:.!?,;]$/, '');
  });
  
  // Fix blanks around lists (MD032)
  content = content.replace(/^([^\S\n]*[-*+] .+)(?:\r?\n)([^\S\n]*[-*+] .+)/gm, '$1\n\n$2');
  content = content.replace(/^([^\S\n]*[0-9]+\. .+)(?:\r?\n)([^\S\n]*[0-9]+\. .+)/gm, '$1\n\n$2');
  
  // Fix blanks around fences (MD031)
  content = content.replace(/^([^\n]*[^\n`])(?:\r?\n)([^\S\n]*```)/gm, '$1\n\n$2');
  content = content.replace(/^([^\S\n]*```)(?:\r?\n)([^\n`][^\n]*)/gm, '$1\n\n$2');
  
  // Write the fixed content back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${filePath}`);
}

// Process all markdown files in docs directory
async function main() {
  try {
    console.log('Starting markdown fix script...');
    console.log('Current working directory:', process.cwd());
    console.log('Searching for markdown files in docs/**/*.md');
    
    // List files in docs directory
    try {
      const docFiles = fs.readdirSync('docs');
      console.log('Files in docs directory:', docFiles);
    } catch (e) {
      console.error('Error reading docs directory:', e);
    }
    
    // Try to find markdown files
    const files = await glob('docs/**/*.md');
    console.log(`Found ${files.length} markdown files:`, files);
    
    if (files.length === 0) {
      console.log('No markdown files found to process');
      return;
    }
    
    // Process each file
    for (const file of files) {
      try {
        fixMarkdownFile(file);
      } catch (e) {
        console.error(`Error processing file ${file}:`, e);
      }
    }
    
    console.log(`\nProcessed ${files.length} files successfully`);
  } catch (err) {
    console.error('Error in main function:', err);
  }
}

main();
