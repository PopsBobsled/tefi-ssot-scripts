---
template_id: T-T1
stage: T1
name: testimonial-approval-request
subject: "Testimonial Approval Request — {{first_name}}"
owner: Sonnet
static_ratio: 70%
trigger: Positive testimonial detected in Gmail by weekly scan; Tate approves sending the approval request
tags: [testimonial, approval, marketing, pipeline]
dynamic_fields: [first_name, action_they_described, exact_quote, display_name, display_name_initials, primary_role]
model_notes: |
  Sonnet fills the dynamic fields. Rules:
  - action_they_described: a brief phrase referencing something specific from their reply (e.g. "updating your CV", "sharing it with a colleague"). If nothing specific was mentioned, use the static fallback below.
  - exact_quote: verbatim from their email — never paraphrase, never improve, never trim mid-sentence. Include full sentence(s).
  - display_name: **DEFAULT is "First Name + LN initial"** (e.g. "Collins M.", "Tendai M."). Use initials-only or any other variant only if a previous candidate instruction has been recorded in `~TEFI/Marketing/Testimonials_CMSnapshot.xlsx` Approval Notes column. The candidate sees the rendered name in the body of this email and can request a change in one reply — that is by design (per Brand Foundation §9 rule 6, 2026-04-25). No photos used unless candidate explicitly approves.
  - primary_role: from the Tier1 Registry (Questions sheet). If not found, infer from the email thread and mark "(inferred)".
  Read TEFI_Voice_Reference.md Pattern C and Pattern E before drafting.

static_fallback_for_action: "The kind of feedback you shared tells me the report landed the way it was intended to."
---

Hi {{first_name}},

Thank you for the effort you put into your questionnaire responses and for your positive feedback on the Snapshot. The fact that you went straight to {{action_they_described}} tells me you understood the report well — that is exactly what it is designed to do.

[FALLBACK if no specific action to reference:]
Thank you for the effort you put into your questionnaire responses and for your positive feedback on the Snapshot. The kind of feedback you shared tells me the report landed the way it was intended to.

I am writing to ask whether I may use a short excerpt from your reply as a testimonial on my site. The snippet I have in mind is:

---

"{{exact_quote}}"
— {{display_name}}, {{primary_role}}

---

Note on how I display testimonials: I use first name with last name initial (as shown above), and I do not use photos unless you specifically tell me you would like one included. If you would prefer initials only (e.g. just "{{display_name_initials}}"), no last name initial, or any other change, please let me know in your reply and I will use whatever you are comfortable with.

Comments like this will help me attract other skilled migrants like you to this new product and free service. I would appreciate it if you could approve this or suggest any changes first.

It has been nice to work with you and I look forward to your successful migration.

Kind regards,
Tate
