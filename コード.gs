const API_BASE_URL = "https://api.example.org";

function onFormSubmit(e) {
  var sheet = e.range.getSheet();
  var row = e.range.getRow();

  var email = sheet.getRange(row, 2).getValue();
  var mcid = sheet.getRange(row, 3).getValue();
  var reapply = sheet.getRange(row, 4).getValue();

  var lastRow = findLastRowForEmail(sheet, email);
  if (row !== lastRow) return;

  var oldMcid = findPreviousMcid(sheet, email, row);

  if (reapply === "はい") {
    if (oldMcid) callApi(API_BASE_URL + "/whitelist/remove", { "username": oldMcid });
  } else if (oldMcid && oldMcid !== mcid) {
    callApi(API_BASE_URL + "/whitelist/remove", { "username": oldMcid });
  }

  callApi(API_BASE_URL + "/whitelist/add", { "username": mcid });
}

function findLastRowForEmail(sheet, email) {
  var data = sheet.getDataRange().getValues();
  var lastRow = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === email) lastRow = i + 1;
  }
  return lastRow;
}

function findPreviousMcid(sheet, email, currentRow) {
  var data = sheet.getDataRange().getValues();
  var oldMcid = null;
  for (var i = 1; i < currentRow - 1; i++) {
    if (data[i][1] === email) oldMcid = data[i][2];
  }
  return oldMcid;
}

function callApi(url, payload) {
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(url, options);
}