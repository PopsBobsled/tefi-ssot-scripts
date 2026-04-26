/**
 * CareerVault_Format_AppsScript.gs
 *
 * NO-RISK visual formatting + minimal data validation for Career_Vault_v3_5
 * Target sheet: 1GN95DkidLCsGVdJaY5sSVQI6kBesTfayHcj4qPB5IAo
 *
 * GUARANTEES:
 *   - Zero cell values are written
 *   - Zero headers are changed
 *   - Zero columns are added, deleted, or reordered
 *   - All data validation is "warning-only" (setAllowInvalid(true)) so Relay
 *     writes can never be blocked
 *   - Date number-format only changes display, not stored value
 *
 * VISUAL DESIGN (v2 — column-grouped pastels):
 *   - Each sheet's columns are split into logical groups
 *   - Each group gets its own pastel header background (calm, "high-quality" feel)
 *   - Adjacent groups use contrasting pastels so eye sees boundaries
 *   - Header row: bold black text, 11pt, 32px tall — colour band reads clearly
 *   - Row 2 acts as a 6px coloured underline bar reinforcing each group
 *   - Frozen rows: 2 (header + bar)
 *
 * USAGE:
 *   1. Open the v3_5 Sheet in your browser
 *   2. Extensions -> Apps Script
 *   3. Paste this entire file (replace the previous version)
 *   4. Save (Ctrl+S)
 *   5. Run formatVault()
 *   6. Reload the sheet to see the formatting
 *
 * REVERT: run unformatVault()
 *
 * Updated: 2026-04-22
 */

// ============================================================
// CONFIGURATION
// ============================================================

var FORMAT_TARGET_FILE_ID = '1GN95DkidLCsGVdJaY5sSVQI6kBesTfayHcj4qPB5IAo';

// Pastel palette — calm, readable, contrasts with adjacent groups
var PALETTE = {
  TEAL:     '#d1ecea',  // identity / records
  SAGE:     '#dde8d4',  // location
  PEACH:    '#fbe2cf',  // citizenship / work rights / scope
  LAVENDER: '#e0d6ec',  // targets
  BUTTER:   '#fdf3c8',  // salary / metrics
  ROSE:     '#f4d4d6',  // skills / credentials / evidence
  SKY:      '#d4e4f5',  // pipeline status / files / role
  LILAC:    '#ead4ec',  // generated content / output
  STONE:    '#e2e0db',  // system / provenance / schema
  MINT:     '#d4ecdf',  // achievements / metrics
  BLUSH:    '#f5dfd2',  // references / notes
  STEEL:    '#d6dde4'   // intake / admin
};

// Per-sheet column groupings.
// Each group: {start, end, color, label}  (1-indexed inclusive col numbers)
var SHEET_GROUPS = {

  'PERSON_PROFILE': [
    {start: 1,  end: 9,  color: PALETTE.TEAL,     label: 'Identity & Contact'},
    {start: 10, end: 13, color: PALETTE.SAGE,     label: 'Location'},
    {start: 14, end: 21, color: PALETTE.PEACH,    label: 'Citizenship & Work Rights'},
    {start: 22, end: 27, color: PALETTE.LAVENDER, label: 'Targets'},
    {start: 28, end: 34, color: PALETTE.BUTTER,   label: 'Salary & Market Readiness'},
    {start: 35, end: 43, color: PALETTE.ROSE,     label: 'Skills & Credentials'},
    {start: 44, end: 55, color: PALETTE.SKY,      label: 'Pipeline Status & Files'},
    {start: 56, end: 67, color: PALETTE.LILAC,    label: 'Generated Content'},
    {start: 68, end: 85, color: PALETTE.STONE,    label: 'System & Provenance'}
  ],

  // CAREER_DETAIL — grouped by record type segment
  // _record_type=1 / Role_ID=2 / Person_ID=3 / [role fields 4-45] /
  // Ach_ID=46 / Role_ID=47 / [achievement fields 48-77] /
  // Skill_ID=78 / [skill fields 79-89] /
  // Evidence_ID=90 / [evidence fields 91-100] / _schema_version=101
  'CAREER_DETAIL': [
    {start: 1,   end: 3,   color: PALETTE.TEAL,     label: 'Record Keys'},
    {start: 4,   end: 14,  color: PALETTE.SKY,      label: 'Role: Employer & Period'},
    {start: 15, end: 26,  color: PALETTE.PEACH,    label: 'Role: Scope'},
    {start: 27, end: 34,  color: PALETTE.LAVENDER, label: 'Role: Tools & Stakeholders'},
    {start: 35, end: 45,  color: PALETTE.BLUSH,    label: 'Role: Classification & Refs'},
    {start: 46, end: 54,  color: PALETTE.MINT,     label: 'Achievement: Story'},
    {start: 55, end: 64,  color: PALETTE.BUTTER,   label: 'Achievement: Metrics'},
    {start: 65, end: 77,  color: PALETTE.LILAC,    label: 'Achievement: Tags & Flags'},
    {start: 78, end: 89,  color: PALETTE.ROSE,     label: 'Skill'},
    {start: 90, end: 100, color: PALETTE.SAGE,     label: 'Evidence'},
    {start: 101, end: 101, color: PALETTE.STONE,   label: 'Schema'}
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
    {start: 14, end: 14, color: PALETTE.STONE,    label: 'Schema'}
  ],

  'ADMIN_CONSOLE': [
    {start: 1,  end: 5,  color: PALETTE.STEEL,    label: 'Lookup Tables'},
    {start: 6,  end: 9,  color: PALETTE.MINT,     label: 'QA Ratings'},
    {start: 10, end: 12, color: PALETTE.BLUSH,    label: 'Review Notes'}
  ],

  'INTAKE_LOG': [
    {start: 1,  end: 4,  color: PALETTE.TEAL,     label: 'Intake Identity'},
    {start: 5,  end: 8,  color: PALETTE.SKY,      label: 'Source File'},
    {start: 9,  end: 12, color: PALETTE.BUTTER,   label: 'Field Counts'},
    {start: 13, end: 14, color: PALETTE.PEACH,    label: 'Vault State'},
    {start: 15, end: 17, color: PALETTE.STONE,    label: 'Versions & Operator'},
    {start: 18, end: 20, color: PALETTE.BLUSH,    label: 'Notes & S1E'}
  ]
};

// Date column header patterns (yyyy-mm-dd format)
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
  /^intake_date$/i
];

// Dropdown rules — only stable, closed enums. Warning-only.
var DROPDOWN_RULES = {
  'PERSON_PROFILE': {},
  'CAREER_DETAIL': {
    'Is_Current':         ['TRUE', 'FALSE'],
    'Employment_Type':    ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Volunteer'],
    'Work_Model':         ['Onsite', 'Hybrid', 'Remote'],
    'Display_On_CV':      ['TRUE', 'FALSE'],
    'Display_On_LinkedIn':['TRUE', 'FALSE'],
    'Is_Core':            ['TRUE', 'FALSE'],
    'Proficiency_Level':  ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  'TARGET_ROLE_PACK': {
    'is_active':          ['TRUE', 'FALSE']
  },
  'OUTPUT_LOG': {},
  'ADMIN_CONSOLE': {
    'Active':             ['TRUE', 'FALSE']
  },
  'INTAKE_LOG': {
    's1e_stamped':        ['TRUE', 'FALSE']
  }
};

var MAX_VALIDATION_ROWS = 5000;

// ============================================================
// MAIN ENTRY POINT
// ============================================================

function formatVault() {
  var ss = SpreadsheetApp.openById(FORMAT_TARGET_FILE_ID);
  Logger.log('=== Formatting Career_Vault: ' + ss.getName() + ' ===');

  var summary = {sheets: 0, groupsApplied: 0, datesFormatted: 0, dropdownsAdded: 0};

  Object.keys(SHEET_GROUPS).forEach(function(sheetName) {
    var sh = ss.getSheetByName(sheetName);
    if (!sh) {
      Logger.log('SKIP: sheet "' + sheetName + '" not found');
      return;
    }
    summary.sheets++;
    Logger.log('--- ' + sheetName + ' ---');

    var groupCount = applyGroupedHeaderBands_(sh, SHEET_GROUPS[sheetName]);
    summary.groupsApplied += groupCount;
    Logger.log('  Groups applied: ' + groupCount);

    var dateCount = applyDateFormats_(sh);
    summary.datesFormatted += dateCount;
    Logger.log('  Date columns formatted: ' + dateCount);

    var ddCount = applyDropdowns_(sh, DROPDOWN_RULES[sheetName] || {});
    summary.dropdownsAdded += ddCount;
    Logger.log('  Dropdown columns added: ' + ddCount);
  });

  Logger.log('=== DONE ===');
  Logger.log('Sheets formatted:     ' + summary.sheets);
  Logger.log('Groups applied:       ' + summary.groupsApplied);
  Logger.log('Date columns set:     ' + summary.datesFormatted);
  Logger.log('Dropdowns added:      ' + summary.dropdownsAdded);
  Logger.log('No data was modified. Relay wiring untouched.');
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Apply per-group pastel band:
 *   - row 1 (header): pastel bg, bold black text, 11pt, 32px tall
 *   - row 2 (band):   same pastel bg, no text, 6px tall — acts as visual underline
 *
 * If row 2 already contains data (e.g. a real client row), the band is skipped
 * for that sheet to avoid burying data. We detect this by checking if row 2
 * has any non-empty cells before applying.
 */
function applyGroupedHeaderBands_(sh, groups) {
  var lastCol = sh.getLastColumn();
  if (lastCol === 0 || groups.length === 0) return 0;

  // Determine if row 2 has data — if so, skip the underline band
  var row2HasData = false;
  if (sh.getLastRow() >= 2) {
    var row2 = sh.getRange(2, 1, 1, lastCol).getValues()[0];
    row2HasData = row2.some(function(v) { return v !== null && String(v).trim() !== ''; });
  }

  groups.forEach(function(g) {
    var width = g.end - g.start + 1;
    if (g.start > lastCol) return;
    if (g.end > lastCol) width = lastCol - g.start + 1;

    // Header row
    sh.getRange(1, g.start, 1, width)
      .setBackground(g.color)
      .setFontColor('#202020')
      .setFontWeight('bold')
      .setFontSize(11)
      .setHorizontalAlignment('left')
      .setVerticalAlignment('middle')
      .setWrap(false);
  });

  // Header row height
  sh.setRowHeight(1, 32);

  // Optional underline band in row 2 (only if row 2 is empty)
  if (!row2HasData) {
    groups.forEach(function(g) {
      var width = g.end - g.start + 1;
      if (g.start > lastCol) return;
      if (g.end > lastCol) width = lastCol - g.start + 1;
      sh.getRange(2, g.start, 1, width).setBackground(g.color);
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
  var count = 0;

  // Start row depends on whether row 2 is the underline band or real data
  var startRow = (sh.getFrozenRows() >= 2) ? 3 : 2;
  var numRows = MAX_VALIDATION_ROWS - startRow + 1;

  for (var c = 0; c < headers.length; c++) {
    var header = String(headers[c] || '').trim();
    if (!header) continue;

    var isDate = DATE_HEADER_PATTERNS.some(function(re) { return re.test(header); });
    if (!isDate) continue;

    sh.getRange(startRow, c + 1, numRows, 1).setNumberFormat('yyyy-mm-dd');
    count++;
  }

  return count;
}

function applyDropdowns_(sh, rules) {
  var lastCol = sh.getLastColumn();
  if (lastCol === 0 || Object.keys(rules).length === 0) return 0;

  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  var count = 0;

  var startRow = (sh.getFrozenRows() >= 2) ? 3 : 2;
  var numRows = MAX_VALIDATION_ROWS - startRow + 1;

  for (var c = 0; c < headers.length; c++) {
    var header = String(headers[c] || '').trim();
    if (!header || !rules.hasOwnProperty(header)) continue;

    var allowedValues = rules[header];
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(allowedValues, true)
      .setAllowInvalid(true)
      .setHelpText('Suggested values: ' + allowedValues.join(', ') + ' (others allowed but flagged)')
      .build();

    sh.getRange(startRow, c + 1, numRows, 1).setDataValidation(rule);
    count++;
  }

  return count;
}

// ============================================================
// REVERSAL — undo all formatting from this script
// ============================================================

function unformatVault() {
  var ss = SpreadsheetApp.openById(FORMAT_TARGET_FILE_ID);
  Logger.log('=== Reverting formatting on Career_Vault ===');

  Object.keys(SHEET_GROUPS).forEach(function(sheetName) {
    var sh = ss.getSheetByName(sheetName);
    if (!sh) return;
    Logger.log('--- ' + sheetName + ' ---');

    var lastCol = sh.getLastColumn();
    if (lastCol === 0) return;

    // Reset rows 1-2 appearance
    sh.getRange(1, 1, 2, lastCol)
      .setBackground(null)
      .setFontColor(null)
      .setFontWeight('normal')
      .setFontSize(10);

    sh.setRowHeight(1, 21);
    sh.setRowHeight(2, 21);
    sh.setFrozenRows(0);

    // Clear validations and date formats on all rows below header
    sh.getRange(2, 1, MAX_VALIDATION_ROWS - 1, lastCol).clearDataValidations();
    sh.getRange(2, 1, MAX_VALIDATION_ROWS - 1, lastCol).setNumberFormat('General');
  });

  Logger.log('=== Reverted ===');
}
