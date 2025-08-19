---
id: contributing
title: Contributing
sidebar_label: Contributing
keywords: [contributing, development, rules, guidelines, fork, branch, pr, commitlint]
---

# Contributing to React SuperAdmin

Thank you for your interest in contributing to React SuperAdmin! This guide will help you understand our project's purpose, concept, and how to contribute effectively.

## 🎯 Purpose & Vision

React SuperAdmin was created to solve a fundamental problem in modern web development: **building powerful admin interfaces shouldn't be complicated**.

### Our Mission

- **Simplify Admin Development**: Reduce the time and complexity of building CRUD admin interfaces
- **Developer Experience First**: Provide an intuitive, TypeScript-first development experience
- **Performance by Default**: Build fast, scalable admin applications out of the box
- **Open Source Excellence**: Create a community-driven framework that rivals commercial solutions

### What We're Building

React SuperAdmin is a modern, component-based framework that provides:
- **Pre-built Components**: Ready-to-use UI components for common admin tasks
- **Smart Hooks**: Custom React hooks that handle complex state management
- **Type Safety**: Full TypeScript support with excellent IntelliSense
- **Flexible Architecture**: Modular design that adapts to your needs
- **Performance Optimized**: Built with React best practices and modern patterns

## 💡 Core Concept

### The "SuperAdmin" Philosophy

We believe admin interfaces should be:
1. **Super Fast** - Lightning-quick performance and responsiveness
2. **Super Flexible** - Adaptable to any business logic or design system
3. **Super Developer-Friendly** - Intuitive APIs and excellent developer experience
4. **Super Maintainable** - Clean, well-tested code that's easy to extend

### Architecture Principles

- **Component Composition**: Build complex interfaces from simple, composable components
- **Hook-Based Logic**: Separate business logic from UI using custom React hooks
- **Type Safety**: Leverage TypeScript for better development experience and fewer bugs
- **Performance First**: Optimize for speed and efficiency from the ground up
- **Accessibility**: Ensure admin interfaces work for all users

## 🚫 Pain Points We're Solving

### Problems with Existing Solutions

#### 1. **React Admin**
- **Complex Setup**: Requires extensive configuration and understanding of data providers
- **Learning Curve**: Steep learning curve for new developers
- **Performance Issues**: Can be slow with large datasets
- **Limited Customization**: Difficult to customize beyond the provided patterns
- **Bundle Size**: Large bundle size that impacts performance

#### 2. **Ant Design Pro**
- **Design System Lock-in**: Tightly coupled to Ant Design's visual language
- **Internationalization Complexity**: Complex i18n setup and maintenance
- **Theme Customization**: Difficult to create custom themes
- **Mobile Experience**: Not optimized for mobile admin interfaces
- **Bundle Bloat**: Includes many unused components

#### 3. **Material-UI Admin Templates**
- **Google Material Design**: Limited to Material Design principles
- **Component Overhead**: Heavy components with many unused features
- **Customization Challenges**: Difficult to deviate from Material Design patterns
- **Performance**: Can be slow due to complex component hierarchies
- **Accessibility**: Not always following accessibility best practices

#### 4. **Custom Solutions**
- **Development Time**: Months of development for basic admin functionality
- **Maintenance Burden**: Ongoing maintenance and bug fixes
- **Inconsistent UX**: Different patterns across different admin sections
- **Security Risks**: Potential security vulnerabilities in custom implementations
- **Scalability Issues**: Difficult to scale as requirements grow

### How React SuperAdmin Addresses These Issues

- **Simple Setup**: Get started in minutes with minimal configuration
- **Gentle Learning Curve**: Intuitive APIs that feel natural to React developers
- **Performance Optimized**: Built with performance in mind from day one
- **Highly Customizable**: Easy to customize and extend without fighting the framework
- **Lightweight**: Only include what you need, when you need it
- **Mobile First**: Responsive design that works on all devices
- **Accessibility Built-in**: Follows accessibility best practices by default

## 🛠️ Development Setup

### Prerequisites

- **Node.js** (version 18 or higher)
- **pnpm** (recommended) or npm
- **Git** for version control
- **TypeScript** knowledge (basic understanding)

### Getting Started

1. **Fork the Repository**
   ```bash
   # Go to https://gitlab.com/batmaster/react-superadmin
   # Click "Fork" button
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://gitlab.com/batmaster/react-superadmin.git
   cd react-superadmin
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/original-owner/react-superadmin.git
   ```

4. **Install Dependencies**
   ```bash
   pnpm install
   ```

5. **Start Development**
   ```bash
   # Start the web application
   pnpm dev
   
   # Start the documentation
   pnpm docs
   ```

## 🌿 Branch Naming Convention

### Branch Types

We use a structured naming convention for branches:

```
<type>/<scope>/<description>
```

### Type Prefixes

- **`feat/`** - New features
- **`fix/`** - Bug fixes
- **`docs/`** - Documentation changes
- **`style/`** - Code style changes (formatting, etc.)
- **`refactor/`** - Code refactoring
- **`test/`** - Adding or updating tests
- **`chore/`** - Build process, tooling, or dependency updates
- **`perf/`** - Performance improvements
- **`ci/`** - CI/CD changes

### Scope Examples

- **`feat/core/`** - New features in the core package
- **`fix/web/`** - Bug fixes in the web package
- **`docs/`** - Documentation updates
- **`test/core/`** - Test updates for core package

### Description Format

- Use kebab-case
- Be descriptive but concise
- Include issue number if applicable

### Examples

```bash
# Feature branches
git checkout -b feat/core/add-user-management-hooks
git checkout -b feat/web/implement-data-table-component
git checkout -b feat/docs/add-contributing-guide

# Bug fix branches
git checkout -b fix/core/resolve-memory-leak-in-useResource
git checkout -b fix/web/fix-button-styling-issues

# Documentation branches
git checkout -b docs/update-api-reference
git checkout -b docs/add-examples-section

# Test branches
git checkout -b test/core/add-hook-testing-utilities
git checkout -b test/web/component-integration-tests

# Refactor branches
git checkout -b refactor/core/simplify-hook-implementation
git checkout -b refactor/web/optimize-component-rendering
```

## 📝 Commit Message Standards

### Commitlint Configuration

We use [commitlint](https://commitlint.js.org/) to enforce consistent commit messages. The configuration follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Type Values

- **`feat`** - A new feature
- **`fix`** - A bug fix
- **`docs`** - Documentation only changes
- **`style`** - Changes that do not affect the meaning of the code
- **`refactor`** - A code change that neither fixes a bug nor adds a feature
- **`perf`** - A code change that improves performance
- **`test`** - Adding missing tests or correcting existing tests
- **`chore`** - Changes to the build process or auxiliary tools

### Scope Values

- **`core`** - Changes to the core package
- **`web`** - Changes to the web package
- **`docs`** - Changes to documentation
- **`deps`** - Dependency updates
- **`ci`** - CI/CD changes
- **`release`** - Release-related changes

### Examples

```bash
# Feature commits
git commit -m "feat(core): add useResource hook for CRUD operations"
git commit -m "feat(web): implementDataTable component with sorting and pagination"

# Bug fix commits
git commit -m "fix(core): resolve memory leak in useResource hook"
git commit -m "fix(web): fix button styling issues in dark theme"

# Documentation commits
git commit -m "docs: update API reference with new components"
git commit -m "docs: add comprehensive contributing guide"

# Test commits
git commit -m "test(core): add comprehensive tests for useResource hook"
git commit -m "test(web): add integration tests for DataTable component"

# Refactor commits
git commit -m "refactor(core): simplify hook implementation for better performance"
git commit -m "refactor(web): optimize component rendering with React.memo"

# Performance commits
git commit -m "perf(core): optimize useResource hook with better memoization"
git commit -m "perf(web): reduce bundle size by tree-shaking unused components"

# Chore commits
git commit -m "chore(deps): update all dependencies to latest versions"
git commit -m "chore(ci): add automated testing workflow"
```

### Breaking Changes

For breaking changes, add `!` after the type/scope and include a `BREAKING CHANGE:` footer:

```bash
git commit -m "feat(core)!: change useResource API to use new data structure

BREAKING CHANGE: useResource now returns data in a different format.
Update your components to use the new structure."
```

## 🔄 Pull Request Process

### Creating a Pull Request

1. **Ensure Your Branch is Up to Date**
   ```bash
   git fetch upstream
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Push Your Changes**
   ```bash
   git push origin your-feature-branch
   ```

3. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your feature branch as the source
   - Select the main branch as the target
   - Fill out the PR template

### Pull Request Template

```markdown
## Description
Brief description of what this PR accomplishes.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have tested this change locally
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] All tests pass

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### PR Review Process

1. **Automated Checks**
   - All tests must pass
   - Code must pass linting
   - Commit messages must follow commitlint rules
   - Bundle size must not increase significantly

2. **Code Review**
   - At least one maintainer must approve
   - Address all review comments
   - Ensure code follows project patterns

3. **Merging**
   - Squash commits when merging
   - Use conventional commit message format
   - Delete feature branch after merge

## 🧪 Testing Guidelines

### Test Coverage Requirements

- **Core Package**: Minimum 90% test coverage
- **Web Package**: Minimum 85% test coverage
- **Documentation**: All examples must be tested

### Testing Patterns

```typescript
// Component testing
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// Hook testing
import { renderHook, act } from '@testing-library/react';
import { useCustomHook } from '../useCustomHook';

describe('useCustomHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.value).toBe(0);
  });
});
```

## 📚 Documentation Standards

### Code Documentation

- **JSDoc Comments**: Use JSDoc for all public APIs
- **TypeScript Types**: Comprehensive type definitions
- **Examples**: Include usage examples in documentation

### Example JSDoc

```typescript
/**
 * Custom hook for managing resource data with CRUD operations.
 * 
 * @param resourceName - The name of the resource to manage
 * @param options - Configuration options for the hook
 * @returns Object containing resource data and CRUD operations
 * 
 * @example
 * ```tsx
 * const { data, loading, create, update, remove } = useResource('users');
 * 
 * // Create a new user
 * await create({ name: 'John Doe', email: 'john@example.com' });
 * 
 * // Update existing user
 * await update('123', { name: 'Jane Doe' });
 * 
 * // Delete user
 * await remove('123');
 * ```
 */
export const useResource = (resourceName: string, options?: UseResourceOptions) => {
  // Implementation...
};
```

## 🎨 Code Style Guidelines

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use union types for discriminated unions
- Avoid `any` type - use `unknown` when necessary

### React

- Use functional components with hooks
- Prefer composition over inheritance
- Use React.memo for performance optimization
- Follow React best practices and patterns

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow BEM methodology for custom CSS
- Use CSS custom properties for theming
- Ensure responsive design

## 🚀 Release Process

### Version Management

We use [semantic versioning](https://semver.org/):
- **Major** (x.0.0): Breaking changes
- **Minor** (0.x.0): New features, backward compatible
- **Patch** (0.0.x): Bug fixes, backward compatible

### Release Steps

1. **Create Release Branch**
   ```bash
   git checkout -b release/v1.0.0
   ```

2. **Update Version**
   ```bash
   pnpm version patch|minor|major
   ```

3. **Update Changelog**
   - Document all changes since last release
   - Include breaking changes prominently
   - List new features and bug fixes

4. **Create Release PR**
   - Merge to main branch
   - Create GitHub release
   - Publish to npm

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Help newcomers learn and contribute
- Provide constructive feedback
- Follow the project's coding standards

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Discord**: For real-time chat and support
- **Documentation**: Comprehensive guides and examples

### Recognition

- Contributors are listed in the project README
- Significant contributions are highlighted in release notes
- Community members can become maintainers

## 📋 Quick Reference

### Common Commands

```bash
# Development
pnpm dev          # Start web app
pnpm docs         # Start documentation
pnpm test         # Run all tests
pnpm lint         # Run linter
pnpm build        # Build all packages

# Git workflow
git checkout -b feat/core/new-feature
git add .
git commit -m "feat(core): add new feature"
git push origin feat/core/new-feature
# Create PR on GitHub
```

### Branch Naming Examples

```bash
feat/core/add-user-authentication
fix/web/resolve-table-sorting-issue
docs/update-getting-started-guide
test/core/add-hook-testing-utilities
refactor/web/optimize-component-performance
```

### Commit Message Examples

```bash
feat(core): add useAuth hook for authentication
fix(web): resolve button styling in dark theme
docs: add comprehensive contributing guide
test(core): add tests for useResource hook
refactor(web): optimize DataTable rendering
```

## 🎯 Next Steps

1. **Read the Documentation**: Understand the framework architecture
2. **Explore Examples**: See the framework in action
3. **Join the Community**: Participate in discussions and ask questions
4. **Start Small**: Begin with documentation or simple bug fixes
5. **Build Something**: Create a small admin interface using the framework

Thank you for contributing to React SuperAdmin! Your contributions help make admin development better for everyone. 🚀
