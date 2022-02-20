const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const db_URL = process.env.MONGODBURL;
const db_name = process.env.MONGODB_DB;

let _connection = undefined;
let _db = undefined;

if (!db_URL || !db_name) {
  throw {
    statusCode: 400,
    message: "DB name or DB url not found",
  };
}

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(db_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    _db = await _connection.db(db_name);
  }
  return { _db, _connection };
};
