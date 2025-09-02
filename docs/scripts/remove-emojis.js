// @ts-nocheck
const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, '..', 'docs', 'features', 'react-admin-comparison.md');
let content = fs.readFileSync(filePath, 'utf8');

// Remove all emojis using regex
// This regex matches most common emoji patterns
content = content.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');

// Also remove specific emoji patterns we know are in the file
content = content.replace(/📊\s*/g, '');
content = content.replace(/🏗️\s*/g, '');
content = content.replace(/📡\s*/g, '');
content = content.replace(/🔐\s*/g, '');
content = content.replace(/📋\s*/g, '');
content = content.replace(/✏️\s*/g, '');
content = content.replace(/👁️\s*/g, '');
content = content.replace(/🏷️\s*/g, '');
content = content.replace(/⌨️\s*/g, '');
content = content.replace(/🎨\s*/g, '');
content = content.replace(/⚙️\s*/g, '');
content = content.replace(/🌐\s*/g, '');
content = content.replace(/⚡\s*/g, '');
content = content.replace(/✅\s*/g, '');
content = content.replace(/❌\s*/g, '');
content = content.replace(/📈\s*/g, '');
content = content.replace(/🎯\s*/g, '');
content = content.replace(/🚀\s*/g, '');
content = content.replace(/🟢\s*/g, '');
content = content.replace(/🟡\s*/g, '');
content = content.replace(/🔴\s*/g, '');

// Clean up any double spaces that might result
content = content.replace(/\s+/g, ' ');

// Write back to file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Removed all emojis from react-admin-comparison.md');
