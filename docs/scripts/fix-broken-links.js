#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all MDX files
function findMdxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findMdxFiles(fullPath));
    } else if (item.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Function to fix broken links in a file
function fixBrokenLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix links that point to /components/ to point to /docs/components/
  const componentLinkRegex = /\[([^\]]+)\]\(\/components\/([^)]+)\)/g;
  const componentLinkReplacement = '[$1](/docs/components/$2)';

  // Fix links that point to /docs/docs/components/ to point to /docs/components/
  const doubleDocsLinkRegex =
    /\[([^\]]+)\]\(\/docs\/docs\/components\/([^)]+)\)/g;
  const doubleDocsLinkReplacement = '[$1](/docs/components/$2)';

  // Fix links that point to /docs/components/ to point to /components/
  const docsComponentLinkRegex = /\[([^\]]+)\]\(\/docs\/components\/([^)]+)\)/g;
  const docsComponentLinkReplacement = '[$1](/components/$2)';

  // Fix Security link
  const securityLinkRegex =
    /\[Security\]\(\/docs\/components\/authorization\)/g;
  const securityLinkReplacement = '[Security](/components/authorization)';

  let newContent = content.replace(
    componentLinkRegex,
    componentLinkReplacement
  );
  newContent = newContent.replace(
    doubleDocsLinkRegex,
    doubleDocsLinkReplacement
  );
  newContent = newContent.replace(
    docsComponentLinkRegex,
    docsComponentLinkReplacement
  );
  newContent = newContent.replace(securityLinkRegex, securityLinkReplacement);

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    modified = true;
    console.log(`Fixed links in: ${filePath}`);
  }

  return modified;
}

// Main execution
const docsDir = path.join(__dirname, '..', 'docs');
console.log('Scanning for MDX files...');

const mdxFiles = findMdxFiles(docsDir);
console.log(`Found ${mdxFiles.length} MDX files`);

let fixedCount = 0;
for (const file of mdxFiles) {
  if (fixBrokenLinks(file)) {
    fixedCount++;
  }
}

console.log(`Fixed broken links in ${fixedCount} files`);
