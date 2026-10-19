# Security policy

This is a static demo/training app with fictitious data and no backend. It stores nothing: no cookies, no web storage, no server.

## Reporting a vulnerability

Please use GitHub's **private vulnerability reporting** (Security tab → "Report a vulnerability"), not a public issue. Include steps to reproduce and the browser you used.

## What is in scope

- Script or markup injection through any form field or filter
- Bypasses of the Content-Security-Policy
- Ways to make the page send data anywhere other than the configured FormSubmit endpoint

## Known limits of a static GitHub Pages site

- Security headers can't be set. `frame-ancestors`, `X-Content-Type-Options`, HSTS preload and `Permissions-Policy` need HTTP headers, which GitHub Pages doesn't allow. The CSP is delivered by `<meta>`, and framing is blocked in script instead.
- The email rate limit and honeypot run client-side. They deter casual abuse but can't stop a determined attacker who calls FormSubmit directly. Use FormSubmit's own spam settings for that.
