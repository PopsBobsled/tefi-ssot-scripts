# TEFI_Tier1_PIPELINE_OVERVIEW.md
### Version: 1.0 | Last updated: 2026-03 | Owner: Tate — TEFI
> **AUTOMATION STATUS: DESIGNED-NOT-BUILT** — This overview describes intended pipeline. Only Step 1 (Relay questions email) is currently automated. All other steps are manual.

---

## TIER 1 PIPELINE AT A GLANCE

This document maps the complete Tier 1 pipeline from CV submission through payment decision. Use it as a reference for sequencing, timing, and handoff instructions.

---

## PIPELINE SEQUENCE

### **STEP 0 — CV SUBMISSION** *(Client action)*
**Timing:** T+0 (immediately)
**What happens:**
- Client submits CV via form or email
- You receive the CV as plain text

**Your action:** Proceed to Step 1

---

### **STEP 1 — QUESTIONNAIRE EMAIL** *(Claude + You)*
**Timing:** T+0 to T+1 (same day or next morning)
**File:** `TEFI_Tier1_01_Action_Prompt.md`

**What to do:**
1. Open the CV (plain text)
2. Paste CV into the prompt from Step 1
3. Run the prompt in Claude
4. Output = personalized questionnaire email
5. Send to client

**Email subject:** "Your Tier 1 Career Migration Report — a few details that will make it stronger"

**What it does:**
- Analyzes CV for gaps (High Value and Medium Value)
- Generates warm, specific questions targeting those gaps
- Frames it as "details that will make the report stronger"
- Tone: encouraging, not demanding

**Client action:** Replies with answers to questions

**Expected response time:** 2–7 days (depends on candidate urgency)

---

### **STEP 2 — TIER 1 REPORT** *(Claude + You)*
**Timing:** T+2 to T+8 (once client replies)
**File:** `TEFI_Tier1_02_Finishing_Prompt.md`

**What to do:**
1. Collect CV (plain text) and client's email reply
2. Paste both into the prompt from Step 2
3. Run the prompt in Claude
4. Output = 6-section Tier 1 Career Migration Report
5. Send to client

**Report structure:**
1. Professional Profile Summary
2. Role Viability Check
3. Income Estimate
4. 5-Year Career Trajectory
5. CV First Impression Score (10-Point Analysis)
6. Your Next Step (bridges to Tier 2, no sales language)

**What it delivers:**
- Role clarity and salary targets
- Honest CV assessment
- Career trajectory in NZ/AU
- Natural bridge to Tier 2 (non-pressured)

**Client receives:** Professional Word doc or PDF, ready to read

---

### **STEP 3 — DECISION EMAIL** *(Claude + You)*
**Timing:** T+9 to T+10 (within 24 hours of Step 2 delivery)
**File:** `TEFI_Tier1_03_Decision_Email_Prompt.md`

**What to do:**
1. Reference the client's Tier 1 Report (Section 6 key gaps)
2. Paste into the prompt from Step 3
3. Run the prompt in Claude
4. Output = decision/payment email
5. Send to client

**Email subject:** "Tier 1 Report Delivered — Your Next Steps"

**What it does:**
- Presents two clear options with descriptions:
  - **Tier 1 CV Upgrade ($25 trial offer)** — CV rewrite only
  - **Tier 2 Full Toolkit ($350)** — CV + Skills Toolkit + Cover Letter Wizard
- Includes Stripe payment links for each option
- Honest framing of what each tier adds
- No pressure, no artificial urgency
- Tone: helpful coach explaining options

**Client action:** Chooses one option and pays via Stripe

**Expected conversion time:** Same day to 3 days

---

## STRIPE PAYMENT LINKS

| Tier | Product | Price | Stripe Link |
|------|---------|-------|-------------|
| **Tier 1** | CV Upgrade | $25 (trial offer) | https://buy.stripe.com/aFabIUbOY9lZ3gK1Wh0x20s |
| **Tier 2** | CV + Toolkit | $350 | https://buy.stripe.com/14AcMY9GQfKnbNgfN70x20q |

---

## PIPELINE TIMING

```
DAY 0 (Client submits CV)
├─ Step 1: Questionnaire email sent → Client receives

DAYS 1-7 (Client answers questions)
├─ Client works on questionnaire response

DAY 8 (Client replies)
├─ Step 2: Tier 1 Report generated → Client receives
└─ Step 3: Decision email scheduled to send next morning

DAY 9-10 (Client decides)
├─ Client reviews both options
├─ Client chooses Tier 1 or Tier 2
└─ Client pays via Stripe

Total pipeline: ~10 days from CV to payment decision
```

---

## KEY PRINCIPLES

### **Tone Throughout**
- Warm, peer-to-peer, coach-to-client
- Evidence-based, not hype
- Honest about gaps and barriers
- Celebrating strengths genuinely

### **No Pressure**
- No artificial urgency
- No scarcity language
- Both Tier 1 and Tier 2 are valid choices
- Client can pause or decline without friction

### **Specificity**
- Every question traces back to actual CV gaps
- Every claim in the report cites evidence from CV/reply
- Tier 2 features are concrete, not vague

### **Clarity**
- Clear role fit (not generic)
- Clear salary expectations (not inflated)
- Clear next steps (not ambiguous)

---

## WHAT COMES NEXT

**If client chooses Tier 1:**
- You deliver the CV upgrade (date TBD — depends on your production schedule)
- Client receives updated CV
- Pipeline ends (or client may later upgrade to Tier 2)

**If client chooses Tier 2:**
- Tier 2 pipeline begins (separate system)
- You deliver Skills & Achievements Toolkit + Cover Letter Wizard
- Foundation set for Tier 3/4 if client progresses

---

## CUSTOMIZATION NOTES

### For you (Tate):
Each step can be run independently, but **order matters**:
- Step 1 (Questionnaire) MUST come before Step 2 (Report)
- Step 2 (Report) SHOULD come before Step 3 (Decision email)
- Step 3 can be sent same day as Step 2 or next morning

### For delegation:
- **Step 1 (Questionnaire):** Can be run by assistant + Claude
- **Step 2 (Report):** Can be run by assistant + Claude (requires some judgment on CV analysis)
- **Step 3 (Decision email):** Can be fully automated with Claude (just input client name, role, key gaps)

---

## MEASURING SUCCESS

**Conversion metrics to track:**
- % of Step 1 emails that receive a reply
- Days to reply (measure urgency/interest)
- % of Step 2 recipients who click a Tier 1 or Tier 2 link
- % who proceed to payment (conversion rate)
- Tier 1 vs. Tier 2 split (which path do clients prefer?)

---

## TROUBLESHOOTING

**If client doesn't reply to Step 1 questionnaire:**
- Set a reminder at Day 5 for a gentle nudge email
- Example nudge: "Just checking in — if you're ready to reply, the effort will be well worth it."
- Second nudge at Day 10 if no response

**If client doesn't engage with Step 3 decision email:**
- Follow up at Day 14: "I wanted to check if you had any questions about the options."
- Keep tone curious, not pushy

**If client has questions about Tier 2:**
- Offer a brief call to walk through the toolkit
- Emphasize that Tier 2 is an investment in a reusable system, not a one-time deliverable

---

*TEFI_Tier1_PIPELINE_OVERVIEW.md | Tate's Employment for Immigration*


---

*© 2026 Tate Ulsaker / Tate's Employment for Immigration. All rights reserved. Confidential and proprietary — do not reproduce or share without written permission.*