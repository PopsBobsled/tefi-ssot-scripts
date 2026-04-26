# TEFI Relay Workflow Register
**Created:** 2026-04-19  
**Status:** v1 — master build queue  
**Location:** `~TEFI/IP Brain/` — read before any Relay build session

---

## The Core Pattern

Every workflow follows the same structure:

```
Career Vault JSON (always base input)
+ Session notes / prior documents (layered inputs)
→ Relay AI prompt
→ DOCX output filed in client Google Drive folder
```

What changes between workflows: the AI prompt and the output filename.  
The infrastructure is identical across all 25+ workflows.

---

## Design Decisions

- **Host + Client prep docs** come from the same workflow — one trigger produces both files
- **Career Snapshot Card** renamed to **Pitch Card** — it is the business card version of the 30-second elevator pitch, not a visual summary
- **Sessions 1–5** each have a prep workflow (host + client copy combined)
- **Career Vault JSON is always the base** — all other inputs layer on top
- All outputs are DOCX filed in the client's Google Drive folder under their Person_ID

---

## Complete Workflow Register

### Group A — Intake and Lead Pipeline

| # | Workflow Name | Trigger | Input | Output | Status |
|---|---|---|---|---|---|
| A1 | CV Intake → Career Vault JSON | File dropped in 1_Intake_Queue | CV file (PDF/DOCX) | Career Vault JSON v3.5 → 2_JSON_Ready | ✅ Done (Relay) |
| A2 | JSON → CM Report | File in 2_JSON_Ready | Career Vault JSON | CM Report DOCX → 4_Review_QC | 🔄 Build next |
| A3 | QC Pass → Gmail Draft | File moved to 3a_QC_Pass | CM Report DOCX | Gmail draft to candidate | ⏳ After A2 |
| A4 | QC Return → Encouragement | File moved to 3b_QC_Return | Intake docs | Encouragement Gmail draft | ⏳ After A3 |
| A5 | Career Migration Report Generator | Manual / JSON ready | Career Vault JSON | Career Migration Report DOCX + Gmail draft | ✅ Done (manual prompt) |

### Group B — Session Preparation (all tiers)

| # | Workflow Name | Trigger | Input | Output | Status |
|---|---|---|---|---|---|
| B1 | Session 1 Prep | Manual trigger / JSON confirmed | Career Vault JSON | Session 1 Prep DOCX (host section + client section in one doc) | ⏳ Build |
| B2 | Session 2 Prep | Session 1 notes filed | JSON + Session 1 notes + prior docs | Session 2 Prep DOCX (host + client) | ⏳ Build |
| B3 | Session 3 Prep | Session 2 notes filed | JSON + all prior docs | Session 3 Prep DOCX (host + client) | ⏳ Build |
| B4 | Session 4 Prep | Session 3 notes filed | JSON + all prior docs | Session 4 Prep DOCX (host + client) | ⏳ Build |
| B5 | Session 5 Prep | Session 4 notes filed | JSON + all prior docs | Session 5 Prep DOCX (host + client) | ⏳ Build |

### Group C — Core Document Deliverables

| # | Workflow Name | Trigger | Input | Output | Tier | Status |
|---|---|---|---|---|---|---|
| C1 | CV Upgrade | Manual / JSON confirmed | Career Vault JSON + original CV | Upgraded CV DOCX | T1+ | ✅ Done (Relay) |
| C2 | Skills, Achievements and Metrics Report | Session 1 notes filed | JSON + Session 1 notes | SAM Report DOCX | T2+ | ⏳ Build |
| C3 | Career Impact Report | SAM Report filed | JSON + SAM Report | Career Impact Report DOCX | T2+ | ⏳ Build |
| C4 | Job Interview Notes | Session 2 notes filed | JSON + Session 2 notes | Interview Notes DOCX | T2+ | ⏳ Build |
| C5 | Photo Portfolio | Photos + session notes | JSON + photos/captions | Photo Portfolio PDF | T2+/T3b | ⏳ Build |
| C6 | Premium CV Plus | Full JSON + all session notes | Career Vault JSON (full) + notes | Premium CV DOCX | T3+ | ⏳ Build |
| C7 | Cover Letter Wizard | Target role provided | JSON + target role/job ad | Cover Letter DOCX template | T2+ | ⏳ Build |
| C8 | LinkedIn Strategy | JSON confirmed | Career Vault JSON | LinkedIn Strategy DOCX | T2+ | ⏳ Build |
| C9 | Pitch Card | Session 1 notes filed | JSON + Session 1 notes | Pitch Card DOCX (business card elevator pitch) | T3b | ⏳ Build |
| C10 | Video CV Script and Structure | Session notes filed | JSON + session notes | Video CV Brief DOCX | T3b | ⏳ Build |
| C11 | Elevator Pitch (30-second) | Session notes filed | JSON + session notes | Pitch Script DOCX | T3b | ⏳ Build |
| C12 | Labour Market Prospects Report | JSON + target country | Career Vault JSON | Market Intelligence Report DOCX | T3a | ⏳ Build |
| C13 | Job Target Segmentation Report | JSON + sector confirmed | Career Vault JSON + sector | Employer Targets DOCX | T3a/T3c | ⏳ Build |
| C14 | Written Job Search Strategy | All prior docs ready | JSON + all session outputs | Weekly Action Plan DOCX | T3c/T4 | ⏳ Build |

### Group D — Client Communication Automation

| # | Workflow Name | Trigger | Input | Output | Status |
|---|---|---|---|---|---|
| D1 | Stripe Payment → Zoho + Welcome | Stripe webhook | Payment data | Zoho contact upserted + Gmail welcome draft | ✅ Done (n8n) |
| D2 | Referral received → Thank-you draft | Gmail label applied | Referral email thread | Gmail thank-you draft to referee | ⏳ Build |
| D3 | Career Migration Report sent → 14-day follow-up | Label: CM Report Sent | Candidate profile | Follow-up Gmail draft if no reply | ⏳ Build |
| D4 | Testimonial received → Social format | Testimonial email/file | Raw testimonial text | Formatted testimonial + social caption | ⏳ Build |

### Group E — Admin and Maintenance

| # | Workflow Name | Trigger | Input | Output | Status |
|---|---|---|---|---|---|
| E1 | Monthly Google Drive cleanup report | 1st of month | Drive file list | Cleanup triage report (duplicates, stale files) | ⏳ Build |
| E2 | Weekly pipeline status briefing | Monday 7am | Zoho pipeline data | Morning briefing summary | ⏳ Build (n8n Priority 5) |
| E3 | Weekly testimonial pull | Monday 7:30am | Gmail label: Track to Testimony | Testimonial status digest | ✅ Scheduled |

---

## A2 Testing Protocol — Benchmark Completeness

When testing A2 outputs, always score the following:

| Test | What to check | Pass condition |
|---|---|---|
| Field completeness | How many JSON fields were null at time of generation | Log null count per section; flag if >20% null in CAREER_DETAIL |
| Output quality | Does the CM Report read at the standard of a manually produced Janup-level output? | QC reviewer (Tate) rates 1–10; target ≥8 |
| Section coverage | Are all 6 CM Report sections fully generated with no "To strengthen" placeholders? | Zero placeholders = pass; each placeholder traces to a specific null field |
| Metric accuracy | Do all metrics in the output trace directly to JSON achievement records? | No invented numbers; every figure has an Ach_ID source |
| Salary calibration | Are salary bands formatted exactly per TEFI_Tier1_00_Shared_Standards.md? | Format match = pass |
| Em-dash compliance | Zero em-dashes in flowing sentences | Automated string check + human review |

**Key insight (2026-04-20):** JSON completeness directly determines output quality. Gaps in the output trace to gaps in the JSON — which traces to gaps in the intake prompt. A2 benchmark results will identify where the intake workflow (A1) needs tightening.

---

## Build Priority Queue

| Priority | Workflow | Reason |
|---|---|---|
| 1 | A2 — JSON → CM Report | Core value engine. Replaces manual prompt work immediately. |
| 2 | A3 — QC Pass → Gmail Draft | Extends A2 directly. Completes the send loop. |
| 3 | A4 — QC Return → Encouragement | Same trigger logic as A3. Quick to add. |
| 4 | B1 — Session 1 Prep | Saves 20–30 min per session. High frequency. |
| 5 | C2 — SAM Report | Core T2+ deliverable. Feeds C3. |
| 6 | C3 — Career Impact Report | Feeds from C2. Already have prompt pattern. |
| 7 | C4 — Job Interview Notes | High frequency in active client work. |
| 8 | B2–B5 — Session Preps | Same template, replicate × 4. |
| 9 | C6 — Premium CV Plus | Builds on C1 pattern already proven. |
| 10 | C12 — Labour Market Prospects | T3a differentiator. Requires research prompt. |
| 11+ | All remaining C, D, E workflows | Build as tiers are sold and demand arises. |

---

## What This System Achieves

When complete, Tate's role becomes:
1. Drop files into the right Google Drive folder
2. Review AI outputs at Human Control Points
3. Approve → move to next folder → next workflow fires
4. Send reviewed outputs to candidate

**Time saved per client:** Estimated 3–5 hours of prompt management per T4 client  
**Capacity increase:** From ~5 concurrent clients to 15–20+ with same working hours  
**Quality consistency:** Every deliverable follows the same prompt, every time — no variability

---

## White Label Potential

See: `~TEFI/IP Brain/TEFI_WhiteLabel_Strategy.md` (to be created)

The workflow system is the product. When all workflows are built, the service becomes:
- Licensable to immigration agencies
- Packageable per deliverable (not just per tier)
- Operable by non-Tate staff with minimal training
- Scalable without proportional time cost
