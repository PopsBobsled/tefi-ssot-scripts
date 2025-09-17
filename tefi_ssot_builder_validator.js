// === TEFI Phase 2 SSOT Builder + Validator ===

const staticSheetName = 'static_registry_master';
const dynamicSheetName = 'dynamic_registry_master';

function buildSSOT() {
  const staticTabs = [
    'field_registry', 'rules_bestpractices_registry', 'forms_registry', 'email_templates_registry',
    'topical_templates_registry', 'ai_prompt_registry', 'deliverables_registry', 'qa_registry',
    'registry_specific_notes', 'tbl_settings', 'docs_master'
  ];
  const dynamicTabs = [
    'campaign_registry', 'trigger_registry', 'tsr_leads_mvp', 'tsr_deals_ee',
    'tsr_deals_fp', 'activity_log', 'ops_sync_log'
  ];

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const staticCols = getAllHeaders(ss, staticTabs);
  const dynamicCols = getAllHeaders(ss, dynamicTabs);

  writeHeader(ss, staticSheetName, staticCols);
  writeHeader(ss, dynamicSheetName, dynamicCols);

  appendRows(ss, staticTabs, staticSheetName, staticCols);
  appendRows(ss, dynamicTabs, dynamicSheetName, dynamicCols);
}

function getAllHeaders(ss, tabNames) {
  const colSet = new Set();
  tabNames.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return;
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    headers.forEach(h => colSet.add(h));
  });
  return Array.from(colSet);
}

function writeHeader(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet(sheetName);
  sheet.appendRow(headers);
}

function appendRows(ss, sourceTabs, targetSheetName, targetCols) {
  const targetSheet = ss.getSheetByName(targetSheetName);
  sourceTabs.forEach(tab => {
    const sheet = ss.getSheetByName(tab);
    if (!sheet) return;
    const sourceData = sheet.getDataRange().getValues();
    const sourceHeaders = sourceData.shift();
    const colMap = targetCols.map(col => sourceHeaders.indexOf(col));

    sourceData.forEach(row => {
      const newRow = colMap.map(i => (i !== -1 ? row[i] : '--'));
      targetSheet.appendRow(newRow);
    });
  });
}

// === Phase 3 Validator ===
function validateSSOTCounts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const tabGroups = {
    static: [
      'field_registry', 'rules_bestpractices_registry', 'forms_registry', 'email_templates_registry',
      'topical_templates_registry', 'ai_prompt_registry', 'deliverables_registry', 'qa_registry',
      'registry_specific_notes', 'tbl_settings', 'docs_master'
    ],
    dynamic: [
      'campaign_registry', 'trigger_registry', 'tsr_leads_mvp', 'tsr_deals_ee',
      'tsr_deals_fp', 'activity_log', 'ops_sync_log'
    ]
  };

  const masterTabs = {
    static: 'static_registry_master',
    dynamic: 'dynamic_registry_master'
  };

  Object.keys(tabGroups).forEach(group => {
    const sourceTabs = tabGroups[group];
    const masterSheet = ss.getSheetByName(masterTabs[group]);
    const masterRowCount = masterSheet.getLastRow() - 1; // exclude header

    let sourceRowCount = 0;
    sourceTabs.forEach(name => {
      const sheet = ss.getSheetByName(name);
      if (sheet) sourceRowCount += (sheet.getLastRow() - 1);
    });

    Logger.log(`${group.toUpperCase()} → Source Rows: ${sourceRowCount}, Master Rows: ${masterRowCount}`);
  });
}

// === Custom Menu ===
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('TEFI SSOT')
    .addItem('Build Master Tables', 'buildSSOT')
    .addItem('Validate Row Counts', 'validateSSOTCounts')
    .addToUi();
}
