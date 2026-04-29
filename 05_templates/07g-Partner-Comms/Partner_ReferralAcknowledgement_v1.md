---
Template ID:   Partner-ReferralAcknowledgement
Category:      07g Partner Comms
Stage:         N/A — fires at lead intake when Source Agent is assigned
Zoho label:    Hennessy Immigration: Rory  (agent-specific variant — one per active partner)
Zoho folder:   (confirm from Zoho — Lead Dropdown Workflow)
Zoho module:   Leads
Subject:       Thank you for your referral
Status:        Active
Version:       v1.0
Last updated:  2026-04-28
Last sent:     In active use (Zoho)
Outcome:       Captured outside Q2.6 scope — added opportunistically 2026-04-28
AI space:      None — fully static template
Static zones:  Subject line, header line, all body paragraphs, sign-off
Merge fields:  ${Leads.Lead Name}, ${Leads.Source Agent}, ${userSignature}
Notes:         Sent TO the referring agent (partner), NOT to the client. The Zoho label
               is agent-specific ("Hennessy Immigration: Rory") — each active partner
               likely has their own variant with the agent's first name hardcoded
               ("Thank you Rory"). A master version would use an agent first name merge
               field (e.g. ${Leads.Source_Agent_First_Name}) — consider consolidating
               to one master template when building the n8n partner comms workflow.
               The header line "${Leads.Lead Name} is tagged to ${Leads.Source Agent}"
               is a Zoho template design element (bold header). The trigger is the
               Source Agent dropdown being set on a Lead record.
               ⚠️ IMPROVEMENT FLAGGED: Tate wants to upgrade body to an "official
               certificate" feel — confirming the agent as the first to refer this
               person, tagging confirmation, and milestone update promises (payment
               date, job search launch). Design task deferred — v2 should be a
               branded HTML email.
---

# Partner — Referral Acknowledgement

**Subject:** Thank you for your referral

---

**${Leads.Lead Name} is tagged to ${Leads.Source Agent}**

---

Thank you Rory,

I appreciate the referral. I have initiated contact and I will let you know if we start working together. When I am working with your referrals, you can expect to be updated regarding important milestones, especially when commit to my services with a payment and when they launch into the job market in search for a job offer. In this way, I can keep you in the loop for your follow up services.

Have a great day!

Kind regards,
Tate

${userSignature}
