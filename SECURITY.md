# Security Policy

## Security Updates

### December 2025 - xlsx Vulnerability Resolution

**Previous Issue:** The `xlsx` package (v0.18.5) had known vulnerabilities (ReDoS and Prototype Pollution) with no public patches available.

**Resolution:** Migrated from `xlsx` to `exceljs` (v4.4.0), a well-maintained alternative library without these vulnerabilities.

**Changes Made:**
- Replaced `xlsx` import with `exceljs` in dataParser.js
- Updated Excel parsing logic to use ExcelJS API
- Updated Excel export functionality in exportUtils.js
- All Excel file handling now uses the secure ExcelJS library

## Current Security Status

✅ **All known vulnerabilities addressed**
- No high or critical severity vulnerabilities
- Remaining dependencies are up to date and secure

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

## Dependency Security

We actively monitor and update dependencies to address security vulnerabilities:
- **ExcelJS**: Used for Excel file parsing and generation (no known vulnerabilities)
- **Chart.js**: Used for data visualization (regularly updated)
- **jsPDF**: Used for PDF generation (actively maintained)
- **React**: UI framework (maintained by Facebook/Meta)

## Security Audit

Last security audit: December 2025
Next scheduled audit: March 2026

Run `npm audit` to check for any new vulnerabilities.
