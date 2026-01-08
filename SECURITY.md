# Security Policy

## Security Updates

### January 2026 - Comprehensive Security Enhancements

**New Security Features:**
- ✅ Input validation for file uploads (size, type, row count)
- ✅ XSS protection via DOMPurify sanitization
- ✅ File size limits enforced (10MB maximum)
- ✅ File type whitelist (CSV, XLSX, XLS only)
- ✅ Row count limits (10,000 maximum)
- ✅ Console.log removal in production builds
- ✅ Error boundaries for graceful error handling

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
- Input validation and sanitization in place
- XSS protection active

## Security Features

### Input Validation
- **File Size Limits**: Maximum 10MB per file
- **File Type Validation**: Only CSV, XLSX, and XLS files accepted
- **Row Count Limits**: Maximum 10,000 rows to prevent memory issues
- **Extension Validation**: Strict file extension checking

### Data Sanitization
- **DOMPurify Integration**: All user input is sanitized
- **HTML Tag Stripping**: Prevents XSS attacks
- **Safe Rendering**: User-uploaded data is safely displayed

### Error Handling
- **Error Boundaries**: Graceful error handling in React components
- **Secure Error Messages**: No sensitive data exposed in error messages
- **Production Logging**: Console logs removed in production builds

### Build Security
- **Terser Minification**: Code obfuscation in production
- **Source Maps**: Only included for debugging, can be disabled
- **Environment Variables**: Proper separation of dev/prod config

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an e-mail to the repository owner. All security vulnerabilities will be promptly addressed.

**Please include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |

## Security Best Practices

When using this dashboard:

### For Developers
1. **Keep dependencies up to date**: Run `npm audit` regularly
2. **Review security advisories**: Check GitHub Dependabot alerts
3. **Use environment variables**: Never commit secrets
4. **Enable CSP headers**: Add Content Security Policy in production
5. **Run security scans**: Use CodeQL or similar tools
6. **Review pull requests**: Check for security issues

### For Users
1. **Only upload trusted files**: Verify file sources
2. **Check file sizes**: Be aware of upload limits
3. **Use HTTPS**: Always use secure connections in production
4. **Clear browser cache**: After updates
5. **Report issues**: Contact support for suspicious behavior

### For Deployment
1. **Use HTTPS only**: Configure SSL/TLS certificates
2. **Set security headers**: CSP, X-Frame-Options, etc.
3. **Rate limiting**: Implement API rate limits
4. **File upload restrictions**: Enforce server-side validation
5. **Regular backups**: Maintain data backup procedures
6. **Monitor logs**: Check for suspicious activities

## Dependency Security

We actively monitor and update dependencies to address security vulnerabilities:

- **ExcelJS**: Used for Excel file parsing and generation (no known vulnerabilities)
- **DOMPurify**: Used for XSS protection (actively maintained)
- **Chart.js**: Used for data visualization (regularly updated)
- **jsPDF**: Used for PDF generation (actively maintained)
- **React**: UI framework (maintained by Facebook/Meta)
- **Zustand**: State management (lightweight and secure)
- **Lucide React**: Icons library (SVG-based, safe)

## Known Limitations & Recommendations

### Current Limitations
- ❌ No CSRF protection (recommended for production)
- ❌ LocalStorage not encrypted (sensitive data should be avoided)
- ❌ No rate limiting (implement server-side)
- ❌ No CSP headers (configure in web server)

### Recommended Improvements
1. **Add CSRF tokens** for sensitive operations
2. **Encrypt localStorage** data if handling sensitive information
3. **Implement rate limiting** for file uploads
4. **Configure CSP headers** in production environment
5. **Add authentication** if handling user data
6. **Use secure cookies** for session management

## Security Audit

**Last security audit**: January 2024  
**Next scheduled audit**: April 2024

**Audit Tools Used:**
- npm audit
- ESLint security rules
- Manual code review
- Dependency vulnerability scanning

Run `npm audit` to check for any new vulnerabilities:
```bash
npm audit
npm audit fix  # Apply automatic fixes
```

## Security Headers Configuration

Recommended security headers for production deployment:

```nginx
# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';";

# Other security headers
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
```

## Vulnerability Disclosure Timeline

1. **Report received**: Acknowledgment within 24 hours
2. **Initial assessment**: Within 48 hours
3. **Fix development**: Depends on severity (1-7 days)
4. **Testing**: 1-2 days
5. **Release**: Immediate for critical, scheduled for others
6. **Disclosure**: After fix is deployed

## Contact

For security concerns, contact:
- **GitHub Issues**: For non-sensitive reports
- **Email**: For sensitive vulnerability disclosures

---

**Last Updated**: January 2024  
**Version**: 1.1.0  
**Maintained by**: Darkness308
