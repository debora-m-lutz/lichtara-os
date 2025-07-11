# Branch Protection Configuration Template
# This file serves as a reference for configuring branch protection rules via GitHub UI

## Repository Settings > Branches > Add Rule

### Branch name pattern
```
main
```

### Protect matching branches

#### Restrict pushes that create files larger than 100 MB
- [x] Enabled

#### Require status checks to pass before merging
- [x] Require branches to be up to date before merging
- Status checks that are required:
  - documentation-check / Documentation Check
  - security-scan / Security Scan  
  - code-quality / Code Quality Check

#### Require pull request reviews before merging
- [x] Required number of reviewers before merging: 1
- [x] Dismiss stale pull request approvals when new commits are pushed
- [x] Require review from code owners
- [ ] Restrict approvals to members of specific teams (optional)

#### Require signed commits
- [x] Require signed commits

#### Require linear history
- [x] Require linear history

#### Include administrators
- [x] Include administrators (applies rules to repository administrators)

#### Allow force pushes
- [ ] Everyone (keep unchecked)
- [ ] Specify who can force push (keep unchecked)

#### Allow deletions
- [ ] Allow deletions (keep unchecked to prevent branch deletion)

---

## Implementation Status
This repository includes:
- ✅ Branch protection documentation (.github/branch-protection-guide.md)
- ✅ Status check workflows (.github/workflows/)
- ✅ CODEOWNERS file for review requirements
- ✅ Updated CONTRIBUTING.md with security guidelines
- ⏳ Manual configuration required in GitHub repository settings

## Next Steps for Repository Administrators
1. Navigate to repository Settings > Branches
2. Click "Add rule"  
3. Configure settings according to this template
4. Test with a test pull request to verify all checks work correctly