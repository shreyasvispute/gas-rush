const express = require("express");
require("dotenv").config();

const port = process.env.PORT;
const hostname = process.env.HOST;

const app = express();

const configRoutes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//logging middleware
app.use(function (req, res, next) {
  console.log(
    "[" +
      new Date().toUTCString() +
      "]:" +
      " " +
      req.method +
      " " +
      req.originalUrl
  );
  next();
});

configRoutes(app);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
