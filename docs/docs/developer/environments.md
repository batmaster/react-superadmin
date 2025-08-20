---
id: environments
title: Environment Configuration
sidebar_label: Environments
description:
  Learn about the different environments and how they're configured for
  deployment
---

# Environment Configuration

React SuperAdmin uses a multi-environment setup to provide different deployment
targets for development, testing, and production.

## 🌍 **Environment Overview**

| Environment    | URL                                | Purpose                   | Trigger            | Firebase Project   | Channel   |
| -------------- | ---------------------------------- | ------------------------- | ------------------ | ------------------ | --------- |
| **Production** | `https://react-superadmin.web.app` | Live production site      | `main` branch push | `react-superadmin` | `live`    |
| **Preview**    | `https://react-superadmin.web.app` | Feature preview & testing | Pull requests      | `react-superadmin` | `pr-{number}` |
| **Staging**    | `https://react-superadmin.web.app` | Pre-production testing    | PR with `staging` label | `react-superadmin` | `staging` |
| **Local**      | `http://localhost:3000`            | Development               | Local development  | `react-superadmin` | `local`   |

## 🚀 **How It Works**

### **Single Project, Multiple Channels**

React SuperAdmin uses a **single Firebase project** (`react-superadmin`) with
different deployment channels:

- **Production Channel**: `live` - Deploys to main domain
- **Preview Channels**: `pr-{number}` - Deploys to preview URLs (e.g., `pr-68`)
- **Staging Channel**: `staging` - Deploys to staging environment
- **Local Channel**: `local` - For development testing

Each environment has its own:

- **URL**: Same domain but different channels
- **Firebase Project**: Single project (`react-superadmin`)
- **Channel ID**: Different deployment channels within the project
- **Deployment Trigger**: Different GitHub events

## 🔧 **Configuration Files**

### **Environment Configuration** (`docs/config/environments.ts`)

```typescript
export const environments = {
  production: {
    url: 'https://react-superadmin.web.app',
    firebaseChannelId: 'live',
  },
  preview: {
    url: 'https://react-superadmin.web.app',
    firebaseChannelId: 'preview',
  },
  staging: {
    url: 'https://react-superadmin.web.app',
    firebaseChannelId: 'staging',
  },
};
```

### **GitHub Workflow** (`.github/workflows/deploy.yml`)

```yaml
jobs:
  deploy-docs-production:
    environment:
      name: production
      url: https://react-superadmin.web.app
    # Deploys to live channel

  deploy-docs-preview:
    environment:
      name: preview
      url: https://react-superadmin.web.app
    # Deploys to pr-{number} channel

  deploy-docs-staging:
    environment:
      name: staging
      url: https://react-superadmin.web.app
    # Deploys to staging channel
```

### **GitHub Environments**

- **Production**: Protected environment for main branch deployments
- **Preview**: Open environment for pull request deployments
- **Staging**: Open environment for staging deployments (requires `staging` label)

## 🚀 **Deployment Process**

### **Production Deployment**
1. Push to `main` branch
2. Triggers `deploy-docs-production` job
3. Deploys to `live` channel
4. Available at `https://react-superadmin.web.app`

### **Preview Deployment**
1. Create pull request to `main`
2. Triggers `deploy-docs-preview` job
3. Deploys to `pr-{number}` channel (e.g., `pr-68`)
4. Available at `https://react-superadmin.web.app` (same domain, different channel)

### **Staging Deployment**
1. Create pull request with `staging` label
2. Triggers `deploy-docs-staging` job
3. Deploys to `staging` channel
4. Available at `https://react-superadmin.web.app` (same domain, different channel)

## 🧹 **Cleanup: Removing Old Firebase Project**

Previously, React SuperAdmin used two separate Firebase projects:

- **`react-superadmin`** - Production (short URL)
- **`react-superadmin-eb776`** - Preview (long URL)

This caused confusion and maintenance overhead. We've now consolidated to use only
the **`react-superadmin`** project with different deployment channels.

### **Steps to Clean Up**

1. **Verify New Setup Works**
   ```bash
   # Test production deployment
   git push origin main
   
   # Test preview deployment
   gh pr create --title "Test Preview" --body "Testing preview deployment"
   ```

2. **Remove Old Project** (Optional)
   ```bash
   # Switch to the old project
   npx firebase use react-superadmin-eb776
   
   # List hosting sites
   npx firebase hosting:sites:list
   
   # Delete the old project (BE CAREFUL!)
   # npx firebase projects:delete react-superadmin-eb776
   ```

3. **Update Local Development**
   ```bash
   # Switch back to main project
   npx firebase use react-superadmin
   
   # Verify current project
   npx firebase projects:list
   ```

## 🔍 **Troubleshooting**

### **Common Issues**

1. **Deployment Fails**
   - Check Firebase service account permissions
   - Verify channel ID exists in project
   - Check GitHub environment protection rules

2. **Wrong Channel Deployed**
   - Verify `channelId` in workflow matches environment
   - Check environment detection logic
   - Ensure correct branch/PR triggers

3. **URL Not Accessible**
   - Wait for DNS propagation (can take up to 24 hours)
   - Check Firebase hosting status
   - Verify channel configuration

### **Environment Detection**

The system automatically detects the environment based on:
- **CI**: `process.env.CI === 'true'`
- **Production**: `GITHUB_REF === 'refs/heads/main'`
- **Preview**: `GITHUB_REF` exists but not main
- **Local**: None of the above

## 📚 **Best Practices**

1. **Always test in preview** before merging to main
2. **Use staging environment** for major changes
3. **Monitor deployment logs** for any issues
4. **Keep environment URLs** consistent across configs
5. **Use descriptive channel names** for easy identification

## 🌐 **Channel URLs**

With Firebase Hosting channels, you can access different environments:

- **Production**: `https://react-superadmin.web.app`
- **Preview**: `https://react-superadmin--pr-68.web.app` (for PR #68)
- **Staging**: `https://react-superadmin--staging.web.app`
- **Local**: `https://react-superadmin--local.web.app`

The channel URLs follow the pattern: `{project-id}--{channel-id}.web.app`

Remember to always test environment changes in preview before applying to
production!
