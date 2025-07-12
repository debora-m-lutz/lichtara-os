# 🔒 Security Guidelines for Lichtara OS

## Overview
This document outlines essential security practices for Lichtara OS development, specifically focusing on API key management and sensitive data protection.

## 🚨 Critical Security Rules

### 1. API Key Management
- **NEVER** commit API keys, secrets, or tokens to version control
- **ALWAYS** use environment variables for sensitive configuration
- **IMMEDIATELY** revoke any accidentally exposed API keys
- Use `.env` files for local development (already in `.gitignore`)

### 2. Environment Configuration
```bash
# ✅ Correct: Use environment variables
OPENAI_API_KEY=sk-your-actual-key-here

# ❌ Wrong: Never hardcode in source code
const apiKey = "sk-proj-coLoOKOhAPkg01eZBu6jMJlA...";
```

### 3. File Structure for Secrets
```
project/
├── .env.example          # ✅ Template (commit this)
├── .env                 # ❌ Real values (NEVER commit)
├── .env.local           # ❌ Real values (NEVER commit)
└── .gitignore           # ✅ Must include .env patterns
```

## 🛡️ Implementation Guidelines

### Setting Up Environment Variables

1. **Copy the template:**
   ```bash
   cp .env.example .env
   ```

2. **Update with real values:**
   ```bash
   # Edit .env file
   OPENAI_API_KEY=your_real_api_key_here
   ```

3. **Verify .gitignore includes:**
   ```gitignore
   .env
   .env.local
   .env.development
   .env.test
   .env.production
   .env.staging
   ```

### Code Best Practices

#### ✅ Secure Implementation
```javascript
// Load environment variables
require('dotenv').config();

// Validate required environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is required');
  process.exit(1);
}

// Use environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

#### ❌ Insecure Implementation
```javascript
// NEVER do this - hardcoded API key
const openai = new OpenAI({
  apiKey: "sk-proj-coLoOKOhAPkg01eZBu6jMJlA...",
});
```

### Validation Middleware

```javascript
// API key validation middleware
function validateApiKey(req, res, next) {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ 
      error: 'Service unavailable: API key not configured' 
    });
  }
  
  if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
    return res.status(500).json({ 
      error: 'Invalid API key format' 
    });
  }
  
  next();
}
```

## 🔍 Security Checklist

### Before Development
- [ ] Copy `.env.example` to `.env`
- [ ] Configure all required environment variables
- [ ] Verify `.env` is in `.gitignore`
- [ ] Test application with environment variables

### Before Committing
- [ ] Check `git status` for any `.env` files
- [ ] Search code for hardcoded secrets: `grep -r "sk-" src/`
- [ ] Verify all secrets use environment variables
- [ ] Run security scan if available

### Before Deployment
- [ ] Configure production environment variables
- [ ] Use secure secret management (AWS Secrets Manager, etc.)
- [ ] Enable environment variable validation
- [ ] Test with production-like secrets

## 🚨 Incident Response

### If API Key is Exposed

1. **Immediate Actions:**
   ```bash
   # 1. Revoke the exposed API key immediately
   # Go to OpenAI Dashboard → API Keys → Revoke
   
   # 2. Generate new API key
   # OpenAI Dashboard → API Keys → Create new key
   
   # 3. Update environment variables
   echo "OPENAI_API_KEY=new_key_here" > .env
   ```

2. **Git History Cleanup (if committed):**
   ```bash
   # WARNING: This rewrites history - coordinate with team
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch file_with_secret" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (dangerous - inform team)
   git push origin --force --all
   ```

3. **Notification:**
   - Inform team immediately
   - Document the incident
   - Review security practices
   - Update this guide if needed

## 🔧 Automated Security

### Pre-commit Hook Example
```bash
#!/bin/sh
# .git/hooks/pre-commit

# Check for potential secrets
if grep -r "sk-" --include="*.js" --include="*.ts" --include="*.json" .; then
    echo "❌ Potential API key found in staged files!"
    echo "Use environment variables instead."
    exit 1
fi

echo "✅ Security check passed"
```

### GitHub Actions Security Scan
```yaml
# .github/workflows/security.yml
name: Security Scan
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run security scan
        run: |
          # Check for secrets in code
          if grep -r "sk-" --include="*.js" --include="*.ts" .; then
            echo "❌ Potential secrets found"
            exit 1
          fi
```

## 📚 Additional Resources

- [OpenAI API Key Best Practices](https://platform.openai.com/docs/guides/production-best-practices)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)

## 🤝 Contributing to Security

If you discover security vulnerabilities:
1. **DO NOT** create public issues
2. Email: security@lichtara.os
3. Include detailed reproduction steps
4. Allow time for responsible disclosure

---

**Remember: Security is everyone's responsibility!** 🛡️