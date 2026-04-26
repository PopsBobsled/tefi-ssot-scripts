# CV Upgrade Prompt Analysis: Deliverables for Employment for Immigration NZ

**Analyst:** Opus 4.6
**Date:** 2026-03-27
**Client:** Rakesh Reddy (NZ Relocation)
**Commissioned by:** Tate, Employment for Immigration NZ

---

## DELIVERABLE 1: GAP ANALYSIS SUMMARY

### Version A (Rakesh_Reddy_CV_v7.docx) — Strengths & Limitations

Version A is a genuinely strong CV and the clear foundation to build from. Its defining quality is **narrative causality** — every role explicitly explains how it prepared Rakesh for the next, creating a through-line from cable splicer to national programme leader that no recruiter could miss. The Professional Summary is dense with proof points (20+ years, 4,700+ technicians, 7 states, three compliance environments) and lands the "rare dual capability" differentiator in the opening paragraph itself. The Career at a Glance table provides an immediate visual anchor — a recruiter scanning for 6 seconds gets scope before reading a single bullet. Role descriptions are layered: Operational Scope → Vendor Performance → Cross-functional Delivery, each with range quantification (20–40 sites, 5–10 vendors, 30–60+ personnel). The CenturyLink section is particularly well-structured, splitting into Programme Leadership and Commercial/Vendor Impact sub-headings that separate execution from business value. Earlier roles (Qwest, Army, FAA) are handled with discipline — each is framed as a career foundation rather than padded with filler, and the FAA section ties directly to governance and zero-tolerance reliability culture.

Where Version A falls short: NZ market positioning is surface-level — the header says "Relocating to New Zealand" but the body never maps US experience to NZ infrastructure priorities (UFB, Crown Infrastructure Partners, rural connectivity, Chorus fibre network). A hiring manager at Chorus or Spark would need to do the translation work themselves. Some technical specificity could be deeper (e.g., which VDSL2 profiles, what capacity planning tools, what reporting frameworks). And the skills section, while comprehensive, reads as a keyword dump rather than a strategically ordered capabilities statement.

### Version B (Rakesh_Ready_Upgraded_CV.docx) — Strengths & Limitations

Version B has a cleaner structural envelope and slightly better NZ signalling ("Available for relocation to New Zealand," "digital transformation" language that maps to NZ public sector terminology). The Core Capabilities section is a useful addition that Version A lacks — it gives a quick scannable inventory of what Rakesh offers. Splitting Qwest into two distinct roles (Network Technician and Cable Splicer) adds granularity to the early career timeline.

However, Version B has lost most of what makes Version A effective. The Career at a Glance table is entirely absent — the single most visually impactful element is gone. Role descriptions have been compressed to generic bullet points that could describe any operations manager ("Led multi-state field operations... managing delivery planning, workforce performance, vendor partnerships"). The narrative connections between roles have been severed: there is no explanation of *why* Rakesh moved from field tech to manager, no causality, no progression story. Quantification is inconsistent — some numbers appear but without the range format (20–40 sites) that signals real operational memory rather than résumé inflation. The differentiation statements ("rare dual capability," "most infrastructure leaders follow either technical OR management path") are completely absent. And the NZ positioning is cosmetic — swapping "Relocating to" for "Available for relocation to" is terminology, not substance.

### Critical Differences That Matter

The gap that matters most is **narrative versus inventory**. Version A tells a story a hiring manager can retell to their team: "This guy started as a cable splicer, built 10 years of hands-on technical knowledge, then used that to lead a national migration programme with zero disruptions across 7 states — and he understands compliance from Army and FAA environments." Version B presents a list of things Rakesh has done, and leaves the hiring manager to construct the narrative themselves. In the NZ market, where Rakesh is an unknown international candidate competing against locals with existing networks, the narrative is everything — it's the mechanism by which a recruiter builds conviction that this candidate is worth the visa sponsorship conversation.

---

## DELIVERABLE 2: RECOMMENDED CV UPGRADE PROMPT SPECIFICATION

### Prompt Specification: CV Generation from SSOT-Complete JSON

```markdown
# CV UPGRADE PROMPT — SONNET SPECIFICATION
# Version: 1.0
# Architecture: Structured JSON Input → Sonnet → Professional CV Document

---

## ROLE DEFINITION

You are a senior CV writer specialising in infrastructure and telecommunications
leadership candidates targeting the New Zealand employment market. You produce
CVs that read as executive career narratives, not role inventories. Your output
must feel like it was written by a human career strategist who deeply understands
both the candidate's industry and the NZ hiring context.

## CORE PRINCIPLES

1. **Narrative over inventory.** Every role description must explain not just
   what the candidate did, but how it connects to the role before and after it.
   The CV must tell a coherent career progression story.

2. **Specificity signals credibility.** Use range quantification (20–40 sites,
   not "multiple sites"), name technologies explicitly (DSL, VDSL2, FTTN,
   ADSL/ADSL2+, not "various technologies"), and include operational detail
   that only someone who actually did the work would know.

3. **Differentiation must be explicit.** Do not leave the reader to infer what
   makes this candidate unusual. State it directly in the summary and reinforce
   it through role descriptions.

4. **NZ positioning must be substantive.** Map the candidate's experience to
   specific NZ infrastructure priorities, programmes, and market conditions —
   not just swap US terminology for NZ spelling.

5. **Visual hierarchy matters.** The CV must be scannable in 6 seconds (summary
   + Career at a Glance table) and rewarding in 60 seconds (full role narratives).

---

## INPUT REQUIREMENTS (SSOT-Complete JSON Structure)

The input JSON must contain the following top-level objects. If a field is missing,
flag it in output validation rather than inventing content.

```json
{
  "candidate": {
    "name": "string",
    "target_title": "string",
    "contact": { "phone": "string", "email": "string", "location": "string" },
    "relocation": { "from": "string", "to": "string", "status": "string" }
  },
  "professional_summary": {
    "years_experience": "number",
    "headline_differentiator": "string",
    "career_arc": "string — one sentence describing the progression",
    "compliance_environments": ["string"],
    "scope_metrics": {
      "workforce_size": "string",
      "geographic_reach": "string",
      "concurrent_sites": "string",
      "service_record": "string"
    }
  },
  "career_at_a_glance": [
    {
      "metric": "string",
      "value": "string",
      "label": "string"
    }
  ],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "dates": "string",
      "context_line": "string — one-line scope description",
      "sub_sections": [
        {
          "heading": "string (optional — e.g., 'Programme Leadership')",
          "bullets": [
            {
              "label": "string — bold lead (e.g., 'National Delivery Coordination')",
              "content": "string — full bullet text",
              "metrics": ["string — extractable quantification"],
              "narrative_connection": "string (optional) — how this connects to career arc",
              "priority": "high | medium | low"
            }
          ]
        }
      ],
      "career_narrative_tag": "string — what this role represents in the progression"
    }
  ],
  "skills": {
    "categories": [
      {
        "name": "string",
        "items": ["string"],
        "nz_relevance": "high | medium | low"
      }
    ]
  },
  "education_and_certifications": [
    {
      "credential": "string",
      "institution": "string (optional)",
      "nz_equivalence_note": "string (optional)"
    }
  ],
  "nz_positioning": {
    "target_sectors": ["string — e.g., 'UFB rollout', 'rural connectivity'"],
    "experience_mappings": [
      {
        "us_experience": "string",
        "nz_equivalent": "string",
        "relevance_explanation": "string"
      }
    ],
    "market_context": "string — brief description of NZ infrastructure landscape"
  }
}
```

---

## REQUIRED CV SECTIONS (in order)

### 1. HEADER
- Candidate name (bold, prominent)
- Target title (directly below name)
- Contact line: relocation status | phone | email
- **Rules:**
  - Title must be specific to infrastructure/programme delivery, not generic ("Senior Digital Infrastructure Delivery Manager" not "Senior Manager")
  - Relocation line must be warm and direct ("Relocating to New Zealand from Seattle, WA, USA")

### 2. PROFESSIONAL SUMMARY
- Single dense paragraph, 80–120 words
- Must contain: years of experience, scope metrics (workforce size, geographic reach), career arc (from X to Y), headline differentiator, compliance environments
- Must end with or contain the "rare dual capability" differentiator or equivalent
- **Rules:**
  - Open with seniority + scope, not with "Results-driven" or other filler
  - Every claim must be backed by a specific number or named context
  - The summary must be self-sufficient — a reader who reads only this paragraph should understand Rakesh's full value proposition
  - Weave NZ relevance naturally if `nz_positioning` data is available (e.g., "...expertise directly applicable to large-scale fibre deployment and network modernisation programmes")

### 3. CAREER AT A GLANCE
- 2×4 table (8 cells) with bold metric values and descriptive labels
- **Row 1:** Years of experience | States/regions of operation | Field technicians supported | Service disruption record
- **Row 2:** Vendor relationships managed | Field managers coordinated | Concurrent migration sites | Revenue protected per site
- **Rules:**
  - Use range format where appropriate (35–70, not 70)
  - Every cell must contain a number or "Zero" — no qualitative statements
  - This table is the single most important visual element; never omit it
  - Source values directly from `career_at_a_glance` array in JSON

### 4. PROFESSIONAL EXPERIENCE
- Reverse chronological order
- Each role must include: title (bold), company, location, dates, context line (italic — one sentence framing scope and significance)
- Bullet points with bold lead labels followed by substantive narrative
- **Rules:**

  **Narrative rules:**
  - Each role must contain at least one bullet that explicitly connects to the career progression (how this role built on the previous or prepared for the next)
  - For the earliest roles, frame as "career foundation" — what discipline or capability was built here that carried forward
  - For middle roles, frame as "transition" — where technical depth became operational leadership
  - For senior roles, frame as "culmination" — where all prior experience converged
  - Use the `career_narrative_tag` and `narrative_connection` fields from JSON to drive these connections
  - Never write a bullet that could apply to any generic manager — every bullet must contain something specific to this candidate's actual experience

  **Quantification rules:**
  - Use range format for operational metrics (20–40 sites, 5–10 vendors, 30–60+ personnel)
  - Include dollar values where available ($150K+ annual revenue per site, $120 per dispatch hour)
  - Name specific technologies (DSL, VDSL2, FTTN, ADSL/ADSL2+) — never say "various technologies"
  - Include lifecycle detail where available (6–8 week migration cycle)
  - Source all metrics from the `metrics` arrays in JSON bullets

  **Sub-section rules:**
  - Senior roles (CenturyLink Network Operations) should use sub-headings to separate Programme Leadership from Commercial/Vendor Impact
  - Sub-headings should be bold and uppercase
  - Only use sub-headings for roles complex enough to warrant them (typically roles with 4+ bullets spanning different impact areas)

  **Differentiation rules:**
  - Include at least one explicit differentiation statement in the two most senior role descriptions
  - Examples: "a governance model later scaled to 7-state delivery at CenturyLink," "the technical foundation that underpinned later programme leadership"
  - These cross-references between roles are critical — they are the mechanism that transforms a role list into a career narrative

  **NZ positioning rules:**
  - In at least 2 role descriptions, include a natural parenthetical or clause mapping US experience to NZ context
  - Example: "...DSL-to-fibre migration — directly comparable to New Zealand's UFB rollout and Chorus network expansion"
  - Example: "...field workforce management across geographically distributed regions, a model applicable to NZ's regional connectivity challenges"
  - Do NOT force NZ references into every bullet — 2–3 well-placed references are more credible than saturating every paragraph
  - Source mappings from `nz_positioning.experience_mappings` in JSON

### 5. KEY SKILLS AND TOOLS
- Grouped by category with bold category headings
- Comma-separated within each category
- **Rules:**
  - Order categories by NZ relevance (highest first) using `nz_relevance` field
  - Keep to 5–6 categories maximum
  - Each category should contain 5–8 items — enough to demonstrate breadth without becoming a keyword dump
  - Include NZ-specific terminology where natural (e.g., "ICT infrastructure delivery" alongside US terms)

### 6. EDUCATION AND CERTIFICATIONS
- Two-column table format (academic credentials left, professional licences right)
- **Rules:**
  - Include NZ equivalence notes if available from JSON (e.g., "equivalent to NZ Level 6 Diploma")
  - List most relevant credentials first

---

## OUTPUT VALIDATION CHECKLIST

After generating the CV, verify each item. If any check fails, revise before
delivering.

- [ ] **Career at a Glance table present** with 8 populated cells
- [ ] **Professional Summary** is 80–120 words and contains: years, scope metrics, career arc, differentiator
- [ ] **"Rare dual capability"** or equivalent differentiator appears in summary AND is reinforced in at least one role description
- [ ] **Narrative connections** exist in at least 3 role descriptions (explicit references to how roles connect)
- [ ] **Range quantification** used for at least 5 different metrics across the CV
- [ ] **Named technologies** appear (DSL, VDSL2, FTTN, ADSL/ADSL2+) — no "various technologies"
- [ ] **NZ positioning** appears substantively in: summary (1 reference), experience section (2–3 references), and skills section (NZ terminology)
- [ ] **NZ references are natural**, not forced — read each one aloud; if it sounds bolted on, rewrite it
- [ ] **No generic bullets** — every bullet contains at least one specific detail (number, technology, named outcome) that could not apply to a random operations manager
- [ ] **Sub-headings** used for the most complex role (CenturyLink Network Operations)
- [ ] **Context lines** present for each role (one-sentence scope framing below the date line)
- [ ] **All JSON data consumed** — no high-priority fields left unused
- [ ] **Total CV length** is 3–4 pages (not shorter, not longer)
- [ ] **Consistent formatting** — date formats, dash styles, capitalisation conventions all uniform throughout

---

## QA CRITERIA: 10-DIMENSION QUALITY ASSESSMENT

Score the generated CV on each dimension (1–10 scale). Target: minimum 7 on every
dimension, minimum 8 average.

| Dimension | What to Assess | Target |
|-----------|---------------|--------|
| **Structure & Organisation** | Logical flow, visual hierarchy, scanability | ≥ 8 |
| **Headline Impact** | Does the title + summary land in 6 seconds? | ≥ 8 |
| **Quantification & Specificity** | Range metrics, dollar values, named technologies, lifecycle detail | ≥ 8 |
| **Narrative Strength** | Do role descriptions tell a connected story? | ≥ 9 |
| **NZ Market Positioning** | Substantive mapping to NZ infrastructure context (not cosmetic) | ≥ 7 |
| **Career Progression** | Is the cable-splicer-to-national-leader arc clear and compelling? | ≥ 9 |
| **Scope Visibility** | Can the reader immediately grasp the scale Rakesh has operated at? | ≥ 8 |
| **Differentiation** | Is the "rare dual capability" differentiator stated and reinforced? | ≥ 8 |
| **Employment Readiness** | Could this CV be sent to a NZ employer today without edits? | ≥ 7 |
| **Overall Quality** | Holistic impression — would a senior recruiter rate this as top-tier? | ≥ 8 |

**Minimum passing threshold:** No dimension below 7, overall average ≥ 8.0.

```

---

## DELIVERABLE 3: KEY INSIGHTS

### What Makes Version A Work So Well Narratively?

Version A succeeds because it treats the CV as a **persuasion document**, not a record. Three specific mechanisms drive this:

**Causal threading.** Each role description contains at least one sentence that explicitly references another role. The Uniblue vendor governance bullet ends with "a governance model later scaled to 7-state delivery at CenturyLink." The CenturyLink technician section opens with "Built deep hands-on expertise in legacy copper DSL systems across 10 years — the technical foundation that underpinned later programme leadership." These aren't decorative — they are the structural connective tissue that transforms five separate jobs into one coherent career arc. A recruiter reading Version A doesn't have to infer progression; they are told, with evidence, exactly how each stage enabled the next.

**Scope anchoring before detail.** The Career at a Glance table gives the reader a mental model of Rakesh's scale (4,700+ technicians, 7 states, zero disruptions) before they encounter any role description. This means every subsequent bullet is read through the lens of "this person operates at national scale." Without that anchor (as in Version B), the same bullets read as routine operations management.

**Differentiation by assertion, not implication.** Version A states outright that Rakesh has a "rare dual capability as a career-long technical practitioner and senior programme governance leader, shaped across three distinct compliance environments." This is a claim most CVs leave unstated, hoping the reader will figure it out. In a competitive NZ market where Rakesh is an unknown international candidate, explicit differentiation is essential — it gives the recruiter the exact language they need to advocate for this candidate internally.

### What Should Absolutely Never Be Lost in Optimisation?

Five non-negotiable elements:

1. **The Career at a Glance table.** This is the single highest-impact visual element. It converts a 3-page document into a 6-second elevator pitch. Any system that omits this table has regressed.

2. **Cross-role narrative connections.** The sentences that link roles to each other ("a governance model later scaled to...," "the technical foundation that underpinned...") are what separate this CV from every other operations manager CV. These must be preserved verbatim or improved, never deleted for brevity.

3. **Range quantification format.** "20–40 sites" signals genuine operational memory. "Multiple sites" signals résumé padding. "40 sites" signals cherry-picking. The range format is a credibility mechanism — it says "I'm giving you the real numbers, not the best-case number."

4. **The sub-section structure for CenturyLink.** Splitting Programme Leadership from Commercial/Vendor Impact lets Rakesh claim two distinct value propositions from one role. Collapsing them into a flat bullet list (as Version B does) loses this structural argument.

5. **The "career foundation" framing for early roles.** The Army, FAA, and Qwest roles are not padding — they are the origin story. Framing them as "the precision and safety discipline that underpins a 20+ year career" turns potential dead weight into proof of deep roots. This framing must be preserved.

### Where Specifically Can Sonnet Add the Most Value?

**NZ market positioning — this is the biggest opportunity.** Version A scores roughly 3/10 on NZ depth because it was written without structured NZ market data. With SSOT-Complete JSON providing explicit `nz_positioning.experience_mappings`, Sonnet can weave substantive NZ references that a script-based system cannot. Mapping DSL-to-fibre migration to New Zealand's UFB programme, mapping multi-state workforce management to NZ's regional infrastructure challenges, mapping FAA/Army compliance to NZ's critical infrastructure regulatory environment — these are the kinds of contextual translations that require language model reasoning, not template substitution.

**Narrative synthesis from structured data.** The JSON input provides `career_narrative_tag` and `narrative_connection` fields that a script cannot meaningfully use. Sonnet can take a tag like "transition_from_technical_to_leadership" and generate a natural sentence connecting the Senior Broadband Technician role to the Network Operations Manager role, preserving the causal threading that makes Version A effective.

**Adaptive bullet quality.** A script generates bullets at uniform quality. Sonnet can allocate more narrative depth to high-priority bullets and keep low-priority bullets tight — creating the kind of natural emphasis variation that makes a CV feel authored rather than generated.

**Summary paragraph crafting.** The Professional Summary is the highest-stakes paragraph in the document. It requires density, flow, and strategic word choice that script-based generation handles poorly. Sonnet can produce a summary that reads like executive prose rather than concatenated keywords.

### Concerns and Recommendations

**Concern 1: Sonnet may over-smooth.** Language models tend toward fluent generality. The specific, slightly angular phrasing of Version A ("Built from cable splicer to national programme leader") is more memorable than a smoothed version ("Progressed through increasingly senior roles in telecommunications"). The prompt specification includes rules against generic language, but during QA, watch specifically for cases where Sonnet has made the language more "professional" at the cost of making it less distinctive.

**Concern 2: NZ positioning may feel grafted.** There's a risk that NZ references feel like they were inserted by a different author. The prompt specifies that NZ references should be natural and limited to 2–3 well-placed instances. During QA, read each NZ reference in context — if it interrupts the flow of the sentence it's in, remove it and try a different placement.

**Concern 3: Career at a Glance table formatting.** Depending on the docx generation pipeline downstream of Sonnet, the 2×4 table may not render correctly. I recommend that the JSON include the exact 8 cell values and that the downstream document builder has a hardcoded table template that simply inserts the values — don't rely on Sonnet to generate table markup that survives format conversion.

**Concern 4: JSON completeness matters more than prompt sophistication.** The prompt specification above is detailed, but its effectiveness is bounded by the quality of the SSOT-Complete JSON. If the JSON lacks `narrative_connection` fields, `nz_positioning.experience_mappings`, or `career_narrative_tag` values, Sonnet will have to improvise — and improvised narrative connections will be weaker than authored ones. Invest heavily in JSON completeness before optimising the prompt further.

**Recommendation: Run a controlled comparison.** Generate the upgraded CV, then score both versions (A and the new Sonnet output) on the 10-dimension rubric using a blind evaluation. If the Sonnet output scores lower than Version A on Narrative Strength or Differentiation, the prompt needs tightening — those are the two dimensions where Version A is strongest and where regression would be most costly.

---

*Analysis complete. The prompt specification above is designed to produce a CV that preserves Version A's narrative power while leveraging SSOT-Complete JSON to close the NZ positioning gap and add systematic quantification. The critical success factor is JSON input quality — the richer and more accurately tagged the input data, the better Sonnet will perform against this specification.*
