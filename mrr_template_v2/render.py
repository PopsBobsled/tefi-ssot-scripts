#!/usr/bin/env python3
"""
MRR Template v2.0 — Page Renderer
Reads a role JSON data file, generates standards-compliant WPCode body HTML.
Usage: python render.py --data data/NZR077_nz.json [--out output/NZR077_nz.html]
"""

import json
import argparse
import os
import sys
from datetime import datetime

TEMPLATE_VERSION = "2.0"
SITE_BASE = "https://employmentforimmigration.nz"
AD_IMG_GREY = f"{SITE_BASE}/wp-content/uploads/2026/05/Free-review.-No-pressure-mini.jpg"
AD_IMG_BLUE = f"{SITE_BASE}/wp-content/uploads/2026/05/Send-your-CV-mini.jpg"
SUBMIT_CV_URL = f"{SITE_BASE}/submit-cv/"
FABIEN_NAME = "Fabien Maisonneuve"
FABIEN_EMAIL = "Fabien@newzealandshores.com"
FABIEN_ORG = "New Zealand Shores"
FABIEN_URL = "https://www.newzealandshores.com/"


# ─────────────────────────────────────────────
# CSS
# ─────────────────────────────────────────────

def render_css():
    return """\
<style>
.mrr-page{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.7;color:#343a40;}
.mrr-page h2{color:#0f1a30;border-bottom:2px solid #d4a83f;padding-bottom:0.25em;margin-top:2em;}
.mrr-page h3{color:#0f1a30;}
.mrr-page a{color:#0f1a30;}
.mrr-page ul{padding-left:1.4em;}
.mrr-page li{margin-bottom:0.35em;}
.mrr-callout{background:#f9f6ee;border-left:4px solid #d4a83f;padding:0.75rem 1rem;margin:0.75rem 0;border-radius:0 4px 4px 0;}
.mrr-warning{background:#fffbea;border-left:3px solid #d4a83f;padding:0.75rem 1rem;margin-top:1rem;}
.mrr-info{background:#eef4ff;border-left:3px solid #0f1a30;padding:0.75rem 1rem;margin-top:1rem;}
.mrr-fabien{background:#f9f6ee;border-left:4px solid #d4a83f;padding:0.75rem 1rem;margin:1rem 0;border-radius:0 4px 4px 0;}
.mrr-au-link{display:flex;align-items:center;gap:1rem;padding:0.9rem 1.1rem;background:#f9f6ee;border:0.5px solid #d4a83f;border-left:4px solid #d4a83f;border-radius:0 8px 8px 0;text-decoration:none;margin:0.75rem 0 1rem;}
.mrr-au-link:hover{background:#f0e8d4;}
.mrr-au-flag{font-size:26px;line-height:1;flex-shrink:0;}
.mrr-au-text{flex:1;min-width:0;}
.mrr-au-eyebrow{display:block;font-size:11px;color:#8a7020;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:2px;}
.mrr-au-title{display:block;font-size:15px;font-weight:600;color:#0f1a30;margin-bottom:2px;}
.mrr-au-sub{display:block;font-size:12px;color:#5a4a10;}
.mrr-au-arrow{font-size:18px;color:#d4a83f;flex-shrink:0;}
.mrr-browse{margin:1.5rem 0 0.5rem;font-size:0.95em;}
.mrr-browse a{color:#8a7020;text-decoration:underline;}
table{width:100%;border-collapse:collapse;margin:1rem 0;}
table th{background:#0f1a30;color:#fff;padding:8px 12px;text-align:left;font-size:0.9em;}
table td{padding:8px 12px;border-bottom:1px solid #e0e0e0;font-size:0.95em;}
table tr:nth-child(even) td{background:#f9f6ee;}
@media(max-width:600px){table{font-size:0.85em;}}
</style>"""


# ─────────────────────────────────────────────
# SCHEMA.ORG JSON-LD
# ─────────────────────────────────────────────

def render_schema(d):
    role = d["role"]
    page = d["page"]
    meta = d["meta"]
    country_name = "New Zealand" if meta["country"] == "NZ" else "Australia"
    currency = role.get("salary_currency", "NZD")
    salary_low = role.get("salary_low", 0)
    salary_high = role.get("salary_high", 0)
    salary_median = role.get("salary_median", 0)

    breadcrumb_items = []
    breadcrumb_items.append({"@type": "ListItem", "position": 1, "name": "Home", "item": SITE_BASE + "/"})
    if role.get("hub_url") and role.get("hub_label"):
        breadcrumb_items.append({"@type": "ListItem", "position": 2, "name": role["hub_label"], "item": role["hub_url"]})
    breadcrumb_items.append({"@type": "ListItem", "position": len(breadcrumb_items) + 1, "name": page["title"], "item": page["canonical_url"]})

    schema = [
        {
            "@context": "https://schema.org",
            "@type": "Occupation",
            "name": role["name"],
            "description": d.get("intro", ""),
            "occupationLocation": {"@type": "Country", "name": country_name},
            "estimatedSalary": {
                "@type": "MonetaryAmountDistribution",
                "name": "base",
                "currency": currency,
                "median": salary_median,
                "minValue": salary_low,
                "maxValue": salary_high
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumb_items
        }
    ]

    lines = []
    for obj in schema:
        lines.append(f'<script type="application/ld+json">\n{json.dumps(obj, indent=2)}\n</script>')
    return "\n".join(lines)


# ─────────────────────────────────────────────
# AD BLOCK
# ─────────────────────────────────────────────

def render_ad_block():
    # Build JS separately to avoid f-string brace-escaping issues
    js = (
        "(function(){{"
        "if(Math.random()>0.5){{"
        "var i=document.getElementById('tefi-ad-img'),"
        "l=document.getElementById('tefi-ad-lnk');"
        "if(i&&l){{"
        f"i.src='{AD_IMG_BLUE}';"
        "i.alt='Send your CV for practical insight.';"
        f"l.href='{SUBMIT_CV_URL}';"
        "}}}}}}}})();"
    )
    return (
        "<!-- TEFI AD BLOCK -->\n"
        "<div style=\"text-align:center;margin:0.75rem 0;\">\n"
        f"  <a id=\"tefi-ad-lnk\" href=\"{SUBMIT_CV_URL}\" target=\"_blank\" rel=\"noopener\">\n"
        f"    <img id=\"tefi-ad-img\" src=\"{AD_IMG_GREY}\" "
        "alt=\"Free review. No pressure. &mdash; Tate's Employment for Immigration\" "
        "style=\"max-width:340px;width:100%;height:auto;display:inline-block;"
        "border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.12);\"/>\n"
        "  </a>\n"
        "</div>\n"
        "<script>\n"
        f"{js}\n"
        "</script>\n"
        "<!-- END TEFI AD BLOCK -->"
    )


# ─────────────────────────────────────────────
# ROLE SNAPSHOT
# ─────────────────────────────────────────────

def render_role_snapshot(d):
    role = d["role"]
    snap = d["role_snapshot"]
    meta = d["meta"]
    country = meta["country"]

    # Snapshot fields
    fields_html = f"""\
<p><strong>ANZSCO Code:</strong> {role["anzsco_code"]} &mdash; {role["anzsco_label"]}<br>
<strong>Role Variants:</strong> {role["variants"]}<br>
<strong>Parent Category:</strong> <a href="{role["hub_url"]}">{role["hub_label"]}</a><br>
<strong>Skill Level:</strong> {role["skill_level"]}<br>
<strong>Green List:</strong> {role["green_list_status"]} &mdash; {role["green_list_note"]}<br>
<strong>National Occupation List (NOL):</strong> {role["nol_status"]} &mdash; {role["nol_note"]}</p>"""

    # Cross-link to counterpart
    cross_link_html = ""
    if d.get("counterpart", {}).get("exists"):
        c = d["counterpart"]
        flag = "&#x1F1E6;&#x1F1FA;" if c["country"] == "AU" else "&#x1F1F3;&#x1F1FF;"
        cross_link_html = f"""\
<a href="{c['url']}" class="mrr-au-link">
  <span class="mrr-au-flag">{flag}</span>
  <span class="mrr-au-text">
    <span class="mrr-au-eyebrow">{c['eyebrow']}</span>
    <span class="mrr-au-title">{c['label']}</span>
    <span class="mrr-au-sub">{c['subtitle']}</span>
  </span>
  <span class="mrr-au-arrow">&#8594;</span>
</a>"""

    # Responsibilities
    resp_items = "\n".join(f"  <li>{r}</li>" for r in snap["responsibilities"])
    resp_html = f"<ul>\n{resp_items}\n</ul>"

    return f"""\
<!-- ANCHOR: role_snapshot -->
<section data-section="role_snapshot" data-last-updated="{meta['last_updated']}">
<h2>Role Snapshot</h2>

{fields_html}

{cross_link_html}

<p>{snap['description']}</p>

{resp_html}

<p><strong>Typical employers:</strong> {snap['typical_employers']}</p>
</section>"""


# ─────────────────────────────────────────────
# SALARY BENCHMARK
# ─────────────────────────────────────────────

def render_salary(d):
    sal = d["salary"]
    meta = d["meta"]
    role = d["role"]
    currency = role.get("salary_currency", "NZD")

    band_rows = ""
    for b in sal["bands"]:
        band_rows += f"  <tr><td>{b['label']}</td><td>{b['range']} {currency}</td></tr>\n"

    numbeo_html = ""
    if sal.get("cost_of_living_note"):
        url = sal.get("cost_of_living_numbeo_url", "https://www.numbeo.com/")
        numbeo_html = f"""\
<p><strong>Cost of living:</strong> Purchasing power varies significantly by region. For an independent comparison, see <a href="{url}">Numbeo &mdash; New Zealand</a>. TEFI provides clients with a detailed financial planning workbook to model living costs by city and lifestyle during the migration process &mdash; ask Tate for a copy.</p>"""

    return f"""\
<!-- ANCHOR: salary_benchmark -->
<!-- LAST-UPDATED: section=salary | date={meta['last_updated']} | source={sal['source_label']} + {sal['additional_sources']} -->
<section data-section="salary_benchmark" data-last-updated="{meta['last_updated']}">
<h2>Salary Benchmark</h2>

<p>{sal['intro']}</p>

<table>
  <thead><tr><th>Experience Level</th><th>Annual Salary ({currency})</th></tr></thead>
  <tbody>
{band_rows}  </tbody>
</table>

<p><strong>Source:</strong> <a href="{sal['source_url']}">{sal['source_label']}</a> | Market data: {sal['additional_sources']} | Data reviewed {sal['data_date']}</p>

{numbeo_html}
</section>"""


# ─────────────────────────────────────────────
# REGIONAL DEMAND
# ─────────────────────────────────────────────

def render_regional_demand(d):
    reg = d["regional_demand"]
    meta = d["meta"]

    region_items = "\n".join(
        f"  <li><strong>{r['name']}</strong> &mdash; {r['notes']}</li>"
        for r in reg["regions"]
    )

    return f"""\
<!-- ANCHOR: regional_demand -->
<section data-section="regional_demand" data-last-updated="{meta['last_updated']}">
<h2>Where Demand Is Strongest</h2>

<p>{reg['intro']}</p>

<ul>
{region_items}
</ul>
</section>"""


# ─────────────────────────────────────────────
# LICENSING
# ─────────────────────────────────────────────

def render_licensing(d):
    lic = d["licensing"]
    meta = d["meta"]

    mandatory_line = (
        f"<strong>Mandatory licence:</strong> Not required. {lic['mandatory_note']}"
        if not lic["mandatory"]
        else f"<strong>Mandatory licence:</strong> {lic['mandatory_note']}"
    )

    assoc_items = "\n".join(
        f'  <li><a href="{a["url"]}">{a["name"]}</a> &mdash; {a["note"]}</li>'
        for a in lic.get("associations", [])
    )

    qual_items = "\n".join(
        f'  <li><a href="{q["url"]}">{q["name"]}</a> &mdash; {q["note"]}</li>'
        for q in lic.get("qualification_recognition", [])
    )

    cpd_html = ""
    if lic.get("cpd_html"):
        cpd_html = f"<p><strong>CPD:</strong> {lic['cpd_html']}</p>"

    return f"""\
<!-- ANCHOR: licensing_registration -->
<section data-section="licensing_registration" data-last-updated="{meta['last_updated']}">
<h2>Licensing &amp; Professional Registration</h2>

<p>{mandatory_line}</p>

<p><strong>Professional associations (strongly recommended for migrant credibility):</strong></p>
<ul>
{assoc_items}
</ul>

<p><strong>Qualification recognition:</strong></p>
<ul>
{qual_items}
</ul>

{cpd_html}
</section>"""


# ─────────────────────────────────────────────
# IMMIGRATION — links sit directly under their paragraph (T-FIX-03)
# ─────────────────────────────────────────────

def render_immigration(d):
    imm = d["immigration"]
    meta = d["meta"]

    licensing_line = f"<p><strong>Licensing required to work:</strong> {'No mandatory professional licence' if not imm['licensing_required'] else 'Yes'}. {imm['licensing_note']}</p>"

    visa_items = ""
    for v in imm["visas"]:
        visa_items += f"""\
  <li><strong>{v['name']}</strong> &mdash; {v['description']}
    <br><a href="{v['link_url']}">{v['link_label']}</a></li>
"""

    general_note = ""
    if imm.get("general_note"):
        general_note = f"<p>{imm['general_note']}</p>"

    # T-FIX-01: Fabien Maisonneuve correct name, T-FIX-04: only in immigration section
    fabien_html = f"""\
<div class="mrr-fabien">
<p><strong>Immigration advice:</strong> TEFI does not provide immigration advice. Visa eligibility depends on your individual circumstances, qualifications, and current INZ policy. We recommend working with a licensed New Zealand immigration adviser for guidance specific to your situation. We refer clients to <a href="{FABIEN_URL}">{FABIEN_ORG}</a> &mdash; contact {FABIEN_NAME} directly at <a href="mailto:{FABIEN_EMAIL}">{FABIEN_EMAIL}</a> and mention Tate sent you.</p>
</div>"""

    return f"""\
<!-- ANCHOR: immigration_pathway -->
<!-- LAST-UPDATED: section=immigration | date={meta['last_updated']} | source=INZ -->
<section data-section="immigration_pathway" data-last-updated="{meta['last_updated']}">
<h2>Immigration Pathway</h2>

{licensing_line}

<p><strong>Visa options for skilled {d['role']['name'].lower()}s:</strong></p>

<ul>
{visa_items}</ul>

{general_note}

{fabien_html}
</section>"""


# ─────────────────────────────────────────────
# MIGRANT READINESS SIGNALS
# ─────────────────────────────────────────────

def render_readiness(d):
    signals = d["readiness_signals"]
    meta = d["meta"]

    items = "\n".join(
        f'  <li><strong>{s["label"]}:</strong> {s["detail"]}</li>'
        for s in signals
    )

    return f"""\
<!-- ANCHOR: migrant_readiness -->
<section data-section="migrant_readiness" data-last-updated="{meta['last_updated']}">
<h2>Migrant Readiness Signals</h2>

<p>New Zealand employers favour {d['role']['name'].lower()} candidates who demonstrate:</p>

<ul>
{items}
</ul>
</section>"""


# ─────────────────────────────────────────────
# WHERE TO FIND ROLES
# ─────────────────────────────────────────────

def render_job_boards(d):
    boards = d["job_boards"]
    meta = d["meta"]
    role_name = d["role"]["name"]
    cold_note = d.get("cold_application_note", "")

    board_items = ""
    for b in boards:
        if b.get("url"):
            board_items += f'  <li><a href="{b["url"]}">{b["name"]}</a> &mdash; {b["note"]}</li>\n'
        else:
            board_items += f'  <li><strong>{b["name"]}</strong> &mdash; {b["note"]}</li>\n'

    cold_html = ""
    if cold_note:
        cold_html = f"""\
<div class="mrr-warning">
<p><strong>A note on cold applications:</strong> {cold_note} If you are not sure how your background will read to a NZ employer, <a href="{SUBMIT_CV_URL}">upload your CV for no-cost, practical feedback on how your background reads to NZ employers &mdash; Tate typically responds within one business day.</a></p>
</div>"""

    return f"""\
<!-- ANCHOR: where_to_find_roles -->
<section data-section="where_to_find_roles" data-last-updated="{meta['last_updated']}">
<h2>Where to Find Roles</h2>

<ul>
{board_items}</ul>

{cold_html}
</section>"""


# ─────────────────────────────────────────────
# BROWSE ALL ROLES (replaces subscription CTA — T-FIX-04)
# ─────────────────────────────────────────────

def render_browse_links(d):
    role = d["role"]
    meta = d["meta"]
    country = meta["country"]
    hub_url = role.get("hub_url", "")
    hub_label = role.get("hub_label", "")

    # Counterpart hub
    if d.get("counterpart", {}).get("exists"):
        c = d["counterpart"]
        other_country = c["country"]
        other_hub_url = hub_url.replace("-in-new-zealand", "-in-australia").replace("nz-", "au-")
        other_label = hub_label.replace("NZ", "AU").replace("New Zealand", "Australia")

        return f"""\
<p class="mrr-browse"><a href="{hub_url}">&larr; Browse all {hub_label}</a> &nbsp;|&nbsp; <a href="{c['url'].replace(d['page']['slug'].replace('new-zealand', 'australia'), '').rstrip('/')}/../">Browse all {role['role_family_label']} roles in Australia</a></p>"""
    else:
        return f"""\
<p class="mrr-browse"><a href="{hub_url}">&larr; Browse all {hub_label}</a></p>"""


# ─────────────────────────────────────────────
# WHAT TO EXPECT
# ─────────────────────────────────────────────

def render_what_to_expect(d):
    text = d.get("what_to_expect", "")
    if not text:
        return ""
    return f"""\
<div class="mrr-info">
<p><strong>What to expect:</strong> {text}</p>
</div>"""


# ─────────────────────────────────────────────
# FULL PAGE ASSEMBLER
# ─────────────────────────────────────────────

def render_page(d):
    meta = d["meta"]
    page = d["page"]
    role = d["role"]

    sections = [
        f'<!-- MRR_TEMPLATE_VERSION: {TEMPLATE_VERSION} -->',
        f'<!-- {meta["format_tag"]} -->',
        f'<!-- REGISTRY-ANCHOR: role_id={meta["nzr_code"]} | anzsco={role["anzsco_code"]} | country={meta["country"]} | status=live -->',
        "",
        render_schema(d),
        "",
        render_css(),
        "",
        '<div class="mrr-page">',
        "",
        f'<h1>{page["title"]}</h1>',
        "",
        f'<p>{d["intro"]}</p>',
        "",
        render_ad_block(),
        "",
        render_role_snapshot(d),
        "",
        render_salary(d),
        "",
        render_regional_demand(d),
        "",
        render_licensing(d),
        "",
        render_immigration(d),
        "",
        render_readiness(d),
        "",
        render_job_boards(d),
        "",
        render_browse_links(d),
        "",
        render_what_to_expect(d),
        "",
        "</div>",
        "",
        f'[wpcode id="{d["wpcode_footer_id"]}"]',
        "",
        f'<!-- END MRR PAGE: {meta["nzr_code"]} -->',
    ]

    html = "\n".join(sections)
    # GR-8 enforcement: convert any literal em-dashes from data fields to HTML entity
    html = html.replace("—", "&mdash;")
    return html


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="MRR Template v2.0 Renderer")
    parser.add_argument("--data", required=True, help="Path to role JSON data file")
    parser.add_argument("--out", help="Output HTML file path (default: stdout)")
    parser.add_argument("--validate", action="store_true", help="Run 12-point validator after render")
    args = parser.parse_args()

    if not os.path.exists(args.data):
        print(f"ERROR: Data file not found: {args.data}", file=sys.stderr)
        sys.exit(1)

    with open(args.data, "r", encoding="utf-8") as f:
        data = json.load(f)

    html = render_page(data)

    if args.out:
        os.makedirs(os.path.dirname(args.out), exist_ok=True) if os.path.dirname(args.out) else None
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"Written: {args.out}")
    else:
        print(html)

    if args.validate:
        from validate import run_validation
        results = run_validation(html, data)
        passed = sum(1 for r in results if r["pass"])
        print(f"\nValidation: {passed}/{len(results)} checks passed")
        for r in results:
            status = "PASS" if r["pass"] else "FAIL"
            print(f"  [{status}] {r['check']}")
            if not r["pass"]:
                print(f"         Detail: {r['detail']}")
        if passed < len(results):
            sys.exit(1)


if __name__ == "__main__":
    main()
