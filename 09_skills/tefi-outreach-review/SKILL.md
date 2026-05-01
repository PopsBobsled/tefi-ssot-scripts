---
name: tefi-outreach-review
description: |
  Analyze a TEFI client's direct employer outreach call sheet (Excel/XLSX) and produce a campaign review with dashboard, knowns, unknowns, coaching questions, and progress-since-last-report.

  Use whenever: a call sheet, outreach tracker, job contact log, or employer targeting spreadsheet is uploaded; the user asks for a "review", "analysis", "dashboard", or "how am I doing?" about their job search; any mention of "call sheet", "direct outreach", "employer contacts", "L1 L2 L3", "relationship levels", or "voice calls"; a TEFI client shares Tier 4 or direct engagement progress.

  Produces a visual dashboard (roles targeted, contacts found, L1–L4+ levels, response breakdown, sector/regional analysis, best leads, gaps), auto-appends a snapshot row to the Weekly Tracker tab, maintains a historical registry across reports, and outputs a narrative covering knowns, unknowns, coaching questions, and progress since the last report.
---

# TEFI Direct Outreach Call Sheet Review

Produce a structured campaign review of a client's direct employer outreach activity — the same format used in TEFI's Tier 4 Full programme. This is coaching intelligence, not a corporate audit. Be direct, warm, and specific.

## Read the methodology first

Before writing any narrative or coaching output, read `methodology.md` (in this skill's folder). It defines the four KPIs, sector benchmarks, what counts as a valid response, the follow-up protocol, and the priority action framework. All coaching language, KPI benchmarks, and narrative framing must be grounded in this document. Do not substitute generic career advice for the TEFI methodology.

**Canonical source of truth.** The `methodology.md` in this skill folder is a synced copy of the SSOT: `~TEFI/IP Brain/TEFI_Direct_Engagement_Methodology.md` (v1.0, April 2026). When the SSOT is updated, the skill copy must be re-synced — they are kept byte-identical. If the two diverge, the IP Brain version wins.

**What the methodology governs in this skill:**
- The four KPIs and their formulas (Conversation Rate, Positive Rate, Follow-Through Rate, Connected Calls / 5 Days) — see methodology §"The Four KPIs"
- Sector-specific Positive Rate benchmarks (Teaching ≈ 10/10, Civil Eng & Trades ≈ 8/10, NFP variable, Government redirects, Health mixed) — see §"On the Positive Rate"
- The definition of a valid response (verbal in-call, email next-day, email two-weeks-later — all valid; redirects valid) — see §"What Counts as a Response"
- The 6-step Priority Action Framework (No Voice Yet → Records Incomplete → Responses Without Applications → Conversation Rate Low → Activity Below Threshold → Follow-up Not Deployed) — see §"Priority Action Framework"
- The one-week single-follow-up protocol with give-not-chase tone — see §"The Follow-up Protocol"

When writing the narrative sections (What we know / What we don't know / Questions / Since your last report), every coaching statement should map back to a specific section of the methodology. The Priority Action Framework in particular determines what the most urgent coaching prompt should be in any given report.

---

## What you'll produce

1. A visual dashboard widget (using `show_widget`) — includes a "Report date: [analysis_date]" line
2. A narrative addressed to the client covering:
   - **What we know** — confirmed facts from the data
   - **What we don't know yet** — gaps and missing information
   - **Questions for [client name]** — specific, numbered questions grounded in data points
   - **Since your last report, [Name]** — *only if a previous snapshot exists* — describes what changed and offers encouragement or a gentle prompt

The Weekly Tracker tab inside the workbook is now auto-updated by the script — a new dated row is appended every time the skill runs, so Tab 2 builds itself into a history log over time.

---

## Step 1 — Read the file

Run `scripts/analyze_callsheet.py` using the bash tool. Pass the uploaded file path AND a `--registry` path so historical comparison works.

```bash
python3 /path/to/scripts/analyze_callsheet.py "/path/to/callsheet.xlsx" \
  --registry "/path/to/same-folder/tefi-registry.json"
```

**Registry path rules:**
- Prefer a file called `tefi-registry.json` in the same directory as the call sheet (so each client folder accumulates its own history).
- If that directory isn't writable (e.g. read-only attachment), fall back to `/tmp/tefi-registry.json`.
- The script handles a missing or empty registry file gracefully — it will create one on first run.

The script returns a JSON object with all computed metrics, including:
- `analysis_date` — today's date in ISO form (e.g. `2026-04-29`)
- `tracker_row_written` — `true` if a snapshot row was successfully appended to the workbook's Weekly Tracker sheet, `false` if the sheet was missing or the write failed
- `previous_snapshot` — the prior registry entry for this client, or `null` on first run
- `delta` — `delta_roles`, `delta_contacts`, `delta_emails_sent`, `delta_voice_calls`, `delta_responses`, `delta_weighted_l` (current minus previous), or `null` on first run
- All the existing metrics (`total_roles`, `contact_known`, `l_counts`, `weighted_avg_l`, `best_lead`, etc.)

If the script isn't found or fails, fall back to reading the file with pandas directly — the standard TEFI call sheet has this column layout (header row is row 2, data starts row 3):

| Col | Field |
|-----|-------|
| A | Job link URL |
| B | Advertised position title |
| C | Employer company name |
| D | Type of company / sector |
| E | Location / city |
| F | Contact person name |
| G | Title of contact person |
| H | Phone |
| I | Email |
| J | Website |
| K | Voice call made (Y/N) |
| L | Email / outreach date |
| M | Follow-up date |
| N | Update comments / results |
| O | Company interested? (Yes/No/Maybe) |

---

## Step 2 — Classify responses

Parse column N (comments) for each row. Assign one classification per row using the first match. Classifications below align with the methodology's §"What Counts as a Response" — every classification except `no_response` is a valid response in TEFI terms (positive, negative-acknowledged, pending, or redirect).

| Classification | Keywords / patterns | Methodology mapping |
|---|---|---|
| `visa_block` | visa, sponsorship, right to work, residency, citizen, overseas, accredited employer, work rights | Acknowledged negative — records market intelligence |
| `phone_attempt` | voicemail, voice mail, voice note, not going through, call not going, went to voicemail, left a message | Not a connected call — excluded from KPI denominators |
| `positive` | well-received, please apply, send in your email, attach the position description (positive tone), warm reply | Positive response — application follows immediately |
| `overqualified` | overqualified, ovequalified, intermediate role, local applications, 200 applicants | Acknowledged negative |
| `security_clearance` | clearance | Acknowledged negative — structural sector constraint |
| `acknowledged` | received your application, recruitment personnel, reviewing your application (no rejection language) | Pending response |
| `redirected` | apply online, apply through seek, apply via, recruitment portal, apply on our website | Valid redirect — follow instruction and note it |
| `follow_up_pending` | back on Monday, will be back, following up | Pending response — 1-week follow-up triggers if no further contact |
| `no_response` | blank, whitespace only, or nan | Not a response |

---

## Step 3 — Derive relationship levels

Assign each row an L-level:

- **L1** — no meaningful employer response; may have applied but no reply or comment
- **L2** — email exchange occurred (has a substantive comment that is not just a voicemail note)
- **L3** — phone attempted (voicemail / call not connecting noted in comments)
- **L3b** — confirmed live voice conversation (col K = Y AND comment suggests actual conversation) — methodology §"The Founding Principle": **this is the starting line, not a step in a funnel**
- **L4+** — interview, video call, or face-to-face referenced in comments

Weighted avg = (L1×1 + L2×2 + L3×2.5 + L3b×3 + L4×4) / total rows

---

## Step 4 — Normalise sectors and regions

**Sector groups** — map col D to one of:
- NFP / Charity: charity, nfp, not for profit, not-for-profit, ngo, volunteer
- Government / Ministry: ministry, government, defence, local authority, council
- Health: health, te whatu ora, hospital
- University: university
- International Org: international
- Other / Unknown: anything else or blank

**Region groups** — map col E to one of:
- Auckland (includes greenlane, north shore, mt eden, etc.)
- Wellington
- Christchurch (any casing)
- Hamilton, Dunedin, Gisborne, etc. → match by city name
- Top of South Island: tasman, richmond, golden bay, nelson
- Remote / Flexible: "work from anywhere", "remote", "flexible"
- Unknown: blank, or a URL accidentally entered in the location field

When commenting on sector performance in the narrative, apply the methodology benchmarks from §"On the Positive Rate" — e.g. a low Positive Rate in NFP is not a coaching failure, it's a structural sector signal.

---

## Step 5 — Identify lead highlights

Scan the data for these four insight cards. The first three map to Priority Framework items 1–3 (the most urgent coaching prompts):

1. **Best active lead** — a row with a positive/engaged response, no visa block, contact person known, follow-up still possible
2. **Highest-potential untouched** — contact person AND phone found, but no email sent or follow-up date recorded; bonus if it's a senior role. *Methodology Priority #1: "No voice yet — start calling."*
3. **Warm signal needing action** — employer engaged positively but no follow-through is recorded (e.g., CEO replied but no application filed). *Methodology Priority #3: "X employers are waiting. Send the applications today." This is the most urgent execution gap.*
4. **Critical gap** — the single most important systemic issue (e.g., zero voice calls confirmed, weekly tracker empty, no follow-up dates set). Pick from Priority Framework 4–6 if no items 1–3 are present.

---

## Step 6 — Render the dashboard widget

Use `show_widget` with an HTML widget. Match this layout:

```
[Header line: "Report date: [analysis_date]"]

[4 stat cards: Roles targeted | Named contacts | Outreach actions | Responses]

[Left col: Relationship level distribution with bar chart (L1–L4+)]
[Right col: Response breakdown with colour-coded counts]

[Sector chips | Region chips]

[2–4 lead/insight cards at bottom]
```

Show `analysis_date` in the dashboard header so the user can see when the report was generated. If `delta` is present, you may also surface a small "since last report" badge in the header (e.g. "+6 roles since 15 Apr").

Colour conventions:
- Visa blocks → red background (`#FCEBEB`, text `#A32D2D`)
- Positive / engaged → green (`#E1F5EE`, text `#0F6E56`)
- Phone attempts / voicemail → amber (`#FAEEDA`, text `#633806`)
- Neutral / no response → secondary background

Include a red alert box below the response breakdown if visa blocks exceed 30% of all responses.

Use CSS variables (`var(--color-background-secondary)`, `var(--color-text-primary)`, etc.) throughout so the widget adapts to light/dark mode.

---

## Step 7 — Write the narrative

After the widget, write the labelled sections below. Address the client by first name if known. Keep the tone coaching — honest about gaps, warm about effort. Every section must trace back to the methodology — see "What the methodology governs in this skill" at the top.

### What we know, [Name]

3–4 sentences summarising what the data confirms: total activity, contact research quality, dominant response pattern, active lead status. Lead with what's working (voice connections made, responses received), not what's missing.

### What we don't know yet

A numbered list of 5–7 specific unknowns derived from gaps in the data. Each item should name the gap and why it matters for campaign strategy. Common unknowns:
- Campaign start date (flow rate can't be calculated without it)
- Weekly tracker status (now auto-populated by the script — flag if `tracker_row_written` is false)
- Whether phone attempts were retried at different times
- Follow-up actions taken on warm leads
- What the client is saying to employers who ask about visa or work rights status
- Whether outreach message has been refined after repeated visa blocks

### Questions for [Name]

5–7 numbered questions in plain language. Each question should:
- Be grounded in a specific data observation ("You have phone numbers for X employers but zero confirmed voice connections…")
- Ask for one specific piece of information
- Feel natural, not interrogative

**Priority order.** When choosing which questions to ask, follow the methodology's Priority Action Framework — the highest-priority unresolved item gets the first question. If "no voice yet" applies, the first question is about why phone calls haven't started, not about email response rate.

### Since your last report, [Name]

**Include this section ONLY when `previous_snapshot` is not null.** If it is null, skip the section entirely (this is the client's first run).

Use the `delta` numbers to describe progress since the prior snapshot date. Cover:

- **What changed numerically** — roles added (`delta_roles`), new named contacts (`delta_contacts`), new emails sent (`delta_emails_sent`), new voice calls confirmed (`delta_voice_calls`), new responses received (`delta_responses`).
- **Whether the weighted L-level improved** — `delta_weighted_l`. Positive means the client moved deeper into employer relationships; zero or negative means the campaign added activity without deepening engagement.
- **Encouragement or gentle prompt** — if any positive delta exists (especially `delta_voice_calls > 0` or `delta_weighted_l > 0`), name it and celebrate it specifically. Methodology principle: voice connection is the starting line — celebrate it. If everything is flat or only `delta_roles` grew, gently flag that adding targets without contacting them won't move the campaign — and suggest one concrete next action (a voice call, a follow-up email on a warm lead).

Reference the previous snapshot's date (`previous_snapshot.date`) so the client knows the comparison window.

---

## Sheet version — v1 legacy vs v2 updated

The script returns `sheet_version: "v1"` or `"v2"`. This affects what the analysis can reliably say.

**v2 (updated template):** Structured dropdowns in columns K–P give clean, unambiguous data. All four KPIs can be calculated precisely. Full coaching guidance applies.

**v1 (legacy template):** Free-text columns. Response classification and L-level assignment rely on keyword pattern matching of column N. KPIs are best-effort approximations. Flag this in the narrative — explain that switching to the v2 template would tighten the numbers.
