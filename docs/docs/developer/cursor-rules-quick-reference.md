---
id: cursor-rules-quick-reference
title: Cursor Rules Quick Reference
sidebar_label: Quick Reference
description: Quick overview of all Cursor Rules for React SuperAdmin
---

# Cursor Rules Quick Reference

## 🚀 **Why Cursor Editor?**

- **AI-powered development** with project context
- **Automatic rule application** for consistency
- **Real-time guidance** while coding
- **Framework-specific patterns** built-in

## 📋 **Current Rules Overview**

| Rule                      | Applies To    | Purpose                                    |
| ------------------------- | ------------- | ------------------------------------------ |
| **Project Structure**     | All files     | Monorepo context, commands, patterns       |
| **Testing Patterns**      | Test files    | Testing best practices and patterns        |
| **Component Development** | React files   | Component patterns, className requirements |
| **Hook Development**      | Hook files    | Hook patterns and best practices           |
| **Utility Development**   | Utility files | Function patterns and error handling       |
| **Development Workflow**  | All files     | Development process and quality            |

## 🎯 **Rule Application**

### **Always Applied**

- Project Structure
- Development Workflow

### **File Type Based**

- **`.tsx`, `.ts`** → Component Development
- **`hooks/**/\*`\*\* → Hook Development
- **`utils/**/\*`\*\* → Utility Development
- **`.test.*`** → Testing Patterns

## ✅ **Quick Start**

1. **Install Cursor** from [cursor.sh](https://cursor.sh)
2. **Open project** - Rules auto-apply
3. **Follow patterns** - AI guides your development
4. **Create custom rules** - Extend for your needs

## 🔧 **Custom Rules**

### **Good Practices**

```markdown
---
globs: **/*.tsx
---

# My Rule

Applies to all React components
```

### **Bad Practices**

```markdown
# ❌ Too specific

globs: src/components/Button.tsx

# ❌ Always apply everything

alwaysApply: true
```

## 🚀 **Auto-Generate Rules**

Use Cursor's built-in rule generation:

```bash
# In any Cursor chat, type:
/Generate Cursor Rules
```

**Benefits:**

- **AI-powered analysis** of your conversations
- **Automatic rule creation** with proper scoping
- **Smart file pattern detection** (globs)
- **Instant rule generation** from development decisions

See [Official Cursor Rules Documentation](https://docs.cursor.com/en/context/rules#generating-rules) for complete details.

## 📚 **Full Documentation**

See [Cursor Rules Guide](./cursor-rules.md) for complete details.

---

_Use Cursor Rules to write better code faster! 🚀_
