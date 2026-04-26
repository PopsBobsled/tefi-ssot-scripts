---
template_id: T-T3
stage: T3
name: testimonial-thank-you
subject: "Re: Testimonial Approval Request — {{first_name}}"
owner: Haiku
static_ratio: 100%
trigger: Candidate replies approving the testimonial (with or without conditions). Haiku detects the inbound approval reply per TEFI_Gmail_Label_Key.md inbound triggers table and queues this draft.
tags: [testimonial, approved, thank-you, next-step, calendly]
dynamic_fields: [first_name]
model_notes: Fully static. Haiku fills first_name only. Do not add any reference to their conditions or quote — this is purely the thank-you and next-step. The Calendly note is essential and must not be removed. **Naming convention reminder (per Brand Foundation §9 rule 6, 2026-04-25):** by the time this fires, naming has been agreed in the T-T1 round-trip. Before sending, Sonnet/Haiku must record the agreed Display Name and any Approval Notes (e.g. "initials only, no photo") in `~TEFI/Marketing/Testimonials_CMSnapshot.xlsx` — that file is the SSOT. See TEFI_Voice_Reference.md Pattern A and Pattern C. Draft only — Tate reviews before sending.
---

Hi {{first_name}},

That is great news about the testimonial. I will use it soon.

For the next step, we can discuss the report findings in more detail and your next steps in the job search. You can book a convenient time here:
https://calendly.com/tates_employment/chat-with-tate
(Schedule in your time zone so that Calendly assigns your time to you and my time to me.)

Best regards,
Tate
