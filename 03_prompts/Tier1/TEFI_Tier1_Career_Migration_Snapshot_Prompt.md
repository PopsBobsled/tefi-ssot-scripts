# TEFI Tier 1: Career Migration Snapshot Prompt
**Version:** 3.2 | **Model:** Claude Sonnet 4.6 | **Purpose:** Client-facing synthesis + SSOT-JSON for Relay

---

## OVERVIEW

The Career Migration Snapshot is a **dual-output document**:
1. **Client-facing Markdown report** (professional narrative synthesis)
2. **Tier1_SSOT-JSON** (pipeline-ready data structure for Relay Career Vault ingestion)

**Input source:** Tier1_Complete-JSON (synthesized from CV + intake questionnaire response)

**Delivery:** Both outputs reviewed against approval gates before client communication and Relay ingestion.

---

## CONFIG SECTION

Before running this prompt, specify:

```json
{
  "client_name": "[Full name from CV]",
  "client_seniority": "[entry / mid / senior / executive]",
  "target_market": "[NZ international candidate / domestic / regional]",
  "focus_positioning": "[e.g., 'technical leadership', 'dual practitioner-leader', 'clinical scope', 'regulatory alignment']",
  "snapshot_scope": "[full / abbreviated / focus]"
}
```

---

## INPUT REQUIREMENTS

You will receive:

**Tier1_Complete-JSON structure:**
```json
{
  "metadata": {
    "cv_source": "CV filename",
    "intake_source": "Questionnaire filename",
    "synthesis_date": "YYYY-MM-DD"
  },
  "professional_profile": {
    "current_role": "...",
    "years_experience": 0,
    "core_competencies": ["..."],
    "career_arc": "narrative description"
  },
  "roles": [
    {
      "role_title": "...",
      "organization": "...",
      "dates": "YYYY-MM to YYYY-MM",
      "location": "...",
      "scope": "...",
      "key_achievements": ["..."],
      "narrative_tags": ["..."]
    }
  ],
  "intake_response": {
    "nz_connection": "...",
    "migration_readiness": "...",
    "sector_alignment": "...",
    "key_context": "..."
  },
  "positioning": {
    "differentiator": "...",
    "narrative_thread": "...",
    "target_market_fit": "..."
  }
}
```

---

## SYNTHESIS INSTRUCTIONS

### SECTION 1: PROFESSIONAL OVERVIEW (3-4 paragraphs)

**Purpose:** Establish career narrative, market positioning, and NZ relevance in opening statement.

**Rules:**
- Paragraph 1: Role title + years of experience + core competency (one sentence summary of differentiator)
- Paragraph 2: Career trajectory (entry → progression → current level) with 2-3 inflection points
- Paragraph 3: NZ positioning statement (prior NZ experience, sector alignment, or capability match to NZ context)
- Paragraph 4 (if applicable): Regulatory or qualification context (e.g., registration status, equivalency mapping)

**Quality gate:** Reader should understand who this person is, what they've accomplished, and why they matter for NZ context within 30 seconds.

---

### SECTION 2: CAREER TIMELINE

**Purpose:** Provide structured chronological view of role progression with gap explanation.

**Format:**
- Create a simple timeline table or bullet list
- Include: Year range | Role Title | Organization | Location
- Flag any employment gaps > 6 months with brief explanation from intake response
- Use intake data to contextualize transitions (e.g., "career break for family relocation" vs. "roles overlap during transition")

**Quality gate:** No unexplained gaps; timeline should validate the career arc narrative from Section 1.

---

### SECTION 3: SCOPE OF PRACTICE & CLINICAL/TECHNICAL CAPABILITY

**Purpose:** Demonstrate depth of responsibility, independent decision-making, and market-relevant expertise.

**Rules:**
- Subsection 3a: **Unit/Team Overview** — Size, structure, scope (if applicable; e.g., "10-bed ICU, typically 5 staff per shift")
- Subsection 3b: **Independent Responsibilities** — What this person does *without routine supervision* (3-5 bullet points minimum)
- Subsection 3c: **Real-world Examples** — Embed 2-3 concrete examples from intake Q&A showing decision-making under pressure

**Narrative threading instruction:** Within this section, reference at least one prior role to show how current scope builds on earlier foundation. Example: "This depth of post-operative care management builds on her 4 years of surgical prep experience at [Prior Role]."

**Quality gate:** Scope should be demonstrably NZ-relevant (i.e., responsibilities align with NZ health/tech standards, regulatory context, or critical infrastructure needs).

---

### SECTION 4: QUALIFICATIONS & REGISTRATION STATUS

**Purpose:** Map qualifications to NZ context; flag equivalency mapping opportunities.

**Rules:**
- List formal qualifications with dates and awarding institution
- Include professional registrations, certifications, and renewal status (if available from intake)
- If client is international candidate: **flag equivalency context** (e.g., "RGN (South Africa, NQF Level 6) sits between EN and RGN in NZ scope; registration pathway includes...") **only if explicitly requested or clearly applicable**
- For NZ domestic candidates: note any specialized certifications relevant to current role

**Quality gate:** Qualifications should feel credible and directly support the scope of practice described in Section 3.

---

### SECTION 5: SKILLS SUMMARY

**Purpose:** Synthesize differentiator claim with 2+ supporting bullets from experience across different roles.

**Rules:**
- State the primary differentiator claim (from Tier1_Complete-JSON positioning field)
- Provide 2-3 bullet points showing how this claim is evidenced across **different roles** (not just current role)
- Use specific examples or capability statements (avoid generic phrasing)

**Example structure:**
> **Differentiator:** Dual mastery as technical practitioner and programme leader
> - Programme leadership: Led zero-disruption network upgrades across 3-state region (Current Role + Prior Role evidence)
> - Technical foundation: Maintains hands-on expertise in network architecture and VDSL2 provisioning (Current Role evidence + Technical Role evidence)

**Quality gate:** Differentiation claim is credible and verifiable from the career timeline and experience bullets.

---

## APPROVAL GATES (Pre-delivery validation)

**Gate 1: Narrative Threading**
- [ ] Minimum 3 cross-role references throughout the snapshot (not just Section 3)
- [ ] References show how earlier roles built foundation for current scope
- [ ] Career arc is coherent and demonstrates progression (not lateral movement only)

**Gate 2: Positioning Depth**
- [ ] For international candidates: 2-3 substantive NZ references (sector context, regulatory alignment, critical infrastructure relevance)
- [ ] For domestic candidates: Current role scope clearly positioned relative to prior experience
- [ ] Differentiator claim is specific and supported (not generic)

**Gate 3: Tone & Client Profile Alignment**
- [ ] Tone matches client seniority (executive: confidence without overstatement; mid-level: clear capability + growth potential; entry: enthusiasm + foundational competency)
- [ ] Language reflects client's sector (clinical, technical, operational, etc.)
- [ ] No jargon that alienates audience; all acronyms defined on first use or contextualized

**Gate 4: JSON Structure Validation**
- [ ] Tier1_SSOT-JSON contains all required fields (see SSOT Schema below)
- [ ] Role dates align with CV; no date contradictions
- [ ] Narrative thread and differentiator statements match snapshot text

**Gate 5: Readability & Length**
- [ ] Total snapshot: 1,000–1,500 words (client-facing, not exhaustive)
- [ ] Sections balance (no single section > 30% of total length)
- [ ] No orphaned paragraphs or abrupt transitions

---

## OUTPUT FORMAT

### OUTPUT 1: Client-Facing Markdown

**File naming:** `[ClientName]_Tier1_Career_Migration_Snapshot.md`

**Structure:**
```markdown
# Career Migration Snapshot
**[Client Name]**
**Prepared:** [Date]
**Prepared for:** [Organization, if applicable]

---

## 1. PROFESSIONAL OVERVIEW
[3-4 paragraphs]

## 2. CAREER TIMELINE
[Chronological view with gaps explained]

## 3. SCOPE OF PRACTICE & CLINICAL/TECHNICAL CAPABILITY
### 3a. Unit/Team Overview
[Subsection]

### 3b. Independent Responsibilities
[Bullet list]

### 3c. Real-world Examples
[Embedded examples with client voice]

## 4. QUALIFICATIONS & REGISTRATION STATUS
[Formal credentials, registrations, equivalency mapping if applicable]

## 5. SKILLS SUMMARY
[Differentiator + 2-3 supporting bullets across roles]

---

**Prepared by:** TEFI Tier 1 Pipeline (Sonnet 4.6)
**Status:** Ready for client delivery
```

### OUTPUT 2: Tier1_SSOT-JSON

**File naming:** `[ClientName]_Tier1_SSOT.json`

**Required fields:**

```json
{
  "metadata": {
    "client_name": "...",
    "snapshot_date": "YYYY-MM-DD",
    "snapshot_version": "3.2",
    "approval_gates_passed": true,
    "relay_ingestion_ready": true
  },
  "professional_summary": {
    "current_role": "...",
    "current_organization": "...",
    "years_experience_total": 0,
    "core_differentiator": "...",
    "nz_positioning_statement": "..."
  },
  "career_narrative": {
    "career_arc": "...",
    "narrative_thread": "...",
    "key_inflection_points": ["...", "...", "..."]
  },
  "roles": [
    {
      "sequence": 1,
      "role_title": "...",
      "organization": "...",
      "location": "...",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM",
      "duration_months": 0,
      "scope_summary": "...",
      "key_responsibilities": ["...", "..."],
      "independent_scope": ["...", "..."],
      "narrative_contribution": "...",
      "evidence_for_differentiator": ["...", "..."]
    }
  ],
  "qualifications": {
    "formal_qualifications": [
      {
        "qualification": "...",
        "awarding_body": "...",
        "year_awarded": "YYYY",
        "nz_equivalency": "..."
      }
    ],
    "registrations": [
      {
        "registration_type": "...",
        "body": "...",
        "status": "active|expired|pending",
        "expiry_date": "YYYY-MM-DD"
      }
    ]
  },
  "intake_insights": {
    "nz_connection": "...",
    "migration_readiness": "...",
    "sector_alignment": "...",
    "key_context_for_positioning": "..."
  },
  "quality_validation": {
    "gate_1_narrative_threading": true,
    "gate_2_positioning_depth": true,
    "gate_3_tone_alignment": true,
    "gate_4_json_validation": true,
    "gate_5_readability": true,
    "all_gates_passed": true,
    "relay_ready": true,
    "notes": "..."
  }
}
```

---

## EXECUTION WORKFLOW

1. **Receive:** Tier1_Complete-JSON + CONFIG
2. **Synthesize:** Generate client-facing Markdown using Sections 1–5
3. **Generate:** Build Tier1_SSOT-JSON from synthesis output
4. **Validate:** Run all 5 approval gates
5. **Report:** Display gate validation results and any red flags
6. **Deliver:** Return both files + gate validation summary

---

## QUALITY STANDARDS

| Dimension | Standard |
|-----------|----------|
| **Narrative Coherence** | Career arc is clear; roles build on each other |
| **NZ Positioning** | International candidates have 2-3 substantive NZ references; domestic candidates clearly positioned |
| **Differentiator Support** | Primary claim supported by 2+ bullets from different roles |
| **Tone** | Professional, client-appropriate, sector-aware |
| **Length** | 1,000–1,500 words (snapshot), complete JSON structure |
| **Gates Passed** | All 5 approval gates must return ✅ before delivery |

---

## NOTES FOR CLAUDE

- **Do not deliver the snapshot or JSON until all approval gates pass.**
- If any gate flags a red flag, return the gate result with specific guidance for revision.
- Preserve client voice from intake Q&A where possible (e.g., real-world examples in Section 3c should use client's own language).
- For international candidates, the NZ positioning statement is critical—it's the bridge between "excellent professional" and "right fit for NZ market."
- The SSOT-JSON is the canonical data structure for downstream Relay ingestion and CV Build; accuracy here is non-negotiable.

---

**TEFI Tier 1 Career Migration Snapshot Prompt | v3.2 | Sonnet 4.6 | Tate's Employment for Immigration**


---

*© 2026 Tate Ulsaker / Tate's Employment for Immigration. All rights reserved. Confidential and proprietary — do not reproduce or share without written permission.*