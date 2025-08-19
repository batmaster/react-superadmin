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
