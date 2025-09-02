// @ts-nocheck - Node.js script, not TypeScript module
const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../docs/components');

function removeImportsFromMdx(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Find the end of frontmatter (second ---)
    const firstDash = content.indexOf('---');
    const secondDash = content.indexOf('---', firstDash + 3);
    if (secondDash === -1) {
      console.log(`No frontmatter found in: ${path.basename(filePath)}`);
      return;
    }

    // Extract frontmatter and content
    const frontmatter = content.substring(0, secondDash + 3);
    const mainContent = content.substring(secondDash + 3);

    // Check if there are imports after frontmatter
    const importMatch = mainContent.match(/^import .*$/m);
    if (!importMatch) {
      console.log(`No imports found in: ${path.basename(filePath)}`);
      return;
    }

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
  } catch (error) {
    console.error(
      `Error processing ${path.basename(filePath)}:`,
      error.message
    );
  }
}

// Process all MDX files
const files = fs
  .readdirSync(componentsDir)
  .filter(file => file.endsWith('.mdx'));
console.log(`Found ${files.length} MDX files to process`);

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  removeImportsFromMdx(filePath);
});

console.log(`Processed ${files.length} files`);
