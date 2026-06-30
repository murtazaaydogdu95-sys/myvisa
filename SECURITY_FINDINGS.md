# MyVisa — Security Assessment Findings

**Engagement:** Authorized penetration test (owner-authorized) of the MyVisa SaaS application
**Target repo:** `myvisa` (Next.js 15 / Prisma / PostgreSQL)
**Assessment type:** White-box source review (Phases 1–4 static). Dynamic PoC validation **pending** a designated non-production instance.
**Date:** 2026-06-29
**Status legend:** `CODE-CONFIRMED` = proven by reading the reachable code path · `NEEDS-DYNAMIC` = confirmed in code, runtime PoC still to be captured

> ⚠️ Production (`myvisa.aydex.nl`) is **out of scope** for intrusive testing. No dynamic exploitation was performed against any running instance. All findings below are from source analysis.

---

## Executive summary

MyVisa is a visa-assistance app that stores **high-value PII** — passports, bank statements, addresses, dates of birth — as documents in the database, plus admin functions for refunds and payment status. The data-isolation logic (per-customer scoping by email, document/message ownership checks) is **soundly implemented** — no IDOR was found there.

The serious risk is concentrated in **authentication and the admin gate**:

- **Customer "login" requires only an email** — no password or verification — so anyone can become any customer and download their passport/bank documents.
- The **admin area is protected only by middleware**, on a **Next.js version vulnerable to a known middleware auth-bypass (CVE-2025-29927)**, and the gate **fails open** when the admin password is unset (which actually happened in production).

| Severity | Count | IDs |
|---|---|---|
| Critical | 2 | F-01, F-02 |
| High | 2 | F-03, F-04 |
| Medium | 3 | F-05, F-06, F-07 |
| Low | 2 | F-08, F-09 |
| Info | 1 | F-10 |

### Remediation log (in progress)
| Finding | Status | Fix |
|---|---|---|
| F-01 | ✅ Remediated | Email OTP login (`/api/customer/login` issue + `/api/customer/verify`); removed auto-login on apply; codes hashed, 10-min TTL, 5-attempt cap |
| F-02 | ✅ Remediated | Next.js → 15.5.19; `requireAdminPage()` on all admin pages + `assertAdminAction()` in all admin server actions |
| F-03 | ✅ Remediated | Admin gate fails closed (middleware + `/api/admin/login` deny when no password configured) |
| F-04 | ✅ Remediated | No constant signing-secret fallback in production (throws if `AUTH_SECRET`/`ADMIN_PASSWORD` unset); dev-only constant retained |
| F-05 | ✅ Remediated | Tokens now carry `exp` (admin 8h, customer 7d) and are rejected when expired/malformed |
| F-06 | ✅ Remediated | Rate-limit client IP from `X-Real-IP` / rightmost XFF (no longer spoofable leftmost XFF) |
| F-07 | ✅ Remediated | Generic login response (with F-01) |
| F-08 | ✅ Remediated | `overrides: postcss ^8.5.10` → `npm audit` reports 0 vulnerabilities |
| F-09 | ✅ Remediated | All user input HTML-escaped in email templates |
| F-10 | — | Reviewed, not a finding |

**Top risks in plain language**
1. Anyone can log in as any customer just by typing their email, and read their passport/bank files.
2. The admin dashboard (all customer PII + refund controls) can likely be reached without logging in, due to a Next.js framework bug plus admin pages that don't re-check authentication.
3. If the admin password env var is ever empty, the whole admin panel is wide open — this already occurred once in production.

---

## Methodology & scope

**In scope:** this repository and a to-be-designated local/staging instance.
**Out of scope:** production host, real customer data, payment processors, email/Telegram providers, third-party hosts.

**What was tested (static):** every HTTP route handler, the middleware auth gate, the HMAC token library, all server actions, input validation (zod), rate limiting, security headers/CSP, secrets handling, and an SCA scan (`npm audit`). Dangerous sinks (`dangerouslySetInnerHTML`, `eval`, raw SQL, `child_process`) were grepped and reviewed.

**What was NOT done:** runtime exploitation, fuzzing, authenticated dynamic scanning. These require a confirmed non-prod target (see Appendix B).

---

## Threat model

Single-org, multi-customer (not multi-tenant). Critical boundary = **per-customer data scoping by email**.

| Attacker | Goal | Boundary meant to stop them | Holds? |
|---|---|---|---|
| Anonymous | Any customer's dashboard/documents | Customer cookie auth | ❌ F-01 |
| Anonymous | Admin PII + refund/payment tampering | Middleware admin gate | ❌ F-02, F-03 |
| Authenticated customer | Another customer's data | Email-scoped queries / ownership checks | ✅ (sound) |
| Anyone with repo access | Forge tokens | Server-side signing secret | ⚠ F-04 |

---

## Endpoint × role matrix

| Endpoint | Anon | Customer | Admin | Auth mechanism | Notes |
|---|---|---|---|---|---|
| `GET /`, `/apply`, `/contact`, `/terms`, `/privacy` | ✅ | ✅ | ✅ | none | public |
| `POST /api/applications` | ✅ | ✅ | ✅ | none | auto-logs-in as submitted email (F-01) |
| `POST /api/contact` | ✅ | — | — | rate-limit only | |
| `POST /api/customer/login` | ✅ | — | — | **email only** (F-01) | |
| `DELETE /api/customer/login` | ✅ | ✅ | — | clears cookie | client-side only (F-05) |
| `GET /dashboard` | →login | own apps | own | `readCustomer` self-check | scoping OK |
| `POST /api/customer/messages` | 401 | own app | — | cookie + owner check | scoping OK |
| `POST /api/customer/documents` | 401 | own app | — | cookie + owner check | scoping OK |
| `GET /api/documents/[id]` | 403 | owner | ✅ | owner-or-admin | scoping OK |
| `GET /admin/*` pages | gate | gate | ✅ | **middleware only** (F-02) | no self-check |
| admin server actions | — | — | ✅ | **middleware only** (F-02) | no internal authz |
| `GET /api/cron/flush-notifications` | secret | — | — | `CRON_SECRET` | OK |
| `GET /api/health` | ✅ | ✅ | ✅ | none | |

---

## Findings

### F-01 · Passwordless customer authentication → account takeover & PII theft
- **Severity:** Critical · **CVSS 3.1:** 9.1 — `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N`
- **Confidence:** High · **Status:** ✅ **REMEDIATED** (commit `6fb6878`) — replaced with email OTP; auto-login on apply removed. *Residual:* requires an email provider (`RESEND_API_KEY`) configured in prod or customers cannot receive codes.
- **Affected:** `src/app/api/customer/login/route.ts`, `src/app/api/applications/route.ts` (auto-login), `src/app/api/documents/[id]/route.ts` (PII sink)
- **Root cause:** Customer identity is an **unverified email**; possession of the email is never proven.

**Details.** `/api/customer/login` looks up an application by email and, if one exists, issues a 7-day `mv_customer` cookie — **no password, OTP, or magic link**. Separately, `POST /api/applications` sets the same cookie for whatever email the applicant typed, so creating an application with a victim's email also grants their session.

Once authenticated as the victim, an attacker can:
- read the victim's dashboard (`/dashboard`),
- **download the victim's uploaded documents** (`GET /api/documents/[id]` authorizes them as the application owner) — passports, bank statements, photos,
- read and post messages on the victim's application.

**Reproduction (to capture against staging).**
```
POST /api/customer/login   {"email":"victim@example.com"}      → 200 + Set-Cookie mv_customer=…
GET  /dashboard            (with that cookie)                  → victim's applications
GET  /api/documents/<docId>(with that cookie)                  → victim's passport bytes
```
Alternative vector:
```
POST /api/applications     {"email":"victim@example.com", …}   → 201 + Set-Cookie mv_customer (victim)
```

**Impact.** Complete confidentiality breach of customer PII for any known/guessable email; KVKK/GDPR-significant (identity documents). Chains with F-07 (enumeration) to discover valid emails.

**Remediation.**
- Require a real authentication factor: email **magic-link or OTP** (lowest-friction for this product), or a password set at signup with proper hashing (argon2/bcrypt).
- Do **not** auto-issue a session on application submit; instead email a one-time link to access the dashboard.
- Bind the session to a server-side session record so it can be revoked.

---

### F-02 · Admin auth bypass via Next.js middleware vulnerability (CVE-2025-29927)
- **Severity:** Critical · **CVSS 3.1:** 9.1 — `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N`
- **Confidence:** High · **Status:** ✅ **REMEDIATED** (commit `d19872c`) — Next.js upgraded to 15.5.19; admin pages/actions now self-authorize via `requireAdminPage()` / `assertAdminAction()`.
- **Affected:** `package.json` (`next@15.1.6`), `src/middleware.ts`, all `src/app/admin/**/page.tsx`, `src/app/admin/actions.ts`
- **Root cause:** Authorization for the entire admin area is enforced **only in middleware**, on a Next.js version vulnerable to the `x-middleware-subrequest` bypass (patched in 15.2.3). Admin pages and server actions contain **no independent auth check**.

**Details.** `middleware.ts` is the sole gate for `/admin/*`. CVE-2025-29927 lets an attacker skip middleware execution by sending a crafted `x-middleware-subrequest` header. Because no admin page or action re-verifies the `mv_admin` token, bypassing middleware yields:
- full read of the customer table and every application's PII (`/admin`, `/admin/applications/[id]`),
- invocation of `refundApplication`, `setPaymentStatus`, `setStage`, `setDocumentState`, `specialistReply` (financial/integrity impact).

**Reproduction (to capture against staging).**
```
GET /admin/applications
Header: x-middleware-subrequest: middleware        (or the path-chain variant for the version)
→ expect 200 with admin content instead of redirect to /admin/login
```

**Impact.** Unauthenticated full compromise of the admin panel: all PII + refund/payment tampering.

**Remediation.**
- **Upgrade Next.js to ≥ 15.2.3** (ideally latest 15.x). *Note:* `npm audit fix --force` proposes 15.5.x — validate the build first.
- **Defense in depth:** add an explicit `verifyAdmin(cookies().get('mv_admin'))` check at the top of every admin page and inside every admin server action; do not rely on middleware alone.

---

### F-03 · Admin gate fails OPEN when `ADMIN_PASSWORD` is unset
- **Severity:** High · **CVSS 3.1:** 8.6 — `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N`
- **Confidence:** High · **Status:** ✅ **REMEDIATED** (commit `d19872c`) — middleware, `/api/admin/login`, and `isAdminRequest()` all fail closed when no admin password is configured.
- **Affected:** `src/middleware.ts` (`if (!pass) return NextResponse.next();`), `src/app/api/admin/login/route.ts` (`if (pass && !(…))`)
- **Root cause:** Missing admin credentials are treated as "auth disabled" (fail-open) instead of "deny".

**Details.** If `ADMIN_PASSWORD` is empty, the middleware lets every request into `/admin`, and the login route accepts any credentials. This is not theoretical: during this engagement the production `MYVISA_ADMIN_PASSWORD` was empty due to a GitHub-secret name mismatch, leaving the admin panel ungated.

**Remediation.** Fail closed: if `ADMIN_USER`/`ADMIN_PASSWORD` (or a required `AUTH_SECRET`) is not configured, **deny all admin access** and log a startup error. Never serve `/admin` without configured credentials.

---

### F-04 · Hardcoded fallback HMAC signing secret in a public repository
- **Severity:** High · **CVSS 3.1:** 8.1 — `AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N`
- **Confidence:** High · **Status:** ✅ **REMEDIATED** (commit `d19872c`) — production no longer falls back to a constant (throws if unset). *Residual action:* rotate `AUTH_SECRET` since the old constant was public and shared in chat.
- **Affected:** `src/lib/auth-token.ts` → `secret() = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "myvisa-dev-secret"`
- **Root cause:** A committed constant is used as the token-signing key when env vars are absent; the repo is public.

**Details.** If `AUTH_SECRET` and `ADMIN_PASSWORD` are both unset, all admin **and** customer tokens are signed with the public constant `"myvisa-dev-secret"`, allowing offline forgery of `customerToken(anyEmail)` and `adminToken(user)` → arbitrary account/admin impersonation. Even when set, coupling the signing secret to `ADMIN_PASSWORD` means rotating the admin password silently invalidates all sessions and conflates two secrets.

**Remediation.** Require `AUTH_SECRET`; throw at startup if missing. Remove the `"myvisa-dev-secret"` constant and the `ADMIN_PASSWORD` fallback. Treat the current secret as compromised (it's been in a public repo and shared in chat) and rotate it.

---

### F-05 · Static, non-expiring, non-revocable session tokens
- **Severity:** Medium · **CVSS 3.1:** 5.4 — `AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:N`
- **Confidence:** High · **Status:** ✅ **PARTIALLY REMEDIATED** — tokens now embed `exp` and are rejected when expired. *Residual:* full per-session server-side revocation still requires a session store (edge-runtime constraint); cookie clear + bounded `exp` limit the window.
- **Affected:** `src/lib/auth-token.ts` (`adminToken`, `customerToken`, `readCustomer`, `verifyAdmin`)
- **Root cause:** Signed payloads contain no issued-at/expiry/nonce; tokens are deterministic per identity; logout is client-side only.

**Details.** `adminToken(user)` is a constant value; `customerToken(email)` is constant per email. The cookie `maxAge` is advisory — the **token value** stays valid until the secret rotates. `DELETE /api/customer/login` and the admin logout only clear the cookie; a previously captured token remains replayable.

**Remediation.** Include `iat`/`exp` (and ideally a random `jti`) in the signed payload and verify expiry on every request. For true revocation, store a per-user session version/nonce server-side and include it in the token.

---

### F-06 · Rate-limit bypass via spoofable `X-Forwarded-For`
- **Severity:** Medium · **CVSS 3.1:** 5.3 — `AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N`
- **Confidence:** High · **Status:** ✅ **REMEDIATED** — uses `X-Real-IP` / rightmost XFF. *Residual:* limiter is still per-process; use Redis for multi-pod.
- **Affected:** `src/lib/rate-limit.ts` (`clientIp` takes the leftmost XFF value)
- **Root cause:** Trusts a client-controlled header for the limiter key; limiter is also per-process.

**Details.** `clientIp` returns `x-forwarded-for.split(',')[0]` — the leftmost value, which the client controls. Rotating the header defeats the admin-login limit (6/min) and other buckets, enabling brute force / spam. Additionally the limiter is in-memory per replica, so multiple pods multiply the effective limit.

**Remediation.** Derive the client IP from the trusted proxy hop (rightmost entry after your known proxy, or a platform-provided header), not the leftmost. Back the limiter with Redis/Upstash for multi-pod correctness. (F-06 is largely moot for customer login while F-01 stands, but matters for admin-login brute force.)

---

### F-07 · Username/customer enumeration oracle on login
- **Severity:** Medium · **CVSS 3.1:** 5.3 — `AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N`
- **Confidence:** High · **Status:** CODE-CONFIRMED
- **Affected:** `src/app/api/customer/login/route.ts`
- **Root cause:** Distinct response for unknown vs. known email (`"Bu e-posta ile kayıtlı bir başvuru bulunamadı"`, 401).

**Details.** An attacker can determine which emails belong to customers, amplifying F-01.
**Remediation.** Return a generic response for both cases (and, with magic-link auth, always "if an account exists, we've emailed a link").

---

### F-08 · Vulnerable dependencies (SCA)
- **Severity:** Low (aggregate; the actionable item is F-02) · **Status:** ✅ **REMEDIATED** — Next.js upgraded; transitive `postcss` pinned via `overrides`; `npm audit` now reports 0 vulnerabilities.
- **Affected:** `next@15.1.6`, transitive `postcss < 8.5.10`
- **Details.** `npm audit` reports multiple Next.js advisories (image-optimization DoS, RSC cache poisoning, SSRF on WebSocket upgrade, the CVE-2025-29927 middleware bypass = F-02) and a moderate postcss XSS (`GHSA-qx2v-qp2m-jg93`).
- **Remediation.** Upgrade Next.js (≥ 15.2.3 for the bypass; latest 15.x clears most). Re-run `npm audit` after upgrade. Validate the build (the auto-fix bumps to 15.5.x).

---

### F-09 · HTML injection in admin notification email
- **Severity:** Low · **CVSS 3.1:** 4.6 — `AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N`
- **Confidence:** Medium · **Status:** ✅ **REMEDIATED** — `esc()`/`escMultiline()` applied to all user input in `email.ts`.
- **Affected:** `src/lib/email.ts` (`contactNotificationEmail`, `specialistReplyEmail`) — interpolate `name`/`email`/`message`/`text` into an HTML email body without escaping.
- **Details.** A contact-form submitter controls `name`/`message`; these are placed into HTML sent to the admin inbox. Limited blast radius (email client rendering, depends on Resend/sanitization) and partly out of scope (email provider), but it is unescaped user input in an HTML sink.
- **Remediation.** HTML-escape all user-supplied values before interpolation (or use a templating layer that escapes by default).

---

### F-10 · Reviewed — not a finding
- **Severity:** Info · **Status:** CODE-CONFIRMED (no issue)
- `src/components/Icon.tsx` `dangerouslySetInnerHTML` renders a **static internal** SVG-path map keyed by a typed `IconName` — not user-controlled → not XSS.
- `POST /api/applications` has **no mass assignment**: fields are explicitly listed; `status` (`"Paid"`), `amount`, `perPerson`, `persons`, `txn`, `paidOn`, `isDemo` are set server-side; pricing is computed server-side via `priceForPersons`.
- Document/message **ownership checks are correct** (`email equals … insensitive`, owner-or-admin on download) — no IDOR.
- Security headers/CSP are present and reasonable (`frame-ancestors 'none'`, nosniff, HSTS in prod). CSP allows `'unsafe-inline'` for scripts/styles (inline-styled UI) — a hardening opportunity, not a finding on its own.

---

## Remediation priority

| Order | Finding | Action | State |
|---|---|---|---|
| 1 | F-02 | Upgrade Next ≥ 15.2.3 **and** add in-handler admin authz | ✅ done |
| 2 | F-01 | Replace email-only login with OTP; stop auto-login on apply | ✅ done |
| 3 | F-03 | Fail closed when admin creds unset | ✅ done |
| 4 | F-04 | Remove fallback constant in prod; **rotate the secret** | ✅ code done · follow-up: rotate secret |
| 5 | F-07 | Generic login responses (no enumeration) | ✅ done (with F-01) |
| 6 | F-05 | Add exp/iat + revocation to tokens | ⏳ open |
| 7 | F-06 | Fix IP source for rate limiting | ⏳ open |
| 8 | F-09 | Escape user input in admin notification email | ⏳ open |
| 9 | F-08 | Re-run `npm audit`; clear remaining moderate deps | ⏳ open |

### Operational follow-ups (config, not code)
- **Rotate `AUTH_SECRET`** (old value was in a public repo / shared in chat).
- **Set `RESEND_API_KEY` + `EMAIL_FROM` in prod** — required for F-01 OTP delivery, or customers can't log in.
- Rotate the Telegram bot token via @BotFather (shared during debugging).

---

## Appendix A — Tooling output (excerpt)

```
$ npm audit --omit=dev
next  — multiple advisories incl. CVE-2025-29927 (middleware/proxy bypass),
        image-optimization DoS, RSC cache poisoning, SSRF on WS upgrade
postcss <8.5.10 — moderate: XSS via unescaped </style> (GHSA-qx2v-qp2m-jg93)
2 vulnerabilities (1 moderate, 1 critical)

$ grep -rn "dangerouslySetInnerHTML|eval(|$queryRaw|$executeRaw|child_process" src/
src/components/Icon.tsx: dangerouslySetInnerHTML (static, non-user-controlled — safe)
```

## Appendix B — Items not fully verified (need a non-prod instance)

| Finding | What's confirmed | What dynamic access would close |
|---|---|---|
| F-01 | Code path + sinks | Captured request/response showing PII download as a forged identity |
| F-02 | Vulnerable version + middleware-only architecture | Live `x-middleware-subrequest` request reaching `/admin` unauthenticated |
| F-03 | Fail-open code (and prod observation) | Reproduce on a local instance with `ADMIN_PASSWORD` unset |
| F-06 | Header-trust code | Brute-force demonstration rotating `X-Forwarded-For` |

**To proceed with dynamic validation I need:** the base URL of a designated **non-production** instance, explicit authorization for the active checks (F-02 header, F-06 brute-force), and a throwaway test email. Production (`myvisa.aydex.nl`) remains out of scope.
