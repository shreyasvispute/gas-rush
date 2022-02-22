const mongoCollections = require("../config/mongoCollections");
const gasPricesDB = mongoCollections.gasPricesDB;
const axios = require("axios");
const validations = require("./errorHandling");
require("dotenv").config();
const logger = require("../utils/logger");

const POLLTIME = process.env.POLLTIME || 15000;
const apiKey = process.env.APIKEY;
const apiURL = process.env.APIURL;

const url = apiURL + apiKey;

async function getGasData() {
  if (!apiKey) {
    logger.error("appData, getGasData(), Please provide API key");
    throw {
      statusCode: 400,
      message: "Please provide API key",
    };
  }
  if (!apiURL) {
    logger.error("appData, getGasData(), Please provide Etherscan API URL");

    throw {
      statusCode: 400,
      message: "Please provide Etherscan API URL",
    };
  }
  const { data } = await axios.get(url).catch(function (e) {
    logger.error("appData, getGasData(), Data connection error " + e.response);
    throw {
      statusCode: 500,
      message: "Error: Data connection error " + e.response,
    };
  });

  return data;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function storeGasPrices() {
  const data = await getGasData();

  let gasData = {
    fast: Number(data.result.FastGasPrice),
    slow: Number(data.result.SafeGasPrice),
    average: Number(data.result.ProposeGasPrice),
    blockNum: Number(data.result.LastBlock),
    lastUpdatedAt: Math.floor(Date.now() / 1000),
  };

  const dbCollection = await gasPricesDB();

  const result = await dbCollection.insertOne(gasData);

  if (POLLTIME < 1000) {
    logger.error(
      "appData, storeGasPrices, Please set the polling time greater that 1 second"
    );
    throw {
      statusCode: 500,
      message: "Please set the polling time greater that 1 second",
    };
  }

  await delay(POLLTIME);

  if (result.insertedId) {
    await storeGasPrices();
  } else {
    logger.error(
      "appData, storeGasPrices(), Polling error while ingesting gas data"
    );

    throw {
      statusCode: 500,
      message: "Polling error while ingesting gas data",
    };
  }
}

async function getGas() {
  const data = await getGasData();

  let gasData = {
    fast: Number(data.result.FastGasPrice),
    slow: Number(data.result.SafeGasPrice),
    average: Number(data.result.ProposeGasPrice),
    blockNum: Number(data.result.LastBlock),
  };

  return gasData;
}

async function getGasAverage(fromTime, toTime = validations.checkParameters()) {
  validations.validateTime(fromTime, toTime);
  await checkDatesInDB(fromTime, toTime);

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
    logger.error(
      `appData, getGasAverage(), No data found from :${fromTime} to :${toTime}`
    );

    result = `No data found from :${fromTime} to :${toTime}`;
  }
  return result;
}

async function checkDatesInDB(fromTime, toTime) {
  const dbCollection = await gasPricesDB();

  const checkFromTime = await dbCollection.findOne({
    lastUpdatedAt: fromTime,
  });
  const checkToTime = await dbCollection.findOne({
    lastUpdatedAt: toTime,
  });

  if (!checkFromTime) {
    throw {
      statusCode: 404,
      message: "from date not found",
    };
  }
  if (!checkToTime) {
    throw {
      statusCode: 404,
      message: "to date not found",
    };
  }
}

function average(data) {
  const averageETHPrices = data
    .filter((j) => j.average > 0)
    .map((i) => i.average);
  return averageETHPrices.reduce((a, v) => a + v) / averageETHPrices.length;
}

module.exports = { getGas, getGasAverage, storeGasPrices };
