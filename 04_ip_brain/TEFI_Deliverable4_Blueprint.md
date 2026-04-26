# Deliverable 4 — Target Schema + Migration Plan: Opus Session Blueprint

**Created:** 2026-04-26
**Preceded by:**
- `~TEFI/TEFI_SSOT_Architecture_Decision_2026-04-23.md` (Deliverable 1, LOCKED)
- `~TEFI/TEFI_FutureProofing_Analysis_2026-04-23.md` (Deliverable 2, 7 lock-points approved by Tate)
- `~TEFI/TEFI_Full_Field_Map_2026-04-23.md` (Deliverable 3, 534 fields, 35 overlap candidates)
- `~TEFI/TEFI_Sheets_Zoho_Sync_Decision_2026-04-25.md` (architectural lock-in for Sheets ↔ Zoho path)
**To be run as:** dedicated Opus session, 2–3 hrs focused governance + schema design work (sleep-on-it gap recommended before commit)
**Output:** `~TEFI/TEFI_SSOT_Target_Schema_2026-04-??.md` (target schemas + migration plan + TENANT_REGISTRY)
**Clears:** Gate 1 of the Five Gates
**Unlocks:** Phase 1.4 sub-steps (SSOT Consolidation execution)

---

## 0. Context the Opus Session Must Load Before Starting

Read these five files in full before any schema work. Do NOT paraphrase them in the output — reference them by section number when a decision is being inherited.

1. **`~TEFI/TEFI_SSOT_Architecture_Decision_2026-04-23.md`** — Deliverable 1, the three locks (Zoho = pipeline/identity/lifecycle SSOT; Career Vault = deep candidate data SSOT; Leads Registry retired, Gmail labels become derived view). Pay special attention to Section 7 (Standing Rules) and Section 9 (Decision Log).

2. **`~TEFI/TEFI_FutureProofing_Analysis_2026-04-23.md`** — Deliverable 2. The seven lock-points Tate approved (Closing Note, lines 731–737) are inputs to D4, not topics for re-debate. Pay special attention to:
   - Thread 4A (Person_ID Operational Mechanics, lines 376–497) — format, collision, write pattern, legacy backfill, tenant prefix convention
   - Thread 4C (Top-10 Capability Gap List, lines 591–610) — gaps 1, 6, 7 (Vault) are the Q2 priority set; gap 9 (deal pipeline 57 → ~15 stages) is explicitly a D4 migration task
   - Thread 4B (Vault informs, Zoho decides — default stage progression pattern)
   - Synthesis Q7 (Person_ID summary, lines 710–722) — generation trigger, write pattern, when-to-implement

3. **`~TEFI/TEFI_Full_Field_Map_2026-04-23.md`** — Deliverable 3. The 534-field inventory and 35 overlap candidates are the raw input to the target schema. Pay special attention to:
   - Section 5 — the 35 cross-store overlap candidates (every candidate must be resolved: keep / move / merge / deprecate / new)
   - Section 6 — observations (notably the four overlapping state machines and the Lead/Contact custom-field naming drift)
   - Sections 2.1–2.3 — Zoho Leads/Contacts/Deals inventories (input to Zoho target schema)
   - Sections 4.1–4.6 — Career Vault tab inventories (input to Vault target schema)

4. **`~TEFI/TEFI_Sheets_Zoho_Sync_Decision_2026-04-25.md`** — locks the three-store split (Zoho / Career Vault JSONs / Working Sheets). Email is the working join key; Person_ID is durable identity stamped at first-touch. Cols AR/AS deprecated; BF.1–BF.3 paused. Trigger phrase: "Sheets-Zoho sync".

5. **`~TEFI/Marketing/TEFI_Gmail_Label_Key.md`** — "TEFI Gmail Label Key & Daily Diligence Map" (established 2026-04-16, last updated 2026-04-21). The canonical Gmail label taxonomy. This is the source vocabulary that ports into the Zoho pipeline-stage picklist (Deliverable A). Read in full — every label that exists today must map to a target Zoho stage (or be explicitly retired) in D4's output.

Secondary (reference only — do not block on these; consult if a question arises):
- `TATE_PHASE_PLAYBOOK.md` — current phase checklist, where Phase 1.4 sub-steps will land
- `~TEFI/IP Brain/TEFI_Service_Architecture.md` — T1–T4 stage codes, used by the pipeline-stage picklist
- `~TEFI/Marketing/TEFI_Brand_Foundation.md` — for white-label parameterisation context (TENANT_REGISTRY)

---

## 1. Purpose of Deliverable 4

Deliverable 1 locked **where state lives**. Deliverable 2 locked **what capabilities the architecture must support in 12–24 months**. Deliverable 3 inventoried **what fields exist today** across all three stores (534 of them). Deliverable 4 is the synthesis: given the locked architecture and the locked vision, design the **target schemas** (Zoho + Career Vault) and the **migration plan** to get from current state to target state without breaking the in-flight pipeline.

The central question this Blueprint scopes for Opus:

> *Given the SSOT split locked in D1, the seven lock-points approved in D2, and the 534-field inventory mapped in D3, what does the post-migration schema look like in Zoho and Career Vault, and what is the step-by-step migration plan — including rollback per step — to get there?*

D4 is the document that turns architectural intent into executable schema. After D4 is approved, the next sessions are routine ops (create custom fields in Zoho, build n8n migration workflows, run cut-over).

**The standing rule from D1 applies:** field-level decisions follow vision-level decisions. Vision-level decisions are locked. D4 is field-level.

---

## 2. The Four Deliverables D4 Must Produce

D4 produces four artefacts. Each section below states the deliverable, points Opus at the source material, lists the open sub-questions Opus must answer, and specifies the output format.

### Deliverable A — Zoho Target Schema

**What to produce:**
A single table specifying every field in post-migration Zoho across Leads, Contacts, and Deals modules. For each field: name (api_name), data type, source SSOT (Zoho-native vs. migrated-from-Registry vs. derived), notes (validation rules, defaults, dependencies). Plus: named ranges, custom modules, pipeline-stage picklist values.

**Source material to consult:**
- D3 Section 2 (Zoho current inventory: Leads 90, Contacts 96, Deals 46)
- D3 Section 5 (35 overlap candidates — every Zoho-implicated overlap must be resolved here)
- D3 Section 6 (four overlapping state machines — pipeline cleanup target is gap 9 from D2)
- D2 Thread 4B (read/write contracts for stages T1.L.2, T1.Q.2, T1.M.1, T1.M.2, T1.P.1)
- D2 Thread 4A (Person_ID field placement: Zoho Lead at first-touch, mirrored to Contact on conversion)
- D1 Lock 1 (what Zoho owns: pipeline state, identity, lifecycle, payment, touch history, deal stage, activity log, task log)

**What Opus must decide here:**
- The Zoho custom fields to create (those needed for capabilities D2 named but the schema does not yet express)
- The Zoho fields to deprecate (custom fields in current inventory that no D2 capability needs)
- The Lead vs. Contact field-level mirror map (D3 Section 6 flags naming drift between modules — resolve)
- The Deal pipeline stage consolidation: 58 current Deal stages → target ~15 stages (gap 9 from D2 Thread 4C). Map each old stage to a new stage or deprecate.
- The pipeline-stage picklist values that port the Gmail label taxonomy from **`~TEFI/Marketing/TEFI_Gmail_Label_Key.md`** into Zoho. The Gmail label taxonomy is the reference vocabulary — Opus must produce the picklist as a Zoho-native list with explicit Gmail-label-to-Zoho-stage mappings (because labels become a derived view post-D4 via n8n). Every label in the Key file maps to exactly one Zoho stage, or is explicitly marked retired.
- Custom modules (if any): the Signal Store from D2 Thread 4C gap 3 is a candidate Zoho custom module (deferred to Q3, but flag the design intent if it affects Lead/Contact field placement now)
- Field-level layout assignments (which custom fields appear in which Zoho layout)

**Output format:**
Markdown table with columns: `field_name | api_name | type | module | source | notes`. One row per field. Append a separate table for the pipeline-stage picklist with columns: `stage_code | display_name | gmail_label_equivalent | entry_trigger | exit_trigger`.

---

### Deliverable B — Career Vault Target Schema

**What to produce:**
The post-migration Career Vault schema. This is the 391-field baseline plus the additions D2 named, minus any fields D3 flagged as duplicating Zoho's territory. For each addition: tab, field name, type, source SSOT, notes.

**Source material to consult:**
- D3 Section 4 (current Vault tabs: PERSON_PROFILE, CAREER_DETAIL, TARGET_ROLE_PACK, OUTPUT_LOG, ADMIN_CONSOLE, INTAKE_LOG)
- D2 Thread 4C, gaps 1, 6, 7 specifically — these are the Q2 priority Vault schema extensions:
  - **Gap 1:** Session outcome capture (Vault SESSION_LOG tab — currently absent)
  - **Gap 6:** Vault maturity index + per-deliverable readiness flags (Vault schema extension — derivations)
  - **Gap 7:** Deliverable lifecycle registry (Vault OUTPUT_LOG populated — currently 14 fields, needs additions to function as a registry)
- D2 Thread 4C gap 2 (Interview outcome capture — INTERVIEW_LOG tab) — flagged by D2 sequencing note as belonging to the same Vault-extension group as gaps 1, 6, 7. Opus should design it together with the Q2 set even if Tate's priority order defers it.
- D2 Thread 1 (Pillar 1 — Career Vault as IP container; vault-health flags, generated fields, refresh cycles)
- D1 Lock 2 (what Career Vault owns: deep candidate data, deliverable content)

**What Opus must decide here:**
- The exact field list for the SESSION_LOG tab (gap 1) — what columns, what types, what populates them and when
- The exact field list for the maturity index (gap 6) — is this a single per-record field, a derived score, or per-deliverable readiness flags? Both? D2 Thread 1 flagged this as ambiguous.
- The OUTPUT_LOG additions (gap 7) — current 14 fields are insufficient as a registry; specify additions
- INTERVIEW_LOG tab design (gap 2 — Q3 priority but designed in the same group)
- Field-level overlap resolution for any of the 35 D3 candidates that touch Vault (e.g. payment date, tier status, target_countries) — for each, decide whether the Vault copy is retired, kept as a synced read, or kept as authoritative for a different concern
- Person_ID placement in Vault PERSON_PROFILE (mirror from Zoho per D2 Thread 4A write pattern)

**Output format:**
Per-tab markdown table with columns: `field_name | type | source SSOT | notes`. One table per affected tab (PERSON_PROFILE additions, new SESSION_LOG, new INTERVIEW_LOG, OUTPUT_LOG additions, etc.). Mark each row as **NEW**, **MODIFIED**, **RETIRED**, or **UNCHANGED** (only show MODIFIED/NEW/RETIRED rows — do not enumerate the entire 391-field baseline).

---

### Deliverable C — Migration Plan (Option D, lazy 2–3 weeks parallel window)

**What to produce:**
Numbered timeline of migration steps from current state to target state, with a specific cut-over Friday in May or June, rollback points per step, and legacy backfill sequencing.

**Source material to consult:**
- D2 Thread 4A "Legacy backfill policy" (lines 449–465 — backfill scoped to ~300–500 active records, dormant deferred)
- D2 Thread 5B "Loss 1: Short-term velocity during the migration window" (mitigation guidance for the 2–3 week dual-store period)
- D2 Synthesis Q7 "When to implement" (line 721 — field must be live in Zoho before any new lead arrives after cut-over)
- Sheets-Zoho Sync Decision Section "Sync Mechanism" (Sheets → n8n → Zoho path; Tate owns prep, Sonnet assists)
- Sheets-Zoho Sync Decision Section "ID Strategy" (~42 active leads in scope; legacy backfill is a future one-off project)
- D2 Thread 4C gap 9 (deal pipeline cleanup — 57 → ~15 stages — explicit migration scope)

**What Opus must decide here:**
- The cut-over Friday (target a specific Friday in May 2026 OR June 2026 — Opus proposes a date with rationale; Tate confirms in the open-question loop)
- The pre-cut-over preparation steps (Zoho custom fields created, n8n workflows authored and dry-run, picklist values populated, layouts updated)
- The cut-over day procedure (sequence of writes, checkpoint verifications, who does what)
- The 2–3 week parallel window operating rules (which writes go where; what to do if Zoho and Sheets disagree; manual reconciliation cadence)
- The rollback point per step — for each numbered step, "if this fails, the rollback action is X and the system returns to state Y"
- The legacy backfill sequencing: ~42 active leads first, then conversion of remaining active records, then dormant-on-reactivation policy for the rest
- The Leads Registry archive procedure (rename with `_ARCHIVED_YYYY-MM-DD` suffix per D1 Lock 3 — when, by whom)
- Pause-list during migration (which automations freeze for the window; per D2 Thread 5B Loss 6, only T-S1 SPLIT and Stripe → Zoho continue)
- The post-cut-over validation checklist (how do we know it worked)

**Output format:**
Numbered timeline. Each step has: `Step N — [action] | Owner | Duration | Pre-conditions | Verification | Rollback`. Group by phase: (1) Pre-cut-over preparation; (2) Cut-over day; (3) Parallel window operation; (4) Backfill; (5) Archive + close-out.

---

### Deliverable D — TENANT_REGISTRY File

**What to produce:**
A new file (separate from the target schema doc) that defines the tenant prefix convention for Person_ID under the white-label model. `TEFI-` is locked for Tate's org. The convention for partner prefixes (e.g. `MIG-`, `XYZ-`) must be specified.

**Source material to consult:**
- D2 Thread 4A "White-label tenant prefix convention" (lines 475–486 — 3–5 character alphabetic prefix, assigned at partner contract sign, immutable once assigned)
- D2 Synthesis Q6 (white-label tenancy interaction with Person_ID; three data-isolation models A/B/C)
- D1 Lock 3 implications for white-label (a Zoho module + Vault template are licensable artefacts)

**What Opus must decide here:**
- The exact file format (markdown registry table, or JSON/YAML structured file?)
- The columns for each tenant entry (prefix, partner_name, contract_date, isolation_model_A_B_C, primary_contact, status, notes)
- The reservation rule (how does a new partner get a prefix that doesn't collide with an existing one)
- The seed entries (TEFI for Tate, plus any reserved prefixes Opus recommends withholding — e.g. ANTHROPIC, TEMP, TEST)
- The naming convention rule itself: 3–5 char alphabetic per D2, but specify case (uppercase per the locked TEFI- example), allowed character set (A–Z only? A–Z + digits? hyphens disallowed?), and collision rule (first-come at contract sign; no override)

**Surface as open question to Tate (do NOT auto-decide):**
The convention for the partner prefixes themselves — whether they should be the partner's own initials/abbreviation chosen by the partner, or assigned by TEFI from a registry. This is open question 1 below.

**Output format:**
Save as `~TEFI/IP Brain/TEFI_TENANT_REGISTRY.md` (or `.yaml` if Opus recommends structured form). Include the convention spec at the top, the reserved-prefix list, and the active-tenant table.

---

## 3. Constraints — IMMUTABLE — Opus Must NOT Reopen

These are decided. Surface them once at the top of the D4 output as "inherited constraints" and do not re-debate them in the body.

1. **Person_ID format: `TEFI-YYYYMM-emailtail`** — locked 2026-04-23 (D1 + D2 Thread 4A). Opus may specify the collision suffix rule (`-01` … `-99`) per D2 Thread 4A — that detail is in scope. The format itself is not.

2. **Three-store SSOT split — Zoho / Career Vault JSONs / Working Sheets** — locked (D1 + Sheets-Zoho Sync Decision). Working Sheets stays alive as a staging/atomic-content layer; it is not a fourth SSOT. Career Vault JSONs are the SSOT for deep candidate content; Sheets are not.

3. **Email = working join key for now** — locked (Sheets-Zoho Sync Decision Section "ID Strategy"). ~99.5 % reliable for the active ~42-lead set. Person_ID is the durable cross-system key but is not yet wired into Sheets.

4. **Person_ID stamping scoped to ~42 active leads** — Opus must scope the migration to those records. Legacy backfill (dormant, years-old contacts) is a future one-off project, not part of D4 (Sheets-Zoho Sync Decision lines 41–44).

5. **Cols AR/AS deprecated; BF.1–BF.3 paused** — Sheets-Zoho Sync Decision lines 28–29. AR (Gmail Label) and AS (Last Email Thread ID) are gone from the incoming Leads Registry pipeline as of 2026-04-25. The BF.1–BF.3 sub-steps in Phase 1 (apply Gmail labels to ~42 leads, populate cols AR/AS) are not executed and not revived.

6. **Gmail labels become a derived view from Zoho via n8n (post-D4)** — D1 Lock 3 + Sheets-Zoho Sync Decision line 64. The Gmail Label System taxonomy ports into the Zoho pipeline-stage picklist as the canonical source; Gmail labels themselves are written by an n8n workflow that reads Zoho stage. The n8n workflow is post-D4 work, not a D4 deliverable — D4 only specifies the Zoho-side picklist that n8n will read from.

7. **The seven D2 lock-points are inherited as approved** (D2 Closing Note lines 731–737). Opus does not re-debate the 10-gap priority order, the MV-WLP artefact list, the "Vault informs, Zoho decides" pattern, the Person_ID format/collision/backfill policy, the Q2 priority set (Vault gaps 1/6/7 + gap 4), the TEFI tenant prefix, or the Option D migration window. D4 implements them.

If Opus believes a constraint above must be reopened to complete D4 coherently, it must stop and surface the conflict to Tate as an open question — not unilaterally reopen.

---

## 4. Open Questions for Opus to Surface Back to Tate (do NOT auto-decide)

Each of these is a decision Tate must make before D4 is approved. Opus presents the trade-off, recommends a default, and lets Tate confirm or override. Opus does not pick.

1. **Tenant prefix pattern for white-label partners.** TEFI- is locked. What is the convention for partner prefixes (`MIG-`, `XYZ-`, etc.)? Sub-questions:
   - Partner-chosen abbreviation vs. TEFI-assigned from a registry?
   - Length spec: 3–5 chars alphabetic (per D2 Thread 4A) — confirmed?
   - Case (uppercase only?), character set (A–Z, or A–Z + digits?), collision rule
   - Reserved prefixes Tate wants to lock out (e.g. TEFI itself, ANTHROPIC, TEST, DEMO)

2. **Career Vault gap priority order — which of gaps 1, 6, 7 first?**
   - Gap 1: SESSION_LOG (session outcome capture)
   - Gap 6: Vault maturity index + per-deliverable readiness flags
   - Gap 7: OUTPUT_LOG population (deliverable lifecycle registry)
   - D2 Thread 4C ranked them 1, 6, 7 and Tate approved that order at the lock-point gate, but D4 is the implementation moment — confirm or re-rank.

3. **Migration cut-over target Friday in May or June.** Option D is a 2–3 week lazy window. Opus proposes a specific Friday with rationale (e.g. low pipeline activity week, post-payment-cycle, no client-facing deliverables that week). Tate picks.

4. **Any missed overlaps in the 35 overlap candidates from D3 Section 5.** Opus reviews the 35 candidates against the D2 capability gap list and asks: are there overlaps not yet flagged that surfaced after D3 was written? (Especially around the four overlapping state machines noted in D3 Section 6.) Tate confirms the list is complete or names additions.

These four questions go at the **top** of the D4 output, in a clearly marked "Open Questions Awaiting Tate" section, not buried at the bottom. Tate reviews them first; the rest of D4 reads cleaner once they are answered.

---

## 5. Operating Mode and Duration

- **Model:** Opus (governance + schema design)
- **Duration:** 2–3 hrs focused session, single sitting preferred. Sleep-on-it gap recommended before Tate commits — D4 changes are higher-cost to reverse than D2's recommendations.
- **Interruption tolerance:** low — schema design is cumulative; field decisions interlock.
- **Output format:** single markdown document, target length 300–500 lines (similar shape to D2 Brief), saved to `~TEFI/TEFI_SSOT_Target_Schema_2026-04-??.md`. The TENANT_REGISTRY (Deliverable D) is a separate file at `~TEFI/IP Brain/TEFI_TENANT_REGISTRY.md`.
- **Tables vs. prose:** schemas are tables (column headers per Deliverable A/B above). Migration plan is a numbered timeline. Open questions and rationale are prose.
- **Review loop:** Tate reviews. Explicit approval required on the four open questions before any custom fields are created in Zoho or any Vault tabs are touched.

---

## 6. Migration-Period Constraints That Affect D4 Scope

The pipeline is in flight. By the time D4 runs, Tate has been writing new leads into Zoho since the weekend after 2026-04-23 (Option D — lazy migration). This affects D4 in three ways:

1. **No freeze-and-rebuild.** D4's migration plan must be applicable to a live pipeline. Steps that require freezing all writes for more than a few hours are non-starters; design around dual-write windows with Zoho-as-winner per D2 Thread 5B Loss 4.

2. **Whatever gaps surfaced in real Zoho usage between 2026-04-23 and the D4 session date are inputs.** If Tate has logged observations in Daily Logs (`01 Daily Logs/`), Opus should skim the most recent 3–5 days. Anything that surfaced as "this Zoho field is missing" or "this picklist value doesn't fit" is an input to the target schema.

3. **The ~42 active leads are the only Person_ID stamping scope.** Anything Opus designs that requires Person_ID on legacy/dormant records is out of scope for D4. Legacy backfill is named in the migration plan as a deferred future project, not executed.

---

## 7. What D4 Must NOT Do

- **Do not re-open D1 locks** (the three SSOT locks). They are the foundation D4 stands on.
- **Do not re-open D2 lock-points** (the seven Tate approved at the D2 Closing Note). They are the vision D4 implements.
- **Do not redesign the Sheets-Zoho sync mechanism.** That decision is locked in the 2026-04-25 file. D4 specifies the Zoho-side schema the n8n workflow writes into; the n8n workflow itself is post-D4 ops.
- **Do not specify n8n workflow code.** D4 names the workflows that need to exist (e.g. Sheets → Zoho migration, Zoho → Gmail label sync) and what they read/write at the field level. The workflow build is a Sonnet ops session after D4.
- **Do not auto-decide the four open questions.** Surface them; recommend defaults; let Tate confirm.
- **Do not produce the legacy backfill script for dormant records.** That is a separate future project. The ~42 active record backfill IS in scope; the dormant export from 2019–2020 is NOT.
- **Do not extend the schema beyond what D2 named as needed.** If D4 surfaces a new capability gap that D2 missed, flag it as a D4-discovered capability, do not silently add fields. Capability decisions belong in D2 territory.

---

## 8. Handoff Instructions for the Opus Session

When Tate (or a scheduled task) opens the Opus session for D4:

1. Open this Blueprint (`TEFI_Deliverable4_Blueprint.md`)
2. Read the five primary context files in Section 0, in order
3. Skim the most recent 3–5 daily logs (per Section 6.2) for any in-flight Zoho-usage observations
4. Produce the four deliverables in order: A (Zoho schema) → B (Vault schema) → C (Migration plan) → D (TENANT_REGISTRY)
5. Place the four open questions from Section 4 of this Blueprint at the **top** of the output document
6. Save outputs to the paths in Section 5
7. Do not proceed to Phase 1.4 sub-step execution — flag the document for Tate review first

---

## 9. Success Criteria

D4 succeeds when:

- A Sonnet ops session can read the D4 output and execute Phase 1.4 (create Zoho custom fields, build n8n migration workflows, run cut-over) without making any architectural decisions.
- Every one of the 35 D3 overlap candidates is resolved (keep / move / merge / deprecate / new) with rationale.
- Every D2 Q2 capability gap (1, 6, 7 + 4 next-best-action) has a corresponding schema decision (extension specified, or explicitly deferred with reason).
- The migration plan has a rollback path at every step. No step is "rollback impossible" without that being called out as accepted risk.
- The TENANT_REGISTRY is implementable — a new partner could be added as a row tomorrow without consulting Tate on the rule.
- The four open questions are answered (by Tate, not Opus) before any custom fields are touched.
- The pipeline-stage picklist in Zoho explicitly maps to the Gmail label taxonomy from `~TEFI/Marketing/TEFI_Gmail_Label_Key.md` — every label has a Zoho stage, every Zoho stage has zero-or-one labels.

D4 fails if:

- It re-opens any of the seven D2 lock-points or the three D1 locks.
- It auto-decides any of the four open questions instead of surfacing them.
- It silently expands scope (new capability gap → new fields without flagging the capability).
- It produces schemas that the migration plan cannot reach with Option D's lazy 2–3 week window.
- It includes the legacy/dormant backfill in scope.
- It specifies n8n workflow code instead of schema contracts.
- The 35 D3 overlap candidates have unresolved entries.

---

## 10. Confidence and Caveats

**High confidence going in:**
- D1 + D2 + D3 + Sheets-Zoho Sync Decision give D4 enough input that schema design is no longer ambiguous in any major way.
- Person_ID is fully specified; D4 only needs to place the field, not design it.
- The Vault Q2 gap set (1, 6, 7) is bounded — three tab-level extensions, not a re-architecture.
- The migration window (Option D) is approved; the mechanism (Sheets → n8n → Zoho) is locked.

**Medium confidence (worth Opus paying attention to during the session):**
- The Lead vs. Contact custom-field naming drift (D3 Section 6) may be deeper than D3 surfaced; expect a 30–60 min sub-task to reconcile.
- The Deal pipeline 58 → ~15 stages consolidation requires opinionated calls — what merges, what disappears, what splits. Tate's input may be needed mid-session if the call isn't obvious from D2 + D3.
- The pipeline-stage picklist mapping to Gmail labels — depends on `~TEFI/Marketing/TEFI_Gmail_Label_Key.md` being in a state Opus can ingest. The file is dated 2026-04-21 (last updated) so it should be current; if any labels were added or modified between then and the D4 session, Opus should reconcile.

**Low confidence / known unknowns:**
- Zoho per-module custom-field quota (D1 caveats Section 10) — if the target schema breaks the quota, schema optimisation goes from "polish" to "constraint-driven."
- Whether n8n's Zoho node handles every field type the target schema uses (especially multi-select, lookups, computed fields). Opus should flag any field type that isn't a known-safe n8n target.
- Whether any of the 35 overlap candidates were re-touched in the days between D3 (2026-04-23) and the D4 session — i.e. does any field that was a candidate now have a definitive single owner because of in-flight migration writes?

---

*End of Blueprint. This document is self-contained — the D4 Opus session can be executed from this Blueprint plus the five primary context files in Section 0. The four open questions in Section 4 are the only blocking decisions; everything else is implementation of locked vision.*
