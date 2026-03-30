# Real-World Findings — Groupon Merchant Experience

*Documented during the case study build process. These are first-hand observations, not assumptions.*

---

## Finding 001: Merchant Onboarding Email Contains Broken Link

**Date:** 2026-03-30
**Severity:** Critical — blocks new merchant signup
**Status:** Observed and documented

### What happened

After applying to become a Groupon merchant and receiving approval, the onboarding email ("Log in to Your Groupon Merchant Center") contains a link to create an account:

```
groupon.ca/en/merchant/center/account/create/{email}/{token}
```

Clicking this link results in a **404 page** ("Oops! we can't find that page"). The page Sofia would land on after being approved — the very first interaction with the merchant platform — is broken.

### Workaround found

Password reset through the login portal works as an alternate path to set up the account. This is not obvious to a new merchant who has never logged in before.

### Why this matters for our case study

1. **Validates the problem statement.** The case study says "Sofia drops off before her deal goes live." If the first link she clicks after approval is a 404, she may never come back. The funnel breaks before she even reaches deal creation.

2. **Our prototype bypasses this entirely.** The AI Deal Creator doesn't require a traditional account setup flow. Sofia answers 5 questions and gets a deal. No broken links, no password reset dance.

3. **This is a video talking point.** In the walkthrough, we can mention: "We observed that even the merchant onboarding email currently leads to a broken page. Our prototype eliminates this friction entirely — Sofia goes from intent to published deal without navigating Groupon's existing infrastructure."

### Evidence

- Screenshot 1: Onboarding email with "Merchant Center" CTA button
- Screenshot 2: 404 page at the target URL
- URL: `groupon.ca/en/merchant/center/account/create/greata@liconsulting.ca/{token}`
- Workaround: Login portal → password reset → account access

### Product implications

This suggests the merchant signup infrastructure has a deployment or routing issue that hasn't been caught — possibly because:
- The flow isn't monitored end-to-end (no synthetic test that clicks the actual email link)
- The URL pattern changed but the email template wasn't updated
- Regional routing (`.ca` vs `.com`) has a gap

In production, our AI Deal Creator would need to handle account creation gracefully, but the core value proposition holds: reduce the number of steps and decisions Sofia has to make, and never leave her stranded on a broken page.

---

## Finding 002: "Complete the Form" Button Silently Fails (Reporting Rules Step)

**Date:** 2026-03-30
**Severity:** Critical — blocks deal submission, no error shown
**Status:** Observed and documented

### What happened

The current merchant deal creation flow has 6 steps:
1. Initial setup ✓
2. Deal creation ✓
3. Business Info ✓ (includes Business Description, Website, Type, Payment Info)
4. Reporting Rules for Digital Platforms ✗
5. Review (locked)
6. Submit (locked)

At Step 4, the merchant is asked to complete a tax compliance form (DAC 7/EU regulations). The page shows a green "Complete the form" button. Clicking it:

1. Does **not** open a form
2. Does **not** show an error message
3. Silently redirects to the "Welcome back" / campaign resume screen
4. Clicking "Resume" loops back to the same Step 4 page

The merchant is now stuck in an infinite loop with no indication of what went wrong.

### Root cause (confirmed via browser console)

This is **not a validation issue** — it's an infrastructure failure. Console logs reveal:

- **502 Bad Gateway** on `GET /api/v2/merchants/li-consulting/messages` — the backend API is returning server errors
- **JSON parse crash** — The API returns an HTML error page (`<!doctype...`) instead of JSON, which the frontend JS can't parse: `SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON`
- **FullStory analytics SDK re-initializing 4 times** — the page is re-mounting in a loop, each time triggering a new analytics init
- **Bloodhound widget error** — "Incomplete widget content for resume-deal" — the draft deal widget can't render because the API data is missing/broken

Real bank information was entered in the previous step. The issue persists regardless of input validity. The merchant platform's backend is returning 502s, and the frontend has no error boundary or fallback — it just silently fails and redirects.

### Why this matters for our case study

1. **Silent failures are the worst UX pattern.** Sofia has no idea what went wrong. She can't fix it because she doesn't know what's broken. This is the exact "complicated form" friction the case study describes, but worse — it's not even that the form is hard, it's that the form doesn't work.

2. **Steps 5 (Review) and 6 (Submit) are locked.** The stepper UI shows a padlock on Submit and grayed-out Review. Sofia can see the finish line but literally cannot reach it. This is psychologically worse than a long form — it's a blocked path with no explanation.

3. **Our prototype has zero blocking steps.** Sofia answers 5 questions → AI generates the deal → she reviews and publishes. No tax forms, no bank verification, no locked steps. The compliance and payment infrastructure is real and necessary in production, but it should never block deal creation — it should happen in parallel or after the first deal is live.

4. **Video talking point:** "The current flow has 6 steps with sub-steps, locked gates, and compliance forms that silently fail. Our AI-assisted flow has 5 questions and one publish button."

### Evidence

- Screenshot: Step 4 page with "Complete the form" green button
- Screenshot: Silent redirect to "Welcome back LI Consulting" resume screen
- Screenshot: Step 3 Payment Info form (Bank Name, Institution Number, etc.)
- Screenshot: Merchant Center dashboard with DAC 7/DSA compliance popup
- Flow: Step 4 button click → no error → redirect to resume → click Resume → back to Step 4 (infinite loop)

### Product implications

- **No error handling on form validation failures.** The system fails silently, which is the worst possible UX for a merchant who just spent time filling out business info.
- **Compliance steps block deal creation.** Tax compliance (DAC 7) is a regulatory requirement, but gating the entire deal submission on it — especially when the form itself is broken — means deals that could be generating revenue are stuck in draft.
- **The stepper gives false confidence.** Green checkmarks on Steps 1-3 suggest progress, but the locked Step 6 and broken Step 4 create a dead end. The UX promises a clear path but delivers a wall.

---

## Summary: Friction Points Observed in Current Merchant Flow

| Step | Issue | Severity | Our Solution |
|------|-------|----------|-------------|
| Account creation | Onboarding email link → 404 | Critical | No account creation needed for deal generation |
| Step 4: Tax compliance | "Complete the form" silently fails, infinite loop | Critical | No blocking compliance steps in deal creation flow |
| Overall flow | 6 major steps with sub-steps, locked gates | High friction | 5 questions → AI generates → review → publish |
| Error handling | Silent failures, no error messages | Critical | Inline error messages, graceful fallbacks |

These findings were discovered through first-hand experience, not assumed. They validate the case study's core premise: the current merchant onboarding flow has fundamental UX issues that AI-assisted deal creation can bypass.
