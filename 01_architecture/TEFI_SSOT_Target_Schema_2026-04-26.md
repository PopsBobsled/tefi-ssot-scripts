# TEFI SSOT Target Schema + Migration Plan — Deliverable 4

**Date:** 2026-04-26 (Sun)
**Status:** FINAL — Q1–Q4 confirmed and locked by Tate 2026-04-26. Three Q4 additions folded in. Phase 1 Step 2 unblocked for next session.
**Author:** Cowork Sonnet session built from `~TEFI/IP Brain/TEFI_Deliverable4_Blueprint.md` (2026-04-26)
**Preceded by:** D1 (LOCKED 2026-04-23), D2 (7 lock-points approved 2026-04-23), D3 (534 fields, 35 overlaps, 2026-04-23), Sheets-Zoho Sync Decision (2026-04-25)
**Companions:** `~TEFI/IP Brain/TEFI_TENANT_REGISTRY.md` (Deliverable D — ACTIVE per Q1 confirmation)
**Clears:** Gate 1 of the Five Gates (governance) — CLEARED 2026-04-26
**Unlocks:** Phase 1.4 sub-step execution — Sonnet ops session may proceed to Phase 1 Step 2 (produce old→new mapping CSVs) on Tate's next-session signal

---

## 0. Lock Decisions (Q1–Q4 confirmed 2026-04-26)

All four open questions confirmed and locked by Tate 2026-04-26. The TENANT_REGISTRY (`~TEFI/IP Brain/TEFI_TENANT_REGISTRY.md`) moves from DRAFT to ACTIVE as a consequence of Q1; this schema doc moves from DRAFT to FINAL.

**Q1 — Tenant prefix convention.** Confirmed as drafted. 3–5 chars uppercase A–Z, no digits or hyphens. TEFI-assigned, partner-suggested at contract signing. 17-prefix reserved list (TEFI itself + ANTHROPIC, OPENAI, GOOGLE, TEST, DEMO, ADMIN, NULL, TEMP, PROD, DEV, STAGE, MOCK, EFI, REFI, NEFI, TEFII). Immutable once assigned. First-claimed wins. Reservation procedure in TENANT_REGISTRY §4.

**Q2 — Vault gap priority order.** Confirmed. Phase 1 commit sequence: Gap 1 (SESSION_LOG) → Gap 6 (Maturity Index + readiness flags) → Gap 7 (OUTPUT_LOG populated + registry columns). INTERVIEW_LOG (Gap 2) designed in the same Phase 1 commit, shipped behind a feature flag, activation deferred to Phase 2 or first T4 interview coaching engagement (whichever sooner).

**Q3 — Cut-over Friday.** Confirmed. Friday 22 May 2026 NZT. Parallel window 22 May → Fri 12 June 2026 (3 weeks, clear of King's Birthday).

**Q4 — Missed overlaps.** Three additions raised by Tate, all accepted and folded in:

1. **Xero ↔ Zoho Accounts seam.** D3 inventoried Leads/Contacts/Deals only — Accounts module was off-radar. NEW fields on Account module (Xero_Contact_ID, Xero_Sync_Status, Xero_Last_Sync_At, Last_Reconciled_Date, IRD_Status, IRD_Number, Tenant_ID) + Deal.Xero_Invoice_ID. Schema lands Phase 1; n8n Xero ↔ Zoho automation deferred behind feature flag (post-D4 ops). See §2.3a.

2. **Commercial pipeline ↔ Production pipeline link made explicit.** Deal.Stage tracks commercial state; Vault maturity flags track production readiness; the link was implicit. Now explicit via NEW Deal fields: Production_Readiness_State (picklist, derived/synced from Vault), Vault_Maturity_Score (mirror), Active_Pack_ID (FK to Vault TARGET_ROLE_PACK). Plus a Zoho list view "Production Bottlenecks" (Deals where Stage ∈ {DS_T1A, DS_T2A, DS_T3S2, DS_T3S3} but Production_Readiness_State = Awaiting Vault Maturity). See §2.3.

3. **Vault JSON as canonical primary; CV is one input among many; outputs through OUTPUT_LOG_URL.** NEW fields: Contact.Vault_JSON_URL (primary), Contact.Source_CV_URL + Contact.Source_Q_and_A_URL + Contact.Source_Interview_Transcripts_URL + Contact.Source_LateArrival_Docs_URL (input category, folder-URL-shaped), Deal.Active_Vault_JSON_URL (pinned production JSON version), Deal.OUTPUT_LOG_URL (single link to filtered OUTPUT_LOG view per deal — n8n stamps on Deal create). Per-deliverable URL fields explicitly NOT created — OUTPUT_LOG row scales to 18+ deliverable types without schema change. See §2.2 and §2.3.

**Q4 Addition 3 extension (folded in same session 2026-04-26 post-quota-confirmation):** A fourth URL category added to complete the canonical / source / output / asset model — **Asset_*_URL fields on Contact** for persistent client-facing deliverables that need direct addressability (distinct from build-time outputs in OUTPUT_LOG). NEW fields: Contact.Asset_Profile_Pitch_Clip_URL, Contact.Asset_Photo_Portfolio_URL, Contact.Asset_Career_Snapshot_Card_URL, Contact.Asset_LinkedIn_Visual_Kit_URL, Contact.Asset_Folder_URL (top-level catch-all). Two existing renames retargeted: LinkedIn(api) → `Asset_Video_CV_URL` and Website(api) → `Asset_Short_Clip_URL`. LinkedIn1 → `LinkedIn_URL` stays unchanged (client's own profile, not a TEFI-produced asset). Net +5 truly-new Contact custom fields (the 2 retargeted renames are absorbed). See §2.2.

**Outcome:** Phase 1 step count grows from 16 to 19. Total migration plan steps: 40 (was 37). Cut-over Friday unchanged at Fri 22 May 2026. Zoho per-module custom-field quota confirmed under by Tate 2026-04-26 (Lead post-migration ~60, Contact ~74, Deal ~35, Account 7 — all well under the 155-per-module Professional Plan limit). Asset_*_URL extension folded into Phase 1 Step 6 (URL field creation) — no new step added.

---

## 1. Inherited Constraints (NOT reopened — flag-only)

Per D4 Blueprint Section 3. Reproduced here once for the Sonnet ops session that consumes this doc. Not re-debated in this body.

1. **Person_ID format:** `TEFI-YYYYMM-emailtail` (D1 + D2 Thread 4A locked 2026-04-23). Collision suffix rule `-01`…`-99` is in scope; format itself is not.
2. **Three-store SSOT split:** Zoho / Career Vault JSONs / Working Sheets (D1 + Sheets-Zoho Sync 2026-04-25). Working Sheets stays alive as a staging/atomic-content layer; not a fourth SSOT.
3. **Email = working join key for now.** Person_ID is the durable cross-system key; not yet wired into Sheets.
4. **Person_ID stamping scoped to ~42 active leads.** Legacy backfill (dormant, years-old contacts) is a future one-off project.
5. **Cols AR/AS deprecated; BF.1–BF.3 paused** per Sheets-Zoho Sync 2026-04-25.
6. **Gmail labels = derived view from Zoho via n8n (post-D4).** D4 specifies the Zoho-side picklist that n8n reads from; the n8n workflow itself is post-D4 ops.
7. **The seven D2 lock-points** are inherited as approved (D2 Closing Note 2026-04-23). Not re-debated.

8. **Zoho Professional Plan unique-field budget = 2 per module** (confirmed by Tate 2026-04-26 alongside the quota check). On Lead and Contact modules, the 2 unique-constraint slots are consumed by `Email` (unique) and `Person_ID` (unique). **No more unique-constraint fields can be added to Lead or Contact** without retiring one of those two — which is not on the table. Any future field requiring uniqueness on Lead or Contact must surface this constraint and propose a resolution (typically: a non-unique field plus a Zoho workflow rule that detects collision, OR a Zoho custom module instead). Deal and Account modules are not constrained today; budget on those is held in reserve.

---

## 2. Deliverable A — Zoho Target Schema

Post-migration Zoho across Leads, Contacts, Deals. Tables show only NEW, MODIFIED (rename / type change / picklist change), and RETIRED rows. The 117 custom + 115 standard fields not listed here are UNCHANGED.

### 2.1 Leads module

#### NEW custom fields to create

| field_name | api_name | type | source | notes |
| :-- | :-- | :-- | :-- | :-- |
| Person ID | `Person_ID` | text(40) | n8n (first-touch stamp) | Format `TEFI-YYYYMM-emailtail[-NN]`. Required at save. Unique. Today does not exist on Lead module (D2 Daily Log 2026-04-23). |
| Tenant ID | `Tenant_ID` | picklist | TENANT_REGISTRY | Default `TEFI`. White-label readiness. Values: TEFI + every active tenant from TENANT_REGISTRY. |
| Target Seniority | `Target_Seniority` | picklist | mirror from Vault | Picklist: Entry / Mid / Senior / Lead / Manager / Director / Executive / C-Suite (matches Vault PERSON_PROFILE.target_seniority). |
| Communication Tone Preference | `Communication_Tone_Preference` | picklist | manual | Values: Direct / Warm / Formal / Casual / Not Stated. D2 Cap 4. |
| Vault Maturity Score | `Vault_Maturity_Score` | integer (read-only) | n8n sync from Vault | 0–100. Synced read of Vault.vault_maturity_score. Used by next-best-action briefing. |
| Stalled Days | `Stalled_Days` | formula | derived | TODAY() − Last_Activity_Time. Used by Zoho workflow rule "no_contact_14d" alert. D2 Cap 5. |
| Source Channel | `Source_Channel` | picklist | mapped from Lead_Source | Coarser grain: Organic / Paid / Referral / Direct / Partner. Used for high-level reporting; Lead_Source remains for full-grain. |
| Person_ID Backfilled At | `Person_ID_Backfilled_At` | datetime | n8n migration | NULL for new records (Person_ID assigned at create). Stamped only on records that received Person_ID via the migration backfill job. Audit field. |

#### MODIFIED custom fields (rename / picklist change / type change)

| current api_name | new api_name | change | notes |
| :-- | :-- | :-- | :-- |
| `Communication_preference` | `Communication_Preference` | rename (case fix) | Resolves D3 Section 6 naming drift. |
| `Service_Pathway` (label `Depri_Service_Pathway`) | — | RETIRE | Replaced by Deal.Service post-conversion. |
| `ESOL_Level` | (no rename) | picklist value fix: "Flurent" → "Fluent" | D3 Section 6 typo. Same fix on Contacts. |
| `Lead_Status` | `Lead_Status` | picklist consolidation | 18 values → 12 values (see §2.4). |
| `Target_Role` + `Target_Role_Title` | `Target_Role_Title` | merge | Two-text-field overlap (D3 Section 6). Keep `Target_Role_Title`; copy any non-null `Target_Role` value into it; DEPRECATE `Target_Role`. |

#### RETIRED custom fields (mark hidden, do not delete; final delete after 90-day confidence window)

| api_name | reason |
| :-- | :-- |
| `Migration_Status_and_Needs` (Depri_) | Replaced by Vault.visa_status + Visa_Pathway_Status (D1 Lock 2). |
| `Form_UUID` (Depri_) | No longer used by intake. |
| `Profile_Notes` (Depri_) | Subsumed by Description + Notes_AI. |
| `Consultant_Notes_Lead` (Depri_) | Subsumed by Description + Notes_AI. |
| `Potential_Green_List_Match` (Depri_) | Replaced by Visa_Pathway_Status (Vault-owned). |
| `Service_Pathway` (Depri_) | See above. |
| `Send_Email` (52-value picklist) | Legacy template chooser; replaced by Send_Contact_Template-style Deal/Contact mechanism. |
| `Target_Role` | Merged into Target_Role_Title. |

### 2.2 Contacts module

#### NEW custom fields

| field_name | api_name | type | source | notes |
| :-- | :-- | :-- | :-- | :-- |
| Tenant ID | `Tenant_ID` | picklist | mirror from Lead at conversion | Default `TEFI`. Same picklist as Lead. |
| Target Seniority | `Target_Seniority` | picklist | mirror from Vault | Same picklist as Lead. |
| Communication Tone Preference | `Communication_Tone_Preference` | picklist | manual | Same picklist as Lead. |
| Vault Maturity Score | `Vault_Maturity_Score` | integer (read-only) | n8n sync from Vault | Mirrors Lead. |
| Person_ID Backfilled At | `Person_ID_Backfilled_At` | datetime | n8n migration | Audit field. |
| Vault JSON URL | `Vault_JSON_URL` | url | n8n on Vault row create | **Q4 Addition 3.** Canonical evolving Vault JSON for the candidate. Primary URL field — Source_*_URL fields and OUTPUT_LOG entries are downstream of this. Updated by n8n whenever Vault PERSON_PROFILE row materially changes. |
| Source — CV URL | `Source_CV_URL` | url (folder) | n8n post-intake | **Q4 Addition 3.** Folder URL for original CV(s). Folder-shaped (not single-file) so multiple revisions can land without schema change. After n8n moves CV from Lead.CV_and_Cover_Letter fileupload to Drive, this URL is canonical. |
| Source — Q&A URL | `Source_Q_and_A_URL` | url (folder) | manual / n8n | **Q4 Addition 3.** Session 1 question-reply exchanges and similar SSOT capture (questionnaire responses, intake forms). Folder URL. |
| Source — Interview Transcripts URL | `Source_Interview_Transcripts_URL` | url (folder) | manual / n8n | **Q4 Addition 3.** S2/S3 interview transcripts. Folder URL — typical candidate has 2–5 transcripts. |
| Source — Late-Arrival Docs URL | `Source_LateArrival_Docs_URL` | url (folder) | manual / n8n | **Q4 Addition 3.** Production stats, financial reports, references, late high-value documents that surface mid-engagement. Folder URL. |
| Asset — Profile Pitch Clip URL | `Asset_Profile_Pitch_Clip_URL` | url (folder) | n8n on deliverable produce | **Q4 Addition 3 extension.** Persistent client-facing pitch clip. Folder URL — closes the Video CV / Short Clip / Profile Pitch Clip three-product gap (Profile Pitch Clip was missing prior). |
| Asset — Photo Portfolio URL | `Asset_Photo_Portfolio_URL` | url (folder) | n8n on deliverable produce | **Q4 Addition 3 extension.** Persistent photo portfolio for the client. Folder URL. |
| Asset — Career Snapshot Card URL | `Asset_Career_Snapshot_Card_URL` | url (folder) | n8n on deliverable produce | **Q4 Addition 3 extension.** Single-page career snapshot card. Folder URL. |
| Asset — LinkedIn Visual Kit URL | `Asset_LinkedIn_Visual_Kit_URL` | url (folder) | n8n on deliverable produce | **Q4 Addition 3 extension.** LinkedIn banner + headshot + graphics kit. Folder URL. |
| Asset — Folder URL (catch-all) | `Asset_Folder_URL` | url (folder) | n8n / manual | **Q4 Addition 3 extension.** Top-level catch-all folder for any asset type not captured by a dedicated field. Provides the single addressable starting point for white-label partner exposure and time-limited client access patterns. |

#### MODIFIED custom fields (rename for Lead/Contact alignment — resolves D3 Section 6 naming drift)

| current api_name | new api_name | change |
| :-- | :-- | :-- |
| `Preferred_Channel` (label "Communication_Preference") | `Communication_Preference` | rename (api + label) |
| `TEFI_Readiness` | `TEFI_Readiness_Score` | rename (match Lead) |
| `MetricDensityScore` | `Metric_Density_Score` | rename (snake_case match Lead) |
| `ImpactPotential` | `Impact_Potential` | rename (snake_case match Lead) |
| `Partner_s_Name` | `Partner_Full_Name` | rename (drop weird `_s_`, match Lead) |
| `Partner_s_Email` | `Partner_Email` | rename (match Lead) |
| `I_have_successful_experience_helping_get_work` (Depri) | — | RETIRE |
| `Referral_Person` (label "Source Agent") | `Source_Agent` | rename (api matches Lead/Deal) |
| `LinkedIn` (label "Video CV") | `Asset_Video_CV_URL` | rename (api + label coherent; Asset_-prefixed per Q4 Addition 3 extension) |
| `LinkedIn1` (label "LinkedIn") | `LinkedIn_URL` | rename (api + label coherent). NOT Asset_-prefixed — this is the client's own LinkedIn profile, not a TEFI-produced asset. |
| `Website` (label "Short Clip") | `Asset_Short_Clip_URL` | rename (api + label coherent; Asset_-prefixed per Q4 Addition 3 extension) |
| `SuggestedUpgrades` | `Suggested_Upgrades` | rename (snake_case) |
| `STAR_Project_Count` | `STARR_Project_Count` | rename (Vault uses STARR, drift fix) |
| `Service_Purchased` | (no rename) | picklist values added: TEFI-T1-CMR / T2 / T3A / T3B / T4 / ADD-CLW / ADD-LIS / ADD-PP / ADD-PPC / ADD-JFS (10 new Stripe products live 2026-04-24). |
| `Client_Activity_Status` | (no rename) | KEEP (separate concept from Lead_Status — post-conversion lifecycle). |
| `Lead_Identification` | `Contact_Identification` | rename (clarity vs Lead's same api_name) |
| `Current_Deal_Stage` (Depri) | — | RETIRE — replaced by Deal.Stage |
| `Previous_Deal_Stage` (Depri) | — | RETIRE |
| `Date_Entered_Stage` (Depri) | — | RETIRE — Deal.Stage_Modified_Time covers this |
| `Days_in_Stage` (Depri) | — | RETIRE — Deal.Time_in_Stage covers this |
| `Sent_via_Manual_Process` (Depri) | — | RETIRE |
| `Invite_Date` (Depri) | — | RETIRE |
| `Invite_Type` (Depri) | — | RETIRE |
| `No_Auto_Responses` (Depri) | — | RETIRE — Lead has equivalent |
| `Form_UUID` (Depri) | — | RETIRE |
| `Profile_Notes` (Depri) | — | RETIRE |
| `Potential_Green_List_Match` (Depri) | — | RETIRE |
| `Consent_Privacy` | (no rename) | KEEP — but rename Lead's `I_agree_to_privacy_policy` to `Consent_Privacy` for cross-module consistency (see Lead modifications above; superseding row added there in next revision). |

> **Note (decision flagged for Tate):** the Consent_Privacy rename on Lead is a small but live-impact change (forms post to the api_name). Recommend doing the rename + form-endpoint update in the same Phase 1 prep step, with a 2-day staging window where both api_names exist in Zoho before the old one is hidden.

#### Existing `Person_ID` on Contacts

Already present (D3 Section 2.2) and 0% populated (Daily Log 2026-04-23). UNCHANGED definition; populated by Phase 2 cut-over and Phase 4 backfill.

### 2.3 Deals module

#### NEW custom fields

| field_name | api_name | type | source | notes |
| :-- | :-- | :-- | :-- | :-- |
| Tenant ID | `Tenant_ID` | picklist | mirror from Contact | Same picklist as Lead/Contact. |
| Stage Semantic Notes | `Stage_Semantic_Notes` | textarea | manual | D2 Pillar 2 Cap 1 — captures what each stage means in this deal's specific context. Free-text, optional. |
| Payment Received Date | `Payment_Received_Date` | date | Stripe → Zoho workflow | Today implicit via Amount + Closing_Date + Payment_Selection. Make explicit. |
| Outcome Attributed | `Outcome_Attributed` | lookup → Activity | manual / future automation | D2 Pillar 2 Cap 2 — links the activity that drove the most recent stage transition. **Deferred Q3 implementation** but field created now so n8n writes can land into it. |
| Production Readiness State | `Production_Readiness_State` | picklist | derived/synced from Vault | **Q4 Addition 2.** Values: Awaiting Vault Maturity / Ready for Snapshot / Ready for CM Report / Ready for SAM Report / Ready for Career Impact Report / Ready for Proposal / Production Complete. n8n syncs from Vault.vh_ready_* flags + Deal.Stage. Drives "Production Bottlenecks" list view. |
| Vault Maturity Score | `Vault_Maturity_Score` | integer (read-only) | n8n sync from Vault | **Q4 Addition 2.** Mirror of Vault.vault_maturity_score. Same definition as Lead/Contact mirror — added on Deal so commercial state and production state are co-queryable on a single record. |
| Active Pack ID | `Active_Pack_ID` | text (FK) | manual / n8n | **Q4 Addition 2.** FK to Vault TARGET_ROLE_PACK.Role_Pack_ID. Single source for "which pack drives this Deal's production." Multiple packs may exist per person; this pins the Deal to one. |
| Active Vault JSON URL | `Active_Vault_JSON_URL` | url | n8n on Deal create or first production action | **Q4 Addition 3.** Pins this deal's production to a specific version of the Vault JSON (snapshot_file_path-style discipline). Decoupled from Contact.Vault_JSON_URL which evolves continuously; this stays stable for the deal's life. |
| OUTPUT_LOG URL | `OUTPUT_LOG_URL` | url | n8n on Deal create | **Q4 Addition 3.** Single link to filtered OUTPUT_LOG view for this deal. Points to a Google Sheets filter view filtered by `person_id` (or `pack_id` if Active_Pack_ID is set). One link per deal scales to 18+ deliverable types without per-deliverable schema fields. |
| Xero Invoice ID | `Xero_Invoice_ID` | text | n8n Xero workflow (post-D4) | **Q4 Addition 1.** Connects Deal to its Xero invoice for reconciliation queries. Schema landed Phase 1; n8n sync deferred behind feature flag. |

#### MODIFIED custom fields

| current api_name | new api_name | change |
| :-- | :-- | :-- |
| `Lead_Identification` | `Deal_Identification` | rename (clarity) |
| `Stage` (standard, 58 values) | (no rename) | picklist consolidation: 58 → 16 values (see §2.5) |
| `Pipeline_Stages` (12 values) | — | RETIRE — Stage now consolidated, `Pipeline_Stages` redundant |
| `Pipeline_SubStage` (26 values) | `Stage_SubStep` | rename (clarity); narrow to T3 sub-steps only (S1a–S5 — 12 values), all others retired |
| `Big_Template_List` (Depri) | — | RETIRE |
| `CV_and_Cover_Letter` (Depri) | — | RETIRE — duplicate of Lead/Contact field |
| `Job_Market` (Depri) | — | RETIRE |
| `Partner_First_Name` (Depri) | — | RETIRE — Contact carries this |
| `Partner_Email` (Depri) | — | RETIRE — Contact carries this |
| `Send_Contact_Template` (Depri) | — | RETIRE |
| `Email` (custom on Deal) | — | RETIRE — reach via Contact_Name lookup (D3 Section 6 anomaly) |
| `Service` | (no rename) | picklist values added: TEFI-T1-CMR / T2 / T3A / T3B / T4 / ADD-CLW / ADD-LIS / ADD-PP / ADD-PPC / ADD-JFS (10 new Stripe products) |
| `Source_Agent` | (no rename) | picklist reconciled with Lead.Source_Agent (16 vals) and Contact.Source_Agent (17 vals) → single 17-value canonical list shared across modules |

#### Note on Person_ID on Deals

Deals reach Person_ID via Contact_Name lookup (D2 Thread 4A line 447). NO custom Person_ID field on Deal. Reports filter via `Contact_Name.Person_ID`.

### 2.3a Accounts module (Q4 Addition 1 — Xero ↔ Zoho seam)

D3 inventoried Leads, Contacts, and Deals only. The Accounts module was off-radar at D3 time, surfaced as a Q4 Addition by Tate. Stripe → Xero is connected today for IRD compliance; Xero ↔ Zoho Accounts is not. As TEFI moves toward corporate accounting standards, this seam needs schema accommodation now even though the n8n automation is deferred.

#### NEW custom fields

| field_name | api_name | type | source | notes |
| :-- | :-- | :-- | :-- | :-- |
| Xero Contact ID | `Xero_Contact_ID` | text (unique) | n8n Xero sync (post-D4) | Primary join key between Zoho Account and Xero Contact. Unique constraint enforced. |
| Xero Sync Status | `Xero_Sync_Status` | picklist | n8n Xero sync | Values: Synced / Pending / Error / Manual. Surfaces sync health on the Account record. |
| Xero Last Sync At | `Xero_Last_Sync_At` | datetime | n8n Xero sync | Audit timestamp. |
| Last Reconciled Date | `Last_Reconciled_Date` | date | manual or n8n | Bookkeeping checkpoint — when this account's transactions were last reconciled in Xero. |
| IRD Status | `IRD_Status` | picklist | manual | Values: GST Registered / Not Registered / N/A / Unknown. NZ IRD compliance flag. |
| IRD Number | `IRD_Number` | text | manual | Optional. Populated for partner / supplier accounts. |
| Tenant ID | `Tenant_ID` | picklist | manual / mirror | Same picklist as Lead/Contact/Deal. White-label readiness — accounts can be tenant-scoped. Default `TEFI`. |

**Layout note:** new "Xero Integration" section on the Accounts layout, collapsed by default until n8n automation activates.

**Automation status:** schema lands in Phase 1 Step 4. The n8n Xero ↔ Zoho sync workflow is post-D4 ops, deferred behind a feature flag — same pattern as INTERVIEW_LOG. When the workflow ships, the picklists and timestamps populate automatically. Until then, fields are present but inert.

### 2.4 Lead.Lead_Status — picklist consolidation (18 → 12)

The Gmail Label Key (`~TEFI/Marketing/TEFI_Gmail_Label_Key.md`) is the reference vocabulary. Every label maps to exactly one Zoho stage, or is explicitly marked as not-a-pipeline-state.

**Target Lead.Lead_Status picklist (12 values):**

| stage_code | display_name | gmail_label_equivalent | entry_trigger | exit_trigger |
| :-- | :-- | :-- | :-- | :-- |
| LS_NEW | Not Contacted | (none — pre-touch) | Lead created in Zoho | First outbound |
| LS_LMO | LeadMagnet Offer Sent | `TEFI/Leads/Pipeline/LeadMagnet Offer` | Event/masterclass invite sent | Lead registers OR no engagement >7d |
| LS_LMS | LeadMagnet Sent | `TEFI/Leads/Pipeline/LeadMagnet Sent` | CMSnapshot delivered | Reply received OR 4d no reply → nudge |
| LS_T1S | CV Upgrade T1 Sent | `TEFI/Leads/Pipeline/CV Upgrade T1 Sent` | CV Questions sent | Answers received OR 5d no reply → nudge; OR 7d → T-S0c → Meeting Invited |
| LS_QR | Questions Received | `TEFI/Leads/Pipeline/Questions Received` | Inbound reply classified as answer | Tate sends T-S1 → Meeting Invited |
| LS_MI | Meeting Invited | `TEFI/Leads/Pipeline/Meeting Invited` | T-S1 sent | Calendly booking OR 3d nudge |
| LS_MB | Meeting Booked | `TEFI/Leads/Pipeline/Meeting Booked` | Calendly webhook | Meeting attended → PostMeeting OR no-show → Stalled |
| LS_PM | Post-Meeting / Proposal Pending | (no current label — derived) | Meeting attended; proposal not yet sent | Proposal sent OR 7d → Stalled |
| LS_PS | Proposal Sent | `TEFI/Clients/Awaiting Reply` | Proposal email sent | Accept (→ converted) OR decline OR 7d nudge |
| LS_AR | Stalled / Awaiting Reply | `TEFI/Leads/Awaiting Reply` | Nudge sent on any stalled stage | Reply received → returns to prior stage |
| LS_CONV | Converted | (none — Lead.Is_Converted=true) | Zoho Lead Conversion fired | terminal on Lead — Contact + Deal carry forward |
| LS_DISQ | Disqualified / Junk | (none — terminal) | Tate marks; or auto-mark for bounced/unsubscribed | terminal |

**Old → New mapping (for migration):** Cowork ops session will produce a value-by-value mapping CSV during Phase 1. The 18 current values include several deprecated and several never-used; ~10 of the 18 map cleanly into the 12 above. Edge cases (e.g. "Under-qualified", "Junk Lead") collapse into LS_DISQ.

**Gmail labels not represented as Lead_Status values** (they stay Gmail-only or move to other Zoho fields):
- `TEFI/Clients/Active/Tier1 In Progress` → Deal.Stage = T1 - Snapshot In Progress
- `TEFI/Accounts/🧾 Invoice/Issued Unpaid` → NEW Deal field `Invoice_Status` (deferred — see §2.6)
- `TEFI/Accounts/🤝 By Referral` → derived from Lead_Source = "Client Referral"
- `TEFI/Marketing/Testimonial/*` (4 labels) → Testimonial_Approval workflow, NOT pipeline state. Defer to Q3 custom module per D2 Thread 4C gap 3 territory.
- `TEFI/Templates/*` (3 labels) → operator workflow, orthogonal to pipeline. **Retire from Zoho mapping.** Stay Gmail-only.
- `TEFI/Cowork/*` (8 labels) → operator action triggers, ephemeral. **Retire from Zoho mapping.** Tate writes manually; Haiku/Sonnet processes; label removed after action.

### 2.5 Deal.Stage — picklist consolidation (58 → 16)

The current 58-value Stage list mixes pre-purchase qualification states with active program stages with closure outcomes. Target structure: Deal exists only for **post-purchase active programs**. Lead-stage concerns belong on Lead.Lead_Status (§2.4), not on Deal.Stage.

**Target Deal.Stage picklist (16 values):**

| stage_code | display_name | tier | gmail_label (if any) | notes |
| :-- | :-- | :-- | :-- | :-- |
| DS_OB | Onboarding | All | — | Payment received, kickoff pending |
| DS_T1A | T1 — Snapshot In Progress | T1 | `TEFI/Clients/Active/Tier1 In Progress` | CMSnapshot/Report being built |
| DS_T1B | T1 — Snapshot Delivered | T1 | — | Terminal for T1 unless upsold |
| DS_T2A | T2 — In Progress | T2 | — | CV upgrade in flight |
| DS_T2B | T2 — Delivered | T2 | — | Terminal for T2 unless upsold |
| DS_T3S1 | T3 — S1 Discovery | T3a/b/c | — | Sub-steps tracked in Stage_SubStep |
| DS_T3S2 | T3 — S2 Content Capture | T3a/b/c | — | |
| DS_T3S3 | T3 — S3 Render | T3a/b/c | — | |
| DS_T3S4 | T3 — S4 Polish | T3a/b/c | — | |
| DS_T3S5 | T3 — S5 Launch | T3a/b/c | — | Terminal for T3 unless upsold |
| DS_T4A | T4 — Programme Active | T4 | — | T4 retainer running |
| DS_T4B | T4 — In Job Search | T4 | — | Active applications |
| DS_T4C | T4 — Interview Phase | T4 | — | INTERVIEW_LOG entries write here |
| DS_WP | Closed Won — Placed | All | — | terminal — placement confirmed |
| DS_WC | Closed Won — Completed | All | — | terminal — service delivered, no placement target |
| DS_LO | Closed Lost | All | — | reason in Stage_Semantic_Notes |
| DS_ON | On Hold | All | — | dormant, reactivate later |

(That's 17 values including Closed Won split into Placed/Completed. If Tate prefers a single Closed Won, drop DS_WC and the picklist becomes 16. **Recommended default: keep both — placement vs delivery is a meaningful business distinction.**)

**Old → New mapping:** Cowork ops session produces a 58-row CSV during Phase 1 mapping each existing Stage value to one of the 16. Stages like "Closed Won_ Don't know" (D2 Thread 1 example) collapse into DS_WC with `Stage_Semantic_Notes = "[migrated from Closed Won_ Don't know — original meaning unclear]"`.

### 2.6 Custom modules (deferred but flagged)

Two custom modules were named in D2 but are **deferred to Q3** per the priority order. D4 does **not** create them, but flags the design intent so Lead/Contact field placement in Phase 1 doesn't preclude them:

1. **Signal Store** (D2 Thread 4C gap 3) — verbatim quote capture from inbound replies, classified by intent. **Priority signal added by Tate 2026-04-26: this is "build, not evaluate" — verbatim quote capture is high-value across multiple use cases (service quality, marketing copy source language, product development signal, testimonial pipeline). Q3 planning treats Signal Store as a build decision; the design and timing are the open questions, not the principle.** Flagged for **early Q3 prioritisation**, not late-Q3 evaluation.
2. **Testimonial_Approval** (implied by Gmail testimonial labels) — separate workflow; today lives in `Testimonials_CMSnapshot.xlsx`. **Confirmed by Tate 2026-04-26: kept through Q3 evaluation.** The four Gmail testimonial labels currently in use are real workflow signal. Q3 decides whether it lifts into a Zoho custom module or stays in Sheets.

Neither requires a field decision today. Flagging only.

### 2.7 Layout assignments

Each new custom field needs a layout placement. Recommended:

- **Person_ID, Tenant_ID, Vault_Maturity_Score:** "Identity" section at the top of the Lead/Contact layout, read-only after first save.
- **Target_Seniority, Communication_Tone_Preference:** existing "Profile" section.
- **Stalled_Days:** existing "Activity" section, read-only.
- **Stage_Semantic_Notes (Deal):** new "Stage Context" section, free-text below Stage picklist.
- **Payment_Received_Date (Deal):** existing "Financial" section near Amount/Payment_Selection.
- **Outcome_Attributed (Deal):** new "Attribution" section (collapsed by default; populated by future automation).
- **Vault_JSON_URL + Source_*_URL (Contact):** new "Vault & Source Inputs" section near the top of the Contact layout — these are the canonical references field operators reach for first.
- **Asset_*_URL (Contact):** new "Client Assets" section grouping the 7 Asset_*_URL fields. Position below "Vault & Source Inputs". Asset_Folder_URL pinned at the top of the section as the catch-all entry point.
- **Active_Vault_JSON_URL + OUTPUT_LOG_URL + Active_Pack_ID + Production_Readiness_State + Vault_Maturity_Score (Deal):** new "Production State" section on Deal layout.
- **Xero seam fields (Account):** "Xero Integration" section, collapsed until automation activates.

Sonnet ops session refines layouts during Phase 1 prep.

---

## 3. Deliverable B — Career Vault Target Schema

Vault target = 391-field baseline + additions per D2 Thread 4C gaps 1, 6, 7 (+ gap 2 designed in same group per Q2 default). Below shows only NEW, MODIFIED, and RETIRED rows.

### 3.1 PERSON_PROFILE additions (gap 6 — Maturity Index + readiness flags)

| field_name | type | source SSOT | notes | status |
| :-- | :-- | :-- | :-- | :-- |
| `vault_maturity_score` | integer (0–100) | derived (Vault formula) | Aggregates vh_core_complete (30 pts), vh_evidence_attached (15), vh_null_rate_achievements (20), vh_null_rate_skills (15), vh_target_packs_active (10), gen_*_stale inverse (10). Formula spec lives at top of tab in a hidden config row. | NEW |
| `vh_ready_for_t1_snapshot` | boolean | derived | maturity >= 25 AND vh_core_complete AND target_countries non-null | NEW |
| `vh_ready_for_cm_report` | boolean | derived | maturity >= 40 AND >=1 active TARGET_ROLE_PACK AND tier1_answers_file_path non-null | NEW |
| `vh_ready_for_sam_report` | boolean | derived | maturity >= 55 AND >=3 ACHIEVEMENT records AND vh_evidence_attached | NEW |
| `vh_ready_for_career_impact_report` | boolean | derived | maturity >= 60 AND >=5 ACHIEVEMENT records AND >=2 with metrics_density >= "Medium" | NEW |
| `vh_ready_for_session1_prep` | boolean | derived | maturity >= 35 AND target_role_titles non-null AND no open SESSION_LOG with `next_session_planned_date` <= today | NEW |
| `vh_ready_for_proposal` | boolean | derived | vh_ready_for_cm_report AND >=1 active TARGET_ROLE_PACK AND visa_status non-null | NEW |
| `vh_blockers_summary` | text | derived | text list of unmet readiness conditions for Tate's quick-glance | NEW |
| `gen_refresh_due_date` | date | derived | gen_updated_at + 30 days OR last_validated_date of any underlying ACHIEVEMENT, whichever sooner | NEW |
| `next_best_action` | text | derived | based on Zoho stage + maturity + recency. Used by D2 Cap 6 next-best-action briefing. | NEW |
| `Person_ID` | text(40) | mirrored from Zoho | **MODIFIED** — format change from `firstname_lastname_YYYYMMDD_shortcode` to `TEFI-YYYYMM-emailtail[-NN]` per D2 Thread 4A. | MODIFIED |
| `legacy_slug_v1` | text | one-time write | Stores the prior Person_ID slug verbatim during Phase 2 cut-over migration. Never updated thereafter. Audit trail. | NEW |
| `tier1_status` | text | — | RETIRED — Zoho.Lead.Lead_Status owns. | RETIRED |
| `tier2_status` | text | — | RETIRED — Zoho.Deal.Stage owns. | RETIRED |
| `payment_received_date` | date | synced read | RECLASSIFIED — Zoho.Deal.Payment_Received_Date is SSOT. Vault retains as synced read for deliverable rendering (CMReport prints this date). | MODIFIED |
| `english_level` | picklist | mirrored from Zoho.ESOL_Level | NEW — gives Vault deliverable templates a clean field to render English level (Native / Fluent / Advanced / Intermediate / Beginner). | NEW |
| `highest_qualification` | picklist | mirrored from Zoho.Highest_Qualification | NEW — same rationale. | NEW |
| `client_folder_url` | url | mirrored from Zoho.Contact.Client_Folder_URL | NEW — gives Vault deliverable workflows a single source for the client folder link. | NEW |
| `communication_preference` | picklist | mirrored from Zoho.Communication_Preference | NEW. | NEW |
| `tenant_id` | picklist | mirrored from Zoho.Tenant_ID | NEW — white-label readiness. Default `TEFI`. | NEW |

### 3.2 SESSION_LOG — NEW tab (gap 1)

Append-only. One row per coaching session. Written by post-session Relay workflow (Phase 2 build) or manually by Tate.

| field_name | type | source SSOT | notes | status |
| :-- | :-- | :-- | :-- | :-- |
| `session_id` | text (PK) | generated | format `SESS-YYYYMM-{personIDtail}-{seq}` | NEW |
| `person_id` | text (FK) | from PERSON_PROFILE | | NEW |
| `pack_id` | text (FK, nullable) | from TARGET_ROLE_PACK | | NEW |
| `session_date` | date | manual | | NEW |
| `session_sequence` | integer | manual | per-person session count (S1, S2, S3 …) | NEW |
| `session_type` | picklist | manual | S1 Strengths / S1c Skills / S2 Content / S3 Render / S4 Polish / S5 Launch / Tier1 Review / T4 Coaching / Interview Coaching / Other | NEW |
| `session_duration_min` | integer | manual | | NEW |
| `session_format` | picklist | manual | Video / Phone / In-Person / Async | NEW |
| `session_outcome_summary` | textarea | manual | what happened, in plain language | NEW |
| `key_decisions` | textarea | manual | | NEW |
| `next_steps` | textarea | manual | | NEW |
| `next_session_planned_date` | date | manual | | NEW |
| `followup_owner` | picklist | manual | Tate / Client / VA / None | NEW |
| `followup_due_date` | date | manual | | NEW |
| `vault_updates_made` | textarea | manual | list of fields updated in this session, free-form | NEW |
| `materials_shared` | text | manual | links / file names | NEW |
| `client_engagement_score` | picklist | manual | High / Medium / Low / Disengaged | NEW |
| `session_recording_url` | url | manual | Grain link if available | NEW |
| `transcript_url` | url | manual | | NEW |
| `_schema_version` | text | stamped | per-row schema version | NEW |

### 3.3 INTERVIEW_LOG — NEW tab (gap 2 — designed in same group per Q2 default)

Append-only. One row per interview. Written by Tate after a T4 client interview (manual today, automated post-Q3 when interview-coaching workflow ships).

| field_name | type | source SSOT | notes | status |
| :-- | :-- | :-- | :-- | :-- |
| `interview_id` | text (PK) | generated | format `INTV-YYYYMM-{personIDtail}-{seq}` | NEW |
| `person_id` | text (FK) | from PERSON_PROFILE | | NEW |
| `pack_id` | text (FK) | from TARGET_ROLE_PACK | | NEW |
| `interview_date` | date | manual | | NEW |
| `employer_name` | text | manual | | NEW |
| `role_applied_for` | text | manual | | NEW |
| `role_seniority` | picklist | manual | matches PERSON_PROFILE.target_seniority | NEW |
| `interview_round` | picklist | manual | Screen / 1st / 2nd / Panel / Final / Other | NEW |
| `interviewer_role` | text | manual | e.g. "Hiring Manager", "HR Recruiter" | NEW |
| `interview_format` | picklist | manual | Phone / Video / In-Person / Take-home | NEW |
| `preparation_done` | textarea | manual | | NEW |
| `topics_covered` | textarea | manual | | NEW |
| `questions_asked` | textarea | manual | verbatim where possible — feeds Q3 Signal Store equivalent | NEW |
| `candidate_perceived_strengths` | textarea | manual | | NEW |
| `candidate_perceived_weaknesses` | textarea | manual | | NEW |
| `outcome` | picklist | manual | Awaiting / Advanced / Rejected / Withdrawn / Offer | NEW |
| `feedback_received` | textarea | manual | | NEW |
| `rejection_reason_classified` | picklist | manual (when applicable) | Skills Gap / Culture Fit / Visa / Salary / Process / No Reason Given / Other | NEW |
| `lessons_for_next_interview` | textarea | manual | | NEW |
| `coaching_intervention_notes` | textarea | manual | | NEW |
| `_schema_version` | text | stamped | | NEW |

### 3.4 OUTPUT_LOG additions (gap 7 — registry function)

Current 14 fields exist; tab is empty. Additions make it function as a deliverable lifecycle registry.

| field_name | type | source SSOT | notes | status |
| :-- | :-- | :-- | :-- | :-- |
| `delivered_to_client_at` | datetime | manual or n8n | when the deliverable was sent to the client | NEW |
| `client_acknowledged_at` | datetime | manual or n8n (from inbound reply detection, Q3) | when the client confirmed receipt | NEW |
| `client_satisfaction_rating` | picklist | manual | High / Medium / Low / Not Captured | NEW |
| `output_stage_code` | text | n8n | Zoho Deal.Stage at delivery time (e.g. DS_T1A) — frozen at write | NEW |
| `ssot_zoho_deal_id` | text | n8n | Zoho Deal Record Id, for cross-system linking | NEW |
| `output_archived` | boolean | manual | TRUE when deliverable is superseded or no longer canonical | NEW |
| `supersedes_build_id` | text | manual or n8n | for re-renders, points to prior build_id | NEW |

The 14 baseline fields are UNCHANGED.

### 3.5 Other Vault tabs

| Tab | Status | Notes |
| :-- | :-- | :-- |
| CAREER_DETAIL | UNCHANGED | 101 fields, four logical record types — schema design is sound. |
| TARGET_ROLE_PACK | UNCHANGED | 27 fields. |
| ADMIN_CONSOLE | UNCHANGED | 12 fields. |
| INTAKE_LOG | UNCHANGED | 20 fields, append-only. |
| KEY | UNCHANGED | guide-only tab. |

---

## 4. Deliverable C — Migration Plan (Option D, lazy 2–3 week parallel window)

**Cut-over Friday (recommended default):** Friday 22 May 2026, NZT.
**Parallel window:** Sat 23 May → Fri 12 June 2026 (~3 weeks).
**Backfill scope:** ~42 active leads + ~200–300 active Contacts with deals + ~100–200 Leads with activity in past 30 days (D2 Thread 4A line 459).
**Pause list during cut-over Friday only:** Buffer scheduling (Fri 22 May), `daily-gmail-diligence-labels` (already paused), `daily-lead-intelligence` (already paused), Career Vault sync Apps Script (manual only — pause manual triggers). Continue: T-S1 SPLIT auto-send, Stripe → Zoho payment workflow.

**Format key for the timeline below:**
`Step N — Action | Owner | Duration | Pre-conditions | Verification | Rollback`

### Phase 1 — Pre-cut-over preparation (Mon 27 Apr → Thu 21 May, 4 weeks)

1. **Step 1 — Tate confirms the four open questions in §0.** | Tate | 30 min | D4 doc reviewed | Tate confirms "Q1–Q4 confirmed". | None (block forward progress until done). | **STATUS: COMPLETE 2026-04-26.** |
2. **Step 2 — Sonnet ops session: produce old→new mapping CSVs.** Lead.Lead_Status (18→12), Deal.Stage (58→16), Source_Agent (16/17 reconciled to 17), Service / Service_Purchased picklist value additions for 10 new Stripe products. | Sonnet | 1 day | Step 1 confirmed | CSVs reviewed and signed off by Tate. | Discard CSV; redo. |
3. **Step 3 — Sonnet ops session: create Zoho custom fields per §2.1–2.3 (core set).** Person_ID (Lead), Tenant_ID (Lead/Contact/Deal), Target_Seniority (Lead/Contact), Communication_Tone_Preference (Lead/Contact), Vault_Maturity_Score (Lead/Contact), Stalled_Days (Lead — formula), Source_Channel (Lead), Person_ID_Backfilled_At (Lead/Contact), Stage_Semantic_Notes (Deal), Payment_Received_Date (Deal), Outcome_Attributed (Deal). | Sonnet | 1 day | Step 2 done; **Tate confirms the 11 core new fields fit within Zoho per-module quota** (D1 caveat 10.1). | Each field appears in Zoho Setup; sample read via API returns the field. | Delete the new fields (Zoho permits). System returns to pre-Step-3 state. |
4. **Step 4 — Sonnet ops session: create Q4 Addition 1 fields (Xero seam).** Account module: Xero_Contact_ID, Xero_Sync_Status, Xero_Last_Sync_At, Last_Reconciled_Date, IRD_Status, IRD_Number, Tenant_ID. Deal module: Xero_Invoice_ID. | Sonnet | 0.5 day | Step 3 done; **Tate confirms 7 new Account fields fit within Zoho quota.** | Each field appears in Zoho Setup; "Xero Integration" section visible on Account layout (collapsed). | Delete fields. |
5. **Step 5 — Sonnet ops session: create Q4 Addition 2 fields (production pipeline link) + Zoho list view.** Deal module: Production_Readiness_State (picklist), Vault_Maturity_Score (mirror), Active_Pack_ID (FK text). Plus create Zoho list view "Production Bottlenecks": filter Deals where Stage ∈ {DS_T1A, DS_T2A, DS_T3S2, DS_T3S3} AND Production_Readiness_State = "Awaiting Vault Maturity". | Sonnet | 0.5 day | Step 4 done | Fields present; list view visible to Tate; spot-check returns 0 records (expected pre-population). | Delete fields; remove list view. |
6. **Step 6 — Sonnet ops session: create Q4 Addition 3 fields (canonical / source / output / asset URL framework).** Contact module — canonical: Vault_JSON_URL. Contact module — source: Source_CV_URL, Source_Q_and_A_URL, Source_Interview_Transcripts_URL, Source_LateArrival_Docs_URL. Contact module — asset (Q4 Addition 3 extension folded in 2026-04-26): Asset_Profile_Pitch_Clip_URL, Asset_Photo_Portfolio_URL, Asset_Career_Snapshot_Card_URL, Asset_LinkedIn_Visual_Kit_URL, Asset_Folder_URL. Deal module — output: Active_Vault_JSON_URL, OUTPUT_LOG_URL. (Note: Asset_Video_CV_URL and Asset_Short_Clip_URL come into existence via Step 7 renames, not as new field creations.) | Sonnet | 0.75 day (extended from 0.5 day for Asset_*_URL fields) | Step 5 done. Quota confirmed under by Tate 2026-04-26 — no per-step confirmation needed. | Each field appears in Zoho Setup. Layout sections "Vault & Source Inputs" and "Client Assets" present on Contact; "Production State" present on Deal. | Delete fields; remove layout sections. |
7. **Step 7 — Apply rename modifications per §2.1–2.3.** Communication_preference → Communication_Preference, Preferred_Channel → Communication_Preference, TEFI_Readiness → TEFI_Readiness_Score, MetricDensityScore → Metric_Density_Score, ImpactPotential → Impact_Potential, Partner_s_Name/Email → Partner_Full_Name/Email, Referral_Person → Source_Agent (Contact), LinkedIn → Video_CV_URL, LinkedIn1 → LinkedIn_URL, Website → Short_Clip_URL, SuggestedUpgrades → Suggested_Upgrades, STAR_Project_Count → STARR_Project_Count, Lead_Identification → Contact_Identification (Contact) and Deal_Identification (Deal), I_agree_to_privacy_policy → Consent_Privacy (Lead). | Sonnet | 1 day | Step 6 done | Each rename verified via API metadata pull; Relay workflow `find/replace` audit run for any prompt or template referencing old api_names. | Rename back. |
8. **Step 8 — Update Lead Conversion Mapping in Zoho Settings.** Add Person_ID → Person_ID, Tenant_ID → Tenant_ID, Target_Seniority → Target_Seniority, Communication_Tone_Preference → Communication_Tone_Preference, Vault_Maturity_Score → Vault_Maturity_Score, Vault_JSON_URL → Vault_JSON_URL, all Source_*_URL fields → mirrored fields, plus rename mappings for any of the renamed fields above. | Sonnet | 30 min | Step 7 done | Test convert one dummy Lead; confirm Contact carries fields. Roll back the dummy convert via Zoho's undo. | Reset Conversion Mapping to prior state. |
9. **Step 9 — Apply picklist consolidations.** Lead.Lead_Status: add the 12 new values, mark old values as inactive (do not delete — preserves history). Deal.Stage: add the 16/17 new values, mark old as inactive. Source_Agent: reconcile to 17-value canonical list across modules. Service / Service_Purchased: add 10 new Stripe product codes. Production_Readiness_State (Deal): populate the 7 picklist values. Xero_Sync_Status (Account): populate the 4 picklist values. IRD_Status (Account): populate the 4 picklist values. ESOL_Level: replace "Flurent" with "Fluent" on both Lead and Contact. | Sonnet | 0.5 day | Step 2 + 7 done | Each new picklist value present; old values still queryable for backward compatibility during the parallel window. | Re-activate old values; mark new as inactive. |
10. **Step 10 — Mark all Depri_ custom fields as hidden (do NOT delete).** Lead: Migration_Status_and_Needs, Form_UUID, Profile_Notes, Consultant_Notes_Lead, Potential_Green_List_Match, Service_Pathway, Send_Email, Target_Role. Contact: 13 Depri_ fields per §2.2. Deal: 6 Depri_ fields per §2.3. | Sonnet | 0.5 day | Step 9 done | Fields hidden in layouts; data preserved in DB. | Un-hide. |
11. **Step 11 — Vault: extend PERSON_PROFILE schema per §3.1.** Add 11 new columns + 1 modified (legacy_slug_v1 holding place). Apps Script that builds the Vault formats can be reused — adapt to write the new columns. | Tate (with Sonnet assist) | 0.5 day | Step 1 done | Open Vault, confirm columns present and formulas computing for one test row. | Remove columns (Vault does not lose data; only the new columns disappear). |
12. **Step 12 — Vault: create SESSION_LOG and INTERVIEW_LOG tabs.** Headers only, empty rows. Apply data validation (dropdowns) per §3.2 / §3.3. INTERVIEW_LOG tab is created here but kept inactive (feature flag = OFF) per Q2(b) — Tate flips activation when first T4 interview engagement begins or Phase 2 starts (whichever sooner). | Tate (with Sonnet assist) | 0.5 day | Step 11 done | Tabs visible in Vault file. INTERVIEW_LOG flag check: tab present, no automation reading from it. | Delete tabs. |
13. **Step 13 — Vault: extend OUTPUT_LOG with 7 new columns** per §3.4. | Tate (with Sonnet assist) | 0.5 day | Step 11 done | Columns present; existing 14 unchanged. | Remove columns. |
14. **Step 14 — Build n8n workflow: Person_ID stamper.** Trigger on Zoho Lead create (or manual entry via Zoho workflow rule). Compute `TEFI-{YYYYMM(Created_Time)}-{slug(Email)}[-NN]`, write to Lead.Person_ID. Handle collisions per D2 Thread 4A. | Sonnet | 1 day | Step 3 + 9 done | Dry-run on 5 dummy leads — IDs computed correctly, no collisions, audit log written. | Disable workflow. |
15. **Step 15 — Build n8n workflow: Sheets → Zoho Lead migration (one-shot job).** Read ~42 active rows from Leads Registry; for each, find or create Zoho Lead by email_normalized; write Person_ID; map Sheets columns to Zoho fields per the canonical map; write Person_ID_Backfilled_At = NOW. | Sonnet | 1.5 days | Step 14 done | Dry-run on 5-row sample — Zoho records created, Person_IDs match, no duplicates created (idempotent). | Reverse workflow: delete the 5 sample Zoho records by Person_ID_Backfilled_At=NOW. |
16. **Step 16 — Build n8n workflow: Zoho stage → Gmail label sync.** Trigger on Zoho Lead.Lead_Status change OR Deal.Stage change. Apply the matching Gmail label per §2.4 mapping; remove conflicting prior labels on the same thread. n8n is the single writer. | Sonnet | 1 day | Step 9 done; Gmail OAuth in n8n confirmed | Dry-run on 3 sample threads — correct label applied, no leakage. | Disable workflow. |
17. **Step 17 — Career Vault → Zoho join integrity test.** Read 5 active records from Vault PERSON_PROFILE; lookup each by email in Zoho Contacts; confirm Person_ID matches OR Zoho Person_ID is empty (will be backfilled in Phase 2). | Sonnet | 30 min | Step 14 done | Test passes; mismatches logged for manual reconciliation. | None — read-only test. |
18. **Step 18 — Dry-run cut-over end-to-end on a copy.** Use Zoho sandbox if available; otherwise use 5 throwaway test records. Run Steps 14→15→16 in sequence. Validate at each gate. | Sonnet | 1 day | Steps 14–17 done | All three workflows run cleanly; all reverse paths verified. | None — sandbox. |
19. **Step 19 — Tate signs off cut-over readiness.** | Tate | 30 min | Step 18 done | Tate writes "Ready for cut-over Fri 22 May" in daily log. | None — this is the gate. |

### Phase 2 — Cut-over Friday (Fri 22 May 2026, NZT — single day)

20. **Step 20 — 08:00 — Backup Leads Registry.** Make a Drive copy named `Leads Registry_PRE_CUTOVER_2026-05-22`. | Tate | 5 min | Phase 1 complete | File present in Drive. | N/A — backup. |
21. **Step 21 — 08:30 — Backup Career Vault file.** Drive copy `Career_Vault_PRE_CUTOVER_2026-05-22.xlsx`. | Tate | 5 min | Step 20 done | File present. | N/A — backup. |
22. **Step 22 — 09:00 — Run Person_ID stamper on ~42 active Leads.** n8n one-shot batch. | Tate triggers; n8n executes | 30 min | Steps 20, 21 done | Audit log shows 42 IDs written, 0 collisions exceeding -99. | If any record fails: restore from backup; investigate; defer cut-over by 1 week. |
23. **Step 23 — 10:00 — Spot-check 10 Person_IDs.** Format correct (`TEFI-YYYYMM-emailtail`), no duplicates, all 10 present in Zoho. | Tate | 15 min | Step 22 done | Manual visual check. | If failures: pause cut-over, rerun Step 22 on the failed records. |
24. **Step 24 — 11:00 — Run Sheets → Zoho Lead migration.** n8n migration workflow over ~42 active rows. | Tate triggers; n8n executes | 30 min | Step 23 passed | Count of new/updated Leads in Zoho matches count of active rows in Sheets. | Reverse workflow deletes the affected Zoho records (idempotent — same Person_ID_Backfilled_At timestamp). Restore from backup if needed. |
25. **Step 25 — 12:00 — Validate Sheets → Zoho migration.** 5-row spot-check: Zoho Lead has all expected fields populated. | Tate | 20 min | Step 24 done | Manual check passes. | If failures: identify field mapping errors; fix; rerun on failed rows only. |
26. **Step 26 — 12:30 — Confirm paused tasks remain paused.** `daily-gmail-diligence-labels`, `daily-lead-intelligence`. | Tate | 5 min | n/a | Both still disabled in scheduled tasks UI. | Re-pause if accidentally re-enabled. |
27. **Step 27 — 13:00 — Vault PERSON_PROFILE Person_ID format migration.** Apps Script: for each row with a populated Person_ID matching the legacy `firstname_lastname_YYYYMMDD_*` pattern, copy the existing value to `legacy_slug_v1`, compute the new TEFI-format value (matching what Zoho got in Step 22), write to Person_ID. | Tate triggers; Apps Script executes | 30 min | Step 25 done | Vault Person_IDs now match Zoho Person_IDs for the ~42 active set. | Apps Script can run reverse: copy legacy_slug_v1 back into Person_ID. Vault backup also available. |
28. **Step 28 — 14:00 — Cross-store Person_ID validation.** 5 records: Zoho.Person_ID == Vault.Person_ID. | Tate | 15 min | Step 27 done | Match. | If mismatch: pause cut-over; investigate; restore from backups. |
29. **Step 29 — 15:00 — Rename Leads Registry sheet** to `Leads Registry_ARCHIVED_2026-05-22`. Set sheet to read-only via Drive sharing. | Tate | 10 min | Step 28 passed | File renamed in Drive; sharing reflects read-only. | Rename back; restore write access. |
30. **Step 30 — 15:30 — Activate Zoho → Gmail label sync workflow** (built in Step 16). | Tate | 15 min | Step 29 done | Workflow shows "active" in n8n. | Deactivate workflow. |
31. **Step 31 — 16:00 — Spot-check Gmail labels.** 5 active leads: Gmail thread label matches Zoho Lead_Status / Deal.Stage per §2.4 mapping. | Tate | 20 min | Step 30 done | Labels match. | If mismatch: deactivate workflow Step 30; investigate; the system reverts to Gmail-labels-as-stale-snapshot until fixed (no operational harm during the parallel window). |
32. **Step 32 — 17:00 — Cut-over closeout.** Tate writes a daily-log entry: cut-over complete, what worked, what surfaced, any deferred items. | Tate | 30 min | Step 31 done | Daily log updated. | N/A — log. |

### Phase 3 — Parallel window operating rules (Sat 23 May → Fri 12 Jun, ~3 weeks)

**Standing rules during the window:**
- All new leads enter Zoho directly. Lead create → Person_ID stamper fires automatically (Step 14 workflow) → Lead_Status = LS_NEW.
- All pipeline state changes happen in Zoho. Tate edits Lead_Status / Deal.Stage in Zoho UI; n8n syncs Gmail.
- Gmail labels are derived view; do not edit manually for state purposes (manual edits will be overwritten on the next sync pass).
- Career Vault writes: only deliverable content; no pipeline state.
- Disagreement rule: Vault wins for candidate data; Zoho wins for pipeline / identity / lifecycle.
- Daily 5-min audit (Tate, end-of-day): count of active records in Zoho matches active set in Vault; flag conflicts.
- Saturday 30-min reconciliation slot: review flagged conflicts, resolve via the rule above.

**Specific watch-outs:**
- Buffer scheduling resumes Mon 24 May (Sat 23 May falls on weekend; the Saturday Buffer task is the next scheduled run — confirm Buffer queue intact).
- Stripe → Zoho continues running. If a new Stripe product fires before the picklist update from Step 9 has been verified end-to-end with a real payment, the Service_Purchased value may not write — Tate fixes manually post-fact.
- Phase 2 reply detection workflow (D2 mention) remains paused — it'll be designed in Q3 against the new Zoho-as-SSOT contract.
- INTERVIEW_LOG tab exists but feature flag = OFF (Q2(b) decision). Tate flips activation when first T4 interview engagement begins or Phase 2 starts (whichever sooner).
- Xero seam fields exist on Account module (created Step 4) but n8n Xero ↔ Zoho automation is OFF until activated post-D4. Manual Xero entries continue as-is.
- Q4 Addition 2 / 3 fields (Production_Readiness_State, Vault_*_URL, Source_*_URL, OUTPUT_LOG_URL) exist but n8n sync workflows that populate them are post-D4 ops. Manual writes only during the parallel window; values may lag actual Vault state until the syncs ship.

### Phase 4 — Backfill (overlaps Phase 3, Sat 23 May → Fri 12 Jun)

33. **Step 33 — Person_ID backfill on existing Contacts with active Deals** (~200–300 records). n8n batch job, similar to Step 15. Uses Lead.Created_Time or Contact.Created_Time as the YYYYMM source per D2 Thread 4A line 459. | Sonnet + Tate | 1 day | Phase 2 complete | Spot-check 10% sample — Person_IDs correct. | Reverse via Person_ID_Backfilled_At timestamp filter. |
34. **Step 34 — Person_ID backfill on Leads with activity past 30 days** (~100–200 records). | Sonnet + Tate | 0.5 day | Step 33 done | Spot-check 10%. | Reverse. |
35. **Step 35 — Vault PERSON_PROFILE format migration for any records missed in Phase 2.** | Tate | 0.5 day | Step 34 done | All non-archived Vault rows have TEFI-format Person_ID. | Apps Script reverse via legacy_slug_v1. |
36. **Step 36 — 10% sample backfill validation.** Cross-store check on 30+ random records. | Tate | 1 hr | Steps 33–35 done | All match. | If mismatch >5%: re-run failed cohort. |

### Phase 5 — Archive + close-out (Fri 12 Jun → Fri 22 Aug, 90-day confidence window)

37. **Step 37 — 90-day confidence window starts.** Leads Registry remains read-only `_ARCHIVED_2026-05-22`. No deletions. | Tate | n/a | Phase 4 done | n/a | Restore from archive at any time during the 90 days. |
38. **Step 38 — Day 60 (Wed 22 Jul): mid-window check.** Audit any discovered drift. | Tate (with Sonnet assist) | 1 hr | Phase 4 done | Audit report logged. | Address findings; do not delete archive. |
39. **Step 39 — Fri 22 Aug 2026: 90-day mark.** If no rollback used, optionally retire Leads Registry to Drive Trash. Optionally hard-delete the Depri_ Zoho fields (still preserved as historical column data via Zoho's audit log). | Tate | 30 min | No rollback used between Step 29 and Step 38 | Confirm no production system reads from the file or fields. | If retired and recovery needed: restore from Drive Trash within 30 days, or from explicit pre-cut-over backup beyond. |
40. **Step 40 — Phase 1.4 closeout.** Update CLAUDE.md, PROJECTS_INDEX.md, TATE_PHASE_PLAYBOOK.md to reflect new architecture. Mark Phase 1.4 complete. Activate planning for Phase 2 (n8n reply-detection workflow under Zoho-as-SSOT contract) and Q3 (Vault gap 2 INTERVIEW_LOG activation, Q3 Zoho learning loop gaps 3/8/10, n8n Xero ↔ Zoho automation activation). | Tate (with Sonnet assist) | 0.5 day | Step 39 done | Documents updated. | n/a — documentation. |

### Post-cut-over validation checklist (run end of cut-over day)

- [ ] All ~42 active Leads have a Person_ID matching format `TEFI-YYYYMM-emailtail[-NN]`.
- [ ] All ~42 active Vault PERSON_PROFILE rows have a matching Person_ID.
- [ ] Sample 5 Gmail threads — labels match Zoho stage.
- [ ] Sample 5 Zoho Leads — all renamed fields readable, no Depri_ fields blocking layout.
- [ ] Stripe → Zoho workflow still firing (test with a $1 test charge OR confirm via the most recent real payment from past 7 days).
- [ ] T-S1 SPLIT auto-send still firing on inbound trigger.
- [ ] Leads Registry is read-only, renamed.
- [ ] No new automation has fired against the archived sheet.
- [ ] Daily Log entry written.

---

## 5. Cross-store overlap resolution — all 35 D3 candidates resolved

Decision per candidate: KEEP / MOVE / MERGE / DEPRECATE / NEW. Reference D3 Section 5 for the source list.

| # | Candidate | Decision | Owner (post-migration) |
| :-: | :-- | :-- | :-- |
| 1 | Person_ID | NEW on Lead (was missing); KEEP on Contact + Vault PERSON_PROFILE; DEPRECATE Sheets col A | Zoho Lead/Contact = SSOT; Vault PERSON_PROFILE = mirrored |
| 2 | Email | KEEP all three (Zoho Lead/Contact, Vault, plus Zoho.email_normalized for matching); DEPRECATE Sheets col D + Zoho Deal.Email | Zoho Lead/Contact = SSOT |
| 3 | Full name | KEEP (derived in Zoho + Vault); DEPRECATE Sheets col C | Zoho Lead/Contact = SSOT |
| 4 | First / last split | KEEP both stores | Zoho Lead/Contact = SSOT |
| 5 | Phone | KEEP both | Zoho = SSOT |
| 6 | LinkedIn URL | RENAME (Zoho Contact `LinkedIn1` → `LinkedIn_URL`; `LinkedIn` → `Video_CV_URL`); Vault = synced read | Zoho Contact = SSOT |
| 7 | Source country | KEEP Vault SSOT; Zoho.Country mirrors; DEPRECATE Sheets col L | Vault = SSOT |
| 8 | Target country | KEEP Vault multi-value SSOT; Zoho mirrors top-1; DEPRECATE Sheets col O | Vault = SSOT |
| 9 | Target role title | MERGE Zoho Lead/Contact `Target_Role` + `Target_Role_Title` → `Target_Role_Title`; Vault SSOT for full set; DEPRECATE Sheets col M | Vault = SSOT |
| 10 | Seniority level | NEW Zoho `Target_Seniority` field on Lead/Contact (mirror); Vault SSOT; DEPRECATE Sheets col N | Vault = SSOT |
| 11 | Visa / work rights | KEEP Vault SSOT (4 fields); Zoho.Visa_Status mirrored; RETIRE Migration_Status_and_Needs (Depri) | Vault = SSOT |
| 12 | ESOL / English level | KEEP Zoho.ESOL_Level (fix typo "Flurent"→"Fluent"); NEW Vault.english_level (mirror) | Zoho = SSOT |
| 13 | Highest qualification | KEEP Zoho.Highest_Qualification; NEW Vault.highest_qualification (mirror) | Zoho = SSOT |
| 14 | Years experience | KEEP Vault SSOT; Zoho formula mirrors | Vault = SSOT |
| 15 | Professional summary / core value prop | KEEP Vault SSOT (gen_*); Zoho.Professional_Summary + Summary_Snippet_Lead = synced read | Vault = SSOT |
| 16 | Short headline | KEEP Vault SSOT; Zoho.Short_Headline = synced active headline | Vault = SSOT |
| 17 | Gap / impact / suggested-upgrades | MERGE Zoho Lead.GapSummary + Impact_Potential / Contact.ImpactPotential + SuggestedUpgrades — rename to `Gap_Summary` / `Impact_Potential` / `Suggested_Upgrades` per snake_case canonical; Vault.notes SSOT for full content | Vault = SSOT for full text; Zoho = synced summary |
| 18 | Readiness / clarity / metric scores | RENAME (Contacts) for Lead/Contact alignment; Vault SSOT for deep scoring | Vault = SSOT for deep, Zoho = synced for filtering |
| 19 | Lead source / campaign | KEEP Zoho.Lead_Source SSOT; MERGE Zoho Deal.Campaign_Source into Lead_Source; DEPRECATE Sheets col AZ | Zoho = SSOT |
| 20 | Lead status (4 overlapping state machines) | RESOLVE: Zoho.Lead.Lead_Status = SSOT (12 vals); Zoho.Contact.Client_Activity_Status KEEP (different concept — post-conversion lifecycle); Zoho.Deal.Stage = SSOT for in-program (16 vals); RETIRE Vault.tier1_status + tier2_status; Sheets col U RETIRED | Zoho Lead/Contact/Deal own the three orthogonal state concepts |
| 21 | Stage / pipeline stage | RESOLVE: Zoho.Deal.Stage = SSOT; RETIRE Pipeline_Stages, RENAME Pipeline_SubStage → Stage_SubStep; RETIRE Contact.Current_Deal_Stage (Depri); Sheets col I RETIRED | Zoho Deal = SSOT |
| 22 | Payment received date | NEW Zoho.Deal.Payment_Received_Date; Vault.payment_received_date = synced read; DEPRECATE Sheets col AT | Zoho Deal = SSOT |
| 23 | Proposal / Tier 2 offered date | KEEP Zoho.Lead/Contact.Proposal_Sent SSOT; DEPRECATE Sheets col AQ | Zoho = SSOT |
| 24 | Proposal accepted date | KEEP Zoho.Lead/Contact.Proposal_Accepted SSOT; Sheets col AR retired with sheet | Zoho = SSOT |
| 25 | Service purchased / pathway | KEEP Zoho.Deal.Service + Zoho.Contact.Service_Purchased (post-purchase reporting view); RETIRE Zoho.Lead.Service_Pathway (Depri); ADD 10 new Stripe product values to picklists | Zoho = SSOT |
| 26 | CV file location | KEEP Vault SSOT (5 fields); KEEP Zoho.Lead/Contact.CV_and_Cover_Letter for inline access; RETIRE Zoho.Deal.CV_and_Cover_Letter (Depri); DEPRECATE Sheets cols E + R | Vault = SSOT |
| 27 | Client folder URL | KEEP Zoho.Contact.Client_Folder_URL SSOT; NEW Vault.client_folder_url (mirror); DEPRECATE Sheets col AU | Zoho Contact = SSOT |
| 28 | Communication preference / channel | RENAME both Lead.Communication_preference and Contact.Preferred_Channel → `Communication_Preference`; NEW Vault.communication_preference (mirror) | Zoho = SSOT |
| 29 | Relocation interest | KEEP Zoho.Relocation_Interest (multiselect) as derived view from Vault; Vault.target_countries + target_regions = SSOT | Vault = SSOT, Zoho derived |
| 30 | Consent / privacy flag | RENAME Lead.I_agree_to_privacy_policy → `Consent_Privacy` to match Contact; KEEP Contact.Consent_Privacy | Zoho = SSOT |
| 31 | Source agent / referral partner | RENAME Contact.Referral_Person → `Source_Agent`; reconcile to single 17-value picklist across Lead/Contact/Deal; KEEP Zoho.Lead.Referrer_Contact + Referrer_Account (different concept — referring person/company) | Zoho = SSOT |
| 32 | Partner (spouse) name / email | RENAME Contact.Partner_s_Name/Email → Partner_Full_Name/Email (match Lead); RETIRE Deal.Partner_First_Name/Email (Depri) | Zoho Lead/Contact = SSOT |
| 33 | Lead Identification autonumber | RENAME Contact.Lead_Identification → `Contact_Identification`; Deal.Lead_Identification → `Deal_Identification`; KEEP all three | Zoho per-module |
| 34 | Tags | KEEP Zoho.Tag (Zoho-native) + Vault.tags (deep candidate data) — different concepts | Both KEEP, no overlap |
| 35 | Last activity / last updated | KEEP Zoho.Last_Activity_Time SSOT for cross-record; KEEP Vault traceability fields (last_updated, last_profile_review_date, last_upsert_utc) for Vault-internal; DEPRECATE Sheets cols W + AI + AJ | Zoho + Vault both KEEP for orthogonal purposes |

**All 35 candidates resolved.** Two further candidates surfaced from D3 Section 6 (not in Section 5's count of 35):
- **(37) Two target-role fields on Lead/Contact (`Target_Role`, `Target_Role_Title`)** — handled in candidate 9 above.

Both subsumed.

---

## 6. In-flight Zoho-usage observations from the daily logs (per Blueprint Section 6.2)

Daily logs from 2026-04-23 → 2026-04-26 surfaced four observations that are inputs to D4:

1. **10 Stripe products went LIVE 2026-04-24** (TEFI-T1-CMR, T2, T3A, T3B, T4, ADD-CLW, ADD-LIS, ADD-PP, ADD-PPC, ADD-JFS). The Service / Service_Purchased picklists need these values added; the Stripe → Zoho workflow's product-name mapping needs the IDs. → Reflected in Step 9 of Phase 1.
2. **~35 existing T1 Registry rows have empty Person_ID** (per the 2026-04-26 weekly review). → Reflected in Step 34 (Phase 4 backfill) and the ~100–200 estimate.
3. **Career Vault v3.5 / v3.6 reconciliation pending** — Janup Wollet enrichment + 15 PERSON_PROFILE cells need a manual merge. Out of D4 scope (operational cleanup, not schema). Flag for separate session.
4. **TATE_FOCUS "This Week's Three Things" lists Phase 1.5** (cancelled 2026-04-23) and **Phase 2** (blocked behind Phase 1.4) — stale. Out of D4 scope but flagged here so the Monday refresh corrects it.

---

## 7. What this document does not produce (per Blueprint Section 7)

- No n8n workflow code. Schema contracts only — workflows are post-D4 ops.
- No legacy / dormant backfill plan beyond the active set. That is a future one-off project (D2 Thread 4A line 458, Sheets-Zoho Sync Decision lines 41–44).
- No re-opening of the three D1 locks or the seven D2 lock-points.
- No silent capability expansion. Every NEW field corresponds to a D2-named gap, a D3-flagged overlap, a Q4 Addition raised by Tate 2026-04-26, or the Q4 Addition 3 extension folded same session.
- No Sheets-Zoho sync redesign. Mechanism is locked at 2026-04-25.

---

## 8. Confidence and caveats

**High confidence:**
- The 35 D3 overlaps resolve cleanly under the SSOT split — no resolution required reopening D1.
- The Lead.Lead_Status (12) and Deal.Stage (16) consolidations align cleanly with the Gmail Label Key.
- Person_ID format change in Vault is bounded (~42 active records, legacy preserved in `legacy_slug_v1`).
- The Q4 Addition 3 model (canonical Vault_JSON_URL + Source_*_URL category + OUTPUT_LOG_URL + Asset_*_URL category) scales to 18+ deliverable types without per-deliverable schema changes.
- **Zoho per-module custom-field quota — confirmed under by Tate 2026-04-26.** Post-migration counts: Lead ~60 / Contact ~74 / Deal ~35 / Account 7 — all well under the 155-per-module Professional Plan limit. No architectural fallback to a Zoho custom Person module needed. Schema proceeds as drafted.
- **Unique-field budget constraint understood and pinned.** Professional Plan caps unique-constraint fields at 2 per module; on Lead and Contact those slots are consumed by `Email` (unique) + `Person_ID` (unique). Any future field requiring uniqueness on Lead or Contact must surface this constraint and propose a resolution. Captured in §1 constraint 8.

**Medium confidence:**
- **n8n Zoho node coverage of all field types used.** Multi-select picklists (Relocation_Interest), formulas (Years_of_Experience, Stalled_Days, Time_in_Stage), lookup fields (Outcome_Attributed → Activity), profile images, file uploads — n8n has had quirks with at least the first three historically. Sonnet should test in Steps 14–16 before relying.
- **Lead vs Contact custom-field naming drift may surface a deeper case during Phase 1 dry-runs** than D3 captured. D2 Closing Note flagged a potential 30–60 min sub-task. Build it into Phase 1 schedule.
- **Deal.Stage 58→16 mapping is opinionated.** Tate may want to override specific old→new mappings; the CSV review in Step 2 is the moment to do that.

**Low confidence / known unknowns:**
- **Lead.Lead_Status backward compatibility during the parallel window.** Old picklist values stay queryable (Step 9) but any Relay workflow or daily-task that filters on a specific old value (e.g. "Initial Contact") may need updating before that workflow runs again. Audit Relay prompt files for `Lead_Status` references in Phase 1 prep.
- **Zoho webhook reliability for the Gmail label sync** (Step 16). D1 caveat 10.3 flagged this. Worst case is a 15-min poll; acceptable but should be confirmed during Step 18 dry-run.
- **OUTPUT_LOG_URL filter view mechanics.** The URL pattern needs to either programmatically create a Google Sheets filter view per Deal (Sheets API supports this) or use a templated `&fvid=...` filter URL. Mechanics confirmed in Step 6 design but not yet validated against live Sheets behaviour. Test during Phase 1 dry-run.
- **Whether any of the 35 D3 overlap candidates was re-touched between 2026-04-23 and today.** The Apr 25 Saturday session decisions (BF.1–BF.3 paused, cols AR/AS deprecated) are reflected here; no other re-touches detected from daily-log skim. If Tate has run any Zoho-side custom field edits since 2026-04-23 not captured in the logs, surface them before Step 3 of Phase 1.

---

*End of D4 Target Schema + Migration Plan — FINAL 2026-04-26 (post-Q4 Addition 3 extension and quota confirmation). Companion file: `~TEFI/IP Brain/TEFI_TENANT_REGISTRY.md` (ACTIVE). Phase 1 Step 2 unblocked for next Sonnet ops session.*
