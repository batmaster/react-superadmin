#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Remove all emojis from the codebase except x and  in tables
 * This script cleans up emojis according to the no-emoji rule
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to scan
const SCAN_DIRS = [
  path.join(__dirname, '..', 'packages'),
  path.join(__dirname, '..', 'docs'),
  path.join(__dirname, '..', 'scripts'),
];

// File extensions to process
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx', '.json'];

// Emoji regex - matches most common emojis
const EMOJI_REGEX =
  /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

function isInTable(content, index) {
  // Check if the emoji is within a table (between | characters)
  const beforeContent = content.substring(0, index);
  const afterContent = content.substring(index);

  // Count pipes before and after
  const pipesBefore = (beforeContent.match(/\|/g) || []).length;
  const pipesAfter = (afterContent.match(/\|/g) || []).length;

  // If we have pipes on both sides, it's likely in a table
  return pipesBefore > 0 && pipesAfter > 0;
}

function removeEmojisFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let hasChanges = false;

    // Find all emoji matches
    const matches = [...content.matchAll(EMOJI_REGEX)];

    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      const emoji = match[0];
      const index = match.index;

      // Skip if it's x or ✓ in a table
      if ((emoji === 'x' || emoji === '') && isInTable(content, index)) {
        continue;
      }

      // Simply remove the emoji without replacement
      updatedContent =
        updatedContent.substring(0, index) +
        updatedContent.substring(index + emoji.length);
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Cleaned: ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and .git
        if (
          item !== 'node_modules' &&
          item !== '.git' &&
          !item.startsWith('.')
        ) {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (FILE_EXTENSIONS.includes(ext)) {
          removeEmojisFromFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
}

function processAllFiles() {
  console.log('Removing emojis from codebase (keeping x and  in tables)...\n');

  SCAN_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`Scanning: ${dir}`);
      scanDirectory(dir);
    } else {
      console.log(`Directory not found: ${dir}`);
    }
  });

  console.log('\nEmoji removal completed!');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  processAllFiles();
}

export { removeEmojisFromFile, scanDirectory };
