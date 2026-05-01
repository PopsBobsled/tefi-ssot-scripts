/**
 * PersonID_Stamper_AppsScript.gs
 *
 * Step 14 — Person_ID Stamper for TEFI Zoho CRM Leads
 *
 * WHAT IT DOES:
 *   Runs hourly. Finds all Leads in Zoho CRM where Person_ID is blank.
 *   For each Lead, computes TEFI-YYYYMM-emailslug, collision-checks,
 *   then writes Person_ID and Person_ID_Backfilled_At back to Zoho.
 *
 * Person_ID FORMAT:
 *   TEFI-YYYYMM-emailslug          (base, no collision)
 *   TEFI-YYYYMM-emailslug-01       (first collision)
 *   TEFI-YYYYMM-emailslug-02       (second collision)
 *   emailslug = local part of email (before @), lowercased, non-alphanumeric stripped
 *   YYYYMM = Lead's Created_Time month (not today's date)
 *
 * SETUP (one-time, run setupPersonIdStamper() manually):
 *   1. In Zoho API Console, create a Self Client → Scope: ZohoCRM.modules.leads.ALL
 *      Generate a Code (duration: 10 minutes), then exchange for tokens.
 *      You need: client_id, client_secret, refresh_token
 *   2. Open this script in Apps Script editor → Run setupPersonIdStamper()
 *   3. Enter the three values when prompted (stored securely in Script Properties)
 *   4. Run testSingleLead() to verify on one record before enabling the trigger
 *   5. Run installHourlyTrigger() to activate automation
 *
 * ENTRY POINTS:
 *   setupPersonIdStamper()   — one-time credential storage + trigger install
 *   stampUnlabelledLeads()   — main worker (called by hourly trigger)
 *   testSingleLead()         — dry run on one Lead (no writes)
 *   installHourlyTrigger()   — create the time-based trigger
 *   removeHourlyTrigger()    — remove the time-based trigger
 *
 * SAFE TO RE-RUN: idempotent. Already-stamped Leads are skipped by the COQL filter.
 *
 * Author: Claude (Anthropic) for TEFI — 2026-05-01
 * Repo:   github.com/PopsBobsled/tefi-ssot-scripts
 */

// ============================================================
// CONFIGURATION
// ============================================================

var CONFIG = {
  ZOHO_ACCOUNTS_URL:  'https://accounts.zoho.com.au',  // AU data centre
  ZOHO_API_URL:       'https://www.zohoapis.com.au',    // AU data centre
  MODULE:             'Leads',
  PERSON_ID_FIELD:    'Person_ID',
  BACKFILLED_AT_FIELD:'Person_ID_Backfilled_At',
  BATCH_SIZE:         50,      // leads processed per run (keep low to stay inside 6-min Apps Script limit)
  STAMP_AFTER_DATE:   '2026-01-01', // only stamp leads created on or after this date
                                    // legacy dormant leads (pre-2026) excluded intentionally
                                    // backfill of old records is a deliberate future project — see CLAUDE.md 2026-04-25 decision
  DRY_RUN:            false,   // set true to log without writing to Zoho
  LOG_PREFIX:         '[TEFI-STAMP]'
};

// Property keys (stored in Script Properties — never hard-coded here)
var PROP = {
  CLIENT_ID:     'ZOHO_CLIENT_ID',
  CLIENT_SECRET: 'ZOHO_CLIENT_SECRET',
  REFRESH_TOKEN: 'ZOHO_REFRESH_TOKEN',
  ACCESS_TOKEN:  'ZOHO_ACCESS_TOKEN',
  TOKEN_EXPIRY:  'ZOHO_TOKEN_EXPIRY'
};

// ============================================================
// SETUP
// ============================================================

/**
 * One-time setup: store Zoho OAuth credentials in Script Properties.
 * Run this manually in the Apps Script editor.
 */
function setupPersonIdStamper() {
  var ui = SpreadsheetApp.getUi ? SpreadsheetApp.getUi() : null;
  var props = PropertiesService.getScriptProperties();

  var clientId     = _prompt(ui, 'Enter Zoho Client ID (from API Console Self Client):');
  var clientSecret = _prompt(ui, 'Enter Zoho Client Secret:');
  var refreshToken = _prompt(ui, 'Enter Zoho Refresh Token:');

  if (!clientId || !clientSecret || !refreshToken) {
    Logger.log(CONFIG.LOG_PREFIX + ' Setup cancelled — one or more values empty.');
    return;
  }

  props.setProperty(PROP.CLIENT_ID,     clientId.trim());
  props.setProperty(PROP.CLIENT_SECRET, clientSecret.trim());
  props.setProperty(PROP.REFRESH_TOKEN, refreshToken.trim());
  Logger.log(CONFIG.LOG_PREFIX + ' Credentials stored in Script Properties.');

  installHourlyTrigger();
  Logger.log(CONFIG.LOG_PREFIX + ' Setup complete. Run testSingleLead() to verify before first live run.');
}

// ============================================================
// MAIN WORKER
// ============================================================

/**
 * Main entry point — called hourly by time trigger.
 * Finds Leads with blank Person_ID, stamps each one.
 */
function stampUnlabelledLeads() {
  var start = Date.now();
  Logger.log(CONFIG.LOG_PREFIX + ' === stampUnlabelledLeads START ===');

  var leads = _fetchUnstampedLeads();
  Logger.log(CONFIG.LOG_PREFIX + ' Unstamped leads found: ' + leads.length);

  if (leads.length === 0) {
    Logger.log(CONFIG.LOG_PREFIX + ' Nothing to do. Exiting.');
    return;
  }

  var stamped = 0, skipped = 0, errors = 0;

  for (var i = 0; i < leads.length; i++) {
    var lead = leads[i];
    try {
      var result = _processLead(lead);
      if (result === 'stamped')  stamped++;
      if (result === 'skipped')  skipped++;
    } catch (e) {
      errors++;
      Logger.log(CONFIG.LOG_PREFIX + ' ERROR on lead ' + lead.id + ': ' + e.message);
    }
  }

  var elapsed = ((Date.now() - start) / 1000).toFixed(1);
  Logger.log(CONFIG.LOG_PREFIX +
    ' === DONE in ' + elapsed + 's | stamped=' + stamped +
    ' skipped=' + skipped + ' errors=' + errors + ' ===');
}

// ============================================================
// CORE LOGIC
// ============================================================

/**
 * Process a single lead: compute Person_ID, collision-check, write back.
 * Returns 'stamped', 'skipped', or throws on error.
 */
function _processLead(lead) {
  var id    = lead.id;
  var email = (lead.Email || '').trim();
  var createdTime = lead.Created_Time || '';  // ISO8601: "2026-04-15T10:30:00+12:00"

  // Guard: skip if no email (can't compute slug)
  if (!email) {
    Logger.log(CONFIG.LOG_PREFIX + ' SKIP ' + id + ' — no email');
    return 'skipped';
  }

  // Guard: skip if already has Person_ID (shouldn't happen given COQL filter, but be safe)
  if (lead[CONFIG.PERSON_ID_FIELD] && lead[CONFIG.PERSON_ID_FIELD].trim() !== '') {
    Logger.log(CONFIG.LOG_PREFIX + ' SKIP ' + id + ' — already stamped: ' + lead[CONFIG.PERSON_ID_FIELD]);
    return 'skipped';
  }

  // 1. Compute YYYYMM from Created_Time (not today — stamp reflects when lead was created)
  var yyyymm = _extractYYYYMM(createdTime);

  // 2. Build slug from email local part
  var slug = _emailToSlug(email);
  if (!slug) {
    Logger.log(CONFIG.LOG_PREFIX + ' SKIP ' + id + ' — slug empty after cleaning (email: ' + email + ')');
    return 'skipped';
  }

  var baseId = 'TEFI-' + yyyymm + '-' + slug;

  // 3. Collision check
  var personId = _resolveCollision(baseId, id);

  // 4. Write back
  if (CONFIG.DRY_RUN) {
    Logger.log(CONFIG.LOG_PREFIX + ' DRY RUN — would stamp ' + id + ' → ' + personId);
    return 'stamped';
  }

  _writePersonId(id, personId);
  Logger.log(CONFIG.LOG_PREFIX + ' STAMPED ' + id + ' → ' + personId);
  return 'stamped';
}

/**
 * Extract YYYYMM from a Zoho ISO8601 datetime string.
 * Falls back to current month if parsing fails.
 * Example: "2026-04-15T10:30:00+12:00" → "202604"
 */
function _extractYYYYMM(isoString) {
  if (isoString && isoString.length >= 7) {
    // isoString starts with "YYYY-MM-..."
    var year  = isoString.substring(0, 4);
    var month = isoString.substring(5, 7);
    if (/^\d{4}$/.test(year) && /^\d{2}$/.test(month)) {
      return year + month;
    }
  }
  // Fallback: use current month
  var now = new Date();
  var y = now.getFullYear().toString();
  var m = ('0' + (now.getMonth() + 1)).slice(-2);
  Logger.log(CONFIG.LOG_PREFIX + ' WARN: could not parse Created_Time "' + isoString + '", using current month');
  return y + m;
}

/**
 * Convert email to slug: local part, lowercased, non-alphanumeric stripped.
 * "John.Smith+tag@gmail.com" → "johnsmithtag"
 * "user_name-test@domain.nz" → "usernametest"
 */
function _emailToSlug(email) {
  var atIndex = email.indexOf('@');
  var local   = atIndex >= 0 ? email.substring(0, atIndex) : email;
  return local.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Check if baseId (or baseId-NN) already exists in Zoho.
 * Returns the first available Person_ID (no suffix if clear, -01/-02/... if collisions).
 * Uses GET all leads + client-side filter (COQL LIKE is unsupported on custom fields
 * on Zoho Standard plan).
 */
function _resolveCollision(baseId, currentLeadId) {
  var token = _getAccessToken();
  var url = CONFIG.ZOHO_API_URL + '/crm/v3/' + CONFIG.MODULE +
            '?fields=id,' + CONFIG.PERSON_ID_FIELD + '&per_page=200';

  var options = {
    method:             'get',
    headers:            { 'Authorization': 'Zoho-oauthtoken ' + token },
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var code     = response.getResponseCode();

  var all = [];
  if (code === 200) {
    all = JSON.parse(response.getContentText()).data || [];
  } else if (code !== 204) {
    throw new Error('Collision check failed (' + code + '): ' + response.getContentText().substring(0, 300));
  }

  // Filter client-side: records with same base or base-NN, excluding the current lead
  var existing = all.filter(function(r) {
    if (r.id === currentLeadId) return false;
    var pid = r[CONFIG.PERSON_ID_FIELD] || '';
    return pid === baseId || pid.indexOf(baseId + '-') === 0;
  });

  if (existing.length === 0) {
    return baseId;  // No collision — use base
  }

  // Find the lowest unused suffix -01 through -99
  var usedIds = existing.map(function(r) { return r[CONFIG.PERSON_ID_FIELD]; });
  for (var i = 1; i <= 99; i++) {
    var suffix    = ('0' + i).slice(-2);
    var candidate = baseId + '-' + suffix;
    if (usedIds.indexOf(candidate) === -1) {
      return candidate;
    }
  }

  // Extremely unlikely — 99+ collisions on same slug+month
  throw new Error('Could not resolve collision for ' + baseId + ' after 99 attempts');
}

// ============================================================
// ZOHO API CALLS
// ============================================================

/**
 * Fetch Leads where Person_ID is blank.
 * Uses COQL (not GET endpoint) because the GET ?fields= param does not reliably return
 * the Created_Time system field. COQL WHERE Person_ID IS NULL is unsupported for custom
 * fields on Zoho Standard plan, so we SELECT all recent leads and filter client-side.
 */
function _fetchUnstampedLeads() {
  // COQL reliably returns Created_Time; GET endpoint silently omits it.
  // ORDER BY Created_Time DESC → newest leads processed first.
  var query = 'SELECT id, Email, Created_Time, ' + CONFIG.PERSON_ID_FIELD +
              ' FROM ' + CONFIG.MODULE +
              ' ORDER BY Created_Time DESC LIMIT ' + CONFIG.BATCH_SIZE;

  var result = _coqlQuery(query);
  if (!result || !result.data) return [];

  var all = result.data;
  var cutoff = new Date(CONFIG.STAMP_AFTER_DATE).getTime();

  // Filter client-side: blank Person_ID AND created on/after STAMP_AFTER_DATE.
  // Fallback false: if Created_Time is still blank after COQL, skip the record rather
  // than stamping with a wrong YYYYMM. Those records are handled by the backfill project.
  return all.filter(function(lead) {
    var blank = !lead[CONFIG.PERSON_ID_FIELD] || lead[CONFIG.PERSON_ID_FIELD].trim() === '';
    var recent = lead.Created_Time ? new Date(lead.Created_Time).getTime() >= cutoff : false;
    return blank && recent;
  });
}

/**
 * Execute a COQL query against Zoho CRM v3.
 * Returns parsed JSON body, or null if 204 (no records).
 */
function _coqlQuery(query) {
  var token    = _getAccessToken();
  var url      = CONFIG.ZOHO_API_URL + '/crm/v3/coql';
  var payload  = JSON.stringify({ select_query: query });

  var options = {
    method:             'post',
    contentType:        'application/json',
    headers:            { 'Authorization': 'Zoho-oauthtoken ' + token },
    payload:            payload,
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var code     = response.getResponseCode();

  if (code === 204) return null;  // No records

  if (code !== 200) {
    throw new Error('COQL failed (' + code + '): ' + response.getContentText().substring(0, 300));
  }

  return JSON.parse(response.getContentText());
}

/**
 * Write Person_ID (and backfill timestamp) back to a single Lead.
 */
function _writePersonId(leadId, personId) {
  var token    = _getAccessToken();
  var url      = CONFIG.ZOHO_API_URL + '/crm/v3/' + CONFIG.MODULE + '/' + leadId;
  var now      = _zohoDatetime();

  var body = {
    data: [
      {
        id:                                   leadId,
        Person_ID:                            personId,
        Person_ID_Backfilled_At:              now
      }
    ]
  };

  var options = {
    method:             'put',
    contentType:        'application/json',
    headers:            { 'Authorization': 'Zoho-oauthtoken ' + token },
    payload:            JSON.stringify(body),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var code     = response.getResponseCode();

  if (code !== 200) {
    throw new Error('Write failed (' + code + '): ' + response.getContentText().substring(0, 300));
  }

  var parsed = JSON.parse(response.getContentText());
  var status = parsed.data && parsed.data[0] ? parsed.data[0].status : 'unknown';
  if (status !== 'success') {
    throw new Error('Write returned non-success: ' + JSON.stringify(parsed.data[0]));
  }
}

// ============================================================
// OAUTH TOKEN MANAGEMENT
// ============================================================

/**
 * Return a valid Zoho access token.
 * Refreshes automatically when expired (tokens last ~1 hour).
 * Caches token in Script Properties between runs.
 */
function _getAccessToken() {
  var props   = PropertiesService.getScriptProperties();
  var cached  = props.getProperty(PROP.ACCESS_TOKEN);
  var expiry  = parseInt(props.getProperty(PROP.TOKEN_EXPIRY) || '0', 10);

  // Use cached token if still valid (with 60s buffer)
  if (cached && Date.now() < expiry - 60000) {
    return cached;
  }

  // Refresh
  var clientId     = props.getProperty(PROP.CLIENT_ID);
  var clientSecret = props.getProperty(PROP.CLIENT_SECRET);
  var refreshToken = props.getProperty(PROP.REFRESH_TOKEN);

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Zoho credentials not configured. Run setupPersonIdStamper() first.');
  }

  var url = CONFIG.ZOHO_ACCOUNTS_URL + '/oauth/v2/token';
  var params = [
    'grant_type=refresh_token',
    'client_id='     + encodeURIComponent(clientId),
    'client_secret=' + encodeURIComponent(clientSecret),
    'refresh_token=' + encodeURIComponent(refreshToken)
  ].join('&');

  var response = UrlFetchApp.fetch(url, {
    method:             'post',
    contentType:        'application/x-www-form-urlencoded',
    payload:            params,
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) {
    throw new Error('Token refresh failed (' + response.getResponseCode() + '): ' +
                    response.getContentText().substring(0, 300));
  }

  var json        = JSON.parse(response.getContentText());
  var accessToken = json.access_token;
  var expiresIn   = json.expires_in || 3600;  // seconds

  props.setProperty(PROP.ACCESS_TOKEN, accessToken);
  props.setProperty(PROP.TOKEN_EXPIRY,  String(Date.now() + expiresIn * 1000));

  Logger.log(CONFIG.LOG_PREFIX + ' Access token refreshed (expires in ' + expiresIn + 's)');
  return accessToken;
}

// ============================================================
// TRIGGER MANAGEMENT
// ============================================================

/**
 * Install an hourly time-based trigger for stampUnlabelledLeads().
 * Safe to call multiple times — won't duplicate.
 */
function installHourlyTrigger() {
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].getHandlerFunction() === 'stampUnlabelledLeads') {
      Logger.log(CONFIG.LOG_PREFIX + ' Trigger already installed — skipped.');
      return;
    }
  }
  ScriptApp.newTrigger('stampUnlabelledLeads')
    .timeBased()
    .everyHours(1)
    .create();
  Logger.log(CONFIG.LOG_PREFIX + ' Hourly trigger installed for stampUnlabelledLeads().');
}

/**
 * Remove the hourly trigger.
 */
function removeHourlyTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  var removed  = 0;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'stampUnlabelledLeads') {
      ScriptApp.deleteTrigger(triggers[i]);
      removed++;
    }
  }
  Logger.log(CONFIG.LOG_PREFIX + ' Removed ' + removed + ' trigger(s).');
}

// ============================================================
// TESTING
// ============================================================

/**
 * Dry-run test: fetch up to 3 unstamped leads and log what would be written.
 * Does NOT write to Zoho. Use this before enabling the live trigger.
 */
function testSingleLead() {
  Logger.log(CONFIG.LOG_PREFIX + ' === TEST MODE (no writes) ===');

  var origDryRun   = CONFIG.DRY_RUN;
  var origBatch    = CONFIG.BATCH_SIZE;
  CONFIG.DRY_RUN   = true;
  CONFIG.BATCH_SIZE = 3;

  try {
    stampUnlabelledLeads();
  } finally {
    CONFIG.DRY_RUN   = origDryRun;
    CONFIG.BATCH_SIZE = origBatch;
  }

  Logger.log(CONFIG.LOG_PREFIX + ' === TEST COMPLETE — check logs above ===');
}

/**
 * Test the slug logic only (no API calls).
 * Useful to verify email parsing before credential setup.
 */
function testSlugLogic() {
  var cases = [
    ['john.smith@gmail.com',        '202604', 'TEFI-202604-johnsmith'],
    ['John.SMITH@outlook.com',      '202603', 'TEFI-202603-johnsmith'],
    ['user_name-test@domain.nz',    '202605', 'TEFI-202605-usernametest'],
    ['first+last@example.co.nz',    '202601', 'TEFI-202601-firstlast'],
    ['simple@x.com',                '202604', 'TEFI-202604-simple'],
    ['no-at-sign',                  '202604', 'TEFI-202604-noatsign']
  ];

  var pass = 0, fail = 0;
  cases.forEach(function(c) {
    var email    = c[0];
    var yyyymm   = c[1];
    var expected = c[2];
    var slug     = _emailToSlug(email);
    var actual   = 'TEFI-' + yyyymm + '-' + slug;
    var ok       = actual === expected;
    Logger.log((ok ? 'PASS' : 'FAIL') + ' | ' + email + ' → ' + actual +
               (ok ? '' : ' (expected: ' + expected + ')'));
    ok ? pass++ : fail++;
  });
  Logger.log('Slug tests: ' + pass + ' pass, ' + fail + ' fail');
}

// ============================================================
// UTILITIES
// ============================================================

/**
 * Zoho-compatible datetime string: YYYY-MM-DDTHH:mm:ss+HH:mm
 * Zoho rejects the Z-suffix format produced by toISOString() — must use numeric offset.
 */
function _zohoDatetime() {
  var d   = new Date();
  var pad = function(n) { return ('0' + n).slice(-2); };
  var offset = -d.getTimezoneOffset();        // minutes
  var sign   = offset >= 0 ? '+' : '-';
  var oh     = pad(Math.floor(Math.abs(offset) / 60));
  var om     = pad(Math.abs(offset) % 60);
  return d.getFullYear()          + '-' +
         pad(d.getMonth() + 1)    + '-' +
         pad(d.getDate())         + 'T' +
         pad(d.getHours())        + ':' +
         pad(d.getMinutes())      + ':' +
         pad(d.getSeconds())      +
         sign + oh + ':' + om;
}

/**
 * Prompt helper — works both bound (Spreadsheet UI) and unbound (standalone).
 * Unbound scripts fall back to browser prompt().
 */
function _prompt(ui, message) {
  if (ui) {
    var resp = ui.prompt(message);
    return resp.getResponseText();
  }
  // Standalone fallback (Apps Script doesn't support Browser.inputBox in all contexts)
  // You can also set properties manually:
  //   PropertiesService.getScriptProperties().setProperty('ZOHO_CLIENT_ID', 'your_id');
  Logger.log('Cannot prompt in standalone context. Set properties manually.');
  return null;
}
