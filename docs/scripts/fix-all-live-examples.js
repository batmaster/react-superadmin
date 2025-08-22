#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix ALL live examples comprehensively
function fixAllLiveExamples() {
  const docsDir = path.join(__dirname, '..', 'docs');
  
  console.log('🔧 Fixing ALL live examples comprehensively...');

  // Get all MDX files
  const mdxFiles = fs.readdirSync(docsDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join(docsDir, file));

  mdxFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      console.log(`\n📁 Processing: ${path.basename(filePath)}`);

      // 1. Fix React.React.useState to React.useState
      if (content.includes('React.React.useState')) {
        content = content.replace(/React\.React\.useState/g, 'React.useState');
        modified = true;
        console.log(`  ✅ Fixed React.React.useState`);
      }

      // 2. Fix tsx live to jsx live
      if (content.includes('```tsx live')) {
        content = content.replace(/```tsx live/g, '```jsx live');
        modified = true;
        console.log(`  ✅ Fixed tsx live to jsx live`);
      }

      // 3. Fix useState to React.useState (for components without React import)
      if (content.includes('useState(') && !content.includes('React.useState(')) {
        content = content.replace(/useState\(/g, 'React.useState(');
        modified = true;
        console.log(`  ✅ Fixed useState to React.useState`);
      }

      // 4. Add component rendering to ALL example functions
      const functionMatches = content.match(/function (\w+Example)\(/g);
      if (functionMatches) {
        functionMatches.forEach(match => {
          const functionName = match.match(/function (\w+Example)\(/)[1];
          
          // Find the end of this function
          const functionStart = content.indexOf(match);
          let functionEnd = content.indexOf('}', functionStart);
          
          // Find the actual end of the function (handle nested braces)
          let braceCount = 1;
          for (let i = functionStart + match.length; i < content.length; i++) {
            if (content[i] === '{') braceCount++;
            if (content[i] === '}') braceCount--;
            if (braceCount === 0) {
              functionEnd = i;
              break;
            }
          }
          
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

      // 5. Fix specific component issues
      const componentFixes = [
        // Fix Modal component syntax
        {
          pattern: /<Modal([^>]*)>([\s\S]*?)<\/Modal>/g,
          replacement: (match, props, content) => {
            // Ensure proper closing
            return `<Modal${props}>${content}</Modal>`;
          }
        },
        // Fix DateInput component syntax
        {
          pattern: /<DateInput([^>]*)>([\s\S]*?)<\/DateInput>/g,
          replacement: (match, props, content) => {
            return `<DateInput${props} />`;
          }
        },
        // Fix Input component syntax
        {
          pattern: /<Input([^>]*)>([\s\S]*?)<\/Input>/g,
          replacement: (match, props, content) => {
            return `<Input${props} />`;
          }
        }
      ];

      componentFixes.forEach(fix => {
        if (content.match(fix.pattern)) {
          content = content.replace(fix.pattern, fix.replacement);
          modified = true;
          console.log(`  ✅ Fixed component syntax`);
        }
      });

      // 6. Remove any malformed closing tags
      content = content.replace(/<\/>|\);}/g, '');
      
      // 7. Ensure proper spacing around component tags
      content = content.replace(/(\n+)(<[^>]+Example \/>)(\n+)/g, '\n\n$2\n\n');

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  💾 File updated`);
      } else {
        console.log(`  ⏭️  No changes needed`);
      }
    }
  });

  console.log('\n🎉 ALL live examples fixed successfully!');
}

// Run the function
fixAllLiveExamples();
