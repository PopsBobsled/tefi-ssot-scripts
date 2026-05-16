#!/usr/bin/env python3
"""
MRR Template v2.0 — 12-Point Validator
Checks rendered HTML against structural and content requirements.
Usage: python validate.py --html path/to/file.html [--data path/to/data.json]
"""

import re
import json
import argparse
import sys

TEMPLATE_VERSION = "2.0"
CORRECT_FABIEN_NAME = "Fabien Maisonneuve"
WRONG_FABIEN_NAMES = ["Fabien Gilberton", "Fabien Giry", "Fabien Gilberston", "Fabien Maisonneauve"]
SUBMIT_CV_URL = "/submit-cv/"
FORBIDDEN_CTAS = ["calendly.com/tates_employment/chat-with-tate"]  # no 1:1 Calendly on MRR pages

REQUIRED_SECTIONS = [
    "role_snapshot",
    "salary_benchmark",
    "regional_demand",
    "licensing_registration",
    "immigration_pathway",
    "migrant_readiness",
    "where_to_find_roles",
]


def run_validation(html: str, data: dict = None) -> list:
    results = []

    def check(name, passed, detail=""):
        results.append({"check": name, "pass": passed, "detail": detail})

    # ── GR-1 — Template version comment ──
    version_ok = f"<!-- MRR_TEMPLATE_VERSION: {TEMPLATE_VERSION} -->" in html
    check("GR-1: Template version comment present", version_ok,
          f"Expected: <!-- MRR_TEMPLATE_VERSION: {TEMPLATE_VERSION} -->")

    # ── GR-2 — Registry anchor present ──
    check("GR-2: Registry anchor comment present", "<!-- REGISTRY-ANCHOR:" in html)

    # ── GR-3 — Schema.org JSON-LD present ──
    check("GR-3: Schema.org JSON-LD block present",
          '<script type="application/ld+json">' in html)

    # ── GR-4 — H1 heading present ──
    check("GR-4: H1 heading present", bool(re.search(r"<h1[^>]*>", html)))

    # ── GR-5 — TEFI AD BLOCK markers present ──
    ad_ok = "<!-- TEFI AD BLOCK -->" in html and "<!-- END TEFI AD BLOCK -->" in html
    check("GR-5: TEFI AD BLOCK markers present", ad_ok)

    # ── GR-6 — All required section data-section attributes present ──
    missing_sections = [s for s in REQUIRED_SECTIONS if f'data-section="{s}"' not in html]
    check("GR-6: All 7 required sections present",
          len(missing_sections) == 0,
          f"Missing: {missing_sections}" if missing_sections else "")

    # ── GR-7 — Fabien name correct ──
    fabien_correct = CORRECT_FABIEN_NAME in html
    fabien_wrong = [n for n in WRONG_FABIEN_NAMES if n in html]
    check("GR-7: Fabien Maisonneuve name correct",
          fabien_correct and not fabien_wrong,
          f"Wrong name(s) found: {fabien_wrong}" if fabien_wrong else
          (f"Correct name not found" if not fabien_correct else ""))

    # ── GR-8 — No em-dash literal characters (only HTML entities allowed) ──
    em_dash_literal = "—" in html  # the actual — character
    check("GR-8: No literal em-dashes (HTML entities only)",
          not em_dash_literal,
          "Literal em-dash (—) found — use &mdash; instead")

    # ── GR-9 — CTA destination correct, no forbidden CTAs ──
    forbidden_found = [u for u in FORBIDDEN_CTAS if u in html]
    submit_cv_present = SUBMIT_CV_URL in html
    check("GR-9: CTA destination correct (submit-cv, no forbidden links)",
          submit_cv_present and not forbidden_found,
          f"Forbidden CTA(s): {forbidden_found}" if forbidden_found else
          (f"/submit-cv/ not found" if not submit_cv_present else ""))

    # ── GR-10 — Shared footer shortcode present ──
    check("GR-10: Shared footer shortcode present",
          "[wpcode id=" in html)

    # ── GR-11 — Hub/parent category link present ──
    hub_present = False
    if data:
        hub_url = data.get("role", {}).get("hub_url", "")
        if hub_url:
            hub_present = hub_url in html
    else:
        # Heuristic: look for a link with "Agriculture" or "Roles" in text near an href
        hub_present = bool(re.search(r'Browse all .+?Roles', html))
    check("GR-11: Hub/parent category link present", hub_present)

    # ── GR-12 — LAST-UPDATED comment on salary and immigration sections ──
    salary_updated = "LAST-UPDATED: section=salary" in html
    immigration_updated = "LAST-UPDATED: section=immigration" in html
    check("GR-12: LAST-UPDATED comments on salary and immigration",
          salary_updated and immigration_updated,
          f"Missing: {'salary' if not salary_updated else ''} {'immigration' if not immigration_updated else ''}".strip())

    return results


def main():
    parser = argparse.ArgumentParser(description="MRR 12-Point Validator")
    parser.add_argument("--html", required=True, help="Path to rendered HTML file")
    parser.add_argument("--data", help="Path to role JSON data file (optional, improves GR-11)")
    args = parser.parse_args()

    with open(args.html, "r", encoding="utf-8") as f:
        html = f.read()

    data = None
    if args.data:
        with open(args.data, "r", encoding="utf-8") as f:
            data = json.load(f)

    results = run_validation(html, data)
    passed = sum(1 for r in results if r["pass"])

    print(f"\nMRR Validation Report")
    print(f"File: {args.html}")
    print(f"Score: {passed}/{len(results)}\n")

    for r in results:
        status = "PASS" if r["pass"] else "FAIL"
        print(f"  [{status}] {r['check']}")
        if not r["pass"] and r["detail"]:
            print(f"         {r['detail']}")

    print()
    if passed == len(results):
        print("All checks passed. Ready to push.")
    else:
        print(f"{len(results) - passed} check(s) failed. Fix before pushing.")
        sys.exit(1)


if __name__ == "__main__":
    main()
