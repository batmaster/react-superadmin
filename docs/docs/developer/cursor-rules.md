---
id: cursor-rules
title: Cursor Rules
sidebar_label: Cursor Rules
description: AI-powered coding guidelines and development patterns for React SuperAdmin
---

# Cursor Rules for React SuperAdmin

## Overview

This document explains the Cursor Rules system used in the React SuperAdmin project and why Cursor editor is recommended for development.

## What are Cursor Rules?

Cursor Rules are AI-powered coding guidelines that help developers understand the project structure, coding patterns, and best practices. They act as intelligent documentation that:

- **Automatically applies** to relevant files based on file patterns
- **Provides context** about the codebase structure and conventions
- **Guides development** with examples and patterns
- **Ensures consistency** across the project

## Why Use Cursor Editor?

### 🚀 **AI-Powered Development**

- **Intelligent code completion** that understands your project context
- **Context-aware suggestions** based on project patterns and rules
- **Automated refactoring** that follows established conventions
- **Smart debugging** with project-specific insights

### 📚 **Project Knowledge Integration**

- **Automatic rule application** based on file types and locations
- **Real-time guidance** while coding
- **Pattern recognition** from existing codebase
- **Consistent architecture** enforcement

### 🎯 **React SuperAdmin Benefits**

- **Framework-specific patterns** automatically applied
- **Component development guidelines** always available
- **Testing best practices** integrated into workflow
- **Monorepo structure** understanding built-in

## Current Rules Structure

### **1. Project Structure Rule** (`.cursor/rules/project-structure.mdc`)

- **Always Applied** - Provides essential context for every request
- **Monorepo structure** with pnpm workspaces
- **Package organization** (core vs web)
- **Development commands** and testing structure

### **2. Testing Patterns Rule** (`.cursor/rules/testing-patterns.mdc`)

- **Applied to test files** - Covers `.test.ts`, `.test.tsx`, `.spec.ts`, `.spec.tsx`
- **Component testing patterns** with React Testing Library
- **Hook testing patterns** with renderHook
- **Testing principles** and best practices

### **3. Component Development Rule** (`.cursor/rules/component-development.mdc`)

- **Applied to React components** - Covers `.tsx` and `.ts` files
- **Component structure patterns** with TypeScript
- **className prop requirements** for flexible styling
- **Props interface patterns** with proper typing

### **4. Hook Development Rule** (`.cursor/rules/hook-development.mdc`)

- **Applied to hook files** - Covers `hooks/**/*.ts` and `hooks/**/*.tsx`
- **Hook structure patterns** with proper typing
- **State management examples** and error handling
- **Best practices** for React hooks

### **5. Utility Development Rule** (`.cursor/rules/utility-development.mdc`)

- **Applied to utility files** - Covers `utils/**/*.ts`
- **Function structure patterns** with TypeScript
- **Input validation** and error handling
- **Best practices** for utility functions

### **6. Development Workflow Rule** (`.cursor/rules/development-workflow.mdc`)

- **Always Applied** - Provides workflow context for every request
- **Development commands** and testing workflow
- **Code organization standards** and file structure
- **Quality assurance** and release process

## Rule Application Order

Rules are applied in the following priority order:

1. **Always Applied Rules** - Provide essential context for every request
2. **Glob Pattern Rules** - Apply to specific file types or locations
3. **File-Specific Rules** - Apply to individual files or directories

## Creating Custom Rules

### ✅ **Good Practices - When to Create Rules**

#### **Project-Wide Patterns**

```markdown
---
alwaysApply: true
---

# Project-Wide Rule

This rule applies to all files and provides essential context.
```

#### **File Type Patterns**

```markdown
---
globs: **/*.tsx,**/*.ts
---

# TypeScript/React Rule

This rule applies to all TypeScript and React files.
```

#### **Directory-Specific Patterns**

```markdown
---
globs: **/components/**/*.tsx
---

# Component Rule

This rule applies to all component files.
```

#### **Technology-Specific Patterns**

```markdown
---
globs: **/*.test.ts,**/*.test.tsx
---

# Testing Rule

This rule applies to all test files.
```

### ❌ **Bad Practices - When NOT to Create Rules**

#### **Overly Specific Rules**

```markdown
# ❌ Don't create rules for individual files

---

## globs: src/components/Button.tsx
```

#### **Conflicting Rules**

```markdown
# ❌ Don't create rules that contradict existing ones

# This could confuse the AI and lead to inconsistent code
```

#### **Temporary Rules**

```markdown
# ❌ Don't create rules for temporary development needs

# Rules should represent long-term project patterns
```

#### **Overly Complex Rules**

```markdown
# ❌ Don't create rules with too many conditions

# Keep rules focused and easy to understand
```

## Rule File Structure

### **Metadata Section**

```markdown
---
alwaysApply: true # Apply to every request
description: string # Description for manual application
globs: pattern1,pattern2 # File patterns for automatic application
---
```

### **Content Section**

```markdown
# Rule Title

## Overview

Brief description of what this rule covers.

## Patterns

Specific patterns and examples.

## Best Practices

Guidelines and recommendations.
```

## Adding Rules to the Project

### **1. Create Rule File**

```bash
# Create a new rule in the .cursor/rules directory
touch .cursor/rules/my-rule.mdc
```

### **2. Define Metadata**

```markdown
---
globs: **/*.tsx
---

# My Custom Rule
```

### **3. Write Rule Content**

- Use clear, concise language
- Include practical examples
- Follow existing rule patterns
- Keep it focused and actionable

### **4. Test the Rule**

- Create a test file that should trigger the rule
- Verify the rule is applied correctly
- Check for conflicts with existing rules

### **5. Document the Rule**

- Add to this documentation
- Update relevant sections
- Include usage examples

## Rule Maintenance

### **Regular Review**

- **Monthly review** of all rules
- **Remove outdated rules** that no longer apply
- **Update rules** to reflect current patterns
- **Consolidate similar rules** to avoid duplication

### **Performance Optimization**

- **Limit always applied rules** to essential context only
- **Use specific glob patterns** instead of broad ones
- **Avoid rule conflicts** that could confuse the AI
- **Keep rules focused** on specific concerns

### **Team Collaboration**

- **Discuss rule changes** with the team
- **Document rule decisions** and rationale
- **Train team members** on rule usage
- **Gather feedback** on rule effectiveness

## Troubleshooting Rules

### **Rule Not Applying**

1. **Check file patterns** in globs
2. **Verify metadata format** is correct
3. **Check for syntax errors** in rule content
4. **Restart Cursor** to reload rules

### **Conflicting Rules**

1. **Identify overlapping patterns**
2. **Prioritize more specific rules**
3. **Resolve contradictions** in rule content
4. **Test rule interactions**

### **Performance Issues**

1. **Limit always applied rules**
2. **Use specific glob patterns**
3. **Avoid complex rule logic**
4. **Monitor rule application time**

## Best Practices Summary

### **Do's**

- ✅ Create rules for established project patterns
- ✅ Use specific glob patterns for targeted application
- ✅ Keep rules focused and actionable
- ✅ Include practical examples
- ✅ Follow consistent rule structure
- ✅ Review and maintain rules regularly

### **Don'ts**

- ❌ Create rules for temporary needs
- ❌ Overlap rules with conflicting patterns
- ❌ Make rules overly complex
- ❌ Create rules for individual files
- ❌ Ignore rule maintenance
- ❌ Create rules that contradict existing ones

## Getting Started

1. **Install Cursor Editor** from [cursor.sh](https://cursor.sh)
2. **Open the React SuperAdmin project**
3. **Observe automatic rule application** in the editor
4. **Review existing rules** in `.cursor/rules/`
5. **Create custom rules** following the guidelines above
6. **Contribute rules** to improve the project

## Auto-Generating Rules

Cursor provides powerful tools to automatically generate rules from your conversations and development decisions:

### **Using the Generate Command**

- **`/Generate Cursor Rules`** - Use this command in any Cursor chat to automatically create rules
- **AI-powered generation** - Cursor analyzes your conversation and suggests appropriate rules
- **Automatic scoping** - Rules are automatically configured with proper file patterns and descriptions

### **When to Auto-Generate Rules**

- **After making architectural decisions** - Convert decisions into reusable rules
- **When establishing patterns** - Turn repeated guidance into automatic rules
- **During code reviews** - Generate rules from feedback and suggestions
- **When onboarding team members** - Create rules from common questions and patterns

### **Example Auto-Generation**

```bash
# In Cursor chat, type:
/Generate Cursor Rules

# Cursor will analyze your conversation and suggest:
# - Rule content based on your discussion
# - Appropriate file patterns (globs)
# - Rule type (Always, Auto Attached, etc.)
# - Description for manual application
```

For detailed information on auto-generating rules, see the [Official Cursor Documentation on Generating Rules](https://docs.cursor.com/en/context/rules#generating-rules).

## Quick Reference

For a quick overview of all rules, see our [Cursor Rules Quick Reference](./cursor-rules-quick-reference.md).

## Resources

- [Cursor Editor Documentation](https://docs.cursor.sh/)
- [Cursor Rules Guide](https://docs.cursor.sh/guides/rules)
- [React SuperAdmin Project Structure](./architecture.md)
- [Testing Guidelines](./testing.md)
- [Development Workflow](./contributing.md)

---

_Cursor Rules are a powerful way to maintain code quality and consistency. Use them wisely to enhance your development experience!_
