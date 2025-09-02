// @ts-nocheck - Node.js script, not TypeScript module
const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../docs/components');

function fixBrokenLinks(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Fix links from /docs/components/ to /components/
    const fixedContent = content.replace(
      /\/docs\/components\//g,
      '/components/'
    );

    // Only write if content changed
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`Fixed links in: ${path.basename(filePath)}`);
    } else {
      console.log(`No broken links found in: ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(
      `Error processing ${path.basename(filePath)}:`,
      error.message
    );
  }
}

// Process ALL MDX files in the components directory
const allFiles = fs
  .readdirSync(componentsDir)
  .filter(file => file.endsWith('.mdx'));
console.log(`Found ${allFiles.length} MDX files to check for broken links`);

allFiles.forEach(file => {
  const filePath = path.join(componentsDir, file);
  fixBrokenLinks(filePath);
});

console.log(`Processed ${allFiles.length} files for broken link fixes`);
