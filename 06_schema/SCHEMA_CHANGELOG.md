# Career Vault Schema Changelog

Every structural change to the Career Vault JSON schema or its derived scoring systems is logged here. Each entry is a "level up" -- a permanent record of what changed, why, and what version it produced.

This file is the single source of truth for schema evolution. Read it before proposing any schema change to confirm you are building on the current state.

---

## v4.0 -- Career Vault JSON Schema (baseline)

**Date:** 2026-04 (exact date predates changelog)
**Type:** Schema definition
**What changed:** Career Vault v4 JSON schema established as the universal candidate data format. Two top-level objects: `person_profile` (identity, qualifications, registrations) and `career_detail` (roles, achievements, evidence, certifications). Vault Levels L1-L6 defined for sequential enrichment.
**Why:** Replaced ad-hoc candidate data formats. Single schema consumed by Relay, n8n, CM Report generator, and Cowork.
**Files:** `TEFI_JSON_v4_Template.json`

---

## v4.0-scoring-1.0 -- Profile Scoring Spec

**Date:** 2026-06-07
**Type:** Derived system (scoring layer on top of v4 schema)
**What changed:** 7-factor scoring system defined to derive a Profile_Score from Career Vault JSON data. Factors: QL (Qualification Level, 1-5), ED (Experience Depth, 1-5), CP (Career Progression, 1-5), RS (Registration Strength, 1-5), IM (International Mobility, 1-5), CD (Certification Density, 1-3), EQ (Evidence Quality, 1-5). Aggregate range 7-33, banded A/B/C. Compact code format for Zoho `Profile_Score` field (Single Line text).
**Why:** Enable automated candidate quality routing (Band A to 1-on-1, Band B/C to Masterclass) after CM Report delivery. Benchmarked against NZ SMC, AU 189, ATS platforms, HR tier-grading. No gaps.
**Design decisions:** Age excluded (not relevant to service value). CD capped at 3. Score derived not stored in JSON. Single text field in Zoho.
**Files:** `Profile_Scoring_Spec_v1.0.md`

---

## Template for future entries

```
## v<version> -- <Short title>

**Date:** YYYY-MM-DD
**Type:** Schema change / Derived system / Field addition / Breaking change
**What changed:** <What specifically changed in the schema or derived system>
**Why:** <Business reason or technical requirement>
**Migration:** <What existing data or systems need updating, if any>
**Files:** <New or modified files>
```
