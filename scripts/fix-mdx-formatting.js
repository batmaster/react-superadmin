#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Comprehensive fix for MDX formatting issues
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_DIR = path.join(__dirname, '..', 'docs', 'docs', 'components');

function fixMdxFormatting(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove the "Last Built" line completely for now
    content = content.replace(/> \*\*🔄 Last Built\*\*: .*\n?/g, '');

    // Fix duplicated text patterns
    content = content.replace(/([^.])\s+([^.]*)\s+\1\s+\2/g, '$1 $2');

    // Clean up extra whitespace
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    content = content.replace(/\s+$/gm, '');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed formatting: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

function processAllMdxFiles() {
  console.log('🔧 Fixing MDX formatting issues...\n');

  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`❌ Documentation directory not found: ${DOCS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DOCS_DIR);
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));

  mdxFiles.forEach(file => {
    const filePath = path.join(DOCS_DIR, file);
    fixMdxFormatting(filePath);
  });

  console.log(`\n🎉 Completed! Fixed formatting in ${mdxFiles.length} files.`);
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  processAllMdxFiles();
}
