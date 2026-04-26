# JSON_Schema — Stable n8n Read Target
**Status:** Placeholder — ready for population when n8n ingestion is built  
**Created:** 2026-04-12  
**Schema version:** v3.5 (Career_Vault_v3_5.xlsx) — do NOT build rulesets against v3.0 or v3.4

---

## What belongs here

This folder is the **canonical location for all JSON schema files** used by automated ingestion (Relay → n8n → Career Vault). Nothing in this folder should change without a deliberate version decision.

| File | Status | Purpose |
|---|---|---|
| `Ruleset_A_Lead_Intake.md` | TO BUILD | Fields populated from CV at lead stage (~100 of 391) |
| `Ruleset_B_Enriched_Profile.md` | TO BUILD | Fields added post-questionnaire and session |
| `Career_Vault_v3_5.xlsx` | SOURCE (stored in Claude/) | Canonical target schema — v3.5 supersedes v3.0 and v3.4 |

---

## Key decisions (read before building)

Full decision log: `~TEFI/Tier1/JSON_INGESTION_DECISION_LOG.md`

Summary:
- **One schema** (391-field Career Vault) used at all pipeline stages
- **Two population rulesets** — Lead Intake (~100 fields) and Enriched Profile
- **Upsert key:** `Person_ID` — normalise casing before automation
- **Stage flag:** `intake_stage: "lead"` or `intake_stage: "tier1_complete"`
- JSON generated **before** CV upgrade, not after

---

*Do not create parallel or alternative schemas here. All variants are rulesets against the single Career Vault schema.*
