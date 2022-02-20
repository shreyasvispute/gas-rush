const moment = require("moment");

const checkParameters = () => {
  throw { code: 400, error: "Expected arguments not found" };
};

function validateTime(fromTime, toTime) {
  if (isNaN(fromTime)) {
    throw {
      statusCode: 400,
      message:
        "from date should be a number, expecting UNIX timestamp in seconds",
    };
  }
  if (isNaN(toTime)) {
    throw {
      statusCode: 400,
      message:
        "to date should be a number, expecting UNIX timestamp in seconds",
    };
  }

  if (!validateTimestamp(fromTime)) {
    throw {
      statusCode: 400,
      message: "from date is incorrect, expecting UNIX timestamp in seconds",
    };
  }
  if (!validateTimestamp(toTime)) {
    throw {
      statusCode: 400,
      message: "to date is incorrect, expecting UNIX timestamp in seconds",
    };
  }
  if (moment(fromTime).isAfter(toTime)) {
    throw {
      statusCode: 400,
      message: "from date cannot be after to date",
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
