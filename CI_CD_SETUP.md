# 🔄 CI/CD Setup Documentation

**SubVoyager Continuous Integration & Deployment**

---

## 📋 Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Setup Instructions](#setup-instructions)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)

---

## Overview

SubVoyager uses GitHub Actions for automated building, testing, and deployment. The CI/CD pipeline ensures code quality, catches bugs early, and streamlines the deployment process.

### Workflows Included

| Workflow                 | Trigger                 | Purpose                         |
| ------------------------ | ----------------------- | ------------------------------- |
| **CI - Build and Test**  | Push/PR to main/develop | Builds and validates code       |
| **Code Quality**         | Push/PR to main/develop | Runs linters and type checks    |
| **Dependency Review**    | Pull requests           | Security audit for dependencies |
| **Deploy to Staging**    | Push to develop         | Prepares staging deployment     |
| **Deploy to Production** | Release or manual       | Production deployment           |

---

## GitHub Actions Workflows

### 1. CI - Build and Test (`ci.yml`)

**Triggers:**

- Push to `main` or `develop`
- Pull requests to `main` or `develop`

**What it does:**

```
✅ Checks out code
✅ Sets up Node.js 22.x
✅ Installs dependencies
✅ Runs type checking
✅ Runs ESLint
✅ Builds client bundle
✅ Builds server bundle
✅ Uploads build artifacts
✅ Creates build summary
```

**Expected Duration:** ~2-3 minutes

---

### 2. Code Quality (`code-quality.yml`)

**Triggers:**

- Push to `main` or `develop`
- Pull requests to `main` or `develop`

**What it does:**

```
✅ Runs ESLint (with error reporting)
✅ Checks Prettier formatting
✅ Runs TypeScript type checking
✅ Generates quality report
```

**Expected Duration:** ~1-2 minutes

---

### 3. Dependency Review (`dependency-review.yml`)

**Triggers:**

- Pull requests to `main` or `develop`

**What it does:**

```
✅ Reviews dependency changes
✅ Checks for known vulnerabilities
✅ Runs npm audit
✅ Comments on PR with findings
```

**Expected Duration:** ~1 minute

---

### 4. Deploy to Staging (`deploy-staging.yml`)

**Triggers:**

- Push to `develop` branch
- Manual workflow dispatch

**What it does:**

```
✅ Builds the application
✅ Prepares for deployment
⚠️  Note: Manual upload required (see below)
```

**Expected Duration:** ~2 minutes

---

### 5. Deploy to Production (`deploy-production.yml`)

**Triggers:**

- GitHub Release published
- Manual workflow dispatch (requires confirmation)

**What it does:**

```
✅ Validates deployment confirmation
✅ Runs full build and checks
✅ Creates deployment summary
⚠️  Note: Manual upload required (see below)
```

**Expected Duration:** ~3 minutes

---

## Setup Instructions

### Step 1: Enable GitHub Actions

1. Push your code to GitHub
2. Navigate to your repository
3. Click on the "Actions" tab
4. GitHub Actions should be automatically enabled

### Step 2: Configure Branch Protection (Recommended)

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require status checks to pass
   - ✅ Require "build-and-test" to pass
   - ✅ Require "code-quality" to pass
   - ✅ Require branches to be up to date

### Step 3: Create Environments (Optional)

For deployment workflows:

1. Go to **Settings** → **Environments**
2. Create `staging` environment
3. Create `production` environment
4. Add protection rules:
   - **Production**: Require reviewers (recommended)
   - Add deployment delay if needed

### Step 4: Devvit Token Setup (Future)

Currently, Devvit doesn't support token-based authentication for CI/CD, so deployments must be done manually. When token auth becomes available:

1. Generate Devvit API token from [Reddit Developer Portal](https://developers.reddit.com/)
2. Add secrets to GitHub:
   - **Settings** → **Secrets and variables** → **Actions**
   - Add `DEVVIT_TOKEN` (for staging)
   - Add `DEVVIT_PRODUCTION_TOKEN` (for production)
3. Update workflow files to enable automated deployment

---

## Usage Guide

### Running Checks Locally

Before pushing code, run these commands locally:

```bash
# Run all checks
npm run check

# Individual checks
npm run type-check    # TypeScript
npm run lint          # ESLint
npm run prettier      # Format check
npm run build         # Build
```

### Creating a Pull Request

1. Create a feature branch:

   ```bash
   git checkout -b feature/my-new-feature
   ```

2. Make your changes and commit:

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. Push to GitHub:

   ```bash
   git push origin feature/my-new-feature
   ```

4. Open a Pull Request on GitHub
5. Wait for CI checks to pass (green checkmarks)
6. Address any failures or review comments
7. Merge when approved

### Deploying to Staging

**Automatic (on push to `develop`):**

```bash
git checkout develop
git merge feature/my-feature
git push origin develop
```

**Manual deployment:**

1. Go to **Actions** → **Deploy to Staging**
2. Click **Run workflow**
3. Enter reason (optional)
4. Click **Run workflow**
5. After workflow completes, deploy manually:
   ```bash
   npm run deploy
   ```

### Deploying to Production

**Option 1: Via GitHub Release (Recommended)**

1. Go to **Releases** → **Create a new release**
2. Tag version (e.g., `v1.0.0`)
3. Title: `Release v1.0.0`
4. Description: Release notes
5. Click **Publish release**
6. Workflow runs automatically
7. Deploy manually after checks pass:
   ```bash
   npm run deploy
   npm run launch
   ```

**Option 2: Manual Workflow**

1. Go to **Actions** → **Deploy to Production**
2. Click **Run workflow**
3. Enter version (e.g., `v1.0.0`)
4. Type `DEPLOY` in confirm field
5. Click **Run workflow**
6. Deploy manually after checks pass

---

## Workflow Status Badges

Add these to your README.md:

```markdown
![CI](https://github.com/YOUR_USERNAME/sub-voyager/workflows/CI%20-%20Build%20and%20Test/badge.svg)
![Code Quality](https://github.com/YOUR_USERNAME/sub-voyager/workflows/Code%20Quality/badge.svg)
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Troubleshooting

### Build Failures

**Problem:** Type check fails

```
Solution: Run `npm run type-check` locally and fix errors
```

**Problem:** Linting fails

```
Solution: Run `npm run lint:fix` to auto-fix issues
```

**Problem:** Build fails

```
Solution:
1. Delete node_modules and dist
2. Run `npm install`
3. Run `npm run build`
4. Check for errors
```

### Dependency Issues

**Problem:** `npm ci` fails

```
Solution:
1. Delete package-lock.json
2. Run `npm install`
3. Commit new package-lock.json
```

**Problem:** Vulnerabilities found

```
Solution:
1. Run `npm audit`
2. Run `npm audit fix`
3. For breaking changes: `npm audit fix --force`
4. Test thoroughly after updates
```

### Workflow Permission Issues

**Problem:** Workflow can't create comments

```
Solution:
1. Settings → Actions → General
2. Workflow permissions: Read and write
3. Re-run workflow
```

---

## Best Practices

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add photo gallery feature
fix: resolve map marker clustering bug
docs: update API documentation
style: format code with prettier
refactor: simplify expedition search logic
perf: optimize bundle size
test: add unit tests for user actions
chore: update dependencies
```

### Branch Strategy

```
main (production)
  ↑
  └── develop (staging)
       ↑
       ├── feature/expedition-photos
       ├── feature/badge-system
       └── fix/map-performance
```

**Workflow:**

1. Create feature branch from `develop`
2. Develop and test locally
3. Push and create PR to `develop`
4. After approval, merge to `develop`
5. Test on staging
6. When ready, create PR from `develop` to `main`
7. After approval, merge to `main`
8. Create GitHub Release
9. Deploy to production

### Code Review Checklist

Before approving a PR:

- [ ] All CI checks pass
- [ ] Code follows style guidelines
- [ ] Changes are well-documented
- [ ] No new linting errors
- [ ] Build succeeds
- [ ] Tests added/updated if applicable
- [ ] Breaking changes documented
- [ ] Security implications considered

---

## GitHub Actions Costs

GitHub Actions is free for public repositories with unlimited minutes.

For private repositories:

- **Free tier**: 2,000 minutes/month
- **Average workflow**: ~3 minutes
- **Estimated capacity**: ~650 workflows/month

Current usage estimates:

- 10 PRs/month × 3 workflows × 3 min = 90 minutes
- 20 pushes/month × 2 workflows × 2 min = 80 minutes
- 4 deployments/month × 2 min = 8 minutes
- **Total**: ~180 minutes/month (well within free tier)

---

## Future Enhancements

### Planned Improvements

- [ ] **Automated Testing**

  - Unit tests with Vitest
  - E2E tests with Playwright
  - Visual regression testing

- [ ] **Performance Monitoring**

  - Bundle size tracking
  - Lighthouse CI integration
  - Performance budgets

- [ ] **Advanced Security**

  - CodeQL analysis
  - Container scanning
  - Secret scanning

- [ ] **Automated Deployment**

  - Token-based Devvit auth
  - Automatic rollback on errors
  - Canary deployments

- [ ] **Release Automation**
  - Automated changelog generation
  - Version bumping
  - Release notes from commits

---

## Support

### Getting Help

- **GitHub Issues**: Open an issue with the `ci-cd` label
- **Workflow Logs**: Check Actions tab for detailed logs
- **Devvit Docs**: https://developers.reddit.com/docs

### Useful Commands

```bash
# Check workflow status
gh workflow list

# View workflow runs
gh run list

# View specific run
gh run view RUN_ID

# Re-run failed workflows
gh run rerun RUN_ID
```

---

## Changelog

| Date       | Change                      | Version |
| ---------- | --------------------------- | ------- |
| 2025-10-30 | Initial CI/CD setup         | MVP     |
| TBD        | Add automated testing       | v1.0    |
| TBD        | Enable automated deployment | v1.0    |

---

**Maintained by**: SubVoyager Team  
**Last Updated**: October 30, 2025  
**Questions?** Open an issue or check workflow logs
