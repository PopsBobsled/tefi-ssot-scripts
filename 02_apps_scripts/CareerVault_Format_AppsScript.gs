/**
 * CareerVault_Format_AppsScript.gs
 *
 * NO-RISK visual formatting + minimal data validation for Career_Vault_v3_5
 * Target sheet: 1GN95DkidLCsGVdJaY5sSVQI6kBesTfayHcj4qPB5IAo
 *
 * GUARANTEES:
 *   - Zero cell values are written (except headers for new tabs in setupStep12And13)
 *   - Zero existing headers are changed
 *   - All data validation is "warning-only" (setAllowInvalid(true))
 *   - Date number-format only changes display, not stored value
 *
 * USAGE:
 *   Steps 12+13 (first run): run setupStep12And13()
 *   Re-format only:          run formatVault()
 *   Undo all formatting:     run unformatVault()
 *
 * Updated: 2026-05-01 (Step 12 + 13)
 *   - SESSION_LOG tab: 20 cols per D4 §3.2
 *   - INTERVIEW_LOG tab: 21 cols per D4 §3.3, feature flag OFF per D4 Q2(b)
 *   - OUTPUT_LOG extended: 7 new cols 15-21 per D4 §3.4
 *   - setupStep12And13() — idempotent setup entry point
 *   - DATE_HEADER_PATTERNS extended for _at datetime fields
 * Updated: 2026-04-30
 *   - PERSON_PROFILE extended to 101 cols, two new pastel groups
 *   - 10 new dropdown rules on PERSON_PROFILE
 * Updated: 2026-04-22
 */

// ============================================================
// CONFIGURATION
// ============================================================

var FORMAT_TARGET_FILE_ID = '1GN95DkidLCsGVdJaY5sSVQI6kBesTfayHcj4qPB5IAo';

var PALETTE = {
  TEAL:     '#d1ecea',
  SAGE:     '#dde8d4',
  PEACH:    '#fbe2cf',
  LAVENDER: '#e0d6ec',
  BUTTER:   '#fdf3c8',
  ROSE:     '#f4d4d6',
  SKY:      '#d4e4f5',
  LILAC:    '#ead4ec',
  STONE:    '#e2e0db',
  MINT:     '#d4ecdf',
  BLUSH:    '#f5dfd2',
  STEEL:    '#d6dde4'
};

var SHEET_GROUPS = {

  'PERSON_PROFILE': [
    {start: 1,   end: 9,   color: PALETTE.TEAL,     label: 'Identity & Contact'},
    {start: 10,  end: 13,  color: PALETTE.SAGE,     label: 'Location'},
    {start: 14,  end: 21,  color: PALETTE.PEACH,    label: 'Citizenship & Work Rights'},
    {start: 22,  end: 27,  color: PALETTE.LAVENDER, label: 'Targets'},
    {start: 28,  end: 34,  color: PALETTE.BUTTER,   label: 'Salary & Market Readiness'},
    {start: 35,  end: 43,  color: PALETTE.ROSE,     label: 'Skills & Credentials'},
    {start: 44,  end: 55,  color: PALETTE.SKY,      label: 'Pipeline Status & Files'},
    {start: 56,  end: 67,  color: PALETTE.LILAC,    label: 'Generated Content'},
    {start: 68,  end: 85,  color: PALETTE.STONE,    label: 'System & Provenance'},
    {start: 86,  end: 96,  color: PALETTE.MINT,     label: 'Vault Maturity & Pipeline Readiness'},
    {start: 97,  end: 101, color: PALETTE.STEEL,    label: 'Zoho Mirror Fields'}
  ],

  'CAREER_DETAIL': [
    {start: 1,   end: 3,   color: PALETTE.TEAL,     label: 'Record Keys'},
    {start: 4,   end: 14,  color: PALETTE.SKY,      label: 'Role: Employer & Period'},
    {start: 15,  end: 26,  color: PALETTE.PEACH,    label: 'Role: Scope'},
    {start: 27,  end: 34,  color: PALETTE.LAVENDER, label: 'Role: Tools & Stakeholders'},
    {start: 35,  end: 45,  color: PALETTE.BLUSH,    label: 'Role: Classification & Refs'},
    {start: 46,  end: 54,  color: PALETTE.MINT,     label: 'Achievement: Story'},
    {start: 55,  end: 64,  color: PALETTE.BUTTER,   label: 'Achievement: Metrics'},
    {start: 65,  end: 77,  color: PALETTE.LILAC,    label: 'Achievement: Tags & Flags'},
    {start: 78,  end: 89,  color: PALETTE.ROSE,     label: 'Skill'},
    {start: 90,  end: 100, color: PALETTE.SAGE,     label: 'Evidence'},
    {start: 101, end: 101, color: PALETTE.STONE,    label: 'Schema'}
  ],

  'TARGET_ROLE_PACK': [
    {start: 1,  end: 6,  color: PALETTE.TEAL,     label: 'Pack Identity'},
    {start: 7,  end: 12, color: PALETTE.LAVENDER, label: 'Targets'},
    {start: 13, end: 17, color: PALETTE.ROSE,     label: 'Skill & Achievement Filters'},
    {start: 18, end: 23, color: PALETTE.BUTTER,   label: 'Curation Rules'},
    {start: 24, end: 25, color: PALETTE.MINT,     label: 'Curated IDs'},
    {start: 26, end: 27, color: PALETTE.LILAC,    label: 'Output & Notes'},
    {start: 28, end: 28, color: PALETTE.STONE,    label: 'Schema'}
  ],

  'OUTPUT_LOG': [
    {start: 1,  end: 3,  color: PALETTE.TEAL,     label: 'Build Identity'},
    {start: 4,  end: 6,  color: PALETTE.LAVENDER, label: 'Template'},
    {start: 7,  end: 9,  color: PALETTE.LILAC,    label: 'Output'},
    {start: 10, end: 13, color: PALETTE.STONE,    label: 'Run Metadata'},
    {start: 14, end: 14, color: PALETTE.STONE,    label: 'Schema'},
    {start: 15, end: 17, color: PALETTE.PEACH,    label: 'Delivery'},
    {start: 18, end: 21, color: PALETTE.SKY,      label: 'Registry'}
  ],

  'ADMIN_CONSOLE': [
    {start: 1,  end: 5,  color: PALETTE.STEEL,  label: 'Lookup Tables'},
    {start: 6,  end: 9,  color: PALETTE.MINT,   label: 'QA Ratings'},
    {start: 10, end: 12, color: PALETTE.BLUSH,  label: 'Review Notes'}
  ],

  'INTAKE_LOG': [
    {start: 1,  end: 4,  color: PALETTE.TEAL,   label: 'Intake Identity'},
    {start: 5,  end: 8,  color: PALETTE.SKY,    label: 'Source File'},
    {start: 9,  end: 12, color: PALETTE.BUTTER, label: 'Field Counts'},
    {start: 13, end: 14, color: PALETTE.PEACH,  label: 'Vault State'},
    {start: 15, end: 17, color: PALETTE.STONE,  label: 'Versions & Operator'},
    {start: 18, end: 20, color: PALETTE.BLUSH,  label: 'Notes & S1E'}
  ],

  // Step 12 (2026-05-01)
  'SESSION_LOG': [
    {start: 1,  end: 6,  color: PALETTE.TEAL,   label: 'Session Identity'},
    {start: 7,  end: 8,  color: PALETTE.SAGE,   label: 'Format'},
    {start: 9,  end: 14, color: PALETTE.SKY,    label: 'Content & Follow-up'},
    {start: 15, end: 17, color: PALETTE.BUTTER, label: 'Notes & Engagement'},
    {start: 18, end: 19, color: PALETTE.LILAC,  label: 'Recording Links'},
    {start: 20, end: 20, color: PALETTE.STONE,  label: 'Schema'}
  ],

  // INTERVIEW_LOG — FEATURE FLAG OFF per D4 Q2(b).
  // Tab exists; no automation reads from it.
  // Activate when first T4 interview engagement begins OR Phase 2 starts.
  'INTERVIEW_LOG': [
    {start: 1,  end: 4,  color: PALETTE.TEAL,   label: 'Interview Identity'},
    {start: 5,  end: 10, color: PALETTE.SAGE,   label: 'Job & Format'},
    {start: 11, end: 13, color: PALETTE.SKY,    label: 'Preparation & Content'},
    {start: 14, end: 16, color: PALETTE.ROSE,   label: 'Assessment & Outcome'},
    {start: 17, end: 20, color: PALETTE.BUTTER, label: 'Feedback & Learning'},
    {start: 21, end: 21, color: PALETTE.STONE,  label: 'Schema'}
  ]
};

var DATE_HEADER_PATTERNS = [
  /_date$/i,
  /^Start_Date$/i,
  /^End_Date$/i,
  /^Expiry_Date$/i,
  /^Evidence_Date$/i,
  /^Review_Date$/i,
  /^Last_Validated_Date$/i,
  /^pack_created_date$/i,
  /^pack_closed_date$/i,
  /^lead_date$/i,
  /^cv_delivered_date$/i,
  /^payment_received_date$/i,
  /^last_profile_review_date$/i,
  /^last_upsert_utc$/i,
  /^created_at$/i,
  /^Last_Updated$/i,
  /^s1e_stamp_date$/i,
  /^intake_date$/i,
  /^session_date$/i,
  /^interview_date$/i,
  /^next_session_planned_date$/i,
  /^followup_due_date$/i,
  /^delivered_to_client_at$/i,
  /^client_acknowledged_at$/i
];

var DROPDOWN_RULES = {
  'PERSON_PROFILE': {
    'vh_ready_for_t1_snapshot':          ['TRUE', 'FALSE'],
    'vh_ready_for_cm_report':            ['TRUE', 'FALSE'],
    'vh_ready_for_sam_report':           ['TRUE', 'FALSE'],
    'vh_ready_for_career_impact_report': ['TRUE', 'FALSE'],
    'vh_ready_for_session1_prep':        ['TRUE', 'FALSE'],
    'vh_ready_for_proposal':             ['TRUE', 'FALSE'],
    'english_level':                     ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Beginner'],
    'highest_qualification':             ['PhD', 'Masters', 'Chartered', 'Bachelors', 'Trades Qualified', 'Professional Qualified', 'Diploma', 'Some University', 'High School', 'Grade School'],
    'communication_preference':          ['Email', 'WhatsApp', 'Mobile', 'Video Call'],
    'tenant_id':                         ['TEFI']
  },
  'CAREER_DETAIL': {
    'Is_Current':          ['TRUE', 'FALSE'],
    'Employment_Type':     ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Volunteer'],
    'Work_Model':          ['Onsite', 'Hybrid', 'Remote'],
    'Display_On_CV':       ['TRUE', 'FALSE'],
    'Display_On_LinkedIn': ['TRUE', 'FALSE'],
    'Is_Core':             ['TRUE', 'FALSE'],
    'Proficiency_Level':   ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  'TARGET_ROLE_PACK': {
    'is_active': ['TRUE', 'FALSE']
  },
  'OUTPUT_LOG': {
    'client_satisfaction_rating': ['High', 'Medium', 'Low', 'Not Captured'],
    'output_archived':            ['TRUE', 'FALSE']
  },
  'ADMIN_CONSOLE': {
    'Active': ['TRUE', 'FALSE']
  },
  'INTAKE_LOG': {
    's1e_stamped': ['TRUE', 'FALSE']
  },
  'SESSION_LOG': {
    'session_type':            ['S1 Strengths', 'S1c Skills', 'S2 Content', 'S3 Render',
                                'S4 Polish', 'S5 Launch', 'Tier1 Review', 'T4 Coaching',
                                'Interview Coaching', 'Other'],
    'session_format':          ['Video', 'Phone', 'In-Person', 'Async'],
    'followup_owner':          ['Tate', 'Client', 'VA', 'None'],
    'client_engagement_score': ['High', 'Medium', 'Low', 'Disengaged']
  },
  'INTERVIEW_LOG': {
    'role_seniority':              ['Intermediate', 'Senior', 'Team Lead', 'Manager',
                                    'Senior Manager', 'Head of', 'Director', 'GM / Executive', 'Other'],
    'interview_round':             ['Screen', '1st', '2nd', 'Panel', 'Final', 'Other'],
    'interview_format':            ['Phone', 'Video', 'In-Person', 'Take-home'],
    'outcome':                     ['Awaiting', 'Advanced', 'Rejected', 'Withdrawn', 'Offer'],
    'rejection_reason_classified': ['Skills Gap', 'Culture Fit', 'Visa', 'Salary',
                                    'Process', 'No Reason Given', 'Other']
  }
};

var MAX_VALIDATION_ROWS = 5000;

// ============================================================
// STEP 12+13 SETUP — run once (idempotent)
// ============================================================

/**
 * Creates SESSION_LOG and INTERVIEW_LOG tabs, writes headers,
 * appends 7 new columns to OUTPUT_LOG, then formats everything.
 * Safe to re-run: skips any step already done.
 */
function setupStep12And13() {
  var ss = SpreadsheetApp.openById(FORMAT_TARGET_FILE_ID);
  Logger.log('=== Steps 12+13 — ' + ss.getName() + ' ===');

  var SESSION_HEADERS = [
    'session_id', 'person_id', 'pack_id', 'session_date', 'session_sequence',
    'session_type', 'session_duration_min', 'session_format',
    'session_outcome_summary', 'key_decisions', 'next_steps',
    'next_session_planned_date', 'followup_owner', 'followup_due_date',
    'vault_updates_made', 'materials_shared', 'client_engagement_score',
    'session_recording_url', 'transcript_url', '_schema_version'
  ];

  var INTERVIEW_HEADERS = [
    'interview_id', 'person_id', 'pack_id', 'interview_date',
    'employer_name', 'role_applied_for', 'role_seniority', 'interview_round',
    'interviewer_role', 'interview_format', 'preparation_done', 'topics_covered',
    'questions_asked', 'candidate_perceived_strengths', 'candidate_perceived_weaknesses',
    'outcome', 'feedback_received', 'rejection_reason_classified',
    'lessons_for_next_interview', 'coaching_intervention_notes', '_schema_version'
  ];

  var OUTPUT_NEW = [
    'delivered_to_client_at', 'client_acknowledged_at', 'client_satisfaction_rating',
    'output_stage_code', 'ssot_zoho_deal_id', 'output_archived', 'supersedes_build_id'
  ];

  // 1. SESSION_LOG
  var sl = ss.getSheetByName('SESSION_LOG');
  if (!sl) { sl = ss.insertSheet('SESSION_LOG'); Logger.log('SESSION_LOG: created'); }
  else { Logger.log('SESSION_LOG: exists'); }
  if (!sl.getRange(1,1).getValue()) {
    sl.getRange(1, 1, 1, SESSION_HEADERS.length).setValues([SESSION_HEADERS]);
    Logger.log('SESSION_LOG: ' + SESSION_HEADERS.length + ' headers written');
  } else { Logger.log('SESSION_LOG: headers present, skipped'); }

  // 2. INTERVIEW_LOG (feature flag OFF)
  var il = ss.getSheetByName('INTERVIEW_LOG');
  if (!il) { il = ss.insertSheet('INTERVIEW_LOG'); Logger.log('INTERVIEW_LOG: created [FLAG OFF]'); }
  else { Logger.log('INTERVIEW_LOG: exists'); }
  if (!il.getRange(1,1).getValue()) {
    il.getRange(1, 1, 1, INTERVIEW_HEADERS.length).setValues([INTERVIEW_HEADERS]);
    Logger.log('INTERVIEW_LOG: ' + INTERVIEW_HEADERS.length + ' headers written');
  } else { Logger.log('INTERVIEW_LOG: headers present, skipped'); }

  // 3. OUTPUT_LOG +7 cols
  var ol = ss.getSheetByName('OUTPUT_LOG');
  if (!ol) {
    Logger.log('ERROR: OUTPUT_LOG not found — Step 13 skipped');
  } else {
    var lc = ol.getLastColumn();
    if (lc === 14) {
      ol.getRange(1, 15, 1, OUTPUT_NEW.length).setValues([OUTPUT_NEW]);
      Logger.log('OUTPUT_LOG: 7 headers written at cols 15-21');
    } else if (lc === 21) {
      Logger.log('OUTPUT_LOG: already 21 cols — skipped');
    } else {
      Logger.log('WARNING: OUTPUT_LOG has ' + lc + ' cols (expected 14 or 21)');
    }
  }

  // 4. Format all
  Logger.log('Formatting...');
  formatVault();
  Logger.log('=== Steps 12+13 COMPLETE ===');
}

// ============================================================
// MAIN ENTRY POINT
// ============================================================

function formatVault() {
  var ss = SpreadsheetApp.openById(FORMAT_TARGET_FILE_ID);
  Logger.log('=== formatVault: ' + ss.getName() + ' ===');
  var sum = {sheets:0, groups:0, dates:0, dropdowns:0};

  Object.keys(SHEET_GROUPS).forEach(function(name) {
    var sh = ss.getSheetByName(name);
    if (!sh) { Logger.log('SKIP: ' + name); return; }
    sum.sheets++;
    Logger.log('--- ' + name + ' ---');
    sum.groups    += applyGroupedHeaderBands_(sh, SHEET_GROUPS[name]);
    sum.dates     += applyDateFormats_(sh);
    sum.dropdowns += applyDropdowns_(sh, DROPDOWN_RULES[name] || {});
  });

  Logger.log('Sheets: ' + sum.sheets + ' | Groups: ' + sum.groups +
             ' | Dates: ' + sum.dates + ' | Dropdowns: ' + sum.dropdowns);
  Logger.log('No data modified.');
}

// ============================================================
// HELPERS
// ============================================================

function applyGroupedHeaderBands_(sh, groups) {
  var lastCol = sh.getLastColumn();
  if (lastCol === 0 || groups.length === 0) return 0;

  var row2HasData = false;
  if (sh.getLastRow() >= 2) {
    var r2 = sh.getRange(2, 1, 1, lastCol).getValues()[0];
    row2HasData = r2.some(function(v) { return v !== null && String(v).trim() !== ''; });
  }

  groups.forEach(function(g) {
    var w = Math.min(g.end, lastCol) - g.start + 1;
    if (g.start > lastCol || w < 1) return;
    sh.getRange(1, g.start, 1, w)
      .setBackground(g.color).setFontColor('#202020')
      .setFontWeight('bold').setFontSize(11)
      .setHorizontalAlignment('left').setVerticalAlignment('middle').setWrap(false);
  });
  sh.setRowHeight(1, 32);

  if (!row2HasData) {
    groups.forEach(function(g) {
      var w = Math.min(g.end, lastCol) - g.start + 1;
      if (g.start > lastCol || w < 1) return;
      sh.getRange(2, g.start, 1, w).setBackground(g.color);
    });
    sh.setRowHeight(2, 8);
    if (sh.getFrozenRows() < 2) sh.setFrozenRows(2);
  } else {
    if (sh.getFrozenRows() < 1) sh.setFrozenRows(1);
  }
  return groups.length;
}

function applyDateFormats_(sh) {
  var lastCol = sh.getLastColumn();
  if (lastCol === 0) return 0;
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  var startRow = (sh.getFrozenRows() >= 2) ? 3 : 2;
  var numRows  = MAX_VALIDATION_ROWS - startRow + 1;
  var count = 0;
  for (var c = 0; c < headers.length; c++) {
    var h = String(headers[c] || '').trim();
    if (!h) continue;
    if (DATE_HEADER_PATTERNS.some(function(re) { return re.test(h); })) {
      sh.getRange(startRow, c+1, numRows, 1).setNumberFormat('yyyy-mm-dd');
      count++;
    }
  }
  return count;
}

function applyDropdowns_(sh, rules) {
  var lastCol = sh.getLastColumn();
  if (lastCol === 0 || Object.keys(rules).length === 0) return 0;
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  var startRow = (sh.getFrozenRows() >= 2) ? 3 : 2;
  var numRows  = MAX_VALIDATION_ROWS - startRow + 1;
  var count = 0;
  for (var c = 0; c < headers.length; c++) {
    var h = String(headers[c] || '').trim();
    if (!h || !rules.hasOwnProperty(h)) continue;
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(rules[h], true)
      .setAllowInvalid(true)
      .setHelpText('Suggested: ' + rules[h].join(', '))
      .build();
    sh.getRange(startRow, c+1, numRows, 1).setDataValidation(rule);
    count++;
  }
  return count;
}

// ============================================================
// REVERSAL
// ============================================================

function unformatVault() {
  var ss = SpreadsheetApp.openById(FORMAT_TARGET_FILE_ID);
  Logger.log('=== unformatVault ===');
  Object.keys(SHEET_GROUPS).forEach(function(name) {
    var sh = ss.getSheetByName(name);
    if (!sh) return;
    var lc = sh.getLastColumn();
    if (lc === 0) return;
    sh.getRange(1, 1, 2, lc)
      .setBackground(null).setFontColor(null)
      .setFontWeight('normal').setFontSize(10);
    sh.setRowHeight(1, 21);
    sh.setRowHeight(2, 21);
    sh.setFrozenRows(0);
    sh.getRange(2, 1, MAX_VALIDATION_ROWS-1, lc).clearDataValidations();
    sh.getRange(2, 1, MAX_VALIDATION_ROWS-1, lc).setNumberFormat('General');
  });
  Logger.log('=== Reverted ===');
}
