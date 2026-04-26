# TEFI_Tier1_Nudge_Email_Logic.md
### Version: 1.0 | Last updated: 2026-03-26 | Owner: Tate — TEFI
> **AUTOMATION STATUS: DESIGNED-NOT-BUILT** — Nudge logic defined. Not yet triggered automatically. Manual sending only.

---

## PURPOSE OF THIS FILE

This document specifies the **automated nudge email sequence** triggered when a client does not reply to the initial Tier 1 questionnaire email (Draft #1) within a set timeline.

Three automated touchpoints keep the client engaged, provide social proof, and ultimately move dormant profiles to "Paused" status if no response after 40 days.

---

## TRIGGER & TIMELINE

**Trigger:** Client receives Draft #1 (Action Prompt questionnaire email) but does not reply

```
DAY 0:   Client receives Draft #1 questionnaire email
DAY 3:   Nudge #1 sent (Light reminder)
DAY 10:  Nudge #2 sent (Encouraging with proof examples)
DAY 40:  Auto-pause (Client moved to "Paused - Awaiting Response" status)
```

---

## NUDGE #1: DAY 3 (Light Reminder)

**Purpose:** Gentle reminder. Assume client is busy, not disinterested.

**Subject line:** Quick reminder: Your CV analysis is waiting

**Tone:** Light, warm, not pushy. Assume they forgot or are busy.

**Length:** 1–2 paragraphs (100–150 words)

**Structure:**
1. Quick check-in (brief, warm)
2. Reaffirm value ("I've already started your analysis")
3. Easy next step ("Reply with whatever detail you have")
4. Signature

**Example structure:**
```
Hi [FirstName],

Just checking in — did you get my previous email with the questions
about your experience? No rush, but I'd love to hear back so I can
finish your analysis.

I've already started reviewing your CV, and there's real opportunity here.
The more you can share, the clearer your migration path becomes. Even
partial answers are genuinely useful.

Reply whenever works for you.

Best regards,
Tate
```

**Key rules:**
- No guilt language ("you haven't replied yet")
- No urgency language ("limited time," "only this week")
- No assumptions ("I know you're busy")
- Warm and direct only

---

## NUDGE #2: DAY 10 (Encouraging with Proof)

**Purpose:** Demonstrate impact with real example. Show what's possible.

**Subject line:** Here's what a great Tier 1 upgrade can look like

**Tone:** Inspiring. Show concrete proof of what a CV upgrade can achieve.

**Length:** 2–3 paragraphs (250–350 words)

**Structure:**
1. Warm opening (you're invested in their success)
2. **Real example** (show an anonymized case study of CV transformation)
   - Original CV → what was thin
   - Upgraded CV → what changed
   - What it meant for that candidate
3. Why their profile matters (specific to them)
4. Easy re-engagement ("Just reply with your answers")
5. Signature

**Example structure:**
```
Hi [FirstName],

I wanted to share something with you because I think it matters for
your situation.

Last month, I worked with a candidate in a similar healthcare role —
strong experience, clear career progression, but the CV didn't tell the
full story of their impact. After just a brief conversation, we upgraded
their CV to show their team leadership, specific outcomes, and scope of
responsibility. The new version made a massive difference in how
employers saw them.

[Include concrete before/after example showing transformation]

Your profile has the same potential. Your CV shows you've progressed
from [role] to [role], but what it doesn't yet show is the depth of
what you've owned, the outcomes you've driven, and why that matters
to employers in New Zealand.

The questions I asked you are specifically designed to uncover that.
And once I have those details, we can reshape your CV in a way that
actually reflects your capability.

Just reply to my earlier email with whatever answers you can give.
Even partial responses move us forward.

Best regards,
Tate
```

**Key rules:**
- Real example (can be anonymized)
- Show before/after concrete change
- Connect directly to their situation
- Emphasize potential, not pressure
- No guilt or urgency
- Focus on what's possible

---

## AUTO-PAUSE: DAY 40 (No Reply After 40 Days)

**Trigger:** Client has not replied after 40 days from initial questionnaire email

**Automatic Action:**
1. Client status changes to: **"Paused - Awaiting Response"**
2. Final email sent (below)
3. Profile removed from active pipeline
4. Stored for future re-engagement (if they reply later)

**Final Email: Day 40 Pause Notification**

**Subject line:** We're pausing your profile — easy to restart

**Tone:** Warm, understanding, leave door open.

**Length:** 1–2 paragraphs (120–180 words)

**Structure:**
1. Acknowledge pause (no judgment)
2. Explain why ("We're parking this for now")
3. Reaffirm value ("Your profile has real potential")
4. Open door for restart ("Just reply whenever you're ready")
5. Signature

**Example:**
```
Hi [FirstName],

I'm pausing your Career Migration Analysis for now. We haven't heard
back on the questions yet, so I'm giving you space to focus on whatever
you're working on.

Your profile has genuine potential, and I haven't forgotten about it.
Whenever you're ready to move forward — whether that's next week, next
month, or down the track — just reply to any of my emails and we'll
pick up right where we left off. No pressure, no time limit.

Looking forward to working together whenever the timing is right.

Best regards,
Tate
```

**Key rules:**
- No judgment language
- No guilt ("you haven't responded")
- Warm and understanding
- Clear that door remains open
- No pressure to respond immediately

---

## IMPLEMENTATION NOTES

**Google Sheet Tracking:**
```
Client Status          | Nudge #1 Sent Date | Nudge #2 Sent Date | Auto-Pause Date
Active - Replied       | [date]             | [not sent]         | [not paused]
Active - Awaiting      | [date]             | [date]             | [date pending]
Paused - No Reply      | [date]             | [date]             | [date paused]
```

**Automation:**
- Nudge #1: Trigger 3 days after Draft #1 sent
- Nudge #2: Trigger 10 days after Draft #1 sent
- Auto-pause: Trigger 40 days after Draft #1 sent
- If client replies at any point, cancel remaining nudges + update status to "Active - Replied"

**Prompt Files Needed:**
- `TEFI_Tier1_Nudge_01_Light_Reminder.md` (to be created)
- `TEFI_Tier1_Nudge_02_Proof_Example.md` (to be created)

---

*TEFI_Tier1_Nudge_Email_Logic.md | Tate's Employment for Immigration*


---

*© 2026 Tate Ulsaker / Tate's Employment for Immigration. All rights reserved. Confidential and proprietary — do not reproduce or share without written permission.*