# IP Brain Decision Framework
## Industry Practice First Methodology

**Version:** 1.0  
**Created:** 2026-03-27  
**Status:** Active  
**Owner:** IP Brain Governance

---

## Core Principle: Industry Practice First

When solving problems, designing solutions, or developing new processes, **industry practice benchmarking is a mandatory first step**, not an afterthought.

This ensures:
- Solutions are grounded in proven patterns
- Risk is minimized through battle-tested approaches
- Scalability is built in from the start
- Future problems benefit from precedent established today

---

## Decision Process Framework

### Phase 1: Problem Definition & Industry Research
**What:** Clearly define the problem, then immediately research how industry solves it

**Questions to ask:**
- What do healthcare systems do for this?
- What pattern does finance use?
- How do SaaS platforms handle this?
- What does distributed systems architecture teach us?
- Are there existing standards (ISO, NIST, etc.)?

**Output:** Industry Practice Reference document citing 2–3 proven patterns

### Phase 2: Pattern Selection
**What:** Evaluate which industry pattern best fits TEFI context

**Evaluation criteria:**
- Scalability: Does it work at our expected growth level?
- Simplicity: Can we implement and maintain it?
- Flexibility: Does it allow for future evolution?
- Cost: Is it practical for our resource constraints?

**Output:** Selected pattern with justification

### Phase 3: Adaptation Design
**What:** Customize the industry pattern for TEFI's specific context

**Process:**
- Take the proven pattern
- Identify what must stay (core principles)
- Identify what can change (implementation details)
- Design TEFI-specific adaptations
- Document modifications with rationale

**Output:** Adapted design specification

### Phase 4: Implementation Specification
**What:** Create detailed specification for building the solution

**Includes:**
- Architecture diagrams
- Data flows
- API contracts
- Error handling
- Validation rules
- Performance requirements

**Output:** Executable specification ready for development

### Phase 5: Documentation & Precedent
**What:** Record the industry precedent and adaptation for future reference

**Includes:**
- What industry practice was chosen
- Why it was selected
- How it was adapted
- What assumptions were made
- Where to find the original research

**Output:** Audit trail for future decision-makers

---

## Template: Industry Practice Reference Section

Every new specification should include this section **at the beginning**:

```markdown
## Industry Practice Reference

### Problem Statement
[Clear definition of the problem being solved]

### Industry Patterns Researched
1. **Pattern Name:** [e.g., SSOT, Event Sourcing, Master Data Management]
   - **Used by:** [Healthcare, Finance, Tech companies]
   - **Rationale:** [Why this pattern works]
   - **Pros:** [3–5 key advantages]
   - **Cons:** [Important limitations]

2. **Pattern Name:** [Alternative pattern]
   - [Same structure]

### Selected Pattern
**Name:** [The one we chose]  
**Rationale:** [Why this one vs. alternatives]  
**Industry Examples:** [2–3 concrete examples]  

### Adaptation for TEFI
[How we modify/customize the pattern for our context]

### Success Criteria
[How we'll know if the adapted pattern works]
```

---

## Examples Applied

### Example 1: SSOT-Complete JSON
**Problem:** Tier1 JSON and CV Upgrade process both needed same source data; inefficient to extract twice

**Industry Practice Researched:**
- Data Warehousing (Kimball, Inmon)
- Master Data Management (MDM)
- Event Sourcing
- CQRS (Command Query Responsibility Segregation)

**Selected Pattern:** Single Source of Truth (SSOT) with derived views
- Used by: Healthcare (EHR systems), Finance (data warehouses), Legal (document management)
- Advantage: One extraction, multiple uses, no data loss
- Proven at: Healthcare systems managing millions of records, Financial institutions managing petabytes

**Adaptation for TEFI:**
- Create SSOT-Complete JSON with all client/CV/decision data tagged semantically
- Tier1 JSON is pure subset (cut-and-paste, not transformation)
- CV Upgrade consumes SSOT-Complete, not raw CV
- Career Vault ingestion uses Tier1 JSON (filtered view)

**Result:** Scalable architecture that supports both current Tier 1 pipeline and future extensions

---

### Example 2: QA/QC Process (Future)
When you design QA validation for JSON outputs, the process should:
1. Research: How do healthcare systems validate EHR data integrity?
2. Research: How do financial institutions validate transaction data?
3. Research: What do SaaS companies use for data quality monitoring?
4. Select: Pattern best suited to TEFI's complexity
5. Adapt: Customize for our JSON structure and validation rules
6. Document: Record the industry precedent selected

---

## Integration into Tier 1 & Beyond

### For Tier 1 Specifications
Every new Step (4, 5, 6+) should include:
- Problem statement
- Industry practice research
- Selected pattern with rationale
- TEFI adaptation
- Implementation detail

### For IP Brain Development
Every new module or decision should ask:
- What does industry do here?
- Which pattern applies?
- How do we adapt it?
- Why did we choose this path?

### For Future Problem-Solving
When a new challenge arises:
1. Check IP Brain for precedent
2. Research industry practice (don't assume prior solutions apply)
3. Adapt proven pattern
4. Document decision
5. Add to IP Brain for future reference

---

## Benefits of This Framework

✅ **Faster Decisions:** Industry practice research accelerates decision-making (you're not inventing, you're adapting)

✅ **Lower Risk:** Built on battle-tested patterns proven at scale

✅ **Better Scaling:** Patterns that work for Netflix, Google, healthcare systems will work for TEFI at growth scale

✅ **Easier Maintenance:** Future teams understand *why* decisions were made (audit trail)

✅ **Continuous Improvement:** As industry practices evolve, IP Brain stays current by checking precedent regularly

---

## Governance

- **Owner:** IP Brain Governance (Tate)
- **Review Cadence:** Quarterly (check if industry practices have evolved)
- **Updates:** When new major decision is made, update this framework
- **Audit:** All specifications should reference this framework in their rationale

**Last Updated:** 2026-03-27  
**Next Review:** Q2 2026
