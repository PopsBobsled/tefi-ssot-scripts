---
template_id: T-BAND-BC
version: "1.2"
stage: L1-FirstTouch
name: band-bc-first-touch-linkedin-strategy
subject: "Thank you for your CV"
band: "B/C"
routing: "LinkedIn strategy class (group, weekend 2x)"
owner: Sonnet
static_ratio: 50%
trigger: L1 intake, profile_score = medium (Band B) or low-but-qualified (Band C)
tags: [first-touch, band-b, band-c, group, linkedin-strategy, pipeline, cold-flow]
dynamic_fields: [first_name, background_summary]
calendly_url: "https://calendly.com/tates_employment/linkedin-strategy-for-skilled-migrants"
model: claude-sonnet-4-6
max_tokens: 1000
model_notes: >
  Medium-depth personalisation. Sonnet names 1-2 specific qualities from the CV
  and briefly connects to NZ/AU opportunity. Lighter than Band A: no deep sector
  analysis, no humility beat, no dual value areas. Free LinkedIn strategy class
  invitation (live, twice every weekend, twelve hours apart).
prompt_architecture: "Pattern B — Structured JSON + Code Template"
---

## PROMPT (fed to Sonnet as system + user)

### System prompt

You are writing a first-touch email in Tate Ulsaker's voice for Tate's Employment
for Immigration (TEFI). The recipient is a Band B or C candidate who has submitted
a CV. Goal: thank them, acknowledge specific qualities from their background, and
invite them to a free LinkedIn strategy class.

### User prompt

INPUTS:
- first_name: {{first_name}}
- career_detail roles (titles, seniority, duties): {{roles}}
- highest_qualification: {{credentials}}
- years_relevant_experience: {{years_experience}}
- top_skills_keywords: {{skills}}

STEPS:
1. Identify 1-2 specific positive qualities from the CV: a skill area, years in
   a particular field, industry knowledge, or a credential worth noting.
2. Write 1-2 sentences acknowledging these qualities and briefly connecting them
   to opportunity in New Zealand and Australia. The candidate should feel their
   CV was actually read, not just processed.
3. Return ONLY a JSON object. No preamble, no markdown fences, no trailing text.

OUTPUT FORMAT (return exactly this structure):
```
{
  "background_summary": "(1-2 sentences naming specific qualities and connecting to NZ/AU opportunity)",
  "em_dash_check": "PASS"
}
```

HARD RULES:
- Be specific. Name real qualities from the data, not generic field labels.
- No em-dashes. No "exactly". No "stands out".
- No quality judgements about the person. No comparisons to other candidates.
- Do not promise a Career Migration Report or any specific deliverable.
- Target country is always "New Zealand and Australia" regardless of CV content.
- Spell out acronyms in plain English on first use.
- em_dash_check: always "PASS". Replace any em-dash with a colon before returning.

---

## STATIC HTML SCAFFOLDING (assembled by n8n Code node)

```html
<p>Hi {{first_name}},</p>

<p>Thank you for taking the time to share your background. {{background_summary}}</p>

<p>To help you act on this, I run a free LinkedIn strategy class built for skilled
migrants, where we develop your job-finding strategy and turn your LinkedIn profile
and outreach into real conversations with employers in New Zealand and Australia. I
deliver it live twice every weekend, twelve hours apart, so people in almost any time
zone can attend, at no cost. Here is what it covers:<br>
<a href="https://employmentforimmigration.nz/linkedin-strategy/">https://employmentforimmigration.nz/linkedin-strategy/</a></p>

<p>Lock in your class here:<br>
<a href="https://calendly.com/tates_employment/linkedin-strategy-for-skilled-migrants">https://calendly.com/tates_employment/linkedin-strategy-for-skilled-migrants</a></p>

<p>A little about me: I have spent 18 years helping skilled professionals move into
quality work in New Zealand and Australia. I look forward to meeting you.</p>

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

## CHANGELOG

| Version | Date | Change | Confirmed by |
|---------|------|--------|-------------|
| 1.2 | 2026-06-21 | CTA changed from group Masterclass to free LinkedIn strategy class (live, twice every weekend, twelve hours apart). New calendly_url linkedin-strategy-for-skilled-migrants; added linkedin-strategy page link. Prompt + metadata updated to match. | Tate |
| 1.1 | 2026-06-14 | Prompt upgraded: name specific CV qualities instead of generic field acknowledgment; added top_skills_keywords input | Tate |
| 1.0 | 2026-06-13 | Initial canonical version | Opus |
