#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix specific reported issues
function fixSpecificIssues() {
  const docsDir = path.join(__dirname, '..', 'docs');
  
  console.log('🔧 Fixing specific reported issues...');

  // Get all MDX files
  const mdxFiles = fs.readdirSync(docsDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join(docsDir, file));

  mdxFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      console.log(`\n📁 Processing: ${path.basename(filePath)}`);

      // 1. Fix tsx live to jsx live
      if (content.includes('```tsx live')) {
        content = content.replace(/```tsx live/g, '```jsx live');
        modified = true;
        console.log(`  ✅ Fixed tsx live to jsx live`);
      }

      // 2. Fix useState to React.useState
      if (content.includes('useState(') && !content.includes('React.useState(')) {
        content = content.replace(/useState\(/g, 'React.useState(');
        modified = true;
        console.log(`  ✅ Fixed useState to React.useState`);
      }

      // 3. Add component rendering to example functions
      const functionMatches = content.match(/function (\w+Example)\(/g);
      if (functionMatches) {
        functionMatches.forEach(match => {
          const functionName = match.match(/function (\w+Example)\(/)[1];
          
          // Find the end of this function (after the closing brace)
          const functionStart = content.indexOf(match);
          let functionEnd = content.indexOf('}', functionStart);
          
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
              console.log(`  ✅ Added component rendering for ${functionName}`);
            }
          }
        });
      }

      // 4. Fix specific component syntax issues
      // Remove any malformed closing tags
      content = content.replace(/<\/>|\);}/g, '');
      
      // Fix Modal component syntax
      content = content.replace(/<Modal([^>]*)>([\s\S]*?)<\/Modal>/g, (match, props, content) => {
        return `<Modal${props}>${content}</Modal>`;
      });

      // Fix DateInput component syntax (self-closing)
      content = content.replace(/<DateInput([^>]*)>([\s\S]*?)<\/DateInput>/g, (match, props) => {
        return `<DateInput${props} />`;
      });

      // Fix Input component syntax (self-closing)
      content = content.replace(/<Input([^>]*)>([\s\S]*?)<\/Input>/g, (match, props) => {
        return `<Input${props} />`;
      });

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  💾 File updated`);
      } else {
        console.log(`  ⏭️  No changes needed`);
      }
    }
  });

  console.log('\n🎉 Specific issues fixed successfully!');
}

// Run the function
fixSpecificIssues();
