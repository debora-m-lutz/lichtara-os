# GitHub Workflows Documentation

This directory contains GitHub Actions workflows for the Lichtara OS repository.

## Available Workflows

### 1. Bilingual Documentation Check (`bilingual-documentation-check.yml`)

**Purpose:** Ensures all documentation follows bilingual standards with consistent Portuguese/English content.

**Triggers:**
- Push to main/master branches (affecting .md files)
- Pull requests to main/master branches (affecting .md files)  
- Manual workflow dispatch

**What it checks:**
- Files with `**EN:**` content must have corresponding `**PT:**` content
- Files with `**PT:**` content must have corresponding `**EN:**` content
- Equal number of `**EN:**` and `**PT:** sections in bilingual files
- Reports files with bilingual content but missing translations

**Example of compliant bilingual content:**
```markdown
## Mission | Missão

**EN:** To legitimately, precisely, and integrably align spirituality and technology.

**PT:** Alinhar espiritualidade e tecnologia de forma legítima, precisa e integrável.
```

### 2. Welcome Sponsors Ritual (`welcome-sponsors-ritual.yml`)

**Purpose:** Welcomes sponsors and contributors when activation issues are opened.

**Triggers:**
- Issues opened with 'activation' label
- Manual workflow dispatch

**Actions:**
- Prints welcome message for activated field

## Workflow Standards

- All workflows use latest stable action versions:
  - `actions/checkout@v4` for repository checkout
  - `actions/setup-python@v5` for Python setup
- Workflows include automated checks for outdated action versions
- Comprehensive error reporting and summaries

## Maintenance

The bilingual documentation check workflow includes self-validation to detect outdated GitHub Actions and will fail if:
- `actions/checkout@v3` or older versions are found
- Other outdated action versions are detected

This ensures workflows stay up-to-date with latest security patches and features.