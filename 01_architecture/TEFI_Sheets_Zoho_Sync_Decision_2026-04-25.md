# TEFI Sheets ↔ Zoho Sync — Architectural Decision
**Date:** 2026-04-25
**Status:** Decided. Execution deferred — flagged for retrieval when sync work begins.
**Trigger to recall:** Say **"Sheets-Zoho sync"** in a session and Sonnet should read this file before responding.

---

## Context

This decision was made on 2026-04-25 during a Saturday morning planning conversation, after Tate declined to start the import work that day. It captures the agreed architecture for moving lead data from Working Sheets into Zoho CRM, and clarifies what stays alive vs. what retires under the 2026-04-23 SSOT pivot.

Resolves the BF.1–BF.3 question by deprecating cols AR/AS in the incoming Leads Registry.

---

## The Three-Store Architecture (post-SSOT pivot)

1. **Zoho CRM** — SSOT for pipeline state, identity, lifecycle. Holds name, email, stage, status, Person_ID. Works with Zoho's native record IDs as operational keys.
2. **Career Vault JSONs** — SSOT for deep candidate/profile content. Feeds report generation via Cowork or Relay rendering. Sync to Zoho is downstream and triggered when a lead becomes a deal (separate workflow, not part of this decision).
3. **Working Sheets** — staging layer for atomic content and bulk operations. Stays alive. Sheets are the better store for uploading complex datasets to Zoho deals; JSONs are the better store for profile content used in specialised reports. Cowork and Relay are interchangeable for rendering.

---

## What's Retiring vs. Staying

**Retiring:**
- The **Leads Registry as a pipeline tracker** (specific sheet ID `1abylcyfcNeJJEb67AORf8MtsO8IN5F8l-7w3l-kbMk4`)
- Cols **AR (Gmail Label)** and **AS (Last Email Thread ID)** — deprecated. Gone, unused, or ignored from 2026-04-25 forward
- BF.1–BF.3 sub-steps in Phase 1 — paused. Do not execute.

**Staying:**
- Sheets-as-staging for bulk upload to Zoho
- JSONs as profile-content SSOT
- Cowork + Relay as rendering surfaces
- The broader Sheets/JSON/rendering architecture is intentional and not affected by the SSOT pivot

---

## ID Strategy

- **Email = working join key** between Sheets/JSONs and Zoho. ~99.5% reliable for the active lead set. The 0.5% fails are caught manually.
- **Person_ID (`TEFI-YYYYMM-emailtail`) = durable identity.** Stamped on Zoho Lead records at first-touch (per option (a) — preserves the 2026-04-23 lock). Available when needed for white-label, email changes, dupe collapses. Not wired into Sheets today.
- **Zoho native record ID = internal operational key.** Untouched. Works as designed.
- **Legacy dormant contacts (years-old)** — keep Zoho's native ID as the only key. Person_ID backfill is a future one-off project before white-label/3-Pillar Brain work begins.

---

## Sync Mechanism

**Path: Sheets → n8n → Zoho.** Make this **as automated as possible**. n8n is the right tool. No MCP-driven manual imports from Cowork.

**Ownership split:**
- **Tate:** owns Sheets sync/upload prep, Relay rewiring (cols AR/AS removed from the incoming lead pipeline), and the call on when the Sheets are ready to upload
- **Sonnet (when invoked):** assists with field mapping, n8n workflow design, dry-run verification, and post-import validation

**Career Vault → Zoho:** separate downstream sync, only when a lead becomes a deal. Out of scope for this decision; flagged for future design.

---

## What This Replaces

This decision supersedes BF.1–BF.3 in `TATE_PHASE_PLAYBOOK.md` Phase 1. Those sub-steps (apply Gmail labels to ~42 leads, populate cols AR/AS) are no longer required because:
- Cols AR/AS are deprecated
- Gmail labels become a derived view from Zoho state, applied by n8n (post-Deliverable 4)
- Pipeline state lives in Zoho, not in Sheets cols or Gmail labels

---

## Recall Instructions

When sync work begins, Tate should say **"Sheets-Zoho sync"** and Sonnet should:
1. Read this file before responding
2. Confirm the architecture is still intact (no further pivots)
3. Pick up from "Sync Mechanism" above to plan the n8n workflow

If the topic arises organically (Sheets, Zoho upload, Leads Registry, BF.1–BF.3, AR/AS, Person_ID), Sonnet should reference this file and confirm whether the asker is looking for the decision or the execution.
