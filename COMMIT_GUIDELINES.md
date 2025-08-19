# Commit Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

## Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

```
feat: add user authentication system
fix: resolve pagination issue in data table
docs: update API documentation
style: format code according to prettier rules
refactor: simplify authentication logic
perf: optimize database queries
test: add unit tests for user service
build: update dependencies to latest versions
ci: add GitHub Actions workflow
chore: update README
```

## Using Commitizen

Instead of manually writing commit messages, you can use the interactive commit tool:

```bash
pnpm commit
```

This will guide you through creating a properly formatted commit message.

## Pre-commit Hooks

The following checks run automatically before each commit:

1. **Prettier**: Formats your code according to the project's style rules
2. **ESLint**: Checks for code quality issues and fixes auto-fixable problems
3. **Commitlint**: Validates that your commit message follows the conventional format

## Manual Commits

If you prefer to commit manually, ensure your commit message follows the format above. The commit hook will reject commits that don't meet the requirements.

## Troubleshooting

If you encounter issues with the commit hooks:

1. Make sure Husky is properly installed: `pnpm run prepare`
2. Check that the `.husky` directory exists and contains the hook files
3. Ensure you have the required dependencies installed: `pnpm install`
4. Try running the linting manually: `pnpm run lint` and `pnpm run format`
