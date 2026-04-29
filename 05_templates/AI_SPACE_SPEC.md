# AI Space Specification
## TEFI Email Template System

**Version:** v1.0  
**Created:** 2026-04-28  
**Owner:** Tate Ulsaker  
**Location:** `07-Templates/AI_SPACE_SPEC.md`

---

## Purpose

This file defines every named AI space used across TEFI email templates. When a template header includes an `AI space:` field referencing one of these types, this spec is the source of truth for what the AI should generate, what it may draw from, and what it must never do.

---

## Review policy

**All AI-generated content is reviewed by Tate before send.** No template with an active AI space is auto-sent. Tate reads and approves the generated paragraph before the email is dispatched. This applies without exception until a template family has been validated across at least 10 sends with consistent output quality.

---

## General rules (apply to all AI space types)

1. **No invented facts.** If the source data doesn't contain it, don't write it.
2. **No superlatives.** "Amazing", "incredible", "world-class" — none of these.
3. **No urgency language.** No "act now", "don't miss", "limited time."
4. **No presumptive assumptions.** Don't assume the client is struggling, succeeding, or feeling any particular way unless the source data says so.
5. **One idea per sentence.** Short sentences. Tate's voice is direct and low-key.
6. **No em-dashes in body text.** Use a comma or a full stop instead.
7. **Match the sign-off energy of the template.** If the template closes "Kind regards", the AI paragraph should not be warmer than that.
8. **Never reference internal TEFI process labels.** Don't write "your Vault Maturity Score is 3" or "you are at Stage 5." Translate to plain human language.

---

## Named AI space types

---

### `{{SessionReview}}`

**Purpose:** A personalised 2–4 sentence reflection on what happened in a live session with the client. Appears immediately after the greeting. Sets a specific, affirming tone before the static body content.

**Where used:** S5b_AfterJobFindingDemo (currently only active instance)

**Source data:**
- Grain session transcript (primary) — keywords, employer reactions, specific moments
- Tate's post-session notes (secondary) — if Grain unavailable

**Length:** 2–4 sentences

**Tone:** Warm, specific, concrete. Like a coach noting what they observed, not what they felt about it.

**Focus:** What the client actually did well — a targeting choice, how they handled a response, the moment something clicked, their confidence on a particular call. One or two specific observations, not a general "great session" summary.

**Hard prohibitions:**
- Do not reference anything that didn't happen
- Do not describe the client's emotional state unless they expressed it on the call
- Do not write "you did amazing" or similar — be specific instead
- Do not summarise the whole session — pick the most memorable positive moment

**Example output:**
> You chose a strong mix of employers today — the direct-hire companies alongside the larger firms gave us useful contrast early. The call with the logistics manager was a good example of what a brief, confident opener sounds like when it lands.

---

### `{{PersonalisedContext}}`

**Purpose:** A 2–3 sentence paragraph that makes a generic seasonal or promotional send feel relevant to the specific client. Slots into a defined position in the template (confirm per template). Connects the general message to where this person is in their journey.

**Where used:** Candidate — Promo_PostHolidayHiringPeak v2, future seasonal family (07f)

**Source data (in priority order):**
- `Contacts.Target_Country` — which market they're targeting
- `Contacts.Target_Sector` — their professional field
- `Contacts.Vault_Maturity_Score` — their preparation stage (translate: low = early, high = ready to launch)
- `Contacts.Communication_Tone_Preference` — formal vs. conversational (adjust register only, not content)

**Length:** 2–3 sentences

**Tone:** Warm, low-key, relevant. Like Tate has glanced at their file before writing.

**Focus:** Connect the seasonal/promotional message to this person's specific country and sector. If they're NZ-targeted in construction, the post-holiday hiring peak in construction is different from IT. If their Vault score is low, acknowledge they may still be preparing — don't push them to launch if they're not ready.

**Hard prohibitions:**
- Do not make specific claims about job market conditions without factual basis (e.g., "hiring is up 20% in your sector")
- Do not reference the Vault Maturity Score by name or number
- Do not reference deal stage labels
- Do not invent sector-specific data

**Example output (NZ, Engineering, mid-preparation):**
> Engineering roles in New Zealand tend to pick up steadily from late January through March, particularly in infrastructure and civil. If you're still finalising your profile materials, this window gives you a few weeks before the peak hiring activity accelerates.

---

### `{{StageNudge}}`

**Purpose:** A 1–2 sentence addition that gently acknowledges where the client is in their journey without naming it directly. Used in coaching touchpoint emails to make a generic check-in feel personally calibrated.

**Where used:** Candidate — Nudge_HowGoesJobSearch v2, Nudge_UpdateJobFindingExperience v2

**Source data (in priority order):**
- `Deals.Stage` — current pipeline stage (translate to human description — never use stage code)
- `Contacts.Vault_Maturity_Score` — preparation completeness
- `Stalled_Days` — if populated, indicates duration of inactivity (use with care — do not reference directly)

**Length:** 1–2 sentences only. This is a subtle addition, not a paragraph.

**Tone:** Gentle, non-presumptuous. Lowers the barrier to reply. Does not name the stall. Does not suggest the client is struggling.

**Focus:** Acknowledge the stage in plain language. If they're mid-job-search, say something that reflects that. If they're earlier in preparation, reflect that instead. The goal is that the client feels the email was written with their situation in mind, not blasted to a list.

**Hard prohibitions:**
- Do not reference Stalled_Days directly ("you haven't replied in 14 days")
- Do not use urgency ("you need to act now")
- Do not reference deal stage codes or labels
- Do not assume the client is stuck — they may be busy, or may have already found work
- Maximum 2 sentences — this type must stay subtle

**Example output (client in active job search, 3 weeks since last contact):**
> A few weeks into outreach is often the point where the rhythm either settles in or starts to feel uneven.

---

### `{{ClientContextBridge}}`

**Purpose:** 1–2 sentences that acknowledge what the client specifically mentioned in a prior interaction, then bridge to the email's response. Makes a diagnostic or support email feel like a direct reply to a real conversation rather than a broadcast.

**Where used:** S6a_EmployerResponses_NeedStatistics (active)

**Source data (in priority order):**
- `Deal.Stage_Semantic_Notes` — Tate's notes on what the client said or what was observed
- Grain session transcript — specific language the client used
- Prior email reply content — if the client's words were captured

**Length:** 1–2 sentences only. This is a bridge, not a paragraph.

**Tone:** Empathetic but practical. Acknowledges the challenge without dwelling on it. Moves quickly toward action.

**Focus:** Reference something the client actually said or experienced — a specific challenge, a frustration, a pattern observed. Then pivot: "To begin, we need to..." or similar forward-looking close.

**Hard prohibitions:**
- Do not generate this if no real client context is available — leave the slot blank and use the static fallback rather than fabricating an acknowledgement
- Do not over-empathise ("I'm so sorry you're struggling") — keep it matter-of-fact
- Do not name specific employers or people unless confirmed in source data
- Maximum 2 sentences — must stay tight

**Example output (client mentioned calls aren't getting responses):**
> You mentioned the calls haven't been generating responses yet, and that's a useful signal — it tells us where to look. To move forward effectively, I'd like to understand the pattern in more detail.

---

## Adding a new AI space type

When a new template requires personalisation not covered by the three types above:

1. Draft a candidate spec here (copy the format above)
2. Mark it `DRAFT — not yet validated`
3. Generate 3 example outputs manually and review with Tate
4. If outputs are consistent and on-voice, promote to `Active`
5. Update the template header to reference the new type

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-28 | v1.0 created. Three types defined: SessionReview (active in S5b), PersonalisedContext (candidate), StageNudge (candidate). Review policy confirmed: Tate reviews all AI content before send. |
