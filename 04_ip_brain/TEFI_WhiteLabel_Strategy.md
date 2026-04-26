# TEFI White Label Strategy
**Created:** 2026-04-19  
**Status:** v1 — strategic draft  
**Location:** `~TEFI/IP Brain/` — founding document for partnership and licensing business  
**Owner:** Tate Ulsaker | tate@employmentforimmigration.nz

---

## The Opportunity in One Sentence

TEFI's automation system transforms skilled migrant employment documentation from a time-intensive consulting service into a licensable, scalable product — one that immigration agencies can offer their clients without hiring a career coach.

---

## Why This Exists

Every immigration agency has the same problem: they get clients to the visa. They have no system for what comes next. The client arrives in NZ or AU, sends out a generic CV, gets no responses, and blames the agency. That is a reputational and retention problem for the agency and an unresolved outcome for the client.

TEFI solves the employment side. The white label system lets agencies offer that solution under their own name, without building it themselves.

---

## The System Architecture (What Partners Get Access To)

Partners never see the engine. They see a folder and finished documents.

```
LAYER 1 — ENGINE (TEFI-owned, never shared)
├── Career Vault schema (391-field candidate profile)
├── Relay AI workflows (25+ document production workflows)
├── n8n automation layer (orchestration, triggers, routing)
├── AI prompt library (session prep, CV, reports, coaching docs)
└── Person_ID system (SSOT candidate identity)

LAYER 2 — INTERFACE (shared with partner)
├── Google Drive intake folder (partner drops CV here)
├── Google Drive output folder (finished documents appear here)
└── Zoho CRM sync (optional — partner's own CRM or TEFI-managed)

LAYER 3 — BRAND SKIN (partner-controlled)
├── Logo and colour scheme applied to all document headers
├── Partner email signature on all outbound drafts
└── Custom folder naming convention per partner
```

The partner's experience: drop a CV in, get a professional document pack out. The engine is invisible.

---

## IP Protection Framework

### What constitutes TEFI's intellectual property

The following are proprietary assets owned by Tate Ulsaker / Tate's Employment for Immigration. They must be documented, version-controlled, and legally protected before any white label agreement is signed.

| Asset | Description | Protection method |
|---|---|---|
| Career Vault Schema v3.5 | 391-field candidate profile structure | Document + date-stamp + copyright notice |
| Relay Prompt Library | All AI prompts for 25+ workflows | Document in `TEFI_Relay_Workflow_Register.md` + private repo |
| Session Framework | S1–S5 prep structure, host/client format | Document in Service Architecture doc |
| TEFI 10-Point CV Analysis System | Proprietary CV evaluation methodology | Document as named methodology |
| Person_ID Standard | Candidate identity format and SSOT rules | Already documented in `PERSON_ID_STANDARD.md` |
| Workflow Architecture | The specific chain of n8n + Relay workflows | Register document + version control |
| Service Tier Architecture | T1–T4 structure, stage codes, upgrade path | Already documented in `TEFI_Service_Architecture.md` |

### Minimum IP protection steps (do before first partner)

1. **Date-stamp all documents** — every file in `~TEFI/IP Brain/` should have a created date in the header. Done for all files created 2026-04-19 onwards.
2. **Copyright notice** — add to all prompt files and schema documents: *© Tate Ulsaker / Tate's Employment for Immigration. All rights reserved.*
3. **Partner agreement** — any white label partner signs an agreement that explicitly states: they receive access to outputs only; they do not acquire rights to the methodology, prompts, schema, or workflow architecture; they may not reverse-engineer or reproduce the system.
4. **Confidentiality clause** — partners agree not to disclose system details to competitors or third parties.
5. **Legal review** — before signing first partner: engage an NZ IP/commercial lawyer to review the partner agreement template. Budget: $500–$1,500 NZD one-time.

### What a partner agreement must include (key clauses)

- Licence is non-exclusive, non-transferable, and revocable
- Partner may not sublicence without written consent
- All output documents may be branded by the partner but the methodology behind them remains TEFI's
- TEFI retains right to audit usage and enforce volume caps
- Termination clause: 30 days notice, all access revoked, no ongoing rights

---

## Business Models

### Model 1 — Referral (available now)
Agency refers clients to Tate. Tate delivers under TEFI brand. Agency receives referral fee per converted client.

- **Revenue to TEFI:** Full programme fee minus referral commission (15–20%)
- **Partner effort:** Zero — they just refer
- **Tate's effort:** Full delivery per client
- **Best for:** Early relationships, trust-building, low volume

### Model 2 — Co-brand (available in ~6–8 weeks)
Documents delivered under shared branding: "Career services by TEFI, in partnership with [Agency]." Partner has a dedicated Drive folder. TEFI operates the engine.

- **Revenue to TEFI:** Per-client fee ($150–$300 USD depending on deliverable set)
- **Partner effort:** Drop CV, review outputs, send to client
- **Tate's effort:** QC review at human control points only
- **Best for:** Mid-size agencies, 10–50 clients/year

### Model 3 — White label licence (available in ~3–4 months)
Full white label. Partner's brand on all documents. TEFI's system invisible. Partner manages client relationship entirely.

- **Revenue to TEFI:** Monthly licence + per-client fee above threshold
- **Partner effort:** Drop CV, review, send
- **Tate's effort:** System maintenance, QC spot-checks, prompt updates
- **Best for:** Large agencies, immigration law firms, 50+ clients/year

---

## ROI Projections — Conservative Estimates

### Assumptions
- Per-client fee (Model 2/3): $200 USD average (covers CV upgrade + 2 core reports + session prep docs — not full T4)
- Monthly licence (Model 3): $500 USD/month per partner (covers up to 20 clients/month)
- Engineer cost (part-time, remote): $3,000–$5,000 USD/month once volume justifies
- Relay cost at scale: negotiable — current free tier; paid tiers start ~$50–$100/month; volume brings leverage
- n8n Cloud at scale: currently ~$50/month; enterprise pricing available at volume

### Scale Benchmarks

**Benchmark 1 — Early traction (6 months post-launch)**

| Metric | Figure |
|---|---|
| Partners (Model 2) | 3 |
| Clients per partner per month | 5 |
| Total client deliveries/month | 15 |
| Revenue at $200/client | $3,000 USD/month |
| Relay + n8n costs | ~$200/month |
| Net contribution | ~$2,800 USD/month |
| Engineer needed? | No — Tate manages QC |

**Benchmark 2 — Growth stage (12 months post-launch)**

| Metric | Figure |
|---|---|
| Partners (mix Model 2 + 3) | 8 |
| Avg clients per partner per month | 8 |
| Total client deliveries/month | 64 |
| Revenue: per-client ($200 × 64) | $12,800/month |
| Revenue: licences ($500 × 4 Model 3 partners) | $2,000/month |
| Total revenue | $14,800 USD/month |
| Relay + n8n + infrastructure | ~$500/month |
| Part-time engineer (prompt updates, workflow maintenance) | $2,000–$3,000/month |
| Net contribution | ~$11,300–$12,300 USD/month |

**Benchmark 3 — Scale (24 months post-launch)**

| Metric | Figure |
|---|---|
| Partners (mostly Model 3) | 20 |
| Avg clients per partner per month | 12 |
| Total client deliveries/month | 240 |
| Revenue: per-client ($200 × 240) | $48,000/month |
| Revenue: licences ($500 × 15 Model 3 partners) | $7,500/month |
| Total revenue | $55,500 USD/month |
| Infrastructure at scale | ~$1,500/month |
| Full-time engineer | $5,000/month |
| QC / operations support | $2,000/month |
| Net contribution | ~$47,000 USD/month |

### Volume and negotiating power

At Benchmark 2 (64 deliveries/month), you have meaningful leverage with Relay and n8n:
- Relay: negotiate a flat enterprise rate rather than per-run pricing
- n8n Cloud: volume discount or dedicated instance pricing
- Google Workspace: reseller agreement possible at 20+ partner accounts

At Benchmark 3 (240 deliveries/month), you are a meaningful customer for both platforms. Annual contracts at locked rates become available. At this scale, migrating to self-hosted n8n (on a VPS) would save ~$800–$1,200/month and give you complete control — that is the point where the engineer pays for themselves in infrastructure savings alone.

### Direct business multiplier effect

The white label business and direct TEFI business reinforce each other:

- Every workflow built for a white label client is also used for direct TEFI clients
- Every direct client refines the prompt quality — white label partners benefit automatically
- White label volume funds the engineer who maintains and improves the system for everyone
- At Benchmark 3, white label revenue alone funds full-time engineering + operations — direct TEFI becomes pure margin

---

## The Path to First Partner

### Prerequisites checklist

- [ ] A2 (JSON → CM Report) workflow live and tested
- [ ] B1 (Session 1 Prep) workflow live and tested
- [ ] C1 (CV Upgrade) workflow stable and consistent
- [ ] Brand-swappable document template (one logo variable, one colour variable)
- [ ] IP documentation complete (all `~TEFI/IP Brain/` files version-controlled)
- [ ] Partner agreement template drafted (can use a commercial lawyer template as base)
- [ ] One-page partner pitch document written
- [ ] Pricing confirmed and documented

### Target first partners

Immigration agencies that already know TEFI's work are the lowest-friction starting point. The referral contacts (Michael Cordy, Sandrine Savarit) are warm leads. A conversation starting with "I'm building a white label employment support system for immigration agencies — would you want early access?" costs nothing and may close in one call.

**Ideal first partner profile:**
- NZ or AU based immigration agency
- 20–100 client visas per year
- Currently has no employment support offering
- Trusts Tate from prior interaction

---

## What Tate's Role Looks Like at Scale

Today: Tate produces everything.  
In 6 months: Tate reviews and approves AI outputs.  
In 12 months: Tate sets quality standards; engineer maintains workflows; operations handles QC.  
In 24 months: Tate's role is system design, partner relationships, and product development — the creative and vision work that is genuinely Tate's strength.

---

## Open Questions

- [ ] What is the minimum viable deliverable set for a white label partner? (CV + SAM Report + Session 1 Prep is a strong starting point)
- [ ] Should the partner agreement include a volume minimum to ensure the economics work?
- [ ] Is there appetite for an equity or revenue-share model with a strategic agency partner who brings significant volume?
- [ ] At what point does TEFI need its own website page or landing page for the partnership programme?

---

*This document is confidential and proprietary to Tate Ulsaker / Tate's Employment for Immigration.*  
*© 2026 Tate Ulsaker. All rights reserved.*
