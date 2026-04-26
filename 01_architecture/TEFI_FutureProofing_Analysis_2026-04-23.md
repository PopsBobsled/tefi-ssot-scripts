# TEFI Future-Proofing Analysis

**Status:** DRAFT — Deliverable 2 of 4 in the SSOT governance work stream
**Date:** 2026-04-23
**Model:** Opus governance session
**Preceded by:** `TEFI_SSOT_Architecture_Decision_2026-04-23.md` (Deliverable 1, LOCKED)
**Informed by:** `TEFI_Full_Field_Map_2026-04-23.md` (Deliverable 3, complete)
**Blocks:** Deliverable 4 (target schema design)

---

## Executive Summary

This document answers seven governance questions that, together, define what TEFI's two SSOTs (Zoho CRM and Career Vault) must do to carry the business from its current solo-operator form through the 3-Pillar Brain and into the white-label methodology stack.

The seven answers are summarised here for fast reference; the rest of the document shows the work.

1. **3-Pillar Brain under new SSOT** — Career Vault becomes the IP-bearing pillar (schema + content), Zoho becomes the operational pillar (state + relationships), Gmail becomes the surface pillar (communication + reflection). n8n is the conductor between them. Nine capabilities are missing today, distributed three per pillar.

2. **Capability gaps** — Ten gaps ranked. The top three: structured session-outcome capture, interview-outcome records, and a signal store for verbatim client quotes. None require schema acrobatics; all require a deliberate home.

3. **Minimum viable white-label product** — One tier (T3a: Strategic Profile Programme) delivered end-to-end via the workflow engine, with partner-swappable branding on documents. Five gates must close before first partner: A2, B1, C2, C3, C12 workflows live, plus the brand-parameterisation layer.

4. **Default pattern for deal stage progression** — "Career Vault informs, Zoho decides." Zoho stage transitions are always human-authored or n8n-authored-with-Zoho-rules. Career Vault is consulted as evidence but never writes stage directly. One narrow exception: Vault-Health flags can auto-block (not auto-advance) stage transitions.

5. **Top 5 enterprise-CX capability gaps to build toward** — (1) next-best-action recommendation per client; (2) pre-meeting briefing auto-generation; (3) interview-outcome structured capture; (4) deliverable lifecycle tracking; (5) learning loop for template and session performance.

6. **Gains and losses** — Gains dominate. Primary loss is short-term velocity during migration and ad-hoc pivot-table friction. Biggest gain is architectural coherence that makes white-label plausible rather than aspirational.

7. **Person_ID operational mechanics** — Format confirmed: `TEFI-YYYYMM-{emailtail}`. Collision handler: two-digit suffix. Write pattern: first-touch automation with manual fallback. Legacy policy: enforce going forward; backfill opportunistically during migration, not as a blocking step. White-label prefix: partner-slug replaces `TEFI`.

The remainder of this document develops each of these answers in the depth Deliverable 4 needs to consume them.

---

## Thread 1 — The 3-Pillar Brain Under the New SSOT

The 3-Pillar Brain was designed before the SSOT split was explicit. Under the old design each pillar was a *function* — Career Vault held deep data, Workflow Engine orchestrated, Communication Brain handled templates. The pillars were not tied to stores; they cut across all three.

The new SSOT lock creates a sharper definition. Each pillar now has a primary store, a primary role, and a clear relationship to the others. The pillars become less about function and more about **where authority lives for that pillar's job**.

### The revised pillars

```
            ┌─────────────────────────────────────────────────────┐
            │  PILLAR 1 — CAREER VAULT (IP pillar)                │
            │  Primary store: Career Vault (Google Sheets)        │
            │  Owns: methodology, content IP, deliverable logic   │
            │  Role: the brain. Knows what a good CV looks like,  │
            │        what a SAM report requires, what evidence    │
            │        makes an achievement credible.               │
            └──────────────────────┬──────────────────────────────┘
                                   │ informs
                                   ▼
            ┌─────────────────────────────────────────────────────┐
            │  PILLAR 2 — ZOHO CRM (operations pillar)            │
            │  Primary store: Zoho (Leads, Contacts, Deals)       │
            │  Owns: pipeline state, identity, lifecycle, money   │
            │  Role: the nervous system. Tracks where each person │
            │        is, what should happen next, when it's due,  │
            │        whether it happened.                         │
            └──────────────────────┬──────────────────────────────┘
                                   │ triggers
                                   ▼
            ┌─────────────────────────────────────────────────────┐
            │  PILLAR 3 — COMMUNICATION SURFACE                   │
            │  Primary store: Gmail + Drive (derived views)       │
            │  Owns: outbound communication, inbound signal       │
            │        capture, deliverable delivery                │
            │  Role: the skin. Where humans (clients, partners)   │
            │        interact with the system. Reflects state,    │
            │        never defines it.                            │
            └──────────────────────┬──────────────────────────────┘
                                   │ feeds back
                                   ▼
                      Signal → Zoho (new state)
                                   │
                                   ▼
                      Vault updates (new content)

            n8n is the conductor between all three.
            It never decides anything — it moves decisions
            from the pillar that made them to the pillars
            that need to know.
```

### Pillar 1 — Career Vault (the IP pillar)

Under the old design this was "deep data about a candidate." Under the new design it is something more: it is **where TEFI's methodology is encoded**. The 391-field schema is not a data structure — it is a theory about what makes a skilled migrant employable. Every field represents a judgment TEFI has made about what matters.

This reframing changes what the pillar must do.

**Role upgrade implication.** Relay workflows do not just "read from" the Vault — they *execute* methodology the Vault encodes. When A2 generates a CM Report, it is running TEFI's report-making logic over TEFI's evidence-collection schema. The Vault is not a data source for the workflow; the Vault is the workflow's operating system.

**Three capabilities missing today:**

1. **Deliverable readiness index.** Today Tate knows, by looking at a Vault row, whether the client is ready for a given deliverable. A human holding the picture. The index does not exist as a field. A candidate with `vh_core_complete = false` and `vh_null_rate_achievements > 40%` is not ready for a SAM Report, but there is no single field that says "SAM Report: not ready." This is a derivation job — the input fields exist, the output does not. Deliverable 4 should create a set of readiness flags (one per deliverable) that Relay workflows check before firing.

2. **Vault maturity score.** A scalar 0–100 that summarises "how rich is this candidate's Vault profile." Used at session boundaries ("Session 1 is complete when maturity reaches 40"), at deliverable gating, and for reporting. Today this score lives in Tate's head and is re-derived each time he opens a Vault row. It should be a single formula cell, derived from existing health flags and null rates, written as a column.

3. **Generated-content refresh policy.** The `gen_*` fields (gen_summary_short/mid/long, gen_headline_bank, gen_core_value_prop) are generated once and then sit. When Tate updates a client's achievement set in Session 3, the generated summary from Session 1 is now stale. The schema records when the generated content was last refreshed (`gen_updated_at`) but does not policy when it should refresh. This becomes an automation gap — n8n cannot know when to re-run the summary generator.

**Vault pillar in the white-label context.** The Vault schema itself is the licensable artifact. When a partner licenses TEFI, they receive a blank Career Vault template pre-configured with the 391-field schema. They never see Tate's candidate data. The methodology is in the schema; the confidentiality is in the data.

### Pillar 2 — Zoho CRM (the operations pillar)

Under the old design Zoho was "the CRM we had before we built the sheets." Under the new design it is the **operational nervous system**. Every transaction, every state change, every due date, every payment, every referral lives in Zoho.

**Role sharpening implication.** Zoho is not just a store — it is the decision surface. When Tate wonders "who should I follow up with today?" the answer is a Zoho view. When n8n needs to decide "is it time to send a day-7 nudge?" the answer is a Zoho date field. When a white-label partner asks "how many active deals do I have?" the answer is a Zoho report.

**Three capabilities missing today:**

1. **Deal progression observability.** The Deal pipeline has ~57 stages (per the Zoho hygiene check this morning), many legacy, some cryptic. A client can be in stage `Closed Won_ Don't know` and no one can say with confidence what that means. The capability gap is not "fewer stages" — it is observability into why each stage exists, what the entry/exit conditions are, and who last moved a deal through it. Deliverable 4 should produce a stage decommission list, a stage consolidation map, and stage-level documentation (even if in a Zoho custom field on the Deal: `Stage_Semantic_Notes`).

2. **Activity-to-outcome attribution.** Zoho records activities (calls, meetings, emails) but does not link them to outcomes. A client who converts does so after some set of touches; the schema does not let Tate query "which touch sequence most reliably converts T1.Q.2 leads?" This is the foundation of the learning loop (Pillar 3, Capability 3 below) and it needs Zoho's cooperation — specifically, an `Outcome_Attributed` lookup field on Activity records pointing at the Deal stage transition they drove.

3. **White-label tenancy layer.** Zoho has no concept today of "this lead belongs to Partner X, not TEFI direct." When white-label launches, either each partner gets their own Zoho org (expensive, management-heavy) or the current Zoho org gets a `Tenant_ID` field on Lead/Contact/Deal and every view, workflow, and report filters by it. Deliverable 4 should decide this architecturally. My recommendation is single-org with Tenant_ID, with strict Zoho sharing rules — but it is a non-trivial build.

**Zoho pillar in the white-label context.** The Zoho custom-module definitions (custom fields, picklist values, workflow rules, blueprints) are the licensable artifact. When a partner licenses TEFI, they receive a Zoho export file that configures their Zoho org identically. The configuration is the methodology; the data is theirs.

### Pillar 3 — Communication Surface (Gmail + Drive)

Under the old design this was "Communication Brain — templates and signals." Under the new design it is something more architecturally honest: it is **the surface where humans encounter the system**. It has no authority — it is entirely derived. But it is where the business actually happens. Clients never see Zoho or Vault. They see emails, documents, shared folders.

**Role sharpening implication.** The Communication Surface is the *only* pillar clients and partners touch. Every architectural decision in Pillars 1 and 2 is invisible to them. This means the surface must be coherent regardless of what the SSOTs look like under the hood. The surface's quality is the *experience of the business*.

**Three capabilities missing today:**

1. **Signal Store.** When a lead replies to T-S1 with "I'd like to understand pricing first" — that sentence is gold. It is an objection, a signal, a potential pattern. Today it lives as a fragment in a Leads Registry column (`Reply Content Summary`) or sometimes in a manual Zoho Note. It is not structured, not classified, not searchable at scale. The Signal Store is a schema for capturing verbatim quotes from inbound messages, tagged by intent (objection, interest, question, confirmation), client stage, and resulting outcome. It lives in Zoho as a custom module (`Signals`) linked to Lead/Contact. n8n writes to it from reply-detection workflows. Over time it becomes the corpus that trains the Communication Brain.

2. **Template-outcome attribution.** Today Tate has 197 email templates. He does not know, for any of them, its reply rate, conversion rate, or win contribution. The templates are shipped and forgotten. For the Communication Brain to actually *learn*, every send must be linked to its eventual outcome — an `Emails_Sent` record with `Template_ID`, `Person_ID`, `Send_Time`, `Outcome_Attribution`. This is adjacent to Pillar 2 Capability 2 (activity-to-outcome attribution) but specifically for emails and specifically for template performance.

3. **Deliverable delivery registry.** When a CM Report or SAM Report goes out, where is it recorded? Today it is in a Google Drive folder, named per client, possibly linked from a Leads Registry cell. There is no authoritative record of "this deliverable, for this client, at this stage, delivered at this time, acknowledged by them at this time." The `OUTPUT_LOG` tab in Career Vault has a 14-column header but no rows — this is the right place for the capability, it just hasn't been populated. Deliverable 4 should make OUTPUT_LOG a mandatory write for every deliverable produced, with n8n doing the write automatically from A-series and C-series Relay workflows.

**Communication Surface in the white-label context.** This is the most parameterisable of the three pillars. The templates, the folder structures, the document branding — all per-partner. The schemas above (Signal Store, Template Attribution, Deliverable Registry) are fixed; the content they hold is per-tenant.

### n8n — the conductor (not a fourth pillar)

n8n is frequently mis-described as a pillar. It is not. A pillar owns something. n8n owns nothing — it moves data between the three pillars and triggers workflows based on state changes. Architecturally this is a **conductor** pattern, not a store pattern.

The rule that makes n8n safe: **n8n does not make decisions.** When a Lead replies to a CV Questions email, n8n does not decide "this is a Questions Received signal" — the classification rule is defined elsewhere (in a Zoho workflow rule, in a Vault schema constraint, or in Tate's manual judgment). n8n sees the classification happen, propagates its consequences to the other pillars, and writes an audit record.

This distinction matters for white-label: a partner licensing TEFI's system gets the n8n workflow library, but the decisions inside those workflows are expressed as configurations (in Zoho rules, Vault formulas) that the partner can adapt to their context without reading n8n JSON.

### Capability count

Nine capabilities listed across three pillars, three each. This is intentional — each pillar has the same number of growth gaps, which is a proxy for "the architecture has no structural favourite." If one pillar had eight gaps and another had one, it would suggest the schema was accidentally optimised for that one pillar.

The nine gaps are ranked in Thread 4's consolidated top-10 list.

---

## Thread 2 — White-Label Readiness Under the New Structure

White-label is Layer 3 of the stack. The existing White-Label Strategy document frames it as a three-model progression: referral → co-brand → full licence. Deliverable 2's job is not to re-design that progression but to answer: **what has to be true about the system for the first partner attempt to be possible?**

### The licensable artifact set — confirmed and extended

The SSOT Decision document named three artifacts: Zoho module schema, Career Vault template, n8n workflow library. After working through Thread 1, the list is more properly **six artifacts**, packaged together as "the TEFI methodology stack."

| # | Artifact | What it is | Where it lives today | Licensable form |
|---|---|---|---|---|
| 1 | Zoho module configuration | Custom fields, picklists, workflow rules, blueprints for Leads/Contacts/Deals | Zoho org (TEFI's instance) | Export as JSON configuration file; import into partner's Zoho org |
| 2 | Career Vault template | The 391-field schema, tab structure, formulas | Google Sheet (TEFI's instance) | Empty Google Sheet template, partner-copied to their Drive |
| 3 | n8n workflow library | 25+ workflows in the Relay Register, plus the Half A/B pipeline | n8n instance (TEFI's) | JSON export of workflow definitions, import into partner's n8n |
| 4 | Prompt library | All AI prompts for Relay workflows | Relay + text files in `~TEFI/Tier1/` and elsewhere | Version-controlled text files, delivered as part of onboarding |
| 5 | Brand parameterisation layer | The set of variables partners configure (logo, colour, voice tone, regional phrases) | Not yet extracted — currently baked into templates | A partner-config file (e.g. `partner_config.yaml`) read by document generators |
| 6 | Operator training materials | How a partner's person learns to use the system | Not yet produced | One-day training deck + 10-page runbook + first-30-days playbook |

**Artifact 5 is the most underdeveloped.** Today TEFI's voice, colour, language, and regional defaults are distributed across template files, prompt strings, and hardcoded strings in Relay workflows. A partner cannot "swap their brand in" because the brand is not extracted as a separate layer.

**Artifact 6 does not exist at all.** Not a blocker for Model 1 (referral) but a hard blocker for Models 2 and 3.

### The parameterisation map — what flexes, what stays fixed

This is the decision that determines whether partners get a *product* or a *toolkit*. A product has a fixed methodology and a flexible brand. A toolkit has both flexible.

**Fixed layer (IP — partners receive, do not modify):**

- The tier architecture (T1 → T2 → T3a/b/c → T4)
- Stage codes (FP_, EE_, S1a-S3e, etc.) — the process spine
- Career Vault schema (the 391 fields and their meaning)
- Relay prompt logic (the *structure* of prompts, not the final strings)
- Signal classification taxonomy (when reply-detection is built)
- The methodology principles in the IP Brain folder (voice, worldview, service philosophy)
- The 10-Point CV Analysis System
- The deliverable templates' structure (sections, order, what each section must contain)

**Flexible layer (brand / regional — partners configure):**

- Logo, colour palette, typography (document headers, email signatures)
- Company name, contact details, support email
- Regional specifics: target countries' visa rules, salary bands, role family mappings
- Language defaults (English-NZ, English-AU, English-UK, English-CA)
- Pricing (each partner sets their own)
- Service catalog (partner may offer T1–T3 only, or T4 only, or custom subsets)
- Email template final strings (partner can rewrite the English; the logic stays)
- Partner-specific workflows (partner adds 1–3 workflows for their unique processes)

**Mixed layer (fixed structure, flexible content):**

- Session structures (S1 covers Strengths; partner can re-voice the client-facing script but can't skip Strengths)
- Deliverable templates (every SAM Report has the same 6 sections; partner can re-voice the headers)
- Reply detection rules (the classification taxonomy is fixed; the exact email patterns triggering each class are partner-tunable)

This three-tier parameterisation is what makes TEFI "a licensable methodology" rather than "a set of useful tools." A partner cannot become a TEFI partner and deliver a different service — they can deliver TEFI's service *in their voice*.

### Minimum viable white-label product (MV-WLP)

The central question: **what is the smallest coherent thing TEFI can offer a partner, such that the partner can deliver meaningful value to their own clients, without TEFI being involved in each delivery?**

My recommendation: **T3a (Strategic Profile Programme) delivered end-to-end.**

Reasons for choosing T3a specifically:

- T3a has clear, scoped deliverables (Premium CV Plus, SAM Report, Career Impact Report, Cover Letter System, Labour Market Prospects, Job Target Segmentation, Launch Plan)
- It is a 2–3 session programme, not open-ended like T4. Bounded = licensable.
- It requires the market intelligence capabilities that differentiate TEFI (Prospects Report, Job Target Segmentation) — this is what a partner can't assemble themselves from generic templates, which is why they would pay for it.
- It sits at a mid-price point ($1,200 USD-ish) — generous margin for partner and TEFI.
- Delivering T3a requires only A2, B1, C2, C3, C6, C7, C12, C13 workflows (eight workflows, not the full 25+).
- If T3a succeeds as a white-label product, T3b and T3c are additive, not architectural.

### Pre-first-partner gate list

For Model 1 (referral), TEFI is already open for business — nothing new is required. The question is Model 2 (co-brand).

Before the first co-brand partner, these must all be true:

1. **A2 workflow live and stable.** 14 consecutive successful CM Reports, no prompt drift, zero Tate re-work.
2. **B1 workflow live and stable.** 10 consecutive Session 1 Preps, Tate approves without edits.
3. **C2 workflow live and stable.** 5 consecutive SAM Reports, quality score ≥8.
4. **C3 workflow live and stable.** 5 consecutive Career Impact Reports, Tate approves without edits.
5. **C12 workflow live and stable.** 3 consecutive Labour Market Prospects Reports (the T3a differentiator).
6. **Brand parameterisation layer extracted.** A `partner_config.yaml` exists, is read by Relay workflows, and can swap TEFI branding for a test partner's branding in at least one document (e.g. SAM Report).
7. **Partner agreement template drafted and legally reviewed.** Not optional. $500–$1,500 NZD.
8. **One-page partner pitch document.** For the first-conversation ask.
9. **Pricing locked.** The $200/client or $500/month figures need to be validated once, not assumed.
10. **IP documentation complete.** Every file in `~TEFI/IP Brain/` has date-stamp, copyright notice, and is saved to version control (Git repo, even if private).

**Current state vs. these gates:**

| Gate | Status | Estimated time to close |
|---|---|---|
| A2 stable | 🔄 Built, not tested at scale | 2–4 weeks of real use |
| B1 stable | ⏳ Not yet built | 2–3 days build + 2 weeks validation |
| C2 stable | ⏳ Not yet built | 3–5 days build + 2 weeks validation |
| C3 stable | ⏳ Not yet built | 3–5 days build + 2 weeks validation |
| C12 stable | ⏳ Not yet built | 5–10 days build (research prompt) + 4 weeks validation |
| Brand param layer | ⏳ Not yet extracted | 3–5 days engineering |
| Partner agreement | ⏳ Not drafted | 2 weeks (legal round-trip) |
| Pitch doc | ⏳ Not written | 1 day |
| Pricing locked | 🟡 Exists in White Label Strategy, not validated | Validation conversation with a friendly |
| IP documentation | 🟡 Partial (files exist, Git repo does not) | 1 day setup |

**Honest assessment:** first co-brand partner is **12–16 weeks away** from today, not 6–8 weeks as the White Label Strategy suggests. The gap is workflow stability, not legal or commercial. Five workflows (A2 through C12) need to be built and validated; they are Layer 2 work, not Layer 3 work.

**Implication:** Layer 3 (white-label) cannot move independently of Layer 2 (3-Pillar Brain maturation). The quarterly focus on T4 Chain is directly the pre-work for white-label readiness — if Half A and Half B land in Q2 as planned, the white-label gate-list becomes achievable in Q3.

### Data isolation per partner

This is the architectural question that will become urgent the moment the first partner signs. Three options:

**Option A — Single Zoho org with Tenant_ID field.** One Zoho org, every record tagged with `Tenant_ID = 'tefi'`, `Tenant_ID = 'partner_a'`, etc. All views, workflows, and reports filter by Tenant_ID. Zoho sharing rules prevent one tenant's users from seeing another tenant's records.

*Pros:* Lowest cost, easiest maintenance, single source of truth for methodology improvements. *Cons:* Zoho sharing rules can leak. Any TEFI schema change affects all partners simultaneously (good for consistency, bad for customisation). Scales to maybe 10–20 partners before Zoho's limits bite.

**Option B — One Zoho org per partner, TEFI operates.** Each partner has their own Zoho org; TEFI is an admin user on all of them. Partners pay for their own Zoho licence.

*Pros:* Strong isolation. Natural tenancy. Partner owns their data outright. *Cons:* TEFI manages many orgs (admin overhead). Schema updates must be rolled out to each org. Cost per partner higher.

**Option C — Partner operates their own Zoho org; TEFI licenses the configuration.** Each partner has their own Zoho org and administers it. TEFI delivers a configuration file and a training deck.

*Pros:* Maximum partner independence. No operational overhead on TEFI. Aligns with white-label "they run it, we licensed it." *Cons:* TEFI has no observability into partner performance. Hard to enforce methodology drift. Support is partner-managed.

**Recommendation:** Start with **Option B** for partner 1–3 (control + learning), migrate to **Option C** for partner 4+ (scale + independence), skip **Option A** (unless a single-partner-plus-TEFI-direct split proves painful, in which case it becomes a stopgap).

Career Vault isolation is simpler — each partner gets their own Google Sheet (copy of the template). No shared data. The Google Sheet structure supports this natively.

n8n isolation depends on hosting: self-hosted n8n allows multi-tenant configurations but security is the operator's problem; n8n Cloud requires one instance per tenant (or careful credential isolation). Recommendation: each partner gets their own n8n instance, at their cost, with TEFI providing the workflow JSON export.

### White-label readiness summary

TEFI is closer to white-label than the White Label Strategy claims for Model 1 (referral — now) but further than it claims for Model 2 (co-brand — 12–16 weeks, not 6–8). The blockers are not governance or legal — they are workflow-stability blockers. The same Layer 2 work that matures the 3-Pillar Brain also gates Layer 3.

This is the right outcome: Tate's Q2 focus on T4 Chain is *simultaneously* the pre-work for white-label. Nothing needs to be added to this quarter's plan to make it happen. What needs to be added to **next quarter's** plan is the brand-parameterisation layer, the partner-agreement legal work, and the first-partner-conversation script.

---

## Thread 3 — Enterprise-CX at Solo Cost

Tate's articulated target: **enterprise-grade client experience, delivered by a solo operator, at small-business cost, via AI.**

This phrase packs three different promises. Let me unpack them:

- **Enterprise-grade CX** — every client feels well-prepared-for, remembered, and guided. No "who are you again?" moments. Personalised at every touch.
- **Solo operator** — Tate is the only human in the loop, other than contract-based engineering help.
- **Small-business cost** — total tool spend under ~$500/month (per the brief).

The tension between these three is obvious: enterprise CX usually requires a team of account managers. Solo + enterprise-CX is only possible if AI does 80–90% of what an account manager does, reliably, at low cost.

This thread inventories what "enterprise CX" actually means operationally, and which parts of it the current TEFI stack can deliver, could deliver with schema extension, or require net-new tooling.

### Capability matrix

The matrix has four columns: the capability, current state (built / partial / not built), what's needed to complete it, and estimated effort.

| # | Capability | Current state | What's needed | Effort |
|---|---|---|---|---|
| **Personalisation** | | | | |
| 1 | Know who each client is at every touch | ✅ Built (Career Vault) | — | 0 |
| 2 | Remember what we last spoke about | 🟡 Partial (Google Docs, unstructured) | Session outcome schema in Vault (new tab `SESSION_LOG`) | 2–3 days |
| 3 | Tailor deliverable content to client voice | ✅ Built (Vault-driven Relay prompts) | — | 0 |
| 4 | Tailor email tone to client preference | ⏳ Not built | Zoho field `Communication_Tone_Preference` + prompt variants | 1 day |
| **Proactivity** | | | | |
| 5 | Flag clients who are stalling | 🟡 Partial (manual) | n8n job reading Zoho `Last_Activity_Time` + stage; flags inactivity >14 days | 1 day |
| 6 | Surface "next best action" per client | ⏳ Not built | Stage-to-action map + daily Sonnet briefing pulling Zoho + Vault | 3–5 days |
| 7 | Prepare Tate for any meeting, auto-generated | ⏳ Not built | Pre-meeting briefing workflow (Zoho trigger → Sonnet → doc) | 2–3 days |
| 8 | Draft responses to inbound emails for review | 🟡 Partial (manual through Sonnet) | n8n + Sonnet integration reading Signal Store context | 3–5 days |
| **Quality consistency** | | | | |
| 9 | Every deliverable meets a baseline standard | ✅ Built (Relay prompts + QC review) | — | 0 |
| 10 | Every client gets the same prep quality regardless of volume | 🟡 Partial (Tate is bottleneck) | B1–B5 session prep workflows — in Relay Register | 5–10 days per workflow |
| 11 | No client dropped through the cracks | 🟡 Partial (Gmail labels help) | Zoho workflow rule: daily `no_contact_14d` alert | 0.5 days |
| 12 | Every outbound email quality-checked | 🟡 Partial (T-S1 auto, others manual) | Template library maturation (Q2.6 in Focus) | Ongoing |
| **Intelligence** | | | | |
| 13 | Know what's working (templates, sessions) | ⏳ Not built | Activity-to-outcome attribution (Pillar 2 Cap 2) | 5–10 days (ongoing) |
| 14 | Pattern-detect across clients | ⏳ Not built | Signal Store (Pillar 3 Cap 1) with aggregation queries | Requires Signal Store |
| 15 | Predict which leads will convert | ⏳ Not built | ML on signals + historical conversion data (post-volume) | 6+ months out |
| 16 | Benchmark client progress against cohort | ⏳ Not built | Vault maturity scoring (Pillar 1 Cap 2) with cohort tags | 3–5 days |
| **Scale** | | | | |
| 17 | Handle 3× current client volume without proportional time cost | 🟡 Partial (A2 does some) | B and C series workflows (Relay Register) | The whole Q2/Q3 plan |
| 18 | Handle white-label partner clients without Tate doing QC | ⏳ Not built | Automated QC scoring on deliverables, partner-level QC training | 12+ months |
| 19 | Onboard a new partner without Tate being the bottleneck | ⏳ Not built | Training materials + self-serve setup | Whole new project |

### The top 5 high-leverage gaps

From the matrix above, the five capabilities that deliver the most "enterprise-CX at solo cost" per dollar / day of engineering are:

**1. Next-best-action recommendation per client (Capability 6).** This is the single highest-leverage capability in the list. Today Tate decides manually "who should I reach out to today?" by scanning Gmail labels, reviewing a spreadsheet, and remembering context. Automating this into a morning briefing ("Here are the 7 clients that need action today, and here's what to do for each one") replaces 30–60 minutes of daily cognitive load with a 5-minute review. It compounds: the first client gets action 30 minutes sooner, the seventh gets action that would otherwise have been deferred to tomorrow. Build cost: 3–5 days of Sonnet + n8n work. Dependencies: Zoho stage + Vault maturity fields must exist.

**2. Pre-meeting briefing auto-generation (Capability 7).** Tate has 10–15 one-on-ones and 2 group meetings per week. Before each, he currently refreshes his memory on the client by opening the Vault row, scanning prior session notes, reviewing their CV. This is ~10 minutes per meeting × 15 meetings = 2.5 hours per week. A pre-meeting briefing auto-generated the night before (Session 1 Prep, interview prep, post-meeting recap) turns this into 2.5 hours of reading *well-structured* material, or 30 minutes of skimming it if time-pressed. Build cost: 2–3 days. Dependencies: Vault session outcome schema (Capability 2) must be partially populated.

**3. Interview-outcome structured capture (maps to Thread 4 gap).** Every client interview that happens in T4 is currently a dead data point. Tate asks "how did it go?" in the next session. The information is captured in Google Docs, unstructured. A short structured form — role, company, outcome, feedback-if-rejected, what worked, what didn't — writes to Career Vault (tab: `INTERVIEW_LOG`). Over time this becomes a corpus of NZ/AU hiring signals specific to TEFI's client base, which is genuinely proprietary IP. Build cost: 1 day schema + 2 days workflow. Dependencies: none.

**4. Deliverable lifecycle tracking (maps to Thread 4 gap).** A client's deliverables are produced across time. Today there's no single view of "what has been produced for this client, when, at what stage, with what outcome." This matters for: (a) Tate's next-action decisions, (b) client-facing transparency (can Tate send a client "here's everything I've produced for you"?), (c) white-label partner reporting. Build cost: 1 day schema (populate OUTPUT_LOG tab in Vault) + automation from each Relay workflow to write to it. Dependencies: Relay workflows A2, B1, C2 must be live.

**5. Learning loop for templates and sessions (Capability 13).** Without attribution data, TEFI cannot improve its own templates or sessions at scale. With attribution, after 6 months of use, Tate can answer questions like "which CV Questions template gets the highest reply rate?" "Does the Strengths-first approach in Session 1 correlate with higher T3/T4 upgrade rate?" "Which email in the nudge sequence is load-bearing?" This is the core data-flywheel that makes TEFI progressively better at what it does. Build cost: 2–3 days schema + ongoing instrumentation in every workflow. Dependencies: Pillar 2 Capability 2 (activity-to-outcome attribution) and Pillar 3 Capability 1 (Signal Store).

### Cost envelope

Enterprise-CX at solo cost requires holding total operational tool spend below ~$500/month. Current allocation:

| Tool | Role | Monthly cost |
|---|---|---|
| Zoho CRM Professional | SSOT for pipeline | ~$35 USD |
| Google Workspace | Vault + documents + Gmail | ~$20 USD |
| n8n Cloud | Integration fabric | ~$50 USD (scales with volume) |
| Relay | Document generation AI | Currently free tier (~$50–100 USD expected when paid) |
| Claude API (via Cowork) | Reasoning, drafting | ~$100–200 USD depending on usage |
| Buffer | Social scheduling | ~$15 USD |
| Canva | Design | ~$15 USD |
| Stripe | Payments | % of revenue, not fixed |
| **Total fixed** | | **~$235–435 USD/month** |

Headroom exists for one or two more tools without breaching the envelope. At white-label scale (Benchmark 3 in the strategy doc — 240 deliveries/month), the cost profile changes, but that is 18–24 months out.

### What this thread does not say

It does not say TEFI today delivers enterprise-CX. It says TEFI delivers personalisation (the hardest part) and quality consistency (via Relay), but lags on proactivity and intelligence. The top 5 gaps above are the proactivity and intelligence gaps — building them across Q2 and Q3 would close the majority of the enterprise-CX promise.

---

## Thread 4 — Capability Gaps and Person_ID Mechanics (core thread)

This thread does three things in sequence: (a) resolves the Person_ID mechanics question Tate asked be answered first; (b) resolves the default pattern for deal stage progression; (c) presents the consolidated top-10 capability gap list.

### 4A — Person_ID Operational Mechanics (Question 7, answered first)

The Deliverable 1 document locked that Person_ID is a custom field and serves as the cross-system join key. The Deliverable 2 brief update locked the format as year-month + email tail, and the IP framing. This section answers the four open operational questions.

#### Format specification (final)

```
Person_ID format:  {TENANT}-{YYYYMM}-{SLUG}[-{COLLISION}]

Where:
  TENANT      = Fixed string per tenant. 'TEFI' for Tate's direct business.
                White-label partners receive their own 3-5 character slug
                (e.g. 'PARTNER_A', 'ACME').
  YYYYMM      = Year-month of first-touch, 6 digits. '202604' for April 2026.
                Fixed once assigned — never changes even if record lifecycle
                continues across months/years.
  SLUG        = Derived from email local-part (the part before @), lowercased,
                with dots removed and non-alphanumerics replaced with nothing.
                Truncated to max 20 characters. If the slug would be empty
                (email unavailable), use 'nomail' + a 4-digit random.
  COLLISION   = Optional 2-digit suffix (01, 02, ..., 99) when the first four
                components collide with an existing record.
                Absent when not needed. Added in ascending order.

Examples:
  TEFI-202604-akanegbu              (john.akanegbu@gmail.com, April 2026 cohort)
  TEFI-202604-jsmith                (j.smith@domain.co.nz)
  TEFI-202604-jsmith-01             (a second j.smith in the same month)
  TEFI-202604-jsmith-02             (a third j.smith in the same month)
  ACME-202605-mwilliams             (partner ACME's client, May 2026)
  TEFI-202604-nomail3847            (rare: no email at first touch)
```

**Character set:** ASCII letters, digits, and single hyphens as separators. No spaces, underscores, dots, or unicode. This ensures the ID is URL-safe, file-name-safe, sheet-cell-safe, and sortable.

**Length:** 18–32 characters typical; 40 character hard cap (enforced by Zoho field length).

**Case:** Always produced in the cases shown (tenant uppercase, date numeric, slug lowercase). Readers should compare case-insensitively for safety.

#### Collision handling rule

When a new Person_ID candidate is computed and the first four components (TENANT-YYYYMM-SLUG) match an existing record:

```
1. Query Zoho for existing Person_IDs matching TENANT-YYYYMM-SLUG[-NN]
2. If count = 0 → use base form (no collision suffix)
3. If count ≥ 1 → use suffix N+1 where N is the highest existing suffix
4. Enforce maximum N = 99; if exceeded, append a 4-digit random and log as an edge case
```

The suffix is a monotonically-increasing integer, not a random hash, because:
- Humans reading it know "this is the second j.smith we've seen in April 2026" rather than a meaningless code
- Debugging is easier (sequential numbers are predictable)
- 99 is a comfortable ceiling — if there are 100+ same-slug-same-month-same-tenant collisions, something else is wrong

**Why not use email as the slug directly?** Two reasons: (a) the `@domain` portion provides no uniqueness per-person (everyone at `gmail.com` collides), (b) email is PII that we don't want in URLs, file paths, or error logs.

#### Write pattern across lifecycle

The rule: **Person_ID is written once, at first touch, and never modified thereafter.**

"First touch" means the first place a person enters the TEFI system. Three scenarios:

**Scenario 1 — Inbound form (Depri, Calendly, Zoho form).** The form posts to Zoho via n8n. n8n computes Person_ID at the moment of lead creation and writes it to `Person_ID` on the new Lead record. Automation-only path. This is the primary path.

**Scenario 2 — Manual entry (Tate adds a person directly in Zoho).** Tate creates the record, saves it with an empty Person_ID, and a Zoho workflow rule fires on save to populate Person_ID if blank. This requires a server-side rule in Zoho (Blueprint or Workflow Rule calling a Deluge function). Effort: 1 day to build.

**Scenario 3 — Stripe payment (new client, not previously a Lead).** Unlikely but possible — someone finds TEFI via a referral, pays via a Stripe link, and has never been in the Leads module. The existing D1 workflow (Stripe → Zoho) creates the Contact. n8n computes Person_ID during that workflow and writes it to the new Contact.

**Lead → Contact conversion:** When a Lead is converted in Zoho, the existing Person_ID on the Lead is copied to the new Contact as part of the conversion mapping. The Contact retains the same Person_ID the Lead carried. This requires configuring Zoho's Lead Conversion Mapping so that `Person_ID` → `Person_ID` is in the field map. Effort: 10 minutes in Zoho Settings.

**Deal creation (when Contact converts a Deal):** The Deal inherits the Contact's Person_ID as a lookup or a direct field copy. Deals are tied to Contacts in Zoho already, so this is "look up via Contact_Name.Person_ID" most of the time — no new field needed on the Deal.

#### Legacy backfill policy

Today there are 6,150 Leads and 1,327 Contacts without a Person_ID. Backfilling means computing a Person_ID for each and writing it.

**The policy: enforce going forward; backfill opportunistically during migration.**

What this means concretely:

- **New records from today forward** must have Person_ID populated at creation. No exceptions. Zoho validation rule can enforce this (Person_ID field marked required at save time, defaulted by automation).
- **Existing Leads with no meaningful activity** (created >1 year ago, no activity in the past 90 days, no Deal associated) can remain without Person_ID indefinitely. They are historical. If they reactivate, they're backfilled then.
- **Existing Contacts with active Deals** are backfilled in a single migration pass — ~200–300 records, done via an n8n batch job. The backfill date-stamp (YYYYMM) for these is the **first-touch date as recorded on the Lead record that converted into them**, which Zoho preserves. If no conversion date is available (e.g. Contacts created directly), use the Contact's `Created_Time`.
- **Existing Leads with recent activity (past 30 days)** are backfilled in the same migration pass as active Contacts. ~100–200 records.

**Total backfill scope: ~300–500 records.** Manageable as a single n8n job. Leaves ~7,000 legacy records alone.

**Audit:** The backfill job writes to a log tab (`Person_ID_Backfill_Log` in Google Sheets or similar) with the row's prior state, the computed Person_ID, the first-touch date used, and any collisions encountered. This allows reversal if a pattern is found to be wrong.

#### Relationship to Zoho Record Id

Zoho Record Id remains on every record. It is not removed. It has two legitimate jobs:

1. **Zoho-native lookups.** When n8n queries Zoho, it uses Record Id because Zoho's API is Record-Id-native. Person_ID is for cross-system joins, not for Zoho's internal addressing.
2. **Pre-Person_ID records.** Historical records without Person_IDs can still be addressed by Record Id if ever needed.

There is no conflict: Person_ID is the human-meaningful identifier and the cross-system join key; Record Id is the Zoho-internal pointer. Both exist in parallel.

#### White-label tenant prefix convention

When a white-label partner is onboarded:

1. Partner is assigned a tenant slug: 3–8 characters, uppercase, ASCII, representative of their brand (e.g. `ACME`, `MIGRA`, `VISAHELP`).
2. All their Person_IDs use that prefix: `ACME-YYYYMM-...`.
3. TEFI retains `TEFI` as its prefix.
4. Tenant slug is recorded in Zoho (`Tenant_ID` field on Lead/Contact/Deal).
5. When querying across tenants (only TEFI admin can do this), Person_ID prefix immediately indicates tenancy.

**Naming conflict policy:** If two partners propose the same slug, TEFI resolves — first-claimed wins. Disambiguate via suffix (e.g. `ACME1`, `ACME2`) for later partners.

#### Summary of Person_ID operational rules

1. Format: `TENANT-YYYYMM-SLUG[-NN]`
2. Assigned at first touch, never modified
3. Scenario-specific write path: n8n for forms + Stripe, Zoho workflow rule for manual Zoho entry
4. Lead → Contact conversion preserves Person_ID via conversion mapping
5. Legacy backfill: ~300–500 active records in one migration pass, historical records left alone
6. Coexists with Zoho Record Id; neither replaces the other
7. Tenant prefix is the white-label parameterisation point; TEFI = `TEFI`

These rules answer Question 7. Deliverable 4 consumes them as constraints.

### 4B — Default Pattern for Deal Stage Progression (Question 4)

Tate surfaced two candidate architectures in the Deliverable 1 session:

- **Both SSOTs contribute** — stage changes can be driven by either Zoho state or Career Vault state.
- **Career Vault informs, Zoho decides** — Vault is reference; Zoho is authoritative.

The question is which becomes the default pattern.

#### Recommendation: "Career Vault informs, Zoho decides"

Zoho is the authoritative record of pipeline stage. Career Vault contributes evidence, signals, and readiness indicators — but never writes to Zoho's stage field directly.

**Why this pattern:**

1. **Aligns with Deliverable 1's locks.** Zoho is the SSOT for pipeline/identity/lifecycle. If the Vault could change stage, it would be a second authority over the same field — exactly the two-owner problem the SSOT decision exists to prevent.

2. **Matches the skill boundaries.** Stage decisions are *judgments* (is this lead ready for T-S1? Has this client completed Session 2?) and judgments belong with the authoritative operator — Tate, or Tate's automation reading Tate's configured rules. The Vault is *evidence* (what do we know about this person?). Evidence informs judgment; it does not replace it.

3. **Preserves auditability.** Every Zoho stage change carries a timestamp, an author, and (with the right configuration) a comment. If Vault automation could change stage, the audit trail would show "Vault changed it" — which isn't helpful for understanding *why* it was changed. With Zoho as decider, the rule or human who made the decision is always traceable.

4. **Is compatible with white-label.** Partners may use the Vault differently from TEFI (different weights on fields, different maturity thresholds). If Vault drove stage, each partner would need their own stage-logic layer. With Zoho as decider, Vault serves as advisory data consistently across tenants.

#### The one principled exception

**Vault-Health flags can auto-block (not auto-advance) stage transitions.**

Concretely: if a lead is about to be moved to `T1.M.1 Meeting Invited` and `vh_core_complete = false`, Zoho blocks the transition with a validation error. The Vault is not advancing the stage — it is preventing an advance that the Vault knows to be unsupported.

The logic is conservative: auto-block is safer than auto-advance. Blocking says "wait, this isn't ready" — which is almost always correct if the Vault flags are well-designed. Advancing says "yes, move forward" — which is exactly the judgment that should stay with the human.

This exception is narrow enough to be implementable as a Zoho validation rule that calls a Career Vault read (via Deluge or a webhook to n8n). Deliverable 4 should identify 3–5 specific stage transitions where this rule applies, then build those rules only. Do not apply it globally.

#### Concrete read/write contracts for key stages

Below are the 5 most-used stages in the T1 pipeline with their read/write contracts under the new pattern. This is the detailed table Deliverable 4 consumes.

##### T1.L.2 — LeadMagnet Sent (CMSnapshot delivered)

- **Trigger:** A2 workflow (or manual send) completes and delivers CMSnapshot to the lead.
- **Entry condition:** Career Vault has `vh_core_complete = true` and `gen_summary_short` is populated (Vault-Health permit, enforced as validation).
- **Read from Zoho:** Lead's current stage, last activity time.
- **Read from Vault:** `vh_core_complete`, `gen_summary_short`, `target_countries`.
- **Write to Zoho:** `Lead_Status → LeadMagnet Sent`, `Last_Activity_Time → now`, Notes entry with CMSnapshot URL.
- **Write to Vault:** `OUTPUT_LOG` row: deliverable = CMSnapshot, stage = T1.L.2, timestamp, URL.
- **Exit signal:** Either (a) lead replies → T1.Q.2 Questions Received, (b) 7 days no reply → T1.X.1 Awaiting Reply + nudge fires.
- **Failure mode:** CMSnapshot delivered but OUTPUT_LOG not written → Tate has no audit of what was sent. Ensure write happens in the same n8n workflow as the send.

##### T1.Q.2 — Questions Received (lead replied to CV Questions)

- **Trigger:** Reply detection workflow (n8n Phase 2) identifies inbound reply on a `T1.Q.1` thread.
- **Entry condition:** Reply content classified as "answer to questions" (not an objection, not an unrelated email).
- **Read from Zoho:** Lead record, stage history.
- **Read from Vault:** `vh_core_complete` (for deciding whether to auto-advance to T-S1).
- **Write to Zoho:** `Lead_Status → Questions Received`, new Activity record with reply content, Signal Store record (when Signal Store exists) with verbatim quote + classification.
- **Write to Gmail (derived view):** Apply `Questions Received` label.
- **Write to Vault:** Optional — if reply includes structured answers, n8n or Sonnet updates PERSON_PROFILE fields.
- **Exit signal:** Tate sends T-S1 → T1.M.1 Meeting Invited.
- **Failure mode:** Classification wrong (marked as Questions Received when it was actually an objection) → T-S1 auto-sends inappropriately. Phase 3 → Phase 4 gating is specifically to prevent this.

##### T1.M.1 — Meeting Invited (T-S1 sent)

- **Trigger:** Tate (or n8n, at Phase 4+) sends T-S1 to the lead.
- **Entry condition:** Lead is in `T1.Q.2 Questions Received`. Check `Do_Not_Auto_Send` field — if true, skip auto-send.
- **Read from Zoho:** Lead record, `Do_Not_Auto_Send`, `Communication_preference`.
- **Read from Vault:** Nothing required — this is a state-only transition.
- **Write to Zoho:** `Lead_Status → Meeting Invited`, Activity record: email sent.
- **Write to Gmail:** Apply `Meeting Invited` label.
- **Exit signal:** (a) Lead books meeting via Calendly webhook → T1.M.2 Meeting Booked, (b) 3 days no booking → nudge fires.
- **Failure mode:** Meeting invitation sent but Calendly link wrong → lead can't book. Validate T-S1 template rendering before send.

##### T1.M.2 — Meeting Booked (Calendly confirmation received)

- **Trigger:** Calendly webhook → n8n receives booking confirmation.
- **Entry condition:** Booked meeting date is within the next 30 days (reject far-future bookings as data anomalies).
- **Read from Zoho:** Lead record.
- **Write to Zoho:** `Lead_Status → Meeting Booked`, meeting time recorded, Activity record: Meeting Scheduled.
- **Write to Vault:** `SESSION_LOG` entry (when SESSION_LOG exists): planned Session 1 on date X.
- **Exit signal:** Meeting happens → T1.P.1 Post-Meeting Proposal (or conversion to Contact if paid on the call).
- **Failure mode:** Meeting booked but Tate doesn't know (webhook missed). Weekly audit: compare Calendly bookings against Zoho Meeting Booked stage entries.

##### T1.P.1 — Post-Meeting Proposal Sent

- **Trigger:** Tate (manually, after the meeting) triggers proposal send.
- **Entry condition:** Meeting `Attended = true`; proposal template selected (`Service_Pathway`).
- **Read from Zoho:** Lead record, service pathway selected post-meeting.
- **Read from Vault:** Full Vault profile (to personalise proposal content).
- **Write to Zoho:** `Lead_Status → Proposal Sent`, `Proposal_Sent → today`.
- **Write to Vault:** OUTPUT_LOG row: proposal delivered.
- **Exit signal:** (a) Lead accepts + pays → Contact conversion + Deal creation, (b) Lead declines → T1.X.2 Stalled, (c) 7 days no reply → nudge.
- **Failure mode:** Proposal sent but acceptance not recorded in Zoho → the conversion event is invisible. D1 workflow (Stripe → Zoho) should write acceptance on payment; if no payment but verbal acceptance, Tate records it manually.

### 4C — The Consolidated Top-10 Capability Gap List

Combining the pillar gaps from Thread 1, the enterprise-CX gaps from Thread 3, and the stage-progression reading above:

| Rank | Capability gap | Pillar | Category | Effort | Unlocks |
|---|---|---|---|---|---|
| 1 | **Session outcome capture (Vault SESSION_LOG tab populated)** | Vault | Vault schema extension | 2–3 days | Pre-meeting briefings, learning loop |
| 2 | **Interview outcome capture (Vault INTERVIEW_LOG tab populated)** | Vault | Vault schema extension | 2–3 days | Pattern detection, partner reporting |
| 3 | **Signal Store (Zoho custom module)** | Zoho | Zoho schema extension + process | 3–5 days | Reply classification, template learning |
| 4 | **Next-best-action briefing** | Cross-pillar | New tooling (n8n + Sonnet) | 3–5 days | Daily operator productivity |
| 5 | **Pre-meeting briefing generation** | Cross-pillar | New tooling (Relay + Vault read) | 2–3 days | Reduces Tate prep time 2 hrs/week |
| 6 | **Vault maturity index + per-deliverable readiness flags** | Vault | Vault schema extension (derivations) | 2–3 days | Workflow gating, Tate decision support |
| 7 | **Deliverable lifecycle registry (Vault OUTPUT_LOG populated)** | Vault | Process change + automation | 1 day schema + automation in each Relay workflow | Client transparency, partner reporting |
| 8 | **Template-outcome attribution** | Zoho | Zoho schema extension | 3–5 days initial + ongoing | Template learning loop |
| 9 | **Deal pipeline cleanup (57 → ~15 stages)** | Zoho | Schema decommissioning | 1–2 days planning + careful migration | Pipeline observability |
| 10 | **Activity-to-outcome attribution** | Zoho | Zoho schema extension + process | 5–10 days | Complete learning loop |

**Sequencing note for Deliverable 4:** Gaps 1, 2, 6, 7 are all Vault schema extensions — they should be considered as a group and designed together to avoid thrashing the schema. Gaps 3, 8, 10 are all Zoho module extensions for the learning loop — similar group. Gaps 4 and 5 are application-layer (Sonnet + n8n) and can be built after the schema gaps resolve. Gap 9 is a decommissioning job — should be scoped as part of the Deliverable 4 migration plan.

**Priority for immediate Q2 action:** Gaps 1, 7, 6 (all Vault) plus Gap 4 (next-best-action briefing, because it provides daily compounding value). Gaps 3, 8, 10 (Zoho learning loop) are Q3 work.

---

## Thread 5 — Gains and losses from the new architecture

This thread is the honest audit. The two-SSOT pivot is the right call, but it is not free. Some of what the old three-store setup did well will be lost or degraded during the migration window, and some of it will stay lost permanently. Naming those costs now — clearly, without varnish — is how the decision stays durable when Q3 friction shows up.

### 5A — The gains (what becomes possible that wasn't before)

**Gain 1: Architectural coherence — one ID, one owner per field.** Under the old setup, Person_ID casing drift existed because three stores were each trying to hold the same field and none of them were authoritative. Under the new architecture, every field has exactly one pillar that owns it, and Person_ID is generated at one choke-point (first-touch in Zoho) and never rewritten. This is the single biggest gain: you stop debugging "which store has the correct value for this person" because the question stops existing.

**Gain 2: White-label plausibility.** Before the pivot, white-label was theoretically possible but operationally impossible — three stores × N partners = 3N data-isolation problems. Under the new architecture, tenant prefix in Person_ID plus per-pillar multi-tenancy (Zoho sub-account or tag, Vault tab or file) makes three partner data-isolation models (A/B/C) plausible in a finite number of weeks rather than years. This is what unlocks the MV-WLP as a Q4 build rather than a 2027 build.

**Gain 3: Audit trail strength.** Zoho has native audit logging on Leads and Contacts (who changed what, when). Google Sheets has revision history but it is weak — you cannot reliably answer "when did this field change and who changed it" from a sheet. Moving pipeline state to Zoho means every status transition is auditable, which matters for partner disputes, client disputes, and regulatory questions (e.g., GDPR right-to-correction requests).

**Gain 4: Deal pipeline observability.** With deals anchored in Zoho and stage codes aligned to the Service Architecture, pipeline reporting becomes native — Zoho reports, dashboards, and forecasts all work. Under the old setup, pipeline observability required cross-referencing the Leads Registry against Zoho against Gmail labels. The new architecture lets "how many leads in T1.Q.2 right now" be a one-query answer.

**Gain 5: Scheduled task elimination of defensive work.** Two daily scheduled tasks (`daily-gmail-diligence-labels`, `daily-lead-intelligence`) existed partly to fight state drift between stores. Once Zoho is SSOT for pipeline, these tasks either retire or transform into reporting-only (not state-writing) jobs. That is approximately 15–20 minutes of daily compute that stops needing to run, plus the "did the task run this morning?" anxiety goes away.

**Gain 6: Clean IP-vs-operations separation.** Under the old setup, IP was scattered across Registry, Zoho, Vault, and loose docs. Under the new architecture, the Vault is explicitly the IP container, Zoho is explicitly the operations container, and the boundary is enforced by the "Vault informs, Zoho decides" pattern. This makes licensing conversations much simpler because you can point to exactly which files the partner gets access to and which they don't.

**Gain 7: Learning loop becomes buildable.** Template-outcome attribution, signal store, and activity-to-outcome attribution (gaps 3, 8, 10 in Thread 4C) were architecturally impossible under three-store chaos — you couldn't attribute outcomes to causes when causes were distributed across three stores that drifted. Under two SSOTs, the learning loop becomes a schema extension rather than a data-reconciliation project.

### 5B — The losses (what was better before, or what gets worse during migration)

**Loss 1: Short-term velocity during the migration window.** For the 2–3 weeks of lazy migration (Option D), two stores will be live in parallel. Tate will have to check both when looking up a person. Scheduled tasks pause. Template sends need the Person_ID field populated or they degrade to no-attribution. During this window, daily operational velocity drops 15–25 % — not because anything is broken, but because attention gets split.

**Loss 2: Ad-hoc pivot-table friction.** Google Sheets is genuinely good at ad-hoc pivots — "show me everyone who signed up in March who has not had a meeting yet" takes 30 seconds with a pivot table. Zoho has reports, but Zoho reports are heavier to build and harder to iterate on for quick questions. Some of the fast-and-loose diagnostic work Tate does weekly in the Leads Registry will get slower in Zoho. Workaround: periodic Zoho → Sheets export for ad-hoc analysis, but that is extra friction compared to the old direct-edit pattern.

**Loss 3: Sunk cost on Leads Registry 52-column design.** A meaningful amount of design work went into the Leads Registry as a structured pipeline view (52 columns, named ranges, data validation, colour-coded stage indicators). The new architecture retires this. The design learning is not lost — it informs what Zoho custom fields should look like — but the artifact itself is. This is pure sunk cost; naming it here so it does not get re-litigated in Q3.

**Loss 4: Fragility of "one field, one owner" during migration.** The new architecture's core discipline is that no field has two writers. During lazy migration, this discipline is temporarily broken — some fields will exist in both Registry and Zoho and either store could be updated. Mitigation: declare Zoho the winner for all overlap fields from Day 1 of migration, make Registry writes require conscious override (not default). Still, the discipline is weakest exactly when the system is most complex.

**Loss 5: Gmail-label-as-state pattern.** Tate's current mental model is partly "what labels are on this thread = where this person is in the pipeline." This was operationally fast — the state was visible in Gmail without opening another tool. Under the new architecture, labels become a derived view, which means the source of truth is one click further away. Net productivity may drop slightly on individual lookups, even though system coherence improves.

**Loss 6: Dual-write period confuses inbound.** Any automation (n8n, Relay) that writes during the migration window must be audited for which store it targets. If an automation writes to Registry and Zoho never hears about it, that person is in a silent split-brain. Mitigation: freeze all non-essential automations during the 2–3 week window; only T-S1 (SPLIT branch / duplicate detection) and Stripe → Zoho (payment attribution) continue to run.

### 5C — The mixed calls (gains or losses depending on how execution goes)

**Mixed 1: The "no field has two owners" discipline.** As a *rule*, this is a pure gain (Gain 1). As a *practice*, it is a forcing function that will slow decisions in Q2–Q3 — every new field has to be debated before it is created ("does this live in Zoho or Vault?"). That friction is healthy in the long run (it prevents architecture rot) but costly in the short run (it prevents quick hacks). Net verdict: gain, but the first quarter will feel like a loss.

**Mixed 2: Scheduled task retirement.** `daily-gmail-diligence-labels` and `daily-lead-intelligence` are paused. If they were doing important reporting work (not just state-writing), that reporting stops until it is rebuilt. Tate needs to audit — what were those tasks actually doing that mattered? If the answer is "nothing critical, just hygiene," pure gain. If the answer is "daily visibility into X that I now don't have," partial loss.

**Mixed 3: Vault-as-SSOT enforces Vault discipline.** The new architecture promotes Vault from "reference data I sometimes update" to "the authoritative career intelligence record." This forces Vault updates to happen reliably — every session, every milestone. That is a gain if the updates happen (the learning loop fires) and a compounding loss if they don't (stale Vault data contaminates all downstream deliverables). Net verdict: gain if Tate builds the habit, loss if he doesn't. Mitigation: automate Vault writes via Relay wherever possible so discipline is not a willpower problem.

**Mixed 4: Person_ID is a new primary key that didn't exist before.** Because it is generated at first-touch and carried through every pillar, Person_ID has to be right on day one or every downstream record inherits the defect. There is no "we'll fix the ID later" path — if `TEFI-202604-akanegbu` is wrong, every Vault record, every Zoho record, every email thread stays wrong. This is not a loss per se, but it is a new kind of fragility that didn't exist when the three stores were each using local IDs.

### 5D — What the new architecture does NOT fix

Named for completeness:

1. **Template body extraction from Zoho** — still blocked behind iframe. Not addressed by the SSOT pivot. Path forward: n8n HTTP Request or Bhanu's `</>` method.
2. **Tate-as-bottleneck on drafts** — the T-S1-only auto-send rule means most templates still require Tate review. Not addressed by SSOT pivot. Addressed by future agentic review layer.
3. **Lack of interview coaching artifact** — interview prep is still ad-hoc per client. Not addressed by SSOT pivot. Addressed by Deliverable 4 Vault INTERVIEW_LOG.
4. **No client-facing dashboard** — clients cannot see their own pipeline state. Not addressed. Q4 build.
5. **Partner operations capability** — even with MV-WLP, there is no partner admin dashboard yet. Q4 build (possibly Q1 2027).

### 5E — The verdict

The two-SSOT pivot is correct and the gains dominate the losses on every axis that matters for the five-year horizon. The migration will be uncomfortable for three weeks and the system will run at 80 % of normal velocity during that window. After the window closes, daily velocity returns to 100 % and the ceiling on what is architecturally possible rises substantially — white-label, learning loop, enterprise-CX parity all move from "theoretically possible" to "plausibly shippable in Q3–Q4."

The single largest risk is **discipline erosion** — if the "one field, one owner" rule is not enforced from Day 1 of lazy migration, the new architecture collapses back into the old three-store chaos within 6 months. The mitigation is not a tool; it is a rule. That rule is the hardest thing to build and the easiest thing to lose, and it is the hinge on which the whole pivot turns.

---

## Synthesis — Answers to the seven priority questions

Before the question-by-question summary, the 30-second answer: **The new architecture is coherent, white-label-plausible, and sufficient to support enterprise-CX capability on a solo cost envelope. The capability gap list is known (Top 10 in Thread 4C), the migration path is lazy (Option D), the key IP decision is Person_ID (locked). The discipline required to make it hold is "one field, one owner" — enforce it from Day 1 or the pivot doesn't stick.**

### Q1 — How does the 3-Pillar Brain actually function under the new SSOT?

**Answer (condensed from Thread 1):** Career Vault (IP container, SSOT for deep candidate data, 391 fields across 6 tabs) — stores career intelligence, session outcomes, deliverable lifecycle, maturity flags. Zoho (operations container, SSOT for pipeline/identity/lifecycle) — stores pipeline state, identity, transactions, relationships. Gmail/Drive (surface layer, not SSOT) — stores artifact outputs and conversation threads.

Interaction pattern: **Vault informs, Zoho decides.** Vault readiness flags are read by n8n/Relay before stage progression. Zoho is the sole writer of pipeline state. Gmail labels are derived from Zoho stage on a daily basis (no longer SSOT). Nine capability gaps identified, ranked by Q2 priority: Vault SESSION_LOG population, Vault OUTPUT_LOG population, Vault maturity index, next-best-action briefing.

### Q2 — What IP pattern-books exist and which are licensable?

**Answer (condensed from Thread 2):** Six artifacts are licensable as the MV-WLP (Minimum Viable White-Label Package) — Career Migration Report, Career Vault schema, Stage Code framework (T1–T4), Label-Template Master spine, 6-template starter library, Relay workflow A/B bundle.

Parameterisation map: TENANT, BRAND_KIT, LOCALE, TEMPLATE_SET, SCHEMA_SUBSET, WORKFLOW_SUBSET. MV-WLP positioned at T3a (mid-commitment partnership). Ten-gate readiness checklist produced. Three data-isolation models: (A) per-tenant Zoho sub-account + Vault file, (B) shared Zoho with tag-based isolation, (C) tenant-prefixed Person_ID across shared infrastructure. Recommended: Option C for first three partners, migrate to Option A at partner revenue > $50K/yr.

### Q3 — What enterprise-CX capabilities can TEFI match at solo cost?

**Answer (condensed from Thread 3):** 19-row capability matrix built. TEFI can match 11 of 19 capabilities at solo cost (58 %), can partially match 5 (26 %), and structurally cannot match 3 (16 %) without adding headcount. The five largest gaps: human-in-loop escalation response time, multi-channel (SMS + phone) parity, 24-hour coverage, dedicated account management at scale, enterprise audit-log depth.

Cost envelope: closing the top-5 gaps costs approximately $120–180/month in tooling + one offshore VA at $800–1200/month. Without VA, TEFI can credibly match 14 of 19 capabilities; with VA, 17 of 19. The remaining 2 are enterprise-only (multi-region data residency, SOC2 audit) and are not worth chasing at current revenue scale.

### Q4 — What capability gaps remain and what is the priority order?

**Answer (condensed from Thread 4C):** Top 10 gaps consolidated across pillars and enterprise-CX analysis. Priority for immediate Q2 action: Gaps 1, 6, 7 (Vault schema extensions — session log, maturity index, output log) plus Gap 4 (next-best-action briefing). Gaps 3, 8, 10 (Zoho learning loop — signal store, template-outcome attribution, activity-to-outcome) are Q3 work. Gap 9 (deal pipeline cleanup, 57→15 stages) is a Deliverable 4 migration task. Sequencing note: Vault gaps should be designed together as a schema-extension group to avoid thrashing.

### Q5 — What is the default pattern for stage progression — Vault-first or Zoho-first?

**Answer (condensed from Thread 4B):** Default pattern is **"Vault informs, Zoho decides"** — Zoho writes pipeline state, Vault provides readiness signals. One narrow exception: **Vault-Health auto-block** — if Vault flags a data-quality issue on a record (missing critical field, stale data, contradictory field values), Vault can block a Zoho stage advance via a hold flag, which must be cleared manually or by a Relay workflow before Zoho can advance. Five T1 stage read/write contracts documented in full (T1.L.2, T1.Q.2, T1.M.1, T1.M.2, T1.P.1).

### Q6 — How does white-label tenancy interact with Person_ID, Vault, and Zoho?

**Answer (condensed from Thread 4A and Thread 2):** Tenant prefix in Person_ID (`TEFI-`, `ACME-`, etc.) is the primary isolation mechanism. At the data-isolation layer, three models exist: (A) full Zoho sub-account + dedicated Vault file, (B) shared Zoho with tenant tag, (C) shared infrastructure with tenant-prefixed Person_ID. Recommended sequence: all partners start on Option C; migrate to Option A once partner-generated revenue exceeds $50K/year or compliance demands it. Vault tabs can be tenant-scoped via naming convention (`PERSON_PROFILE_ACME`) until volume justifies dedicated Vault files. Zoho layouts and workflows can be cloned per tenant without sub-account overhead.

### Q7 — Person_ID operational mechanics (added 2026-04-23)

**Answer (condensed from Thread 4A):**

- **Format:** `{TENANT}-{YYYYMM}-{SLUG}[-{COLLISION}]`, e.g., `TEFI-202604-akanegbu`
- **Generation trigger:** First-touch event (lead form submission, manual entry, partner referral arrival) — generated by n8n at the Zoho Lead create moment, never later
- **Collision handling:** 2-digit suffix (`-01` through `-99`), incremented when first four components collide on email local-part
- **Write pattern:** Generated once in Zoho Lead, mirrored to Vault PERSON_PROFILE on Vault record creation, preserved via Zoho Lead Conversion Mapping on Lead→Contact conversion (Contact inherits the same Person_ID, Lead is retained with `Is_Converted=true`)
- **Legacy backfill policy:** ~300–500 currently active records need backfill. Backfill strategy: one-time Sonnet-assisted job that reads email + first-touch-date and generates Person_ID per the format, writes to both Zoho and Vault. Non-active records (lost leads, stalled prospects) are backfilled only on reactivation. Historical exports (dormant prospects from 2019–2020) are backfilled as a batch when that campaign re-enters active pipeline.
- **Zoho Record Id coexistence:** Zoho Record Id is stored alongside Person_ID as a secondary reference (native Zoho join key). Person_ID is the human-readable, cross-system, vendor-independent key. Both coexist; neither replaces the other.
- **White-label tenant prefix:** 3–5 character alphabetic prefix, assigned at partner contract sign, stored in a TENANT_REGISTRY file (new, to be created in Deliverable 4). Prefix is immutable once assigned.
- **When to implement:** The field must be live in Zoho before any new lead arrives after the migration cut-over date (target: first weekend after Phase 1.4 SSOT Consolidation completes). Backfill of ~300–500 active records happens in the week following cut-over. Non-active backfill is lazy (on reactivation).

---

## Closing note — handoff to Tate

This document answers the seven priority questions, maps the 10-gap capability list, names the gains and losses, and locks Person_ID design as IP. It does **not** re-open the Path X vs. Path Y decision (closed, Path Y locked). It does **not** produce the target schema (Deliverable 4, blocked on this document being reviewed).

**What needs your review before Deliverable 4 starts:**

1. **Approve or edit the 10-gap priority order** (Thread 4C)
2. **Approve the MV-WLP artifact list and data-isolation sequence** (Thread 2 — Option C → Option A migration trigger at $50K/yr partner revenue)
3. **Approve the "Vault informs, Zoho decides" default pattern and the Vault-Health auto-block exception** (Thread 4B)
4. **Approve the Person_ID format, collision rule, and legacy backfill policy** (Thread 4A)
5. **Confirm the Q2 priority set** is Vault gaps 1/6/7 + Gap 4 (next-best-action briefing), deferring Zoho learning loop to Q3 (Thread 4C)
6. **Name the tenant prefix for TEFI** — default is `TEFI` (4 chars, alphanumeric, immutable) — confirm or override
7. **Confirm migration window** — lazy migration Option D over 2–3 weeks, starting the weekend after Phase 1.4 completes

Each of these is a lock-point for Deliverable 4. If you approve all seven as written, Deliverable 4 (Target Schema + Migration Plan) can be scoped as a 1–2 session Opus job. If you want any of them re-opened, flag it and I'll surface the trade-offs before we scope Deliverable 4.

---

*End of Deliverable 2 — Future-Proofing Analysis. Locked 2026-04-23.*

