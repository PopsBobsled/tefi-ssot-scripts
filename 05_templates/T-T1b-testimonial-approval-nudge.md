---
template_id: T-T1b
stage: T1b
name: testimonial-approval-nudge
subject: "Re: Testimonial Approval Request — {{first_name}}"
owner: Haiku
static_ratio: 100%
trigger: T-T1 sent, no reply after 3 days. Haiku fires this automatically as part of the daily 3-day follow-up check (Part C of leads-folder-workflow skill).
tags: [testimonial, nudge, follow-up, marketing]
dynamic_fields: [first_name]
model_notes: Fully static. Haiku fills first_name only. Keep it exactly as written — the brevity signals respect for the candidate's time. See TEFI_Voice_Reference.md Pattern A and Pattern D. Draft only — Tate reviews before sending.
status: Draft — no real sent example yet. Approved 2026-04-21.
---

Hi {{first_name}},

Just a quick follow-up on my last message — I know things get busy.

If it is easier, a simple "yes, go ahead" or "please make this change first" is all I need. No formality required. If you would also like a different display name (initials only, for example) or no testimonial at all, that is fine too — just say the word.

Kind regards,
Tate
