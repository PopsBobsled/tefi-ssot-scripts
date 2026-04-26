# 09_skills/ — Cowork SKILL.md files

This folder holds the formal SKILL.md files that Cowork uses to teach Sonnet/Haiku how to perform specific recurring tasks. Each file has YAML frontmatter (name + description) followed by execution instructions in plain Markdown.

## What's in here (Commit 3, 2026-04-26)

| File | Schedule | Purpose |
| :-- | :-- | :-- |
| `brain-ingestion-sunday_SKILL.md` | Sunday | Weekly brain ingestion / file consolidation |
| `cmsnapshot-testimonial-scan-weekly_SKILL.md` | Thursday | Scans Gmail testimonials, updates Excel + infographics |
| `daily-briefing-tate_SKILL.md` | Daily 07:52 NZT | Reads TATE_FOCUS + Playbook + recent log; writes briefing to today's daily log |
| `leads-folder-workflow_SKILL.md` | Triggered | Inbound CV intake — creates folders, saves files, builds bundles |
| `weekly-lead-followup-sweep_SKILL.md` | Sunday 08:04 NZT | Drafts personalised lead nudges per the 4-step validation. Created 2026-04-26. |

### Excluded from this commit

- `obsidian-weekly-archiver_SKILL.md` — Tate retired the Obsidian Vault as the Second Brain layer; n8n + the SSOT split take its place. Skill no longer in active use; not version-controlled. (Local file may remain in your scheduled-tasks folder; safe to leave or delete.)

## How these are licensable IP

These SKILL.md files encode "how Sonnet does X" for TEFI's specific operations. Under the white-label model, partners receive the SKILL.md set as part of the Cowork operator package. Each file represents distilled operating IP — the rules, gates, and procedures that produce TEFI's outputs.

The strict-skill class (formal SKILL.md files with frontmatter) sits alongside the workflow documentation (in `08_workflows/`) and the prompts (in `03_prompts/`). Together they form the operational backbone.

## Future skill additions

When new scheduled tasks are created in Cowork (e.g., during n8n migration in Q3), copy each new SKILL.md into this folder as a new commit. Convention: `<task-id>_SKILL.md`.

For skills that live outside the scheduled-tasks system (e.g., installed plugins, marketplace skills), do NOT copy them here — they're licensed to Cowork or the publisher, not TEFI IP.

## Reference

- `~TEFI/Tier1/relay-wf2-build_Instructional.md` — Relay AI counterpart (Relay-side, not Cowork-side)
- D2 Thread 2 — White-Label Readiness — confirms skills as part of the licensable artifact set
