# Scripts Directory

This directory contains utility scripts for the Lichtara OS project.

## Security Scripts

### security-scan.sh

A comprehensive security scanning script that checks for potentially sensitive files that should not be committed to the repository.

#### Usage

```bash
# Run from the project root directory
./scripts/security-scan.sh
```

#### What it scans for

The script checks for common sensitive file patterns including:

**Certificate and Key Files:**
- `*.key` - Private key files
- `*.pem` - Privacy-Enhanced Mail certificate files
- `*.p12`, `*.pfx` - PKCS#12 certificate files
- `*.crt`, `*.cert` - Certificate files
- `*.keystore`, `*.jks` - Java KeyStore files
- `*.p7b`, `*.p7c` - PKCS#7 certificate files
- `*.der` - Distinguished Encoding Rules certificate files

**SSH Keys:**
- `id_rsa`, `id_dsa`, `id_ecdsa`, `id_ed25519` - SSH private keys

**Environment and Configuration:**
- `.env` and variants - Environment files
- `secrets.json` - JSON files containing secrets
- `config.json` - Configuration files
- `credentials.json` - Credential files
- `service-account*.json` - Service account files

**Content Scanning:**
The script also searches for files containing common sensitive keywords like:
- password
- secret
- token
- key
- credential
- api_key
- private_key

#### Integration

This script is automatically run by the GitHub Actions workflow on:
- Push to main or develop branches
- Pull requests to main or develop branches
- Manual workflow dispatch

#### Exit Codes

- `0`: Success - No sensitive files found
- `1`: Failure - Sensitive files detected

#### Security Best Practices

1. **Always review your commits** before pushing
2. **Use .gitignore** to exclude sensitive files
3. **Use environment variables** for configuration
4. **Consider using tools like git-secrets** for additional protection
5. **Use secure secret management** for production environments

#### Troubleshooting

If the script detects sensitive files:

1. **Review** the listed files to confirm they contain sensitive data
2. **Remove** any files with actual secrets or credentials
3. **Add** sensitive file patterns to `.gitignore`
4. **Use** environment variables or secure secret management instead

Remember: Prevention is better than cure. Set up your development environment to avoid committing sensitive files in the first place.