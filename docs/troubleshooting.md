# Troubleshooting Guide

This document provides solutions for common issues that may arise during development of the Nurse Revalidator app.

## Markdown Linting Issues

The documentation files may show several markdown linting errors:

- `MD009/no-trailing-spaces`: Trailing spaces at end of lines

- `MD026/no-trailing-punctuation`: Trailing punctuation in headings

- `MD032/blanks-around-lists`: Missing blank lines around lists

- `MD031/blanks-around-fences`: Missing blank lines around code blocks

- `MD024/no-duplicate-heading`: Multiple headings with the same content

These are style/formatting issues and don't affect functionality. They can be fixed by:


```javascript
// Fix script for markdown linting issues (run with Node.js)
const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir, {withFileTypes: true});
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      processDir(fullPath);
    } else if (file.name.endsWith('.md')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Fix trailing spaces (MD009)
      content = content.replace(/[ \t]+$/gm, '');

      // Fix trailing punctuation in headings (MD026)
      content = content.replace(/^(#+.*[:.!?,;])$/gm, match => match.replace(/[:.!?,;]$/, ''));

      fs.writeFileSync(fullPath, content);
      console.log('Fixed: ' + fullPath);
    }
  }
}

// Start with docs directory
processDir('./docs');

```


## CI Configuration Environment Variable Warnings

If you see warnings related to environment variables in CI configuration files like:

- `Context access might be invalid: CODECOV_TOKEN`

- `Context access might be invalid: EXPO_TOKEN`

- `Context access might be invalid: SLACK_WEBHOOK_URL`

These are warnings about environment variables referenced in CI configuration that might not be defined in all environments. They don't affect local development functionality.

Ensure these variables are properly set in your CI platform's environment settings:

1. **CODECOV_TOKEN**: Used for uploading test coverage to Codecov

2. **EXPO_TOKEN**: Required for Expo CLI authentication in CI environments

3. **SLACK_WEBHOOK_URL**: For sending notifications to Slack

## Module Resolution Errors

If you encounter `UnableToResolveError` issues with module imports (especially with `@/` path aliases), you need to configure Babel and Metro properly:

### 1. Babel Configuration

Create or update `babel.config.js`:


```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        alias: {
          '@': '.',
        },
      }],
      'react-native-reanimated/plugin',
    ],
  };
};

```


### 2. Metro Configuration

Create or update `metro.config.js`:


```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support @ alias for imports
config.resolver.extraNodeModules = {
  '@': __dirname,
};

module.exports = config;

```


### 3. Required Dependencies

Install the module resolver plugin:


```bash
npm install --save-dev babel-plugin-module-resolver

```


### 4. TypeScript Configuration

Ensure your `tsconfig.json` has the path mappings:


```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

```


After making these changes, restart your development server with `npm start -- --reset-cache` to clear the Metro bundler cache.
