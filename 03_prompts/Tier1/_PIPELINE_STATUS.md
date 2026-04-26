# Pipeline Automation Status
**Last updated:** 2026-04-12 | Read this before building or modifying any automation.

---

| Step | Description | Automation Status | Tool | Notes |
|---|---|---|---|---|
| CV Triage | Tate reviews incoming CV, decides to ingest | MANUAL — intentional | Human | Not to be automated |
| Step 0 | Receipt confirmation email | LIVE (manual trigger) | Claude + Tate | Prompt: `TEFI_Tier1_00_Confirmation_Prompt.md` |
| Step 1 | Questionnaire email | LIVE (automated) | Relay.app | Only fully automated step |
| Nudge 3-day | Follow-up if no reply | DESIGNED-NOT-BUILT | n8n (planned) | Logic: `TEFI_Tier1_Nudge_Email_Logic.md` |
| Nudge 10-day | Second follow-up | DESIGNED-NOT-BUILT | n8n (planned) | Same file as above |
| Nudge 40-day | Auto-pause | DESIGNED-NOT-BUILT | n8n (planned) | Same file as above |
| Step 2 | CMSnapshot / Tier 1 report | MANUAL | Claude + Tate | Prompt: `TEFI_Tier1_02_Finishing_Prompt.md` |
| JSON generation | Lead JSON → Career Vault | DESIGNED-NOT-BUILT | n8n (planned) | Schema: `../JSON_Schema/` — JSON before CV |
| CV upgrade | Tier 1 CV from JSON | MANUAL | Claude + Tate | Runs after JSON, not before |
| Step 3 | Decision / payment email | MANUAL | Claude + Tate | Prompt: `TEFI_Tier1_03_Decision_Email_Prompt.md` |
| Registry update | Tier1_Registry_expanded.xlsx | MANUAL | Tate | Target: automate via n8n upsert |

---

## Next automation boundary
**Relay → n8n handoff.** Relay owns Step 1. n8n will own JSON generation and Career Vault upsert.  
Full architecture context: `../JSON_INGESTION_DECISION_LOG.md`

---

*This file is intentionally minimal. It will be superseded when n8n workflows are built.*


---

*© 2026 Tate Ulsaker / Tate's Employment for Immigration. All rights reserved. Confidential and proprietary — do not reproduce or share without written permission.*