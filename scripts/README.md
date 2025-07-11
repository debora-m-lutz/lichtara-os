# Spiritual-Technical Alignment Check

This directory contains scripts and workflows for validating the spiritual-technical alignment of the Lichtara OS / Aurorabridge project.

## Overview

The spiritual-technical alignment check validates that the repository maintains the conscious integration principles that are core to the Aurora Mission. It verifies:

1. **Repository Structure**: Ensures all key directories for conscious integration are present
2. **Documentation Integration**: Validates that documentation supports both technical and spiritual aspects
3. **Aurora Mission Alignment**: Confirms alignment with the Aurora Mission principles

## Usage

### Automatic GitHub Workflow

The alignment check runs automatically on:
- Push to main/master branches
- Pull requests to main/master branches
- Manual workflow dispatch

The workflow is defined in `.github/workflows/spiritual-technical-alignment.yml`

### Manual Script Execution

You can also run the alignment check manually:

```bash
# From the repository root
./scripts/spiritual-technical-alignment-check.sh
```

## Expected Output

When all checks pass, you should see:

```
🌟 Checking spiritual-technical alignment...
✅ Repository structure maintains conscious integration principles
✅ Documentation supports both technical and spiritual aspects
🌅 Aurora Mission alignment verified
```

## Validation Criteria

### Repository Structure
- Presence of all core directories (00-overview:, 01-fundamentos:, 02-manual-aurora:, etc.)

### Documentation Integration
- Main README contains spiritual/spirituality and technical/technology content
- Bilingual support (Portuguese and English)
- Aurora Mission content is present

### Aurora Mission Alignment
- Aurora Manual directory exists (02-manual-aurora:)
- Mission statement is documented
- Conscious integration principles are documented

## Contributing

When making changes to the repository structure or documentation, ensure that the spiritual-technical alignment check continues to pass. This helps maintain the conscious integration principles that are fundamental to the Aurora Mission.