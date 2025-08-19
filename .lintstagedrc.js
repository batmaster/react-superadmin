module.exports = {
  // TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': [
    'prettier --write --ignore-unknown',
    'eslint --fix --max-warnings=0',
    'git add'
  ],
  
  // JSON, Markdown, YAML, and other config files
  '*.{json,jsonc,md,yml,yaml,html,css,scss,less}': [
    'prettier --write --ignore-unknown',
    'git add'
  ],
  
  // Package files
  'package.json': [
    'prettier --write',
    'git add'
  ],
  
  // Config files
  '*.{js,ts,json}': [
    'prettier --write --ignore-unknown',
    'git add'
  ],
  
  // Documentation files - ensure they're properly formatted
  'docs/**/*.{md,mdx,ts,tsx,js,jsx}': [
    'prettier --write --ignore-unknown',
    'git add'
  ]
};
