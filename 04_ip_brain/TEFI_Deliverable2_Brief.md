# Deliverable 2 — Future-Proofing Analysis: Opus Session Brief

**Created:** 2026-04-23
**Preceded by:** `~TEFI/TEFI_SSOT_Architecture_Decision_2026-04-23.md` (Deliverable 1, LOCKED)
**To be run as:** dedicated Opus session, 2–3 hrs focused governance work
**Output:** `~TEFI/TEFI_FutureProofing_Analysis_2026-04-??.md`
**Blocks:** Deliverable 4 (target schema). Does not block Deliverable 3 (field inventory) — those can run in parallel.

---

## 0. Context the Opus Session Must Load Before Starting

Read these files in full before any analysis:

1. `~TEFI/TEFI_SSOT_Architecture_Decision_2026-04-23.md` — Deliverable 1, the locked architecture decisions
2. `TATE_FOCUS.md` — the three-layer stack and this quarter's focus
3. `~TEFI/TEFI_Architecture_Design_2026-04-22.md` — the four-task Opus design document from 22 April
4. `~TEFI/IP Brain/TEFI_Service_Architecture.md` — T1–T4 tier structure
5. `~TEFI/IP Brain/TEFI_Relay_Workflow_Register.md` — 25+ workflow queue for Career Vault deliverables
6. `~TEFI/IP Brain/TEFI_WhiteLabel_Strategy.md` — licensing model, IP protection, partnership approach
7. `~TEFI/Tools/n8n/TEFI_n8n_Pipeline_Brain.md` — current n8n roadmap and connector state
8. `~TEFI/Marketing/TEFI_Brand_Foundation.md` — voice, worldview, standing brand rules (for white-label parameterisation thinking)

Secondary (reference only, don't need full reads):
- `TATE_PHASE_PLAYBOOK.md` — current phase checklist
- `TATE_TIMELINE.md` — 12-month roadmap
- `~TEFI/IP Brain/TEFI_Opus_Architecture_Brief.md` — prior Opus brief (some overlap)
- `~TEFI/TEFI_Full_Field_Map_2026-04-23.md` — Deliverable 3 output (534-field inventory, 35 overlap candidates)
- `01 Daily Logs/[C] 2026-04-23.md` — includes the Person_ID-as-IP decision and Zoho CSV findings

---

## 1. Purpose of Deliverable 2

The SSOT decision (Deliverable 1) locked *where* state lives: Zoho for pipeline/identity/lifecycle, Career Vault for deep candidate data, Gmail labels as derived view. What it did NOT do is answer whether the current *contents* of those stores — the fields, the structures, the capabilities — can support the business Tate is building toward.

Deliverable 2 answers that question.

**The central question:** Given the locked SSOT architecture, does the current schema of Zoho + Career Vault express everything the 3-Pillar Brain and white-label vision need? If not, what's missing? What's gained and lost versus yesterday's vision?

Without this analysis, Deliverable 4 (field-level schema optimisation) would optimise for the present, not the future. Fields would be retained because "we use them today" rather than "they serve the vision." The standing rule from Deliverable 1 applies: **field-level decisions follow vision-level decisions.**

Deliverable 2 IS that vision-level decision-making, formalised.

---

## 2. The Five Threads (from Tate's response to Deliverable 1)

Tate named five investigation threads when approving Deliverable 1. These structure the work.

### Thread 1 — 3-Pillar Brain structure under the new SSOT split

The three pillars as currently designed:
- **Career Vault** (foundation — deep candidate data)
- **Workflow Engine** (production — n8n orchestration across systems)
- **Communication Brain** (learning — templates, signals, outcome feedback)

Under the new SSOT architecture, each pillar changes shape. Investigate:

**Career Vault pillar:**
- Role upgrade from "deep data store among several" to "SSOT for deliverable content." What does that mean for how Relay workflows are designed?
- Vault-Health flags (`vh_core_complete`, `vh_generated_stale`, `vh_null_rate_achievements`, etc.) — are these sufficient as quality signals, or does an SSOT role demand more?
- AI-generated fields (`gen_summary_short/mid/long`, `gen_headline_bank`, `gen_core_value_prop`) — do these have a principled refresh cycle, or are they ad-hoc today?
- Is there a missing layer: "Vault maturity" — a single field summarising whether a client's Vault is ready for a given deliverable? Today this is implicit in Tate's head.

**Workflow Engine pillar:**
- n8n now integrates two SSOTs, not three. Every workflow's read/write contract needs to be explicit. What's the canonical pattern for a workflow that reads from both?
- Is n8n the *only* integration fabric, or does Zoho Flow / Zoho Blueprints take on some of the in-Zoho automation? (Deliverable 1 said yes — Zoho owns in-Zoho, n8n owns cross-system. Verify this holds for every workflow in the Relay Register.)
- Are there workflows currently planned that the new SSOT split makes unnecessary? Are there workflows not planned that the new split *requires*?
- Relay specifically: does Relay read from Career Vault directly, or via n8n? Architectural call.

**Communication Brain pillar:**
- Where do the 197 Zoho email templates live in the new architecture? Zoho's template system + metadata in Zoho fields? Or extracted and stored elsewhere (Career Vault isn't right; a third location undermines the two-SSOT rule)?
- Template *trigger logic* (which template to send when) — this lives in n8n, reading Zoho stage and Career Vault vault-health. Confirm.
- Template *learning loop* — which templates worked, for which client types, at which stages — this is the "learning" part of Communication Brain. Where does the outcome data live? Zoho? Career Vault? Neither is obviously right. This is an unresolved question worth flagging as a known gap.
- Is there a missing layer: a "Signal Store" — captured verbatim quotes from client replies, classified by intent/objection/interest? This currently lives in `Interest Signal`, `Objection Raised`, `Reply Content Summary` columns in the Leads Registry. Under the new architecture, these migrate to... Zoho (as lead/contact fields)? Or a dedicated structure?

**Output for Thread 1:**
A revised diagram of the three pillars showing data flow under the new SSOT. Must identify at least three specific capabilities per pillar that the current schema does not express.

---

### Thread 2 — White-label readiness under the new structure

The Layer 3 vision: licensable methodology stack for immigration agencies. First validated with a friendly partner at low fees.

Investigate:

**The licensable artifact set:**
- Deliverable 1 named three: Zoho module schema + Career Vault template + n8n workflow library. Is this exhaustive?
- Plus: prompt library (the TEFI IP Brain — principles, voice rules, stage-by-stage instructions)
- Plus: brand parameterisation layer — what changes per partner (logo, colour, voice tone, regional language) and what stays fixed (methodology, workflow logic)
- Plus: training materials — how does a partner's operator learn to use the system?

**The parameterisation layer — what flexes per partner:**
- Branding (logo, palette, voice)
- Regional rules (NZ vs AU vs UK vs Canada — visa pathways, role families, salary bands, cultural norms)
- Pricing tiers (some partners may price differently)
- Service catalog (partners may offer T1–T4 or a subset)
- Data residency (partners may require data stays in their country)

**The fixed layer — what is the methodology:**
- The stage spine (T1 → T2 → T3a/b/c → T4)
- The signal detection principles (what counts as a "Questions Received" reply)
- The workflow logic (reply detection → template send → state change)
- The governance model (SSOT rules, division of labour, velocity rule)
- The IP (principles, frameworks, worldview from Brand Foundation)

**Minimum viable white-label product:**
- What's the smallest packageable unit a friendly partner could test?
- Which TEFI workflows have to exist before it's licensable?
- Which workflows are "nice to have" and can be added in version 2?

**Data isolation per partner:**
- Does each partner need their own Zoho org? Or can one org hold multiple partners with data sharing rules?
- Does each partner need their own Career Vault sheet? Almost certainly yes — candidate data is confidential.
- Does each partner need their own n8n instance? Probably yes, for auth isolation.

**Output for Thread 2:**
A minimum-viable-partner checklist (what has to exist before first licensing attempt) and a parameterisation map (what flexes vs. what's fixed). Must include an honest assessment of how far the current TEFI state is from that minimum.

---

### Thread 3 — "Enterprise-level CX at solo cost" — capability requirements

Tate's articulated target: enterprise-grade client experience, delivered by a solo operator at small-business cost, via AI. Investigate what that means in practice, per store.

**Zoho capabilities for enterprise CX:**
- Blueprints (stage-gated workflows with mandatory actions) — useful for enforcing "proposal must include X before send"
- Workflow rules (trigger-based automation inside Zoho) — replaces some n8n logic for in-Zoho events
- Lead scoring — already in Zoho, probably underused
- SLAs — response-time expectations, auto-escalation when breached
- Territory management — irrelevant solo, matters for white-label
- Blueprints + signals combined — "this lead replied with an objection; auto-route to an objection-handling workflow"
- Zia (Zoho AI) — summarisation, prediction, anomaly detection. Currently not used by TEFI. Potentially valuable.

**Career Vault capabilities for enterprise CX:**
- Auto-generated summaries at three lengths — already in schema (`gen_summary_short/mid/long`). Ensures every client interaction has a ready briefing.
- Evidence-strength scoring — partially in schema. Tells Tate which achievements to lead with. Could be richer.
- Vault-health flags — already in schema. Surfaces gaps before they become problems. Strong foundation.
- Missing: session history. Where does "what happened in Session 1" live? Currently Google Docs. Belongs in Career Vault as structured data?
- Missing: interview history. Structured record of each interview, outcome, feedback, pattern detection.
- Missing: signal capture — verbatim quotes, classified by theme, time-stamped. Would enable the learning loop.

**AI-level CX capabilities:**
- Auto-generated personalised email drafts for every stage transition (currently manual or semi-automated)
- Auto-generated deliverable drafts from Career Vault (Relay does some of this already)
- Pre-meeting briefings generated from all available data on a client
- Post-meeting notes auto-structured from voice recording (Zoom → transcript → structured notes)
- Interview prep auto-generated from Career Vault + role description
- "Next best action" recommendation — what should Tate do next for this client/lead?

**What does "solo cost" actually mean:**
- Zoho licensing: ~$30–50/user/month depending on tier. Manageable solo.
- n8n self-hosted or cloud: $20–100/month depending on execution volume
- AI API costs: scale with usage — Claude, OpenAI, or similar for generation tasks
- Total: <$500/month operating cost is reasonable for "solo cost"

**Output for Thread 3:**
A capability matrix: rows are enterprise-CX capabilities, columns are "currently expressed," "possible with current schema but not built," "requires schema extension," "requires new tooling." Must identify the top five high-leverage capability gaps.

---

### Thread 4 — Capabilities current fields don't express (the most important thread)

This thread asks: what should we be able to do that we can't, because the data isn't structured for it?

From Tate's response, the unresolved question is **product development through deal stages** — how does a deal progress, what drives the stage change, what data is consulted at each stage?

Investigate systematically across the T1–T4 lifecycle:

**For each stage code** (T1.L.1 → T1.L.2 → T1.Q.1 → T1.Q.2 → T1.M.1 → T1.M.2 → T1.P.1 → T1.X.1 → T2.* → T3.* → T4.*), answer:

a. What triggers entry into this stage?
b. What must be true about the candidate/client for them to legitimately be in this stage?
c. What actions does Tate (or automation) take in this stage?
d. What signal triggers exit to the next stage?
e. What data from Zoho is read?
f. What data from Career Vault is read?
g. What data is written to Zoho?
h. What data is written to Career Vault?
i. What's the failure mode — how does this stage fail silently?

This is detailed work. Don't do it for every stage — do it for the 5–7 most-used stages, and flag patterns.

**Specific capability gaps to investigate:**

- **Deliverable lifecycle tracking** — per client, which deliverables have been produced, at what stage, with what outcome. Currently folder-based. Where does this belong?
- **Session outcomes** — what was decided, what did the client commit to. Currently Google Docs, unstructured.
- **Interview outcomes** — per interview: role, company, outcome, feedback, what worked, what didn't. Currently nowhere structured.
- **Client trajectory** — is this client accelerating or stalling? Time-series data. Needs derivation from stage change timestamps + activity logs.
- **Signal capture** — verbatim quotes from replies, classified by intent. Partially in Leads Registry (Interest Signal, Objection Raised, Reply Content Summary); migration target unclear.
- **Learning loop** — which templates, sessions, approaches worked? Requires outcome feedback loop that currently doesn't exist.
- **Referral tracking** — who referred whom, referral outcomes. Partial in Zoho.
- **Testimonial capture** — which clients have given testimonials, what did they say, which tier/service does it apply to. Currently in Testimonials_CMSnapshot.xlsx, not linked to client records.

**The core question for Tate's noted concern (product development through deal stages):**

The two candidate architectures Tate surfaced:
- **Both SSOTs contribute** — stage changes can be driven by either Zoho state or Career Vault state. Risk: two-owner field problem.
- **Career Vault informs, Zoho decides** — Tate looks at Career Vault data, makes a judgment call, updates Zoho stage. Career Vault is reference; Zoho is authoritative.

Deliverable 2 must pick one as the default pattern, and identify any stages where the other pattern legitimately applies.

**Identity as IP — Person_ID design (LOCKED 2026-04-23):**

A separate investigation on 2026-04-23 (see Daily Log and CSV analysis of Leads_2026_04_23.csv / Contacts_2026_04_23.csv) confirmed:
- Zoho Leads has NO Person_ID field (hence the COQL failure)
- Zoho Contacts has a Person_ID field created on 2026-04-19 but 0% populated
- Zoho's native Record Id changes on Lead→Contact conversion (Lead retains its ID marked `Is_Converted=true`; new Contact gets a new Record Id; lineage preserved via `Converted_Contact.id`)

**Decision (locked, do not re-open):** TEFI will use a custom Person_ID — not Zoho Record Ids — as the cross-system identity key. Format: year-month + email tail (e.g., `TEFI-202604-akanegbu`). This is classified as **IP**, not infrastructure, for three reasons:

1. **First touch = first value** — the ID is assigned at the earliest point of contact and carries through the entire lifecycle unchanged, even across Lead→Contact→Client transitions.
2. **Metadata compressed into key** — year-month reveals cohort, email tail reveals human. The ID itself tells a story.
3. **Downstream linking maturity** — a portable, human-readable, vendor-independent key survives any CRM migration, supports white-label partners (each can have their own prefix like `PARTNER-202604-...`), and enables deterministic regeneration if ever lost.

**What Deliverable 2 must still resolve about Person_ID:**
- The exact generation rule (collision handling when two people share an email tail, e.g., `j.smith`; proposed: append a 2-digit counter)
- The write pattern at each lifecycle transition — who populates it, when, from where (automation vs. manual vs. hybrid)
- The handling of legacy records (existing Leads and Contacts have no Person_ID — backfill strategy, or leave legacy records without one and enforce going forward?)
- The relationship between Person_ID and the Zoho Record Id (is Zoho Record Id still stored alongside Person_ID as a secondary reference? Almost certainly yes — it's free and useful for Zoho API calls.)
- The white-label parameterisation of the prefix (`TEFI-` for Tate's org; partners get their own prefix — what's the naming convention?)

**What Deliverable 2 must NOT do on Person_ID:**
- Re-open the Path X (use Zoho Record Ids) vs. Path Y (custom Person_ID) decision. Path Y is locked.
- Specify the exact field-level schema (that's Deliverable 4)
- Propose the backfill script (that's Deliverable 4's migration plan)

**Output for Thread 4:**
A stage-by-stage table (for 5–7 key stages) with columns: trigger, entry condition, read/write contracts, exit signal, failure mode. Plus: ranked list of the top 10 capability gaps, with each gap tagged as "Zoho schema extension," "Career Vault schema extension," "new tooling," or "process change, no schema change." Plus: the resolved Person_ID sub-questions above, each with a recommended answer.

---

### Thread 5 — What's gained / what's lost from yesterday's vision

A before/after comparison.

**Gains to articulate:**
- Cleaner data architecture (no three-way overlap)
- More Zoho-native automation (reduces n8n build volume — Zoho already does some of what was planned)
- Clearer licensable product (three artifacts instead of a toolkit)
- Better scaling (Zoho supports multi-user; Sheets-as-CRM doesn't)
- Stronger audit trail (Zoho tracks changes; Sheets barely do)
- Better white-label story (a CRM module is licensable; a pile of Sheets is not)

**Losses to be honest about:**
- The "all in Sheets, maximum flexibility" option — gone. You can't just add a column on a whim.
- Ad-hoc analysis friction — some pivot-table work now requires Zoho reports or n8n-driven Sheet exports.
- Sunk cost — the 52-column Leads Registry took time to build. Most of the design thinking survives (it informs Zoho's custom fields) but the instantiation doesn't.
- Learning cost — Zoho workflow patterns have to be learned or re-learned.
- Short-term velocity loss during migration.

**Mixed (both gain and loss):**
- The discipline of "no field has two owners" is a gain long-term, a constraint short-term.
- The retirement of some scheduled tasks is a gain (fewer moving parts) and a loss (functionality temporarily absent until rebuilt in n8n).

**Output for Thread 5:**
A clean "gains/losses/mixed" comparison table. Honest. No varnish.

---

## 3. The Specific Questions Deliverable 2 Must Answer

In priority order:

1. **What does the 3-Pillar Brain look like under the new SSOT?** (Thread 1) — revised diagram + capability additions.
2. **What capabilities does the current schema fail to express?** (Thread 4) — ranked gap list.
3. **What's the minimum viable licensable product?** (Thread 2) — partner-ready checklist.
4. **What's the default pattern for deal stage progression?** (Thread 4, specific) — decision on the "both contribute" vs "Vault informs, Zoho decides" question.
5. **What enterprise-CX capabilities should Deliverable 4 prioritise building toward?** (Thread 3) — top 5 high-leverage additions.
6. **What's honestly gained and lost in the transition?** (Thread 5) — comparison table.
7. **How does the locked Person_ID design operate in practice?** (Thread 4, identity sub-section) — generation rule, collision handling, write pattern across lifecycle, legacy backfill policy, white-label parameterisation. The IP framing is locked; the operational details are open.

---

## 4. What Deliverable 2 Must NOT Do

- **Do not map individual fields.** That's Deliverable 4. If a thread surfaces "we need a field for X," note it as a capability, not a field.
- **Do not redesign the workflow register.** If Thread 1 reveals workflows that no longer make sense, note them for a future Relay Register revision, don't rewrite the register inline.
- **Do not specify migration sequencing.** That's in Deliverable 4's migration plan.
- **Do not propose schema changes to either SSOT.** Propose *capabilities* that the schema should express. Fields come in Deliverable 4.
- **Do not re-open Deliverable 1's locks.** The three locks are locked. If Thread 2's white-label analysis suggests Zoho is inadequate for some reason, flag it as a caveat to be tested, don't propose a new SSOT.

---

## 5. Operating Mode and Duration

- **Model:** Opus (governance-level thinking)
- **Duration:** 2–3 hrs focused session, single sitting preferred
- **Interruption tolerance:** low — this is cumulative thinking, each thread builds on the last
- **Output format:** single markdown document, roughly 3,000–5,000 words, saved to `~TEFI/TEFI_FutureProofing_Analysis_2026-04-??.md`
- **Review loop:** Tate reviews before Deliverable 4 begins. Explicit approval required on the six priority questions before schema work starts.

---

## 6. Migration Guidance for the Transition Period (NOT part of Deliverable 2, but affects its context)

Tate will be running new leads through Zoho starting this weekend (Option D — lazy migration). This has two implications for Deliverable 2:

1. By the time Deliverable 2 runs, Tate will have 1–4 days of real-world Zoho usage with new leads. Whatever gaps show up in that usage should be surfaced to the Opus session as inputs.
2. Deliverable 2's output must be compatible with a pipeline that is *already running* through Zoho. Recommendations should not require a freeze-and-rebuild approach — they must be applicable as evolution of an in-flight system.

---

## 7. Handoff Instructions for the Opus Session

When Tate (or a scheduled task) opens the Opus session for Deliverable 2:

1. Open this brief (`TEFI_Deliverable2_Brief.md`)
2. Read the eight context files listed in Section 0
3. If Tate has logged any Zoho usage observations since 2026-04-23, read the most recent Daily Log
4. Work through Threads 1–5 in order. Thread 4 gets the most time (roughly 45–60 min).
5. Answer the six priority questions in Section 3.
6. Produce the output document per Section 5's format.
7. Do not proceed to Deliverable 4 — flag it for Tate's approval first.

---

## 8. Success Criteria

Deliverable 2 succeeds when:

- A reviewer who has not been in this process can read the output and understand what capabilities TEFI needs in 12–24 months and why.
- The six priority questions all have answers that aren't "to be determined."
- Thread 4's gap list is specific enough that Deliverable 4 can use it directly.
- Tate can approve or reject each thread independently.
- The vision is future-proofed enough that Deliverable 4's field-level work won't need to revisit vision questions.

Deliverable 2 fails if:

- It reads like a summary of what we already know (it must produce new insight)
- It re-opens Deliverable 1's locks
- It proposes fields before capabilities
- It hedges on the six priority questions
- It overlooks the transition-period constraint (new leads already running through Zoho)

---

*End of brief. This document is self-contained — a future Opus session can execute Deliverable 2 from this brief alone, without needing to re-derive the scope.*
