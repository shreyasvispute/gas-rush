//DB functions to communicate with MongoDB

const mongoCollections = require("../databaseConfig/mongoCollections");
const gasPricesDB = mongoCollections.gasPricesDB;
const axios = require("axios");
const validations = require("./errorHandling");
require("dotenv").config();
const logger = require("../utils/logger");

//POLLTIME from env variable or set polltime to 15s
const POLLTIME = process.env.POLLTIME || 15000;

// get the API key and URL
const apiKey = process.env.APIKEY;
const apiURL = process.env.APIURL;

const url = apiURL + apiKey; //Etherscan URL

//Data function for calling Etherscan URL
//Current Rate limits of Etherscan URL = 5 req/sec on free account

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

//timeout function for API polling
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*  Polling function to poll Etherscan URL every <POLLTIME> ms,
    stores data to DB
    MONGODB EXAMPLE DATA OBJECT STORED IN DB
      "_id": {
        $oid: "6213d4e34cd7cf0372f1a0c9",
      },
      "fast": 183,
      "slow": 182,
      "average": 182,
      "blockNum": 14250934,
      "lastUpdatedAt": 1645466857

    Current Rate limits of Etherscan URL = 5 req/sec on free account, Stops polling if PollTime < 1 sec 
*/
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

// GET /gas API method, returns the current gas prices from the Etherscan URL
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

//GET /average API method, gets the average of from time to time gas price
async function getGasAverage(fromTime, toTime = validations.checkParameters()) {
  validations.validateTime(fromTime, toTime);

  //validate from time || to time exists in DB
  await checkDatesInDB(fromTime, toTime);

  const dbCollection = await gasPricesDB();

  //Mongodb function to get the data
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

//check function to validate if the time provided is in the DB
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
      message: `No data found from :${fromTime} to :${toTime}`,
    };
  }
  if (!checkToTime) {
    throw {
      statusCode: 404,
      message: `No data found from :${fromTime} to :${toTime}`,
    };
  }
}

//average function to calculate the average gas price between to time and from time
function average(data) {
  const averageETHPrices = data
    .filter((j) => j.average > 0)
    .map((i) => i.average);
  return averageETHPrices.reduce((a, v) => a + v) / averageETHPrices.length;
}

module.exports = { getGas, getGasAverage, storeGasPrices, average };
