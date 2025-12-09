# Security Policy

## Known Vulnerabilities

### xlsx Dependency (v0.18.5)

**Status:** Known vulnerability with no public patch available

**Vulnerabilities:**
1. **Regular Expression Denial of Service (ReDoS)**
   - Affected versions: < 0.20.2
   - Severity: Moderate
   - Patched version: Not available in public npm registry

2. **Prototype Pollution**
   - Affected versions: < 0.19.3
   - Severity: Moderate
   - Patched version: Not available in public npm registry

**Context:**
The `xlsx` package (v0.18.5) is the latest version available in the public npm registry (published March 2022). The SheetJS project has moved to a paid/enterprise model for newer versions (0.19.x and 0.20.x), which are not available via npm.

**Mitigation Strategies:**

1. **Input Validation**
   - Only accept Excel/CSV files from trusted sources
   - Validate file size limits (currently enforced in DataModule)
   - Sanitize uploaded file data before processing

2. **Usage in Application**
   - The xlsx library is only used in the DataModule component for parsing uploaded files
   - Files are processed client-side only (no server-side exposure)
   - User must explicitly upload a file for processing

3. **Alternatives Considered**
   - **SheetJS Enterprise**: Requires paid license for patched versions
   - **exceljs**: Alternative library but different API
   - **papaparse**: Only supports CSV, not Excel formats

**Recommendations:**

For production deployments:
1. Consider upgrading to SheetJS Enterprise edition for access to patched versions
2. Implement additional input validation for uploaded files
3. Monitor for community patches or forks addressing these vulnerabilities
4. Limit file upload functionality to authenticated, trusted users only

**User Advisory:**
Users should only upload Excel/CSV files from trusted sources and avoid processing files from unknown or untrusted origins.

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an e-mail to the repository owner. All security vulnerabilities will be promptly addressed.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Best Practices

When using this dashboard:
1. Only upload files from trusted sources
2. Keep dependencies up to date
3. Review security advisories regularly
4. Run security audits: `npm audit`
5. Consider implementing file size limits
6. Use HTTPS in production deployments
