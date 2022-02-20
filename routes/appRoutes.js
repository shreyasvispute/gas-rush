const express = require("express");
const router = express.Router();
const gasData = require("../data/appData");

router.get("/gas", async (req, res) => {
  try {
    const getGasData = await gasData.getGas();
    if (getGasData) {
      res.json({ error: false, message: getGasData });
    }
  } catch (error) {
    if (error.statusCode) {
      res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
      return;
    }
    res.status(500).json({ error: true, message: error });
  }
});

router.get("/average", async (req, res) => {
  if (!req.query.fromTime) {
    res.status(400).json({
      error: true,
      message: "fromTime is required",
    });
    return;
  }

  if (!req.query.toTime) {
    res.status(400).json({
      error: true,
      message: "toTime is reqired",
    });
    return;
  }
  let fromTime = Number(req.query.fromTime);
  let toTime = Number(req.query.toTime);

  try {
    gasData.validateTime(fromTime, toTime);

    const getGasData = await gasData.getGasAverage(fromTime, toTime);
    if (getGasData) {
      res.json({ error: false, message: getGasData });
    }
  } catch (error) {
    if (error.statusCode) {
      res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
      return;
    }
    res.status(500).json({ error: true, message: error });
  }
});

module.exports = router;
