# Scripts

This directory contains utility scripts for the Lichtara OS project.

## validate-package-json.sh

Validates all `package.json` files in the repository to ensure they contain valid JSON.

### Usage

```bash
./scripts/validate-package-json.sh
```

### Features

- Finds all `package.json` files in the repository (excluding `node_modules`)
- Properly handles file paths with spaces in directory names
- Validates JSON syntax using Node.js
- Returns appropriate exit codes for CI/CD integration

### CI/CD Integration

This script is automatically run by the GitHub Actions workflow `validate-package-json.yml` on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch

The script will fail the CI build if any `package.json` file contains invalid JSON.