# TEFI SSOT Architecture — Decision Document

**Status:** LOCKED 2026-04-23 (Deliverable 1 of 4 in the SSOT governance work stream)
**Author:** Opus session with Tate Ulsaker
**Supersedes:** Prior implicit assumption that Leads Registry was the lead-side state machine and that Gmail labels were a source of truth
**Related documents (to be produced):**
- Deliverable 2: Future-Proofing Analysis — required before field mapping
- Deliverable 3: Full Field Map (discovery) — mechanical inventory, Sonnet-level
- Deliverable 4: Fit-for-Purpose Analysis + Optimised Target Schema — governance level
- Migration plan (post-Deliverable 4) — ops work

---

## 1. The Problem This Document Solves

TEFI has been operating with three overlapping stores of pipeline / client / lifecycle state:

1. **Zoho CRM** (Leads, Contacts, Deals modules) — the original business launching pad
2. **Leads Registry** (Google Sheet, file ID `1abylcyfcNeJJEb67AORf8MtsO8IN5F8l-7w3l-kbMk4`) — 52 columns, lead lifecycle tracker built up over time
3. **Career Vault** (Google Sheet, file ID `1GN95DkidLCsGVdJaY5sSVQI6kBesTfayHcj4qPB5IAo`) — 391-field deep candidate data store, PERSON_PROFILE + CAREER_DETAIL + related tabs

Plus a fourth overlay:

4. **Gmail labels** — applied manually and (until today) by scheduled Claude tasks, used as both a visual signal and a de facto state machine

**No field in this stack has a single owner.** Payment date lives in Leads Registry, Career Vault, and Zoho. Status lives in all three. Identity (Person_ID, email) lives in all three. There is no rule for which wins when they disagree — which means, in practice, whichever system was most recently touched is treated as right, and drift goes undetected until something breaks.

This was a tolerable problem while TEFI was a solo operation with one person holding the whole picture in their head. It becomes an untenable problem the moment automation enters the picture — because n8n cannot read a human's memory for which store is canonical.

**A secondary problem surfaced during today's governance session:** Cowork (Claude Code) cannot write Gmail labels. It is read-only against Gmail. A significant amount of prior work assumed Cowork could apply labels as part of scheduled daily tasks. That assumption is false. All label-writing patterns built around Cowork are retired as a consequence.

This document locks the SSOT decisions that resolve both problems.

---

## 2. The Three Locks

### Lock 1 — Zoho CRM is the Single Source of Truth for pipeline, identity, and lifecycle

**What this means:**
- Lead records (pre-payment) live in Zoho Leads
- Contact records (converted) live in Zoho Contacts
- Deal records (active revenue) live in Zoho Deals
- Pipeline stage, lead status, deal stage, touch history, nudges, payment received, conversion events, exit reasons — all owned by Zoho
- Person_ID is a field in Zoho and is the primary key for cross-system joins
- Activity log, email history, task log — Zoho is canonical

**Why Zoho:**
- Purpose-built for this job. A CRM is designed to be the pipeline SSOT; Sheets are designed to be a spreadsheet.
- Stable, versioned API designed to be hit by automation. n8n has a native Zoho CRM node.
- Already in use. Tate's original launching pad. Muscle memory exists. Zero learning curve cost to return to.
- Designed for multi-user access, role-based permissions, audit trails, reporting — everything Sheets would require reinventing.
- Cost-effective at solo/small-team scale. Matches Tate's "low maintenance, low cost, enterprise-CX" vision.
- Extensible via custom modules if needed, but with known limits.
- Layer 3 (white-label) friendly: a Zoho module with documented schema is a licensable product; a pile of Sheets with personal naming is a toolkit requiring training.

**Implication for today:**
Every field currently living in Leads Registry that tracks pipeline/lifecycle state is relocated to Zoho. Where an equivalent Zoho field exists, it wins. Where no Zoho equivalent exists, a custom field is created in Zoho (identified in Deliverable 4).

### Lock 2 — Career Vault (Google Sheets) is the Single Source of Truth for deep candidate data

**What this means:**
- PERSON_PROFILE: the 90+ field candidate profile including career summary, target packs, generated summaries, vault-health flags, keyword density, visa pathway detail
- CAREER_DETAIL: role history, achievements, metrics, skills, proof, keyword tags, pack fit
- Related tabs: target role packs, admin console, intake log (per architecture)
- Anything that feeds deliverable generation (CM Report, Career Impact Report, SAM Report, pitch cards, Session 1 Prep, interview notes)

**Why Career Vault (not Zoho):**
- Zoho CRM is optimised for transactional pipeline data, not deep, structured, deliverable-generating content
- PERSON_PROFILE + CAREER_DETAIL has a relational structure (multiple roles per person, multiple achievements per role, multiple metrics per achievement) that would require nested custom modules in Zoho — painful, fragile, slow
- Career Vault is already wired to Relay for document generation. Rewiring to pull from Zoho would be a significant engineering cost for no architectural gain.
- The richness of the field set (391 fields designed for Tier 1–4 deliverable generation) is an asset, not a liability. It belongs somewhere it can flex.
- Tate explicitly confirmed: "I don't want to extend Zoho and discover its limits if I can have a richer and better place on the relatively low volume deeper analysis that comes with each deal."

**Implication for today:**
Career Vault keeps its current structure. Fields that also exist in Zoho (payment date, tier status) are reconciled in Deliverable 4. Going forward, the rule is: Career Vault fields for deliverable content; Zoho fields for transactional state. Overlap is explicitly minimised.

### Lock 3 — Leads Registry retires; Gmail labels become a derived view

**What this means for Leads Registry:**
- The Google Sheet at `1abylcyfcNeJJEb67AORf8MtsO8IN5F8l-7w3l-kbMk4` is deprecated as an SSOT store.
- Its 52 columns are categorised during Deliverable 4:
  - Fields duplicating Zoho → retired, Zoho wins
  - Fields unique to Leads Registry but rightfully Zoho's → migrated into Zoho (custom fields created as needed)
  - Fields unique to Leads Registry but rightfully Career Vault's → migrated into Career Vault
  - Fields that are genuinely working-view only (e.g. a filtered report view for a particular workflow) → rebuilt as Zoho list views or Google Sheet *read-only* views pulling from Zoho via n8n
- Once migration completes, the Leads Registry sheet is archived (renamed with `_ARCHIVED_YYYY-MM-DD` suffix), not deleted, pending 90-day confidence window.

**What this means for Gmail labels:**
- Gmail labels are a **derived view** of Zoho state. They are written *by n8n*, triggered by Zoho stage changes. They are never a source of truth.
- The label taxonomy itself (the structure Tate designed) is kept — this was good work. What changes is who applies them: n8n, not humans or Cowork-scheduled tasks.
- Humans may still apply labels manually during migration for visual convenience, but these writes are ephemeral and will be overwritten by the n8n sync workflow once it ships.
- Two scheduled tasks that wrote labels based on Claude reasoning (`daily-gmail-diligence-labels`, `daily-lead-intelligence`) were paused 2026-04-23 as part of this decision.

**Why this structure:**
- "Derived view" is the standard pattern in any multi-system architecture: one store is canonical; others display it. The alternative (two-way sync) always drifts.
- Gmail as a view (not a store) means every future system — Zoho, Relay, Career Vault, client dashboard, white-label partner instances — depends on Zoho, not on a label taxonomy in one email account.
- Cowork's read-only constraint on Gmail is no longer a problem — it was forcing the correct architecture.

---

## 3. What This Means in Plain Terms: "Gmail labels as derived view"

Tate specifically asked for this to be explained in simpler terms.

**Old pattern (what we were doing):**
A lead replied to a CV Questions email. Tate (or Claude, via a scheduled task) read the reply, decided "this lead has answered — they move to stage *Questions Received*," and manually applied the `Questions Received` label in Gmail. The label *was* the status. If someone asked "what stage is this lead in?" — the answer was "whatever label Gmail has on their thread." Gmail was the de facto state machine.

**New pattern (derived view):**
A lead replies to a CV Questions email. n8n's reply-detection workflow (Phase 2) notices the reply and writes the state change to **Zoho** — e.g. updates the Lead's status field to `Questions Received`. A separate n8n sync workflow (future build) sees Zoho's status field changed and, as a consequence, applies the `Questions Received` label in Gmail. The Gmail label is now a reflection of Zoho — it changed *because* Zoho changed, not the other way around.

If someone asks "what stage is this lead in?" — the answer is "ask Zoho." Gmail is just a convenience view.

The critical difference: **if the Gmail label and Zoho disagree, Zoho wins, always.** The sync workflow will overwrite the label to match Zoho. This is the entire point of the SSOT principle — one store is authoritative, others follow.

**Consequence for Tate's daily practice:**
Applying labels manually in Gmail to change a lead's stage will *appear* to work for a few minutes until the next sync pass, which will revert the label if Zoho hasn't been updated. So the new habit is: **change the stage in Zoho, and the label will follow.** This is a small behaviour change but it has to be understood — otherwise future-Tate will be confused when their manual Gmail label changes don't "stick."

---

## 4. The Architecture in One Diagram (text form)

```
                    SSOT LAYER
    ┌──────────────────────────┐   ┌──────────────────────────┐
    │       Zoho CRM           │   │     Career Vault         │
    │  (Leads, Contacts,       │   │  (Google Sheets)         │
    │   Deals)                 │   │                          │
    │                          │   │  PERSON_PROFILE          │
    │  OWNS:                   │   │  CAREER_DETAIL           │
    │  - Pipeline state        │   │  ACHIEVEMENTS            │
    │  - Identity (Person_ID)  │   │  SKILLS                  │
    │  - Payment status        │   │  TARGET_ROLE_PACK        │
    │  - Touch history         │   │                          │
    │  - Deal stage            │   │  OWNS:                   │
    │  - Activity log          │   │  - Candidate career data │
    │  - Task log              │   │  - Deliverable content   │
    └────────────┬─────────────┘   └─────────────┬────────────┘
                 │                               │
                 │       joined on Person_ID     │
                 │                               │
         ┌───────┴───────────────────────────────┴────────┐
         │                                                │
         │               n8n Integration Fabric           │
         │        (reads both, writes both, syncs)        │
         │                                                │
         └───────────┬────────────────────┬───────────────┘
                     │                    │
                     ▼                    ▼
         ┌─────────────────┐  ┌─────────────────────────┐
         │  DERIVED VIEWS  │  │   GENERATED OUTPUTS      │
         │                 │  │                          │
         │  - Gmail labels │  │  - CM Reports (Relay)    │
         │  - Sheet views  │  │  - CMSnapshots           │
         │  - Dashboards   │  │  - Session 1 Prep        │
         │                 │  │  - Interview Notes       │
         │  (never source) │  │  - Pitch Cards           │
         └─────────────────┘  └─────────────────────────┘

         RETIRED:
         - Leads Registry (52-col Google Sheet)
         - Cowork-based label-writing scheduled tasks
```

---

## 5. What Stops Today

**Paused scheduled tasks** (disabled 2026-04-23, descriptions updated):
- `daily-gmail-diligence-labels` — wrote labels from Haiku reasoning. Wrong architecture.
- `daily-lead-intelligence` — wrote labels from lead reply classification. Wrong architecture.

These tasks stay paused until either (a) their functionality is rebuilt as n8n workflows reading Zoho and writing Gmail as derived views, or (b) they are retired permanently.

**Paused plans:**
- Phase 1.5 — Registry Schema Lock (add cols AT–AY to Leads Registry): **cancelled in its current form.** Do not add new state-tracking columns to a sheet that is being retired as SSOT. A replacement phase (Phase 1.4 — SSOT Consolidation) is to be defined in the Phase Playbook once Deliverable 4 is complete.
- Any plan that writes "pipeline state" into the Leads Registry: paused until Deliverable 4 defines the target schema.

**Not paused** (still running — these are safe):
- Scheduled tasks that read-only from Gmail and produce reports or drafts
- Scheduled tasks that write to internal planning files (TATE_FOCUS, Playbook, Daily Logs)
- Backup tasks
- Buffer content tasks
- n8n Phase 2 *planning* (but not building, until SSOT is confirmed — reply detection will now write to Zoho, not to an Inbox_Candidates sheet)

---

## 6. What Survives from the Prior Vision

The three-layer stack from `TATE_FOCUS.md` survives intact. The SSOT decision affects *where state lives*, not *what the business is building toward*.

- **Layer 1 (Today: Operations)** — still built on n8n, Gmail, Sheets, Zoho, Drive, Relay. What changes: Zoho is now explicitly the pipeline SSOT. Sheets shrink in role (Career Vault only). Leads Registry retires.
- **Layer 2 (Tomorrow: 3-Pillar Brain)** — the Career Vault pillar grows stronger (it's now an SSOT, not a "deep data store among several"). The Workflow Engine pillar gets simpler (n8n has two clear sources to integrate, not three to reconcile). The Communication Brain pillar gets cleaner (templates live and are triggered from Zoho state, not Gmail label state).
- **Layer 3 (Future: White-Label)** — significantly improved. A Zoho CRM module with documented schema + a Career Vault template are two licensable artifacts. Much cleaner than a licensable "pile of Google Sheets."

The T4 Chain quarterly focus (Half A then Half B) is **unchanged**. Every workflow in Half A and Half B still needs to be built. What changes is the store they read from and write to. Most of them become *simpler* with Zoho as SSOT, because Zoho already handles some of what the sheets were doing manually.

**Fuller analysis of "what is gained, what is lost" is Deliverable 2.** This document only confirms the stack survives.

---

## 7. Standing Rules (new — add to CLAUDE.md or TATE_FOCUS.md)

Effective 2026-04-23:

1. **Zoho CRM is the SSOT for pipeline, identity, and lifecycle state.** All workflows read and write Zoho for these concerns.
2. **Career Vault (Google Sheets) is the SSOT for deep candidate data.** All deliverable-generation workflows read Career Vault.
3. **No field has two owners.** If a field is needed in both systems, one owns it and the other reads a synced copy via n8n. The owner is identified in Deliverable 4.
4. **Gmail labels are a derived view of Zoho. Never a source.** Humans may apply labels manually for visual convenience during migration; post-migration, n8n manages all label state.
5. **n8n is the integration fabric.** n8n reads and writes both SSOTs and produces derived views. Zoho's own automation (workflow rules, blueprints) handles in-Zoho state. n8n does not automate *inside* Zoho's territory; Zoho does not automate *across* systems.
6. **Field-level decisions follow vision-level decisions.** Never map fields until the architecture they serve is locked. Applied today as the reason Deliverables 2 and 4 exist.
7. **Before any new automation is built, confirm which SSOT layer it reads from and which it writes to.** This question is part of the workflow design, not an afterthought.

---

## 8. What Comes Next (the remaining three deliverables)

**Deliverable 2 — Future-Proofing Analysis**
Scope: what does the 3-Pillar Brain look like in this SSOT split? What does white-label readiness look like? What capabilities are required from Zoho and Career Vault in 12–24 months that aren't expressed in current fields? What's gained and what's lost from the prior vision?
Mode: Opus session with vision documents loaded (Architecture Design, Playbook, Timeline, White Label Strategy).
Estimated duration: 2–3 hrs of focused governance work.
Output: `TEFI_FutureProofing_Analysis_2026-04-??.md`

**Deliverable 3 — Full Field Map (discovery)**
Scope: every field in Zoho Leads/Contacts/Deals (custom fields of interest, standard fields in use), every column in Leads Registry (52), every field in Career Vault across all tabs (391). Presented as a single comparison table with each field tagged by current location, data type, population rate, and cross-store duplicates.
Mode: Sonnet ops session. Subagent the large-output extractions (field schemas are too large for direct reads).
Estimated duration: 1–2 hrs.
Output: `TEFI_Full_Field_Map_2026-04-??.md` or xlsx.

**Deliverable 4 — Fit-for-Purpose Analysis + Optimised Target Schema**
Scope: cross-reference Deliverable 3 against Deliverable 2. For each field: keep, move, merge, deprecate, or new. Produce the target schema for post-migration Zoho (including custom fields to create) and post-migration Career Vault (including fields to retire or restructure). Define the migration sequence.
Mode: Opus session.
Estimated duration: 2–3 hrs, ideally with a sleep-on-it gap before committing.
Output: `TEFI_SSOT_Target_Schema_2026-04-??.md` + migration plan.

**Then — migration ops** (Sonnet sessions, routine execution):
- Create missing custom fields in Zoho
- Write n8n workflow to migrate Leads Registry rows → Zoho Leads
- Verify Career Vault → Zoho Person_ID join integrity
- Archive Leads Registry
- Update documentation (CLAUDE.md, PROJECTS_INDEX, Phase Playbook) to reflect new architecture
- Rebuild the two paused scheduled tasks as n8n workflows reading Zoho and writing Gmail labels

---

## 9. Decision Log — What Was Decided Today and By Whom

| Decision | Decided by | Decided on | Reversibility |
|---|---|---|---|
| Zoho as SSOT for pipeline/identity/lifecycle | Tate (approved) + Opus (recommended) | 2026-04-23 | High architectural cost to reverse; expected permanent |
| Career Vault as SSOT for deep candidate data | Tate (approved) + Opus (recommended) | 2026-04-23 | High architectural cost to reverse; expected permanent |
| Leads Registry retired as SSOT | Tate (approved) + Opus (recommended) | 2026-04-23 | Low cost to reverse during 90-day archive window; high cost after |
| Gmail labels as derived view (not SSOT) | Tate (approved) + Opus (recommended) | 2026-04-23 | Low cost to reverse; would restore the Cowork-read-only problem |
| Two Cowork scheduled tasks paused | Tate (approved) + Opus (recommended) | 2026-04-23 | Reversible (tasks disabled, not deleted); rebuilding as n8n workflows makes them obsolete |
| Phase 1.5 cancelled in current form | Tate (approved) + Opus (recommended) | 2026-04-23 | Low cost — replaced by Phase 1.4 SSOT Consolidation |
| Deliverables 2, 3, 4 sequenced before migration | Tate (approved) + Opus (recommended) | 2026-04-23 | None — this is the sequencing rule, not an outcome |

---

## 10. Confidence and Caveats

**High confidence:**
- The three-store problem is real and needed resolution
- Zoho is the correct SSOT for pipeline/identity/lifecycle
- Career Vault is the correct SSOT for deep candidate data
- Gmail labels should be derived, not source
- The field-level work must be sequenced after the future-proofing work

**Medium confidence (worth revisiting in Deliverable 2):**
- The exact dividing line between "pipeline state" (Zoho) and "deep candidate data" (Career Vault) for borderline fields — e.g. `target_countries`, `target_seniority`. Arguably identity/intent (Zoho) or candidate data (Career Vault). Leave unresolved until Deliverable 4 maps them with the vision lens applied.
- Whether any part of CAREER_DETAIL should move into Zoho as a custom module for Zia (Zoho AI) to operate on. Flagged but not resolved today.

**Low confidence / known unknowns:**
- Whether the Zoho custom-fields quota supports all the fields that will need to migrate from Leads Registry. Zoho has per-module field limits; if we hit them, schema optimisation in Deliverable 4 needs to be aggressive.
- Whether n8n's Zoho node handles all the field types we'll need (particularly multi-select, lookups). To test during Deliverable 3 or 4.
- Whether Zoho's webhook reliability is adequate for a near-real-time Gmail sync. Phase 2 build will reveal this; worst case, 15-min poll is acceptable.

These caveats do not invalidate the three locks — they inform how Deliverables 2–4 treat specific subsets of the work.

---

*End of document. Next action: proceed to Deliverable 2 (Future-Proofing Analysis) when ready. Recommended mode: dedicated Opus session with vision documents pre-loaded.*
