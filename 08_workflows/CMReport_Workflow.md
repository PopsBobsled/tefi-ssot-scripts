# Career Migration Report — Cowork Workflow + Email Template
**Last updated:** 2026-04-20
**Status:** Production-ready
**Naming rule:** First instance in any document: Career Migration Report (full name). Subsequent references: CM Report. Never CMSnapshot or CMR.

---

## Template Versioning Rule

All Career Migration Report documents must be built from the **latest confirmed template**, never from a previous candidate's build script.

| Version | File | Status | Notes |
|---|---|---|---|
| v1 | `cms_build/TEMPLATE_v1_confirmed.js` | ✅ Confirmed | Daniel Maramwidze build — all 5 format changes approved 2026-04-15 |

**Rules:**
- New CM Reports always reference the highest confirmed version
- When Tate approves a format change, save a new `TEMPLATE_v[N]_confirmed.js` before building
- Candidate build scripts (`build_david.js` etc.) are outputs only — never use as benchmarks
- Never go backwards to an earlier version as a reference

---

## What This Is

The Career Migration Report (CM Report) is a Tier 1 deliverable. It is generated from the client's 391-field Career Vault JSON and produces a structured .docx report showing their career positioning, market opportunity, and dual 5-year career paths in their target country (NZ or AU).

The installed skill `tefi-cmsnapshot:cmsnapshot-generator` handles the full generation flow. Note: skill name retains legacy identifier; the output document is always titled Career Migration Report.

---

## Prerequisites

Before running this workflow:
- Client's Career Vault JSON (v3.5 schema) must exist in their client folder OR be available in this session
- Target country confirmed (NZ or AU)
- Client folder exists under `~TEFI/~Clients (in Process)/[ClientName]/`
- Build from `cms_build/TEMPLATE_v1_confirmed.js` — never from a candidate script or earlier version

---

## Cowork Workflow — Step by Step

**Step 1: Open Cowork and load the JSON**
- Open the client's Career Vault JSON file from their folder
- Or paste/upload it into the session

**Step 2: Trigger the Career Migration Report skill**

Say to Claude:
> "Generate a Career Migration Report for [Client Name], targeting [NZ / AU]. Use the JSON I've provided."

Claude will invoke `tefi-cmsnapshot:cmsnapshot-generator` automatically.

**Step 3: Review the output**
- Claude produces a structured .docx and saves it to `~Binders/` — canonical path: `Claude/~Binders/`
- ⚠️ Note: The skill plugin contains a stale session path. The correct save location is always: `/sessions/kind-gracious-goodall/mnt/Claude/~Binders/`
- Review for accuracy — particularly: target role titles, salary bands, sector fit

**Step 4: Claude generates a Gmail draft**
- Claude creates a draft using the static email template below
- Fill in: [First Name], [Target Country], any optional personalisation line

**Step 5: Tate attaches and sends**
- Open Gmail drafts
- Attach the .docx from the client's Binders folder
- Send

---

## Email Templates — Career Migration Report Delivery (Email 1)

Three variants based on candidate's target country preference. Select based on `target_countries` in their JSON.

**Variant routing:**
- NZ only → Variant A
- AU only → Variant B
- Both / not committed → Variant C

**Signature (all variants):**
Best regards, Tate

(Gmail signature appends automatically — do not include in draft body)

---

### Email Structure

Every variant has 5 paragraphs in this order:

1. **Opening (static):** warm, direct, affirming
2. **Report description (dynamic country name only):** describes what the report covers
3. **AI highlights (fully dynamic):** 2 to 3 sentences referencing specific achievements from their profile. Must feel read, not templated. Draw from their top achievements and any rare or standout attributes (certifications, references, quantified metrics, leadership scope).
4. **Closing (static + Calendly link)**
5. **Sign-off:** Best regards, Tate

---

### Variant A — NZ Only

**Subject:** Your Career Migration Report — [First Name]

Hi [First Name],

Well done, you have an exceptionally high quality profile. I know how to make it shine. I hope you will explore what I can do for you.

Attached is your Career Migration Report: a detailed look at how your background positions you in the New Zealand job market, including your strongest sectors, realistic salary expectations, and two career paths over the next five years.

[AI HIGHLIGHT PARAGRAPH: 2 to 3 sentences. Reference their strongest quantified achievement, plus one standout attribute (rare certification, references available, leadership scope, tool expertise). Use "NZ" where country-specific language is needed. Make it feel like Tate read their profile personally.]

Take your time going through the report. It is designed to give you a real picture of what is possible in New Zealand. I am happy to answer any questions it raises. I hope you will come to my presentation where you may find out everything you want to know about finding work and I will answer your questions here: https://calendly.com/tates_employment/how-to-get-permanent-employment-in-nz-australia-1 (Register in your own time zone so you know the correct time in your local calendar)

Best regards, Tate

---

### Variant B — AU Only

**Subject:** Your Career Migration Report — [First Name]

Hi [First Name],

Well done, you have an exceptionally high quality profile. I know how to make it shine. I hope you will explore what I can do for you.

Attached is your Career Migration Report: a detailed look at how your background positions you in the Australian job market, including your strongest sectors, realistic salary expectations, and two career paths over the next five years.

[AI HIGHLIGHT PARAGRAPH: 2 to 3 sentences. Reference their strongest quantified achievement, plus one standout attribute (rare certification, references available, leadership scope, tool expertise). Use "AU" or "Australian" where country-specific language is needed. Make it feel like Tate read their profile personally.]

Take your time going through the report. It is designed to give you a real picture of what is possible in Australia. I am happy to answer any questions it raises. I hope you will come to my presentation where you may find out everything you want to know about finding work and I will answer your questions here: https://calendly.com/tates_employment/how-to-get-permanent-employment-in-nz-australia-1 (Register in your own time zone so you know the correct time in your local calendar)

Best regards, Tate

---

### Variant C — Open to Both / Not Committed

**Subject:** Your Career Migration Report — [First Name]

Hi [First Name],

Well done, you have an exceptionally high quality profile. I know how to make it shine. I hope you will explore what I can do for you.

Attached is your Career Migration Report: a detailed look at how your background positions you in the New Zealand and Australian job markets, including your strongest sectors, realistic salary expectations, and two career paths over the next five years.

[AI HIGHLIGHT PARAGRAPH: 2 to 3 sentences. Reference their strongest quantified achievement, plus one standout attribute (rare certification, references available, leadership scope, tool expertise). Keep country references neutral ("NZ and AU" or "both markets"). Make it feel like Tate read their profile personally.]

Take your time going through the report. It is designed to give you a real picture of what is possible. I am happy to answer any questions it raises. I hope you will come to my presentation where you may find out everything you want to know about finding work and I will answer your questions here: https://calendly.com/tates_employment/how-to-get-permanent-employment-in-nz-australia-1 (Register in your own time zone so you know the correct time in your local calendar)

Best regards, Tate

---

## File Naming Convention

Save the .docx as:
`[PersonID]_CMReport_[YYYY-MM-DD].docx`

Example: `TAY-001_CMReport_2026-04-13.docx`

Store in: `~TEFI/~Binders/[ClientName]/` or `~TEFI/~Clients (in Process)/[ClientName]/Binders/`

---

## Notes

- Skill installed: `tefi-cmsnapshot:cmsnapshot-generator` — no rebuild needed
- Model: Sonnet (judgment-heavy, market intelligence synthesis)
- Do not send before Tate reviews — manual gate always applies
- Email is intentionally short and static; personalisation via optional placeholder only
