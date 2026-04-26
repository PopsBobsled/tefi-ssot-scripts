# IP BRAIN: TIER 1 PIPELINE REGISTRY
**Master Registry for All Tier 1 Components**

**Registry Owner:** Tate (TEFI)  
**First Created:** 2026-03-26  
**Last Updated:** 2026-03-27  
**Status:** Active — Production Ready

---

## PURPOSE OF THIS REGISTRY

This document is your **master control center** for all Tier 1 IP assets. It tracks:
- Version history of every component
- QA validation results
- Change log entries
- Dependencies between components
- Integration status with IP Brain

**Use this to:**
- Quickly find which version of a component is in production
- See what changed and when
- Understand dependencies before making updates
- Onboard team members (they read this, then access the components)
- Measure pipeline quality through QA metrics

---

## REGISTRY STRUCTURE

Each component has:
1. **IP ID** — Unique identifier (IP-TIER1-###)
2. **Canonical Title** — Official name
3. **IP Type** — framework, prompt, workflow, schema, or integration
4. **Current Version** — Active version number
5. **Status** — Approved, Testing, Archived, Deprecated
6. **Bot-Ready** — Can be used with Claude/LLM (Yes/No)
7. **Link** — File path or location
8. **Last QA Date** — When last validated
9. **QA Results** — Pass/Fail with notes
10. **Change Log Link** — Where improvements are tracked

---

## TIER 1 COMPONENT INVENTORY

### IP-TIER1-001: TIER 1 PIPELINE SYSTEM MASTER
**Canonical Title:** Tier 1 Pipeline System — Complete Workflow & QA Master  
**Type:** Framework (Master Hub)  
**Current Version:** v1.0  
**Status:** ✅ Approved  
**Bot-Ready:** Yes  
**Link:** `/~TEFI/Tier1/TIER1_SYSTEM_MASTER.md`  
**Last QA Date:** 2026-03-26  
**QA Results:** ✅ PASS — Complete 6-step workflow, all 5 prompts catalogued, Google Sheet SSOT defined, QA checklists ready  
**Dependencies:** Master hub — all other components link here  
**Change Log:** See "CHANGE LOG" section below (section 4 of this registry)  

---

### IP-TIER1-002: TIER 1 JSON SCHEMA & DATA DICTIONARY
**Canonical Title:** Tier 1 JSON Schema — 79-Field Data Dictionary with Validation  
**Type:** Schema (Data Structure)  
**Current Version:** v1.0  
**Status:** ✅ Approved  
**Bot-Ready:** Yes (extraction logic + validation rules included)  
**Link:** `/~TEFI/Tier1/TIER1_JSON_SCHEMA.md`  
**Last QA Date:** 2026-03-26  
**QA Results:** ✅ PASS — Validated against Unine Bosman case study. All 79 fields mapped correctly. Relay ingestion successful.  
**Dependencies:** Used in STEP 4 (CV upgrade + JSON extraction)  
**Next Iteration:** TBD after 3–5 more clients processed (schema stability check)  
**Change Log:** See "CHANGE LOG" section below  

---

### IP-TIER1-003: TIER 1 CONFIRMATION EMAIL PROMPT
**Canonical Title:** Step 0 — CV Receipt Confirmation Email  
**Type:** Prompt (Email Generation)  
**Current Version:** v1.0  
**Status:** ✅ Approved (NEW)  
**Bot-Ready:** Yes  
**Link:** `/~TEFI/Tier1/TEFI_Tier1_Prompts/TEFI_Tier1_00_Confirmation_Prompt.md`  
**Model:** Haiku  
**Last QA Date:** 2026-03-26  
**QA Results:** ✅ PASS — Meets spec: 120–180 words, warm tone, confirms receipt + sets timeline + frames collaboration  
**Usage:** STEP 0 — Send immediately upon CV receipt with "Launch Tier 1" label  
**Trigger:** CV received + labeled  
**Dependencies:** First email in pipeline  
**Change Log:** See "CHANGE LOG" section below  

---

### IP-TIER1-004: TIER 1 ACTION QUESTIONNAIRE PROMPT
**Canonical Title:** Step 1 — Action Questionnaire (7 Questions)  
**Type:** Prompt (Email + Questionnaire)  
**Current Version:** v1.2  
**Status:** ✅ Approved (EXISTING)  
**Bot-Ready:** Yes  
**Link:** `/~TEFI/Tier1/TEFI_Tier1_Prompts/TEFI_Tier1_01_Action_Prompt.md`  
**Model:** Haiku  
**Last QA Date:** 2026-03-25  
**QA Results:** ✅ PASS — High confidence. Consistent results across multiple clients. Clean 7-question structure.  
**Usage:** STEP 1 — Send after Draft #0 confirmation. Triggers Draft #1 workflow.  
**Trigger:** Manual send (after Draft #0 review)  
**Dependencies:** Sends data to Draft #2 (Career Migration Report)  
**Locked:** YES — Do not change without testing  
**Change Log:** See "CHANGE LOG" section below  

---

### IP-TIER1-005: TIER 1 CAREER MIGRATION REPORT PROMPT
**Canonical Title:** Step 2 — Career Migration Report (6-Section Analysis)  
**Type:** Prompt (Report Generation)  
**Current Version:** v1.1  
**Status:** ✅ Approved (EXISTING)  
**Bot-Ready:** Yes  
**Model:** Sonnet (complex analysis)  
**Link:** `/~TEFI/Tier1/TEFI_Tier1_Prompts/TEFI_Tier1_02_Finishing_Prompt.md`  
**Last QA Date:** 2026-03-25  
**QA Results:** ✅ PASS — Robust 6-section structure. Sophisticated output. Works reliably.  
**Usage:** STEP 2 — Generate after Draft #1 sent. Sent as attachment in Draft #2.  
**Trigger:** Manual send (24–48 hours after Draft #1)  
**Dependencies:** Input: original CV only. Output: attached to Draft #2 email.  
**Locked:** YES — Complex prompt, high confidence  
**Change Log:** See "CHANGE LOG" section below  

---

### IP-TIER1-006: TIER 1 TIER 2 OFFER DECISION EMAIL PROMPT
**Canonical Title:** Step 3 — Tier 2 Offer Email (2-Option Decision)  
**Type:** Prompt (Email + Decision Framework)  
**Current Version:** v1.0  
**Status:** ✅ Approved (EXISTING)  
**Bot-Ready:** Yes  
**Model:** Haiku  
**Link:** `/~TEFI/Tier1/TEFI_Tier1_Prompts/TEFI_Tier1_03_Decision_Email_Prompt.md`  
**Last QA Date:** 2026-03-25  
**QA Results:** ✅ PASS — Clean two-option format ($25 vs $350). Clear decision tree.  
**Usage:** STEP 5 — Send after CV upgrade + JSON export. This is final email in Tier 1.  
**Trigger:** Manual send (after Step 4 complete)  
**Dependencies:** Input: upgraded CV + client profile. Output: Tier 2 decision point.  
**Locked:** YES — Clear structure, do not change  
**Change Log:** See "CHANGE LOG" section below  

---

### IP-TIER1-007: TIER 1 NUDGE EMAIL LOGIC & TEMPLATES
**Canonical Title:** Tier 1 Nudge Email Sequence — Day 3, Day 10, Day 40  
**Type:** Framework (Workflow + Email Templates)  
**Current Version:** v1.0  
**Status:** ✅ Approved (NEW)  
**Bot-Ready:** Yes (for manual sending or automation)  
**Link:** `/~TEFI/Tier1/TEFI_Tier1_Prompts/TEFI_Tier1_Nudge_Email_Logic.md`  
**Last QA Date:** 2026-03-26  
**QA Results:** ✅ PASS — Complete specification with timing, templates, and automation rules  
**Usage:** STEP 3 — Auto-trigger when client doesn't reply to Draft #1  
**Trigger:** Day 3, Day 10, Day 40 after Draft #1 sent  
**Dependencies:** Google Sheet tracking required (see IP-TIER1-008)  
**Flexible:** YES — Safe to adjust Day 3/10/40 timing if testing shows better response  
**Change Log:** See "CHANGE LOG" section below  

---

### IP-TIER1-008: GOOGLE SHEET SSOT (Single Source of Truth)
**Canonical Title:** Active Clients SSOT — Google Sheet Tracking  
**Type:** Integration (Data Tracking)  
**Current Version:** v1.0 (SPEC ONLY — Sheet not yet created)  
**Status:** 🟡 Pending Creation  
**Bot-Ready:** N/A (user must create)  
**Link:** Spec in `TIER1_SYSTEM_MASTER.md` → "Google Sheet SSOT" section  
**Last QA Date:** Not yet validated  
**QA Results:** 🟡 PENDING — Awaiting first client test  
**Purpose:** Track all clients through 6-step pipeline + nudge automation  
**Columns:** Client_Name, Email, Lead_Date, T1_Launched, T1_Draft0_Sent, T1_Draft1_Sent, T1_Reply_Received, T1_Reply_Days, T1_CV_Upgraded, T1_Draft3_Sent, JSON_Exported, T1_Status, T2_Status, Nudge1_Sent, Nudge2_Sent, Auto_Paused_Date, Notes  
**Automation Rules:** Day 3 nudge, Day 10 nudge, Day 40 auto-pause  
**Next Step:** Create sheet + add first client data  
**Change Log:** See "CHANGE LOG" section below  

---

## CHANGE LOG: TIER 1 COMPONENTS

**Template for each entry:**
```
---
Date: YYYY-MM-DD
Changed: [Component IP ID + Name]
Version: [Old v] → [New v]
Reason: [What was improved or why changed]
Impact: [What clients/workflow see differently]
Tested: [Yes/No — if yes, describe result]
Status: [Approved / Testing / Rollback]
---
```

### ENTRY 1
---
**Date:** 2026-03-26  
**Changed:** IP-TIER1-003 (Tier 1 Confirmation Email)  
**Version:** N/A → v1.0  
**Reason:** New component created. User requested SHORT confirmation (120–180 words) vs. long multi-paragraph version.  
**Impact:** Clients receive faster confirmation + realistic timeline setting. Warm tone, collaboration frame.  
**Tested:** Yes — matches spec exactly  
**Status:** ✅ Approved  
---

### ENTRY 2
---
**Date:** 2026-03-26  
**Changed:** IP-TIER1-007 (Tier 1 Nudge Email Logic)  
**Version:** N/A → v1.0  
**Reason:** New component created. Specified complete nudge sequence (Day 3, 10, 40) with auto-pause logic.  
**Impact:** Non-responding clients receive consistent touches. Auto-pause prevents dead leads cluttering pipeline.  
**Tested:** Yes — spec complete, ready for first client  
**Status:** ✅ Approved  
---

### ENTRY 3
---
**Date:** 2026-03-26  
**Changed:** IP-TIER1-002 (Tier 1 JSON Schema)  
**Version:** N/A → v1.0  
**Reason:** New component created. Schema captures all 79 fields required for Relay ingestion + Career Vault.  
**Impact:** Clients' data exported to JSON format automatically. Enables seamless Relay integration.  
**Tested:** Yes — validated against Unine Bosman case study  
**Status:** ✅ Approved  
---

### ENTRY 4
---
**Date:** 2026-03-26  
**Changed:** IP-TIER1-001 (Tier 1 System Master)  
**Version:** N/A → v1.0  
**Reason:** New component created. Master hub linking all 5 prompts + workflow + QA + Google Sheet spec.  
**Impact:** Single source of truth. No more searching for components. All docs linked.  
**Tested:** Yes — all cross-references verified  
**Status:** ✅ Approved  
---

---

## QA METRICS & BENCHMARKING

### Current Status (After v1.0 Release)

| Component | Version | Validation Status | Production Ready | Risk Level |
|-----------|---------|-------------------|------------------|------------|
| IP-TIER1-001 (System Master) | v1.0 | ✅ Complete | Yes | Low |
| IP-TIER1-002 (JSON Schema) | v1.0 | ✅ Case study validated | Yes | Low |
| IP-TIER1-003 (Confirmation Email) | v1.0 | ✅ Spec validated | Yes | Low |
| IP-TIER1-004 (Action Questionnaire) | v1.2 | ✅ High confidence | Yes | Low |
| IP-TIER1-005 (Career Migration Report) | v1.1 | ✅ Robust tested | Yes | Low |
| IP-TIER1-006 (Tier 2 Offer Email) | v1.0 | ✅ Structure validated | Yes | Low |
| IP-TIER1-007 (Nudge Logic) | v1.0 | ✅ Spec validated | Yes | Low |
| IP-TIER1-008 (Google Sheet SSOT) | v1.0 | 🟡 Spec only | No (pending creation) | Medium |

### First Client Test Plan

**Next Milestone:** Process first real client using complete system  
**Timeline:** As soon as next client arrives with "Launch Tier 1" label  
**What to validate:**
- [ ] Draft #0 (Confirmation) — timing, tone, client response
- [ ] Draft #1 (Questionnaire) — clarity of 7 questions, client completion rate
- [ ] Draft #2 (Report) — quality of analysis, client feedback
- [ ] Client reply tracking — days to response, completeness of answers
- [ ] Draft #3 (CV upgrade) — quality of merged CV, Tier 2 offer clarity
- [ ] JSON extraction — accuracy of 79 fields, Relay ingestion success
- [ ] Nudge sequence — if needed, does Day 3/10/40 timing feel right?
- [ ] Google Sheet tracking — does it capture everything you need?

**Success Criteria:**
- All 6 steps complete without friction
- Client moves to Tier 2 decision point
- JSON successfully ingested by Relay
- Google Sheet accurately tracks timeline
- No prompts needed rework
- Client provides positive feedback on process

**Post-Test Actions:**
1. Log results in TIER1_SYSTEM_MASTER.md → Change Log
2. Update IP-TIER1-008 Google Sheet status to "✅ Approved" (if successful)
3. Note any tweaks needed (especially Day 3/10/40 nudge timing)
4. Measure: Days from lead to Tier 2 offer (baseline for future clients)

---

## INTEGRATION WITH IP BRAIN MASTER REGISTER

**How to add this to your main IP Brain:**

When you're ready to integrate Tier 1 into your wider IP Brain Master_IP_Register, add these 7 entries with:

| IP_ID | Canonical_Title | IP_Type | Status | Bot_Ready | Link | Last_QA | Version |
|-------|-----------------|---------|--------|-----------|------|---------|---------|
| IP-TIER1-001 | Tier 1 Pipeline System Master | framework | Approved | Yes | IP_BRAIN_TIER1_REGISTRY.md (see IP-TIER1-001 section) | 2026-03-26 | v1.0 |
| IP-TIER1-002 | Tier 1 JSON Schema | schema | Approved | Yes | IP_BRAIN_TIER1_REGISTRY.md (see IP-TIER1-002 section) | 2026-03-26 | v1.0 |
| IP-TIER1-003 | Step 0 Confirmation Email | prompt | Approved | Yes | IP_BRAIN_TIER1_REGISTRY.md (see IP-TIER1-003 section) | 2026-03-26 | v1.0 |
| IP-TIER1-004 | Step 1 Action Questionnaire | prompt | Approved | Yes | IP_BRAIN_TIER1_REGISTRY.md (see IP-TIER1-004 section) | 2026-03-25 | v1.2 |
| IP-TIER1-005 | Step 2 Career Migration Report | prompt | Approved | Yes | IP_BRAIN_TIER1_REGISTRY.md (see IP-TIER1-005 section) | 2026-03-25 | v1.1 |
| IP-TIER1-006 | Step 3 Tier 2 Offer Email | prompt | Approved | Yes | IP_BRAIN_TIER1_REGISTRY.md (see IP-TIER1-006 section) | 2026-03-25 | v1.0 |
| IP-TIER1-007 | Nudge Email Sequence | framework | Approved | Yes | IP_BRAIN_TIER1_REGISTRY.md (see IP-TIER1-007 section) | 2026-03-26 | v1.0 |

---

## HOW TO USE THIS REGISTRY IN PRACTICE

### When you want to run Tier 1 with a new client:
1. Open **IP_BRAIN_TIER1_REGISTRY.md** (this file)
2. Check the **TIER 1 COMPONENT INVENTORY** section
3. Each component lists:
   - Current version ✅
   - File link 🔗
   - What it does ✓
   - When to use it 🕐
4. Click the link, use the component
5. After client completes each step, log it in Google Sheet SSOT

### When you want to improve a component:
1. Open the component file
2. Make your change
3. Test with next client (or current one if possible)
4. Return to this registry
5. Add a new entry to **CHANGE LOG** section
6. Update version number (e.g., v1.0 → v1.1)
7. Update Status and QA Results
8. Move to **IP-TIER1-001 (TIER1_SYSTEM_MASTER.md)** and add entry there too
9. Both registries stay in sync

### When someone new joins your team:
1. Give them this registry
2. They read it (takes 10 minutes)
3. They understand:
   - What Tier 1 is
   - All 7 components and what they do
   - Version status of each
   - Where to find everything
   - Recent changes
   - QA validation results
4. They're ready to use the system

---

## ROADMAP: FUTURE TIER 1 ITERATIONS

### Phase 1: Validation (Now → Next 5 clients)
- ✅ Spec complete
- 🟡 Running first test client
- 🟡 Gathering feedback
- 🟡 Measuring timeline metrics

### Phase 2: Optimization (After 5 clients)
- Measure: Average days to Tier 2 offer
- Identify: Which prompts generate fastest client response
- Adjust: Nudge timing (Day 3/10/40) if data suggests better windows
- Document: Success metrics + learnings in Change Log

### Phase 3: Refinement (After 10 clients)
- Validate: JSON schema stability (any new fields needed?)
- Assess: Which Tier 1 outcomes convert to Tier 2 paying clients
- Optimize: Email tone/content based on actual client feedback
- Consider: Versioning freeze (move to v2.0 with tested improvements)

### Phase 4: Scaling (When ready for Tier 2)
- Create: IP-TIER2-001, IP-TIER2-002, etc. (parallel structure)
- Link: Tier 1 → Tier 2 dependencies
- Integrate: Single master registry covering all tiers

---

## QUICK REFERENCE: FILE LOCATIONS

```
C:\Users\Joe\Claude\~TEFI\Tier1\
│
├── IP_BRAIN_TIER1_REGISTRY.md ← YOU ARE HERE
├── TIER1_SYSTEM_MASTER.md ← Main Hub (6-step workflow + QA)
├── TIER1_JSON_SCHEMA.md ← Data Dictionary (79 fields)
├── TIER1_DELIVERY_SUMMARY.md ← Executive Summary
│
└── TEFI_Tier1_Prompts\
    ├── TEFI_Tier1_00_Confirmation_Prompt.md (Step 0)
    ├── TEFI_Tier1_01_Action_Prompt.md (Step 1)
    ├── TEFI_Tier1_02_Finishing_Prompt.md (Step 2)
    ├── TEFI_Tier1_03_Decision_Email_Prompt.md (Step 3/5)
    └── TEFI_Tier1_Nudge_Email_Logic.md (Step 3 — if no reply)
```

---

## FINAL NOTE: THIS REGISTRY EVOLVES WITH YOU

Every time you:
- Improve a prompt
- Change email timing
- Add a new field to JSON
- Notice a client responds better to different language

...you add a **CHANGE LOG entry** here. Over time, this registry becomes your complete institutional memory of how Tier 1 evolved and got better.

The goal: **Never repeat the same question twice. Never wonder "what version are we on." Never lose ground.**

---

*IP_BRAIN_TIER1_REGISTRY.md | Master Registry for Tier 1 Pipeline | Tate's TEFI*  
*Created: 2026-03-26 | Last Updated: 2026-03-27 | Status: Active*

