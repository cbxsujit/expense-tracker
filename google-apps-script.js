function doPost(e) {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName('Expenses');
    
    // Create Expenses sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Expenses');
      sheet.appendRow(['Date', 'Amount', 'Category', 'Description', 'Notes', 'Timestamp']);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Add new expense
    if (data.action === 'add') {
      sheet.appendRow([
        data.date,
        data.amount,
        data.category,
        data.description,
        data.notes || '',
        data.timestamp
      ]);
      return ContentService.createTextOutput(JSON.stringify({success: true}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get recent expenses
    if (data.action === 'getRecent') {
      var range = sheet.getDataRange();
      var values = range.getValues();
      var expenses = [];
      
      // Get last N expenses (skip header row)
      var limit = data.limit || 10;
      for (var i = values.length - 1; i >= 1 && expenses.length < limit; i--) {
        expenses.push({
          date: values[i][0],
          amount: values[i][1],
          category: values[i][2],
          description: values[i][3],
          notes: values[i][4],
          timestamp: values[i][5]
        });
      }
      
      return ContentService.createTextOutput(JSON.stringify({success: true, expenses: expenses}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get all expenses
    if (data.action === 'getAll') {
      var range = sheet.getDataRange();
      var values = range.getValues();
      var expenses = [];
      
      // Skip header row
      for (var i = 1; i < values.length; i++) {
        expenses.push({
          date: values[i][0],
          amount: values[i][1],
          category: values[i][2],
          description: values[i][3],
          notes: values[i][4],
          timestamp: values[i][5]
        });
      }
      
      return ContentService.createTextOutput(JSON.stringify({success: true, expenses: expenses}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return doPost(e);
}
