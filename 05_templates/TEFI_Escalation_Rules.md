# TEFI Escalation Rules
**Owner:** Tate Ulsaker | tate@employmentforimmigration.nz
**Created:** 2026-04-25 (Session 1 of 2 — autonomous seed build, Tate interview pending)
**Status:** ⚠️ DRAFT — seeded from confirmed sources. Section 2 requires Tate's review and additions before the file goes live.
**Purpose:** Which situations require Tate's judgment and must never be handled automatically. Haiku reads this before queuing any draft, send, or client-facing action. Sonnet reads this before finalising any client-facing content.

---

## How to Use This File

Before any model (Haiku or Sonnet) writes, sends, labels, or acts on a client-facing artefact, it must:

1. Check the situation against Section 1 (Hard Stops) and Section 2 (Judgment Calls).
2. If any Hard Stop applies → stop, draft only, queue for Tate, do NOT send or act.
3. If any Judgment Call applies → draft only, flag the reason for escalation, queue for Tate.
4. If nothing applies → proceed under the normal template and voice rules.

When in doubt: escalate. The cost of over-escalating is a few seconds of Tate's time. The cost of under-escalating is a client relationship.

---

## Section 1 — Hard Stops (Never Act Automatically)

These are the situations confirmed in existing Tate-authored files. A model must NOT send, label, or act on any of these without Tate's explicit approval in the current session.

### 1.1 — Auto-send is restricted to exactly one template
- **Rule:** T-S1 (meeting-invitation) is the ONLY template permitted to auto-send.
- **Everything else:** draft → Tate reviews → Tate sends.
- **Source:** `CLAUDE.md` — decision dated 2026-04-22.

### 1.2 — Gmail MCP is read-only
- **Rule:** The Gmail MCP connector is read-only. No model may use it to write a label, send a message, archive, or modify a thread.
- **All writes:** must route through n8n only.
- **Source:** `CLAUDE.md` — decision dated 2026-04-22.

### 1.3 — No visa advice, ever
- **Rule:** TEFI does not give visa advice. If a client asks for visa guidance, the response is to redirect them to the NZ immigration website or to a licensed immigration adviser. Never draft content that interprets visa rules, predicts visa outcomes, or recommends a visa pathway.
- **Source:** `TEFI_Voice_Reference.md` — Pattern D, verbatim: *"It doesn't seem like the way things are done but I don't give visa advice. Just go to the NZ immigration website to work that out or go to an immigration agent."*

### 1.4 — No guarantees language
- **Rule:** No model may write language that promises a job, a placement, a specific outcome, a refund contingent on outcomes, or any equivalent guarantee. This applies to website copy, emails, templates, CMSnapshots, proposals, and social content.
- **Source:** `01 Daily Logs/[C] 2026-04-24.md` — product positioning decision: *"No guarantees language anywhere. Reputation drives sales, not refund promises."*

### 1.5 — Live 1:1 sessions are off-page and Tate-invited only
- **Rule:** A model must not promise, schedule, or advertise a live 1:1 session with Tate in any client-facing artefact. Live 1:1 is extended by Tate privately, at his discretion.
- **Source:** `01 Daily Logs/[C] 2026-04-24.md` — Tier 1 page rewrite positioning decision.

### 1.6 — Two-attempts rule
- **Rule:** If an approach fails twice, stop and pivot. Do not retry the same method a third time. Surface the wall to Tate.
- **Source:** `CLAUDE.md` — decision dated 2026-04-22.

---

## Section 2 — Judgment Calls (Always Draft, Never Send)

These are the categories Tate has identified in the Brain Build Plan as requiring his judgment. A model may draft a response but must queue it for Tate's review.

### 2.1 — Pricing conversations
- **Rule:** Any client message that touches price, payment, discount, refund, or negotiation of fees → draft only, escalate to Tate.
- **Source:** `TEFI_Brain_Build_Plan.md` — escalation seed.
- **⚠️ Needs Tate input:** Exact phrasing of the price-discussion draft template. What's the default holding reply? What pricing information is Haiku allowed to state verbatim from the website vs. what must be escalated?

### 2.2 — Client expressing distress
- **Rule:** Any signal of emotional distress, frustration, burnout, family stress, financial hardship, or mental-health language → draft only, escalate to Tate.
- **Source:** `TEFI_Brain_Build_Plan.md` — escalation seed.
- **⚠️ Needs Tate input:** Specific language signals Tate wants flagged (e.g. key phrases, tone markers). Does the draft-vs.-hold decision change if distress is about the job search itself vs. external life events?

### 2.3 — Visa status uncertainty
- **Rule:** Any client situation where visa status is uncertain, pending, declined, or at risk → draft only, escalate to Tate. This is distinct from 1.3 (giving visa advice) — this covers situations where the client's existing visa situation affects the coaching path.
- **Source:** `TEFI_Brain_Build_Plan.md` — escalation seed.
- **⚠️ Needs Tate input:** How does visa uncertainty change the coaching recommendation? When does Tate pause a programme? When does he refer out?

### 2.4 — Anything involving a third party
- **Rule:** Any message that involves an employer directly, a recruiter, a referral from another client, a legal matter, a family member of the client, or any external party → draft only, escalate to Tate.
- **Source:** `TEFI_Brain_Build_Plan.md` — escalation seed.
- **⚠️ Needs Tate input:** The list of third-party categories needs scoping. Does this include journalists or podcast guests? Does it include partner organisations (other coaches, training providers)?

---

## Section 3 — Open Questions for Tate (Session 2)

These are the interview prompts from the scheduled task that need Tate's live answers to complete the file. Schedule for next Saturday brain-build slot.

1. **Past incidents** — What has gone wrong before where Haiku or Sonnet acted when Tate wished they'd checked first? List each with one sentence on what should have happened instead.
2. **Pricing conversation scope** — What price info is public/safe to quote directly (e.g. Tier 1 $25, Masterclass free)? What price topics must always escalate (discounts, payment plans, refunds, custom scopes)?
3. **Distress signals** — Specific phrases or tones that always trigger escalation. Tate's preferred first response (draft only, hold reply, personal phone call).
4. **Visa situations** — When a client's visa situation affects the programme, what does Tate want the escalation draft to look like? Generic holding note, or a specific template?
5. **Third-party scope** — Define the full list. Employers, recruiters, family, legal, journalists, partners. Which get an auto-escalation vs. an auto-decline?
6. **Money edge cases** — Failed payments, chargebacks, duplicate purchases, refund requests. All escalate, or some auto-handled?
7. **Time-sensitive escalations** — If Tate is offline (travel, masterclass, focused block), what's the fallback? Silent queue, auto-acknowledgement, or something else?
8. **Clients mentioning other coaches/services** — Handle quietly, escalate, or ignore?
9. **Tier mis-fit situations** — A client on the wrong tier, or one who has outgrown their tier. Who flags, how?
10. **Negative reviews or public complaints** — Any mention of social-media criticism or public complaint → escalation rules?

---

## Section 4 — Relationship to Other Brain Files

- **TEFI_Voice_Reference.md** — Controls tone. Escalation Rules control *whether* to draft. Voice controls *how* to draft.
- **TEFI_Service_Architecture.md / TEFI_Service_Architecture_Deep.md** — Defines what's in scope per tier. Escalation Rules defer to Service Architecture when the question is "is this a legitimate Tier X request?" vs. "does this require Tate's judgment?"
- **TEFI_Decision_Log.md (pending)** — When a new escalation category is added or a rule changes, log it here with date and reason.

---

## Section 5 — Update Process

- **Add a rule:** When Tate confirms a new hard stop or judgment call (from a real incident, a strategic decision, or a session like this), add it to the relevant section with a source citation.
- **Retire a rule:** Never silently delete. Move to a "Retired Rules" section below with the date and reason.
- **Monthly review:** Check whether any rule has been triggered frequently. High trigger volume = either the rule is correct and important, or the upstream behaviour needs fixing so the rule stops firing.

---

## Retired Rules

*(None yet.)*

---

*TEFI_Escalation_Rules.md | Tate's Employment for Immigration | Session 1 draft 2026-04-25 | Status: awaiting Session 2 interview*
