---
template_id: T-BAND-D
version: "1.0"
stage: L1-FirstTouch
name: band-d-decline-with-resource
subject: "Thank you for your CV"
band: "D"
routing: "No track — below qualification threshold"
owner: Static
static_ratio: 100%
trigger: L1 intake, qualified = false (Band D)
tags: [first-touch, band-d, decline, masterclass, pipeline, cold-flow]
dynamic_fields: [first_name]
calendly_url: "https://calendly.com/tates_employment/how-to-get-permanent-employment-in-nz-australia-1"
model: none
max_tokens: 0
model_notes: >
  Fully static. No AI call needed. n8n Code node substitutes first_name only.
  DEFAULT: auto_send = false (creates Gmail draft for Tate to review before sending).
  Tate may choose to suppress this email entirely for some D leads.
prompt_architecture: "Pattern A — Direct Output (static, no AI)"
---

## EMAIL BODY (fully static, assembled by n8n Code node)

```html
<p>Hi {{first_name}},</p>

<p>Thank you for sending through your CV. I have reviewed it and at this stage I am
not able to offer a personalised service for your profile. This is not a reflection
of your ability, it simply means that the roles I specialise in placing are not the
right match for your current experience and qualifications.</p>

<p>I do run a free masterclass twice a week that covers how skilled professionals find
quality work in New Zealand and Australia. It is open to everyone and you are welcome
to join. You can register here:<br>
<a href="https://calendly.com/tates_employment/how-to-get-permanent-employment-in-nz-australia-1">https://calendly.com/tates_employment/how-to-get-permanent-employment-in-nz-australia-1</a></p>

<p>I wish you the very best in your career journey.</p>

<p>Warm regards,<br>Tate</p>

{{SIGNATURE_BLOCK}}
```

---

## SIGNATURE BLOCK (shared across all bands)

```html
<p>---<br>
Employment Consultant<br>
Tate's Employment for Immigration (TEFI)<br>
Nelson, NZ | Gold Coast, AU<br>
Connect with me on <a href="https://www.youtube.com/@employmentforimmigration">Youtube</a> /
<a href="https://www.facebook.com/employmentforimmigration.nz">Facebook</a> /
<a href="https://nz.linkedin.com/company/employment-for-immigration-nz">LinkedIn</a><br>
Services: <a href="https://employmentforimmigration.nz/services-home/">https://employmentforimmigration.nz/services-home/</a></p>
```

---

## OPERATIONAL NOTES

- **Draft mode by default.** D band emails are created as Gmail drafts, never auto-sent. Tate reviews and sends manually, or deletes if the lead should be parked silently.
- **No AI cost.** This template is fully static. Zero Sonnet tokens per D lead.
- **Zoho state.** D leads are already parked as "Disqualified/Junk" by the Qualification Gate in 01a before this email is generated.

---

## CHANGELOG

| Version | Date | Change | Confirmed by |
|---------|------|--------|-------------|
| 1.0 | 2026-06-13 | Initial canonical version | Opus |
