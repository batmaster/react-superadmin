# Code Formatting Guide

This document explains how code formatting works in the React SuperAdmin project
and how to use it effectively.

## 🎯 Overview

The project uses **Prettier** for automatic code formatting and **ESLint** for
code quality checks. All code is automatically formatted before commits,
ensuring consistency across the entire codebase.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install project dependencies
pnpm install
```

### 2. Install VS Code Extensions

For the best development experience, install these extensions:

- **Prettier - Code formatter** (esbenp.prettier-vscode)
- **ESLint** (dbaeumer.vscode-eslint)

### 3. Format Your Code

```bash
# Format all files
pnpm format

# Check formatting without changing files
pnpm format:check

# Format and fix ESLint issues
pnpm format:fix

# Run the comprehensive formatting script
pnpm format:script
```

### 4. Validate Documentation

```bash
# Validate documentation builds correctly
pnpm docs:validate

# Build documentation
pnpm docs:build

# Check documentation build
pnpm docs:build:check
```

## 🔧 Configuration Files

### Root Configuration

- **`.prettierrc`** - Main Prettier configuration
- **`.prettierignore`** - Files to exclude from formatting
- **`.lintstagedrc.js`** - Pre-commit formatting rules
- **`.husky/pre-commit`** - Git hooks for automatic formatting

### Package-Specific Configuration

- **`packages/core/.prettierrc`** - Core package configuration
- **`packages/web/.prettierrc`** - Web package configuration

### VS Code Settings

- **`.vscode/settings.json`** - Editor configuration for formatting

## 📝 Prettier Rules

The project uses these Prettier settings:

```json
{
  "semi": true, // Always add semicolons
  "trailingComma": "es5", // Add trailing commas where valid in ES5
  "singleQuote": true, // Use single quotes
  "printWidth": 80, // Line length limit
  "tabWidth": 2, // 2 spaces for indentation
  "useTabs": false, // Use spaces, not tabs
  "bracketSpacing": true, // Spaces inside object brackets
  "arrowParens": "avoid", // Omit parens when possible in arrow functions
  "endOfLine": "lf", // Unix line endings
  "jsxSingleQuote": true, // Single quotes in JSX
  "bracketSameLine": false // JSX closing brackets on new line
}
```

## 📁 File Types Covered

| File Type  | Extension                | Formatter         | Parser     |
| ---------- | ------------------------ | ----------------- | ---------- |
| TypeScript | `.ts`, `.tsx`            | Prettier + ESLint | TypeScript |
| JavaScript | `.js`, `.jsx`            | Prettier + ESLint | Babel      |
| JSON       | `.json`, `.jsonc`        | Prettier          | JSON       |
| Markdown   | `.md`                    | Prettier          | Markdown   |
| Styles     | `.css`, `.scss`, `.less` | Prettier          | CSS        |
| HTML       | `.html`                  | Prettier          | HTML       |
| YAML       | `.yml`, `.yaml`          | Prettier          | YAML       |

## 🔄 Automatic Formatting

### Pre-commit Hooks

The project uses Husky to run pre-commit hooks that:

1. **Format code** with Prettier
2. **Fix ESLint issues** automatically
3. **Run tests** to ensure nothing is broken
4. **Build documentation** to catch build errors
5. **Validate commit messages** follow conventional format

### Documentation Validation

The pre-commit hooks now include documentation validation:

- **All branches**: Basic docs structure validation
- **Main branch**: Full docs build check to prevent broken documentation
- **Manual validation**: Use `pnpm docs:validate` to test docs locally

### VS Code Integration

With the Prettier extension installed, VS Code will:

- **Format on Save**: Automatically format files when you save
- **Format on Paste**: Format code when you paste it
- **Set Prettier as Default**: Use Prettier for all supported file types

## 🚫 Ignored Files

The following files and directories are excluded from formatting:

- **Dependencies**: `node_modules/`, `.pnpm-store/`
- **Build outputs**: `dist/`, `build/`, `.next/`, `out/`
- **Generated files**: `*.min.js`, `*.min.css`, `*.bundle.js`
- **Package files**: `pnpm-lock.yaml`, `package-lock.json`
- **Environment files**: `.env*` (except `.env.example`)
- **IDE files**: `.idea/`, `*.swp`, `*.swo`
- **OS files**: `.DS_Store`, `Thumbs.db`
- **Git files**: `.git/`, `.husky/`
- **Firebase**: `.firebase/`, `firebase-debug.log`
- **Coverage**: `coverage/`, `*.lcov`
- **Logs**: `*.log`, `npm-debug.log*`
- **Cache**: `.npm`, `.eslintcache`, `.cache`

## 🛠️ Troubleshooting

### Common Issues

#### 1. Formatting Not Working

**Problem**: Prettier isn't formatting files **Solution**:

- Check if Prettier extension is installed in VS Code
- Verify `.prettierrc` exists in project root
- Run `pnpm format:check` to see what needs formatting

#### 2. ESLint Conflicts

**Problem**: ESLint and Prettier have conflicting rules **Solution**:

- Run `pnpm format:fix` to fix both formatting and linting
- Check if ESLint config extends Prettier config

#### 3. Pre-commit Hook Fails

**Problem**: Git commit fails due to formatting issues **Solution**:

- Run `pnpm format` to fix formatting
- Run `pnpm lint` to fix linting issues
- Try committing again

#### 4. VS Code Not Formatting

**Problem**: Files don't format on save **Solution**:

- Check VS Code settings for `editor.formatOnSave: true`
- Verify Prettier is set as default formatter
- Restart VS Code after installing Prettier extension

#### 5. Documentation Build Fails

**Problem**: Docs build fails during pre-commit **Solution**:

- Run `pnpm docs:validate` to identify issues
- Check for syntax errors in markdown files
- Verify all referenced files exist
- Run `pnpm docs:build` locally to see detailed errors

### Debug Commands

```bash
# Check Prettier configuration
npx prettier --config .prettierrc --print-config

# Check what files would be formatted
npx prettier --check "**/*.{ts,tsx,js,jsx,json,md}"

# See Prettier's output without writing
npx prettier "**/*.{ts,tsx,js,jsx,json,md}" --print-width 80

# Check ESLint configuration
npx eslint --print-config packages/core/src/index.ts

# Validate documentation
pnpm docs:validate

# Check documentation build
pnpm docs:build:check
```

## 📚 Best Practices

### 1. Commit Workflow

```bash
# 1. Make your changes
git add .

# 2. Format code (optional - hooks will do this)
pnpm format

# 3. Commit (hooks will format automatically)
git commit -m "feat: add new feature"
```

### 2. VS Code Setup

1. Install Prettier and ESLint extensions
2. Set Prettier as default formatter
3. Enable format on save
4. The project's `.vscode/settings.json` handles the rest

### 3. Team Collaboration

- **Never commit unformatted code** - hooks will prevent this
- **Use conventional commit messages** - commitlint enforces this
- **Run tests before committing** - CI will catch failures
- **Keep dependencies updated** - use `pnpm update` regularly

## 🔗 Related Documentation

- [Contributing Guide](../CONTRIBUTING.md) - General contribution guidelines
- [Commit Guidelines](../COMMIT_GUIDELINES.md) - Commit message format
- [Testing Guide](./testing.md) - Testing setup and guidelines
- [Architecture Guide](./developer/architecture.md) - Project structure

## 🆘 Getting Help

If you encounter formatting issues:

1. **Check this guide** for common solutions
2. **Run troubleshooting commands** above
3. **Check the logs** for specific error messages
4. **Open an issue** with detailed error information

---

**Remember**: The goal is to have consistent, readable code across the entire
project. Prettier handles the formatting automatically, so you can focus on
writing great code! 🚀
