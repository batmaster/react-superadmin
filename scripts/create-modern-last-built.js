#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

/**
 * Creates a modern "Last Built" indicator as a small top-right element
 * This script creates a more elegant design than the current blockquote approach
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_DIR = path.join(__dirname, '..', 'docs', 'docs', 'components');

function getGitCommitDate(filePath) {
  try {
    const gitCommand = `git log -1 --format="%cd" --date=format:"%B %d, %Y at %I:%M %p" -- "${filePath}"`;
    const result = execSync(gitCommand, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..'),
    });
    return result.trim();
  } catch (error) {
    console.warn(
      `[WARN] No git history for ${path.basename(filePath)}, using current date`
    );
    const now = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return now.toLocaleDateString('en-US', options);
  }
}

function createModernLastBuiltIndicator(commitDate) {
  return `import { LastBuilt } from '@site/src/components/LastBuilt';

<LastBuilt date="${commitDate}" />`;
}

function updateLastBuiltDesign(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const commitDate = getGitCommitDate(filePath);

    // Remove any existing "Last Built" lines
    let updatedContent = content.replace(/> \*\*Last Built\*\*: .*\n?/g, '');
    updatedContent = updatedContent.replace(/> \*\* Last Built\*\*: .*\n?/g, '');

    // Add the modern indicator after frontmatter
    const frontmatterEnd = updatedContent.indexOf('---', updatedContent.indexOf('---') + 3);
    if (frontmatterEnd !== -1) {
      const beforeFrontmatter = updatedContent.substring(0, frontmatterEnd + 3);
      const afterFrontmatter = updatedContent.substring(frontmatterEnd + 3);

      const modernIndicator = createModernLastBuiltIndicator(commitDate);
      
      const updatedContentWithIndicator = beforeFrontmatter + '\n\n' + modernIndicator + '\n\n' + afterFrontmatter;
      
      fs.writeFileSync(filePath, updatedContentWithIndicator, 'utf8');
      console.log(`[OK] Updated design: ${path.basename(filePath)} (${commitDate})`);
    }
  } catch (error) {
    console.error(`[ERROR] Error updating ${filePath}:`, error.message);
  }
}

function processAllMdxFiles() {
  console.log('[INFO] Creating modern "Last Built" design for all MDX files...\n');

  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`[ERROR] Documentation directory not found: ${DOCS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DOCS_DIR);
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));

  if (mdxFiles.length === 0) {
    console.log('[INFO] No MDX files found in documentation directory');
    return;
  }

  console.log(`[INFO] Found ${mdxFiles.length} MDX files to process:\n`);

  mdxFiles.forEach(file => {
    const filePath = path.join(DOCS_DIR, file);
    updateLastBuiltDesign(filePath);
  });

  console.log(
    `\n[SUCCESS] Completed! Updated ${mdxFiles.length} documentation files with modern "Last Built" design.`
  );
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  processAllMdxFiles();
}

export { updateLastBuiltDesign, getGitCommitDate };
