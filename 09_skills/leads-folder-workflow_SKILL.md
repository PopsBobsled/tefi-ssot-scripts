---
name: leads-folder-workflow
description: Daily scan — detects question-response emails from leads, creates their folder, builds PDF bundle, drafts meeting invite, and nudges stale threads
---

# TEFI Leads Folder Workflow — Daily Run

**Run as part of the morning daily sweep.**
This skill handles two things: (1) processing newly arrived question-response emails from leads, and (2) checking for stale "Meeting Invited" threads that need a follow-up nudge.

---

## PART A — New Question-Response Emails

### A1 — Search Gmail for Question-Response Emails

Search Gmail for inbound emails where the subject contains "Your Career Migration Report — next steps".

Use Gmail query: `subject:"Your Career Migration Report" in:inbox`

For each matching email:
- Read the full message body and extract the candidate's First Name and Last Name from the sender name or email signature
- Check whether a folder already exists at `C:\Users\Joe\Claude\~TEFI\~Leads\[First Last]\`
- If the folder already exists, skip this email — it has already been processed
- If the folder does not exist, proceed to A2

### A2 — Create the Leads Folder

Create the folder: `C:\Users\Joe\Claude\~TEFI\~Leads\[First Last]\`

Where `[First Last]` is the candidate's full name as extracted from the email. Use title case. Example: `Lewis Chadamoyo`.

### A3 — Save the Question-Response Email as PDF

Save the inbound question-response email as a PDF file into the new folder.

Filename: `[First Last] — Questions and Responses [YYYY-MM-DD].pdf`

Where [YYYY-MM-DD] is the date of the inbound email.

If the Gmail MCP does not support direct PDF export, save the email body as a plain text file with the same naming convention and flag to Tate that manual PDF conversion may be needed.

### A4 — Retrieve the Candidate's CV from Gmail

Search the Gmail thread for the original email from this candidate that contained a CV attachment. Use Gmail query: `from:[candidate email] has:attachment filename:cv OR filename:resume`

Download the CV attachment (typically a .docx or .pdf file) and save it into the folder.

Filename: `[First Last] — CV [original filename extension]`

If no CV attachment is found in Gmail, create a placeholder note file: `[First Last] — CV MISSING — retrieve manually.txt` and flag to Tate.

### A5 — Build the PDF Bundle

Create a combined PDF bundle in this order:
1. The CV (top)
2. A separator page with the text: "— Questions and Responses follow —" centred on a blank page
3. The question-response email (bottom)

Save the bundle as: `[First Last] — CV + Responses [YYYY-MM-DD].pdf`

If PDF merging is not possible with available tools, save the individual files and flag to Tate that the manual bundle step is needed.

### A6 — Apply Gmail Label

Apply the label `TEFI/Leads/Pipeline/Questions Received` to the question-response email thread.

### A7 — Send the Meeting Invitation Email

This candidate is a confirmed real lead. Tate has already reviewed their CV and chose to send them the T1 questions — the qualification decision was made at that point. Their responses confirm engagement. Send the meeting invitation immediately using template T-S1.

**Use template:** `~TEFI/Templates/T-S1-meeting-invitation.md`

- Populate `{{first_name}}` from the candidate's name as extracted in A1
- Subject line: `Re: Your Career Migration Report — next steps`
- Send directly — do not save as draft, do not wait for Tate review
- Run the draft self-check against TEFI_Voice_Reference.md "What to Avoid" before sending. If the self-check fails, save as draft and flag to Tate instead of sending.

After sending, apply label `TEFI/Leads/Pipeline/Meeting Invited` to the thread.

### A8 — Report to Tate

For each processed email, report:
- Candidate name
- Qualification status: **Real Lead** (CV reviewed, T1 responses received)
- Folder created: `C:\Users\Joe\Claude\~TEFI\~Leads\[First Last]\`
- Files saved (CV, responses PDF, bundle PDF — or flags where missing)
- Gmail labels applied: `Questions Received` → `Meeting Invited`
- Meeting invitation: **sent** (or "saved as draft — self-check failed" if applicable)

---

## PART B — 3-Day Follow-Up Check (Meeting Invited)

### B1 — Find Stale Meeting Invited Threads

Search Gmail for threads labelled `TEFI/Leads/Pipeline/Meeting Invited` where the most recent sent email in the thread is more than 3 days old and there has been no inbound reply since.

Use Gmail query: `label:TEFI/Leads/Pipeline/Meeting-Invited`

For each thread found:
- Check the date of the most recent sent email in the thread
- Check whether any inbound reply exists after that date
- If no reply and more than 3 days have passed → proceed to B2
- If a reply exists → apply label `TEFI/Leads/Pipeline/Meeting Booked` and remove `Meeting Invited` — flag to Tate

### B2 — Draft the Follow-Up Nudge

Draft a brief, warm follow-up email to the candidate. Do not send — Tate reviews before sending.

**Draft content guidelines:**
- Acknowledge they are likely busy — no guilt, no pressure
- Keep it to 2–3 sentences
- Offer to work around their schedule completely
- Optionally mention that even a short 20-minute conversation can open up a lot
- Warm, human tone — not a template-sounding chase email

**Subject line:** Re: Your next step — let's meet, [First Name]

Save the draft to Gmail Drafts. Report the draft to Tate in the session summary.

### B3 — Report Stale Threads to Tate

List all threads checked, noting:
- Candidate name
- Date of original meeting invite
- Days since sent (no reply)
- Whether a nudge draft was created or a reply was detected

---

## PART C — 3-Day Follow-Up Check (Testimonial Approval Sent)

### C1 — Find Stale Testimonial Approval Threads

Search Gmail for threads labelled `TEFI/Marketing/Testimonial/Approval Sent` where no inbound reply has arrived in 3 days.

Use Gmail query: `label:TEFI/Marketing/Testimonial/Approval-Sent`

For each thread:
- Check date of most recent sent email
- If no inbound reply and more than 3 days → proceed to C2
- If a reply exists → flag to Tate to update Testimonials_CMSnapshot.xlsx with approval outcome

### C2 — Draft the Testimonial Approval Nudge

Draft a short, friendly reminder. Do not send.

**Draft content:**
- Remind them warmly that Tate is waiting for their approval to use their testimonial
- One sentence acknowledgement that they may be busy
- Confirm it is a simple reply — just say "Approved" or ask if they have any conditions

**Subject line:** Re: [original approval request subject]

Save to Gmail Drafts. Report to Tate.

---

## Draft Self-Check (run before queuing any draft)

Before saving any draft to Gmail, check it against `~TEFI/Templates/TEFI_Voice_Reference.md` — specifically the "What to Avoid" list. A draft fails the self-check if it contains any of the following:

- Excessive opening pleasantries ("I hope this email finds you well")
- Announcements of kindness ("It would be my absolute pleasure to...")
- Marketing buzzwords ("game-changer", "unlock your potential", "take your career to the next level")
- Extended sympathy that dwells ("I know this must be so difficult and I completely understand...")
- Vague encouragement without substance ("You are doing great, keep it up!")
- Closing flourishes other than: "Kind regards", "Best regards", "Warm regards", or "Cheers"
- Bold headers or bullet lists inside a short conversational reply

If a draft fails: rewrite the offending section using the closest matching pattern from the voice reference, then re-check. If the draft cannot be corrected without significant rewriting, flag to Tate rather than queuing a flawed draft.

Log result in session summary: "Self-check passed" or "Self-check failed — rewritten" for each draft.

---

## Constraints

- The T-S1 meeting invitation is the only email sent automatically — candidate is a confirmed real lead by the time T1 responses arrive. All other emails (nudges, follow-ups, proposals) remain as drafts requiring Tate's review.
- If the T-S1 self-check fails, save as draft and flag to Tate — do not send a flawed email automatically
- Never create a leads folder if one already exists for that candidate
- Never merge PDF files in a way that could corrupt the originals — keep originals as separate files alongside the bundle
- If any step fails (file not found, label not available, PDF merge error), flag clearly to Tate and continue with remaining candidates
- The decision to generate a Career Migration Report is always Tate's — never automated

---

## Session Summary Format

At the end of each run, output:

```
LEADS FOLDER WORKFLOW — [Date]

NEW QUESTION-RESPONSES PROCESSED: [N]
  - [Candidate Name] — folder created, CV [found/MISSING], bundle [built/MANUAL NEEDED], draft meeting invite queued
  - ...

MEETING INVITED FOLLOW-UPS: [N threads checked]
  - [Candidate Name] — [X days since invite, nudge draft queued / reply detected, label updated]
  - ...

TESTIMONIAL APPROVAL FOLLOW-UPS: [N threads checked]
  - [Initials] — [X days since approval sent, nudge draft queued / reply detected, needs spreadsheet update]
  - ...

ACTION REQUIRED FROM TATE:
  - Review and send [N] meeting invitation drafts
  - Review and send [N] follow-up nudge drafts
  - [Any manual steps flagged]
```
