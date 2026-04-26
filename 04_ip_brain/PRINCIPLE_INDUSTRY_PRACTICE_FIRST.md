# PRINCIPLE: Industry Practice First

## Directive
For **any problem**, **any solution proposal**, and **any development process**, industry practice benchmarking must be a PRIMARY part of the decision process—not secondary or optional.

**Order of investigation:**
1. **What do industry leaders do?** (Healthcare, Finance, Tech, Legal, etc.)
2. **What patterns are proven?** (SSOT, data warehousing, microservices, etc.)
3. **How does this apply to our context?** (TEFI, Tier 1, IP Brain)
4. **Design from proven patterns.** (Avoid reinventing wheels)
5. **Document the industry precedent.** (Transparency + future reference)

## Examples

### Example 1: SSOT-Complete JSON Architecture
- **Problem:** Tier1 JSON and CV Upgrade both needed same data; inefficient dual extraction
- **Industry Practice:** Healthcare (EHR → domain-specific views), Finance (data warehouse → analytical marts), Legal (master document database → discovery sets)
- **Pattern:** Single canonical source → filtered views for downstream consumption
- **Our Solution:** SSOT-Complete JSON (canonical) → Tier1 JSON (filtered subset)
- **Result:** One extraction, multiple uses, no data loss, scalable to future steps

### Example 2: Data Architecture Decisions
When designing new data flows:
- Check: Data warehousing best practices (Kimball, Inmon models)
- Check: Event sourcing patterns (finance, healthcare)
- Check: CQRS (Command Query Responsibility Segregation)
- Then adapt to TEFI context

## Implementation in IP Brain

Every specification, prompt, and process design should include:

```markdown
## Industry Practice Reference
- **Pattern Name:** [e.g., SSOT, Event Sourcing, Master Data Management]
- **Industry Examples:** [e.g., Healthcare, Finance, SaaS]
- **Why It Applies:** [Connection to our problem]
- **Adaptation for TEFI:** [How we modify or apply it]
```

This section appears **before** the solution design, to ensure decisions are grounded in proven patterns.

## Integration into IP Brain Workflow

When creating new specifications or solving new problems:
1. **Industry Practice Research** (first step, not last)
2. **Pattern Selection** (which proven pattern fits?)
3. **Adaptation Design** (how does it work in our context?)
4. **Implementation Specification** (what do we build?)
5. **Documentation** (record the industry precedent for future reference)

## Benefits

- **Faster problem-solving:** Don't reinvent; adapt proven patterns
- **Lower risk:** Built on industry validation, not speculation
- **Easier scaling:** Patterns proven at scale in larger domains
- **Future-proof:** When new problems arise, check what industry does first
- **Documentation:** Clear audit trail of *why* we chose each architecture

---

**Created:** 2026-03-27  
**Context:** SSOT-Complete JSON architecture decision for Tier1 workflow  
**Principle Owner:** IP Brain Governance  
**Status:** Active (integrate into all future specifications)
