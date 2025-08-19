# Formatting Setup Checklist

Use this checklist to verify your code formatting setup is working correctly.

## ✅ Pre-Installation Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed globally (`npm install -g pnpm`)
- [ ] VS Code with Prettier extension installed
- [ ] VS Code with ESLint extension installed

## ✅ Project Setup Checklist

- [ ] Dependencies installed (`pnpm install`)
- [ ] Husky hooks installed (`pnpm prepare`)
- [ ] `.prettierrc` file exists in project root
- [ ] `.prettierignore` file exists in project root
- [ ] `.lintstagedrc.js` file exists in project root
- [ ] `.husky/pre-commit` file exists and is executable

## ✅ VS Code Configuration Checklist

- [ ] Prettier extension installed
- [ ] ESLint extension installed
- [ ] Prettier set as default formatter
- [ ] Format on save enabled
- [ ] `.vscode/settings.json` exists in project

## ✅ Functionality Test Checklist

### Manual Formatting
- [ ] `pnpm format` command works
- [ ] `pnpm format:check` command works
- [ ] `pnpm format:fix` command works
- [ ] `pnpm format:script` command works

### VS Code Integration
- [ ] Files format automatically on save
- [ ] Prettier is the default formatter
- [ ] ESLint shows errors/warnings
- [ ] Format on paste works

### Pre-commit Hooks
- [ ] `git add .` works
- [ ] `git commit -m "test"` runs formatting hooks
- [ ] Unformatted files get formatted before commit
- [ ] ESLint errors get fixed before commit

## 🧪 Test Scenarios

### Test 1: Basic Formatting
1. Create a new `.ts` file with poorly formatted code
2. Save the file
3. **Expected**: File gets automatically formatted
4. **If not working**: Check VS Code Prettier extension

### Test 2: Pre-commit Hook
1. Make changes to any file
2. Stage changes: `git add .`
3. Commit: `git commit -m "test: formatting"`
4. **Expected**: Pre-commit hooks run and format code
5. **If not working**: Check Husky installation and `.husky/pre-commit`

### Test 3: Manual Formatting
1. Run `pnpm format:check`
2. **Expected**: Shows files that need formatting
3. Run `pnpm format`
4. **Expected**: All files get formatted
5. Run `pnpm format:check` again
6. **Expected**: No formatting issues found

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Prettier not formatting | Install Prettier VS Code extension |
| ESLint errors | Run `pnpm lint` to see issues |
| Pre-commit hooks fail | Run `pnpm prepare` to reinstall Husky |
| VS Code not formatting on save | Check `.vscode/settings.json` |
| Formatting conflicts | Run `pnpm format:fix` |

## 📋 Quick Commands Reference

```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check

# Format and fix ESLint issues
pnpm format:fix

# Run formatting script
pnpm format:script

# Install dependencies
pnpm install

# Reinstall Husky hooks
pnpm prepare

# Check linting
pnpm lint

# Run tests
pnpm test
```

## 🎯 Success Criteria

Your formatting setup is working correctly when:

1. **VS Code formats files on save** automatically
2. **Pre-commit hooks format code** before commits
3. **All formatting commands work** without errors
4. **ESLint integration works** with Prettier
5. **Team members get consistent formatting** across the project

---

**Need help?** Check the [full formatting guide](FORMATTING.md) or open an issue! 🚀 