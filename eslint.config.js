import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser,  // Maintain the browser global context if needed
    },
    rules: {
      "no-unused-vars": "warn",  // Warn about unused variables
      "no-undef": "warn",        // Warn about undefined variables
    },
    files: ["*.js"],  // Apply these rules to JavaScript files
  },
];




