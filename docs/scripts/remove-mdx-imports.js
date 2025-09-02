// @ts-nocheck - Node.js script, not TypeScript module
const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../docs/components');

function removeImportsFromMdx(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Find the end of frontmatter
  const frontmatterEnd = content.indexOf('---', 3);
  if (frontmatterEnd === -1) return;

  // Extract frontmatter and content
  const frontmatter = content.substring(0, frontmatterEnd + 3);
  const mainContent = content.substring(frontmatterEnd + 3);

  // Check if there are imports after frontmatter
  const importMatch = mainContent.match(/^import .*$/m);
  if (!importMatch) return;

  // Find all import statements
  const lines = mainContent.split('\n');
  let i = 0;
  while (i < lines.length && lines[i].trim().startsWith('import')) {
    i++;
  }

  // Remove import lines from main content
  const newMainContent = lines.slice(i).join('\n');

  // Write fixed content
  const newContent = frontmatter + newMainContent;
  fs.writeFileSync(filePath, newContent);
  console.log(`Removed imports from: ${path.basename(filePath)}`);
}

// Process all MDX files
const files = fs
  .readdirSync(componentsDir)
  .filter(file => file.endsWith('.mdx'));
files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  removeImportsFromMdx(filePath);
});

console.log(`Processed ${files.length} MDX files`);
