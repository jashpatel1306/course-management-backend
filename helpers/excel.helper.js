var fs = require("fs");
var XLSX = require("xlsx");

// callback function for parsing data from file
function handleWorkbook(workbook) {
  const sheetNames = workbook.SheetNames;
  console.log("Sheet Names:", sheetNames);
  const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets["Sheet1"]);
  console.log("Sheet Data:", sheetData);
  if (!sheetData) return false;
  return sheetData;
}

// extract workbooks(sheets) from excel files
function processSheet(stream, cb) {
  var workbook = XLSX.read(stream, { type: "buffer" });
  const jsonData = cb(workbook);

  if (!jsonData) return false;
  return jsonData;
}

/**
 * Middleware function to handle Excel data in the request body
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.handleExcelData = async (req, res, next) => {
  try {
    console.log("req.files.excelFile", req.files);
    // Get the excel file from the request
    const myStream = req.files.excelFile;

    // Process the excel sheet data using the processSheet and handleWorkbook functions
    const processedData = processSheet(myStream.data, handleWorkbook);
    console.log("processedData", processedData);

    // If no data is processed, return an error response
    if (!processedData) {
      return res.status(500).send({
        status: false,
        message: "Error processing the sheet, please try again.",
        data: [],
      });
    }

    // Set the processed data in the request body
    req.body.excelData = processedData;

    // Call the next middleware function
    next();
  } catch (err) {
    // Log the error and return an error response
    console.error(err);
    return res.status(500).send({
      status: false,
      message: "Error processing the sheet, please try again.",
      data: [],
    });
  }
};
