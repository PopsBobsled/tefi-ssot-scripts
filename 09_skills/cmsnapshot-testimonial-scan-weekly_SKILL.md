---
name: cmsnapshot-testimonial-scan-weekly
description: Weekly Thursday scan: Gmail testimonials from CMSnapshot recipients → cross-reference Tier1 Registry → Excel table → 3-quote social infographic
---

## CMSnapshot Testimonial Scanner — Weekly Thursday Run

**Objective:** Scan Gmail for positive testimonial quotes from CMSnapshot recipients, enrich them via the Tier1 Registry Google Sheet, extract them into an Excel table, then generate a 3-quote social media infographic ready for LinkedIn, Facebook, and Instagram.

---

## STEP 1 — Search Gmail for Testimonial Responses

Search Gmail for replies to emails with the subject "Your Career Migration Snapshot". Use the Gmail MCP tool `gmail_search_messages` with query: `subject:"Career Migration Snapshot" in:anywhere`.

For each reply found, read the full message body using `gmail_read_message`. Look for genuine positive sentiment about the Snapshot itself. A qualifying response is one where the candidate says something specific and authentic about the value, quality, or impact of the report — something a skilled migrant reading it would find credible and appealing.

**Two tiers of qualifying quotes:**
- **Detailed/substantive** — multi-sentence reactions that describe what resonated, reference the depth of the report, mention the career paths, salary data, or specific insights. These are the most valuable.
- **Short/punchy** — brief but genuine reactions ("wow, this is comprehensive", "eye-opening", "exactly what I needed") that convey real feeling in a few words. Include these too — a mix of long and short quotes makes for a better infographic.

**Trigger phrases to look for:** "thank you", "this is exactly", "very helpful", "impressed", "this is incredible", "wow", "this report", "I really appreciate", "this is spot on", "fantastic", "excellent", "this is what I needed", "eye opening", "comprehensive", "detailed", "in depth", "game changer", "so helpful", or any substantive positive reaction to the Snapshot.

**Exclude:**
- Intake responses (candidates answering questions about their work history)
- Automated replies
- Polite-but-neutral acknowledgements with no evaluative content ("received, thank you", "noted")
- Replies that are primarily about logistics or next steps with no comment on the Snapshot itself

Record the sender's name, email address, and date of reply for each qualifying message.

---

## STEP 2 — Cross-Reference the Tier1 Registry

For each qualifying testimonial found, look up the candidate in the Tier1 Registry Google Sheet:

- **Sheet ID:** `1abylcyfcNeJJEb67AORf8MtsO8IN5F8l-7w3l-kbMk4`
- **Sheet tab:** `Questions`

Match the candidate by name or email address. If a match is found, extract:
- **Source Country** — the country the candidate is migrating from
- **Primary Role** — their main occupation or job title as recorded in the Registry

If no match is found in the Registry, still include the testimonial. Infer Source Country and Primary Role from context in the email thread (e.g. the original Snapshot email Tate sent will often reference the candidate's background). Mark inferred values with "(inferred)" so Tate can verify.

---

## STEP 3 — Extract Quote Data

For each qualifying positive response, extract:
- **Initials** — First and last name initials only (e.g. "D.W." for Davies Waza). Never use full names.
- **Source Country** — From Registry match, or inferred from email context. Mark as "(inferred)" if not from Registry.
- **Primary Role** — From Registry match, or inferred from email context. Mark as "(inferred)" if not from Registry.
- **Quote** — Extract the most specific, genuine, and impactful sentence or two from their response. Use exact words only — never paraphrase, improve, or embellish. Trim surrounding filler (greetings, sign-offs) but do not alter the quote itself. Aim for a mix: include some longer, detailed quotes and some short, punchy ones. The quote should be able to stand alone and be understood by someone who doesn't know the context.
- **Date** — Format as DD Month YYYY (e.g. "16 April 2026")

If fewer than 3 qualifying quotes are found, note this in the report and include as many as were found.

---

## STEP 4 — Update the Excel Table

Read the existing file at `/sessions/laughing-elegant-babbage/mnt/Claude/~TEFI/Marketing/Testimonials_CMSnapshot.xlsx`.

**Current column structure (do not alter column order or names):**
Initials | Job Sector | Quote | Date | Country of Origin | Target Country | Source | Used In Infographic | Approval Requested | Approval Status | Display Name | Photo Approved | Approval Notes | Approved for Use

**When adding a new row:**
- Columns 1–8 (Initials through Used In Infographic): populate from scan data as usual
- Column 9 (Approval Requested): leave blank — filled when approval email is sent
- Column 10 (Approval Status): set to `Pending`
- Column 11 (Display Name): leave blank — filled after approval received
- Column 12 (Photo Approved): set to `No` as default
- Column 13 (Approval Notes): leave blank
- Column 14 (Approved for Use): set to `No` — updated to `Yes` only after approval confirmed

**Duplicate check:** Match on Initials + Date. If both match an existing row, skip — do not append.

Save to: `/sessions/laughing-elegant-babbage/mnt/Claude/~TEFI/Marketing/Testimonials_CMSnapshot.xlsx`

---

## STEP 5 — Select 3 Quotes for the Infographic

**Only select quotes where column 14 (Approved for Use) = `Yes`.** Never include quotes where Approved for Use is `No` or blank, regardless of quality.

For Display Name on the infographic, always use column 11 (Display Name), not column 1 (Initials). If Display Name is blank for an approved row, flag it to Tate and skip that row.

From the approved rows, select the 3 strongest quotes based on:
1. **Appeal to skilled migrants** — would a skilled professional considering NZ/AU find this credible and motivating? Prefer quotes that hint at depth, quality, or career insight.
2. **Mix of styles** — aim for at least one detailed, substantive quote and at least one short, punchy quote. Avoid three quotes of the same length or tone.
3. **Specificity** — quotes that reference something concrete about the report, a specific insight, or a result are stronger than generic thanks.
4. **Authenticity** — reads like a real person, not a marketing line.
5. **Variety** — different source countries and primary roles if possible.
6. **Freshness** — prefer quotes not yet used in a previous infographic (check the "Used In Infographic" column if populated).

If fewer than 3 quotes exist in the table, use all available and notify Tate.

---

## STEP 6 — Generate the Social Media Infographic

Create a single HTML file rendering a 3-quote testimonial grid at 1080x1080px (square — works for LinkedIn, Facebook, Instagram).

**Design spec:**
- Background: Navy (#0F1A30)
- Three quote cards arranged vertically
- Each card: white or light grey (#F2F2F2) background, quote text in dark (#1A1A1A), initials + primary role in navy bold, source country in smaller grey text below, date in small grey text
- Gold (#D4A83F) left border accent on each card
- Header: "What migrants are saying" in white, clean sans-serif
- Low-key CTA at the bottom: "tate@employmentforimmigration.nz" in small gold text — no exclamation marks, no hype
- Footer: "Employment for Immigration NZ" in small white text
- No stock photos, no AI faces, no loud claims

Save to: `/sessions/loving-brave-planck/mnt/Claude/~TEFI/Marketing/Infographic_Testimonials_[YYYY-MM-DD].html`

Where [YYYY-MM-DD] is today's date.

---

## STEP 7 — Report to Tate

Summarise:
- How many emails were scanned
- How many qualifying testimonials were found this week (new) vs. already in the table
- How many were matched in the Tier1 Registry vs. inferred
- Which 3 quotes were selected for the infographic (with initials, role, country)
- Confirm file locations
- Flag anything needing human review (e.g. inferred Source Country or Primary Role values that Tate should verify)

**Tone:** Factual, brief. Tate reviews before anything posts.

---

## Constraints
- Never use full candidate names — initials only
- Never fabricate, paraphrase, or improve quotes — exact words from the email only
- If no qualifying testimonials are found, save/update the Excel table and notify Tate clearly
- The infographic is a draft for human review — do not suggest it is ready to post without Tate's approval
- Mark any Source Country or Primary Role values inferred from context (not from Registry) with "(inferred)"
