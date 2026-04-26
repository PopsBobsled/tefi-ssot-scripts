---
template_id: T-S1
stage: S1
name: meeting-invitation
subject: "Re: Your Career Migration Report — next steps"
owner: Haiku
static_ratio: 95%
trigger: Candidate has sent their question-responses and Tate is ready to invite them to a meeting
tags: [meeting, invite, calendly, tier1, lead, pipeline]
dynamic_fields: [first_name]
model_notes: Fully static except first_name. Do not add personalisation, do not reference their CV or role, do not adjust the Calendly note. The email works because of its brevity — see TEFI_Voice_Reference.md Pattern A and Pattern H. Do NOT mention the CM Report — it is offered in the meeting as a relationship-building step, not promised before it.
---

Hi {{first_name}},

Thank you for sending over your CV and your responses; it is a strong profile and you are making it stronger.

As a next step, I suggest we meet to review how the local job market operates and discuss strategies that work effectively for candidates with your background. The initial consultation is free.

To set a time for the meeting, just find a day and a time in your own time zone. It will also link to your calendar if you like:
https://calendly.com/tates_employment/chat-with-tate
(Please ensure you keep the selection in your own time zone so that Calendly can synchronize the correct meeting times for us both.)

I look forward to speaking with you.

Warm regards,
Tate
