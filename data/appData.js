const mongoCollections = require("../config/mongoCollections");
const gasPricesDB = mongoCollections.gasPricesDB;
const axios = require("axios");
const validations = require("./errorHandling");
require("dotenv").config();

const apiKey = process.env.APIKEY;
const apiURL = process.env.APIURL;

const url = apiURL + apiKey;

async function getGasData() {
  if (!apiKey) {
    throw {
      statusCode: 400,
      message: "Please provide API key",
    };
  }
  if (!apiURL) {
    throw {
      statusCode: 400,
      message: "Please provide Etherscan API URL",
    };
  }
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
    blockNum: Number(data.result.LastBlock),
    lastUpdatedAt: Math.floor(Date.now() / 1000),
  };

  const dbCollection = await gasPricesDB();

  const insertGasData = await dbCollection.insertOne(gasData);

  if (insertGasData.insertedCount === 0)
    throw { statusCode: 500, message: "Failed to save data" };

  return await dbCollection.findOne({ _id: insertGasData.insertedId });
}

async function getGasAverage(fromTime, toTime = validations.checkParameters()) {
  validations.validateTime(fromTime, toTime);

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
    result = `No data found from :${fromTime} to :${toTime}`;
  }

  return result;
}

function average(data) {
  const averageETHPrices = data
    .filter((j) => j.average > 0)
    .map((i) => i.average);
  return averageETHPrices.reduce((a, v) => a + v) / averageETHPrices.length;
}

module.exports = { getGas, getGasAverage };
