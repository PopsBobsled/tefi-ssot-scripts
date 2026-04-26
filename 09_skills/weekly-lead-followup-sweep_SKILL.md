---
name: weekly-lead-followup-sweep
description: Sunday 08:00 NZT — weekly sweep for unresponsive leads. 4-step validation (same-thread reply + broader from: search + Calendly booking + calendar event). Drafts personalised nudges in Gmail Drafts for Tate's review. Never auto-sends.
---

Weekly Sunday lead-followup sweep — draft nudges for unresponsive leads.

# Architecture context
- Today's data source: Gmail labels + Gmail thread state + Gmail from: search + Calendly notification emails + Google Calendar events (no Sheets dependency).
- Post-22-May-2026 cut-over: swap Gmail-based detection for Zoho-query (Lead.Lead_Status filter + Stalled_Days BETWEEN 4 AND 10 + check no Activity record after stage change). Same logic, different source.
- Gmail MCP is read-only for label writes and sends per CLAUDE.md 2026-04-22. `create_draft` is allowed (drafts go to review, not sent).

# Scope of this run (recurring weekly)
Scan Gmail for threads matching either of two labels, where the most recent outbound from Tate was sent **4 to 10 days ago** (NZT, inclusive). The 4-day floor (skip anything sent within the most recent 0–3 days) means the daily 3-day Haiku check has had a fair shot first; this Sunday sweep is the second pass.

Two labels to scan:
1. `TEFI/Leads/Pipeline/CV Upgrade T1 Sent` — CV Questions sent, no answers received
2. `TEFI/Leads/Pipeline/Meeting Invited` — Meeting invitation sent, no booking

Window math: most recent outbound from Tate is in the date range [today − 10 days, today − 4 days], inclusive. That's exactly 7 days of solid coverage. Adjacent Sunday runs cover the surrounding weeks with no overlap and no gap.

# Improved validation — 4-step check (each thread must pass ALL four)

Before drafting a nudge for a candidate thread, run all four checks. If any returns a positive signal that the lead has engaged or a meeting exists, **EXCLUDE** the thread.

**Check 1 — Same-thread inbound reply.** Use `get_thread` to inspect the thread's message history. If any message after Tate's most recent outbound came FROM the lead's email, the lead has replied — exclude.

**Check 2 — Broader inbound from lead's email.** Run `search_threads` with query `from:<lead_email> after:<labelled_send_date_minus_2_days>`. If ANY thread (same subject or different) shows a reply from the lead since the labelled send, the lead has engaged elsewhere — exclude.

**Check 3 — Calendly booking confirmation.** Run `search_threads` with query `from:calendly.com <lead_first_name OR lead_last_name> after:<labelled_send_date>`. If any Calendly notification email exists referencing this lead, a booking happened — exclude.

**Check 4 — Calendar event with lead.** Use the calendar `list_events` tool with `fullText:<lead_first_name>` (or last name if first name is too generic) and time range covering the past 30 days through future 90 days. If any event has the lead's email as an attendee (or summary contains lead's name), a meeting is scheduled or has occurred — exclude.

A thread passes only if all four checks come back clean.

# Two-tier nudge logic (applies to both labels)

**Days 4–6 (1st nudge):** Use the "reminder" template — T-NUDGE-1A (CV Questions) or T-NUDGE-2A (Meeting Invited).

**Days 7–10 ("gift" pivot):** Use the "gift" template — T-NUDGE-1B or T-NUDGE-2B. Pivots to "I've already looked at your CV and have observations specifically about its positioning for the New Zealand market; let me share them with you, no obligation."

# Templates (4 nudge variants)

## T-NUDGE-1A — CV Questions reminder (4–6 days)

Subject: Re: <original thread subject>

Hi {First Name},

I wanted to check in. I sent through 6 short questions for your Tier 1 Career Migration Report and want to make sure they reached you; sometimes these end up in a Promotions tab or get buried.

Whenever you have 15 minutes to send your answers across, I'll get straight to building your Report. No pressure on timing; I know how full life gets when you're planning a move.

Warm regards,
Tate

## T-NUDGE-1B — CV Questions "gift" pivot (7–10 days)

Subject: Re: <original thread subject>

Hi {First Name},

I haven't seen your answers come back yet, and I know that 6 thoughtful questions takes more time than most weeks allow. Let me offer a different path.

I've taken a quick look at the CV you sent through and have a few observations specifically about how it positions for the New Zealand market; I'd like to share these with you. Think of it as a gift; no obligation, no commitment.

Would you like to meet briefly so I can walk you through what I've spotted? The consultation is free, and you'll leave with concrete suggestions you can apply right away. Pick a time in your local zone here: https://calendly.com/tates_employment/chat-with-tate

(Keep the selection in your local time zone so Calendly aligns our times.)

Warm regards,
Tate

## T-NUDGE-2A — Meeting Invited reminder (4–6 days)

Subject: Re: <original thread subject>

Hi {First Name},

A quick check-in on the meeting invitation I sent across. I can imagine how your calendar gets full with work and migration goals ongoing. Your responses have helped add value to your report, and I would like to empower your goals and strategies in person whenever you have a chance.

Whenever it suits, just pick a time in your local time zone and Calendly will sync to mine: https://calendly.com/tates_employment/chat-with-tate

The initial consultation is free.

Warm regards,
Tate

## T-NUDGE-2B — Meeting Invited "gift" pivot (7–10 days)

Subject: Re: <original thread subject>

Hi {First Name},

I haven't heard back on the meeting invite I sent through; completely understand if life has been busy.

In the meantime, I've put together a few thoughts on your CV's positioning for the New Zealand market; something I think you'll find genuinely useful. Consider it a gift; no obligation either way.

If you can find 30 minutes in your week, I'd like to walk you through it. Pick any time in your local zone: https://calendly.com/tates_employment/chat-with-tate

Warm regards,
Tate

# Run history / lessons learned

- 2026-04-26 (one-off catch-all run, 4–60 day window): caught 4 false positives via the upgraded validation that the original same-thread-only check missed. Stella Surya replied in a different-subject thread (referral intro). Rene Macalintal had a calendar event from a prior Calendly booking. Phathisa Sibanda had both a Calendly booking confirmation email AND a calendar event for the upcoming meeting. The 4-step validation now catches all three patterns. 4 drafts created (Nigel, Lorraine: T-NUDGE-1B; Muhammed, Fidel: T-NUDGE-2A).
