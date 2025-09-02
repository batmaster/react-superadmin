#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

/**
 * Updates the "Last Built" date in all MDX documentation files using Git commit dates
 * This script uses the last commit date for each individual file
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_DIR = path.join(__dirname, '..', 'docs', 'docs', 'components');

function getGitCommitDate(filePath) {
  try {
    // Get the last commit date for this specific file
    const gitCommand = `git log -1 --format="%cd" --date=format:"%B %d, %Y at %I:%M %p" -- "${filePath}"`;
    const result = execSync(gitCommand, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..'),
    });
    return result.trim();
  } catch (error) {
    // If file has no git history, use current date
    console.warn(
      `⚠️  No git history for ${path.basename(filePath)}, using current date`
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

function updateLastBuiltDate(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const commitDate = getGitCommitDate(filePath);

    // Check if file already has a "Last Built" line
    const lastBuiltRegex = /> \*\*🔄 Last Built\*\*: .*$/m;
    const hasLastBuilt = lastBuiltRegex.test(content);

    if (hasLastBuilt) {
      // Replace existing "Last Built" line
      const updatedContent = content.replace(
        lastBuiltRegex,
        `> **🔄 Last Built**: ${commitDate}`
      );
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated: ${path.basename(filePath)} (${commitDate})`);
    } else {
      // Add "Last Built" line after the frontmatter
      const frontmatterEnd = content.indexOf('---', content.indexOf('---') + 3);
      if (frontmatterEnd !== -1) {
        const beforeFrontmatter = content.substring(0, frontmatterEnd + 3);
        const afterFrontmatter = content.substring(frontmatterEnd + 3);

        // Find the first heading to insert after
        const headingMatch = afterFrontmatter.match(/^#\s+(.+)$/m);
        if (headingMatch) {
          const headingIndex = afterFrontmatter.indexOf(headingMatch[0]);
          const beforeHeading = afterFrontmatter.substring(0, headingIndex);
          const afterHeading = afterFrontmatter.substring(
            headingIndex + headingMatch[0].length
          );

          // Find the end of the first paragraph to insert the Last Built line
          const firstParagraphEnd = afterHeading.indexOf('\n\n');
          const firstParagraph =
            firstParagraphEnd !== -1
              ? afterHeading.substring(0, firstParagraphEnd)
              : afterHeading;
          const remainingContent =
            firstParagraphEnd !== -1
              ? afterHeading.substring(firstParagraphEnd)
              : '';

          const updatedContent =
            beforeFrontmatter +
            beforeHeading +
            headingMatch[0] +
            '\n\n' +
            firstParagraph +
            '\n\n' +
            `> **🔄 Last Built**: ${commitDate}` +
            remainingContent;

          fs.writeFileSync(filePath, updatedContent, 'utf8');
          console.log(`✅ Added: ${path.basename(filePath)} (${commitDate})`);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

function processAllMdxFiles() {
  console.log('🔄 Updating "Last Built" dates using Git commit history...\n');

  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`❌ Documentation directory not found: ${DOCS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DOCS_DIR);
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));

  if (mdxFiles.length === 0) {
    console.log('ℹ️  No MDX files found in documentation directory');
    return;
  }

  console.log(`📁 Found ${mdxFiles.length} MDX files to process:\n`);

  mdxFiles.forEach(file => {
    const filePath = path.join(DOCS_DIR, file);
    updateLastBuiltDate(filePath);
  });

  console.log(
    `\n🎉 Completed! Updated ${mdxFiles.length} documentation files with Git commit dates.`
  );
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  processAllMdxFiles();
}

export { updateLastBuiltDate, getGitCommitDate };
