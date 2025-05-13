module.exports = {
  semi: true, // Use semicolons at the end of statements
  singleQuote: true, // Use single quotes instead of double quotes
  trailingComma: 'all', // Add trailing commas where valid in ES5
  printWidth: 80, // Wrap lines at 80 characters
  tabWidth: 2, // Set the number of spaces per indentation level
  useTabs: false, // Use spaces instead of tabs
  arrowParens: 'always', // Always include parentheses around arrow function arguments
  endOfLine: 'lf', // Use line feed (LF) for line endings
  overrides: [
    {
      files: '*.feature',
      options: {
        printWidth: 100, // Allow wider lines for Gherkin feature files
        tabWidth: 2,
      },
    },
  ],
};
