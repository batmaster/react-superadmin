# Cursor Rules: GitHub Project Management

## Task Status Management

When working on GitHub Project tasks, you MUST follow this workflow:

### 1. Task Selection Phase

- **Before starting work**: Check GitHub Projects for available tasks
- **Use command**: `gh project item-list 2 --owner batmaster --format json`
- **Look for**: Tasks with status "Todo" or "Not Started"
- **Priority order**: CRITICAL > HIGH > MEDIUM > LOW

### 2. Task Status Updates

- **When starting work**: Update task status to "In Progress"
- **Command**:
  `gh project item-edit --id [TASK_ID] --field Status --value "In Progress"`
- **When completing work**: Update task status to "Done"
- **Command**:
  `gh project item-edit --id [TASK_ID] --field Status --value "Done"`

### 3. Required Status Transitions

```
Todo/Not Started → In Progress → Done
```

**NEVER skip the "In Progress" status** - this tracks active work and prevents
duplicate work.

### 4. Task Completion Checklist

For each completed task, ensure:

- [ ] Component implemented and tested
- [ ] Documentation created with live examples
- [ ] Sidebar navigation updated
- [ ] ReactLiveScope updated (if needed)
- [ ] All tests passing
- [ ] Documentation builds successfully
- [ ] Task status updated to "Done" in GitHub Projects
- [ ] Branch pushed and PR created

### 4.5. Duplicate Task Management

- **Check for duplicates**: Before starting work, search for existing tasks with
  similar names
- **Tag related tasks**: When multiple tasks exist for the same component (code,
  testing, docs), tag them together
- **Update all related tasks**: When completing one aspect, update the status of
  related tasks
- **Example pattern**:
  - "Component X - Code Implementation" (Implementation)
  - "Component X - Testing" (Testing)
  - "Component X - Documentation" (Documentation)
- **Consolidate if needed**: If duplicate tasks exist, consider consolidating
  them or clearly marking their relationship

### 5. GitHub Project Commands Reference

```bash
# List all project items
gh project item-list 2 --owner batmaster --format json

# Update task status to In Progress
gh project item-edit --id [TASK_ID] --field Status --value "In Progress"

# Update task status to Done
gh project item-edit --id [TASK_ID] --field Status --value "Done"

# Create PR
gh pr create --title "feat: [component] implementation" --body "Implements [component] with tests and docs"

# Merge PR
gh pr merge [PR_NUMBER] --merge
```

### 6. Task Categories and Priorities

#### UI Components (Priority: HIGH)

- Button, Card, Modal, Alert, Badge, Dropdown ✅
- SelectInput, DateInput, BooleanInput, ArrayInput
- Label, Tooltip, AutocompleteInput

#### Form Components (Priority: CRITICAL)

- Input, SelectInput, DateInput, BooleanInput
- ArrayInput, AutocompleteInput, FileInput

#### Field Display Components (Priority: CRITICAL)

- TextField, ReferenceField, NumberField
- DateField, BooleanField, ImageField

#### Layout Components (Priority: MEDIUM)

- ContainerLayout, Menu, Sidebar
- Grid, Header, Footer

### 7. Development Workflow

1. **Select Task**: Pick next priority task from GitHub Projects
2. **Update Status**: Mark as "In Progress"
3. **Create Branch**: `git checkout -b feature/[component-name]-[type]`
4. **Implement**: Component, tests, documentation
5. **Test**: Ensure all tests pass and docs build
6. **Commit**: Use conventional commit format
7. **Push**: Push branch to remote
8. **Create PR**: Use GitHub CLI to create pull request
9. **Update Status**: Mark task as "Done"
10. **Merge**: Merge PR to main branch

### 7.5. Commit Message Rules (CRITICAL)

**ALWAYS use lowercase in commit messages** to avoid commitlint failures:

✅ **CORRECT** (lowercase):

```bash
git commit -m "feat(web): implement label component"
git commit -m "feat(core): add text field component"
git commit -m "docs: update component documentation"
```

❌ **WRONG** (capitalized):

```bash
git commit -m "feat(web): Implement Label Component"  # Will fail commitlint
git commit -m "feat(core): Add Text Field Component"  # Will fail commitlint
```

**Remember**: The subject line MUST be lowercase according to conventional
commits standard. This prevents wasting time on failed commits.

### 8. Error Handling

If you encounter issues:

- **Don't wait for user input** - solve problems autonomously
- **Check existing patterns** - look at completed components
- **Use established solutions** - don't reinvent working approaches
- **Maintain momentum** - keep working on tasks continuously

### 9. Quality Standards

- **Test Coverage**: Minimum 85% for all components
- **Documentation**: Live examples with all major use cases
- **Accessibility**: ARIA compliance and keyboard navigation
- **TypeScript**: Strict typing with proper interfaces
- **Styling**: Tailwind CSS with consistent design system

### 10. Continuous Progress

- **Work autonomously** - no blocking questions
- **Complete tasks end-to-end** - implementation through merge
- **Follow established patterns** - maintain consistency
- **Update status immediately** - keep project board current

---

**Remember**: You are a 24-hour developer. Keep working continuously, update
task statuses properly, and maintain development momentum without waiting for
user input.
