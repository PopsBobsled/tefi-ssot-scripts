# Career Vault JSON Generation — Two Methods
**Last updated:** 2026-04-13
**Status:** Reference document — update when methods change

---

## What the JSON Is

The 391-field Career Vault JSON is the single source of truth for all Tier 1 client deliverables. Everything downstream — the Career Vault Google Sheet, the CMSnapshot, the T1 CV Upgrade — is derived from this JSON. Generate it once per client; update it if material new information emerges.

**Schema file:** `~TEFI/Tier1/JSON_Schema/Career_Vault_JSON_Schema_v3.0.json`
**Validator:** JSON Schema Draft 07

---

## Two Population Rulesets

### Ruleset A — Lead Intake (~100 fields)
Used when: a new lead has submitted their intake questionnaire and CV, but has not yet had a full session with Tate.

What gets populated:
- Core identity fields (name, contact, target country, target role)
- CV-derivable career history (roles, dates, responsibilities)
- Education and credentials
- Basic skills and sector tags
- Immigration status indicators

What stays empty: deep achievement quantification, session-derived goals, salary expectations, network intelligence — these require a live session or further conversation.

**Trigger:** Lead has submitted CV + intake questionnaire responses (the "low hanging fruit gap filling content" questions).

---

### Ruleset B — Enriched Post-Session (~391 fields)
Used when: full programme client has completed Session 1 or has had substantive engagement with Tate.

What gets added on top of Ruleset A:
- Quantified achievements (revenue, team size, % improvements)
- Target role and sector refinements
- Salary expectations calibrated to target market
- Relocation and visa status detail
- Network and referral intelligence
- Session notes and coaching observations
- Career progression path preferences (Specialist/IC vs Management)

**Trigger:** Post-session with Tate, or after sufficient back-and-forth to populate the richer fields.

---

## Method 1 — Cowork / Sonnet (Manual)

**When to use:** Individual lead or client, working session in Cowork.

**Steps:**
1. Open Cowork
2. Upload or paste the client's CV + intake questionnaire responses
3. Load the generation protocol:
   `Career_Vault_JSON_Generation_Protocol_v3.0.md`
4. Say to Claude:
   > "Generate the Career Vault JSON for [Client Name] using Ruleset A [or B]. Use the CV and intake responses I've provided."
5. Claude outputs the populated JSON
6. Review for accuracy — especially: Person_ID format, target role titles, date formats
7. Save to client folder as: `[PersonID]_CareerVault_[YYYY-MM-DD].json`

**Person_ID format:** `[INITIALS]-[NNN]` e.g. `TAY-001`
Note: Person_ID casing must be consistent — currently an open task to normalise across all sheets before n8n upsert.

**Model:** Sonnet (complex extraction and judgment required)

---

## Method 2 — Relay / n8n (Automated — pending build)

**When to use:** Once Relay workflow 1 is built and tested. Will handle the bulk of lead intake JSON generation at scale.

**Status:** DESIGNED, NOT YET BUILT

**Workflow design:**
- Trigger: new intake form submission (or manual trigger for batch processing)
- Input: CV file + intake questionnaire responses
- Step 1: Sonnet generates 391-field JSON using extraction protocol
- Step 2: JSON saved to client Drive folder
- Step 3: Separate workflow (Relay workflow 2) upserts JSON to Career Vault Google Sheet

**Key decision:** Three discrete Relay workflows — never collapse into one:
1. JSON generation
2. Career Vault upsert
3. Client outputs (CMSnapshot, CV Upgrade) — manual trigger gate

**Relay ingestion format:** OPEN QUESTION — flat JSON vs sheet-aware. Confirm before building workflow 2.

---

## File Reference

| File | Purpose |
|------|---------|
| `Career_Vault_JSON_Schema_v3.0.json` | Schema validator (Draft 07) |
| `Career_Vault_JSON_Generation_Protocol_v3.0.md` | Extraction spec — 37,000+ char, drives Sonnet |
| `Career_Vault_Quick_Start_Checklist.md` | 10-step operational checklist |
| `INSTRUCTION_PACKAGE_SUMMARY.md` | Orientation layer, ID/date format conventions |

All four files uploaded to session 2026-04-13. Store canonical copies in:
`~TEFI/Tier1/JSON_Schema/`

---

## Downstream Uses of the JSON

Once the JSON exists:

1. **Career Vault Sheet upsert** → Relay workflow 2 → 391-column Google Sheet
2. **CMSnapshot** → `tefi-cmsnapshot:cmsnapshot-generator` skill → .docx → Gmail draft
3. **T1 CV Upgrade** → `Claude_Ready_Tier1_CV_Execution_Brief_Generator_v1.0.md` prompt → .docx → Gmail draft
4. **Future:** Tier 2 deep-dive reports, interview prep, cover letters — all derived from same JSON

**Rule:** Update the JSON if material new information emerges. Do not maintain parallel versions. One JSON per client, one source of truth.
