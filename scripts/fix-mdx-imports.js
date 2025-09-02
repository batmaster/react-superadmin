#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Fix MDX import statement formatting issues
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_DIR = path.join(__dirname, '..', 'docs', 'docs', 'components');

function fixMdxImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix import statements that are on the same line as headings
    content = content.replace(/(import .*?;)\s*(#\s+.*)/g, '$1\n\n$2');

    // Remove any "Last Built" lines that might be causing issues
    content = content.replace(/> \*\*Last Built\*\*: .*\n?/g, '');

    // Clean up extra whitespace
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    content = content.replace(/\s+$/gm, '');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(` Fixed imports: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(` Error fixing ${filePath}:`, error.message);
  }
}

function processAllMdxFiles() {
  console.log(' Fixing MDX import statement formatting...\n');

  if (!fs.existsSync(DOCS_DIR)) {
    console.error(` Documentation directory not found: ${DOCS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DOCS_DIR);
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));

  mdxFiles.forEach(file => {
    const filePath = path.join(DOCS_DIR, file);
    fixMdxImports(filePath);
  });

  console.log(`\n Completed! Fixed imports in ${mdxFiles.length} files.`);
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  processAllMdxFiles();
}
