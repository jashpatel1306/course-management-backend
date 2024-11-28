var fs = require("fs");
var XLSX = require("xlsx");

// callback function for parsing data from file
function handleWorkbook(workbook) {
  const sheetNames = workbook.SheetNames;
  const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
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
    // Get the excel file from the request
    const myStream = req.files.excelFile;
    // Process the excel sheet data using the processSheet and handleWorkbook functions
    const processedData = processSheet(myStream.data, handleWorkbook);
    console.log("processedData: ", processedData);
    // If no data is processed, return an error response
    if (!processedData) {
      return res.status(500).send({
        status: false,
        message: "Error processing the sheet, please try again.",
        data: []
      });
    }

    // Set the processed data in the request body
    req.body.excelData = processedData;
    // req.body = {
    //   ...req.body,
    //   data: {
    //     ...req.body.data,
    //     excelData: processedData,
    //   },
    // };
    const batchId = JSON.parse(req.body.data).batchId;
    const collegeId = JSON.parse(req.body.data).collegeId;
    req.body = {
      data: JSON.stringify({
        batchId: batchId,
        collegeId: collegeId,
        college_id: req.body.college_id,
        user_id: req.body.user_id,
        excelData: processedData
      })
    };
    console.log("========================= req.body  req.body: ", req.body);

    // Call the next middleware function
    next();
  } catch (err) {
    // Log the error and return an error response
    console.error(err);
    return res.status(500).send({
      status: false,
      message: "Error processing the sheet, please try again.",
      data: []
    });
  }
};
module.exports.handleExcelQuestionData = async (req, res, next) => {
  try {
    // Get the excel file from the request
    const myStream = req.files.excelFile;
    // Process the excel sheet data using the processSheet and handleWorkbook functions
    const processedData = processSheet(myStream.data, handleWorkbook);
    // console.log("processedData: ", processedData);
    // If no data is processed, return an error response
    if (!processedData) {
      return res.status(500).send({
        status: false,
        message: "Error processing the sheet, please try again.",
        data: []
      });
    }

    // Set the processed data in the request body
    req.body.excelData = processedData;

    // req.body = {
    //   data: JSON.stringify({
    //     excelData: processedData,
    //   }),
    // };
    console.log("req.body: ", req.body);
    req.body = {
      data: JSON.stringify({
        quizId: req.body.data
          ? JSON.parse(req.body.data)?.quizId
          : req.body.quizId,
        excelData: processedData
      })
    };

    next();
  } catch (err) {
    // Log the error and return an error response
    console.error(err);
    return res.status(500).send({
      status: false,
      message: "Error processing the sheet, please try again.",
      data: []
    });
  }
};
