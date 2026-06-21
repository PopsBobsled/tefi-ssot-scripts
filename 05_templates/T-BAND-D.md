---
template_id: T-BAND-D
version: "2.1"
stage: L1-FirstTouch
name: band-d-acknowledge-and-redirect
subject: "Thank you for your CV"
band: "D"
routing: "LinkedIn strategy class (below qualification threshold)"
owner: Static
static_ratio: 100%
trigger: L1 intake, qualified = false (Band D)
tags: [first-touch, band-d, decline, linkedin-strategy, pipeline, cold-flow]
dynamic_fields: [first_name]
calendly_url: "https://calendly.com/tates_employment/linkedin-strategy-for-skilled-migrants"
model: none
max_tokens: 0
model_notes: >
  Fully static. No AI call needed. n8n Code node substitutes first_name only.
  DEFAULT: auto_send = false (creates Gmail draft for Tate to review before sending).
  Includes correction pathway for candidates whose qualifications were misread.
prompt_architecture: "Pattern A — Direct Output (static, no AI)"
---

## EMAIL BODY (fully static, assembled by n8n Code node)

```html
<p>Hi {{first_name}},</p>

<p>Thank you for sending through your CV. I appreciate you taking the time.</p>

<p>Based on what we can see, your CV does not appear to include a bachelor-level
degree or a full trades qualification. These are minimum thresholds that employers
in New Zealand and Australia typically require for the skilled roles we work with.
If this is not accurate, please reply and let us know so we can update your profile
and consider the best pathway for you.</p>

<p>Either way, I run a free LinkedIn strategy class for skilled migrants, where we
develop your job-finding strategy and how to turn your LinkedIn profile and outreach
into real conversations with employers in New Zealand and Australia. You are welcome
to join and see if it is useful for your situation. I deliver it live twice every
weekend, twelve hours apart, so people in almost any time zone can attend, at no cost.
Here is what it covers:<br>
<a href="https://employmentforimmigration.nz/linkedin-strategy/">https://employmentforimmigration.nz/linkedin-strategy/</a></p>

<p>Lock in your class here:<br>
<a href="https://calendly.com/tates_employment/linkedin-strategy-for-skilled-migrants">https://calendly.com/tates_employment/linkedin-strategy-for-skilled-migrants</a></p>

<p>I wish you the very best in your career journey.</p>

<p>Best regards,<br>Tate</p>

{{SIGNATURE_BLOCK}}
```

---

## SIGNATURE BLOCK (shared across all bands)

```html
<p>---<br>
Tate Ulsaker<br>
Employment Consultant<br>
Tate's Employment for Immigration<br>
Nelson, NZ | Gold Coast, AU<br>
Lookup Your <a href="https://employmentforimmigration.nz/nz-resources-for-different-roles/">Career Migration to New Zealand.</a><br>
Lookup Your <a href="https://employmentforimmigration.nz/au-resources-for-different-roles/">Career Migration to Australia.</a><br>
Connect with me on <a href="https://www.youtube.com/@employmentforimmigration">Youtube</a> /
<a href="https://www.facebook.com/employmentforimmigration.nz">Facebook</a> /
<a href="https://nz.linkedin.com/company/employment-for-immigration-nz">LinkedIn</a></p>
```

---

## OPERATIONAL NOTES

- **Draft mode by default.** D band emails are created as Gmail drafts, never auto-sent. Tate reviews and sends manually, or deletes if the lead should be parked silently.
- **Correction pathway.** If a candidate replies confirming they hold a qualifying degree or trade certification, Tate can manually override to re-classify.
- **No AI cost.** This template is fully static. Zero Sonnet tokens per D lead.
- **Zoho state.** D leads are parked as "Disqualified/Junk" by the Qualification Gate in 01a.

---

## CHANGELOG

| Version | Date | Change | Confirmed by |
|---------|------|--------|-------------|
| 2.1 | 2026-06-21 | CTA changed from masterclass to free LinkedIn strategy class (live, twice every weekend, twelve hours apart). New calendly_url linkedin-strategy-for-skilled-migrants; added linkedin-strategy page link. Kept the gentle "either way" decline framing and correction pathway. | Tate |
| 2.0 | 2026-06-14 | Kinder decline: removed rejection language, added qualification gap explanation with correction pathway, kept masterclass invitation | Tate |
| 1.0 | 2026-06-13 | Initial canonical version (fully static) | Opus |
