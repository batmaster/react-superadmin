#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix live examples in MDX files
function fixLiveExamples() {
  const docsDir = path.join(__dirname, '..', 'docs');
  
  console.log('🔧 Fixing live examples in all component files...');

  // Get all MDX files
  const mdxFiles = fs.readdirSync(docsDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join(docsDir, file));

  mdxFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // Fix React.React.useState to React.useState
      if (content.includes('React.React.useState')) {
        content = content.replace(/React\.React\.useState/g, 'React.useState');
        modified = true;
        console.log(`✅ Fixed React.React.useState in: ${path.basename(filePath)}`);
      }

      // Fix tsx live to jsx live
      if (content.includes('```tsx live')) {
        content = content.replace(/```tsx live/g, '```jsx live');
        modified = true;
        console.log(`✅ Fixed tsx live to jsx live in: ${path.basename(filePath)}`);
      }

      // Add component rendering to examples
      const functionMatches = content.match(/function (\w+Example)\(/g);
      if (functionMatches) {
        functionMatches.forEach(match => {
          const functionName = match.match(/function (\w+Example)\(/)[1];
          
          // Find the end of this function
          const functionStart = content.indexOf(match);
          const functionEnd = content.indexOf('}', functionStart);
          
          if (functionEnd !== -1) {
            // Check if component is already rendered
            const afterFunction = content.substring(functionEnd + 1);
            const componentTag = `<${functionName} />`;
            
            if (!afterFunction.includes(componentTag)) {
              // Add component rendering after the function
              const beforeEnd = content.substring(0, functionEnd + 1);
              const afterEnd = content.substring(functionEnd + 1);
              content = beforeEnd + '\n\n' + componentTag + '\n' + afterEnd;
              modified = true;
              console.log(`✅ Added component rendering for ${functionName} in: ${path.basename(filePath)}`);
            }
          }
        });
      }

      // Remove duplicate component tags
      const componentTags = content.match(/<(\w+Example) \/>/g);
      if (componentTags) {
        const uniqueTags = [...new Set(componentTags)];
        uniqueTags.forEach(tag => {
          const regex = new RegExp(tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          const matches = content.match(regex);
          if (matches && matches.length > 1) {
            // Keep only the first occurrence
            const firstIndex = content.indexOf(tag);
            const beforeFirst = content.substring(0, firstIndex);
            const afterFirst = content.substring(firstIndex + tag.length);
            content = beforeFirst + tag + afterFirst.replace(regex, '');
            modified = true;
            console.log(`✅ Removed duplicate ${tag} in: ${path.basename(filePath)}`);
          }
        });
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
      }
    }
  });

  console.log('\n🎉 Live examples fixed successfully!');
}

// Run the function
fixLiveExamples();
