#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the sidebar file
const sidebarPath = path.join(__dirname, '..', 'sidebars.ts');
const content = fs.readFileSync(sidebarPath, 'utf8');

// Replace all 'docs/components/' with 'components/'
const newContent = content.replace(/docs\/components\//g, 'components/');

// Write back to file
fs.writeFileSync(sidebarPath, newContent, 'utf8');

console.log('Updated sidebar.ts to use correct component paths');
