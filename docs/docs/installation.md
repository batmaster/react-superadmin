---
id: installation
title: Installation & Setup
sidebar_label: Installation
description: Learn how to install and set up React SuperAdmin components in your project
---

# Installation & Setup

React SuperAdmin provides a comprehensive set of React components that require Tailwind CSS for proper styling. Follow this guide to get started quickly.

## 📦 **Installation**

### **1. Install the Package**

```bash
# Using npm
npm install @react-superadmin/web

# Using yarn
yarn add @react-superadmin/web

# Using pnpm (recommended)
pnpm add @react-superadmin/web
```

### **2. Install Tailwind CSS Dependencies**

**Required**: React SuperAdmin components use Tailwind CSS for styling. You must install Tailwind CSS in your project.

```bash
# Using npm
npm install -D tailwindcss postcss autoprefixer

# Using yarn
yarn add -D tailwindcss postcss autoprefixer

# Using pnpm
pnpm add -D tailwindcss postcss autoprefixer
```

### **3. Initialize Tailwind CSS**

```bash
npx tailwindcss init -p
```

This creates:
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration

### **4. Configure Tailwind CSS**

Update your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    // Include React SuperAdmin components
    "./node_modules/@react-superadmin/web/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### **5. Import Tailwind CSS**

Add Tailwind directives to your main CSS file (usually `src/index.css` or `src/App.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom CSS here */
```

## 🚀 **Quick Start**

### **Basic Setup**

```tsx
import React from 'react';
import { Button, Card } from '@react-superadmin/web';

function App() {
  return (
    <div className="p-6">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
        <Button variant="primary">Get Started</Button>
      </Card>
    </div>
  );
}

export default App;
```

### **Available Components**

```tsx
import {
  Button,
  Card,
  Modal,
  Alert,
  Badge,
  Dropdown,
  // Form components
  TextInput,
  SelectInput,
  CheckboxInput,
  DateInput,
  TextareaInput,
} from '@react-superadmin/web';
```

## ⚙️ **Configuration Options**

### **Tailwind CSS Customization**

You can extend Tailwind's default theme in your `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@react-superadmin/web/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}
```

### **PostCSS Configuration**

The `postcss.config.js` file is automatically created and configured:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 🔧 **Framework Integration**

### **Create React App**

```bash
# Install dependencies
npm install @react-superadmin/web
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p

# Update src/index.css
```

### **Vite**

```bash
# Install dependencies
pnpm add @react-superadmin/web
pnpm add -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p

# Update src/index.css
```

### **Next.js**

```bash
# Install dependencies
npm install @react-superadmin/web
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p

# Update tailwind.config.js to include app directory
```

### **Gatsby**

```bash
# Install dependencies
npm install @react-superadmin/web
npm install -D tailwindcss postcss autoprefixer gatsby-plugin-postcss

# Initialize Tailwind
npx tailwindcss init -p

# Configure gatsby-config.js
```

## 🎨 **Styling System**

### **Component Variants**

All components support multiple variants that use Tailwind CSS classes:

```tsx
// Button variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>

// Card variants
<Card variant="default">Default</Card>
<Card variant="outlined">Outlined</Card>
<Card variant="elevated">Elevated</Card>
<Card variant="flat">Flat</Card>
```

### **Responsive Design**

Components automatically use Tailwind's responsive prefixes:

```tsx
// Responsive sizing
<Button size="sm" className="md:size-md lg:size-lg">
  Responsive Button
</Button>

// Responsive spacing
<Card className="p-4 md:p-6 lg:p-8">
  Responsive Card
</Card>
```

## 🚨 **Common Issues**

### **Components Not Styled**

**Problem**: Components render but look unstyled or broken.

**Solution**: Ensure Tailwind CSS is properly imported and configured.

```css
/* Check your CSS file has these imports */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### **Build Errors**

**Problem**: Build fails with Tailwind-related errors.

**Solution**: Verify your `tailwind.config.js` includes the right content paths.

```js
content: [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./node_modules/@react-superadmin/web/**/*.{js,jsx,ts,tsx}",
],
```

### **TypeScript Errors**

**Problem**: TypeScript can't find component types.

**Solution**: Ensure you're importing from the correct path.

```tsx
// ✅ Correct
import { Button } from '@react-superadmin/web';

// ❌ Incorrect
import { Button } from '@react-superadmin/web/components/ui/Button';
```

## 📚 **Next Steps**

1. **Explore Components**: Check out the [Components](/components/button) section
2. **View Examples**: See [Examples](/examples/basic-usage) for usage patterns
3. **Customize**: Learn about [Theming](/developer/theming) and customization
4. **Build**: Start building your admin interface with our components!

## 🆘 **Need Help?**

- **Documentation**: Browse our comprehensive guides
- **GitHub Issues**: Report bugs or request features
- **Discussions**: Join the community for help and ideas

---

**Note**: React SuperAdmin components are designed to work seamlessly with Tailwind CSS. If you prefer a different styling solution, you may need to override the default styles or create custom variants.
