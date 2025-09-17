# TEFI SSOT Scripts

Google Apps Script utilities for managing a **Single Source of Truth (SSOT)** in Google Sheets.

## Features
- **buildSSOT** → Creates two master tables:
  - `static_registry_master` (field definitions, rules, templates)
  - `dynamic_registry_master` (live client, campaign, and activity data)
- **validateSSOTCounts** → Compares row counts between source tabs and master tables, logs mismatches.
- **Custom Menu** → Adds a `TEFI SSOT` menu to Google Sheets with one-click access.

## Usage
1. Open your Google Sheet → Extensions → Apps Script.
2. Paste the code from [`tefi_ssot_builder_validator.js`](./tefi_ssot_builder_validator.js).
3. Refresh the Sheet → use the `TEFI SSOT` menu.
4. Run:
   - **Build Master Tables** to regenerate SSOT.
   - **Validate Row Counts** to confirm integrity.

## Backup
This repo ensures all scripts are version-controlled and safe.

---
*Created for TEFI Business operations — scalable, auditable, automation-ready.*
# tefi-ssot-scripts
