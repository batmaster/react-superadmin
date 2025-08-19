# CI/CD Pipeline

This project uses GitHub Actions for continuous integration, deployment, and code quality management. All workflows are automatically triggered based on repository events.

## 🚀 Workflows Overview

### 1. CI (Continuous Integration)

**File**: `.github/workflows/ci.yml`
**Triggers**: Push to `main`/`develop`, Pull Requests

Runs on every push and pull request to ensure code quality:

- **Multi-Node Testing**: Tests against Node.js 18.x and 20.x
- **Dependency Installation**: Uses pnpm with frozen lockfile
- **Code Quality Checks**: Linting, testing, and building
- **Matrix Strategy**: Parallel execution for different Node versions

```yaml
# Key features
- Linting with ESLint
- Unit testing with Jest
- TypeScript compilation
- Package building
- Cross-version compatibility
```

### 2. Code Quality

**File**: `.github/workflows/code-quality.yml`
**Triggers**: Push to `main`/`develop`, Pull Requests

Advanced code quality and security analysis:

- **SonarCloud Integration**: Code quality metrics and analysis
- **CodeQL Security**: Automated security vulnerability detection
- **Dependency Review**: Security analysis for PR dependencies
- **Language Support**: JavaScript and TypeScript analysis

```yaml
# Security features
- SonarCloud code quality metrics
- GitHub CodeQL security scanning
- Dependency vulnerability checks
- Automated security reporting
```

### 3. Dependencies Management

**File**: `.github/workflows/dependencies.yml`
**Triggers**: Weekly schedule (Mondays 9 AM UTC), Manual dispatch

Automated dependency management and security:

- **Weekly Updates**: Automated dependency checking
- **Security Audits**: npm audit and Snyk scanning
- **Auto-PR Creation**: Automated pull requests for updates
- **Vulnerability Monitoring**: High-severity security alerts

```yaml
# Automation features
- Scheduled dependency checks
- Automated security scanning
- Pull request creation for updates
- Snyk vulnerability monitoring
```

### 4. Deployment

**File**: `.github/workflows/deploy.yml`
**Triggers**: Push to `main` (docs/packages changes)

Automated deployment pipeline:

- **Documentation**: GitHub Pages deployment
- **Firebase Hosting**: Firebase deployment for docs
- **Package Publishing**: NPM package publishing
- **Conditional Triggers**: Only runs on relevant changes
- **Sequential Execution**: Docs deploy before packages

```yaml
# Deployment targets
- GitHub Pages (documentation)
- GitHub Packages (npm packages)
- Conditional deployment triggers
```

## 🔧 Configuration

### Firebase Setup

The project uses Firebase Hosting for documentation deployment alongside GitHub Pages:

1. **Firebase Project**: `react-superadmin`
2. **Hosting Directory**: `docs/build`
3. **Deployment Channel**: `live`
4. **Configuration**: Uses existing `firebase.json` and `.firebaserc`

### Required Secrets

Set these secrets in your GitHub repository settings:

```bash
# GitHub Actions
GITHUB_TOKEN          # Automatically provided

# Firebase (required for docs deployment)
FIREBASE_SERVICE_ACCOUNT_KEY  # Firebase service account JSON

# SonarCloud (optional)
SONAR_TOKEN           # For code quality metrics

# Snyk (optional)
SNYK_TOKEN            # For security scanning
```

### Environment Variables

Workflows automatically use:

- **Node.js**: 18.x and 20.x for testing
- **pnpm**: Version 8 for package management
- **Cache**: npm cache for faster builds
- **Matrix**: Parallel execution strategies

## 📊 Monitoring & Reporting

### Workflow Status

Monitor workflow execution in:

- **GitHub Actions tab**: Real-time workflow status
- **Pull Request checks**: Automated status reporting
- **Security alerts**: Vulnerability notifications
- **Code quality**: SonarCloud metrics

### Performance Metrics

Track pipeline performance:

- **Build times**: Node version comparison
- **Cache efficiency**: Dependency caching stats
- **Failure rates**: Workflow success metrics
- **Security scores**: SonarCloud quality gates

## 🛠️ Local Development

### Pre-commit Hooks

Local development uses Husky for code quality:

```bash
# Install hooks
pnpm install

# Manual hook setup
pnpm run prepare

# Pre-commit checks
- ESLint + Prettier formatting
- TypeScript compilation
- Commit message validation
```

### Workflow Testing

Test workflows locally:

```bash
# Install act (GitHub Actions local runner)
brew install act

# Run specific workflow
act -W .github/workflows/ci.yml

# Run with specific event
act push -W .github/workflows/ci.yml
```

## 🔄 Workflow Lifecycle

### Pull Request Flow

1. **Code Push**: Triggers CI workflow
2. **Quality Checks**: CodeQL, SonarCloud analysis
3. **Dependency Review**: Security vulnerability check
4. **Status Reporting**: All checks must pass
5. **Merge Ready**: PR can be merged

### Release Flow

1. **Main Branch Push**: Triggers deployment
2. **Documentation Build**: Docusaurus build
3. **GitHub Pages Deploy**: Documentation update
4. **Package Build**: Core and web packages
5. **Package Publish**: NPM package release

## 📈 Optimization Tips

### Performance Improvements

- **Cache Dependencies**: Uses pnpm store caching
- **Parallel Jobs**: Matrix strategy for Node versions
- **Conditional Triggers**: Only run when needed
- **Incremental Builds**: Leverage build caching

### Cost Optimization

- **Scheduled Jobs**: Weekly dependency checks
- **Conditional Execution**: Skip unnecessary steps
- **Cache Utilization**: Reduce build times
- **Resource Limits**: Optimize runner usage

## 🚨 Troubleshooting

### Common Issues

**Workflow Failures**:

```bash
# Check workflow logs
# Verify secrets configuration
# Check Node.js version compatibility
# Review dependency conflicts
```

**Build Errors**:

```bash
# Clear GitHub Actions cache
# Update pnpm lockfile
# Check TypeScript compilation
# Verify package.json scripts
```

**Deployment Issues**:

```bash
# Check GitHub Pages settings
# Verify package permissions
# Review workflow conditions
# Check branch protection rules
```

### Debug Commands

```bash
# Local workflow testing
act -W .github/workflows/ci.yml --verbose

# Check workflow syntax
yamllint .github/workflows/*.yml

# Validate GitHub Actions
gh workflow list
gh workflow view ci
```

## 🔮 Future Enhancements

### Planned Features

- **Performance Monitoring**: Build time tracking
- **Security Scanning**: Enhanced vulnerability detection
- **Automated Testing**: Browser testing integration
- **Deployment Rollbacks**: Automated rollback capabilities
- **Metrics Dashboard**: Workflow performance analytics

### Integration Opportunities

- **Slack Notifications**: Build status alerts
- **Jira Integration**: Issue tracking automation
- **Performance Budgets**: Bundle size monitoring
- **Accessibility Testing**: Automated a11y checks
- **Cross-browser Testing**: Browser compatibility validation

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SonarCloud Integration](https://docs.sonarqube.org/latest/analysis/github-integration/)
- [CodeQL Security](https://docs.github.com/en/code-security/codeql-cli)
- [pnpm GitHub Actions](https://pnpm.io/ci)
- [Docusaurus Deployment](https://docusaurus.io/docs/deployment)
