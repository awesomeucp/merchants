# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

The UCP Merchant Directory team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by emailing:

**security@awesomeucp.com**

If you prefer encrypted communication, you can use our PGP key (available upon request).

### What to Include

To help us better understand and resolve the issue, please include as much of the following information as possible:

- **Type of issue** (e.g., XSS, injection, authentication bypass, data exposure)
- **Full paths of source file(s)** related to the manifestation of the issue
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the issue**, including how an attacker might exploit it
- **Any special configuration** required to reproduce the issue

### What to Expect

After you submit a report, we will:

1. **Acknowledge receipt** within 48 hours
2. **Provide an initial assessment** within 5 business days
3. **Keep you informed** about our progress
4. **Notify you** when the issue is fixed
5. **Publicly credit you** for the discovery (unless you prefer to remain anonymous)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Fix Timeline**: Varies by severity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-90 days

### Disclosure Policy

- We will work with you to understand the scope and impact of the vulnerability
- We will keep you informed as we develop and test fixes
- We ask that you give us a reasonable amount of time to fix the issue before public disclosure
- We will credit you in our security advisories (unless you wish to remain anonymous)

### Security Update Process

When we receive a security bug report:

1. We confirm the issue and determine affected versions
2. We audit code to find similar problems
3. We prepare fixes for all supported versions
4. We release new versions as soon as possible
5. We publish a security advisory

### Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations, data destruction, and service disruption
- Only interact with accounts you own or with explicit permission of the account holder
- Do not exploit the vulnerability beyond what is necessary to confirm it exists
- Report the vulnerability promptly to security@awesomeucp.com
- Keep the vulnerability confidential until we have issued a fix

We will not pursue legal action against researchers who follow these guidelines.

## Security Best Practices for Users

When deploying the UCP Merchant Directory:

1. **Keep dependencies updated** - Run `bun audit` or `npm audit` regularly and update packages
2. **Use HTTPS** - Always serve the directory over HTTPS in production
3. **Validate merchant data** - Review merchant submissions for malicious content
4. **Environment variables** - Never commit sensitive credentials or API keys
5. **Monitor logs** - Review application logs for suspicious activity
6. **Rate limiting** - Consider implementing rate limiting for the API endpoints
7. **CORS configuration** - Configure CORS appropriately for your deployment

## Known Security Considerations

### Merchant Data Validation

The directory displays merchant-submitted data including:

- Store names and descriptions
- Logo URLs (external images)
- UCP profile data
- Website URLs

While we validate JSON structure and basic formatting:

- We sanitize and validate all displayed content
- External logo URLs are loaded through Next.js Image optimization
- All merchant URLs open in new tabs with proper security attributes

**Recommendation**: When reviewing merchant submissions:
- Verify merchant authenticity
- Check logo URLs are legitimate
- Validate UCP profile endpoints are live
- Review for potential phishing attempts

### API Endpoints

The directory provides public API endpoints for merchant discovery. While these are read-only:

- Consider implementing rate limiting in production
- Monitor for unusual access patterns
- Cache responses to prevent abuse
- Use CDN for DDoS protection

### Static Site Generation

The directory uses Next.js static generation:

- All merchant data is embedded at build time
- No server-side database queries
- Reduced attack surface for injection vulnerabilities
- Updates require rebuild and redeployment

### Dependencies

We regularly update dependencies to patch known vulnerabilities. You can check the current security status:

```bash
bun audit
# or
npm audit
```

### Content Security Policy

When deploying, consider implementing a strong Content Security Policy:

```
Content-Security-Policy: default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
```

## Security Credits

We would like to thank the following researchers for responsibly disclosing security issues:

- _No reports yet_

## Questions?

If you have questions about this security policy, please email security@awesomeucp.com.

## Learn More

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
