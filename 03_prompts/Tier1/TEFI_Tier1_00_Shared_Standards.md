# TEFI_Tier1_00_Shared_Standards.md
### Version: 1.1 | Last updated: 2026-03 | Owner: Tate — TEFI
> **AUTOMATION STATUS: LIVE** — Governs all production prompts. Locked. Update here first if standards change.

---

## PURPOSE OF THIS FILE

This file contains the shared rules, standards, and market calibration that apply equally to **both** the Action Prompt and the Finishing Prompt. It is the single source of truth for anything that spans both pipeline stages.

**When to update this file:**
- Salary bands or market norms shift significantly in NZ or AU
- A new migrant source country becomes a primary audience
- Language, tone, or brand standards change across TEFI
- Source-of-truth discipline needs tightening based on QA findings

**Do not duplicate content from this file into the other two prompt files.** Reference it instead. This prevents drift between prompts when standards are updated.

---

## THE TEFI TIER 1 PIPELINE

```
STEP 1 — Action Prompt
File:      TEFI_Tier1_01_Action_Prompt.md
Input:     CV_TEXT (the client's CV, pasted as plain text)
Output:    A personalised information-request email to the client

        ↓  [Email sent to client — reply received]

STEP 2 — Finishing Prompt
File:      TEFI_Tier1_02_Finishing_Prompt.md
Input:     CV_TEXT + CLIENT_REPLY (both pasted as plain text)
Output:    Complete Tier 1 Career Migration Report (6 sections)
```

---

## SOURCE-OF-TRUTH DISCIPLINE
*(applies to both prompts)*

- All claims about the candidate — role, skills, tools, sectors, achievements, qualifications, experience, seniority — must be directly stated or clearly implied in **CV_TEXT** or **CLIENT_REPLY**.
- If the client provided an estimate in CLIENT_REPLY, use it and treat it as stated. Do not inflate or deflate it.
- Do not import details from other candidates, past outputs, transcripts, LinkedIn profiles, job ads, or any other material.
- Do not invent metrics, qualifications, job titles, or achievements — even if they are "typical" for that role or industry.
- **The only exception:** salary bands, role demand data, and labour market conditions may draw on current NZ/AU market knowledge held by the model.

---

## TARGET AUDIENCE — WHO TEFI SERVES

TEFI's clients are skilled professionals currently living **outside** New Zealand and Australia who are considering migration. They are not NZ/AU residents.

**Primary source countries (in order of volume):**
- South Africa
- India
- Philippines
- United Kingdom
- Zimbabwe
- South Korea

**Professional profile:**
- 10+ years of experience in their field
- Trades, engineering, healthcare, finance, IT, education
- Mid-level to senior seniority
- Often unaware of how their skills translate into NZ/AU market language

**What they need from TEFI:**
- Clarity on whether their skills are viable in NZ/AU
- Honest income expectations — arrival, established, and medium-term
- A credible career trajectory they can plan toward
- An honest CV assessment from an employer's perspective
- Confidence that migration is achievable for someone like them

---

## SALARY STANDARDS — NZ AND AU
*(applies to both prompts)*

**General rules:**
- Salary sentences give a **medium-term 5–10 year target**, not first-year starting salary, unless explicitly stated otherwise.
- Calibrate to **current NZ/AU market norms** for that occupation, experience level, and seniority.
- Default reference point: **major cities** — Auckland, Wellington, Christchurch (NZ); Sydney, Melbourne (AU). If the CV or client reply clearly targets regional locations, shade modestly lower.
- Target the **60th–80th percentile** of realistic outcomes — not the extreme top 5% and not entry-level.
- If the CV clearly supports higher responsibility (team lead, manager, senior specialist), place the band toward the upper part of typical ranges for that level — but still within NZ/AU norms.

**NZ salary format (exact — no variation):**
`NZ$###k–NZ$###k + Retirement contributions (TBC)`
- "NZ$" prefix
- "k" suffix for thousands
- En dash (–) between the two numbers
- Single space before and after the en dash
- Single space before "+"
- Nothing written after "(TBC)"

**AU salary format (exact — no variation):**
`A$###k–A$###k + Superannuation (TBC)`
- Same formatting rules as NZ
- "Superannuation" replaces "Retirement contributions"

**KiwiSaver / Superannuation orientation note:**
When referencing retirement contributions in the Finishing Prompt, include one brief sentence: that KiwiSaver (NZ) or Superannuation (AU) is an employer-contributed non-cash benefit relevant to total compensation planning. Do not give financial advice — frame as orientation only.

---

## LANGUAGE AND TONE STANDARDS
*(applies to both prompts)*

- **Second person throughout:** "you/your" — never "I/we/they" when referring to the client
- **Register:** warm, direct, coach-like — professional structure, human language
- **Never:** clinical, bureaucratic, promotional, or generic career-advice tone
- **No:** immigration/visa language, employer names, company names, emojis
- **No:** invented achievements, fabricated metrics, unjustified promotions in role titles
- **Seniority discipline:** proposed or inferred role titles must sit on the same ladder as demonstrated in CV_TEXT — do not promote a technician to manager without evidence

**Em-dash usage is restricted:**
Em-dashes (—) appearing inside flowing sentences are a known AI writing signal and are not permitted in any client-facing output. Use a comma, colon, or restructured clause instead. Em-dashes are permitted only in the following formatted contexts:
- Salary bands (e.g. NZ$90k–NZ$110k)
- Bullet points using a bold micro-header followed by a description (e.g. **Micro-header** — description text)
- Pipeline or structural notation within prompt files

---

## METRICS RULES
*(applies to both prompts)*

- All numeric metrics (%, $, counts, volumes, timeframes) must be taken directly from CV_TEXT or CLIENT_REPLY, OR be a clear aggregation of multiple stated metrics (e.g. "10–30%" summarising several specific percentage improvements).
- Do not invent metrics even if typical for that role or industry.
- Prefer numeric expressions: "15%", "NZ$2m", "35 vehicles", "120+ staff" — not words.
- If no usable metrics exist in the inputs, focus on responsibilities, scope, and environments instead. Do not fabricate numbers to fill the gap.

---

## QA LOG
*(update after each improvement cycle)*

| Date | File changed | What changed | Why |
|------|-------------|--------------|-----|
| 2026-03 | All | Initial release | v1.0 |
| 2026-03 | TEFI_Tier1_00_Shared_Standards.md, TEFI_Tier1_01_Action_Prompt.md | Em-dash restriction rule added | Em-dashes inside sentences are an AI writing signal; restricted to formatted contexts only |

---

*TEFI_Tier1_00_Shared_Standards.md | Tate's Employment for Immigration*


---

*© 2026 Tate Ulsaker / Tate's Employment for Immigration. All rights reserved. Confidential and proprietary — do not reproduce or share without written permission.*