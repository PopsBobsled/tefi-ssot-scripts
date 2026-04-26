---
template_id: T-S0
stage: S0
name: initial-question-response
subject: "Your Career Migration Report — next steps"
owner: Sonnet
static_ratio: 60%
trigger: After CMSnapshot sent and lead shows interest or replies
tags: [questions, cv-review, tier1, lead, initial-outreach]
dynamic_fields: [first_name, personalised_cv_paragraph, numbered_questions, calibration_questions]
model_notes: Sonnet generates the personalised paragraph and numbered questions by reading the candidate's CV. The static wrapper must not be altered by Sonnet — only the dynamic sections. Read TEFI_Voice_Reference.md before drafting.
---

Dear {{first_name}},

Thank you for your interest in building a career in New Zealand or Australia. I have reviewed your CV carefully and identified several high-value gaps that, once filled, will make a meaningful difference to both your profile and your Career Migration Report. A few targeted details from you will allow me to deliver something genuinely useful, ensuring your time here is well spent. Let's get started...

{{personalised_cv_paragraph}}
[Sonnet: 3–4 sentences on what already stands out in their CV — credible signals, progression, specific achievements. Name actual things: a metric, a promotion, a scope indicator. End with: "With a little more detail, your Tier 1 report will be much more convincing to employers who want clear evidence of scope, ownership, and impact."]

This report helps clarify your best-fit roles, likely income range, career trajectory, and the strengths and risks in your current CV. The more precise your detail is now, the sharper and more useful the final report will be.

The details that will have the biggest impact for employers

{{numbered_questions}}
[Sonnet: 3–4 numbered questions, each personalised to their CV. Each question ends with a "Why this matters to employers:" line. Questions target: volume/scale of work, a specific achievement (with baseline and context), a tool or system they owned end-to-end, leadership or scope of responsibility. See Rene and Sanjay emails for calibration of depth and style.]

Details that add credibility and help me calibrate your report accurately

{{calibration_questions}}
[Sonnet: 3 numbered questions — target role type, location preference (NZ/AU/city), work environment preference (corporate/SME/consulting etc). Keep plain and direct — no bullet icons, no bold.]

Answer the above questions and send them to me. I will send your Career Migration Report soon after.

Do your best to answer every question. If one or two are difficult to answer fully right now, that is fine. A partial answer is always more useful than a blank. The more you share, the stronger your report will be.

Estimates are absolutely fine. If a number is an estimate, just add one short line on how you arrived at it. Employers respond well to careful, honest communication. It builds trust. I can help you shape the language once you send it through. For now, just reply in your own words.

Your qualifications, skills, and goals will be accurately matched to our job segments based on your complete replies to the above questions. Reply with as much detail as feels comfortable, and I will help turn it into a report that reflects your true value.

Best regards,
Tate
