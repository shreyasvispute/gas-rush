//MongoDB connection file, initiates the connection by accessing
//MONGODB_URL and MONGODB_DB name from env variables.
//exports connection object

const logger = require("../utils/logger");

const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const db_URL = process.env.MONGODB_URL;
const db_name = process.env.MONGODB_DB;

if (!db_URL || !db_name) {
  logger.error("400 - DB name or DB url not found");
  throw {
    statusCode: 400,
    message: "DB name or DB url not found",
  };
}

let _connection = undefined;
let _db = undefined;

let mongoConnection = async () => {
  //lets you use only a single instance
  if (!_connection) {
    _connection = await MongoClient.connect(db_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    _db = await _connection.db(db_name);
  }
  return { _db, _connection };
};

module.exports = mongoConnection;
