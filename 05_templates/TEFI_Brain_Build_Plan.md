# TEFI Brain Build Plan
**Owner:** Tate Ulsaker
**Created:** 2026-04-21
**Cadence:** Saturday 9:00 AM NZT — one topic per session
**Purpose:** Build the Claude knowledge files that ground all model outputs in Tate's actual knowledge, decisions, and positioning — not generic training data.

---

## Sessions in Priority Order

| # | File to Build | Impact | Size | Status |
|---|---|---|---|---|
| 1 | `TEFI_Escalation_Rules.md` | Highest safety value — prevents Haiku acting on situations that need Tate | 2 sessions (Session 1 autonomous seed; Session 2 Tate interview) | In progress — Session 1 complete 2026-04-25 (draft seeded from CLAUDE.md, Voice Ref, daily logs). Session 2 pending: 10 interview questions listed in Section 3 of the file. |
| 2 | `TEFI_Market_Intelligence.md` | Highest quality value — grounds CMSnapshot, CV, and template outputs in real NZ/AU market knowledge | Large (2–3 sessions) | Not started |
| 3 | `TEFI_Persona_and_Positioning.md` | Shapes how all content represents Tate and TEFI — LinkedIn, meeting invites, CMSnapshot intro | Quick (1 session) | Not started |
| 4 | `TEFI_Service_Architecture_Deep.md` | Prevents wrong answers about what's included in each tier — proposals, Haiku replies, CMSnapshot | Medium (1–2 sessions) | Partial (`TEFI_Service_Architecture.md` exists — needs deepening) |
| 5 | `TEFI_Content_Rules.md` | Ensures all outputs use correct spelling, naming, formatting conventions across all channels | Quick (1 session) | Partial (`INSTAGRAM_PROMPT_RULES.md` exists — needs extending) |
| 6 | `TEFI_Decision_Log.md` | Prevents recurring debates — logs non-obvious decisions with date and reasoning | Ongoing (seed in 1 session, grows continuously) | Partial (JSON_INGESTION_DECISION_LOG.md exists — needs generalising) |

---

## What Each File Does

**TEFI_Escalation_Rules.md**
Which situations always require Tate's judgment and must never be handled automatically. Pricing conversations, clients expressing distress, visa status uncertainty, anything involving a third party. Haiku reads this before queuing any draft.

**TEFI_Market_Intelligence.md**
What Tate knows about the NZ/AU job market that no model would know by default. Why recruiters are 95% ineffective for migrants, how AEWV works in practice, which sectors are active, what NZ employers look for vs what candidates assume, realistic salary bands by role. Sonnet reads this when writing CMSnapshots and CVs.

**TEFI_Persona_and_Positioning.md**
How Tate wants to be perceived. The difference between TEFI and a recruiter. What Tate says when asked why he does this work. What candidates consistently misunderstand that TEFI corrects. Read by Sonnet for all content — LinkedIn posts, meeting invitations, CMSnapshot framing.

**TEFI_Service_Architecture_Deep.md**
Detailed service inclusions per tier. What is and isn't in Tier 1, 2, 3, 4. What "free" means in the CMSnapshot context. How the programme stages work end to end. Read by Haiku when answering service questions, by Sonnet when writing proposals.

**TEFI_Content_Rules.md**
Spelling (NZ English), name conventions (first name always), date format, number format, what to capitalise, platform-specific rules beyond Instagram. Read by all models before producing any client-facing content.

**TEFI_Decision_Log.md**
A running record of non-obvious decisions made about workflow, services, tools, and processes — with date and reasoning. Prevents the same debate recurring. Read when a new decision touches an existing domain.

---

## Session Format

At the start of each Saturday session:
1. Read this file to confirm which topic is next
2. Tate provides raw material — answers to questions, existing notes, examples from emails
3. Sonnet shapes it into the brain file
4. Tate reviews and approves
5. File is saved, this plan updated with status

---

## Notes

- Client relationship memory (`[Client]_Notes.md`) is built incrementally per client session — not a dedicated Saturday topic
- Voice Reference (`TEFI_Voice_Reference.md`) is already built — maintained via `Voice Example` label and monthly consolidation
- All brain files live in `~TEFI/Templates/` unless they are workflow-specific (escalation rules may live alongside the skill files)

---

*TEFI_Brain_Build_Plan.md | Tate's Employment for Immigration | 2026-04-21*
