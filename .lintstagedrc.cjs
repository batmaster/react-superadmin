module.exports = {
  // TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': [
    'prettier --write --ignore-unknown',
    'eslint --fix --max-warnings=100',
  ],

  // JSON, Markdown, YAML, and other config files
  '*.{json,jsonc,md,yml,yaml,html,css,scss,less}': [
    'prettier --write --ignore-unknown',
  ],

  // Package files
  'package.json': ['prettier --write'],

  // Config files
  '*.{js,ts,json}': ['prettier --write --ignore-unknown'],

  // Documentation files - ensure they're properly formatted
  'docs/**/*.{md,mdx,ts,tsx,js,jsx}': ['prettier --write --ignore-unknown'],
};
