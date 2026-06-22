---
template_id: T-BAND-BC
version: "1.3"
stage: L1-FirstTouch
name: band-bc-first-touch-linkedin-strategy
subject: "Thank you for your CV"
band: "B/C"
routing: "LinkedIn strategy class (group, weekend 2x)"
owner: Sonnet
static_ratio: 50%
trigger: L1 intake, profile_score = medium (Band B) or low-but-qualified (Band C)
tags: [first-touch, band-b, band-c, group, linkedin-strategy, pipeline, cold-flow]
dynamic_fields: [first_name, background_summary, mrr_url, mrr_occupation_area]
calendly_url: "https://calendly.com/tates_employment/linkedin-strategy-for-skilled-migrants"
model: claude-sonnet-4-6
max_tokens: 1000
model_notes: >
  Sonnet names the strongest CV signals present and briefly connects them to NZ/AU
  opportunity. Depth follows the CV per the DEPTH RULE, not a fixed sentence cap.
  Free LinkedIn strategy class invitation (live, twice every weekend, twelve hours apart).
prompt_architecture: "Pattern B - Structured JSON + Code Template"
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
- explicit_tenure_statement (verbatim from CV if present, else empty): {{explicit_tenure}}
- top_skills_keywords: {{skills}}
- mrr_url (resource page link, may be empty): {{mrr_url}}
- mrr_occupation_area (plain-English occupation, may be empty): {{mrr_occupation_area}}

CV SIGNAL PRIORITY - use the strongest signals present, in this order:
1. Explicit tenure stated in the CV (e.g. "10+ years") - use verbatim, never paraphrase.
2. Scale: team size, budget managed, number of clients/users, geographic reach.
3. Value: business outcomes, cost savings, revenue impact, measurable achievements.
4. Highest academic or trades qualification - name it specifically.
5. High-value skills, tools, frameworks an NZ/AU employer would recognise.
6. Diversity of industries, functions, or roles across the career history.
Use whichever signals are present and strongest. Do not invent signals not in the data.

STEPS:
1. Identify the strongest specific positive signals from the CV per CV SIGNAL
   PRIORITY: a skill area, years in a particular field, industry knowledge, scale,
   value outcomes, or a credential worth noting.
2. Write a short acknowledgement naming those signals and briefly connecting them
   to opportunity in New Zealand and Australia. The candidate should feel their
   CV was actually read, not just processed.
3. Return ONLY a JSON object. No preamble, no markdown fences, no trailing text.

OUTPUT FORMAT (return exactly this structure):
```
{
  "background_summary": "(names specific signals from the CV and connects to NZ/AU opportunity; depth per DEPTH RULE)",
  "mrr_sentence": "(see MRR resource link section below; empty string if mrr_url is empty)",
  "em_dash_check": "PASS"
}
```

SECTION - MRR resource link (conditional):
If mrr_url is provided in the inputs and is non-empty, set mrr_sentence to one
sentence for the email body:
"We have published resources covering over 150 job roles in New Zealand and
Australia, including recently updated salary, visa, and employer information
for {{mrr_occupation_area}} - you can find it here: {{mrr_url}}"
If mrr_url is absent or empty, set mrr_sentence to an empty string. Do not
reference MRR generically without a specific link.

HARD RULES:
- Be specific. Name real signals from the data, not generic field labels.
- No em-dashes. No "exactly". No "stands out".
- No quality judgements about the person. No comparisons to other candidates.
- Do not promise a Career Migration Report or any specific deliverable.
- Target country is always "New Zealand and Australia" regardless of CV content.
- Spell out acronyms in plain English on first use.
- em_dash_check: always "PASS". Replace any em-dash with a colon before returning.

DEPTH RULE: Let the CV signals determine depth.
If the candidate's data is rich - explicit tenure, scale, value outcomes, strong
credentials, diverse experience - develop those signals fully.
If signals are thin, keep the personalisation brief and warm.
Never pad a thin CV with generic statements to fill space.
The band governs the CTA and the angle of encouragement. Depth is governed by
what the CV actually contains.

TONE: The primary register is encouragement. The candidate should finish reading
feeling their background was seen and a real path exists for them. Warmth is
constant across all bands. Only the CTA and the angle of encouragement shift by band.

---

## STATIC HTML SCAFFOLDING (assembled by n8n Code node)

The mrr_sentence paragraph is rendered only when mrr_sentence is non-empty.

```html
<p>Hi {{first_name}},</p>

<p>Thank you for taking the time to share your background. {{background_summary}}</p>

<!-- Rendered only if mrr_sentence is non-empty -->
<p>{{mrr_sentence}}</p>

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
| 1.3 | 2026-06-22 | Added CV SIGNAL PRIORITY block. Replaced the "1-2 sentences" cap with the DEPTH RULE (depth follows CV richness). Added TONE backbone (encouragement constant across bands). Added conditional MRR resource link section (mrr_sentence rendered only when mrr_url is non-empty). New inputs: years_experience, explicit_tenure, mrr_url, mrr_occupation_area. | Opus 4.8 (pending Tate) |
| 1.2 | 2026-06-21 | CTA changed from group Masterclass to free LinkedIn strategy class (live, twice every weekend, twelve hours apart). New calendly_url linkedin-strategy-for-skilled-migrants; added linkedin-strategy page link. Prompt + metadata updated to match. | Tate |
| 1.1 | 2026-06-14 | Prompt upgraded: name specific CV qualities instead of generic field acknowledgment; added top_skills_keywords input | Tate |
| 1.0 | 2026-06-13 | Initial canonical version | Opus |
