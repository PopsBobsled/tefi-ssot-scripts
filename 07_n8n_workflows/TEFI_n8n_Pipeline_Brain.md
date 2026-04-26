# TEFI n8n Pipeline Brain
**Created:** 2026-04-21 | **Owner:** Tate Ulsaker  
**Purpose:** Living reference for all n8n automation decisions, architecture, connector findings, and workflow build status. Updated at the end of every session that touches automation.

---

## Core Architecture Principle

> **Cowork (Haiku/Sonnet) reads and drafts. n8n writes and sends.**

This is not a preference — it is a hard constraint confirmed 2026-04-21:

- Gmail MCP connector is read-only. `label_thread` is not exposed. `create_label` is blocked by Google OAuth app verification (unverified app cannot get `gmail.modify` scope).
- n8n has verified Gmail OAuth with `gmail.modify` scope. All label writes, email sends, and registry updates must route through n8n.
- Cowork role: search threads, read content, classify state, create drafts for Tate review. Nothing else.

---

## Connector Status (confirmed 2026-04-21)

| Connector | Can Do | Cannot Do |
|---|---|---|
| Gmail MCP (Cowork) | search_threads, get_thread, list_labels, create_draft | label_thread, unlabel_thread, send_email, write to Sheets |
| n8n Gmail node | Everything — read, label, send, modify | Nothing blocked — full scope |
| n8n Google Sheets node | Read + write to any sheet | — |
| n8n Zoho node | Create/update contacts, write fields | — |
| Make/Integromat | Not used — Access denied error | Not applicable |

---

## The 7-Phase Automation Roadmap

Designed by Opus 2026-04-21. Do not skip phases — each is a dependency for the next.

### Phase 1 — Manual labelling + registry sync ⏳ In progress
**What:** Create pipeline labels in Gmail, apply manually, mirror in registry col AR.  
**Status:** 4 labels created 2026-04-21. 2-week backfill pending.  
**Ready for Phase 2 when:**
- Every live lead has exactly one pipeline label
- Registry col AR matches Gmail label for 100% of leads
- 5 consecutive workdays without relabelling a thread twice

### Phase 2 — n8n read-only reply detector 🔲 Next build
**What:** n8n polls Gmail every 15 min. Finds inbound replies to `CV Upgrade T1 Sent` threads. Appends to `Inbox_Candidates` tab in Leads Registry. No labels applied, no emails sent.  
**Why read-only first:** Proves detection works in isolation. Zero blast radius if it fails.  
**Success criteria (7 days clean):**
- Replies detected within 15 min of arrival
- Zero false positives (non-reply flagged as reply)
- Zero false negatives (real reply missed) — spot-check Gmail inbox daily
- Dedup works — already-handled threads do not reappear

**Workflow spec:**
```
Trigger: Cron — every 15 minutes
Node 1: Gmail Search — query: label:TEFI/Leads/Pipeline/CV Upgrade T1 Sent newer_than:3d
Node 2: For each thread — check if latest message sender ≠ tate@employmentforimmigration.nz
Node 3: Check Inbox_Candidates tab — if thread ID already exists, skip
Node 4: If new inbound reply — append row to Inbox_Candidates tab
         Columns: Thread ID | Lead Name | Email | Reply Date | Subject | Action Required
Node 5: No labels. No emails. No drafts.
```

**`Inbox_Candidates` tab columns:**
| Thread ID | Full Name | Email | Reply Received Date | Subject | Action Required | Processed by Tate (Y/N) |

**Date-gate important:** Add filter — only act on threads with messages after 2026-04-21. Prevents backfill labels from triggering the workflow.

**Ready for Phase 3 when:** 14 consecutive days clean per success criteria above.

### Phase 3 — n8n applies labels 🔲 Pending Phase 2
**What:** Same workflow as Phase 2, but now n8n applies `Questions Received` label to detected threads. Still does not send anything. Tate reviews label, sends T-S1 manually from a draft n8n creates.  
**Ready for Phase 4 when:** n8n-applied labels match Tate's judgement on 30 consecutive threads. No manual un-labelling for 14 days.

### Phase 4 — n8n auto-sends T-S1 only 🔲 Pending Phase 3
**What:** `Questions Received` label triggers automatic T-S1 send.  
**Hard guardrails:**
- Check `Do Not Auto-Send` column (col AW) — if TRUE, skip
- Max 10 auto-sends per day
- Dry-run mode for first week (log what would send, don't actually send)
- T-S1 is the ONLY template that ever auto-sends — all others remain drafts

**Ready for Phase 5 when:** 20 consecutive correct T-S1 sends. Zero sends to Do Not Auto-Send leads. Reply rate within 10% of manual baseline.

### Phase 5 — Nudges automated (T-S0c, T-S1b) 🔲 Pending Phase 4
**What:** Time-based triggers from registry cols AX/AY (Next Action Date). T-S0c fires at day 7 no reply. T-S1b fires at day 3 no meeting booking.  
**Ready for Phase 6 when:** 30 days stable, zero duplicate nudges.

### Phase 6 — Zoho sync 🔲 May 2026
**What:** Gmail label changes push to Zoho deal stage field. One-way only: Gmail → Zoho.  
**Note:** Never reverse sync until Phase 7. Two-way sync before the system is stable = data corruption.  
**Ready for Phase 7 when:** 90 days of sync without manual reconciliation.

### Phase 7 — Career Vault + 3 Pillar Brain 🔲 Q3 2026
**What:** CV intake → 391-field JSON → Zoho + Drive + Relay workflows. Full pipeline automation.  
**Dependency:** Phases 1-5 must have 90 days of clean operation. Ruleset A must be written.

---

## Registry Requirements for n8n

The Leads Registry (Drive ID: `1abylcyfcNeJJEb67AORf8MtsO8IN5F8l-7w3l-kbMk4`) needs these columns before n8n writes anything:

| Column | Name | Values | Purpose | Status |
|---|---|---|---|---|
| AR | Gmail Label | Full label path verbatim | Human mirror + n8n read | Exists — needs populating |
| AS | Last Email Thread ID | Gmail thread ID string | n8n thread linking | Exists — needs populating |
| AT | Stage Code | e.g. T1.Q.2, T1.M.1 | Machine-readable state — n8n filters on this, not label string | **Not yet added** |
| AU | Last State Change | ISO 8601 date | Days-since calculations for nudges | **Not yet added** |
| AV | Last Action By | manual / haiku / n8n / sonnet | Audit trail | **Not yet added** |
| AW | Do Not Auto-Send | TRUE / FALSE | Kill-switch per lead — n8n checks before every send | **Not yet added** |
| AX | Next Scheduled Action | e.g. Send T-S0c, Send T-S1b | Morning briefing + n8n trigger | **Not yet added** |
| AY | Next Action Date | ISO 8601 date | n8n date-based trigger | **Not yet added** |

**Critical before any n8n write:** Normalise Person_ID casing in registry. Inconsistent casing = duplicate rows on upsert. 30-minute fix.

**Stage Code rule:** n8n always filters on col AT (Stage Code), never on the label string in col AR. This means you can rename labels freely in Gmail without breaking workflows. Never rename stage codes.

---

## Gmail Label Registry

Labels that exist today with their IDs:

| Stage Code | Label Name | Gmail ID |
|---|---|---|
| T1.L.1 | TEFI/Leads/Pipeline/LeadMagnet Offer | Label_26 |
| T1.L.2 | TEFI/Leads/Pipeline/LeadMagnet Sent | Label_27 |
| T1.Q.1 | TEFI/Leads/Pipeline/CV Upgrade T1 Sent | Label_31 |
| T1.Q.2 | TEFI/Leads/Pipeline/Questions Received | Created 2026-04-21 — ID TBC |
| T1.M.1 | TEFI/Leads/Pipeline/Meeting Invited | Created 2026-04-21 — ID TBC |
| T1.M.2 | TEFI/Leads/Pipeline/Meeting Booked | Created 2026-04-21 — ID TBC |
| T1.X.1 | TEFI/Leads/Awaiting Reply | Label_18 |
| T1.X.2 | TEFI/Leads/Pipeline/Stalled | Created 2026-04-21 — ID TBC |
| T1.P.1 | TEFI/Clients/Awaiting Reply | Label_38 |
| T2.C.1 | TEFI/Clients/Active/Tier2 In Progress | Label_37 |
| T4.C.1 | TEFI/Clients/Active/Tier1 In Progress | Label_36 |
| TX.A.1 | TEFI/Accounts/Invoice/Issued Unpaid | Label_54 |
| TX.A.2 | TEFI/Accounts/By Referral | Label_56 |

**To do:** After next Gmail label creation session, run `list_labels` in Cowork to capture IDs for the 4 new labels and update this table.

---

## Live Pipeline State (as of 2026-04-21)

| Lead | Label Applied | T-S1 Sent | Next Action |
|---|---|---|---|
| Melody Mutiya | Questions Received → update to Meeting Invited | ✅ Sent 2026-04-21 | Await meeting booking |
| Rene Macalintal | Meeting Invited | ✅ Sent 2026-04-21 | Await booking — nudge at Day 3 |
| Muhammed Hanif | Questions Received → update to Meeting Invited | Tate to send T-S1 | Send T-S1 today |
| Kristin Smit | CV Upgrade T1 Sent | — | Day 2 — no action yet |
| ~42 others | Backfill pending | — | 2-week manual backfill |

---

## Key Decisions Log

| Date | Decision | Reason |
|---|---|---|
| 2026-04-21 | Gmail MCP is read-only — confirmed by OAuth block | Google blocks unverified app write scope |
| 2026-04-21 | n8n is sole write path for Gmail labels and sends | Only system with verified gmail.modify scope |
| 2026-04-21 | Phase 2 is read-only detector, not auto-sender | Isolate detection from action — zero blast radius |
| 2026-04-21 | T-S1 is the only auto-send template | 95% static, single outcome, easy to audit |
| 2026-04-21 | Backfill scope = 2 weeks manual only | 3-month backfill risks mislabelling + retroactive trigger fires |
| 2026-04-21 | Stage Code (col AT) is machine key, not label string | Labels can be renamed freely without breaking n8n |
| 2026-04-21 | One pipeline label per thread at all times | Overlapping labels = duplicate trigger firings |

---

## Tomorrow's Build Target

**Phase 2 — read-only reply detector**  
See workflow spec above. Build in n8n Cloud. Use Opus for the workflow JSON construction.  
Test case: Melody Mutiya's thread (already replied 2026-04-21).  
Date-gate: only process threads with messages after 2026-04-21.

---

*© 2026 Tate Ulsaker / Tate's Employment for Immigration. All rights reserved. Confidential and proprietary — do not reproduce or share without written permission.*
