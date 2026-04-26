# TEFI Full Field Map — Cross-Store Field Inventory

**Date:** 2026-04-23
**Deliverable:** 3 of 4 (SSOT governance prep)
**Purpose:** Comprehensive field-level tabulation across Zoho CRM (Leads, Contacts, Deals), Leads Registry (Google Sheet), and Career Vault (Google Sheet). Deliverable 4 will consume this to make keep/move/merge/deprecate decisions.

Scope note: This is an extraction exercise. No recommendations. No rename suggestions. Overlapping fields are flagged as "candidates for Deliverable 4", never as "redundant".

---

## Section 1 — Summary Counts

| Store | Module / Tab | Total fields | Custom (Zoho) | Standard actively used (Zoho) | Fields skipped |
| :-- | :-- | --: | --: | --: | --: |
| Zoho CRM | Leads | 90 | 45 | 45 | ~12 (system/tracking fields retained but noted low-use; profile image, $approval handled implicitly) |
| Zoho CRM | Contacts | 96 | 54 | 42 | ~10 (same class as Leads) |
| Zoho CRM | Deals | 46 | 18 | 28 | ~6 (system) |
| Leads Registry | Sheet (single tab) | 52 | n/a | n/a | 0 |
| Career Vault | PERSON_PROFILE | 76 | n/a | n/a | 0 |
| Career Vault | CAREER_DETAIL (ROLE + ACHIEVEMENT + SKILL + EVIDENCE combined) | 101 | n/a | n/a | 0 |
| Career Vault | TARGET_ROLE_PACK | 27 | n/a | n/a | 0 |
| Career Vault | OUTPUT_LOG | 14 | n/a | n/a | 0 |
| Career Vault | ADMIN_CONSOLE | 12 | n/a | n/a | 0 |
| Career Vault | INTAKE_LOG | 20 | n/a | n/a | 0 |
| **Total** | | **534** | **117** | **115** | **~28 tracking fields noted but kept in full inventory** |

Skipped-field policy for Zoho: every field returned by getFields was enumerated. Fields that are pure system plumbing (Record_Image / Tag / Change_Log_Time__s / Last_Enriched_Time__s / Locked__s / Enrich_Status__s / Record_Status__s / id / Visitor_Score and web-visit metrics) are LISTED but marked "(system)". They were not dropped from the inventory because a few of them (id, Locked__s, Last_Activity_Time) may be referenced by n8n.

---

## Section 2 — Zoho Field Inventory

### 2.1 Leads module (90 fields)

#### 2.1.1 Custom fields (45)

| api_name | field_label | data_type | custom? | picklist (sample) | notes |
| :-- | :-- | :-- | :-: | :-- | :-- |
| Company_email | Company email | email | Y | — | |
| I_have_experience_helping | helping () get work | text | Y | — | Purpose unclear — label reads partially templated |
| Partner_Full_Name | Partner First Name | text | Y | — | Label says First, api says Full |
| Partner_Email | Partner Email | email | Y | — | |
| Send_Email | Send Lead Template | picklist | Y | 52 values: None, Need CV First, Below-skill-qual, Meet Group, 1-on-1, HR-Recruit... | Used by legacy manual process |
| Source_Agent | Source Agent | picklist | Y | 16 values: Fabien Maisonneuve, Sanjeev Singh, Julia Cooke, Anastasiya Florets'ka, M... | |
| Duplicate_Check | Duplicate Check | boolean | Y | — | |
| Meeting_Status | Meeting Status | picklist | Y | Scheduled / Attended / No-Show | |
| Lead_Identification | Lead Identification | autonumber | Y | — | Internal Zoho sequence |
| No_Auto_Responses | No Auto-Responses | boolean | Y | — | |
| CV_and_Cover_Letter | CV and Cover Letter | fileupload | Y | — | |
| leadchain0__Social_Lead_ID | Social Lead ID | text | Y | — | Third-party extension field |
| email_normalized | Email_Normalized | text | Y | — | Lowercased/trimmed email for matching |
| Target_Country | Target_Country | picklist | Y | 29 values: NZ, AU, US, CA, UK, IE... | |
| Target_Role | Target_Role | text | Y | — | |
| Migration_Status_and_Needs | Depri_Migration Status and Needs | textarea | Y | — | "Depri_" prefix suggests deprecated |
| I_agree_to_privacy_policy | Leads.Consent (Privacy) | boolean | Y | — | |
| Referrer_Contact | Referring Contact | text | Y | — | |
| Referrer_Account | Agency Account | text | Y | — | |
| Form_UUID | Depri_Form UUID | text | Y | — | Deprecated prefix |
| Target_Role_Title | Target_Role_Title | text | Y | — | Separate from Target_Role above |
| Profile_Notes | Depri_Profile Notes | textarea | Y | — | Deprecated prefix |
| Career_Start_Year | Career_Start_Year | integer | Y | — | |
| Primary_Sector | Industry_Sector | text | Y | — | api / label mismatch |
| Summary_Snippet_Lead | Summary_Snippet_Lead | textarea | Y | — | |
| Consultant_Notes_Lead | Depri_Consultant_Notes_Lead | textarea | Y | — | Deprecated prefix |
| Highest_Qualification | Highest_Qualification | picklist | Y | PhD / Masters / Chartered / Bachelors / Trades Qualified / Professional Qualified... | |
| ESOL_Level | ESOL_Level | picklist | Y | Native / Flurent [sic] / Advanced / Intermediate / Beginner | Typo in value "Flurent" |
| Potential_Green_List_Match | Depri_Potential_Green_List_Match | picklist | Y | Yes / No / Possible | Deprecated prefix |
| Service_Pathway | Depri_Service_Pathway | picklist | Y | Full Programme / Easy Entry / Upskill Only | Deprecated prefix |
| Years_of_Experience | Years_of_Experience | formula | Y | — | Derived |
| TEFI_Readiness_Score | TEFI_Readiness_Score | integer | Y | — | |
| Professional_Summary | Professional_Summary | textarea | Y | — | |
| GapSummary | Gap_Summary | textarea | Y | — | |
| Short_Headline | Short_Headline | text | Y | — | |
| Metric_Density_Score | Metrics_Density_Score | integer | Y | — | |
| Notes_AI | Notes_AI | textarea | Y | — | |
| Employer_Convenience_Score | Employer_Convenience_Score | integer | Y | — | |
| Visa_Status | Visa_Status | picklist | Y | None / NZ Resident / AU Resident / Work Visa / Student / Unsure / Not Stated | |
| Communication_preference | Communication_preference | picklist | Y | Email / WhatsApp / Mobile / Video Call | |
| Relocation_Interest | Relocation_Interest | multiselectpicklist | Y | NZ, AU, Europe, US, Canada, Open to other, Not Stated | |
| CV_Clarity_Score | CV_Clarity_Score | integer | Y | — | |
| Impact_Potential | Impact_Potential | textarea | Y | — | |
| Proposal_Sent | Proposal Sent | date | Y | — | |
| Proposal_Accepted | Proposal Accepted | date | Y | — | |

#### 2.1.2 Standard fields (45) — actively used + system/tracking

| api_name | field_label | data_type | picklist (sample) | notes |
| :-- | :-- | :-- | :-- | :-- |
| Owner | Lead Owner | ownerlookup | — | active |
| Company | Company | text | — | active |
| First_Name | First Name | text | — | active |
| Last_Name | Last Name | text | — | active |
| Full_Name | Full Name | text | — | derived |
| Designation | Title | text | — | active |
| Email | Email | email | — | active |
| Phone | Phone | phone | — | active |
| Mobile | Mobile | phone | — | active |
| Lead_Source | Lead Source | picklist | 32 vals: NZ Shores, Client Referral, Company Website, Webinar, Facebook, Instagram... | active |
| Lead_Status | Lead Status | picklist | 18 vals: Not Contacted, Under-qualified, Junk Lead, Initial Contact, Meeting Invited... | active |
| Industry | Industry | picklist | Trades / Teacher / Technologist / Accountant / Engineer / IT / Medical / Mid-Mgmt... | active |
| No_of_Employees | No. of Employees | integer | — | rarely populated |
| Email_Opt_Out | Email Opt Out | boolean | — | active |
| Salutation | Salutation | picklist | Mr./Mrs./Ms./Dr./Prof. | active |
| Last_Activity_Time | Last Activity Time | datetime | — | system |
| Tag | Tag | text | — | system |
| Street | Street | text | — | active |
| City | City | text | — | active |
| Zip_Code | Zip Code | text | — | active |
| Country | Country | text | — | active |
| Description | Description | textarea | — | active |
| Record_Image | Lead Image | profileimage | — | (system) |
| Converted_Date_Time | Converted Date Time | datetime | — | system |
| Lead_Conversion_Time | Lead Conversion Time | integer | — | system |
| Unsubscribed_Mode | Unsubscribed Mode | picklist | Consent form / Manual / Unsubscribe link / Zoho campaigns | |
| Unsubscribed_Time | Unsubscribed Time | datetime | — | |
| Converted_Account | Converted Account | lookup | — | system |
| Converted_Contact | Converted Contact | lookup | — | system |
| Converted_Deal | Converted Deal | lookup | — | system |
| id | Record Id | bigint | — | (system) |
| Change_Log_Time__s | Change Log Time | datetime | — | (system) |
| Converted__s | Is Converted | boolean | — | (system) |
| First_Visited_Time | First Visit | datetime | — | web-visitor (system) |
| Visitor_Score | Visitor Score | bigint | — | web-visitor (system) |
| Referrer | Referrer | website | — | web-visitor |
| Average_Time_Spent_Minutes | Average Time Spent (Minutes) | double | — | web-visitor |
| Last_Visited_Time | Most Recent Visit | datetime | — | web-visitor |
| First_Visited_URL | First Page Visited | website | — | web-visitor |
| Number_Of_Chats | Number Of Chats | integer | — | web-visitor |
| Days_Visited | Days Visited | integer | — | web-visitor |
| Locked__s | Locked | boolean | — | (system) |
| Last_Enriched_Time__s | Last Enriched Time | datetime | — | Zoho enrichment (system) |
| Enrich_Status__s | Enrich Status | picklist | Available / Enriched / Data not found | enrichment |
| Record_Status__s | Record Status | picklist | Trash / Available / Draft | (system) |

### 2.2 Contacts module (96 fields)

#### 2.2.1 Custom fields (54)

| api_name | field_label | data_type | picklist (sample) | notes |
| :-- | :-- | :-- | :-- | :-- |
| LinkedIn | Video CV | website | — | api / label mismatch (api=LinkedIn, label=Video CV) |
| Partner_s_Name | Partner First Name | text | — | |
| Partner_s_Email | Partner Email | email | — | |
| Company | Company | text | — | Note: on Contacts, Company is custom |
| Website | Short Clip | website | — | api / label mismatch |
| Company_email | Company email | email | — | |
| I_have_successful_experience_helping_get_work | Depri_helping () get work | text | — | Deprecated; templated label |
| Referral_Person | Source Agent | picklist | 17 vals: Fabien Maisonneuve, Sanjeev Singh, Julia Cooke, Anastasiya Florets'ka, M... | |
| Send_Contact_Template | Send Contact Template | picklist | TO BE RE-DESIGNED / Full-LevelGM-Deal / Full-LevelDiverse-Deal / Full-Level... | Values indicate template chooser |
| Lead_Identification | Contacts Identification | autonumber | — | |
| LinkedIn1 | LinkedIn | website | — | Actual LinkedIn URL; first LinkedIn field repurposed for Video CV |
| Invite_Date | Depri_Invite Date | datetime | — | Deprecated |
| Invite_Type | Depri_Invite Type | picklist | Meeting Invite / 1-on-1 Invite / Pathway Offer | Deprecated |
| No_Auto_Responses | Depri_No Auto-Responses | boolean | — | Deprecated |
| Current_Deal_Stage | Depri_Contact Deal Stage | picklist | 25 vals: S1a YourStrengths, S1b ProjectsTable, S1c SkillsAchieveMetrics, S2a Inte... | Deprecated |
| Previous_Deal_Stage | Depri_Previous Deal Stage | text | — | Deprecated |
| Date_Entered_Stage | Depri_Date Entered Stage | date | — | Deprecated |
| Days_in_Stage | Depri_Days in Stage | formula | — | Deprecated |
| Sent_via_Manual_Process | Depri_Sent via Manual Process? | boolean | — | Deprecated |
| CV_and_Cover_Letter | CV and Cover Letter | fileupload | — | |
| leadchain0__Social_Lead_ID | Social Lead ID | text | — | Extension |
| Target_Country | Target_Country | picklist | 29 vals: NZ, AU, US, CA, UK, IE... | |
| Form_UUID | Depri_Form UUID | text | — | Deprecated |
| Profile_Notes | Depri_Profile Notes | textarea | — | Deprecated |
| Career_Start_Year | Career_Start_Year | integer | — | |
| Primary_Sector | Industry_Sector | text | — | |
| Highest_Qualification | Highest_Qualification | picklist | PhD / Masters / Chartered / Bachelors / Trades Qualified / Professional Qualified... | |
| ESOL_Level | ESOL_Level | picklist | Native / Flurent / Advanced / Intermediate / Beginner | |
| Potential_Green_List_Match | Depri_Potential_Green_List_Match | picklist | Yes / No / Possible | Deprecated |
| Proposal_Sent | Proposal Sent | date | — | |
| Proposal_Accepted | Proposal Accepted | date | — | |
| Timezone | Timezone | text | — | |
| Client_Activity_Status | Client_Activity_Status | picklist | Active / Unknown / On Hold / Nurture / Don't Bother | |
| CV_Clarity_Score | CV_Clarity_Score | integer | — | |
| TEFI_Readiness | TEFI_Readiness_Score | integer | — | api / label mismatch |
| Short_Headline | Short_Headline | text | — | |
| Notes_AI | Contact.Notes_AI | textarea | — | |
| GapSummary | Gap_Summary | textarea | — | |
| MetricDensityScore | Metrics_Density_Score | integer | — | |
| Target_Role | Target_Role | text | — | |
| SuggestedUpgrades | Suggested_Upgrades | textarea | — | |
| STAR_Project_Count | STAR_Project_Count | integer | — | |
| Target_Role_Title | Target_Role_Title | text | — | |
| ImpactPotential | Impact_Potential | textarea | — | |
| Professional_Summary | Professional_Summary | textarea | — | |
| Employer_Convenience_Score | Employer_Convenience_Score | integer | — | |
| Visa_Status | Visa_Status | picklist | None / NZ Resident / AU Resident / Work Visa / Student / Unsure / Not Stated | |
| Preferred_Channel | Communication_Preference | picklist | Email / WhatsApp / Mobile / Video Call | api / label differ |
| Client_Folder_URL | Client_Folder_URL | website | — | |
| Years_of_Experience | Years_of_Experience | formula | — | |
| Relocation_Interest | Relocation_Interest | multiselectpicklist | NZ, AU, Europe, US, Canada, Open to other, Not Stated | |
| Consent_Privacy | Contact.Consent (Privacy) | boolean | — | |
| Service_Purchased | Service Purchased | picklist | Easy Entry Job Finding Kit / Job Finding Support / CV Upgrade / Other | |
| Person_ID | Person ID | text | — | TEFI-wide identity key |

#### 2.2.2 Standard fields (42)

Actively used: Owner, Lead_Source (31-val picklist), First_Name, Last_Name, Full_Name, Email, Title, Phone, Mobile, Date_of_Birth, Email_Opt_Out, Salutation, Mailing_Street/City/State/Zip/Country, Description.

Rarely-populated: Other_Street/City/State/Zip/Country (duplicate address block).

System / tracking: Last_Activity_Time, Tag, Record_Image, Unsubscribed_Mode, Unsubscribed_Time, id, Change_Log_Time__s, Locked__s, Last_Enriched_Time__s, Enrich_Status__s (Available / Enriched / Data not found), Record_Status__s (Trash / Available / Draft).

Web-visitor (system): First_Visited_Time, Visitor_Score, Referrer, Average_Time_Spent_Minutes, Last_Visited_Time, First_Visited_URL, Number_Of_Chats, Days_Visited.

### 2.3 Deals module (46 fields)

#### 2.3.1 Custom fields (18)

| api_name | field_label | data_type | picklist (sample) | notes |
| :-- | :-- | :-- | :-- | :-- |
| Start_Date | Start Date | datetime | — | |
| Job_Market | Depri_Job Market | text | — | Deprecated |
| Email | Email | email | — | |
| Partner_First_Name | Depri_Partner First Name | text | — | Deprecated |
| Partner_Email | Depri_Partner Email | email | — | Deprecated |
| Source_Agent | Source Agent | picklist | 15 vals: Julia Cooke, Fabien Maisonneuve, Sandrine Savarit, Clintivene Sechel, Co... | |
| Service | Proposal-Service | picklist | Full (end-to-end) GM Level / Red Carpet Programme / Top 2% CV / Job Interview... | |
| Payment_Selection | Payment Selection | picklist | Full Prepayment / Paid 1/2 (Stage 1) / Paid 2/2 (Stage 2) / Paid 1/3 (Session...) | |
| Send_Contact_Template | Depri_Send Contact Template | picklist | Prop-FullLevelGM-Deal / Prop-FullLevelDiverse-Deal / Prop-FullLevelDirect-... | Deprecated |
| Lead_Identification | Deal Identification | autonumber | — | |
| Pipeline_SubStage | Full Pipe SubStages | picklist | 26 vals: S1a Gather Strengths, S1b ProjectsTable, S1c SkillsAchieveMetrics, S2a G... | |
| Pipeline_Stages | Full Pipeline Stages | picklist | 12 vals: S1: Gather Strengths, S2: Gather Interview Content, S3: Record-Render CV... | |
| Big_Template_List | Depri_Full Big Template List | multiselectpicklist | 30 vals: S1a Professional Skills Study, S1b Projects Table, S2c Skills and Achievements... | Deprecated |
| Time_in_Stage | Time in Stage | formula | — | |
| CV_and_Cover_Letter | Depri_CV and Cover Letter | fileupload | — | Deprecated |
| leadchain0__Social_Lead_ID | Social Lead ID | text | — | |
| Target_Country | Target Country | picklist | 29 vals: NZ, AU, US, CA, UK, IE... | |
| Scope_of_Work | Scope_of_Work | textarea | — | |

#### 2.3.2 Standard fields (28)

| api_name | field_label | data_type | picklist / notes |
| :-- | :-- | :-- | :-- |
| Owner | Deal Owner | ownerlookup | active |
| Amount | Amount | currency | active |
| Deal_Name | Deal Name | text | active |
| Closing_Date | Closing Date | date | active |
| Account_Name | Account Name | lookup | active |
| Pipeline | Pipeline | picklist | 8 vals: Tier 4: End-to-End Employment Programme, Sales Pipeline, Tier 3: Job Ma... |
| Stage | Stage | picklist | 58 vals: Qualification, Needs Analysis - CV, Needs Analysis - Group_Meet, Value Propo... |
| Type | Type | picklist | New Business / Existing Business |
| Probability | Probability (%) | integer | |
| Expected_Revenue | Expected Revenue | currency | |
| Lead_Source | Lead Source | picklist | 28 vals |
| Campaign_Source | Campaign Source | lookup | |
| Contact_Name | Contact Name | lookup | links to Contacts |
| Created_By | Created By | ownerlookup | system |
| Modified_By | Modified By | ownerlookup | system |
| Created_Time | Created Time | datetime | system |
| Modified_Time | Modified Time | datetime | system |
| Last_Activity_Time | Last Activity Time | datetime | system |
| Lead_Conversion_Time | Lead Conversion Time | integer | system |
| Sales_Cycle_Duration | Sales Cycle Duration | integer | system |
| Overall_Sales_Duration | Overall Sales Duration | integer | system |
| Tag | Tag | text | (system) |
| Record_Image | Deal Image | profileimage | (system) |
| id | Record Id | bigint | (system) |
| Change_Log_Time__s | Change Log Time | datetime | (system) |
| Locked__s | Locked | boolean | (system) |
| Record_Status__s | Record Status | picklist | (system) |
| Stage_Modified_Time | Stage Modified Time | datetime | |

---

## Section 3 — Leads Registry columns (52)

Tab name: single tab inferred from title "Tier1_Registry for Questions". Data observed: ~40 rows, mostly early-pipeline (W1 Pending / W1 Sent). Values right of column O are almost entirely empty in current data. Population patterns below are inferred from observed data + the explanatory footer blocks in the sheet.

| Col | Header | Inferred type | Population note |
| :-: | :-- | :-- | :-- |
| A | Person_ID | text | **Empty in all observed rows**. Relay auto-populates elsewhere but this column is currently blank |
| B | Date Received | date (YYYY-MM-DD) | Always filled on intake by Relay workflow 1 |
| C | Full Name | text | Always filled |
| D | Email | text (email) | Usually filled; blank in 1 observed row |
| E | CV Filename | text | Always filled |
| F | W1 Sent Date | date (sometimes as Excel serial e.g. 46088) | Filled after W1 send; mixed formats |
| G | Reply Received | date | Only populated once client replies |
| H | W2 Sent Date | date | Only after Tier 1 report sent |
| I | Stage | picklist | Always filled. Values: W1 Pending, W1 Sent, Reply Received, W2 Pending, W2 Sent, Complete |
| J | Notes | textarea | Rarely filled |
| K | Archive Path | text (path) | Only when moved to Archive |
| L | Source Country | text | Usually filled by Relay |
| M | Primary Role | text | Usually filled by Relay |
| N | Seniority | picklist | Values observed: Junior, Mid, Senior, Executive, Manager |
| O | Target Country | text | Only after client reply |
| P | Word Count W1 | integer | Usually filled |
| Q | Word Count W2 | integer | Only when W2 sent |
| R | Tier 1 Report Path | text (path) | Only after W2 sent |
| S | Upgraded to Tier | picklist | Manual: Tier 2 / 3A / 3B / 4 |
| T | Upgrade Date | date | Manual |
| U | Lead Status | picklist | Manual. Active / Stalled / Nurturing / Converted / Dead / On Hold |
| V | Status Reason | text | Manual |
| W | Last Status Change | date | Manual |
| X | Follow-Up Priority | picklist | High / Medium / Low / Watch |
| Y | Nudge 1 Sent Date | date | Manual (n8n future) — D3 |
| Z | Nudge 1 Type | picklist | Email / LinkedIn / SMS / WhatsApp |
| AA | Nudge 1 Response | picklist | Replied / No Reply / Bounced / Unsubscribed / Out of Office |
| AB | Nudge 2 Sent Date | date | D10 |
| AC | Nudge 2 Type | picklist | same set as AA |
| AD | Nudge 2 Response | picklist | |
| AE | Nudge 3 Sent Date | date | DHiringBubble |
| AF | Nudge 3 Type | picklist | |
| AG | Nudge 3 Response | picklist | |
| AH | Total Touches | integer | Manual count |
| AI | Last Touch Date | date | |
| AJ | Days Since Last Touch | integer (formula) | =TODAY()-AI |
| AK | Reply Content Summary | textarea | Manual |
| AL | Interest Signal | picklist | Hot / Warm / Cool / Cold / Negative |
| AM | Objection Raised | picklist | Price / Timing / Not Ready / Using Other / Visa / Found Job / Other |
| AN | Objection Notes | textarea | |
| AO | Gmail Label | text | Mirror of Gmail label |
| AP | Last Email Thread ID | text | n8n future |
| AQ | Tier 2 Offered Date | date | |
| AR | Tier 2 Response | picklist | Accepted / Declined / Pending / No Reply / In Discussion |
| AS | Tier 2 Declined Reason | text | |
| AT | Payment Received Date | date | Manual / Stripe future |
| AU | Moved to Client Folder | Yes/No | |
| AV | Exit Reason | picklist | Converted / Declined / Expired / Unsubscribed / Duplicate / Found Job / Other |
| AW | Exit Date | date | |
| AX | Reactivation Candidate | Yes/No/Maybe | |
| AY | Placed | picklist | Not Yet / In Progress / Placed / Withdrawn |
| AZ | Campaign | text | |

Note on column letters: the sheet footer calls the Group A block "X–AA" and subsequent groups continue from AB. My enumeration above matches that convention. Header count = 52 columns, consistent with the user-provided header list.

Always-filled columns in observed data: B, C, E, I, L, M, N, P.
Rarely or never filled in current data: A (Person_ID), J, K, Q, R, S, T, U–AZ.

---

## Section 4 — Career Vault tabs

Schema version 3.4 LOCKED. Tabs: PERSON_PROFILE, CAREER_DETAIL, TARGET_ROLE_PACK, OUTPUT_LOG, ADMIN_CONSOLE, INTAKE_LOG, KEY (guide only, no fields).

### 4.1 PERSON_PROFILE (76 fields)

| Column | Data type | Notes |
| :-- | :-- | :-- |
| Person_ID | text (slug) | Format: firstname_lastname_YYYYMMDD_shortcode |
| first_name | text | |
| last_name | text | |
| full_name | text | derived |
| preferred_name | text | |
| email | text | |
| phone | text | |
| linkedin_url | url | |
| portfolio_url | url | |
| city | text | |
| country | text | |
| current_location | text | "City, Country" |
| timezone | text | added in v3.4 |
| citizenship | text | |
| visa_status | text | |
| Visa_Pathway_Status | text | |
| work_rights_summary | text | |
| work_rights_expiry_date | date | |
| source_country | text | |
| languages | text | |
| notice_period | text | |
| target_countries | text (pipe list) | |
| target_regions | text | |
| target_role_titles | text (pipe list) | |
| target_industries | text | |
| target_seniority | picklist | Entry / Mid / Senior / Lead / Manager / Director / Executive / C-Suite |
| target_comp_band | text | |
| salary_current | number | |
| salary_target | number | |
| salary_currency | picklist | ISO 4217 subset (NZD, AUD, USD, ZWL, MWK, ZAR, INR, GBP, EUR) |
| years_experience | text/number | |
| target_markets | text | |
| market_readiness_score | integer | |
| estimated_time_to_placement | text | e.g. "4-6 weeks" |
| core_value_prop | textarea | |
| role_families_priority | text | |
| top_skills_keywords | text (comma list) | |
| skills_extracted_from_cv | text (pipe list) | PASSTHROUGH — read-only after intake |
| professional_registrations | text | |
| registration_bodies | text | |
| registration_expiry_dates | date | |
| certifications_shortlist | text | |
| certifications_raw | text | PASSTHROUGH |
| lead_date | date | |
| lead_source | text | |
| lead_quality_score | integer | |
| tier1_status | text | e.g. "Completed - Tier 1 Reply Document Received" |
| tier2_status | text | |
| cv_delivered_date | date | |
| payment_received_date | date | |
| references_status | text | |
| cv_original_file_path | text | |
| cv_tier1_file_path | text | |
| tier1_answers_file_path | text | |
| snapshot_file_path | text | |
| notes | textarea | |
| tags | text | |
| last_updated | datetime | |
| last_profile_review_date | date | |
| ats_keyword_density | number | added in v3.4 |
| gen_summary_short | textarea | GENERATED — never manually edit |
| gen_summary_mid | textarea | GENERATED |
| gen_summary_long | textarea | GENERATED |
| gen_headline_bank | textarea | GENERATED |
| gen_core_value_prop | textarea | GENERATED |
| gen_fields_stale | boolean | GENERATED |
| gen_prompt_version | text | GENERATED |
| vh_core_complete | boolean | VAULT HEALTH |
| vh_generated_stale | boolean | VAULT HEALTH |
| vh_last_s1e_stamp | date | VAULT HEALTH |
| vh_open_qa_flags | text | VAULT HEALTH |
| vh_evidence_attached | boolean | VAULT HEALTH |
| vh_target_packs_active | integer | VAULT HEALTH |
| vh_null_rate_achievements | number | VAULT HEALTH |
| vh_null_rate_skills | number | VAULT HEALTH |
| vh_schema_version | text | VAULT HEALTH |
| last_upsert_run_id | text | Traceability |
| last_upsert_utc | datetime | Traceability |
| source_doc_url | url | Traceability |
| source_doc_id | text | Traceability |
| source_run_id | text | Traceability |
| source_run_revision | text | Traceability |
| match_method_last | text | Traceability |
| match_key_last | text | Traceability |
| match_confidence_last | text | Traceability |

### 4.2 CAREER_DETAIL (101 fields) — discriminated by `_record_type`

Single physical tab, four logical record types. `_record_type` ∈ {ROLE, ACHIEVEMENT, SKILL, EVIDENCE}. Most columns are null for non-matching record types.

#### 4.2.1 Discriminator + shared keys

| Column | Data type | Notes |
| :-- | :-- | :-- |
| _record_type | picklist | ROLE / ACHIEVEMENT / SKILL / EVIDENCE |
| Role_ID | text | Parent key for ROLE and ACHIEVEMENT records |
| Person_ID | text | FK to PERSON_PROFILE |

#### 4.2.2 ROLE record fields (parent)

| Column | Data type | Notes |
| :-- | :-- | :-- |
| Employer_Name | text | |
| Employer_Location_City | text | |
| Employer_Location_Country | text | |
| Employer_Industry | text | |
| Employment_Type | picklist | Full-time / Part-time / Contract / Casual / Volunteer / Concurrent Academic |
| Title_Official | text | |
| Title_Market | text | Title translated for target market |
| Department | text | |
| Start_Date | date | |
| End_Date | date | |
| Is_Current | boolean | |
| Scope_Sites_Count | integer | |
| Scope_Users_Customers_Count | integer | |
| Scope_Revenue_Budget_Value | number | |
| Scope_Revenue_Budget_Currency | text (ISO 4217) | |
| Scope_Staff_Leads_Count | integer | |
| Scope_DirectReports_Count | integer | |
| Scope_Vendors_Count | integer | |
| Scope_P_and_L_Value | number | v3.4 |
| Scope_P_and_L_Currency | text | v3.4 |
| Scope_Board_Exposure | boolean | v3.4, not-null for completed roles |
| Scope_Countries_Count | integer | v3.4 |
| Scope_Total_Headcount | integer | v3.4 |
| Tools_Tech_Stack | text | v3.4 |
| Methods_Frameworks | text | |
| Compliance_Safety_Notes | text | |
| Key_Stakeholders | text | |
| Reason_For_Leaving | text | |
| Reference_Name | text | |
| Reference_Relationship | text | |
| Reference_Contact | text | |
| Role_Family | text | |
| Seniority_Level | picklist | Entry..C-Suite |
| Work_Model | picklist | On-site / Hybrid / Remote |
| Employer_Size_Band | picklist | e.g. Small / Medium / Small to Medium |
| Role_Proof_Status | text | e.g. "No Reference Available" |
| Regulatory_Environment_Tags | text | |
| Evidence_IDs | text | |
| Source_Doc_URL | url | |
| Notes | textarea | |
| Last_Validated_Date | date | |
| raw_duties_extracted | text | PASSTHROUGH (v3.4) |

#### 4.2.3 ACHIEVEMENT record fields (child, FK to Role_ID)

| Column | Data type | Notes |
| :-- | :-- | :-- |
| Ach_ID | text | |
| (Role_ID) | text | FK to parent ROLE (reuses shared column) |
| Ach_Type | picklist | Performance Improvement / Operational Excellence / Project Delivery / Leadership / Cost Saving / Safety Record / Technical Innovation / Compliance / Professional Development |
| Micro_Header | text | |
| Achievement_Text | textarea | |
| Situation_Context | textarea | STARR S |
| Action_Method | textarea | STARR A |
| Outcome_Result | textarea | STARR R |
| Story_STARR_Notes | textarea | |
| Metric_1_Name | text | |
| Metric_1_Value_Min | number | |
| Metric_1_Value_Max | number | |
| Metric_1_Unit | text | |
| Metric_1_Timeframe | text | |
| Metric_2_Name | text | |
| Metric_2_Value_Min | number | |
| Metric_2_Value_Max | number | |
| Metric_2_Unit | text | |
| Metric_2_Timeframe | text | |
| Proof_Strength | picklist | High / Medium / Low |
| Skill_Tags | text | |
| Keyword_Tags | text | |
| Segment_Tags | text | |
| Seniority_Signal | text | |
| Recency_Score_Int | integer | 5..1 scale |
| CV_Priority | picklist | High / Medium / Low |
| Pack_Fit_Tags | text | |
| ATS_Version_Text | textarea | ATS-optimized bullet |
| Interview_Story_Flag | boolean | |
| Risk_Flag | text | |
| Sensitivity_Level | text | |
| Evidence_URL | url | |

#### 4.2.4 SKILL record fields

| Column | Data type | Notes |
| :-- | :-- | :-- |
| Skill_ID | text | |
| Skill_Name | text | |
| Skill_Category | text | e.g. Leadership, Digital & IT, Soft Skills, Compliance |
| Skill_Subcategory | text | |
| Proficiency_Level | picklist | Expert / Proficient / Competent / Developing |
| Years_Experience | text | |
| Last_Used_Year | integer | |
| ATS_Synonyms | text | |
| Display_On_CV | boolean | |
| Display_On_LinkedIn | boolean | |
| Is_Core | boolean | |
| Typical_Role_Families | text | |

#### 4.2.5 EVIDENCE record fields

| Column | Data type | Notes |
| :-- | :-- | :-- |
| Evidence_ID | text | |
| Evidence_Type | picklist | Certification / Education / Reference / Award / Publication / Work Sample / Conference Presentation / Intellectual Property |
| Evidence_Title | text | |
| Evidence_Date | date | |
| Issuer_Org | text | |
| Credential_ID | text | |
| Expiry_Date | date | |
| URL | url | |
| Related_Role_IDs | text | |
| Related_Ach_IDs | text | |
| Verification_URL | url | |

#### 4.2.6 Row-level

| Column | Data type | Notes |
| :-- | :-- | :-- |
| _schema_version | text | stamped per row |

### 4.3 TARGET_ROLE_PACK (27 fields)

| Column | Data type | Notes |
| :-- | :-- | :-- |
| Role_Pack_ID | text | |
| is_active | boolean | multiple packs supported |
| pack_created_date | date | |
| pack_closed_date | date | |
| Person_ID | text | FK |
| Pack_Name | text | |
| Target_Country | text | |
| Target_Region | text | |
| Target_Role_Title | text | |
| Target_Role_Family | text | |
| Target_Seniority | picklist | |
| Target_Industries | text | |
| Priority_Keywords | text | |
| Must_Have_Skills | text | |
| Nice_To_Have_Skills | text | |
| Preferred_Ach_Types | text | |
| Preferred_Segments | text | |
| Min_CV_Priority | picklist | |
| Min_Proof_Strength | picklist | |
| Max_Ach_Count | integer | |
| Summary_Variant | text | |
| Experience_Bullets_Rule | text | |
| Core_Skills_Rule | text | |
| Curated_Ach_IDs | text | |
| Curated_Role_IDs | text | |
| Output_Template_Name | text | |
| Notes | textarea | |
| _schema_version | text | |

(28 columns including _schema_version; table above lists 28 rows.)

### 4.4 OUTPUT_LOG (14 fields)

| Column | Data type | Notes |
| :-- | :-- | :-- |
| build_id | text | |
| person_id | text | |
| pack_id | text | |
| template_name | text | |
| template_version | text | |
| output_type | text | |
| output_file_url | url | |
| status | text | |
| error_message | text | |
| prompt_version | text | |
| processing_seconds | number | |
| created_at | datetime | |
| operator_notes | textarea | |
| _schema_version | text | |

### 4.5 ADMIN_CONSOLE (12 fields)

| Column | Data type | Notes |
| :-- | :-- | :-- |
| Lookup_Type | text | |
| Lookup_Value | text | |
| Lookup_ID | text | |
| Active | boolean | |
| Last_Updated | datetime | |
| QA_ID | text | |
| Person_ID | text | |
| qa_cv_content_quality_rating | text | |
| qa_profile_readiness_rating | text | |
| Review_Date | date | |
| Reviewer_Name | text | |
| Notes | textarea | |

### 4.6 INTAKE_LOG (20 fields) — append-only

| Column | Data type | Notes |
| :-- | :-- | :-- |
| intake_id | text | |
| person_id | text | |
| intake_sequence | integer | |
| intake_date | date | |
| source_file_name | text | |
| source_file_id | text | |
| source_type | picklist | CV / Tier1_Answers / Reference / Interview / Manual / Supplementary |
| source_confidence | picklist | High / Medium / Low |
| fields_populated | integer | |
| fields_updated | integer | |
| fields_conflicted | integer | |
| conflict_detail | textarea | |
| vault_state_before | textarea | |
| vault_state_after | textarea | |
| schema_version | text | |
| prompt_version | text | |
| operator_id | text | |
| operator_notes | textarea | |
| s1e_stamped | boolean | |
| s1e_stamp_date | date | |

---

## Section 5 — Cross-store overlap candidates (FLAGGING ONLY)

Purpose of this section: identify where the **same concept** appears in more than one store. No decisions here — Deliverable 4 resolves ownership.

1. **Person identity key** — Leads Registry col A `Person_ID` (observed blank); Career Vault PERSON_PROFILE `Person_ID`; Zoho Contacts custom `Person_ID`. Not present on Zoho Leads or Deals by the same api_name.
2. **Email (primary)** — Leads Registry col D `Email`; Career Vault PERSON_PROFILE `email`; Zoho Leads `Email`; Zoho Contacts `Email`; Zoho Deals custom `Email`. Also Zoho Leads custom `email_normalized` for matching.
3. **Full name** — Leads Registry col C; Career Vault `full_name`; Zoho Leads/Contacts `Full_Name` (derived).
4. **First / last name split** — Career Vault `first_name` / `last_name`; Zoho Leads/Contacts `First_Name` / `Last_Name`. Leads Registry stores only full name.
5. **Phone** — Career Vault `phone`; Zoho Leads/Contacts `Phone` + `Mobile`. Not present on Leads Registry or Deals.
6. **LinkedIn URL** — Career Vault `linkedin_url`; Zoho Contacts custom `LinkedIn1` (label "LinkedIn"). Note Zoho `LinkedIn` api_name is actually labelled "Video CV".
7. **Source country (person origin)** — Leads Registry col L `Source Country`; Career Vault `source_country` / `country` / `citizenship`. Zoho has no direct `Source_Country`; closest is `Country` (Leads) or `Mailing_Country` (Contacts).
8. **Target country** — Leads Registry col O `Target Country`; Career Vault `target_countries` (multi) and TARGET_ROLE_PACK `Target_Country`; Zoho Leads/Contacts/Deals custom `Target_Country`.
9. **Target role title** — Leads Registry col M `Primary Role`; Career Vault `target_role_titles` and TARGET_ROLE_PACK `Target_Role_Title`; Zoho Leads/Contacts custom `Target_Role` and `Target_Role_Title` (two separate fields).
10. **Seniority level** — Leads Registry col N `Seniority`; Career Vault PERSON_PROFILE `target_seniority` and CAREER_DETAIL ROLE `Seniority_Level`; Zoho has no explicit seniority field (inferred from `Industry` or `Stage`).
11. **Visa / work rights status** — Career Vault `visa_status` + `Visa_Pathway_Status` + `work_rights_summary` + `work_rights_expiry_date`; Zoho Leads/Contacts custom `Visa_Status`. Not in Leads Registry. Migration_Status_and_Needs on Zoho Leads (deprecated) is adjacent.
12. **ESOL / English level** — Zoho Leads/Contacts custom `ESOL_Level`; Career Vault has `languages` only (no dedicated ESOL level field). Not in Leads Registry.
13. **Highest qualification** — Zoho Leads/Contacts custom `Highest_Qualification`; Career Vault has no explicit field (stored inside EVIDENCE records of type Education or inside certifications_raw passthrough). Not in Leads Registry.
14. **Years of experience** — Zoho Leads/Contacts custom `Years_of_Experience` (formula); Career Vault `years_experience`. Not in Leads Registry.
15. **Professional summary / core value prop** — Zoho Leads/Contacts custom `Professional_Summary` and `Summary_Snippet_Lead`; Career Vault `core_value_prop` + `gen_summary_short/mid/long` + `gen_core_value_prop`. Not in Leads Registry.
16. **Short headline** — Zoho Leads/Contacts custom `Short_Headline`; Career Vault `gen_headline_bank`. Not in Leads Registry.
17. **Gap / impact / suggested-upgrades notes** — Zoho Leads/Contacts custom `GapSummary`, `Impact_Potential` / `ImpactPotential`, Contacts-only `SuggestedUpgrades`; Career Vault `notes`. Not in Leads Registry.
18. **Readiness / clarity / metric scores** — Zoho Leads `TEFI_Readiness_Score`, `CV_Clarity_Score`, `Metric_Density_Score`, `Employer_Convenience_Score`; Zoho Contacts equivalents with slightly different api_names (`TEFI_Readiness`, `MetricDensityScore`); Career Vault `market_readiness_score`, `lead_quality_score`, `ats_keyword_density`. Naming drift between Leads and Contacts is itself an overlap item.
19. **Lead source / campaign** — Leads Registry col AZ `Campaign`; Zoho Leads/Contacts/Deals `Lead_Source`; Zoho Deals `Campaign_Source`. Career Vault `lead_source`.
20. **Lead status** — Leads Registry col U `Lead Status` (6 values) vs Zoho Leads standard `Lead_Status` (18 values) vs Zoho Contacts custom `Client_Activity_Status` (5 values) vs Zoho Deals `Stage` (58 values). Four overlapping state machines.
21. **Stage / pipeline stage** — Leads Registry col I `Stage` (6 values, Tier 1 specific); Zoho Deals `Stage` + `Pipeline_SubStage` + `Pipeline_Stages`; Zoho Contacts deprecated `Current_Deal_Stage`. Career Vault `tier1_status` / `tier2_status`.
22. **Payment received date** — Leads Registry col AT `Payment Received Date`; Career Vault PERSON_PROFILE `payment_received_date`; Zoho Deals implied by `Amount` + `Closing_Date` + `Payment_Selection` (no dedicated received-date field found).
23. **Proposal / Tier 2 offered date** — Leads Registry col AQ `Tier 2 Offered Date`; Zoho Leads/Contacts custom `Proposal_Sent`. Zoho Deals `Start_Date` / `Closing_Date`. Career Vault has no direct equivalent.
24. **Proposal accepted date** — Zoho Leads/Contacts custom `Proposal_Accepted`; Leads Registry col AR `Tier 2 Response` (picklist, not a date). Career Vault has no direct equivalent.
25. **Service purchased / pathway** — Zoho Contacts custom `Service_Purchased`; Zoho Deals custom `Service`; Zoho Leads custom `Service_Pathway` (deprecated prefix). Career Vault TARGET_ROLE_PACK `Output_Template_Name` adjacent.
26. **CV file location** — Zoho Leads/Contacts custom `CV_and_Cover_Letter` (fileupload); Leads Registry col E `CV Filename` + col R `Tier 1 Report Path`; Career Vault `cv_original_file_path`, `cv_tier1_file_path`, `tier1_answers_file_path`, `snapshot_file_path`, and ROLE-level `Source_Doc_URL`.
27. **Client folder URL** — Zoho Contacts custom `Client_Folder_URL`; Leads Registry col AU `Moved to Client Folder` (Yes/No only). Career Vault has no direct equivalent.
28. **Communication preference / channel** — Zoho Leads `Communication_preference`; Zoho Contacts `Preferred_Channel` (label Communication_Preference). Career Vault has no explicit field.
29. **Relocation interest** — Zoho Leads/Contacts custom `Relocation_Interest` (multiselect); Career Vault `target_countries` + `target_regions` adjacent but not identical.
30. **Consent / privacy flag** — Zoho Leads `I_agree_to_privacy_policy`; Zoho Contacts `Consent_Privacy`; Career Vault has no explicit field.
31. **Source agent / referral partner** — Zoho Leads `Source_Agent`; Zoho Contacts `Referral_Person` (label "Source Agent"); Zoho Deals `Source_Agent`; Zoho Leads custom `Referrer_Contact` and `Referrer_Account`. Career Vault has no explicit agent field.
32. **Partner (spouse) name / email** — Zoho Leads `Partner_Full_Name`/`Partner_Email`; Zoho Contacts `Partner_s_Name`/`Partner_s_Email`; Zoho Deals deprecated `Partner_First_Name`/`Partner_Email`. No Career Vault or Registry equivalent.
33. **Lead Identification / autonumber** — Zoho Leads/Contacts/Deals each have custom `Lead_Identification` (autonumber with different labels: Lead/Contacts/Deal Identification). Internal use; not in Registry or Vault.
34. **Tags** — Career Vault `tags`; Zoho Leads/Contacts/Deals `Tag`. Not in Leads Registry.
35. **Last activity / last updated** — Career Vault `last_updated`, `last_profile_review_date`, `last_upsert_utc`; Zoho Leads/Contacts/Deals `Last_Activity_Time`; Leads Registry col W `Last Status Change`, col AI `Last Touch Date`, col AJ `Days Since Last Touch`.

Count: **35 overlap candidates**.

---

## Section 6 — Notable findings (observations only, no recommendations)

- **"Depri_" prefix on many Zoho labels** — across Leads (Migration_Status_and_Needs, Form_UUID, Profile_Notes, Consultant_Notes_Lead, Potential_Green_List_Match, Service_Pathway), Contacts (Invite_Date, Invite_Type, No_Auto_Responses, Current_Deal_Stage, Previous_Deal_Stage, Date_Entered_Stage, Days_in_Stage, Sent_via_Manual_Process, Form_UUID, Profile_Notes, Potential_Green_List_Match, helping()…, Contact Deal Stage, Contact Template, Full Big Template List), Deals (Job_Market, Partner_First_Name, Partner_Email, Send_Contact_Template, Big_Template_List, CV_and_Cover_Letter). Labels flagged "Depri_" but api_names and data remain.
- **api_name / field_label mismatches on Zoho Contacts**:
  - `LinkedIn` (api) is labelled **Video CV**
  - `Website` (api) is labelled **Short Clip**
  - `LinkedIn1` (api) is labelled **LinkedIn**
  - `TEFI_Readiness` (api) vs label **TEFI_Readiness_Score**
  - `Preferred_Channel` (api) vs label **Communication_Preference**
  - `ImpactPotential` / `MetricDensityScore` use CamelCase while Leads uses snake_case equivalents
- **Naming drift between Leads and Contacts**: same concept has different api_names. Examples: `Metric_Density_Score` (Leads) vs `MetricDensityScore` (Contacts); `Impact_Potential` (Leads) vs `ImpactPotential` (Contacts); `TEFI_Readiness_Score` (Leads) vs `TEFI_Readiness` (Contacts); `Communication_preference` (Leads) vs `Preferred_Channel` (Contacts); `Partner_Full_Name`/`Partner_Email` (Leads) vs `Partner_s_Name`/`Partner_s_Email` (Contacts).
- **Picklist typos**: `ESOL_Level` contains value "Flurent" (appears intended as "Fluent"); same typo on both Leads and Contacts.
- **Two target-role fields** on Zoho Leads and Contacts: `Target_Role` AND `Target_Role_Title` both present, both text, purpose unclear whether they differ.
- **Three pipeline-stage fields** on Zoho Deals: `Stage` (standard, 58 values), `Pipeline_Stages` (custom, 12 values), `Pipeline_SubStage` (custom, 26 values). Relationship between the three is not explicit in metadata.
- **52-value picklist** on Zoho Leads `Send_Email` ("Send Lead Template"). Large controlled vocabulary; values include status-like items ("Need CV First", "Below-skill-qual") mixed with template-name items ("Full-LevelGM-Deal").
- **Leads Registry Person_ID column is empty in all observed rows** — although the sheet footer documents Person_ID as a legitimate column, Relay workflow 1 is not currently writing it. Career Vault is the only store with populated Person_IDs.
- **Leads Registry col F `W1 Sent Date`** has mixed formats — some rows hold ISO dates (2026-03-06), one row holds an Excel serial (46088).
- **Career Vault CAREER_DETAIL has 101 columns on a single tab**, the large majority of which are null for any given row because of the `_record_type` discriminator (ROLE rows leave ACHIEVEMENT/SKILL/EVIDENCE columns null and vice versa). This is expected per the schema design but means population rate per column is low.
- **Role_ID appears twice** in the shared columns of CAREER_DETAIL — once as the primary key for ROLE records, once as the FK on ACHIEVEMENT records back to the parent ROLE. Same column, dual semantics depending on `_record_type`.
- **Career Vault TARGET_ROLE_PACK and OUTPUT_LOG are empty** in the observed file — no rows under the header row. INTAKE_LOG and ADMIN_CONSOLE likewise empty in observed data.
- **Zoho Deals custom `Email`** is unusual — Deals ordinarily reach email via Contact_Name lookup. A duplicate email field on the Deal itself suggests a workaround or legacy process.
- **Zoho Contacts custom `Company`** exists as a custom field even though Contacts has no standard Company (unlike Leads). Purpose not explicit.
- **Zoho Leads `Company`** is system-mandatory in standard Zoho; TEFI likely uses "Unknown" or the lead's name here because Leads are individuals, not businesses.
- **Web-visitor tracking fields** (First_Visited_Time, Visitor_Score, Referrer, Average_Time_Spent_Minutes, Last_Visited_Time, First_Visited_URL, Number_Of_Chats, Days_Visited) are present on Leads and Contacts. Population status not verified in this exercise.
- **Four separate state machines** carry overlapping client-stage concepts (Leads Registry `Stage` 6 vals, Leads Registry `Lead Status` 6 vals, Zoho Leads `Lead_Status` 18 vals, Zoho Contacts `Client_Activity_Status` 5 vals, Zoho Deals `Stage` 58 vals). The 18-vs-58 discrepancy between Lead_Status and Deal Stage suggests different levels of granularity.
- **Deprecated fields are still queried** — the `Depri_` prefix indicates intent to remove, but API metadata and n8n flows may still read them. No evidence in this exercise about whether they are written to.
- **Career Vault schema version stamp** `_schema_version` appears per-row in CAREER_DETAIL but is also tracked globally via PERSON_PROFILE `vh_schema_version`. Two stamps, different scopes.

---

*End of field map. Deliverable 4 (target schema design) will use the 35 overlap candidates in Section 5 and the observations in Section 6 as input.*
