# TEFI Tier 1 Prompts — CANONICAL LOCATION
### Last Updated: 2026-03-25 | Owner: Tate — TEFI

---

## 🎯 THIS IS THE SOURCE OF TRUTH

This folder (`/Tier1/TEFI_Tier1_Prompts/`) contains the **definitive, current versions** of all Tier 1 pipeline prompts and documentation.

**Any other locations with Tier 1 files are outdated duplicates and should be ignored or archived.**

---

## 📋 CANONICAL FILE LIST

**Every file in this folder should be:**
- ✅ Used when running the Tier 1 pipeline
- ✅ Updated here first (single source of truth)
- ✅ Referenced in all internal docs and handoffs

| File | Purpose | Last Updated | Version |
|------|---------|--------------|---------|
| `TEFI_Tier1_00_Shared_Standards.md` | Foundational rules (tone, salary, metrics) | Mar 5 | v1.0 |
| `TEFI_Tier1_01_Action_Prompt.md` | Step 1: Generate questionnaire email | Mar 5 | v1.2 |
| `TEFI_Tier1_02_Finishing_Prompt.md` | Step 2: Generate Tier 1 Report | Mar 7 | v1.1 |
| `TEFI_Tier1_03_Decision_Email_Prompt.md` | **NEW** Step 3: Generate payment choice email | Mar 25 | v1.0 |
| `TEFI_Tier1_PIPELINE_OVERVIEW.md` | **NEW** Complete 10-day pipeline map | Mar 25 | v1.0 |
| `TEFI_Global_Instruction.txt` | Global instructions for the system | Mar 6 | — |
| `TEFI_Tier1_03_registry_instruction.md` | Registry/reference instructions | Mar 6 | — |

---

## ⚠️ DEPRECATED LOCATIONS

**These folders contain outdated duplicates — DO NOT USE:**

- ❌ `/Prompts/Tier 1 Pipeline/` — Contains older versions (dated Mar 5), stale `.txt` stubs, empty files
  - **Status:** Should be archived
  - **Action:** Reference this README if someone points you there

---

## 🔄 WORKFLOW

**When you need a Tier 1 prompt:**

1. Open the file from **this folder ONLY**
2. Read the full prompt file (e.g., `TEFI_Tier1_01_Action_Prompt.md`)
3. Copy the prompt instruction text
4. Paste into Claude
5. Run

**If you find a version elsewhere:**
- Check the date (this folder has the latest)
- Delete or archive the older version
- Update any references to point here

---

## 📝 MAKING UPDATES

**When you update a prompt:**

1. Edit the file in **this folder only**
2. Update the "Last Updated" date at the top of the file
3. Update the version number (e.g., v1.2 → v1.3)
4. Do NOT create new versions in other locations
5. Delete old versions in other locations

---

## 🗂️ RELATED FILES (NOT IN THIS FOLDER)

For reference, related Tier 1 work exists in other locations:

- **Automation Documentation:** `/TIER1_AUTOMATION_BLUEPRINT.xlsx`
- **Automation Toolkit:** `/TIER1_AUTOMATION_TOOLKIT_GUIDE.md`
- **Client Deliverables:** `/Clients/[CLIENT_NAME]/[Tier1_Report/Snapshot].docx`
- **Email Learning:** `/Email-Brain/Tier1_*.md`
- **Registry:** `/Tier1/TEFI_Tier1_Registry/`

These are **products or outputs**, not sources. The prompts here are the source.

---

## ✅ MIGRATION CHECKLIST

**If consolidating from other locations, ensure:**

- [ ] Location 1 (`/Tier1/TEFI_Tier1_Prompts/`) has all latest files
- [ ] Location 2 (`/Prompts/Tier 1 Pipeline/`) is archived/deleted
- [ ] All internal references point to `/Tier1/TEFI_Tier1_Prompts/`
- [ ] No other locations contain active Tier 1 prompt files
- [ ] Team/staff know to use ONLY this location

---

*TEFI_Tier1_Prompts/README.md | Single Source of Truth*


---

*© 2026 Tate Ulsaker / Tate's Employment for Immigration. All rights reserved. Confidential and proprietary — do not reproduce or share without written permission.*