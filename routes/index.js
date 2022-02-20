const appRoutes = require("./appRoutes");

const constructorMethod = (app) => {
  app.use("/", appRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Path Not Found" });
  });
};

module.exports = constructorMethod;
