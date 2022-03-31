//Mongo collection file utility, gets the collections for further operations

const dbConnection = require("./mongoConnections");

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    //creates a single instance
    if (!_col) {
      const db = await dbConnection();
      _col = await db._db.collection(collection);
    }

    return _col;
  };
};

//collection name = ethgas
module.exports = {
  gasPricesDB: getCollectionFn("ethgas"),
};
