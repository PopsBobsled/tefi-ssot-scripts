# Band Routing Specification v1.0
**Created:** 2026-06-13 | **Owner:** Tate Ulsaker
**Purpose:** Maps the Qualification Gate's profile_score output to email bands and templates.

---

## Profile Score to Band Mapping

The Qualification Gate in 01a (`x07Uvb7IOBQgOwdr`) produces two outputs that drive routing:

| Gate output | Value | Band | Template | Track | auto_send |
|---|---|---|---|---|---|
| `qualified: true` + `profile_score: "high"` | High | **A / B+** | T-BAND-A | 1-on-1 | false (draft) |
| `qualified: true` + `profile_score: "medium"` | Medium | **B** | T-BAND-BC | Group | false (draft) |
| `qualified: true` + `profile_score: "low"` | Low | **C** | T-BAND-BC | Group | false (draft) |
| `qualified: false` | n/a | **D** | T-BAND-D | None | false (draft) |

All bands default to draft mode. Tate reviews before any email is sent.

---

## Scoring Logic (from Qualification Gate, 01a)

The Qualification Gate uses three factors:

1. **Qualification pass:** highest_qualification matches DEGREE_KEYWORDS or TRADE_KEYWORDS
2. **Experience pass:** years_relevant_experience >= 1
3. **Skills match:** skills text matches DEMAND_SECTORS list

Aggregation:
- `high`: qualification pass AND years >= 3 AND skills match
- `medium`: qualification pass AND years >= 1 AND (skills match OR years >= 5)
- `low`: qualification pass AND years >= 1 (but neither of the above)
- `unqualified (D)`: fails qualification pass OR experience pass

Manual override: `force pass` / `force fail` in person_profile bypasses all scoring.

---

## n8n Implementation (orchestrator changes required)

### Current flow (no banding)
```
Qualification Gate → Is Qualified? → [yes] → Save L1 JSON → Zoho URL writeback
                                   → [no]  → Zoho Park Lead
```
After the qualified path returns to the orchestrator (01), the ACK email is sent,
then after 4 hours the QnA email (01b) fires. No band differentiation exists.

### Target flow (banded)
```
Qualification Gate → Is Qualified?
  → [yes] → Save L1 JSON → Zoho URL writeback → [return to 01]
      01 reads profile_score from 01a output
      → Switch on profile_score:
          "high"   → Execute Band A/B+ email sub-workflow (T-BAND-A)
          "medium" → Execute Band B/C email sub-workflow (T-BAND-BC)
          "low"    → Execute Band B/C email sub-workflow (T-BAND-BC)
  → [no] → Zoho Park Lead → [return to 01]
      01 reads qualified=false
      → Execute Band D email sub-workflow (T-BAND-D, draft only)
```

### Key design decisions
1. **Band email replaces both the current ACK email AND the QnA email** for Band A/B+.
   Band A/B+ candidates go to a 1-on-1 meeting, not through the QnA flow. The QnA
   questions + CM Report flow is triggered by the meeting, not by the first-touch email.
2. **Band B/C candidates go to the Masterclass**, not a 1-on-1. The QnA email
   (current 01b) may still fire after the Masterclass for B/C candidates — this is
   a future decision. For now, the band email is the first touch only.
3. **Band D candidates get a draft decline email.** No QnA, no CM Report, no
   Masterclass auto-enroll. Tate reviews manually.
4. **The 4-hour wait is removed for Band A/B+.** Top candidates get immediate outreach.
   B/C may retain a short delay (TBD by Tate).

---

## Template file locations (GitHub SSOT)

| Template ID | File | GitHub raw URL (after push) |
|---|---|---|
| T-BAND-A | `05_templates/T-BAND-A.md` | `https://raw.githubusercontent.com/[owner]/tefi-ssot-scripts/main/05_templates/T-BAND-A.md` |
| T-BAND-BC | `05_templates/T-BAND-BC.md` | `https://raw.githubusercontent.com/[owner]/tefi-ssot-scripts/main/05_templates/T-BAND-BC.md` |
| T-BAND-D | `05_templates/T-BAND-D.md` | `https://raw.githubusercontent.com/[owner]/tefi-ssot-scripts/main/05_templates/T-BAND-D.md` |

**Note:** Replace `[owner]` with the actual GitHub username/org after push.

---

## Zoho field requirements

| Field | Module | Purpose | Exists? |
|---|---|---|---|
| Profile_Score | Leads | Stores "high"/"medium"/"low"/"override" | Yes (created per scoring spec v1.0) |
| Cold_Flow_Stage | Leads | Updated per band action | Yes |
| Lead_Track | Leads | "Group" or "1-on-1" set by band | Yes |

No new Zoho fields needed.

---

## CHANGELOG

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-06-13 | Initial spec from L1 call chain audit |
