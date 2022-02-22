const express = require("express");
const gasData = require("./data/appData");
const logger = require("./utils/logger");
require("dotenv").config();

const port = process.env.PORT || 3001;

const app = express();

const configRoutes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//logging middleware for URL requests
app.use(function (req, res, next) {
  logger.info(req.method + " " + req.originalUrl);
  next();
});

configRoutes(app);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  logger.info(`Server started at http://localhost:${port}/`);
  logger.info("Polling started");
  gasData.storeGasPrices().catch(function (e) {
    console.log(
      "Please set the polling time greater that 1 second, Polling stopped!"
    );
    logger.error(
      "appData, storeGasPrices, Please set the polling time greater that 1 second"
    );
    return;
  });
});
