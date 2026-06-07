# TEFI Profile Scoring Specification v1.0
**Status:** LOCKED
**Locked:** 2026-06-07
**Author:** Tate Ulsaker + Opus 4.6
**Benchmark:** Validated against NZ SMC 6-point system, AU Subclass 189 points system, ATS scoring frameworks (Workday/Greenhouse/iCIMS), and standard HR tier-grading systems. No gaps identified.

---

## Purpose

Score a candidate's employability positioning for the NZ/AU migration job market using structured data from the Career Vault v4 JSON. This is NOT a visa eligibility score. It measures how strong the candidate's profile is for employer engagement.

## Zoho Field

- **Field name:** `Profile_Score`
- **Field type:** Single Line (text)
- **Modules:** Leads + Contacts (same field in both)
- **Example value:** `A27-QL4-ED5-CP3-RS4-IM4-CD2-EQ3`

---

## Scoring Factors (7 total, all from Career Vault JSON)

### QL -- Qualification Level (1-5)

| Score | Meaning | JSON Source |
|-------|---------|-------------|
| 1 | No formal qualification | `highest_qualification` |
| 2 | Certificate (Level 3-4) | |
| 3 | Diploma (Level 5-6) | |
| 4 | Bachelor degree (Level 7) | |
| 5 | Postgraduate or higher (Level 8+) | |

### ED -- Experience Depth (1-5)

| Score | Meaning | JSON Source |
|-------|---------|-------------|
| 1 | Less than 2 years | `years_experience` + role date spans |
| 2 | 2-5 years | |
| 3 | 5-10 years | |
| 4 | 10-15 years | |
| 5 | 15+ years | |

### CP -- Career Progression (1-5)

| Score | Meaning | JSON Source |
|-------|---------|-------------|
| 1 | Single role, no progression | `roles[]` title sequence + QnA leadership answers |
| 2 | Lateral moves, same level | |
| 3 | Clear upward trajectory | |
| 4 | Management responsibility | |
| 5 | Senior management or executive | |

### RS -- Registration Strength (1-5)

| Score | Meaning | JSON Source |
|-------|---------|-------------|
| 1 | No professional registration | `professional_registrations[]` |
| 2 | Home country only | |
| 3 | Home + 1 international | |
| 4 | Multiple international | |
| 5 | NZ or AU registered | |

### IM -- International Mobility (1-5)

| Score | Meaning | JSON Source |
|-------|---------|-------------|
| 1 | Home country only | `roles[].Employer_Location_Country` unique count |
| 2 | 1 international move | |
| 3 | 2 countries worked in | |
| 4 | 3+ countries | |
| 5 | 3+ countries including NZ, AU, or UK | |

### CD -- Certification Density (1-3)

| Score | Meaning | JSON Source |
|-------|---------|-------------|
| 1 | No certifications | `certifications_raw[]` count |
| 2 | 1-3 certifications | |
| 3 | 4+ certifications | |

### EQ -- Evidence Quality (1-5)

| Score | Meaning | JSON Source |
|-------|---------|-------------|
| 1 | No achievements listed | `achievements[]` + `evidence[]` + `raw_duties` |
| 2 | Duties only, no outcomes | |
| 3 | Some quantified achievements | |
| 4 | Strong quantified achievements across roles | |
| 5 | Published, awarded, or externally recognised | |

---

## Aggregate and Bands

**Aggregate:** Sum of all 7 factors. Range: 7-33.

| Band | Range | Meaning | Operational Action |
|------|-------|---------|-------------------|
| A | 24-33 | Strong profile | 1-on-1 invite (T-T1-RPT1-A) |
| B | 15-23 | Solid with gaps | Masterclass CTA (T-T1-RPT1-B) |
| C | 7-14 | Developing | Masterclass only (T-T1-RPT1-C) |

---

## Code Format

```
<Band><Aggregate>-QL<n>-ED<n>-CP<n>-RS<n>-IM<n>-CD<n>-EQ<n>
```

**Example:** `A27-QL4-ED5-CP3-RS4-IM4-CD2-EQ3`

---

## Design Decisions

1. **Age excluded.** We score employability positioning, not visa eligibility.
2. **CD capped at 3.** Cert count does not warrant a 5-point spread.
3. **Score derived, not stored in JSON.** Scoring formula can evolve without migrating JSON files.
4. **Single text field in Zoho.** Compact code carries full breakdown. No need for 7 separate fields.

---

*v1.0 LOCKED 2026-06-07*
