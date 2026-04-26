# PIPELINE_ROUTER.md
### Version: 1.1 | Last updated: 2026-04-12 | Owner: Tate — TEFI
> **AUTOMATION STATUS: DESIGNED-NOT-BUILT** — Step 1 (Relay) is live. Steps 2–4 are manual. n8n handoff not yet built. See `JSON_INGESTION_DECISION_LOG.md` before automating.

---

## ⭐ IF YOU ARE DESIGNING n8n WORKFLOWS — READ THIS FIRST

Before building any automation against this pipeline, read:

**`~TEFI/Tier1/JSON_INGESTION_DECISION_LOG.md`**

It contains (as of 2026-04-12):
- Confirmed decision: one schema (391-field Career Vault), two population rulesets (Lead + Enriched)
- Current automation reality: only Relay Step 1 is live; everything else is manual
- The Relay → n8n handoff design: where Relay ends, where n8n begins
- JSON-first sequencing: JSON generated before CV, not after
- Open questions that must be answered before upsert automation is built
- Cleanup tasks required before n8n build begins

**Do not assume this routing document reflects live automation. Check the Decision Log for current status of each step.**

---

## PURPOSE OF THIS FILE

This document is the **single source of truth for pipeline routing**. It specifies which prompt file to use for each step of the TEFI Tier 1 pipeline, eliminating ambiguity and preventing the use of competing or ad-hoc templates.

**Critical rule:** Before generating any client-facing output, consult this file. Use ONLY the prompt file listed for that step.

---

## TEFI TIER 1 PIPELINE ROUTING

### STEP 1 — CLIENT QUESTIONNAIRE EMAIL

**Trigger:** New client CV received

**Prompt file (ONLY option):**
- `TEFI_Tier1_01_Action_Prompt.md`

**Input:**
- `CV_TEXT` (client's full CV as plain text)

**Output:**
- One questionnaire email ready to send to client
- No commentary or preamble outside the email

**Model:** Haiku

**Next step:** Wait for client reply (4 days max). If no reply after 4 days, proceed to Step 3 (Nudge Email).

---

### STEP 2 — CAREER MIGRATION REPORT

**Trigger:** Client replies to Step 1 questionnaire

**Prompt file (ONLY option):**
- `TEFI_Tier1_02_Finishing_Prompt.md`

**Input:**
- `CV_TEXT` (client's original CV)
- `CLIENT_REPLY` (client's response to questionnaire)

**Output:**
- Complete Tier 1 Career Migration Report (6 sections)
- No commentary or preamble outside the report

**Model:** Sonnet

**Next step:** Review report for accuracy and brand compliance. Send decision email (Step 4).

---

### STEP 3 — NUDGE EMAIL (4-DAY FOLLOW-UP)

**Trigger:** No client reply received 4 days after Step 1 email sent

**Prompt file (ONLY option):**
- `TEFI_Tier1_Response_Nudge1.md`

**Input:**
- `CLIENT_FIRST_NAME` (first name only)
- `PERSONALIZED_COMPLIMENT_SENTENCE` (one genuine strength from their CV)

**Output:**
- One nudge email ready to send to client
- No commentary or preamble outside the email

**Model:** Haiku

**Next step:** Wait additional 3 days for reply. If still no reply, escalate or close case per your discretion.

---

### STEP 4 — DECISION / NEXT-STEPS EMAIL

**Trigger:** Report generated and ready to send to client

**Prompt file (ONLY option):**
- `TEFI_Tier1_03_Decision_Email_Prompt.md`

**Input:**
- Report content (from Step 2)
- Client context (name, profile, key strengths)

**Output:**
- One decision/next-steps email ready to send to client
- No commentary or preamble outside the email

**Model:** Haiku

**Next step:** Archive case.

---

## ROUTING VERIFICATION CHECKLIST

Before generating any client-facing output, complete this checklist:

```
STEP IDENTIFICATION:
□ Which pipeline step are we executing? (1, 2, 3, or 4)
□ Which trigger condition applies?

ROUTING LOOKUP:
□ PIPELINE_ROUTER.md consulted
□ Correct prompt file identified: _______________________
□ Input data verified (present and complete)
□ Model selection confirmed: _______________________

PRE-EXECUTION AFFIRMATION:
□ Ready to execute: YES / NO
```

---

## POLICY ON PROMPT DIVERSITY

**Current state:** Each step has ONE authoritative prompt file. No competing templates are permitted.

**Future allowance for diversity:** If you decide that a step should support multiple approaches (e.g., different nudge templates for different client profiles, or alternative report formats for different sectors), this document will be updated to list all approved options with clear routing rules.

**Preventing ad-hoc templates:** Any new templates created must be:
1. Documented in this file
2. Approved explicitly by Tate
3. Named with clear version control
4. Not allowed to compete with existing templates without documented reason

**Deletion policy:** Ad-hoc or superseded templates are deleted immediately after a new authoritative template is established. No legacy templates remain in the prompt directory.

---

## EVOLUTION TO REGISTRY FORMAT

**Current approach:** PIPELINE_ROUTER.md is a human-readable markdown document that serves as the operational blueprint and policy document.

**Future evolution:** As the TEFI system scales and you need to:
- Automatically route clients through multi-step pipelines
- Track which prompt version was used for which client case
- Introduce variant prompts for different scenarios (e.g., Nudge v1, Nudge v2 for different profiles)
- Build audit trails and case management workflows
- Query pipeline structure programmatically

...this router will graduate to a **structured registry format** (JSON, YAML, or database) that machines can parse and act on. PIPELINE_ROUTER.md will transition to serve as the **policy and governance document** that references the structured registry.

**This document is the precursor to that registry.** Its structure is designed to be machine-parseable when needed—step IDs, prompt file paths, input/output specs, triggers, and next steps are all clearly enumerated for future automation.

---

## CHANGE LOG

| Date | Change | Reason |
|------|--------|--------|
| 2026-03 | Initial release | Establish single source of truth for prompt routing; prevent use of competing ad-hoc templates |

---

*PIPELINE_ROUTER.md | Tate's Employment for Immigration*


---

*© 2026 Tate Ulsaker / Tate's Employment for Immigration. All rights reserved. Confidential and proprietary — do not reproduce or share without written permission.*