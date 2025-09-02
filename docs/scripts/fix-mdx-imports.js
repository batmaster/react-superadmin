// @ts-nocheck - Node.js script, not TypeScript module
const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../docs/components');

// Common import patterns to fix
const importPatterns = [
  {
    pattern:
      /import \{ LiveProvider, LiveEditor, LiveError, LivePreview \} from 'react-live';\s*\nimport \{ (\w+) \} from '@react-superadmin\/web';/g,
    replacement: (match, componentName) =>
      `imports:\n  LiveProvider: 'react-live'\n  LiveEditor: 'react-live'\n  LiveError: 'react-live'\n  LivePreview: 'react-live'\n  ${componentName}: '@react-superadmin/web'`,
  },
  {
    pattern: /import \{ (\w+) \} from '@site\/src\/components\/ui\/(\w+)';/g,
    replacement: (match, componentName, pathName) =>
      `imports:\n  ${componentName}: '@site/src/components/ui/${pathName}'`,
  },
  {
    pattern: /import \{ (\w+) \} from '@react-superadmin\/web';/g,
    replacement: (match, componentName) =>
      `imports:\n  ${componentName}: '@react-superadmin/web'`,
  },
];

function fixImportsInMdx(filePath) {
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
    
    // Extract import lines
    const importLines = lines.slice(0, i);
    
    // Create new frontmatter with imports
    const newFrontmatter = frontmatter.replace(
      '---',
      `imports:\n${importLines
        .map(line => {
          const match = line.match(/import \{ (.*) \} from '([^']+)'/);
          if (match) {
            const components = match[1].split(', ').map(c => c.trim());
            const source = match[2];
            return components.map(comp => `  ${comp}: '${source}'`).join('\n');
          }
          return '';
        })
        .join('\n')}\n---`
    );
    
    // Remove import lines from main content
    const newMainContent = lines.slice(i).join('\n');
    
    // Write fixed content
    const newContent = newFrontmatter + newMainContent;
    fs.writeFileSync(filePath, newContent);
    console.log(`Fixed imports in: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error processing ${path.basename(filePath)}:`, error.message);
  }
}

// Process all MDX files
const files = fs
  .readdirSync(componentsDir)
  .filter(file => file.endsWith('.mdx'));
files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  fixImportsInMdx(filePath);
});

console.log(`Processed ${files.length} MDX files`);
