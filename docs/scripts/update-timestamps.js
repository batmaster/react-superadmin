#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to update build timestamps in MDX files
function updateBuildTimestamps() {
  const docsDir = path.join(__dirname, '..', 'docs');
  const currentTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  console.log(`🔄 Updating build timestamps to: ${currentTime}`);

  // Files to update with timestamps
  const filesToUpdate = [
    'index.md',
    'components/button.mdx',
    'components/footer.mdx'
  ];

  filesToUpdate.forEach(file => {
    const filePath = path.join(docsDir, file);
    
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Find the end of frontmatter (after the second ---)
      const firstDash = content.indexOf('---');
      const secondDash = content.indexOf('---', firstDash + 3);
      
      if (secondDash !== -1) {
        // Remove any existing timestamps
        const timestampPattern = /> \*\*🔄 Last Built\*\*: .*\n/g;
        content = content.replace(timestampPattern, '');
        
        // Insert timestamp after frontmatter
        const beforeContent = content.substring(0, secondDash + 3);
        const afterContent = content.substring(secondDash + 3);
        
        const newContent = beforeContent + '\n\n> **🔄 Last Built**: ' + currentTime + '\n' + afterContent;
        
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Updated: ${file}`);
      } else {
        console.log(`⚠️  Could not find frontmatter in: ${file}`);
      }
    } else {
      console.log(`⚠️  File not found: ${file}`);
    }
  });

  console.log('\n🎉 Build timestamps updated successfully!');
}

// Run the function
updateBuildTimestamps();
