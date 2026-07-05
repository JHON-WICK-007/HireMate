# HireMate AI - Security Constitution

## CRITICAL

This project is NOT a prototype.

Treat it as a production-ready AI SaaS application.

Every feature must be designed with security as the highest priority.

Never sacrifice security for convenience.

Never assume the frontend can be trusted.

Always validate and authorize on the backend.

If security is missing, the task is NOT complete.

---

# ZERO TRUST PRINCIPLE

Never trust

- Client data
- Browser requests
- Form inputs
- Hidden fields
- URL parameters
- Local storage
- Cookies
- JWT payload without verification

Everything must be validated on the server.

---

# AUTHENTICATION

Implement production-grade authentication.

Requirements

✓ Secure password hashing (Argon2id preferred, bcrypt acceptable)

✓ Strong password policy

✓ Email verification

✓ Secure password reset

✓ Session expiration

✓ Refresh token rotation

✓ Secure logout

✓ Account lockout after repeated failures

✓ Brute-force protection

✓ Login attempt throttling

✓ Remember Me implemented securely

✓ Session invalidation on password change

Never store plain passwords.

Never expose tokens to JavaScript if HttpOnly cookies are used.

---

# AUTHORIZATION

Every protected endpoint MUST verify permissions.

Never rely on the frontend.

Implement

Role Based Access Control (RBAC)

Examples

Student

Admin

Moderator

Support

Future roles must be easy to add.

Every API must verify

Authentication

Authorization

Ownership

Examples

A user cannot access another user's

Resume

Interview

Analytics

Settings

History

Reports

IDs from the frontend must never grant access by themselves.

---

# ROUTE PROTECTION

Protect

Frontend routes

Backend routes

API routes

Dynamic routes

Admin routes

Middleware must verify authentication before serving protected content.

Unauthorized users must never receive protected data.

---

# INPUT VALIDATION

Validate EVERY input.

Server-side validation is mandatory.

Validate

Email

Password

Phone

URLs

Names

Files

Dates

IDs

Query parameters

JSON payloads

Never trust frontend validation alone.

---

# FILE UPLOAD SECURITY

Accept only allowed MIME types.

Verify extensions.

Verify MIME.

Verify file size.

Rename uploaded files.

Never execute uploaded files.

Scan if possible.

Prevent path traversal.

Prevent malicious filenames.

Store uploads securely.

---

# DATABASE SECURITY

Never use string concatenation for queries.

Use ORM or parameterized queries.

Validate IDs.

Sanitize input where appropriate.

Prevent injection attacks.

Never expose internal IDs unnecessarily.

---

# API SECURITY

Protect every endpoint.

Implement

Rate limiting

Request validation

Authentication

Authorization

Error handling

Request size limits

Timeouts

CORS configuration

No sensitive information in responses.

---

# JWT SECURITY

If JWT is used

Verify signature.

Verify expiration.

Verify issuer.

Verify audience.

Reject invalid tokens.

Rotate refresh tokens.

Invalidate compromised sessions.

Never trust decoded payloads without verification.

---

# ENVIRONMENT VARIABLES

Secrets must NEVER be hardcoded.

Use

.env

Server secrets only.

Do not expose

API Keys

JWT Secret

Database Password

SMTP Credentials

OAuth Secrets

OpenAI Keys

Gemini Keys

Stripe Secret Keys

Mongo URI credentials

Never commit secrets to Git.

---

# PASSWORD POLICY

Minimum 12 characters.

Uppercase.

Lowercase.

Number.

Special character.

Reject weak passwords.

Check against common passwords if possible.

---

# ERROR HANDLING

Never expose

Stack traces

Database errors

Framework errors

Secrets

Paths

Internal implementation

Return safe messages only.

Log detailed errors internally.

---

# LOGGING

Log

Authentication failures

Authorization failures

Admin actions

Sensitive account changes

Password resets

Security events

Never log passwords.

Never log secrets.

Never log tokens.

---

# CORS

Allow only trusted origins.

Reject unknown origins.

Restrict methods.

Restrict headers.

Do not use

Access-Control-Allow-Origin: *

in production.

---

# HEADERS

Use secure headers.

Content Security Policy

X-Frame-Options

X-Content-Type-Options

Referrer-Policy

Permissions Policy

Strict Transport Security

---

# XSS PROTECTION

Escape user content.

Sanitize HTML.

Never render raw HTML.

Use trusted libraries.

Prevent script injection.

---

# CSRF

Protect all state-changing requests.

Implement CSRF protection if using cookies.

Reject forged requests.

---

# RATE LIMITING

Protect

Login

Signup

Password Reset

Contact Form

Resume Upload

Interview Generation

AI Endpoints

OTP

Verification

Limit abusive traffic.

---

# BOT PROTECTION

Implement

CAPTCHA

Turnstile

reCAPTCHA

or equivalent

for sensitive endpoints.

---

# AI ENDPOINT SECURITY

Protect expensive AI APIs.

Validate requests.

Authenticate users.

Rate limit requests.

Prevent prompt abuse.

Prevent unlimited API usage.

Log abnormal usage.

---

# BUSINESS LOGIC

Never allow users to

Access another user's resume

Modify another interview

View private analytics

Delete another account

Change another profile

Everything must verify ownership.

---

# CLIENT SECURITY

Never store sensitive information in Local Storage.

Prefer secure HttpOnly cookies.

Minimize exposed data.

Do not expose internal IDs.

---

# DEPENDENCY SECURITY

Avoid abandoned packages.

Prefer actively maintained libraries.

Audit dependencies regularly.

Remove unused packages.

---

# PERFORMANCE

Security should not significantly reduce UX.

Optimize middleware.

Avoid duplicate verification.

Cache safely.

---

# BEFORE MARKING THE TASK COMPLETE

Verify

✓ Authentication

✓ Authorization

✓ Validation

✓ Route protection

✓ API protection

✓ Secure file uploads

✓ Secure headers

✓ Rate limiting

✓ Logging

✓ Error handling

✓ Input sanitization

✓ Database protection

✓ Environment variable usage

✓ No secrets committed

✓ Ownership verification

✓ Secure session handling

✓ Production readiness

If ANY item fails,

DO NOT STOP.

Fix it immediately.

Re-review the implementation.

Repeat until every requirement is satisfied.

---

# FINAL RULE

Never implement a feature that "works."

Implement a feature that is

Secure

Scalable

Maintainable

Production-ready

If a senior security engineer would reject the implementation,

continue improving it before presenting the result.