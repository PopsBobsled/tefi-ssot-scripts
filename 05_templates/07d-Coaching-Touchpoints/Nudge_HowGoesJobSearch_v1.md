---
Template ID:   Nudge-HowGoesJobSearch
Category:      07d Coaching Touchpoints
Stage:         Post-launch check-in (no fixed stage — sent when job search is active)
Zoho label:    How goes the job search?
Zoho folder:   7 Advanced JobHunt Help
Zoho module:   Contacts
Subject:       How are you? Can I help with anything?
Status:        Active
Version:       v1.0
Last updated:  2026-04-28
Last sent:     In active use (Zoho)
Outcome:       High-performer — one of 6 priority templates migrated Q2.6
AI space:      None — fully static template
Static zones:  Subject line, all body paragraphs, sign-off
Merge fields:  ${Contacts.First Name}, ${Deals.Depri_Partner First Name}, ${userSignature}
Notes:         Uses both a Contact and a Deal merge field — confirms this fires in the
               context of an active deal (client in job search phase). The Depri_Partner
               field addresses the partner/spouse if present; if empty, Zoho may render
               awkwardly — confirm fallback behaviour in Zoho before n8n use.
               Tone is deliberately open-ended: offers help with challenges, floats the
               possibility they've already found work, and explicitly extends to non-job
               matters. Sibling template: Nudge_UpdateJobFindingExperience (shorter,
               more direct check-in).
---

# Nudge — How Goes the Job Search?

**Subject:** How are you? Can I help with anything?

---

Hi ${Contacts.First Name}, ${Deals.Depri_Partner First Name}

Good day! I hope you are well.

I've recently been thinking about your job search journey. If you're facing specific challenges today, I'm here to assist. Or maybe you already found work and haven't let me know yet, that would be good news. ;:-)

If you are looking, I would like to ask what has been going well and what has been the most difficult part of your job search journey? I would like to help you for anything job related. Or even non-job related, maybe I can help with something.

Best regards,
Tate

${userSignature}
