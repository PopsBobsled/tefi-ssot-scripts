---
template_id: T-BAND-A
version: "1.0"
stage: L1-FirstTouch
name: band-a-first-touch-1on1
subject: "Thank you for your CV"
band: "A/B+"
routing: "1-on-1 track"
owner: Sonnet
static_ratio: 40%
trigger: L1 intake, profile_score = high (Band A or B+)
tags: [first-touch, band-a, band-b-plus, 1on1, calendly, pipeline, cold-flow]
dynamic_fields: [first_name, last_name, title, value_deliverables, skill_area, career_dimension]
calendly_url: "https://calendly.com/tates_employment/chat-with-tate"
model: claude-sonnet-4-6
max_tokens: 1500
model_notes: >
  Sonnet generates the personalised body using the prompt below.
  Static scaffolding (greeting pattern, "18 years" line, Calendly block, signature)
  is assembled by the n8n Code node, not by Sonnet.
  Sonnet returns a JSON object with the dynamic zones only.
prompt_architecture: "Pattern B — Structured JSON + Code Template"
---

## PROMPT (fed to Sonnet as system + user)

### System prompt

You are writing a first-touch email in Tate Ulsaker's voice for Tate's Employment
for Immigration (TEFI). The recipient is a Band A (top-tier) candidate who has
submitted a CV. Goal: briefly appreciate them and invite them to a direct 1-on-1
meeting with Tate.

### User prompt

INPUTS:
- first_name: {{first_name}}
- last_name: {{last_name}}
- title: {{title}}
- career_detail roles (titles, seniority, methods/frameworks, duties): {{roles}}
- highest_qualification, certifications, registrations: {{credentials}}

STEPS:
1. Estimate the candidate's top core value deliverable(s) from the role data.
   If one clearly dominates, name only it. If two are roughly equal, name both.
   Never more than two.
2. Return ONLY a JSON object with the following fields. No preamble, no markdown
   fences, no trailing commentary.

OUTPUT FORMAT (return exactly this structure):
```
{
  "greeting_line": "(see GREETING RULES below)",
  "compliment_sentence": "(one sentence appreciating depth/diversity of background, see HARD RULES)",
  "on_first_read_paragraph": "(see SECTION 2 rules below)",
  "em_dash_check": "PASS"
}
```

GREETING RULES:
- If title is a gender-neutral professional title (e.g. "Dr.", "Professor"),
  use "Hi {{title}} {{last_name}},".
- Otherwise use "Hi {{first_name}},".

SECTION 1 — Greeting + thanks:
- Thank them for sending the CV.
- After the thank-you line, add the compliment_sentence: one sentence appreciating
  the quality of the profile, framed around the depth or diversity of their
  background, not around fit certainty.
- Example shape (do not copy): "I appreciate getting quality profiles like yours
  due to the depth of your [skill area] and the [breadth/range] of your
  [career dimension]."

SECTION 2 — "On a first read, ..." (on_first_read_paragraph):
- Name the value area(s). Frame as a LIKELY area to EXPLORE, not a conclusion.
- Include a humility beat that a CV is only an early signal (e.g. "I hold that
  lightly").
- Bridge to the matching NZ/AU job sector as an opportunity.
- Anchor on working towards the right job fit.

HARD RULES:
- No em-dashes in flowing text. No "exactly". No "stands out" as a verdict.
- No certainty about fit. No flattery that claims to judge the person from a CV.
- Complimentary sentence: one sentence only, after the thank-you, framed around
  depth/diversity of background, never around fit, outcome, or verdict.
- "18 years" written exactly that way.
- Target country is always "New Zealand and Australia" regardless of CV content.
- Spell out acronyms in plain English on first use.
- Keep it short: 3 short body paragraphs maximum.
- em_dash_check: always "PASS". Replace any em-dash with a colon before returning.

---

## STATIC HTML SCAFFOLDING (assembled by n8n Code node)

The Code node builds the final email from Sonnet's JSON output + these static blocks:

```html
<p>{{greeting_line}}</p>

<p>Thank you for sending through your CV. {{compliment_sentence}}</p>

<p>{{on_first_read_paragraph}}</p>

<p>A little about me: I have spent 18 years helping skilled professionals move
into quality work in New Zealand and Australia. I would be glad to share what I
know and help you map the shortest path to a strong fit. If you are keen, you
can book a time with me here:<br>
<a href="https://calendly.com/tates_employment/chat-with-tate">https://calendly.com/tates_employment/chat-with-tate</a></p>

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
| 1.0 | 2026-06-13 | Initial canonical version from confirmed Totti test output | Tate |
