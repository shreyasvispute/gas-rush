const mongoCollections = require("../config/mongoCollections");
const gasPricesDB = mongoCollections.gasPricesDB;
const axios = require("axios");
const moment = require("moment");

const url =
  "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=MP5CK3ZU9VI1Y81SBGRM9B58CCU599VJZ8";

async function getGasData() {
  const { data } = await axios.get(url).catch(function (e) {
    throw {
      statusCode: 500,
      message: "Error: Data connection error " + e.response.data,
    };
  });

  return data;
}

async function getGas() {
  const data = await getGasData();

  let gasData = {
    fast: Number(data.result.FastGasPrice),
    slow: Number(data.result.SafeGasPrice),
    average: Number(data.result.ProposeGasPrice),
    lastUpdatedAt: Math.floor(Date.now() / 1000),
  };

  const dbCollection = await gasPricesDB();

  const insertGasData = await dbCollection.insertOne(gasData);

  if (insertGasData.insertedCount === 0)
    throw { statusCode: 500, message: "Failed to save data" };

  return await dbCollection.findOne({ _id: insertGasData.insertedId });
}

async function getGasAverage(fromTime, toTime = checkParameters()) {
  validateTime(fromTime, toTime);

  const dbCollection = await gasPricesDB();

  const data = await dbCollection
    .find({
      lastUpdatedAt: {
        $gte: fromTime,
        $lte: toTime,
      },
    })
    .toArray();
  let result = {};
  if (data.length > 0) {
    const averageETHPrice = Math.round(average(data));

    result = {
      averageGasPrice: averageETHPrice,
      fromTime: fromTime,
      toTime: toTime,
    };
  } else {
    result = `No data found between fromTime:${fromTime} and toTime:${toTime}`;
  }

  return result;
}

function average(data) {
  const averageETHPrices = data
    .filter((j) => j.average > 0)
    .map((i) => i.average);
  return averageETHPrices.reduce((a, v) => a + v) / averageETHPrices.length;
}

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

module.exports = { getGas, getGasAverage, validateTime };
