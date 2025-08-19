# Contributing to React SuperAdmin

Thank you for your interest in contributing to React SuperAdmin! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/batmaster/react-superadmin.git`
3. Install dependencies: `pnpm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build packages
pnpm build

# Run tests
pnpm test

# Run linting
pnpm lint

# Type checking
pnpm typecheck
```

## Project Structure

```
react-superadmin/
├── packages/
│   ├── core/           # Core framework and utilities
│   └── web/            # Web components and admin interface
├── examples/            # Usage examples
├── docs/               # Documentation
└── tests/              # Test files
```

## Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Include JSDoc comments for public APIs
- Write tests for new functionality

## Code Formatting

We use **Prettier** for automatic code formatting and **ESLint** for code quality checks. The formatting is automatically applied before each commit.

### Formatting Commands

```bash
# Format all files
pnpm format

# Check formatting without changing files
pnpm format:check

# Format and fix ESLint issues
pnpm format:fix
```

### Automatic Formatting

- **On Save**: VS Code will automatically format files when you save (if you have the Prettier extension)
- **Pre-commit**: All staged files are automatically formatted before commits
- **CI/CD**: Formatting is checked in CI to ensure consistency

### File Types Covered

- **TypeScript/TSX**: `.ts`, `.tsx` files
- **JavaScript/JSX**: `.js`, `.jsx` files  
- **Markdown**: `.md` files
- **Configuration**: `.json`, `.yml`, `.yaml` files
- **Styles**: `.css`, `.scss`, `.less` files
- **HTML**: `.html` files

### Pre-commit Hooks

The project uses Husky to run pre-commit hooks that:
1. **Format code** with Prettier
2. **Fix ESLint issues** automatically
3. **Run tests** to ensure nothing is broken
4. **Validate commit messages** follow conventional format

### VS Code Setup

For the best development experience, install these extensions:
- **Prettier - Code formatter**
- **ESLint**

The project includes VS Code settings that automatically:
- Set Prettier as the default formatter
- Format on save
- Run ESLint fixes on save

## Testing

- Write unit tests for utilities and hooks
- Write integration tests for components
- Ensure all tests pass before submitting PR
- Maintain good test coverage

## Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Add tests for new functionality
3. Update documentation if needed
4. Submit a pull request with a clear description
5. Wait for review and address feedback

## Issues

- Use the issue template when reporting bugs
- Provide clear reproduction steps
- Include relevant system information
- Search existing issues before creating new ones

## Questions?

Feel free to open an issue for questions or discussions about the project.

Thank you for contributing! 🚀
