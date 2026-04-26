# JSON Ingestion & Lead Pipeline — Decision Log
**Owner:** Tate  
**Created:** 2026-04-12  
**Status:** Decision captured — pending implementation  
**Related files:**
- `SSOT_COMPLETE_JSON_ARCHITECTURE.md` — upstream architecture
- `TEFI_Tier1_JSON_SCHEMA.md` — field schema (79-field working version)
- `Career_Vault_ROBUST_MVP_391fields_v3.0.xlsx` — full 391-field Career Vault schema

---

## The Core Question

> Should leads be ingested into the full 391-field Career Vault schema, or into a lighter schema designed for leads only?

This question arose when reviewing the Career Vault v3.0 (391 fields across 8 sheets) against the reality that most leads arrive with only a CV — no questionnaire answers, no session notes, no evidence files.

---

## Decision: Staged Ingestion Using One Schema, Two Population Rulesets

**Do not create a separate lighter schema for leads.**

**Use the full 391-field Career Vault schema at all stages, but define two distinct population rulesets that control what gets populated and when.**

---

## The Two Rulesets

### Ruleset A — Lead Intake (Relay-triggered, CV only)

**Trigger:** CV received and accepted for ingestion  
**Automation:** Relay.app → n8n (future)  
**Fields populated:**

| Sheet | Fields populated | Notes |
|---|---|---|
| PERSON_PROFILE | Fields 1–45 (contact through certifications) where extractable | Null where not in CV — that is accurate, not a gap |
| CAREER_DETAIL | Structural role fields only: Role_ID, Person_ID, Employer_Name, Location, Industry, Employment_Type, Title_Official, Title_Market, Department, Start/End Dates, Is_Current | Achievement, scope, and evidence fields left null |
| TARGET_ROLE_PACK | Full 27 fields — mostly inferrable from a decent CV | ~60–70% fill rate expected |
| OUTPUT_LOG | System-generated fields only | Never AI-populated |
| ADMIN_CONSOLE | Intake fields only | |
| COMPETENCIES | Leave null at this stage | |
| EVIDENCE_INVENTORY | Leave null at this stage | |

**Stage flag:** `"intake_stage": "lead"`

---

### Ruleset B — Enriched Profile (post-questionnaire, post-session)

**Trigger:** Client replies to Step 1 questionnaire AND/OR session completed  
**Automation:** Manual → n8n upsert (future)  
**Fields added:**

| Sheet | Fields added | Notes |
|---|---|---|
| CAREER_DETAIL | Achievement fields (Ach_ID through Proof_Strength), Scope fields (Scope_Sites_Count, Scope_Revenue_Budget_Value, etc.) | These require human answers to fill accurately |
| COMPETENCIES | Full 22 fields | Populated from session/skills extraction |
| EVIDENCE_INVENTORY | Full 22 fields | Certificates, references, URLs confirmed |
| PERSON_PROFILE | Pipeline tracking fields (fields 46–82): tier1_status, nudge dates, payment, file paths, match data | System-generated during pipeline progression |

**Stage flag updated to:** `"intake_stage": "tier1_complete"`

**Mechanism:** Upsert into the same record — same Person_ID, same schema. Not a new record.

---

## Why This Wins Over a Lighter Lead Schema

### 1. Surprising lead value is captured, not lost
Some leads mention major accomplishments in their CV — budget figures, team sizes, metrics. A lighter schema that omits scope and achievement fields would permanently discard this data. The full schema with a null simply means "not yet extracted" — which is accurate and recoverable. A missing field in a lightweight schema is gone.

### 2. Lead nurturing can be meaningfully personalised
Even at lead stage, the following PERSON_PROFILE fields can be populated from a CV:
- `primary_sector`, `target_comp_band`, `market_readiness_score`, `estimated_time_to_placement`, `years_experience`, `target_countries`

This is enough to send a fundamentally different Day 5 nudge to a 15-year mining lead targeting AU at $140K vs. a recent graduate targeting NZ entry-level. That logic only works if those fields exist in the Lead JSON.

### 3. Token cost concern is overstated
The AI is not *writing* 391 fields of content at lead stage — it is *extracting* from a CV into fields. Most fields will be null. Null fields are computationally cheap. The expensive fields are the generated ones (summary_short/mid/long, headline_bank, achievement text) — and those are worth the cost because they drive downstream quality.

### 4. One schema = one validation ruleset
If two schemas exist, QA must maintain two validators. With one schema and two population rulesets, validation stays simple: check that all fields present in a Lead JSON are from the approved Lead Ruleset A list. No schema forking, no drift, no future merge problem.

### 5. n8n readiness
When n8n begins handling upserts, it needs to write to a stable target. A single canonical schema means n8n workflows never need to branch on "which schema is this person in." The `intake_stage` flag does that routing work instead.

---

## On the 391-Field Count

The 391 fields are distributed across 8 sheets with very different natures:

| Sheet | Fields | Lead-fillable | Notes |
|---|---|---|---|
| PERSON_PROFILE | 82 | ~40 | Fields 46–82 are system/pipeline-generated, not AI-populated |
| CAREER_DETAIL | 119 | ~40 structural | Achievement + scope fields need questionnaire/session input |
| TARGET_ROLE_PACK | 27 | ~18–20 | Mostly inferrable from CV |
| OUTPUT_LOG | 148 | 0 | Fully system-generated |
| ADMIN_CONSOLE | 36 | Few | Intake fields only |
| COMPETENCIES | 22 | 0 at lead stage | Needs session work |
| EVIDENCE_INVENTORY | 22 | 0 at lead stage | Needs confirmed evidence |
| KEY | Reference | — | Not a data sheet |

**Effective lead-stage fill rate: ~100 fields out of 391.** The rest are either system-generated or legitimately dependent on later pipeline stages.

---

## Open Questions (to resolve before n8n implementation)

1. **Two-variant JSON for profile complexity?** — The question of whether a 391-field JSON is efficient for high-complexity profiles vs. simple profiles remains open. Hypothesis: the staged ingestion model resolves most of this naturally (complex profiles fill more fields; simple profiles have more nulls — same schema, different density). Revisit when first 10 enriched profiles are in the vault.

2. **Relay ingestion format** — Does Relay currently expect a flat JSON or is it sheet-aware? The Career Vault is multi-sheet. Clarify whether the Relay → Career Vault connection expects one flat JSON per person or one JSON object per sheet.

3. **Upsert key** — Confirm that `Person_ID` is the canonical upsert key across all sheets. Currently `person_id` (lowercase) in PERSON_PROFILE and `Person_ID` (capitalised) in other sheets — normalise before automation.

4. **Lite variant trigger** — If a lite variant is eventually built, the trigger condition should be defined explicitly (e.g., "leads with fewer than 5 years experience and no quantified achievements in CV"). Do not build it speculatively.

---

## How This Was Decided

This decision emerged from a working session on 2026-04-12 reviewing the Career Vault v3.0 schema against the current Relay-only pipeline. The framing was:

> *"The problem isn't '391 fields vs lighter' — it's that different fields have different readiness at different pipeline stages. The smarter architecture is two JSON profiles that use the same schema but have different population rules."*

This is consistent with industry patterns documented in `SSOT_COMPLETE_JSON_ARCHITECTURE.md` (Single Source of Truth with derived views) and avoids the schema forking problem that would emerge from maintaining parallel schemas for leads vs. enriched profiles.

---

## Status & Next Actions

| Action | Owner | When |
|---|---|---|
| Confirm Relay ingestion format (flat vs. sheet-aware) | Tate | Before first n8n workflow |
| Normalise Person_ID casing across all sheets | Tate / n8n setup | Before upsert automation |
| Define Ruleset A field list as machine-readable config | Tate + Claude | When building n8n trigger |
| Revisit lite-variant question after 10 enriched profiles | Tate | ~Q3 2026 |
| Update TEFI_Tier1_SYSTEM_MASTER.md to reference this doc | Claude | This session |

---

---

## ⭐ Pipeline Architecture Context — Session Update 2026-04-12

*Captured for recall at next pipeline architecture stage. Read this before designing n8n ingestion workflows.*

### Current automation reality (as of 2026-04-12)

**What is live:**
- Relay.app handles Step 1 (questions email) automatically when a CV is accepted
- Tate reviews incoming CVs manually and decides whether to ingest — this is intentional triage, not a gap

**What is manual (designed but not yet automated):**
- Step 2: CMSnapshot / Tier 1 report generation
- Step 3: Decision email
- JSON generation and Career Vault ingestion
- Nudge sequence (logic defined, not yet triggered automatically)
- Registry update

**What is next:**
- n8n will take over delegation of workflow tasks as pipeline develops
- JSON generation is the critical handoff — once that's automated, downstream reports and lead nurturing follow

### Key architectural decisions confirmed this session

**1. Relay → n8n handoff is the next automation boundary.**
Relay owns Step 1 (questions email). n8n will own JSON generation and Career Vault upsert. The handoff point is: client submits CV → Relay fires questions → n8n generates Lead JSON and upserts into Career Vault. This is the seam to design around.

**2. JSON first, CV second.**
The intended sequence going forward is: JSON file generated first (centralises content, enables token-efficient downstream use), then Tier 1 CV derived from JSON. Not the other way around. This is a departure from the current manual order where the CV upgrade comes before the JSON export.

**3. Two population rulesets, one schema — confirmed.**
Full 391-field Career Vault schema is the target at all stages. Lead Ruleset A (~100 fields fillable from CV) fires at intake. Enriched Ruleset B fires post-questionnaire/session. One schema, one upsert key (Person_ID — normalise casing before automation). See full reasoning above.

**4. Lead nurturing upside is real and worth designing for.**
Even at lead stage, fields like `primary_sector`, `target_comp_band`, `market_readiness_score`, `estimated_time_to_placement`, `years_experience`, `target_countries` can be populated from the CV. This enables personalised nudge logic that goes beyond generic follow-up. Design the Lead JSON generation prompt to prioritise these fields — they drive nurturing quality, not just record-keeping.

**5. The 391-field count is not the token cost concern.**
Most fields at lead stage will be null. Null fields are cheap. The expensive fields are generated ones (summary variants, achievement text) — these are worth the cost because they drive downstream quality. Do not let field count drive schema decisions.

### Open questions before n8n build

| Question | Why it matters |
|---|---|
| Does Relay expect a flat JSON or is it sheet-aware? | Determines whether n8n sends one JSON object or one per sheet |
| Is Person_ID the confirmed upsert key across all 8 sheets? | Must be normalised (case-consistent) before upsert automation |
| What is the trigger for Ruleset B enrichment? | Is it questionnaire reply received? Session completed? Both? |
| Should the lite-variant question be formally closed or kept open? | Keeps the decision log honest — revisit after 10 enriched profiles |

### Pipeline cleanup tasks identified (to complete before n8n build)

1. Mark each pipeline doc as `LIVE` / `DESIGNED-NOT-BUILT` / `IN-PROGRESS`
2. Archive `TEFI_Tier1_Response_Nudge1.md` (old) — `Nudge_Email_Logic.md` is current
3. Create `JSON_Schema/` subfolder in `Tier1/` as stable n8n read target
4. Create `_PIPELINE_STATUS.md` in `TEFI_Tier1_Prompts/` — single source of automation truth
5. Add `AUTOMATION_STATUS.md` to `~Prompts/` root — keeps n8n away from the manual library

---

*JSON_INGESTION_DECISION_LOG.md | Tate's Employment for Immigration | Created 2026-04-12 | Updated 2026-04-12*
