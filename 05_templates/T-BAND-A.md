---
template_id: T-BAND-A
version: "1.1"
stage: L1-FirstTouch
name: band-a-first-touch-1on1
subject: "Thank you for your CV"
band: "A/B+"
routing: "1-on-1 track"
owner: Sonnet
static_ratio: 40%
trigger: L1 intake, profile_score = high (Band A or B+)
tags: [first-touch, band-a, band-b-plus, 1on1, calendly, pipeline, cold-flow]
dynamic_fields: [first_name, last_name, title, value_deliverables, skill_area, career_dimension, mrr_url, mrr_occupation_area]
calendly_url: "https://calendly.com/tates_employment/chat-with-tate"
model: claude-sonnet-4-6
max_tokens: 1500
model_notes: >
  Sonnet generates the personalised body using the prompt below.
  Static scaffolding (greeting pattern, "18 years" line, Calendly block, signature)
  is assembled by the n8n Code node, not by Sonnet.
  Sonnet returns a JSON object with the dynamic zones only.
prompt_architecture: "Pattern B - Structured JSON + Code Template"
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
  "mrr_sentence": "(see MRR resource link section below; empty string if mrr_url is empty)",
  "em_dash_check": "PASS"
}
```

GREETING RULES:
- If title is a gender-neutral professional title (e.g. "Dr.", "Professor"),
  use "Hi {{title}} {{last_name}},".
- Otherwise use "Hi {{first_name}},".

SECTION 1 - Greeting + thanks:
- Thank them for sending the CV.
- After the thank-you line, add the compliment_sentence: one sentence appreciating
  the quality of the profile, framed around the depth or diversity of their
  background, not around fit certainty.
- Example shape (do not copy): "I appreciate getting quality profiles like yours
  due to the depth of your [skill area] and the [breadth/range] of your
  [career dimension]."

SECTION 2 - "On a first read, ..." (on_first_read_paragraph):
- Open with the strongest explicit signal in the CV (see CV SIGNAL PRIORITY above).
  If the candidate states tenure directly, lead with that number.
- Name the core value area(s) this experience points to. One if clear, two if
  genuinely equal weight. Frame as what you would likely explore, not a verdict.
- One sentence bridging to the NZ/AU opportunity in that area.
- Depth follows CV signals per DEPTH RULE. No hedging sentences about CVs being
  limited signals. Do not include any "I hold that lightly" style disclaimer.

SECTION - MRR resource link (conditional):
If mrr_url is provided in the inputs and is non-empty, set mrr_sentence to one
sentence for the email body:
"We have published resources covering over 150 job roles in New Zealand and
Australia, including recently updated salary, visa, and employer information
for {{mrr_occupation_area}} - you can find it here: {{mrr_url}}"
If mrr_url is absent or empty, set mrr_sentence to an empty string. Do not
reference MRR generically without a specific link.

HARD RULES:
- No em-dashes in flowing text. No "exactly". No "stands out" as a verdict.
- No certainty about fit. No flattery that claims to judge the person from a CV.
- Complimentary sentence: one sentence only, after the thank-you, framed around
  depth/diversity of background, never around fit, outcome, or verdict.
- "18 years" written exactly that way.
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

The Code node builds the final email from Sonnet's JSON output + these static blocks.
The mrr_sentence paragraph is rendered only when mrr_sentence is non-empty.

```html
<p>{{greeting_line}}</p>

<p>Thank you for sending through your CV. {{compliment_sentence}}</p>

<p>{{on_first_read_paragraph}}</p>

<!-- Rendered only if mrr_sentence is non-empty -->
<p>{{mrr_sentence}}</p>

<p>A little about me: I have spent 18 years helping skilled professionals move
into quality work in New Zealand and Australia. I would be glad to share what I
know and help you map the shortest path to a strong fit. If you are keen, you
can book a time with me here:<br>
<a href="https://calendly.com/tates_employment/chat-with-tate">https://calendly.com/tates_employment/chat-with-tate</a></p>

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
| 1.1 | 2026-06-22 | Added CV SIGNAL PRIORITY block and DEPTH RULE (removed the "3 short body paragraphs maximum" cap so depth follows the CV). Rewrote SECTION 2: lead with the strongest explicit signal, removed the "I hold that lightly" humility beat. Added TONE backbone (encouragement constant across bands). Added conditional MRR resource link section (mrr_sentence rendered only when mrr_url is non-empty). New inputs: years_experience, explicit_tenure, skills, mrr_url, mrr_occupation_area. | Opus 4.8 (pending Tate) |
| 1.0.1 | 2026-06-14 | Sign-off and signature updated: Best regards, full name, business name without acronym | Tate |
| 1.0 | 2026-06-13 | Initial canonical version from confirmed Totti test output | Tate |
