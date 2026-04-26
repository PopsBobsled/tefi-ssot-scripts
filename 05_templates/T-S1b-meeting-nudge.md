---
template_id: T-S1b
stage: S1b
name: meeting-nudge
subject: "Re: Your Career Migration Report — next steps"
owner: Haiku
static_ratio: 100%
trigger: T-S1 sent, no reply after 3 days. Haiku fires this automatically as part of the daily 3-day follow-up check.
tags: [nudge, follow-up, meeting, tier1, lead, pipeline]
dynamic_fields: [first_name]
model_notes: Fully static. Haiku fills first_name only. No elaboration, no additional context. The warmth is in the brevity — see TEFI_Voice_Reference.md Pattern A and Pattern C. Draft only — Tate reviews before sending.
status: Draft — no real sent example yet. Approved 2026-04-21.
---

Hi {{first_name}},

I know things get busy — just checking in on my previous message.

I am happy to work around your schedule completely. Even a short 20-minute conversation can open up quite a lot in terms of what is possible for your career here.

The booking link is still open whenever you are ready:
https://calendly.com/tates_employment/chat-with-tate

Kind regards,
Tate
