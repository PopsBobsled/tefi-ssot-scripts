# TEFI Architecture Brief for Opus
**Written:** 2026-04-22 | **Author:** Sonnet (Cowork session) | **For:** Opus — strategic architecture analysis  
**Purpose:** Give Opus full context to design the unified template library, n8n build sequence, and three-pillar brain integration.

---

## Read This First: The End Goal

TEFI is building a **self-improving business brain** — a system that gets smarter every time a client is served, an email is sent, a deal is closed, or a lesson is learned. It is not a CRM. It is not a template folder. It is a learning machine with three pillars:

**Pillar 1 — Career Vault (The Foundation)**
Every client gets a 391-field Career Vault JSON. This is the single source of truth for who they are, what they've achieved, and what they're worth in the NZ/AU market. Every document, every session, every deliverable flows from this JSON. It is what makes scale possible.

**Pillar 2 — Workflow Engine (The Production Layer)**
The Career Vault JSON feeds 25+ automated workflows (Relay + n8n). Drop a file → AI generates output → Tate reviews → approves → next workflow fires. Session prep docs, CV upgrades, interview notes, LinkedIn strategies, cover letters, pitch cards — all generated from the same JSON, consistently, at scale. This takes Tate from 5 concurrent clients to 20+.

**Pillar 3 — Communication Brain (The Learning Layer)**
Every email sent is a signal. Every client response is a lesson. The Communication Brain has two layers:
- **Email Brain** (execution layer): instance-level templates, what was sent, what worked
- **IP Brain** (principle layer): why it worked, what it means, how to apply it next time

Templates don't just exist — they evolve. Old versions deprecate. New signals are incorporated. The system learns continuously.

**The immediate problem this brief addresses:**
TEFI has 197 email templates sitting in Zoho CRM with inconsistent names, no stage code alignment, duplicates, no versioning, and no connection to the three-pillar brain. They are orphaned assets. The goal is to bring them into the system — mapped, governed, versioned, and continuously improving.

---

## The Business Model: Two Pipelines

### Pipeline 1 — Lead Pipeline (Leads → Sales)

**Entry:** Leads come in via referrals, NZ Shores immigration partners, social media, direct outreach.

**Flow:**
1. Lead receives Career Migration Snapshot (CMSnapshot) — free report, high value
2. CMSnapshot triggers questions (T-S0 template) — Tate assesses fit
3. Lead replies → Meeting invited (T-S1 — the ONLY auto-send template)
4. Meeting held → Post-meeting proposal sent
5. First payment = lead converts to client (Stripe webhook → Zoho + n8n)

**Stage code spine (Gmail labels + n8n triggers):**
```
T1.L.1  LeadMagnet Offer sent
T1.L.2  CMSnapshot delivered
T1.Q.1  CV Upgrade T1 Sent (questions sent)
T1.Q.2  Questions Received → auto-fires T-S1
T1.M.1  Meeting Invited
T1.M.2  Meeting Booked
T1.P.1  Proposal sent / Awaiting Reply
T1.X.1  Awaiting Reply (nudge sent)
T1.X.2  Dead
T1.X.3  On Hold
```

**Key constraint:** Gmail MCP is read-only. n8n is the sole write path for all Gmail labels and sends. T-S1 is the only template that auto-sends — all others are draft → Tate reviews → sends.

### Pipeline 2 — Deal Pipeline (Clients in Service Delivery)

**Entry:** First payment from Lead = conversion. Stripe webhook triggers client onboarding.

**Tiers (confirmed names):**

| Tier | Name | Theme | Price | Sessions |
|---|---|---|---|---|
| T1 | Employer-Ready Compass | Entry — CV + reports | Low/free | 0–1 |
| T2 | Career Foundation Programme | Strengths-first add-ons | Mid-low | 1–2 |
| T3a | Strategic Profile Programme | Deep evidence + market intelligence | Mid | 2–3 |
| T3b | First Impression Programme | Visual credibility | Mid | 3 |
| T3c | Market Activation Programme | Job-ready fast | Mid | 2 |
| T4 | Full Programme (End-to-End Employment) | Everything + guided job support to offer | Premium | 5+ |

**Critical rules:**
- 100% credit system — every lower tier investment credits toward higher tier
- T4 is the primary income engine — 30 deal stages, full programme
- Once a client, always a client — tracked in Contacts, not Leads
- Deal stages are atomic units — the same stage code (e.g. FP_S1a) appears in T2, T3, T4

**T4 session flow (simplified):**
```
S1: Discover Your Strengths → Skills & Achievements document
S2: Interview Coaching → CV Upgrade, Interview Notes, Photo Portfolio
S3: Video CV Recording → Short Clip, Pitch Card
S4: Job Hunt Live Demo → Employer spreadsheet, calling strategy
S5: Active Job Hunt Support → Employer calls, analytics, offers
S6: Proactive Support → Ongoing refinement until placement
```

---

## The 197 Zoho Templates: What We Have

Full inventory extracted 2026-04-22. Stored at: `~TEFI/Tools/Zoho/Zoho_Email_Template_Inventory.md`

**Key stats:**
- 197 total templates
- ~105 in Deals module, ~58 in Contacts, ~34 in Leads
- Date range: Dec 2022 → Apr 2026
- Named inconsistently: mix of S-codes (S1a, S2c), free text, price points, person names

**Five structural problems Opus must solve:**

**1. Naming chaos**
No unified convention. Templates are named by: session code (S1a), descriptive text (Stalled out), price (Prop-Full 3-12k USD), person (NZ Shores - FABIEN), or purpose fragment (I am here). No template can be found reliably by someone who didn't create it.

**2. No stage code alignment**
TEFI_Label_Template_Master.md uses T1/T2/T3/T4 + category + sequence stage codes (e.g. T1.M.1, T4.C.3). Zoho uses S1–S6 session codes. These need to be mapped and reconciled into one spine.

**3. Duplicates and variants**
- S2e CV Comparison Report: 2 templates, different subjects
- Full Programme proposals: 3 templates (1.3k USD, 1.45k USD, 3-12k USD) — should be one with a price merge field
- Post Meeting - Pre Proposal: exists in Leads AND Contacts with identical subject
- NZ Shores referral templates: 10+ person-specific templates (FABIEN, JULIA, CHELSEA…) — should be one with merge fields

**4. No versioning or lifecycle**
No template has a version number. No template has a status (Active/Draft/Deprecated). When Tate improves a template, the old one stays alongside the new one with no indication which is current.

**5. No brain connection**
Templates exist in Zoho isolation. No link to IP Brain principles. No signal logging when a template performs well or poorly. No deprecation trigger when a principle is superseded.

**Category breakdown (observed):**

| Category | Count | Examples |
|---|---|---|
| Session delivery (S1–S6) | ~60 | S1a, S2a, S3a, S4b, S5c |
| Full Programme (FP_) | ~10 | FP_S1E, FP_S2d2, FP_S3 |
| Easy Entry (EE_) | ~8 | EE_S1c, EE_S1G, EE-to-FP |
| Proposals | ~12 | Prop-Full variants, $850 JMAP, $500 Easy Entry |
| Referral agents | ~12 | NZ Shores variants, HennesyImmigration |
| FAQ / Objection handling | ~8 | FAQ - Job Guarantee, Finance not possible |
| Promotional / Seasonal | ~6 | Happy Holidays, Spring Discount |
| Lead nurture / pipeline | ~10 | Meet Group, 1-on-1 Power Invitation |
| Nudges / Check-ins | ~15 | Stalled out, Long Delay variants |
| Admin | ~5 | Zoho Bookings, Interrupted Meeting Apology |

**High performers (recently used, high open rates):**
- S1a DiscoverYourStrengths — 100% open, 30/30, last used Mar 31
- How goes the job search? — 90.7% open, 39/43
- Update on Job Finding Experience — 100% open, 10/10
- S5A Update on Job finding Status — 92.9%, 13/14
- 2 days After sending the Skeleton CV — 100%, 9/9
- Post Holiday Hiring Peak is Here — 76.7%, 23/30

**Archive candidates (last used 2022–2023, never or rarely sent):**
- Big Deal Alert (last used Jul 2022)
- TEFI Template (blank shell, never sent)
- Zoho Bookings Template (Dec 2023, never sent)
- S4c-FridayReports-Kaizen (Feb 2024, never sent)
- NZ Shores person-specific referral variants (consolidate to one)

---

## The n8n Automation Roadmap

7-phase plan. Phases must run in sequence — each is a dependency for the next.

**Phase 1 — Manual labelling + registry sync** ⏳ In progress  
4 labels created. ~42 leads need backfill. Registry cols AR (Gmail Label) + AS (Thread ID) being populated.

**Phase 2 — Read-only reply detector** 🔲 Next build  
n8n polls Gmail every 15 min. Finds inbound replies to CV Upgrade T1 Sent threads. Appends to Inbox_Candidates tab. No labels applied, no sends. 14-day clean run required before Phase 3.

**Phase 3 — n8n applies labels** 🔲 Pending Phase 2  
Same workflow but now applies Questions Received label. Still no sends. 30 consecutive correct labels required.

**Phase 4 — T-S1 auto-send only** 🔲 Pending Phase 3  
Questions Received label triggers automatic T-S1 send. Hard guardrails: Do Not Auto-Send column check, max 10/day, dry-run first week. T-S1 is the ONLY template that ever auto-sends.

**Phase 5 — Nudges automated** 🔲 Pending Phase 4  
Time-based triggers for T-S0c (Day 7 no reply) and T-S1b (Day 3 no meeting booking).

**Phase 6 — Zoho sync** 🔲 May 2026  
Gmail label changes → Zoho deal stage. One-way only until Phase 7.

**Phase 7 — Career Vault + 3 Pillar Brain** 🔲 Q3 2026  
Full pipeline automation. CV intake → 391-field JSON → Zoho + Drive + Relay workflows.

**Registry columns required before n8n writes anything:**

| Column | Name | Status |
|---|---|---|
| AR | Gmail Label | Exists, needs populating |
| AS | Last Email Thread ID | Exists, needs populating |
| AT | Stage Code | NOT YET ADDED |
| AU | Last State Change | NOT YET ADDED |
| AV | Last Action By | NOT YET ADDED |
| AW | Do Not Auto-Send | NOT YET ADDED |
| AX | Next Scheduled Action | NOT YET ADDED |
| AY | Next Action Date | NOT YET ADDED |

---

## The Relay Workflow Register (25+ workflows)

Full register at: `~TEFI/IP Brain/TEFI_Relay_Workflow_Register.md`

**Build priority queue:**

| Priority | Workflow | Status |
|---|---|---|
| 1 | A2 — JSON → CM Report | Next build |
| 2 | A3 — QC Pass → Gmail Draft | After A2 |
| 3 | A4 — QC Return → Encouragement | After A3 |
| 4 | B1 — Session 1 Prep | High frequency — 20-30 min saved per session |
| 5 | C2 — SAM Report | Core T2+ deliverable |
| 6 | C3 — Career Impact Report | Feeds from C2 |
| 7 | C4 — Job Interview Notes | High frequency |
| 8+ | B2–B5, C6, C12, C13, C14 | Build as tiers develop |

---

## What Opus Is Being Asked to Design

### Task 1: Unified Template Library Architecture

Design a template library system that:

1. **Has a single naming convention** — maps to stage codes, immediately readable, version-numbered. Example format: `[StageCode]_[Description]_v[N]` e.g. `T1.M.1_MeetingInvitation_v3`

2. **Has a governance model** — every template has: Owner (Haiku/Sonnet/Tate), Status (Active/Draft/Deprecated), Static% (what % is fixed text), AI Space (exactly where personalisation is permitted), and a Signal Log (what has been learned from sends).

3. **Has a lifecycle** — Draft → Active → Deprecated. Deprecation is triggered by: a principle update in IP Brain, a better-performing variant, or 90 days without a send. Deprecated templates move to archive with a version note, not deleted.

4. **Maps to both spine systems** — Zoho S-codes (S1a, S2c etc.) AND TEFI stage codes (T1.M.1, T4.C.3). The map is explicit, not assumed.

5. **Has a continuous growth mechanism** — when Tate improves a template, the signal logs to Email Brain AND IP Brain. The old version deprecates. The new version is numbered. The principle that drove the change is documented.

6. **Handles the referral template problem** — 10+ person-specific NZ Shores templates collapse to one with merge fields. The referral agent name is a variable, not a template variant.

7. **Handles the proposal template problem** — multiple price-point variants collapse to one template with a `{{price}}` merge field and conditional sections.

### Task 2: n8n Build Sequence Validation

Review the 7-phase roadmap and:
- Confirm the phase sequence is correct (no dependencies missed)
- Identify the exact workflow JSON structure for Phase 2 (read-only reply detector)
- Identify which registry columns are truly blockers vs nice-to-haves before Phase 2
- Flag any risks in the current architecture (e.g. the label-per-thread rule, date-gate logic)

### Task 3: Three-Pillar Integration Map

Design the connection layer between the three pillars:

```
Career Vault JSON (Pillar 1)
    ↓ feeds
Workflow Engine — Relay + n8n (Pillar 2)
    ↓ produces
Documents + Emails sent to client
    ↓ signals flow back to
Communication Brain — Email Brain + IP Brain (Pillar 3)
    ↓ improves
Templates + Principles
    ↓ feeds back into
Workflow Engine (better outputs next time)
```

Specifically:
- Where does the template library live in this map? (Zoho? Local files? Both?)
- What is the signal capture mechanism? (Gmail label → n8n → log file?)
- What triggers a principle update in IP Brain? (Manual by Tate monthly? Automated threshold?)
- How does a deprecated template get replaced in live workflows without breaking them?

### Task 4: White Label Readiness Assessment

The workflow system is eventually the product — licensable to other immigration agencies. What needs to be true of the template library and workflow architecture for it to be:
- Operable by non-Tate staff with minimal training
- Rebrandable (Tate's voice → agency's voice)
- Packageable per deliverable, not just per tier

---

## Key Files to Read Before Responding

| File | Location | Why |
|---|---|---|
| Template Inventory | `~TEFI/Tools/Zoho/Zoho_Email_Template_Inventory.md` | The 197 templates |
| Label + Template Master | `~TEFI/TEFI_Label_Template_Master.md` | Stage code spine |
| n8n Pipeline Brain | `~TEFI/Tools/n8n/TEFI_n8n_Pipeline_Brain.md` | 7-phase roadmap, connector status |
| Relay Workflow Register | `~TEFI/IP Brain/TEFI_Relay_Workflow_Register.md` | 25+ workflow queue |
| Service Architecture | `~TEFI/IP Brain/TEFI_Service_Architecture.md` | T1–T4 tiers, deal stages |
| Email Brain Architecture | `~TEFI/Email-Brain/00_EMAIL_BRAIN_ARCHITECTURE.md` | Two-layer brain system |

---

## The Governing Principle (Do Not Lose Sight of This)

This system is designed for **continuous growth**. That means:

- Nothing is permanent — every template, every principle, every workflow can be improved
- Nothing is deleted — deprecated versions are archived with a version note and a reason
- Every signal matters — a high open rate, a client reply, a conversion — these feed back into the system
- The system learns at the instance level (Email Brain) and the principle level (IP Brain)
- Tate's role is to review, approve, and direct — not to manage the machine

When Opus designs anything here, the question to always ask is: **how does this system get better over time without requiring Tate to manage the improvement manually?**

That is the north star.

---

*Brief written by Sonnet, Cowork session 2026-04-22. For use by Opus in architecture analysis session.*
