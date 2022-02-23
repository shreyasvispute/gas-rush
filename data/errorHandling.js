//Validation file to check for valid conditions in Routes and Data files

const moment = require("moment");

const checkParameters = () => {
  throw { statusCode: 400, message: "Expected arguments not found" };
};

function validateTime(fromTime, toTime) {
  if (isNaN(fromTime)) {
    throw {
      statusCode: 400,
      message:
        "from time should be a number, expecting UNIX timestamp in seconds",
    };
  }
  if (isNaN(toTime)) {
    throw {
      statusCode: 400,
      message:
        "to time should be a number, expecting UNIX timestamp in seconds",
    };
  }

  if (!validateTimestamp(fromTime)) {
    throw {
      statusCode: 400,
      message: "from time is incorrect, expecting UNIX timestamp in seconds",
    };
  }
  if (!validateTimestamp(toTime)) {
    throw {
      statusCode: 400,
      message: "to time is incorrect, expecting UNIX timestamp in seconds",
    };
  }
  if (moment(fromTime).isAfter(toTime)) {
    throw {
      statusCode: 400,
      message: "from time cannot be after to time",
    };
  }
}

function validateTimestamp(time) {
  var date = moment(time * 1000, "X", true).isValid();
  if (date) {
    return true;
  }
  return false;
}

module.exports = { checkParameters, validateTime };
