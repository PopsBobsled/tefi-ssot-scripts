/**
 * Career Vault v3.5 — Schema-Aware Sync (Local .xlsx → Live Google Sheet)
 * ──────────────────────────────────────────────────────────────────────
 *
 * PURPOSE
 *   Sync data from local Career_Vault_v3_5.xlsx (uploaded to Drive as a Sheet)
 *   into the live Career Vault, with header-position-aware safety checks.
 *
 *   Local file:  C:\Users\Joe\Claude\Career_Vault_v3_5.xlsx
 *   Live sheet:  ID 1GN95DkidLCsGVdJaY5sSVQI6kBesTfayHcj4qPB5IAo
 *
 * WHAT THIS SCRIPT DOES
 *   1. Compares headers between source (local upload) and target (live)
 *      sheet-by-sheet, column-by-column.
 *   2. Classifies each column comparison into one of five outcomes:
 *        ✓ MATCH                 — same header at same position
 *        ⚠ APPENDED              — new header on the right of target
 *        🔴 INSERTED_BETWEEN     — new header in the middle (Relay-breaking)
 *        🔴 RENAMED_OR_REORDERED — same column position, different header
 *        🔴 MISSING_IN_SOURCE    — target has a header source doesn't
 *   3. Runs in DRY_RUN mode by default — only reports, never writes.
 *   4. When DRY_RUN = false and SAFE_TO_WRITE = true, performs additive merge:
 *        - Appends new rows by Person_ID (PERSON_PROFILE / INTAKE_LOG)
 *        - Appends new rows by Role_Pack_ID (TARGET_ROLE_PACK)
 *        - Appends new rows by Role_ID/Ach_ID (CAREER_DETAIL — see note)
 *        - Appends new rows by QA_ID (ADMIN_CONSOLE)
 *      Never deletes, never overwrites existing rows.
 *
 * SCHEMA-POSITION SAFETY
 *   If ANY sheet has 🔴 INSERTED_BETWEEN, 🔴 RENAMED_OR_REORDERED, or
 *   🔴 MISSING_IN_SOURCE, the script will REFUSE to write data, even if
 *   DRY_RUN is set to false. This protects Relay (which references
 *   columns by position, not by header name) from silent breakage.
 *
 *   APPENDED columns are safe — Relay won't see them until you wire it up.
 *
 * KNOWN SCHEMA QUIRK (v3.5)
 *   CAREER_DETAIL has TWO `Role_ID` columns (col B = role-record FK,
 *   col AU = achievement→role FK). The dedup logic uses `_record_type`
 *   (col A) to disambiguate: 'role' rows dedup on col B, 'achievement'
 *   rows dedup on col AT (Ach_ID). Same for `Person_ID` references.
 *
 * HOW TO USE
 *   1. Upload local Career_Vault_v3_5.xlsx to Google Drive.
 *      Right-click → Open with → Google Sheets. This converts it.
 *      Note the new file ID from the URL.
 *   2. Open the LIVE Career Vault sheet (ID 1GN95DkidLCsGVdJaY5sSVQI6kBesTfayHcj4qPB5IAo).
 *   3. Extensions → Apps Script.
 *   4. Paste this entire file. Save.
 *   5. Edit SOURCE_FILE_ID below to the converted local file's ID.
 *   6. Run `compareSchemas()` first. Read the log carefully.
 *   7. If all-green, set DRY_RUN = false and run `syncToLive()`.
 *   8. After confirmed merge, archive the source file.
 *
 * AUTHOR: Sonnet, 2026-04-22
 */

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURATION — EDIT THESE TWO LINES BEFORE RUNNING
// ═══════════════════════════════════════════════════════════════════════

const TARGET_FILE_ID = '1GN95DkidLCsGVdJaY5sSVQI6kBesTfayHcj4qPB5IAo';
const SOURCE_FILE_ID = 'PASTE_LOCAL_FILE_ID_HERE_AFTER_UPLOAD';

// Safety toggles
const DRY_RUN = true;   // true = compare only, no writes. Set to false ONLY after schema check passes.
const VERBOSE_LOG = true; // true = print every column comparison. false = print only mismatches.

// ═══════════════════════════════════════════════════════════════════════
// SHEET-LEVEL CONFIG — dedup keys per sheet
// ═══════════════════════════════════════════════════════════════════════
//
// Each entry: { sheetName, idColumn (1-based), idColumnHeader (for sanity check) }
// CAREER_DETAIL handled specially below because of the dual-key problem.

const SHEET_DEDUP_CONFIG = [
  { sheetName: 'PERSON_PROFILE',   idColumn: 1, idColumnHeader: 'Person_ID' },
  { sheetName: 'TARGET_ROLE_PACK', idColumn: 1, idColumnHeader: 'Role_Pack_ID' },
  { sheetName: 'OUTPUT_LOG',       idColumn: 1, idColumnHeader: 'build_id' },
  { sheetName: 'ADMIN_CONSOLE',    idColumn: 6, idColumnHeader: 'QA_ID' },
  { sheetName: 'INTAKE_LOG',       idColumn: 1, idColumnHeader: 'intake_id' },
  // CAREER_DETAIL handled by syncCareerDetail() — uses _record_type to pick key
  // KEY sheet skipped — schema doc only, hand-edited
];

const SKIP_SHEETS = ['KEY']; // documentation, not data

// ═══════════════════════════════════════════════════════════════════════
// MAIN ENTRY POINTS — RUN THESE FROM THE APPS SCRIPT EDITOR
// ═══════════════════════════════════════════════════════════════════════

/**
 * STEP 1: Run this first. Compares headers between source and target,
 * reports any schema drift. Never writes.
 */
function compareSchemas() {
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log('CAREER VAULT v3.5 — SCHEMA COMPARISON');
  Logger.log('Source: ' + SOURCE_FILE_ID);
  Logger.log('Target: ' + TARGET_FILE_ID);
  Logger.log('═══════════════════════════════════════════════════════════\n');

  const result = doSchemaComparison_();

  Logger.log('\n═══════════════════════════════════════════════════════════');
  Logger.log('SUMMARY');
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log('Sheets checked:        ' + result.sheetsChecked);
  Logger.log('Sheets schema-clean:   ' + result.sheetsClean);
  Logger.log('Sheets with appended:  ' + result.sheetsAppended);
  Logger.log('Sheets BLOCKING:       ' + result.sheetsBlocking);
  Logger.log('');
  if (result.sheetsBlocking > 0) {
    Logger.log('🔴 DO NOT RUN syncToLive(). Schema drift detected.');
    Logger.log('   Either revert the source schema or update the target sheet manually.');
    Logger.log('   Then re-run compareSchemas().');
  } else if (result.sheetsAppended > 0) {
    Logger.log('⚠ APPENDED columns detected. Safe to add to target if you want them.');
    Logger.log('   Sync will work either way. Decide whether Relay needs the new fields.');
    Logger.log('   When ready, set DRY_RUN = false and run syncToLive().');
  } else {
    Logger.log('✓ Schemas match exactly. Safe to run syncToLive().');
  }
}

/**
 * STEP 2: Run this only after compareSchemas() returns no blocking items
 * AND you've set DRY_RUN = false.
 */
function syncToLive() {
  if (DRY_RUN) {
    Logger.log('🛑 DRY_RUN is true. Set DRY_RUN = false in script config to perform real sync.');
    Logger.log('   Running comparison only.');
    compareSchemas();
    return;
  }

  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log('CAREER VAULT v3.5 — LIVE SYNC');
  Logger.log('═══════════════════════════════════════════════════════════\n');

  // Always re-check schema before writing
  const schemaResult = doSchemaComparison_();
  if (schemaResult.sheetsBlocking > 0) {
    Logger.log('🔴 ABORTED. Schema drift detected. No data written.');
    return;
  }

  Logger.log('\n--- Beginning data sync ---\n');

  let totalAppended = 0;
  for (const cfg of SHEET_DEDUP_CONFIG) {
    const appended = syncSheet_(cfg);
    totalAppended += appended;
  }
  // CAREER_DETAIL gets its own handler
  totalAppended += syncCareerDetail_();

  Logger.log('\n═══════════════════════════════════════════════════════════');
  Logger.log('SYNC COMPLETE');
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log('Total rows appended across all sheets: ' + totalAppended);
  Logger.log('');
  Logger.log('Now: spot-check the live sheet, then archive the source file.');
}

// ═══════════════════════════════════════════════════════════════════════
// SCHEMA COMPARISON
// ═══════════════════════════════════════════════════════════════════════

function doSchemaComparison_() {
  const sourceSS = SpreadsheetApp.openById(SOURCE_FILE_ID);
  const targetSS = SpreadsheetApp.openById(TARGET_FILE_ID);

  let sheetsChecked = 0;
  let sheetsClean = 0;
  let sheetsAppended = 0;
  let sheetsBlocking = 0;

  // Get all sheet names from source, in source order
  const sourceSheetNames = sourceSS.getSheets().map(s => s.getName());

  for (const sheetName of sourceSheetNames) {
    if (SKIP_SHEETS.indexOf(sheetName) !== -1) {
      Logger.log('— Skipping ' + sheetName + ' (in SKIP_SHEETS).');
      continue;
    }

    sheetsChecked++;
    const sourceSheet = sourceSS.getSheetByName(sheetName);
    const targetSheet = targetSS.getSheetByName(sheetName);

    Logger.log('\n──────── SHEET: ' + sheetName + ' ────────');

    if (!targetSheet) {
      Logger.log('🔴 BLOCKING: Sheet "' + sheetName + '" exists in source but not target.');
      Logger.log('   Action: create the sheet in target manually with matching headers, then re-run.');
      sheetsBlocking++;
      continue;
    }

    const sourceHeaders = sourceSheet.getRange(1, 1, 1, sourceSheet.getLastColumn()).getValues()[0];
    const targetHeaders = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0];

    Logger.log('Source columns: ' + sourceHeaders.length + '  |  Target columns: ' + targetHeaders.length);

    let blockingFound = false;
    let appendedFound = false;
    const maxLen = Math.max(sourceHeaders.length, targetHeaders.length);

    for (let i = 0; i < maxLen; i++) {
      const colLetter = columnLetter_(i + 1);
      const src = (sourceHeaders[i] || '').toString().trim();
      const tgt = (targetHeaders[i] || '').toString().trim();

      let status, msg;

      if (src === tgt && src !== '') {
        status = '✓ MATCH';
        msg = src;
      } else if (src !== '' && tgt === '') {
        // Source has header, target doesn't
        // Is it on the right edge (appended) or in the middle (inserted_between)?
        const targetHasMoreToRight = targetHeaders.slice(i + 1).some(h => (h || '').toString().trim() !== '');
        if (targetHasMoreToRight) {
          status = '🔴 INSERTED_BETWEEN';
          msg = 'source has "' + src + '" but target col ' + colLetter + ' is empty AND target has more headers to the right';
          blockingFound = true;
        } else if (i >= targetHeaders.length || targetHeaders.slice(i).every(h => (h || '').toString().trim() === '')) {
          status = '⚠ APPENDED';
          msg = 'new column in source: "' + src + '" — append to target if Relay needs it';
          appendedFound = true;
        } else {
          status = '⚠ APPENDED';
          msg = 'new column in source: "' + src + '"';
          appendedFound = true;
        }
      } else if (src === '' && tgt !== '') {
        status = '🔴 MISSING_IN_SOURCE';
        msg = 'target col ' + colLetter + ' has "' + tgt + '" but source col is empty — sync would orphan this column';
        blockingFound = true;
      } else if (src !== tgt && src !== '' && tgt !== '') {
        status = '🔴 RENAMED_OR_REORDERED';
        msg = 'source: "' + src + '"  ≠  target: "' + tgt + '" at col ' + colLetter;
        blockingFound = true;
      } else {
        continue; // both empty
      }

      if (VERBOSE_LOG || status.indexOf('🔴') === 0 || status.indexOf('⚠') === 0) {
        Logger.log('  ' + colLetter.padStart(3) + '  ' + status + '  ' + msg);
      }
    }

    if (blockingFound) {
      sheetsBlocking++;
      Logger.log('  → 🔴 BLOCKING. This sheet has schema drift that will break Relay.');
    } else if (appendedFound) {
      sheetsAppended++;
      Logger.log('  → ⚠ Appended columns only. Safe to sync data; decide on column adoption separately.');
    } else {
      sheetsClean++;
      Logger.log('  → ✓ Schema matches exactly.');
    }
  }

  return { sheetsChecked, sheetsClean, sheetsAppended, sheetsBlocking };
}

// ═══════════════════════════════════════════════════════════════════════
// DATA SYNC — generic handler (additive, ID-based dedup)
// ═══════════════════════════════════════════════════════════════════════

function syncSheet_(cfg) {
  const sourceSS = SpreadsheetApp.openById(SOURCE_FILE_ID);
  const targetSS = SpreadsheetApp.openById(TARGET_FILE_ID);

  const sourceSheet = sourceSS.getSheetByName(cfg.sheetName);
  const targetSheet = targetSS.getSheetByName(cfg.sheetName);
  if (!sourceSheet || !targetSheet) {
    Logger.log('⚠ ' + cfg.sheetName + ': sheet missing on one side. Skipped.');
    return 0;
  }

  // Sanity check: confirm the configured ID column has the expected header
  const targetHeader = targetSheet.getRange(1, cfg.idColumn).getValue();
  if (targetHeader.toString().trim() !== cfg.idColumnHeader) {
    Logger.log('🔴 ' + cfg.sheetName + ': expected header "' + cfg.idColumnHeader + '" at col ' + cfg.idColumn + ' but found "' + targetHeader + '". Skipped.');
    return 0;
  }

  const sourceLastRow = sourceSheet.getLastRow();
  const targetLastRow = targetSheet.getLastRow();
  const sourceLastCol = sourceSheet.getLastColumn();
  const targetLastCol = targetSheet.getLastColumn();

  if (sourceLastRow < 2) {
    Logger.log('— ' + cfg.sheetName + ': source has no data rows. Nothing to sync.');
    return 0;
  }

  // Build set of existing IDs in target (skip header row)
  const existingIds = new Set();
  if (targetLastRow >= 2) {
    const targetIds = targetSheet.getRange(2, cfg.idColumn, targetLastRow - 1, 1).getValues();
    for (const row of targetIds) {
      const id = (row[0] || '').toString().trim();
      if (id) existingIds.add(id);
    }
  }

  // Read source rows
  const sourceData = sourceSheet.getRange(2, 1, sourceLastRow - 1, sourceLastCol).getValues();

  // Filter to only rows whose ID is not already in target AND ID is non-empty
  const rowsToAppend = [];
  for (const row of sourceData) {
    const id = (row[cfg.idColumn - 1] || '').toString().trim();
    if (id && !existingIds.has(id)) {
      // Pad/trim row to match target column count
      const adjustedRow = padOrTrim_(row, targetLastCol);
      rowsToAppend.push(adjustedRow);
    }
  }

  if (rowsToAppend.length === 0) {
    Logger.log('— ' + cfg.sheetName + ': 0 new rows to append. (Source has ' + sourceData.filter(r => r[cfg.idColumn-1]).length + ' rows, all already in target.)');
    return 0;
  }

  // Append in one batch write
  const appendStartRow = targetLastRow + 1;
  targetSheet.getRange(appendStartRow, 1, rowsToAppend.length, targetLastCol).setValues(rowsToAppend);

  Logger.log('✓ ' + cfg.sheetName + ': appended ' + rowsToAppend.length + ' new rows starting at row ' + appendStartRow + '.');
  return rowsToAppend.length;
}

// ═══════════════════════════════════════════════════════════════════════
// CAREER_DETAIL — dual-key handler
// ═══════════════════════════════════════════════════════════════════════
//
// CAREER_DETAIL holds 3 record types in one sheet (per v3.5 design):
//   _record_type = 'role'        → dedup on Role_ID  (col B)
//   _record_type = 'achievement' → dedup on Ach_ID   (col AT, position 46)
//   _record_type = 'skill'       → dedup on Skill_ID (col BZ, position 78)
//   _record_type = 'evidence'    → dedup on Evidence_ID (col CL, position 90)
//
// Without this routing, the generic handler would treat all rows as if
// keyed on col B, and silently lose achievements/skills/evidence rows.

function syncCareerDetail_() {
  const sheetName = 'CAREER_DETAIL';
  const sourceSS = SpreadsheetApp.openById(SOURCE_FILE_ID);
  const targetSS = SpreadsheetApp.openById(TARGET_FILE_ID);

  const sourceSheet = sourceSS.getSheetByName(sheetName);
  const targetSheet = targetSS.getSheetByName(sheetName);
  if (!sourceSheet || !targetSheet) {
    Logger.log('⚠ CAREER_DETAIL: sheet missing. Skipped.');
    return 0;
  }

  // Column positions (1-based) for the four ID columns
  const ID_COLS = {
    'role':        2,   // Role_ID
    'achievement': 46,  // Ach_ID
    'skill':       78,  // Skill_ID
    'evidence':    90   // Evidence_ID
  };

  const sourceLastRow = sourceSheet.getLastRow();
  const targetLastRow = targetSheet.getLastRow();
  const targetLastCol = targetSheet.getLastColumn();

  if (sourceLastRow < 2) {
    Logger.log('— CAREER_DETAIL: source has no data rows.');
    return 0;
  }

  // Build per-type sets of existing IDs in target
  const existingIds = { role: new Set(), achievement: new Set(), skill: new Set(), evidence: new Set() };
  if (targetLastRow >= 2) {
    const targetData = targetSheet.getRange(2, 1, targetLastRow - 1, targetLastCol).getValues();
    for (const row of targetData) {
      const recordType = (row[0] || '').toString().trim().toLowerCase();
      if (existingIds[recordType]) {
        const idCol = ID_COLS[recordType];
        const id = (row[idCol - 1] || '').toString().trim();
        if (id) existingIds[recordType].add(id);
      }
    }
  }

  // Read and filter source
  const sourceData = sourceSheet.getRange(2, 1, sourceLastRow - 1, sourceSheet.getLastColumn()).getValues();
  const rowsToAppend = [];
  let unknownTypeCount = 0;

  for (const row of sourceData) {
    const recordType = (row[0] || '').toString().trim().toLowerCase();
    if (!existingIds[recordType]) {
      if (recordType !== '') unknownTypeCount++;
      continue;
    }
    const idCol = ID_COLS[recordType];
    const id = (row[idCol - 1] || '').toString().trim();
    if (id && !existingIds[recordType].has(id)) {
      rowsToAppend.push(padOrTrim_(row, targetLastCol));
    }
  }

  if (unknownTypeCount > 0) {
    Logger.log('⚠ CAREER_DETAIL: skipped ' + unknownTypeCount + ' row(s) with unknown _record_type.');
  }

  if (rowsToAppend.length === 0) {
    Logger.log('— CAREER_DETAIL: 0 new rows to append.');
    return 0;
  }

  const appendStartRow = targetLastRow + 1;
  targetSheet.getRange(appendStartRow, 1, rowsToAppend.length, targetLastCol).setValues(rowsToAppend);
  Logger.log('✓ CAREER_DETAIL: appended ' + rowsToAppend.length + ' rows starting at row ' + appendStartRow + '.');
  return rowsToAppend.length;
}

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

function columnLetter_(colNum) {
  let s = '';
  while (colNum > 0) {
    const r = (colNum - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    colNum = Math.floor((colNum - 1) / 26);
  }
  return s;
}

function padOrTrim_(row, targetLength) {
  if (row.length === targetLength) return row;
  if (row.length < targetLength) {
    return row.concat(new Array(targetLength - row.length).fill(''));
  }
  return row.slice(0, targetLength);
}
