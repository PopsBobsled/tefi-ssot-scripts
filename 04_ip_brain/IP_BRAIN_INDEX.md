
---

## 2026-04-17 UPDATE: Person_ID Standard + Architecture Decisions

**New document added:**
- **CONVERSATION_KNOWLEDGE_2026-04-17.md** — Full knowledge extract from 2026-04-17 session (~4 hours, two context windows)

**Key decisions captured:**
1. Person_ID standard finalised and all five Kimi-facing source documents updated
2. Zoho CRM ID architecture — `Person_ID` is stable; Zoho Lead/Contact IDs stored separately, never used as match keys
3. Two-database architecture confirmed: T1 DB (leads→invoice) and Career Vault (clients, ongoing) must NOT merge
4. Career Vault protocol bumped to v3.1
5. Content marketing architecture: 5 posts/week, 2:1 NZ/AU, Sunday review gate
6. 8 vault JSONs normalised; 2 malformed (need regeneration)

**Open items tracked in document:** Registry normalisation, JSON Ruleset A, Relay WF2, Apps Script stage manager, Laura Flynn draft

**Promote to standing docs when ready:**
- Person_ID standard → already in `PERSON_ID_STANDARD.md` ✅
- Zoho ID architecture → promote to `00_TEFI_Operating_Model.md`
- Two-DB rule → promote to `02_Client_Lifecycle_Model.md`
- Content voice rules → promote to `01_Communication_Principles.md`

---

## 2026-03-27 UPDATE: Industry Practice First Framework

**New Documents Added:**
1. **PRINCIPLE_INDUSTRY_PRACTICE_FIRST.md** — Core principle statement
2. **IP_BRAIN_DECISION_FRAMEWORK.md** — Operational framework for applying the principle

**Context:** During SSOT-Complete JSON architecture design (Tier 1 CV workflow optimization), identified that "industry practice benchmarking" should be first-order in all IP Brain decisions, not optional. These documents formalize that principle.

**Integration:** All future specifications created for IP Brain should:
- Include "Industry Practice Reference" section (template in IP_BRAIN_DECISION_FRAMEWORK.md)
- Cite precedent from healthcare, finance, or relevant industry
- Document adaptation rationale
- Update this framework when new precedents are established

**Owner:** IP Brain Governance (Tate)

