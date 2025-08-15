module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'prettier',
  ],
  rules: {
    // Naming conventions
    '@typescript-eslint/naming-convention': [
      'error',
      // Interface names must be PascalCase and start with I
      {
        selector: 'interface',
        format: ['PascalCase'],
      },
      // Type names must be PascalCase
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
      // Enum names must be PascalCase
      {
        selector: 'enum',
        format: ['PascalCase'],
      },
      // Enum members must be UPPER_CASE
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
      // Boolean variables should start with is, has, or should
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['camelCase'],
        prefix: ['is', 'has', 'should', 'can', 'did', 'will'],
      },
      // Functions must be camelCase
      {
        selector: 'function',
        format: ['camelCase'],
      },
      // React components (functions starting with capital letters) must be PascalCase
      {
        selector: 'function',
        filter: {
          regex: '^[A-Z]',
          match: true,
        },
        format: ['PascalCase'],
      },
      // Variables must be camelCase or UPPER_CASE
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },
      // Constants must be UPPER_CASE
      {
        selector: 'variable',
        modifiers: ['const', 'global'],
        format: ['UPPER_CASE', 'camelCase', 'PascalCase'],
      },
      // Parameters must be camelCase
      {
        selector: 'parameter',
        format: ['camelCase'],
      },
      // Class methods must be camelCase
      {
        selector: 'method',
        format: ['camelCase'],
      },
      // Class properties must be camelCase
      {
        selector: 'property',
        format: ['camelCase', 'UPPER_CASE'],
      },
      // Type parameters must be PascalCase
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
      },
    ],

    // React rules
    'react/prop-types': 'off', // We use TypeScript for prop validation
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
    'react/display-name': 'off', // Not needed with function components
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    'react/jsx-props-no-spreading': 'off', // Allow JSX prop spreading
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/jsx-boolean-value': ['error', 'never'],
    'react/self-closing-comp': 'error',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'arrow-function',
      },
    ],

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // TypeScript rules
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Return types can be inferred
    '@typescript-eslint/no-explicit-any': 'warn', // Discourage any type
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',

    // Import rules
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-default-export': 'off', // Allow default exports for pages
    'import/prefer-default-export': 'off', // Allow named exports
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'] },
    ],

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Discourage console.log
    'no-debugger': 'warn', // Discourage debugger statements
    'no-alert': 'warn', // Discourage alert, confirm, prompt
    'no-unused-vars': 'off', // Handled by TypeScript
    'prefer-const': 'error', // Prefer const over let
    'no-var': 'error', // Disallow var
    'eqeqeq': ['error', 'always'], // Require === and !==
    'curly': ['error', 'all'], // Require curly braces for all control statements
    'max-lines-per-function': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
    'max-depth': ['warn', 4],
    'complexity': ['warn', 15],
    'prettier/prettier': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  ignorePatterns: [
    'node_modules/',
    'build/',
    'dist/',
    'coverage/',
    '*.config.js',
    '.eslintrc.js',
  ],
  overrides: [
    // Specific rules for test files
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        'max-lines-per-function': 'off',
        'no-console': 'off',
      },
    },
    // Specific rules for pages (allow default exports)
    {
      files: ['app/**/*.tsx'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
};
