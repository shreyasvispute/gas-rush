const express = require("express");
const gasData = require("./data/gasData");
const logger = require("./utils/logger");
require("dotenv").config();

const port = process.env.PORT || 3001; //Server PORT
const POLLTIME = process.env.POLLTIME; //PollTime in ms

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
  logger.info("Polling started, PollTime:" + POLLTIME + " ms");
  gasData.storeGasPrices().catch(function (e) {
    if (e.stack) {
      console.log("Error connecting Mongodb: " + e.message);
      logger.error("app.js, app.listen," + e.message);
      return;
    } else {
      // if the POLLTIME is less than 1 second, stop the polling
      console.log(
        "Please set the polling time greater that 1 second, Polling stopped!"
      );
      logger.error(
        "app.js, app.listen, Please set the polling time greater that 1 second, Polling stopped!"
      );
      return;
    }
  });
});
