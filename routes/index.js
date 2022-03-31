const appRoutes = require("./gasRoutes");

const constructorMethod = (app) => {
  app.use("/", appRoutes); //main(/) routes here...
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Path Not Found" });
  });
};

module.exports = constructorMethod;
