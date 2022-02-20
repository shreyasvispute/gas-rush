const express = require("express");

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

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
