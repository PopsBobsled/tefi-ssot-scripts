---
template_id: T-BAND-BC
version: "1.0"
stage: L1-FirstTouch
name: band-bc-first-touch-group
subject: "Thank you for your CV"
band: "B/C"
routing: "Group track"
owner: Sonnet
static_ratio: 50%
trigger: L1 intake, profile_score = medium (Band B) or low-but-qualified (Band C)
tags: [first-touch, band-b, band-c, group, masterclass, pipeline, cold-flow]
dynamic_fields: [first_name, background_summary]
calendly_url: "https://calendly.com/tates_employment/how-to-get-permanent-employment-in-nz-australia-1"
model: claude-sonnet-4-6
max_tokens: 1000
model_notes: >
  Lighter personalisation than Band A. Sonnet generates a brief background
  acknowledgement. No deep value-deliverable analysis. Static scaffolding
  carries most of the email. Group Masterclass invitation, not 1-on-1.
prompt_architecture: "Pattern B — Structured JSON + Code Template"
---

## PROMPT (fed to Sonnet as system + user)

### System prompt

You are writing a first-touch email in Tate Ulsaker's voice for Tate's Employment
for Immigration (TEFI). The recipient is a Band B or C candidate who has submitted
a CV. Goal: thank them, briefly acknowledge their background, and invite them to
a free group Masterclass.

### User prompt

INPUTS:
- first_name: {{first_name}}
- career_detail roles (titles, seniority): {{roles}}
- highest_qualification: {{credentials}}
- years_relevant_experience: {{years_experience}}

STEPS:
1. Write a brief, warm acknowledgement of the candidate's background. One to two
   sentences. Reference their general field or sector, not specific achievements.
   Frame as professional experience worth exploring, not as a verdict on quality.
2. Return ONLY a JSON object. No preamble, no markdown fences, no trailing text.

OUTPUT FORMAT (return exactly this structure):
```
{
  "background_summary": "(1-2 sentences acknowledging their field/sector experience)",
  "em_dash_check": "PASS"
}
```

HARD RULES:
- No em-dashes. No "exactly". No "stands out".
- No quality judgements. No comparisons to other candidates.
- Do not promise a Career Migration Report or any specific deliverable.
- Target country is always "New Zealand and Australia" regardless of CV content.
- Spell out acronyms in plain English on first use.
- em_dash_check: always "PASS". Replace any em-dash with a colon before returning.

---

## STATIC HTML SCAFFOLDING (assembled by n8n Code node)

```html
<p>Hi {{first_name}},</p>

<p>Thank you for taking the time to share your background. {{background_summary}}</p>

<p>I run a free masterclass twice a week that covers how skilled professionals find
quality work in New Zealand and Australia. It is practical, covers the local job
market, and is designed for people at your stage of the process. If you are keen,
you can register for the next session here:<br>
<a href="https://calendly.com/tates_employment/how-to-get-permanent-employment-in-nz-australia-1">https://calendly.com/tates_employment/how-to-get-permanent-employment-in-nz-australia-1</a></p>

<p>A little about me: I have spent 18 years helping skilled professionals move into
quality work in New Zealand and Australia. I look forward to meeting you.</p>

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

## CHANGELOG

| Version | Date | Change | Confirmed by |
|---------|------|--------|-------------|
| 1.0 | 2026-06-13 | Initial canonical version, adapted from T-BAND-A | Opus |
