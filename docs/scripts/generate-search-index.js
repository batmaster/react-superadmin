#!/usr/bin/env node

/**
 * Script to generate search index for Docusaurus
 * This helps fix search functionality issues
 */

const fs = require('fs');
const path = require('path');

console.log(' Generating search index...');

// Check if build directory exists
const buildDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) {
  console.error(' Build directory not found. Run "pnpm build" first.');
  process.exit(1);
}

// Check if search index exists
const searchIndexPath = path.join(buildDir, 'search-index.json');
if (fs.existsSync(searchIndexPath)) {
  console.log(' Search index found at:', searchIndexPath);
  
  // Read and validate search index
  try {
    const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
    console.log(` Search index contains ${searchIndex.length} documents`);
    
    // Check if index has content
    if (searchIndex.length === 0) {
      console.warn('️  Search index is empty. This may cause search issues.');
    } else {
      console.log(' Search index is properly populated');
    }
  } catch (error) {
    console.error(' Error reading search index:', error.message);
  }
} else {
  console.warn('️  Search index not found. This may cause search issues.');
}

// Check for other search-related files
const searchFiles = [
  'search-index.json',
  'search-index.json.gz',
  'search-index.json.br'
];

console.log('\n Checking search files:');
searchFiles.forEach(file => {
  const filePath = path.join(buildDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(` ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  } else {
    console.log(` ${file} (missing)`);
  }
});

console.log('\n Search index generation complete!');
console.log(' If search still doesn\'t work, consider:');
console.log('   1. Using Algolia DocSearch (recommended for production)');
console.log('   2. Checking browser console for errors');
console.log('   3. Verifying all documentation files are properly indexed');
