/**
 * SheetToZoho_Migration_AppsScript.gs
 *
 * Step 15 — One-time Leads Registry → Zoho CRM Lead migration
 *
 * WHAT IT DOES:
 *   Reads all rows from the Leads Registry Google Sheet.
 *   For each unique email: upserts the lead into Zoho CRM Leads module
 *   (creates if not yet in Zoho, enriches fields if already exists).
 *   Writes Person_ID back to col A once Zoho has it stamped.
 *
 * FIELD MAPPING (sheet → Zoho):
 *   Col C  Full Name       → First_Name + Last_Name (split on first space)
 *   Col D  Email           → Email  (upsert key — never overwritten)
 *   Col I  Stage           → Lead_Status  (via STAGE_MAP below)
 *   Col L  Source Country  → Mailing_Country
 *   Col M  Primary Role    → Target_Role_Title
 *   Col N  Seniority       → Target_Seniority
 *
 * TWO-STEP PROCESS:
 *   1. migrateSheetToZoho()   — upserts all leads; writes Person_ID to col A for
 *                               records already stamped in Zoho.
 *   2. syncPersonIDsToSheet() — second pass to fill col A for any records where
 *                               the hourly stamper has now run (run ~1 hour later).
 *
 * SETUP (one-time):
 *   1. Open the Leads Registry sheet → Extensions → Apps Script
 *   2. Paste this entire file (replace any existing code)
 *   3. Project Settings → Script Properties → add 3 values:
 *        ZOHO_CLIENT_ID     = (same value used in PersonID_Stamper)
 *        ZOHO_CLIENT_SECRET = (same value used in PersonID_Stamper)
 *        ZOHO_REFRESH_TOKEN = (same value used in PersonID_Stamper)
 *   4. Save (Ctrl+S)
 *   5. Select migrateSheetToZoho in the function dropdown → Run
 *      (DRY_RUN = true — logs what would happen, no writes)
 *   6. Review the log. If it looks right, change DRY_RUN to false → Run again.
 *   7. After ~1 hour (once the hourly stamper has run), run syncPersonIDsToSheet()
 *      to fill any remaining blank Person_ID cells in col A.
 *
 * SAFE TO RE-RUN:
 *   - Rows with no email are skipped
 *   - Deduplication: one upsert per unique email (prefers row with W1 Sent Date set)
 *   - Upsert is email-keyed — Zoho will never create duplicates
 *   - col A is only written when Zoho has a non-blank Person_ID
 *
 * Author: Claude (Anthropic) for TEFI — 2026-05-01
 * Repo:   github.com/PopsBobsled/tefi-ssot-scripts  (02_apps_scripts/)
 */

// ============================================================
// CONFIGURATION
// ============================================================

var CONFIG = {
  ZOHO_ACCOUNTS_URL:  'https://accounts.zoho.com.au',  // AU data centre
  ZOHO_API_URL:       'https://www.zohoapis.com.au',    // AU data centre
  DRY_RUN:            false,    // live — writing to Zoho
  LOG_PREFIX:         '[TEFI-MIGRATE]',
  SHEET_TAB:          null,     // null = first tab; set to exact tab name string if needed
  HEADER_ROW:         1,        // row number of the header row (1-indexed)

  // Column indices (0-based: A=0, B=1, C=2, ...)
  COL: {
    PERSON_ID:      0,   // A — write Person_ID back here
    DATE_RECEIVED:  1,   // B
    FULL_NAME:      2,   // C
    EMAIL:          3,   // D
    W1_SENT_DATE:   5,   // F — used to prefer rows that have W1 sent
    STAGE:          8,   // I
    SOURCE_COUNTRY: 11,  // L
    PRIMARY_ROLE:   12,  // M
    SENIORITY:      13   // N
  }
};

// Zoho OAuth credential keys — stored in Script Properties
var PROP = {
  CLIENT_ID:     'ZOHO_CLIENT_ID',
  CLIENT_SECRET: 'ZOHO_CLIENT_SECRET',
  REFRESH_TOKEN: 'ZOHO_REFRESH_TOKEN',
  ACCESS_TOKEN:  'ZOHO_ACCESS_TOKEN',
  TOKEN_EXPIRY:  'ZOHO_TOKEN_EXPIRY'
};

// Sheet Stage → Zoho Lead_Status code
// Source: 01_Lead_Lead_Status_to_15.csv (Phase 1.4 Step 2)
var STAGE_MAP = {
  'w1 pending':     'LS_NEW',    // Not Contacted
  'w1 sent':        'LS_T1S',    // T1 Gap Questions Sent
  'reply received': 'LS_QR',     // Questions Received
  'w2 pending':     'LS_QR',     // Questions Received (reply in, W2 not yet sent)
  'w2 sent':        'LS_PM',     // Post-Meeting / Follow-Up
  'complete':       'LS_CONV'    // Converted
};

// Sheet Seniority → Zoho Target_Seniority picklist
var SENIORITY_MAP = {
  'junior':    'Entry',
  'mid':       'Mid',
  'senior':    'Senior',
  'manager':   'Manager',
  'director':  'Director',
  'executive': 'Executive',
  'c-suite':   'C-Suite'
};

// ============================================================
// MAIN ENTRY POINTS
// ============================================================

/**
 * Step 1 of 2 — Run this first (DRY_RUN=true to verify, then false to execute).
 * Upserts every unique-email lead into Zoho.
 * Writes Person_ID back to col A for any records already stamped in Zoho.
 */
function migrateSheetToZoho() {
  var start = Date.now();
  Logger.log(CONFIG.LOG_PREFIX + ' === migrateSheetToZoho START (DRY_RUN=' + CONFIG.DRY_RUN + ') ===');

  var sheet  = _getSheet();
  var data   = sheet.getDataRange().getValues();

  // Collect rows with a valid email address
  var rows = [];
  for (var i = CONFIG.HEADER_ROW; i < data.length; i++) {
    var email = String(data[i][CONFIG.COL.EMAIL] || '').trim().toLowerCase();
    if (email && email.indexOf('@') >= 0) {
      rows.push({ rowIndex: i, row: data[i], email: email });
    }
  }
  Logger.log(CONFIG.LOG_PREFIX + ' Rows with valid email: ' + rows.length);

  // Deduplicate: one entry per email — prefer the row with W1 Sent Date set
  var byEmail = {};
  rows.forEach(function(r) {
    var existing = byEmail[r.email];
    if (!existing) {
      byEmail[r.email] = r;
    } else {
      var hasW1    = !!r.row[CONFIG.COL.W1_SENT_DATE];
      var hadW1    = !!existing.row[CONFIG.COL.W1_SENT_DATE];
      if (hasW1 && !hadW1) byEmail[r.email] = r;
    }
  });

  var unique = Object.keys(byEmail).map(function(k) { return byEmail[k]; });
  Logger.log(CONFIG.LOG_PREFIX + ' Unique emails to process: ' + unique.length);

  var inserted = 0, updated = 0, skipped = 0, errors = 0;

  unique.forEach(function(entry) {
    try {
      var result = _processRow(entry.row, entry.rowIndex, sheet);
      if (result === 'insert') inserted++;
      else if (result === 'update') updated++;
      else skipped++;
    } catch (e) {
      errors++;
      Logger.log(CONFIG.LOG_PREFIX + ' ERROR row ' + (entry.rowIndex + 1) +
                 ' (' + entry.email + '): ' + e.message);
    }
  });

  var elapsed = ((Date.now() - start) / 1000).toFixed(1);
  Logger.log(CONFIG.LOG_PREFIX +
    ' === DONE in ' + elapsed + 's' +
    ' | inserted=' + inserted +
    ' | updated=' + updated +
    ' | skipped=' + skipped +
    ' | errors=' + errors + ' ===');
}

/**
 * Step 2 of 2 — Run ~1 hour after migrateSheetToZoho() once the hourly
 * Person_ID stamper has had a chance to stamp any newly-created leads.
 * Writes Person_IDs from Zoho into col A for any rows still blank.
 */
function syncPersonIDsToSheet() {
  Logger.log(CONFIG.LOG_PREFIX + ' === syncPersonIDsToSheet START (DRY_RUN=' + CONFIG.DRY_RUN + ') ===');

  var sheet  = _getSheet();
  var data   = sheet.getDataRange().getValues();
  var written = 0, notFound = 0, noIdYet = 0, alreadySet = 0;

  for (var i = CONFIG.HEADER_ROW; i < data.length; i++) {
    var email    = String(data[i][CONFIG.COL.EMAIL] || '').trim().toLowerCase();
    var personId = String(data[i][CONFIG.COL.PERSON_ID] || '').trim();

    if (!email || email.indexOf('@') < 0) continue;
    if (personId) { alreadySet++; continue; }  // col A already has value

    var lead = _getLeadByEmail(email);
    if (!lead) {
      notFound++;
      Logger.log(CONFIG.LOG_PREFIX + ' NOT IN ZOHO: ' + email);
      continue;
    }

    var zId = (lead.Person_ID || '').trim();
    if (!zId) {
      noIdYet++;
      Logger.log(CONFIG.LOG_PREFIX + ' WAITING FOR STAMP: ' + email +
                 ' (stamper not yet run?)');
      continue;
    }

    if (!CONFIG.DRY_RUN) {
      sheet.getRange(i + 1, CONFIG.COL.PERSON_ID + 1).setValue(zId);
    }
    Logger.log(CONFIG.LOG_PREFIX + (CONFIG.DRY_RUN ? ' DRY ' : ' ') +
               'SYNC col A row ' + (i + 1) + ': ' + email + ' → ' + zId);
    written++;
  }

  Logger.log(CONFIG.LOG_PREFIX +
    ' === SYNC DONE' +
    ' | written=' + written +
    ' | notFound=' + notFound +
    ' | waitingForStamp=' + noIdYet +
    ' | alreadySet=' + alreadySet + ' ===');
}

// ============================================================
// CORE ROW PROCESSING
// ============================================================

function _processRow(row, rowIndex, sheet) {
  var fullName      = String(row[CONFIG.COL.FULL_NAME]      || '').trim();
  var email         = String(row[CONFIG.COL.EMAIL]          || '').trim();
  var stage         = String(row[CONFIG.COL.STAGE]          || '').trim();
  var sourceCountry = String(row[CONFIG.COL.SOURCE_COUNTRY] || '').trim();
  var primaryRole   = String(row[CONFIG.COL.PRIMARY_ROLE]   || '').trim();
  var seniority     = String(row[CONFIG.COL.SENIORITY]      || '').trim();

  var name    = _splitName(fullName);
  var payload = { First_Name: name.first, Last_Name: name.last, Email: email };

  if (stage) {
    payload.Lead_Status = _mapStage(stage);
  }
  if (sourceCountry) {
    payload.Mailing_Country = sourceCountry;
  }
  if (primaryRole) {
    payload.Target_Role_Title = primaryRole;
  }
  if (seniority) {
    var mappedSeniority = _mapSeniority(seniority);
    if (mappedSeniority) payload.Target_Seniority = mappedSeniority;
  }

  if (CONFIG.DRY_RUN) {
    Logger.log(CONFIG.LOG_PREFIX + ' DRY UPSERT row ' + (rowIndex + 1) +
               ': ' + email + ' → ' + JSON.stringify(payload));
    return 'update';
  }

  var result  = _upsertLead(payload);
  var action  = result.action;   // 'insert' or 'update'
  var zohoId  = result.id;

  Logger.log(CONFIG.LOG_PREFIX + ' ' + action.toUpperCase() +
             ' row ' + (rowIndex + 1) + ': ' + email + ' | zohoId=' + zohoId);

  // Try to write Person_ID back to col A immediately
  var lead    = _getLeadById(zohoId);
  var zPersonId = lead ? (lead.Person_ID || '').trim() : '';
  if (zPersonId) {
    sheet.getRange(rowIndex + 1, CONFIG.COL.PERSON_ID + 1).setValue(zPersonId);
    Logger.log(CONFIG.LOG_PREFIX + ' Wrote Person_ID=' + zPersonId +
               ' → row ' + (rowIndex + 1) + ' col A');
  } else {
    Logger.log(CONFIG.LOG_PREFIX + ' Person_ID not yet stamped for ' + email +
               ' — run syncPersonIDsToSheet() in ~1 hour');
  }

  return action;
}

// ============================================================
// FIELD MAPPING HELPERS
// ============================================================

/**
 * Split "Maria Rosario Leuterio" → { first: "Maria", last: "Rosario Leuterio" }
 * Single-word names → { first: "", last: "Lasono" }
 */
function _splitName(fullName) {
  var parts = fullName.trim().split(/\s+/).filter(function(p) { return p !== ''; });
  if (parts.length === 0)  return { first: '', last: 'Unknown' };
  if (parts.length === 1)  return { first: '', last: parts[0] };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

/** Map sheet Stage value to Zoho Lead_Status code. */
function _mapStage(stage) {
  return STAGE_MAP[stage.toLowerCase().trim()] || 'LS_NEW';
}

/** Map sheet Seniority to Zoho Target_Seniority picklist value. Returns null if no match. */
function _mapSeniority(seniority) {
  return SENIORITY_MAP[seniority.toLowerCase().trim()] || null;
}

// ============================================================
// ZOHO API CALLS
// ============================================================

/**
 * Upsert a single lead.
 * Returns { action: 'insert'|'update', id: zohoRecordId }
 */
function _upsertLead(payload) {
  var token   = _getAccessToken();
  var url     = CONFIG.ZOHO_API_URL + '/crm/v3/Leads/upsert';
  var body    = {
    data:                  [payload],
    duplicate_check_fields: ['Email']
  };

  var options = {
    method:             'post',
    contentType:        'application/json',
    headers:            { 'Authorization': 'Zoho-oauthtoken ' + token },
    payload:            JSON.stringify(body),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var code     = response.getResponseCode();

  if (code !== 200 && code !== 201) {
    throw new Error('Upsert failed (' + code + '): ' +
                    response.getContentText().substring(0, 300));
  }

  var parsed = JSON.parse(response.getContentText());
  var item   = parsed.data && parsed.data[0];
  if (!item || item.code !== 'SUCCESS') {
    throw new Error('Upsert non-success: ' + JSON.stringify(item));
  }

  return { action: item.action.toLowerCase(), id: item.details.id };
}

/**
 * Search for a Lead by email. Returns the first match, or null if not found.
 */
function _getLeadByEmail(email) {
  var token   = _getAccessToken();
  var url     = CONFIG.ZOHO_API_URL + '/crm/v3/Leads/search' +
                '?criteria=(Email:equals:' + encodeURIComponent(email) + ')' +
                '&fields=id,Email,Person_ID';

  var options = {
    method:             'get',
    headers:            { 'Authorization': 'Zoho-oauthtoken ' + token },
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var code     = response.getResponseCode();
  if (code === 204) return null;
  if (code !== 200) {
    throw new Error('Search failed (' + code + '): ' +
                    response.getContentText().substring(0, 300));
  }

  var parsed = JSON.parse(response.getContentText());
  return (parsed.data && parsed.data[0]) ? parsed.data[0] : null;
}

/**
 * Fetch a Lead by its Zoho record ID. Returns the record, or null.
 */
function _getLeadById(id) {
  var token   = _getAccessToken();
  var url     = CONFIG.ZOHO_API_URL + '/crm/v3/Leads/' + id +
                '?fields=id,Email,Person_ID';

  var options = {
    method:             'get',
    headers:            { 'Authorization': 'Zoho-oauthtoken ' + token },
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var code     = response.getResponseCode();
  if (code === 204) return null;
  if (code !== 200) {
    throw new Error('GetById failed (' + code + '): ' +
                    response.getContentText().substring(0, 300));
  }

  var parsed = JSON.parse(response.getContentText());
  return (parsed.data && parsed.data[0]) ? parsed.data[0] : null;
}

// ============================================================
// OAUTH TOKEN MANAGEMENT
// In-memory cache — token refreshed once per execution run.
// ============================================================

var _TOKEN_CACHE_ = { token: null, expiry: 0 };

function _getAccessToken() {
  // Return in-memory cached token if still valid (60-second buffer)
  if (_TOKEN_CACHE_.token && Date.now() < _TOKEN_CACHE_.expiry - 60000) {
    return _TOKEN_CACHE_.token;
  }

  var props        = PropertiesService.getScriptProperties();
  var clientId     = props.getProperty(PROP.CLIENT_ID);
  var clientSecret = props.getProperty(PROP.CLIENT_SECRET);
  var refreshToken = props.getProperty(PROP.REFRESH_TOKEN);

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Credentials not configured. Add ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ' +
      'ZOHO_REFRESH_TOKEN to Script Properties (Project Settings → Script Properties).'
    );
  }

  var url    = CONFIG.ZOHO_ACCOUNTS_URL + '/oauth/v2/token';
  var params = 'grant_type=refresh_token' +
               '&client_id='     + encodeURIComponent(clientId) +
               '&client_secret=' + encodeURIComponent(clientSecret) +
               '&refresh_token=' + encodeURIComponent(refreshToken);

  var response = UrlFetchApp.fetch(url, {
    method:             'post',
    contentType:        'application/x-www-form-urlencoded',
    payload:            params,
    muteHttpExceptions: true
  });

  var raw = response.getContentText();

  if (response.getResponseCode() !== 200) {
    throw new Error('Token refresh failed (HTTP ' + response.getResponseCode() + '): ' +
                    raw.substring(0, 300));
  }

  var json = JSON.parse(raw);
  if (json.error) {
    throw new Error('Token refresh error: ' + raw.substring(0, 300));
  }

  var accessToken = json.access_token;
  if (!accessToken) {
    throw new Error('Token refresh returned no access_token: ' + raw.substring(0, 300));
  }

  var expiresIn = Number(json.expires_in) || 3600;
  _TOKEN_CACHE_.token  = accessToken;
  _TOKEN_CACHE_.expiry = Date.now() + expiresIn * 1000;

  Logger.log(CONFIG.LOG_PREFIX + ' Access token refreshed (expires in ' + expiresIn + 's)');
  return accessToken;
}

// ============================================================
// CREDENTIAL DEBUG (run once to verify Script Properties are set correctly)
// ============================================================

/**
 * Run this function once to verify credentials are loaded.
 * Logs the length of each credential (not the value) and attempts a token refresh.
 * Compare lengths against the values in PersonID Stamper's Script Properties.
 */
function debugCredentials() {
  var props        = PropertiesService.getScriptProperties();
  var clientId     = props.getProperty('ZOHO_CLIENT_ID')     || '';
  var clientSecret = props.getProperty('ZOHO_CLIENT_SECRET') || '';
  var refreshToken = props.getProperty('ZOHO_REFRESH_TOKEN') || '';

  Logger.log('ZOHO_CLIENT_ID     : length=' + clientId.length     + ' | first4=' + clientId.substring(0,4));
  Logger.log('ZOHO_CLIENT_SECRET : length=' + clientSecret.length  + ' | first4=' + clientSecret.substring(0,4));
  Logger.log('ZOHO_REFRESH_TOKEN : length=' + refreshToken.length  + ' | first4=' + refreshToken.substring(0,4));

  if (!clientId || !clientSecret || !refreshToken) {
    Logger.log('ERROR: One or more credentials are BLANK. Re-check Script Properties.');
    return;
  }

  Logger.log('Attempting token refresh...');
  try {
    var token = _getAccessToken();
    Logger.log('SUCCESS: token length=' + token.length);
  } catch (e) {
    Logger.log('FAILED: ' + e.message);
  }
}

// ============================================================
// UTILITIES
// ============================================================

function _getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return CONFIG.SHEET_TAB ? ss.getSheetByName(CONFIG.SHEET_TAB) : ss.getSheets()[0];
}
