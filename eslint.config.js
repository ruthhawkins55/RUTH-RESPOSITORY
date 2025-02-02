import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser, // Maintain the browser global context if needed
      parser: '@typescript-eslint/parser', // Use the TypeScript parser
    },
    plugins: ['@typescript-eslint'], // Enable TypeScript plugin
    rules: {
      'no-unused-vars': 'warn', // Warn about unused variables
      'no-undef': 'warn',       // Warn about undefined variables
      '@typescript-eslint/no-explicit-any': 'warn', // Warn about explicit 'any' usage
      '@typescript-eslint/no-unused-vars': 'warn',  // Warn about unused vars in TypeScript
      '@typescript-eslint/no-floating-promises': 'warn', // Warn about unhandled promises
      '@typescript-eslint/ban-types': 'warn', // Warn about banned types
    },
    files: ['*.ts', '*.tsx', '*.js'],  // Apply these rules to TypeScript and JavaScript files
  },
];





