# Task Breakdown and Code Quality Rules

## Summary

**Every component implementation follows a strict 3-phase approach:**

1. **Code Implementation** → 2. **Testing** → 3. **Documentation**

**Each phase is a separate GitHub issue that must be completed sequentially.**
**Never mix phases in the same commit or work session.**

## Task Breakdown Strategy

### For Each Component/Feature Implementation:

**PHASE 1: Component Code Implementation** (Priority: High)

- Create/update the component file in appropriate package directory
- Implement TypeScript interfaces and types with strict typing
- Add proper error handling, loading states, and accessibility features
- Follow React best practices (hooks, functional components, proper
  dependencies)
- Export component from package index file
- Ensure component compiles without TypeScript errors

**PHASE 2: Testing** (Priority: High)

- Create comprehensive test file with Jest + React Testing Library
- Test component rendering, user interactions, and edge cases
- Test both success and error scenarios
- Test accessibility features (ARIA labels, keyboard navigation)
- Test responsive behavior and different prop combinations
- Ensure minimum 80% test coverage
- All tests must pass before moving to next phase

**PHASE 3: Documentation** (Priority: Medium)

- Add JSDoc comments for all public APIs and props
- Create/update MDX documentation in docs folder
- Include usage examples with code snippets
- Add props table with types, descriptions, and default values
- Add to appropriate sidebar navigation
- Include screenshots or demos for UI components
- Link to related components and features

### Implementation Order:

1. Core hooks and utilities first
2. Basic UI components
3. CRUD components
4. Advanced features (RBAC, custom routes, etc.)

## Code Quality Standards

### TypeScript:

- Strict mode enabled
- Proper interface definitions for all props and data
- No `any` types without justification
- Generic types for reusable components

### React:

- Functional components with hooks
- Proper dependency arrays in useEffect/useCallback
- Memoization where appropriate
- Error boundaries for critical components

### Testing:

- Unit tests for all components
- Integration tests for complex workflows
- Mock external dependencies properly
- Test accessibility features

### Documentation:

- Clear component descriptions
- Props table with types and descriptions
- Usage examples with code snippets
- Link to related components/features

## Commit Strategy

### Commit Message Format:

```
feat(scope): brief description

- Detailed change 1
- Detailed change 2
- Related issue: #123
```

### Commit Scope Examples:

- `feat(core): add CRUD hooks`
- `feat(web): implement Button component`
- `test(core): add tests for useGetList hook`
- `docs(web): add Button component documentation`

### When to Commit:

- **Phase 1 (Code)**: Commit after component implementation is complete and
  compiles
- **Phase 2 (Testing)**: Commit after all tests pass and coverage requirements
  met
- **Phase 3 (Documentation)**: Commit after documentation is complete and linked
- **Never commit incomplete features or mixed phases**
- **Each phase gets its own commit with appropriate scope**

## Quality Checklist

### Before Committing:

- [ ] Code compiles without TypeScript errors
- [ ] All tests pass
- [ ] Component renders correctly
- [ ] Props interface is complete
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Accessibility features are included

### Before Marking Task Complete:

- [ ] Component code is implemented
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Component is exported from package index
- [ ] No console errors or warnings
- [ ] Responsive design considerations
- [ ] Cross-browser compatibility checked

## GitHub Project Management

### Task Status Updates:

- **IMPORTANT**: Only work on tasks that are marked as "Todo" status
- Wait for user to assign tasks to "Todo" before starting implementation
- Move tasks to "In Progress" when starting implementation
- Move to "Done" only after all three phases are complete:
  1. Code implementation
  2. Testing
  3. Documentation

### Task Selection Rules:

- **NEVER** start implementing tasks that are not in "Todo" status
- **ALWAYS** wait for user to move tasks to "Todo" before beginning work
- If no tasks are in "Todo" status, inform user and wait for assignment
- Only proceed with implementation after explicit user approval

### Task Separation and Workflow:

- **Each component task should be broken down into 3 separate GitHub issues:**
  1. `[Component Name] - Code Implementation` (Status: Todo)
  2. `[Component Name] - Testing` (Status: Todo)
  3. `[Component Name] - Documentation` (Status: Todo)

- **Workflow for each component:**
  1. Start with Code Implementation issue (move to "In Progress")
  2. Complete code implementation and commit
  3. Move Code Implementation to "Done"
  4. Start Testing issue (move to "In Progress")
  5. Complete testing and commit
  6. Move Testing to "Done"
  7. Start Documentation issue (move to "In Progress")
  8. Complete documentation and commit
  9. Move Documentation to "Done"
  10. Mark main component task as "Done" only after all 3 phases complete

- **Never mix phases in the same commit or work session**
- **Each phase must be completed and committed separately**
- **Testing cannot begin until code implementation is complete**
- **Documentation cannot begin until testing is complete**

### Issue Tracking:

- Link commits to GitHub issues
- Update issue descriptions with implementation details
- Add screenshots or demos for UI components
- Tag issues with appropriate labels (core, web, bug, enhancement)

## Performance Considerations

### Bundle Size:

- Tree-shakeable exports
- Lazy loading for heavy components
- Minimal external dependencies

### Runtime Performance:

- Memoization for expensive calculations
- Debounced user inputs
- Virtual scrolling for large lists
- Optimistic updates where appropriate

## Security Guidelines

### Data Validation:

- Validate all user inputs
- Sanitize data before rendering
- Implement proper CSRF protection
- Secure API endpoints

### Authentication:

- Secure token storage
- Proper session management
- Role-based access control
- Audit logging for sensitive operations

## Project Infrastructure Tasks

### NPM Setup for First POC Components Release

**PHASE 1: NPM Configuration Setup** (Priority: High)

- Configure npm registry settings for package publishing
- Set up npm authentication and access tokens
- Configure package.json for npm publishing (name, version, description,
  keywords)
- Set up proper package scoping if needed
- Configure .npmignore files to exclude unnecessary files
- Ensure build outputs are properly configured for npm distribution

**PHASE 2: Build and Package Configuration** (Priority: High)

- Configure build scripts for npm package generation
- Set up TypeScript compilation for npm distribution
- Configure entry points (main, module, types) in package.json
- Set up proper exports field for ESM/CommonJS compatibility
- Configure peer dependencies and external dependencies
- Ensure all necessary files are included in the npm package

**PHASE 3: Publishing Workflow** (Priority: Medium)

- Set up automated versioning (semantic versioning)
- Configure CI/CD pipeline for npm publishing
- Set up pre-publish hooks and validation
- Configure npm scripts for publishing workflow
- Set up proper tagging and release notes
- Test publishing to npm registry (can use npm pack for local testing)

### Implementation Order for NPM Setup:

1. Core package npm configuration
2. Web package npm configuration (if applicable)
3. Build and packaging setup
4. Publishing workflow configuration
5. Testing and validation

### NPM Configuration Checklist:

- [ ] package.json properly configured for npm publishing
- [ ] Build scripts generate npm-ready packages
- [ ] TypeScript declarations are included
- [ ] Dependencies are properly configured (peer, dev, prod)
- [ ] .npmignore excludes unnecessary files
- [ ] README.md is included and up-to-date
- [ ] License file is properly configured
- [ ] Entry points are correctly specified
- [ ] Exports field supports both ESM and CommonJS
- [ ] Version management is automated
- [ ] Publishing workflow is tested
- [ ] CI/CD pipeline is configured for npm publishing
