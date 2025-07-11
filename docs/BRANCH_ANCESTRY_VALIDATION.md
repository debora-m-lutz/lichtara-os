# Branch Ancestry Validation

This repository now includes automated branch ancestry validation in the GitHub Actions workflow to ensure that all pull requests are properly rebased on the latest main branch.

## What is Branch Ancestry Validation?

The validation checks whether the current branch has a common ancestor with the main branch using:
```bash
git merge-base --is-ancestor origin/main HEAD
```

This ensures that:
- The branch has been properly rebased on the latest main branch
- Changes will integrate smoothly without conflicts
- The branch history is clean and follows the project's branching strategy

## When does it run?

The ancestry validation runs automatically as part of the "Spiritual Format Validation" workflow on:
- Pull request opened
- Pull request synchronized (new commits pushed)
- Pull request edited

## What happens if validation fails?

If your branch doesn't have a common ancestor with main, the workflow will:
1. ❌ Fail the validation check
2. 🔄 Provide clear instructions on how to fix it
3. 💫 Block the pull request from being merged

## How to fix a failed validation

If the ancestry validation fails, follow these steps:

1. **Fetch the latest main branch:**
   ```bash
   git fetch origin main
   ```

2. **Rebase your branch on main:**
   ```bash
   git rebase origin/main
   ```

3. **Push the rebased branch:**
   ```bash
   git push --force-with-lease
   ```

## Testing locally

You can test the ancestry validation locally using the provided test script:
```bash
./test-branch-ancestry.sh
```

This script will:
- ✅ Pass if your branch is properly rebased on main
- ❌ Fail if your branch needs to be rebased

## Benefits

This validation ensures:
- 🌟 Clean, linear git history
- 🔄 Smooth integration of changes
- 💫 Reduced merge conflicts
- ⚡ Consistent branching strategy across the Aurora field